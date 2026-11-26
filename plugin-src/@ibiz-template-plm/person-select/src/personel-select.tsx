import {
  computed,
  createTextVNode,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  resolveComponent,
  watch,
} from 'vue';
import type { PropType, VNode } from 'vue';
import { isArray } from 'lodash-es';
import { clone } from 'ramda';
import {
  getEditorEmits,
  getDataPickerProps,
  renderString,
  useNamespace,
} from '@ibiz-template/vue3-util';
import { PersonelSelectController } from './personel-select-controller';
import { Util } from './util';
import { VirtualList } from './virtual-list';
import { personSelectText } from './personel-select.locale';

function isVNodeLike(value: unknown): value is VNode {
  return typeof value === 'function' || (typeof value === 'object' && value !== null);
}

export const PersonelSelect = defineComponent({
  name: 'PersonelSelect',
  props: {
    ...getDataPickerProps(),
    controller: {
      type: Object as PropType<PersonelSelectController>,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    overflowMode: {
      type: String,
    },
    controlParams: {
      type: Object,
      required: true,
    },
  },
  emits: getEditorEmits(),
  setup(props, { emit }) {
    const ns = useNamespace('picker-dropdown');
    const ns2 = useNamespace('personel-select');
    const c = props.controller;
    const canEllipsis =
      c.valueType === 'OBJECTS' &&
      (props.overflowMode === 'ellipsis' || !!c.defaultAttentionValue);
    const refValue = ref('');
    const items = ref<IData[]>([]);
    const selectedItems = ref<IData[]>([]);
    const curValue = ref<string | null>(null);
    const valueText = ref('');
    const loading = ref(false);
    const loadFailed = ref(false);
    const isFocus = ref(false);
    const searchValue = ref('');
    const selectedValues = ref<string[]>([]);
    const activeTab = ref<'user' | 'department'>('user');
    const departments = ref<IData[]>([]);
    const popoverVisible = ref(false);
    const showDefault = ref(false);
    const showMore = ref(false);
    const isEditable = ref(false);
    const popoverText = ref('');
    const popoverRef = ref();
    const personelSelRef = ref<HTMLElement>();
    let debounceTimer: number | undefined;
    const rootRef = ref<HTMLElement>();
    const renderCount = ref(0);
    let renderCountTimer: number | undefined;
    const contentHeight = ref(295);
    let loadVersion = 0;

    const showFormDefaultContent = computed(
      () => !!(props.controlParams && props.controlParams.editmode === 'hover'),
    );

    const calcHeight = () => {
      let height = 295;
      if (personelSelRef.value) {
        const rect = personelSelRef.value.getBoundingClientRect();
        const gap = 16;
        const maxHeight = c.enableBottomButton ? 464 : 415;
        const contentHeightWithoutList = maxHeight - height;
        const isTopInsufficient = rect.top < maxHeight + gap;
        const isBottomInsufficient =
          window.innerHeight - rect.bottom < maxHeight + gap;
        if (isTopInsufficient && isBottomInsufficient) {
          const available =
            window.innerHeight - rect.bottom - gap - contentHeightWithoutList;
          height = Math.max(50, Math.min(Math.floor(available), 295));
        }
      }
      contentHeight.value = height;
    };

    const isImageUrl = (url: string): boolean =>
      /^https?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(
        url,
      );

    const initSelectedItems = (values: unknown) => {
      const selected: IData[] = [];
      const keys: string[] = [];
      departments.value = [];
      const normalize = (value: unknown): IData | null => {
        if (typeof value !== 'object' || value === null) {
          const index = selected.length;
          const ids = String(props.data?.[c.valueItem] ?? '').split(c.separator);
          const token = ids[index] || String(value);
          const id =
            c.isAddSymbol && token.startsWith("'") && token.endsWith("'")
              ? token.slice(1, -1)
              : token;
          return {
            id,
            name: String(value),
            [c.keyName]: id,
            [c.textName]: String(value),
          };
        }
        const data = value as IData;
        const isObjectValue = c.valueType === 'OBJECT' || c.valueType === 'OBJECTS';
        const item = clone(
          isObjectValue && c.objectValueField && data[c.objectValueField]
            ? data[c.objectValueField]
            : data,
        ) as IData;
        const idField = isObjectValue && c.objectIdField
          ? c.objectIdField
          : c.selfFillMap?.user_id;
        const nameField = isObjectValue && c.objectNameField
          ? c.objectNameField
          : c.selfFillMap?.user_name;
        const id = (idField && data[idField]) ?? item.id ?? item[c.keyName];
        const name = (nameField && data[nameField]) ?? item.name ?? item[c.textName];
        Object.assign(item, {
          id,
          name,
          [c.keyName]: id,
          [c.textName]: name,
        });
        const titleField = c.selfFillMap?.user_title;
        if (titleField && data[titleField] !== undefined) {
          item.title = data[titleField];
        }
        return item;
      };

      if (isArray(values)) {
        values.forEach(value => {
          const item = normalize(value);
          if (item) {
            selected.push(item);
            keys.push(String(item.id));
          }
        });
      } else if (values !== null && values !== undefined && values !== '') {
        const list = c.multiple && typeof values === 'string'
          ? values.split(c.separator)
          : [values];
        list.forEach(value => {
          const item = normalize(value);
          if (item) {
            selected.push(item);
            keys.push(String(item.id));
          }
        });
      }
      selectedItems.value = selected;
      selectedValues.value = keys;
      valueText.value = selected.map(item => item.name).join(c.separator);
    };

    const load = async (reset = false): Promise<void> => {
      if (loading.value && !reset) return;
      if (reset) {
        loadVersion += 1;
        c.resetState();
        items.value = [];
      }
      const version = loadVersion;
      const tab = activeTab.value;
      const query = searchValue.value;
      loading.value = true;
      loadFailed.value = false;
      try {
        const res = await c.loadMore(
          props.data,
          tab,
          query
            ? { query }
            : {},
        );
        if (res?.data && version === loadVersion &&
          tab === activeTab.value && query === searchValue.value) {
          items.value = reset ? res.data : items.value.concat(res.data);
        }
      } catch {
        if (version === loadVersion &&
          tab === activeTab.value && query === searchValue.value) {
          loadFailed.value = true;
        }
      } finally {
        if (version === loadVersion) loading.value = false;
      }
    };

    const onClear = (event: Event) => {
      event.stopPropagation();
      c.dataItems.forEach(item => emit('change', null, item.id));
      if (c.valueItem) emit('change', null, c.valueItem);
      emit('change', null);
      emit('infoTextChange', '');
      initSelectedItems(null);
      popoverVisible.value = false;
      setEditable(false);
    };

    const selectItem = async (item: IData) => {
      if (c.multiple) {
        const index = selectedValues.value.findIndex(
          value => value === String(item.id),
        );
        if (index >= 0) {
          selectedValues.value.splice(index, 1);
          selectedItems.value.splice(index, 1);
        } else {
          selectedValues.value.push(String(item.id));
          selectedItems.value.push(item);
        }
      } else {
        selectedItems.value = [item];
        selectedValues.value = [String(item.id)];
      }

      const selected = selectedItems.value;
      const fillItems = await c.calcFillDataItems(selected);
      fillItems.forEach(field => emit('change', field.value, field.id));
      if (c.valueItem) {
        const ids = selected.map(data => data.id);
        let value: unknown = c.multiple ? ids.join(c.separator) : ids[0];
        if (c.multiple && c.isAddSymbol) {
          value = ids.map(id => `'${id}'`).join(c.separator);
        }
        emit('change', value, c.valueItem);
      }
      valueText.value = selected.map(data => data.name).join(c.separator);
      let value: unknown = valueText.value;
      if (c.valueType === 'OBJECTS') {
        value = selected.map(data => c.handleObjectParams(data));
      } else if (c.valueType === 'OBJECT') {
        value = c.handleObjectParams(item);
      }
      emit('change', value);
      emit('infoTextChange', valueText.value);
      if (!c.multiple) {
        popoverVisible.value = false;
        setEditable(false);
      }
    };

    const onPopShow = async () => {
      setEditable(true);
      if (c.isShowTab && !departments.value.length && c.defaultSelCurUser) {
        await c.initCurrentOperator(props.data, {});
      }
      if (!items.value.length) {
        await load(true);
      }
    };

    const onPageHide = () => {
      searchValue.value = '';
      setEditable(false);
    };

    const setEditable = (flag: boolean) => {
      isEditable.value = flag;
      if (flag) {
        emit('focus');
      } else {
        emit('blur');
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (props.disabled) {
        event.stopPropagation();
      }
    };

    const startRenderCount = () => {
      if (renderCountTimer) window.clearTimeout(renderCountTimer);
      renderCountTimer = window.setTimeout(() => {
        renderCount.value = Util.calcSelItemRenderNum(
          selectedValues.value,
          rootRef.value,
        );
      }, 500);
    };

    watch(
      [() => props.value, () => props.data?.[c.valueItem]],
      ([value]) => {
        initSelectedItems(value);
        refValue.value = value ? String(value) : '';
        startRenderCount();
      },
      { immediate: true, deep: true },
    );

    watch(searchValue, () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        load(true);
      }, 500);
    });

    watch(selectedValues, () => {
      startRenderCount();
    });

    onMounted(() => {
      nextTick(() => {
        initSelectedItems(props.value);
      });
      window.addEventListener('resize', calcHeight);
      calcHeight();
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', calcHeight);
      if (debounceTimer) window.clearTimeout(debounceTimer);
      if (renderCountTimer) window.clearTimeout(renderCountTimer);
    });

    const renderAvatar = (item: IData): VNode => {
      const url = c.getUserPictureUrl(item[c.keyName], item[c.textName]);
      if (url && isImageUrl(url)) {
        return <img class={ns.e('list-avatar')} src={url} />;
      }
      return <span>{item.name?.slice(0, 1)}</span>;
    };

    const renderSelectedItem = (item: IData, index: number) => {
      return (
        <div class={ns.e('multiple-item')}>
          <div class={ns.e('multiple-item-textimg')}>
            {renderAvatar(item)}
            {c.isShowNameText() && <span>{item.name}</span>}
          </div>
          {!props.disabled && !props.readonly && (
            <span
              class={ns.e('multiple-item-close')}
              onClick={(event: MouseEvent) => {
                event.stopPropagation();
                selectItem(item);
                void index;
              }}
            >
              ×
            </span>
          )}
        </div>
      );
    };

    const renderReadState = (): VNode => {
      if (!c.multiple) {
        return (
          <div class={ns.e('select-value')}>
            <div class={ns.e('select-value-textimg')}>
              {selectedItems.value.length ? renderAvatar(selectedItems.value[0]) : <span>+</span>}
            </div>
            {c.isShowNameText() && (
              <div class={ns.e('select-value-text')}>
                {renderString(valueText.value)}
              </div>
            )}
            {!props.disabled && !props.readonly && selectedItems.value.length ? (
              <span
                class={ns.e('select-value-close')}
                onClick={onClear}
              >
                ×
              </span>
            ) : null}
          </div>
        );
      }

      const visibleItems =
        renderCount.value >= 0 && canEllipsis
          ? selectedItems.value.slice(0, renderCount.value)
          : selectedItems.value;
      return (
        <div
          class={[
            ns.e('select-value-multiple'),
            canEllipsis && renderCount.value >= 0
              ? ns.e('select-value-multiple-hidden')
              : '',
          ]}
        >
          {visibleItems.map(renderSelectedItem)}
          {canEllipsis &&
            renderCount.value >= 0 &&
            selectedItems.value.length > renderCount.value && (
              <div class={ns2.e('multiple-ellipsis-default')}>…</div>
            )}
        </div>
      );
    };

    const renderNoSelectValue = (empty = false): VNode => {
      if (empty) {
        return <div>{personSelectText('No Data', '暂无数据')}</div>;
      }
      return (
        <div class={ns.e('no-select-value')}>
          <span>+</span>
        </div>
      );
    };

    const renderPersonList = (): VNode => {
      if (loading.value) {
        return <div class={ns.e('loadmore')}>{personSelectText('Loading...', '加载中...')}</div>;
      }
      if (loadFailed.value) {
        return (
          <div class={ns.e('loadmore')}>
            <span role="alert">{personSelectText('Failed to load', '加载失败')}</span>
            <button type="button" onClick={() => load(false)}>
              {personSelectText('Retry', '重试')}
            </button>
          </div>
        );
      }
      if (!items.value.length) {
        return renderNoSelectValue(true);
      }
      return (
        <VirtualList
          items={items.value}
          itemHeight={36}
          showNum={20}
          onScrollEvent={async (height: number, top: number) => {
            if (height - top - contentHeight.value < 40) {
              await load(false);
            }
          }}
        >
          {{
            default: (item: IData) => (
              <div
                class={[
                  ns.e('personel-list-item'),
                  selectedValues.value.includes(String(item.id))
                    ? 'is-selected'
                    : '',
                ]}
                onClick={() => selectItem(item)}
              >
                <div class={ns.e('personel-list-text')}>
                  <div class={ns.e('personel-list-text-img')}>
                    {renderAvatar(item)}
                  </div>
                  <span>{item.name}</span>
                  {item.title && (
                    <span class={ns.e('personel-list-title-label')}>
                      {item.title}
                    </span>
                  )}
                </div>
              </div>
            ),
          }}
        </VirtualList>
      );
    };

    const renderSelectInput = (): VNode => {
      const ElInput = resolveComponent('ElInput') as any;
      return (
        <ElInput
          modelValue={searchValue.value}
          onUpdate:modelValue={(value: string) => {
            searchValue.value = value;
          }}
          placeholder={personSelectText('Search', '搜索')}
          clearable
        />
      );
    };

    const renderDropModal = (): VNode => {
      const ElPopover = resolveComponent('ElPopover') as any;
      return (
        <div
          class={ns.e('select-modal')}
          style={`height:${contentHeight.value}px;`}
        >
          <div
            class={[
              ns.e('select'),
              c.isShowTab ? '' : ns.is('no-solider-tab'),
            ]}
          >
            {c.isShowTab && (
              <div class={ns.e('select-state')}>
                <div
                  class={[
                    ns.e('select-state-select-slider'),
                    activeTab.value === 'user' ? 'is-left' : 'is-right',
                  ]}
                />
                <div
                  class={ns.e('select-state-select-personel')}
                  onClick={() => {
                    activeTab.value = 'user';
                    void load(true);
                  }}
                >
                  {personSelectText('People', '人员')}
                </div>
                <div
                  class={ns.e('select-state-select-department')}
                  onClick={() => {
                    activeTab.value = 'department';
                    void load(true);
                  }}
                >
                  {personSelectText('Departments', '部门')}
                </div>
              </div>
            )}
          </div>
          <div class={ns.e('select-modal-search-input')}>
            {renderSelectInput()}
          </div>
          <div
            class={[
              ns.e('personel-list-user'),
              c.isShowTab ? '' : ns.is('no-solider-tab'),
            ]}
          >
            {renderPersonList()}
          </div>
          {c.enableBottomButton && (
            <div class={ns.e('select-modal-bottom')}>
              <ElPopover>{personSelectText('Confirm', '确定')}</ElPopover>
            </div>
          )}
        </div>
      );
    };

    return {
      c,
      ns,
      ns2,
      items,
      loading,
      refValue,
      curValue,
      valueText,
      isEditable,
      popoverRef,
      modelVisible: popoverVisible,
      personelSelRef,
      showFormDefaultContent,
      load,
      onClear,
      onPopShow,
      onPageHide,
      calcHeight,
      handleClick,
      setEditable,
      renderDropModal,
      renderReadState,
      renderSelectInput,
      renderNoSelectValue,
    };
  },
  render() {
    const ElPopover = resolveComponent('ElPopover') as any;
    const ns = useNamespace('picker-dropdown');
    const ns2 = useNamespace('personel-select');
    const popover = (
      <ElPopover
        ref="popoverRef"
        visible={this.modelVisible}
        onUpdate:visible={(value: boolean) => {
          this.modelVisible = value;
        }}
        trigger="click"
        popperClass={ns.b('person-select')}
        width={320}
        teleported={true}
        onShow={() => void this.onPopShow()}
        onHide={() => this.onPageHide()}
        onBeforeEnter={() => this.calcHeight()}
      >
        {{
          reference: () => this.renderReadState(),
          default: () => this.renderDropModal(),
        }}
      </ElPopover>
    );

    return (
      <div
        ref="personelSelRef"
        class={[
          ns.b(),
          ns2.b(),
          ns.b('person-value'),
          this.disabled ? ns.m('disabled') : '',
          this.readonly ? ns.m('readonly') : '',
          this.c.isShowNameText() ? '' : ns.m('only-icon'),
          ns.is('editable', this.isEditable),
          ns.is('show-default', this.showFormDefaultContent),
          ns2.is('multiple', this.c.multiple),
        ]}
        onClick={this.handleClick}
      >
        {this.readonly || this.disabled
          ? this.renderReadState()
          : popover}
      </div>
    );
  },
});
