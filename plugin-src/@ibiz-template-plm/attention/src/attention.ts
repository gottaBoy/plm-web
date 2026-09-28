import {
  useNamespace,
  getDataPickerProps,
  getEditorEmits,
  renderString,
} from '@ibiz-template/vue3-util';

import { clone } from 'ramda';

import {
  defineComponent,
  ref,
  onMounted,
  watch,
  createVNode,
  computed,
  resolveComponent,
  onBeforeUnmount,
  withDirectives,
  resolveDirective,
  createTextVNode,
  nextTick,
  mergeProps,
  isVNode,
  type PropType,
} from 'vue';

import { isArray } from 'lodash-es';

import { AttentionUtil } from './util';

import { VirtualList } from './virtual-list/virtual-list';

import { IBizFollow } from './follow/follow';
import { AttentionController } from './attention-controller';

type AttentionUser = IData & {
  id?: string;
  name?: string;
  title?: string;
  [key: string]: any;
};

function isSlotValue(value: unknown) {
  return (
    typeof value == 'function' ||
    (Object.prototype.toString.call(value) === '[object Object]' &&
      !isVNode(value))
  );
}

const Attention = defineComponent({
  name: 'IBizAttention',
  props: {
    ...getDataPickerProps<AttentionController>(),
    controller: {
      type: Object as PropType<AttentionController>,
      required: true,
    },
    data: {
      type: Object as PropType<IData>,
      required: true,
    },
  },
  emits: getEditorEmits(),
  setup(props, { emit: emit, attrs: attrs }) {
    const namespace = useNamespace('attention'),
      controller = props.controller,
      curValue = ref<any>(''),
      users = ref<AttentionUser[]>([]),
      departmentUsers = ref<AttentionUser[]>([]),
      refValue = ref(''),
      departmentExpanded = ref(false),
      isEditable = ref(false),
      searchValue = ref(''),
      searchResults = ref<AttentionUser[]>([]),
      activeTab = ref('user'),
      selectedUsers = ref<AttentionUser[]>([]),
      originalUsers = ref<AttentionUser[]>([]),
      loading = ref(false),
      popoverVisible = ref(false),
      modelVisible = ref(false),
      recordKey = ref(''),
      confirming = ref(false),
      searchInputRef = ref<HTMLInputElement>(),
      attentionRef = ref<HTMLElement>(),
      curAttentionValue = ref(''),
      searchTimer = ref<ReturnType<typeof setTimeout>>(),
      failedAvatars = ref<string[]>([]);
    let hiddenUserCount = 0;
    const listHeight = ref(295),
      readonlyState = computed(() => (props == null ? void 0 : props.readonly)),
      updateListHeight = () => {
        let t = 295;
        if (attentionRef.value) {
          const a = attentionRef.value.getBoundingClientRect(),
            s = 16,
            n = controller.enableBottomButton ? 464 : 415,
            u = n - t,
            y = a.top < n + s,
            A = window.innerHeight - a.bottom < n + s;
          if (y && A) {
            const B = a.top - s - u;
            t = Math.max(50, Math.min(Math.floor(B), 295));
          }
        }
        listHeight.value = t;
      },
      showFormDefaultContent = computed(
        () =>
          !!(props.controlParams && props.controlParams.editmode === 'hover'),
      ),
      valueText = computed(() => renderString(curValue.value)),
      avatarUrls = ref<Record<string, string>>({}),
      loadingAvatarIds = new Set(),
      Se = async (t, a = {}) => {
        if (!(avatarUrls.value[t] || loadingAvatarIds.has(t))) {
          loadingAvatarIds.add(t);
          try {
            const { downloadUrl: s } = ibiz.util.file.calcFileUpDownUrl(
              controller.context,
              controller.params,
              props.data,
              controller.editorParams,
            );
            let n = '';
            if (ibiz.config.common.enableDownloadTicket) {
              const u =
                  activeTab.value === 'user'
                    ? controller.userAuthEntity
                    : controller.deptAuthEntity,
                y =
                  activeTab.value === 'user'
                    ? controller.userFilterMap.id
                    : controller.deptFilterMap.id,
                A = await ibiz.util.file.getDownloadTicket(
                  controller.context,
                  controller.params,
                  a,
                  {
                    fileId: t,
                  },
                  {
                    appEntityTag: u,
                    dataFieldTag: y,
                  },
                );
              A != null && A.ticket && (n = s.replace('%fileId%', A.ticket));
            } else n = s.replace('%fileId%', t);
            n && (avatarUrls.value[t] = n);
          } catch (s) {
            ibiz.log.error(s);
          } finally {
            loadingAvatarIds.delete(t);
          }
        }
      },
      isImageUrl = t =>
        /^https?:|^http?:|^data:image|(\.png$|\.svg|\.jpg|\.png|\.gif|\.psd|\.tif|\.bmp|\.jpeg)$/.test(
          t,
        ),
      stopEvent = t => {
        t.preventDefault(), t.stopPropagation();
      },
      syncSelectionText = () => {
        var s;
        const t = [],
          a = [];
        (curAttentionValue.value = ''),
          ((s = selectedUsers.value) == null ? void 0 : s.length) > 0 &&
            selectedUsers.value.forEach(n => {
              t.push(n[controller.selfFillMap.user_id]),
                a.push(n[controller.selfFillMap.user_name]),
                n[controller.selfFillMap.user_id] ===
                  controller.context.srfuserid &&
                  (curAttentionValue.value = n[controller.attentionTypeField]);
            }),
          (refValue.value = t == null ? void 0 : t.toString()),
          (curValue.value = a == null ? void 0 : a.toString());
      },
      isFollowed = t => {
        var a, s;
        return (s =
          (a = controller.codeListMap) == null ? void 0 : a.FOLLOWED) == null
          ? void 0
          : s.some(n => String(n) === String(t));
      },
      updateSelectedDisplay = () => {
        const t = refValue.value.split(controller.separator);
        (hiddenUserCount = AttentionUtil.calcSelItemRenderNum(
          t,
          attentionRef.value,
        )),
          (refValue.value = ''),
          syncSelectionText();
      },
      restoreSelectedUsers = t => {
        if (t) {
          const a = isArray(t) ? t : [];
          (selectedUsers.value = []),
            a.forEach(s => {
              const n = clone(s);
              controller.selfFillMap.user_id &&
                controller.selfFillMap.user_name &&
                Object.assign(n, {
                  id: s[controller.selfFillMap.user_id],
                  name: s[controller.selfFillMap.user_name],
                  title: s[controller.selfFillMap.user_title],
                  [controller.attentionTypeField]:
                    s[controller.attentionTypeField],
                }),
                controller.objectValueField &&
                  (Object.assign(n, {
                    ...s[controller.objectValueField],
                  }),
                  delete n[controller.objectValueField]),
                selectedUsers.value.push(n);
            });
        } else selectedUsers.value = [];
        originalUsers.value = clone(selectedUsers.value);
      };
    watch(
      () => props.value,
      t => {
        t
          ? controller.valueType === 'OBJECT'
            ? (curValue.value = t ? t[controller.objectNameField] : null)
            : controller.valueType === 'OBJECTS'
            ? (restoreSelectedUsers(t), syncSelectionText())
            : (curValue.value = t)
          : ((curValue.value = ''), (selectedUsers.value = [])),
          updateSelectedDisplay();
      },
      {
        immediate: true,
      },
    );
    const valueItemValue = computed(
      () => (props.data && props.data[controller.valueItem]) || void 0,
    );
    watch(
      valueItemValue,
      (t, a) => {
        t !== a &&
          ((refValue.value = t),
          t === null && ((selectedUsers.value = []), emit('change', null)));
      },
      {
        immediate: true,
        deep: true,
      },
    );
    const setEditable = t => {
        t
          ? (isEditable.value = t)
          : setTimeout(() => {
              isEditable.value = t;
            }, 100);
      },
      getExtraFields = t => {
        const a = {},
          s = originalUsers.value.find(n => n.id === t.id) || {};
        try {
          const n = controller.dynamicMatch(controller.fieldMap, {
              item: {
                ...s,
                ...t,
              },
            }),
            u = JSON.parse(n);
          Object.keys(u).forEach(y => {
            u[y] &&
              Object.assign(a, {
                [y]: u[y],
              });
          });
        } catch (n) {
          ibiz.log.debug(''.concat(controller.fieldMap, '额外抛值字段映射'));
        }
        return a;
      },
      emitSelectedUsers = () => {
        if (controller.enableBottomButton && !confirming.value) return;
        const t = selectedUsers.value.map(a => {
          const s = {};
          return (
            Object.assign(s, {
              [controller.selfFillMap.user_id]: a.id,
              [controller.selfFillMap.user_name]: a.name,
              [controller.selfFillMap.user_title]: a.title,
              [controller.attentionTypeField]: a[controller.attentionTypeField],
            }),
            controller.fieldMap && Object.assign(s, getExtraFields(a)),
            s
          );
        });
        emit('change', t);
      },
      removeSelectedUser = (t, a) => {
        stopEvent(a);
        const s = selectedUsers.value.findIndex(n => n.id === t.id);
        if (
          (s > -1 && selectedUsers.value.splice(s, 1), controller.valueItem)
        ) {
          const n = selectedUsers.value.map(u => u.id);
          emit('change', n.join(controller.separator), controller.valueItem);
        }
        if (controller.valueType === 'OBJECTS')
          (confirming.value = true),
            emitSelectedUsers(),
            (confirming.value = false);
        else {
          const n = selectedUsers.value.map(u => u.name);
          emit('change', n.join(controller.separator));
        }
      },
      onSelectUser = async t => {
        searchValue.value &&
          (activeTab.value === 'user'
            ? users.value.unshift(t)
            : departmentUsers.value.unshift(t));
        const a = {};
        if ((Object.assign(a, t), activeTab.value === 'user')) {
          Object.assign(a, {
            [controller.userFilterMap.id]: a[controller.userFilterMap.id]
              ? a[controller.userFilterMap.id]
              : a.srfkey,
            [controller.userFilterMap.name]: a[controller.userFilterMap.name]
              ? a[controller.userFilterMap.name]
              : a.srfmajortext,
          });
          const s = selectedUsers.value.findIndex(
            n => n.id === a[controller.userFilterMap.id],
          );
          s < 0
            ? selectedUsers.value.push({
                ...a,
                id: a[controller.userFilterMap.id],
                name: a[controller.userFilterMap.name],
                [controller.attentionTypeField]:
                  controller.defaultAttentionValue,
              })
            : selectedUsers.value.splice(s, 1);
        } else {
          Object.assign(a, {
            [controller.deptFilterMap.id]: a[controller.deptFilterMap.id]
              ? a[controller.deptFilterMap.id]
              : a.srfkey,
            [controller.deptFilterMap.name]: a[controller.deptFilterMap.name]
              ? a[controller.deptFilterMap.name]
              : a.srfmajortext,
          });
          const s = selectedUsers.value.findIndex(
            n => n.id === a[controller.deptFilterMap.id],
          );
          s < 0
            ? selectedUsers.value.push({
                ...a,
                id: a[controller.deptFilterMap.id],
                name: a[controller.deptFilterMap.name],
                [controller.attentionTypeField]:
                  controller.defaultAttentionValue,
              })
            : selectedUsers.value.splice(s, 1);
        }
        if (controller.multiple) {
          if (controller.valueItem) {
            const n = selectedUsers.value.map(u => u.id);
            emit('change', n.join(controller.separator), controller.valueItem);
          }
          const s = selectedUsers.value.map(n => n.name);
          controller.valueType === 'OBJECTS'
            ? emitSelectedUsers()
            : emit('change', s.join(controller.separator));
        } else {
          const s = await controller.calcFillDataItems([t]);
          if (
            (s.length &&
              s.forEach(n => {
                emit('change', n.value, n.id);
              }),
            controller.valueItem &&
              (activeTab.value === 'user'
                ? emit(
                    'change',
                    a[controller.userFilterMap.id],
                    controller.valueItem,
                  )
                : emit(
                    'change',
                    a[controller.deptFilterMap.id],
                    controller.valueItem,
                  )),
            controller.valueType === 'OBJECT')
          )
            emit('change', controller.handleObjectParams(a));
          else if (controller.valueType === 'OBJECTS') {
            const n = {};
            activeTab.value === 'user'
              ? Object.assign(n, {
                  id: a[controller.userFilterMap.id],
                  name: a[controller.userFilterMap.name],
                })
              : Object.assign(n, {
                  id: a[controller.deptFilterMap.id],
                  name: a[controller.deptFilterMap.name],
                }),
              (selectedUsers.value = [n]),
              emitSelectedUsers();
          } else
            activeTab.value === 'user'
              ? emit('change', t[controller.userFilterMap.name])
              : emit('change', t[controller.deptFilterMap.name]);
          modelVisible.value = false;
        }
        controller.valueType !== 'OBJECTS' && emit('blur', t),
          setEditable(false);
      },
      mergeUserResults = (t, a) => {
        t.forEach(s => {
          const n = users.value.findIndex(u => u[a] === s[a]);
          n > -1 ? users.value.splice(n, 1, s) : users.value.push(s);
        });
      },
      load = async (t = false) => {
        if (searchValue.value) return;
        loading.value = true;
        const a = {};
        activeTab.value === 'department'
          ? (a.page = controller.deptpage)
          : (a.page = controller.page);
        try {
          const s = await controller.loadMore(props.data, activeTab.value, a);
          s &&
            (activeTab.value === 'user'
              ? users.value.length === 0
                ? (users.value = s.data)
                : mergeUserResults(s.data, controller.userFilterMap.id)
              : departmentUsers.value.length === 0
              ? (departmentUsers.value = s.data)
              : departmentUsers.value.push(...s.data));
        } catch (s) {
          loading.value = false;
        }
        loading.value = false;
      },
      onClear = t => {
        const { dataItems: a } = controller;
        a != null &&
          a.length &&
          a.forEach(s => {
            emit('change', null, s.id);
          }),
          controller.valueItem && emit('change', null, controller.valueItem),
          controller.valueType === 'OBJECTS'
            ? emit('change', [])
            : (emit('change', null), emit('blur', t)),
          t.stopPropagation(),
          t.preventDefault();
      },
      onAttentionChange = async t => {
        if (!controller.codeListMap) return;
        if (isFollowed(String(t))) {
          const s = selectedUsers.value.find(n => {
            var u;
            return (
              n[controller.selfFillMap.user_id] ===
              ((u = controller.context) == null ? void 0 : u.srfuserid)
            );
          });
          if (s)
            Object.assign(s, {
              [controller.attentionTypeField]: t,
            });
          else {
            const n = {
              id: controller.context.srfuserid,
              name: controller.context.srfusername,
              [controller.attentionTypeField]: t,
            };
            controller.currentOperator ||
              (await controller.initCurrentOperator(props.data)),
              controller.currentOperator &&
                Object.assign(n, {
                  title:
                    controller.currentOperator[controller.userFilterMap.title],
                }),
              selectedUsers.value.push(n);
          }
        } else {
          const s = selectedUsers.value.findIndex(n => {
            var u;
            return (
              n[controller.selfFillMap.user_id] ===
              ((u = controller.context) == null ? void 0 : u.srfuserid)
            );
          });
          s > -1 && selectedUsers.value.splice(s, 1);
        }
        syncSelectionText(), emitSelectedUsers();
      };
    watch(
      valueText,
      (t, a) => {
        t !== a &&
          controller.valueType !== 'OBJECTS' &&
          emit('infoTextChange', t);
      },
      {
        immediate: true,
      },
    );
    const searchUsers = async t => {
        loading.value = true;
        try {
          const a = {};
          Object.assign(a, {
            query: t,
            size: 1e3,
          });
          const s = await controller.getServiceData(
            activeTab.value,
            props.data,
            a,
          );
          s &&
            (activeTab.value === 'user'
              ? s.data.forEach(n => {
                  Object.keys(controller.userFilterMap).forEach(u => {
                    n[u] = n[controller.userFilterMap[u]];
                  });
                })
              : s.data.forEach(n => {
                  Object.keys(controller.deptFilterMap).forEach(u => {
                    n[u] = n[controller.deptFilterMap[u]];
                  });
                }),
            (searchResults.value = s.data),
            (loading.value = false));
        } catch (a) {
          loading.value = false;
        }
      },
      changeTab = t => {
        if (activeTab.value !== t) {
          if (((activeTab.value = t), searchValue.value)) {
            searchUsers(searchValue.value);
            return;
          }
          activeTab.value === 'user' && users.value.length === 0 && load(),
            activeTab.value === 'department' &&
              departmentUsers.value.length === 0 &&
              load();
        }
      },
      getThemeVar = () => {
        const t = document.documentElement;
        return t
          ? getComputedStyle(t).getPropertyValue('--ibiz-color-primary')
          : null;
      },
      isChineseCharacter = t => /[\u4E00-\u9FA5]/.test(t),
      hasChineseAndEnglish = t =>
        /[\u4e00-\u9fa5]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u4e00-\u9fa5]+/.test(t),
      stringToHexColor = t => {
        if (!t) return '';
        let a = 0;
        for (let B = 0; B < t.length; B++)
          if (isChineseCharacter(t))
            (a = t.charCodeAt(B) + ((a << 5) - a)), (a = a & a);
          else {
            const ut = t.charCodeAt(B);
            a += ut.toString(16);
          }
        const s = String(a).substring(0, 6);
        let n = parseInt(s.substring(0, 2), 16),
          u = parseInt(s.substring(2, 4), 16),
          y = parseInt(s.substring(4, 6), 16);
        n < 0 && (n = 10), u < 0 && (u = 10), y < 0 && (y = 10);
        const A = '#'
          .concat(n.toString(16).padStart(2, '0'))
          .concat(u.toString(16).padStart(2, '0'))
          .concat(y.toString(16).padStart(2, '0'));
        return (A === '#FFFFFF' && getThemeVar()) || A;
      },
      debounceSearch = t => {
        clearTimeout(searchTimer.value),
          (searchTimer.value = setTimeout(() => {
            !t && t !== 0 ? load() : searchUsers(t),
              clearTimeout(searchTimer.value);
          }, 300));
      },
      translateActions = t => {
        t.forEach(a => {
          if (a.capLanguageRes && a.capLanguageRes.lanResTag) {
            const s = ibiz.i18n.t(a.capLanguageRes.lanResTag, a.caption);
            Object.assign(a, {
              caption: s,
            });
          }
          if (a.tooltipLanguageRes && a.tooltipLanguageRes.lanResTag) {
            const s = ibiz.i18n.t(a.tooltipLanguageRes.lanResTag, a.tooltip);
            Object.assign(a, {
              caption: s,
            });
          }
        });
      },
      onActionClick = async (t, a) => {
        await controller.onActionClick(t, [props.data], a);
      },
      getVisibleUsers = t => (searchValue.value ? searchResults.value : t),
      onPageHide = () => {
        (popoverVisible.value = false),
          (avatarUrls.value = {}),
          loadingAvatarIds.clear();
      },
      onCancel = () => {
        (confirming.value = false),
          (modelVisible.value = false),
          setTimeout(() => {
            restoreSelectedUsers(props.value);
          }, 200);
      },
      onConfirm = () => {
        (confirming.value = true),
          (modelVisible.value = false),
          emitSelectedUsers(),
          (confirming.value = false);
      },
      renderSearchInput = () =>
        createVNode(
          resolveComponent('el-input'),
          {
            class: namespace.be('select-modal', 'search-input'),
            ref: searchInputRef,
            modelValue: searchValue.value,
            'onUpdate:modelValue': t => (searchValue.value = t),
            placeholder: '搜索',
            onInput: t => debounceSearch(t),
          },
          {
            suffix: () =>
              createVNode(
                'svg',
                {
                  viewBox: '0 0 16 16',
                  xmlns: 'http://www.w3.org/2000/svg',
                  height: '1em',
                  width: '1em',
                  preserveAspectRatio: 'xMidYMid meet',
                  focusable: 'false',
                },
                [
                  createVNode(
                    'g',
                    {
                      id: 'atwnormal/search',
                      'stroke-width': '1',
                      'fill-rule': 'evenodd',
                    },
                    [
                      createVNode(
                        'path',
                        {
                          d: 'M6.751 12.303A5.557 5.557 0 0 1 1.2 6.751C1.2 3.691 3.69 1.2 6.751 1.2a5.558 5.558 0 0 1 5.551 5.551 5.557 5.557 0 0 1-5.551 5.552M6.751 0a6.751 6.751 0 1 0 4.309 11.949l3.855 3.855a.6.6 0 1 0 .849-.849l-3.854-3.853A6.751 6.751 0 0 0 6.751 0',
                          id: 'atwFill-1',
                          fill: 'currentColor',
                        },
                        null,
                      ),
                    ],
                  ),
                ],
              ),
          },
        ),
      Je = () =>
        createVNode(
          'div',
          {
            class: namespace.be('select-modal', 'select-state'),
          },
          [
            createVNode(
              'div',
              {
                class: [
                  namespace.bem(
                    'select-modal',
                    'select-state',
                    'select-slider',
                  ),
                  namespace.is('left', activeTab.value === 'user'),
                  namespace.is('right', activeTab.value !== 'user'),
                ],
              },
              null,
            ),
            createVNode(
              'div',
              {
                class: namespace.bem(
                  'select-modal',
                  'select-state',
                  'select-personel',
                ),
                onClick: () => changeTab('user'),
              },
              [createTextVNode('人员')],
            ),
            createVNode(
              'div',
              {
                class: namespace.bem(
                  'select-modal',
                  'select-state',
                  'select-department',
                ),
                onClick: () => changeTab('department'),
              },
              [createTextVNode('部门')],
            ),
          ],
        ),
      Ke = t =>
        createVNode(
          'div',
          {
            class: namespace.bem('select-modal', 'actions', 'item'),
            title: t.tooltip,
            onClick: a => onActionClick(t, a),
          },
          [
            t.showIcon &&
              t.sysImage &&
              createVNode(
                resolveComponent('iBizIcon'),
                {
                  icon: t.sysImage,
                },
                null,
              ),
          ],
        ),
      Ze = () => {
        var a;
        const t =
          ((a = controller.model.uiactionGroup) == null
            ? void 0
            : a.uiactionGroupDetails) || [];
        return (
          translateActions(t),
          createVNode(
            'div',
            {
              class: namespace.be('select-modal', 'actions'),
            },
            [t.map(s => Ke(s))],
          )
        );
      },
      Ye = () =>
        createVNode(
          'div',
          {
            class: namespace.be('select-modal', 'select'),
          },
          [Je(), Ze()],
        ),
      Ge = t => {
        if (controller.multiple) {
          let a = -1;
          return (
            refValue.value &&
              (a = refValue.value
                .split(controller.separator)
                .findIndex(n => n === t)),
            controller.enableBottomButton &&
              (a = selectedUsers.value.findIndex(
                s =>
                  (activeTab.value === 'user'
                    ? s[controller.userFilterMap.id]
                    : s[controller.deptFilterMap.id]) === t,
              )),
            a > -1
              ? createVNode(
                  'div',
                  {
                    class: namespace.bem(
                      'select-modal',
                      'personel-list',
                      'icon',
                    ),
                  },
                  [
                    createVNode(
                      'i',
                      {
                        class: 'fa fa-check',
                        'aria-hidden': 'true',
                      },
                      null,
                    ),
                  ],
                )
              : null
          );
        }
        return refValue.value === t
          ? createVNode(
              'div',
              {
                class: namespace.bem('select-modal', 'personel-list', 'icon'),
              },
              [
                createVNode(
                  'i',
                  {
                    class: 'fa fa-check',
                    'aria-hidden': 'true',
                  },
                  null,
                ),
              ],
            )
          : null;
      },
      qe = t => {
        if (t && t.toString().length < 2) return t;
        if (t && t.toString().length >= 2) {
          if (hasChineseAndEnglish(t)) {
            const u = t.split('').find(A => /[a-zA-Z]/.test(A)) || '',
              y = t.split('').find(A => /[\u4E00-\u9FA5]/.test(A)) || '';
            return ''.concat(u).concat(y).toLowerCase();
          }
          return /[a-zA-Z]/.test(t)
            ? t
                .split('')
                .filter(u => /[a-zA-Z]/.test(u))
                .slice(0, 2)
                .join('')
                .toUpperCase()
            : /[\u4E00-\u9FA5]/.test(t)
            ? t
                .split('')
                .filter(u => /[\u4E00-\u9FA5]/.test(u))
                .slice(-2)
                .join('')
            : t.replaceAll(' ', '').substring(0, 2);
        }
      },
      Xe = t => {
        console.log('头像加载失败'), failedAvatars.value.push(t);
      },
      Qe = (t, a) => {
        if (!t) return null;
        let s = '';
        if (isImageUrl(t)) s = t;
        else {
          let n = [];
          try {
            n = JSON.parse(t);
          } catch (y) {
            console.error('解析头像数据失败', y);
          }
          if (n.length === 0) return null;
          const u = n[0].id;
          if (((s = avatarUrls.value[u]), !s)) return Se(u, a), null;
        }
        return createVNode(
          'img',
          {
            class: namespace.bem('select-modal', 'personel-list', 'avatar'),
            src: s,
            onError: () => Xe(t),
            alt: '',
          },
          null,
        );
      },
      ee = (t, a, s) => {
        const u =
            (s &&
              (activeTab.value === 'user'
                ? s[controller.userFilterMap.avatar]
                : s[controller.deptFilterMap.avatar])) ||
            controller.getUserPictureUrl(t, a),
          y = Qe(u, s);
        return u && !failedAvatars.value.includes(u) && y ? y : qe(a);
      },
      he = t => {
        const a =
            activeTab.value === 'user'
              ? t[controller.userFilterMap.name] || t.name
              : t[controller.deptFilterMap.name] || t.name,
          s =
            activeTab.value === 'user'
              ? t[controller.userFilterMap.id]
              : t[controller.deptFilterMap.id],
          n =
            activeTab.value === 'user'
              ? t[controller.userFilterMap.title]
              : t[controller.deptFilterMap.title];
        return createVNode(
          'div',
          {
            class: [
              namespace.bem('select-modal', 'personel-list', 'item'),
              namespace.is('selected', refValue.value === s),
            ],
            onClick: () => onSelectUser(t),
          },
          [
            createVNode(
              'div',
              {
                class: namespace.bem('select-modal', 'personel-list', 'text'),
              },
              [
                createVNode(
                  'div',
                  {
                    class: namespace.bem(
                      'select-modal',
                      'personel-list',
                      'text-img',
                    ),
                    style: 'background-color:'.concat(stringToHexColor(a)),
                  },
                  [ee(s, a, t)],
                ),
                createVNode(
                  'div',
                  {
                    class: namespace.bem(
                      'select-modal',
                      'personel-list',
                      'text-label',
                    ),
                  },
                  [a],
                ),
                n &&
                  createVNode(
                    'div',
                    {
                      class: namespace.bem(
                        'select-modal',
                        'personel-list',
                        'title-label',
                      ),
                    },
                    [n],
                  ),
                s === controller.context.srfuserid
                  ? createVNode(
                      'div',
                      {
                        class: namespace.bem(
                          'select-modal',
                          'personel-list',
                          'myself',
                        ),
                      },
                      [createTextVNode('我自己')],
                    )
                  : null,
              ],
            ),
            Ge(s),
          ],
        );
      },
      et = (t, a) => {
        const { context: s, params: n } = controller;
        return createVNode(
          resolveComponent('iBizControlShell'),
          {
            class: namespace.b('panel-item'),
            data: t,
            modelData: a,
            context: s,
            params: n,
          },
          null,
        );
      },
      tt = (t, a) =>
        createVNode(
          resolveComponent('el-popover'),
          {
            target: 'hover',
            placement: 'right',
            offset: 24,
            width: 'auto',
          },
          {
            reference: () => he(t),
            default: () => et(t, a),
          },
        ),
      at = (t, a) => {
        popoverVisible.value &&
          (activeTab.value === 'user'
            ? t - a < 305 && (loading.value || load())
            : t - a < 265 && (loading.value || load()));
      },
      me = t => {
        var n;
        const a = getVisibleUsers(t),
          s = (n = controller.deACMode) == null ? void 0 : n.itemLayoutPanel;
        return createVNode(
          VirtualList,
          {
            items: a,
            itemHeight: 36,
            class: [
              namespace.be('select-modal', 'personel-list'),
              namespace.be(
                'select-modal',
                'personel-list-'.concat(activeTab.value),
              ),
            ],
            onScrollEvent: (u, y) => at(u, y),
          },
          {
            default: u => (s ? tt(u, s) : he(u)),
          },
        );
      },
      fe = t => {
        departmentExpanded.value = t;
      },
      st = () =>
        createVNode(
          'div',
          {
            class: namespace.be('select-modal', 'deptpersonel'),
          },
          [
            createVNode(
              'div',
              {
                class: namespace.bem('select-modal', 'deptpersonel', 'dept'),
              },
              [
                createVNode(
                  'div',
                  {
                    class: 'collpase-icon',
                  },
                  [
                    departmentExpanded.value
                      ? createVNode(
                          'i',
                          {
                            class: 'fa fa-angle-right',
                            'aria-hidden': 'true',
                            onClick: () => fe(false),
                          },
                          null,
                        )
                      : createVNode(
                          'i',
                          {
                            class: 'fa fa-angle-down',
                            'aria-hidden': 'true',
                            onClick: () => fe(true),
                          },
                          null,
                        ),
                  ],
                ),
                createVNode(
                  'svg',
                  {
                    viewBox: '0 0 16 16',
                    xmlns: 'http://www.w3.org/2000/svg',
                    height: '1em',
                    width: '1em',
                    preserveAspectRatio: 'xMidYMid meet',
                    focusable: 'false',
                  },
                  [
                    createVNode(
                      'g',
                      {
                        id: 'aqf1.Base基础/1.icon图标/2.normal/部门',
                        'stroke-width': '1',
                        'fill-rule': 'evenodd',
                      },
                      [
                        createVNode(
                          'path',
                          {
                            d: 'M9 1a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.39l-.016 2.138H11.5a2.1 2.1 0 0 1 2.095 1.95l.005.15V11h.4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a.9.9 0 0 0-.787-.893l-.113-.007h-7a.9.9 0 0 0-.893.787l-.007.113V11H4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.4V9.238a2.1 2.1 0 0 1 1.95-2.094l.15-.006h2.894L7.41 5H7a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h2zm4.8 11.2h-1.6v1.6h1.6v-1.6zm-10 0H2.2v1.6h1.6v-1.6zm5-10H7.2v1.6h1.6V2.2z',
                            id: 'aqf形状结合',
                            fill: 'currentColor',
                          },
                          null,
                        ),
                      ],
                    ),
                  ],
                ),
                createVNode('span', null, [
                  ''.concat(controller.context.srfusername, '的团队'),
                ]),
                createVNode('span', null, [createTextVNode('·')]),
                createVNode('span', null, [controller.depttotal]),
              ],
            ),
            departmentExpanded.value
              ? null
              : createVNode(
                  'div',
                  {
                    class: namespace.bem(
                      'select-modal',
                      'deptpersonel',
                      'dept-person',
                    ),
                  },
                  [me(departmentUsers.value)],
                ),
          ],
        ),
      it = () => {
        let t, a;
        return createVNode(
          'div',
          {
            class: namespace.be('select-modal', 'bottom'),
          },
          [
            createVNode(
              resolveComponent('el-button'),
              {
                type: 'text',
                onClick: onCancel,
              },
              isSlotValue((t = ibiz.i18n.t('app.cancel')))
                ? t
                : {
                    default: () => [t],
                  },
            ),
            createVNode(
              resolveComponent('el-button'),
              {
                onClick: onConfirm,
              },
              isSlotValue((a = ibiz.i18n.t('app.confirm')))
                ? a
                : {
                    default: () => [a],
                  },
            ),
          ],
        );
      },
      renderDropModal = () =>
        withDirectives(
          createVNode(
            'div',
            {
              class: namespace.b('select-modal'),
              onPointerdown: stopEvent,
              onPointerup: stopEvent,
              onClick: stopEvent,
            },
            [
              renderSearchInput(),
              Ye(),
              createVNode(
                'div',
                {
                  class: namespace.be('select-modal', 'container'),
                  style: {
                    height: ''.concat(listHeight.value, 'px'),
                  },
                },
                [activeTab.value === 'user' ? me(users.value) : st()],
              ),
              controller.enableBottomButton && it(),
            ],
          ),
          [[resolveDirective('loading'), loading.value]],
        ),
      renderNoSelectValue = () =>
        createVNode(
          'div',
          {
            class: namespace.b('no-select-value'),
          },
          [
            createVNode(
              'svg',
              {
                viewBox: '0 0 16 16',
                xmlns: 'http://www.w3.org/2000/svg',
                height: '1em',
                width: '1em',
                preserveAspectRatio: 'xMidYMid meet',
                focusable: 'false',
              },
              [
                createVNode(
                  'g',
                  {
                    id: 'azeaction/user-add',
                    'stroke-width': '1',
                  },
                  [
                    createVNode(
                      'path',
                      {
                        d: 'M7.9.4a4.1 4.1 0 1 1-.265 8.192.593.593 0 0 1-.268.126 6.411 6.411 0 0 0-4.624 3.698A6.375 6.375 0 0 0 2.2 15 .6.6 0 0 1 1 15c0-1.07.222-2.11.645-3.069a7.622 7.622 0 0 1 4.069-3.963A4.1 4.1 0 0 1 7.9.4zm4.6 9.9a.6.6 0 0 1 .592.503l.008.097-.001 1.399 1.401.001a.6.6 0 0 1 .592.503l.008.097a.6.6 0 0 1-.503.592l-.097.008-1.401-.001.001 1.401a.6.6 0 0 1-.503.592l-.097.008a.6.6 0 0 1-.592-.503L11.9 14.9v-1.401l-1.4.001a.6.6 0 0 1-.592-.503L9.9 12.9a.6.6 0 0 1 .503-.592l.097-.008h1.4v-1.4a.6.6 0 0 1 .503-.592l.097-.008zM7.9 1.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z',
                        id: 'aze形状结合',
                        fill: 'currentColor',
                      },
                      null,
                    ),
                  ],
                ),
              ],
            ),
            createVNode('span', null, [createTextVNode('未设置')]),
          ],
        ),
      renderReadonlyUsers = () =>
        createVNode(
          'div',
          {
            class: namespace.b('no-select-value'),
          },
          [createVNode('span', null, [createTextVNode('未设置')])],
        ),
      renderSelectedUsers = () => {
        var t, a;
        if (controller.multiple) {
          const s = [];
          if (refValue.value) {
            const u = refValue.value.split(controller.separator),
              y = valueText.value.split(controller.separator);
            u.forEach((A, B) => {
              s.push({
                id: A,
                name: y[B],
              });
            });
          }
          let n = false;
          return (
            hiddenUserCount > 0 &&
              ((n = controller.enableBottomButton
                ? hiddenUserCount <
                  ((t = originalUsers.value) == null ? void 0 : t.length)
                : hiddenUserCount <
                  ((a = selectedUsers.value) == null ? void 0 : a.length)),
              s == null ||
                s.splice(hiddenUserCount, s == null ? void 0 : s.length)),
            createVNode(
              'div',
              {
                class: [
                  namespace.b('select-value-multiple'),
                  namespace.is('hidden', n),
                ],
              },
              [
                s == null
                  ? void 0
                  : s.map(u => {
                      let y;
                      return createVNode(
                        'div',
                        {
                          class: namespace.be('select-value-multiple', 'item'),
                        },
                        [
                          createVNode(
                            'div',
                            {
                              class: [
                                namespace.be('select-value', 'textimg'),
                                namespace.bem(
                                  'select-value-multiple',
                                  'item',
                                  'textimg',
                                ),
                              ],
                              style: 'background-color:'.concat(
                                stringToHexColor(u.name),
                              ),
                            },
                            [
                              createVNode(
                                resolveComponent('el-tooltip'),
                                {
                                  class: 'box-item',
                                  effect: 'dark',
                                  content: u.name,
                                  placement: 'top',
                                  offset: 12,
                                },
                                isSlotValue((y = ee(u.id, u.name, u)))
                                  ? y
                                  : {
                                      default: () => [y],
                                    },
                              ),
                              props.readonly
                                ? null
                                : createVNode(
                                    'div',
                                    {
                                      class: [
                                        namespace.bem(
                                          'select-value-multiple',
                                          'item',
                                          'close',
                                        ),
                                      ],
                                      onClick: A => removeSelectedUser(u, A),
                                    },
                                    [
                                      createVNode(
                                        'i',
                                        {
                                          class: 'fa fa-close',
                                          'aria-hidden': 'true',
                                        },
                                        null,
                                      ),
                                    ],
                                  ),
                            ],
                          ),
                        ],
                      );
                    }),
                n
                  ? createVNode(
                      resolveComponent('el-tooltip'),
                      {
                        class: namespace.b('multiple-ellipsis'),
                        'popper-class': namespace.be(
                          'multiple-ellipsis',
                          'popper',
                        ),
                        effect: 'dark',
                        content: valueText.value,
                        placement: 'top',
                        offset: 12,
                      },
                      {
                        default: () => [
                          createVNode(
                            'span',
                            {
                              class: namespace.be(
                                'multiple-ellipsis',
                                'default',
                              ),
                            },
                            [createTextVNode('...')],
                          ),
                        ],
                      },
                    )
                  : null,
              ],
            )
          );
        }
      },
      renderSelectInput = () =>
        controller.multiple
          ? createVNode(
              'div',
              {
                class: namespace.b('select-value-multiple'),
              },
              [
                createVNode(
                  'div',
                  {
                    class: namespace.b('select-value'),
                    title: '选择人员',
                  },
                  [
                    createVNode(
                      'svg',
                      {
                        viewBox: '0 0 16 16',
                        xmlns: 'http://www.w3.org/2000/svg',
                        height: '1em',
                        width: '1em',
                        preserveAspectRatio: 'xMidYMid meet',
                        focusable: 'false',
                      },
                      [
                        createVNode(
                          'g',
                          {
                            id: 'azeaction/user-add',
                            'stroke-width': '1',
                          },
                          [
                            createVNode(
                              'path',
                              {
                                d: 'M7.9.4a4.1 4.1 0 1 1-.265 8.192.593.593 0 0 1-.268.126 6.411 6.411 0 0 0-4.624 3.698A6.375 6.375 0 0 0 2.2 15 .6.6 0 0 1 1 15c0-1.07.222-2.11.645-3.069a7.622 7.622 0 0 1 4.069-3.963A4.1 4.1 0 0 1 7.9.4zm4.6 9.9a.6.6 0 0 1 .592.503l.008.097-.001 1.399 1.401.001a.6.6 0 0 1 .592.503l.008.097a.6.6 0 0 1-.503.592l-.097.008-1.401-.001.001 1.401a.6.6 0 0 1-.503.592l-.097.008a.6.6 0 0 1-.592-.503L11.9 14.9v-1.401l-1.4.001a.6.6 0 0 1-.592-.503L9.9 12.9a.6.6 0 0 1 .503-.592l.097-.008h1.4v-1.4a.6.6 0 0 1 .503-.592l.097-.008zM7.9 1.6a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z',
                                id: 'aze形状结合',
                                fill: 'currentColor',
                              },
                              null,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            )
          : createVNode(
              'div',
              {
                class: namespace.b('select-value'),
              },
              [
                createVNode(
                  'div',
                  {
                    class: namespace.be('select-value', 'textimg'),
                    style: 'background-color:'.concat(
                      stringToHexColor(valueText.value),
                    ),
                  },
                  [ee(refValue.value, valueText.value)],
                ),
                createVNode(
                  'div',
                  {
                    class: namespace.be('select-value', 'text'),
                  },
                  [
                    createVNode(
                      'div',
                      {
                        class: namespace.bem('select-value', 'text', 'label'),
                      },
                      [valueText.value],
                    ),
                  ],
                ),
                props.readonly
                  ? null
                  : createVNode(
                      'i',
                      {
                        class: [
                          'fa fa-times-circle',
                          namespace.be('select-value', 'close'),
                        ],
                        'aria-hidden': 'true',
                        onClick: t => onClear(t),
                      },
                      null,
                    ),
              ],
            ),
      onPopShow = async () => {
        var u, y;
        popoverVisible.value = true;
        const { context: t, params: a } = controller.handlePublicParams(
            props.data,
            controller.context,
            controller.params,
          ),
          s = controller
            .fill(controller.userUrl, t, a, props.data)
            .replaceAll('//', '/'),
          n = controller
            .fill(controller.deptUrl, t, a, props.data)
            .replaceAll('//', '/');
        (s !== controller.copyUserUrl ||
          n !== controller.copyDeptUrl ||
          (props.data && props.data.srfkey !== recordKey.value)) &&
          ((recordKey.value =
            ((u = props.data) == null ? void 0 : u.srfkey) || ''),
          (users.value = []),
          (departmentUsers.value = []),
          controller.resetState(),
          load(true)),
          await nextTick(),
          (y = searchInputRef.value) == null || y.focus();
      },
      renderReference = () =>
        valueText.value ? renderSelectInput() : renderNoSelectValue(),
      renderReadonlyContent = () =>
        valueText.value ? [renderSelectedUsers()] : renderReadonlyUsers(),
      renderPopover = () =>
        createVNode(
          resolveComponent('el-popover'),
          mergeProps(
            {
              visible: modelVisible.value,
              'onUpdate:visible': t => (modelVisible.value = t),
              trigger: 'click',
              popperClass: namespace.b('person-select'),
              placement: 'top-start',
              width: 320,
              teleported: true,
              onShow: () => onPopShow(),
              onHide: () => onPageHide(),
              onBeforeEnter: () => updateListHeight(),
            },
            attrs,
          ),
          {
            reference: () => renderReference(),
            default: () => renderDropModal(),
          },
        ),
      renderEditContent = () => [renderSelectedUsers(), renderPopover()],
      onResize = () => {
        updateSelectedDisplay();
      };
    return (
      onMounted(() => {
        attentionRef.value &&
          (window == null || window.addEventListener('resize', onResize),
          updateSelectedDisplay());
      }),
      onBeforeUnmount(() => {
        controller.resetState(),
          attentionRef.value &&
            (window == null || window.removeEventListener('resize', onResize)),
          (avatarUrls.value = {}),
          loadingAvatarIds.clear();
      }),
      {
        ns: namespace,
        c: controller,
        refValue: refValue,
        curValue: curValue,
        valueText: valueText,
        loading: loading,
        items: users,
        isEditable: isEditable,
        showFormDefaultContent: showFormDefaultContent,
        modelVisible: modelVisible,
        curAttentionValue: curAttentionValue,
        attentionRef: attentionRef,
        readonlyState: readonlyState,
        onClear: onClear,
        load: load,
        setEditable: setEditable,
        renderDropModal: renderDropModal,
        renderNoSelectValue: renderNoSelectValue,
        renderSelectInput: renderSelectInput,
        onPopShow: onPopShow,
        onPageHide: onPageHide,
        onAttentionChange: onAttentionChange,
        renderEditContent: renderEditContent,
        renderReadonlyContent: renderReadonlyContent,
      }
    );
  },
  render() {
    return createVNode(
      'div',
      {
        ref: 'attentionRef',
        class: [
          this.ns.b(),
          this.ns.b('person-value'),
          this.disabled ? this.ns.m('disabled') : '',
          this.readonlyState ? this.ns.m('readonly') : '',
          this.ns.is('editable', this.isEditable),
          this.ns.is('show-default', this.showFormDefaultContent),
        ],
      },
      [
        this.readonlyState
          ? this.renderReadonlyContent()
          : this.renderEditContent(),
        createVNode(
          IBizFollow,
          {
            disabled: this.disabled,
            value: this.curAttentionValue,
            codeListId: this.c.codeListId,
            codeListMap: this.c.codeListMap,
            defaultSelected: this.c.defaultSelected,
            controller: this.c,
            onChange: this.onAttentionChange,
          },
          null,
        ),
      ],
    );
  },
});

export { isSlotValue, Attention };
