/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-bitwise */
/* eslint-disable no-unsafe-finally */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable object-shorthand */
import {
  ref,
  watch,
  nextTick,
  onMounted,
  onUnmounted,
  defineComponent,
} from 'vue';
import {
  useUIStore,
  useNamespace,
  getCodeProps,
  getEditorEmits,
} from '@ibiz-template/vue3-util';
import { createUUID } from 'qx-util';
import { ElMessageBox } from 'element-plus';
import * as monaco from 'monaco-editor';
import { MenuItem } from '@imengyu/vue3-context-menu';
import loader from '@monaco-editor/loader';
import { CodeEditorController } from '../code-editor.controller';
import { CodeModuleCenter } from '../module';
import { Monaco } from '../interface';
import { LanguageManager } from '../language-manager/language-manager';
import './monaco-editor.scss';

export const IBizAICode = defineComponent({
  name: 'IBizAICode',
  props: getCodeProps<CodeEditorController>(),
  emits: getEditorEmits(),
  setup(props, { emit }) {
    const codeEditBox = ref();
    const ns = useNamespace('code');
    const c: CodeEditorController = props.controller!;
    const UUID = createUUID();
    const currentVal = ref<string>('');

    const { zIndex } = useUIStore();

    // 允许编辑
    const enableEdit = ref(true);

    // 是否存在编辑器参数enableEdit
    const hasEnableEdit = ref(false);

    // 只读状态
    const readonlyState = ref(false);

    // 允许全屏打开
    const enableFullScreen = ref(false);

    // 是否全屏
    const isFullScreen = ref(false);

    // 是否加载中
    const isLoading = ref(false);

    // 语言初始化是否在加载中
    const isTSFileLoading = ref(false);

    // 是否AI加载中
    const isAILoading = ref(false);

    // 文本编辑工具栏
    const textTBRef = ref();

    // 文本编辑工具栏直接样式
    const textTBStyle = ref<IData>({
      [ns.cssVarBlockName('text-editor-toolbar-z-index')]: zIndex.increment(),
    });

    // 文本编辑工具栏可见状态
    const textTBVisible = ref(false);

    // 额外库文件名称
    const libName = 'ibiz-global.d.ts';

    // 补全模式
    let completionmode: 'aichat' | 'inline' | 'all' = 'all';

    // 行内补全模式
    let inlinecompletionmode: string = 'coder';

    // 行内补全触发模式
    let inlinetriggermode: 'manual' | 'auto' | 'all' = 'manual';

    // 行内补全光标前行数
    let abovelines: number = 5;

    // 行内补全光标后行数
    let belowlines: number = 3;

    /**
     * @description 设置补全加载状态
     * @param {boolean} state
     */
    const setAILoadingState = (state: boolean): void => {
      isAILoading.value = state;
    };

    // 全局变量映射
    let globalVariable = '';

    let envlanguag = ibiz.i18n.getLang().toLowerCase();

    const editorModel = c.model;
    if (editorModel.editorParams) {
      if (editorModel.editorParams.enableEdit) {
        hasEnableEdit.value = true;
        readonlyState.value = true;
        enableEdit.value =
          c.toBoolean(editorModel.editorParams.enableEdit) &&
          !props.readonly &&
          !props.disabled;
      }
      if (editorModel.editorParams.enableFullScreen) {
        enableFullScreen.value = c.toBoolean(
          editorModel.editorParams.enableFullScreen,
        );
      }
      if (editorModel.editorParams.completionmode) {
        completionmode = editorModel.editorParams.completionmode;
      }
      if (editorModel.editorParams.abovelines) {
        abovelines = Number(editorModel.editorParams.abovelines);
      }
      if (editorModel.editorParams.belowlines) {
        belowlines = Number(editorModel.editorParams.belowlines);
      }
      if (
        completionmode === 'inline' &&
        editorModel.editorParams.inlinecompletionmode
      ) {
        inlinecompletionmode = editorModel.editorParams.inlinecompletionmode;
      }
      if (editorModel.editorParams.envlanguag) {
        envlanguag = editorModel.editorParams.envlanguag;
      }
      if (editorModel.editorParams.inlinetriggermode) {
        inlinetriggermode = editorModel.editorParams.inlinetriggermode;
      }
      if (editorModel.editorParams.GLOBALVARIABLE) {
        globalVariable = editorModel.editorParams.GLOBALVARIABLE;
      }
    }

    let editor: monaco.editor.IStandaloneCodeEditor | null;
    let monacoEditor: typeof monaco.editor;
    let codeLensProviderDisposable: monaco.IDisposable | null;
    let decorationsCollection: monaco.editor.IEditorDecorationsCollection | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let chatInstance: any;
    let languageManager: LanguageManager;

    const { functionToolbarItems } = ibiz.aiChatUtil.calcAiToolbarItemsByAc(
      c.deACMode!,
    );

    watch(
      () => props.value,
      newVal => {
        if (newVal !== currentVal.value) {
          currentVal.value = newVal || '';
          editor?.setValue(currentVal.value);
        }
      },
      { immediate: true },
    );

    // 更新编辑器配置
    const updateEditorOptions = () => {
      if (!editor) {
        return;
      }
      if (props.readonly || props.disabled) {
        hasEnableEdit.value = false;
        readonlyState.value = true;
      }
      editor.updateOptions({
        readOnly: hasEnableEdit.value
          ? readonlyState.value
          : props.readonly || props.disabled,
      });
    };

    watch(() => props.readonly, updateEditorOptions, { immediate: true });

    watch(() => props.disabled, updateEditorOptions, { immediate: true });

    /**
     * 卸载代码编辑器
     */
    const unload = () => {
      editor?.dispose();
      editor = null;
      decorationsCollection?.clear();
      decorationsCollection = null;
      codeLensProviderDisposable?.dispose();
      codeLensProviderDisposable = null;
      chatInstance?.close();
    };

    /**
     * 加载AI数据
     *
     * @return {*}
     */
    const loadAIData = async () => {
      let data: IData = props.data;
      if (c.model.appDataEntityId) {
        try {
          const result = await ibiz.hub
            .getApp(c.model.appId)
            .deService.exec(
              c.model.appDataEntityId,
              'GetTempRealTimeData',
              c.context,
              c.params,
            );
          if (result.ok && result.data) data = result.data;
        } catch (error) {
          ibiz.log.warn(error as string);
        }
      }
      return data;
    };

    /**
     * 打开AI
     *
     */
    const openAIChat = async () => {
      if (!c.deACMode || !c.model.appDataEntityId) return;
      const data = await loadAIData();
      chatInstance = await ibiz.aiChatUtil.getAIChat();
      const { containerOptions, chatOptions } =
        await ibiz.aiChatUtil.getEditorExAIChatParams(
          c.editorParams,
          c.context,
          c.params,
          data,
          c.deACMode,
          { chatInstance, view: c.view, ctrl: c.ctrl },
        );
      chatInstance.create({
        containerOptions: {
          zIndex: zIndex.increment(),
          ...containerOptions,
        },
        chatOptions: {
          caption: c.deACMode.logicName,
          context: { ...c.context },
          params: { ...c.params, srfactag: c.deACMode.codeName },
          appDataEntityId: c.model.appDataEntityId,
          ...chatOptions,
          action: ((action: string, message: IData) => {
            if (action === 'backfill') emit('change', message.realcontent);
          }) as any,
        },
      });
    };

    /**
     * 检查模型是否属于当前编辑器实例
     *
     * @param {monaco.editor.ITextModel} model
     * @return {*}  {boolean}
     */
    const validate = (model: monaco.editor.ITextModel): boolean => {
      const currentEditor = monacoEditor
        .getEditors()
        .find(e => e.getModel() === model);

      if (!currentEditor || (currentEditor as any).__instanceId !== UUID)
        return false;
      return true;
    };

    /**
     * 轮询等待额外库文件名称加载完成。
     *
     * @param _monaco - Monaco 编辑器实例
     * @param _fileName - 额外库文件名称
     */
    const waitForTSFileReady = async (
      _monaco: Monaco,
      _fileName: string,
    ): Promise<void> => {
      // 获取当前已注册的额外 TypeScript 库
      const libs =
        _monaco.languages.typescript.typescriptDefaults.getExtraLibs();
      if (libs[_fileName]) return;

      isTSFileLoading.value = true;
      // 获取 TypeScript Worker 工厂方法
      const getWorker =
        await _monaco.languages.typescript.getTypeScriptWorker();
      // 获取与额外库文件对应的 Worker 实例
      const worker = await getWorker(_monaco.Uri.parse(_fileName));

      let timer: ReturnType<typeof setInterval> | null;

      /** 检查 Worker 中是否已经加载了额外库文件 */
      const checkLoaded = async () => {
        const files = await (worker as IParams).getScriptFileNames();
        if (files.includes(_fileName) && timer) {
          clearInterval(timer);
          timer = null;
          isTSFileLoading.value = false;
        }
      };

      timer = setInterval(() => {
        checkLoaded();
      }, 600);
    };

    // 工具栏更新相关逻辑
    const updateTextToolbarPos = (selection: IParams): void => {
      // 获取选中文本的位置信息
      const position = selection.getStartPosition();
      if (position) {
        // 计算工具栏位置
        const coordinates = editor?.getScrolledVisiblePosition(position);
        const editorRect = editor?.getDomNode()?.getBoundingClientRect();
        if (!editorRect || !coordinates) return;

        textTBStyle.value = {
          ...textTBStyle.value,
          // 编辑器左侧距离 + 选区距离编辑器左侧距离
          [ns.cssVarBlockName('text-editor-toolbar-left')]: `${
            editorRect.left + coordinates.left
          }px`,
          // 编辑器上方距离 + 选区距离编辑器上方距离 + 行高度
          [ns.cssVarBlockName('text-editor-toolbar-top')]: `${
            editorRect.top + coordinates.top + coordinates.height
          }px`,
        };
      }
    };

    // 设置工具栏显隐状态
    const setTextTBVisible = (): void => {
      // 只读模式或无自填模式时始终隐藏
      if (
        props.readonly ||
        !enableEdit.value ||
        !c.deACMode ||
        !c.chatCompletion
      )
        return;

      const selection = editor?.getSelection();
      textTBVisible.value = !!(selection && !selection.isEmpty());
    };

    // 处理选中文本事件
    const onSelectionChange = (e: IParams): void => {
      const selection = e.selection;
      if (selection) {
        updateTextToolbarPos(selection);
        c.currentSelection = selection;
      }
    };

    // 处理行内ai点击
    const handleLineAiClick = (_e: MouseEvent): void => {
      const position = editor?.getSelection()?.getStartPosition();
      if (!position) return;
      const coordinates = editor?.getScrolledVisiblePosition(position);
      const editorRect = editor?.getDomNode()?.getBoundingClientRect();
      const textTBHeight = textTBRef.value.offsetHeight;
      if (!coordinates || !editorRect || !textTBHeight) return;
      const items: MenuItem[] = ibiz.inLineAIUtil.calcContextMenus(
        c.deACMode,
        (tag: string) => {
          c.doInLineAIUIAction(tag, c.model.appId);
        },
      );
      if (items.length === 0) return;
      ibiz.inLineAIUtil.showContextMenus(
        // 编辑器左侧距离 + 选区距离编辑器左侧距离
        editorRect.left + coordinates.left,
        // 编辑器上方距离 + 选区距离编辑器上方距离 + 行高度 + 工具栏高度
        editorRect.top + coordinates.top + coordinates.height + textTBHeight,
        items,
      );
    };

    // 编辑器内鼠标点击事件
    const handleEditorClick = (e: MouseEvent): void => {
      if (!textTBRef.value?.contains(e.target)) {
        setTimeout(setTextTBVisible, 100); // 延迟检查，确保选择已更新
      }
    };

    // 窗口鼠标按下事件
    const handleMousedown = (e: MouseEvent): void => {
      if (textTBVisible.value && !textTBRef.value?.contains(e.target)) {
        textTBVisible.value = false;
      }
    };

    const editorInit = (): void => {
      nextTick(() => {
        isLoading.value = true;
        loader.config({
          paths: {
            vs: `${ibiz.env.pluginBaseUrl}/monaco-editor@0.52.2/min/vs`,
          },
          'vs/nls': { availableLanguages: { '*': envlanguag } },
        });
        loader
          .init()
          .then(loaderMonaco => {
            isLoading.value = false;
            // 初始化编辑器
            if (!editor) {
              monacoEditor = loaderMonaco.editor;
              const language = props.language || props.controller.language;
              languageManager = new LanguageManager(loaderMonaco, language);
              editor = monacoEditor.create(codeEditBox.value, {
                theme: languageManager.theme,
                language: language, // 语言支持自行查阅demo
                foldingStrategy: 'indentation',
                renderLineHighlight: 'all', // 行亮
                selectOnLineNumbers: true, // 显示行号
                lineNumbers: isFullScreen.value
                  ? 'on'
                  : c.hideLineNumbers
                    ? 'off'
                    : 'on',
                minimap: {
                  enabled: isFullScreen.value ? true : !c.hideMinimap,
                },
                suggest: {
                  preview: true,
                  matchOnWordStartOnly: false,
                },
                quickSuggestions: true,
                readOnly: hasEnableEdit.value
                  ? readonlyState.value
                  : props.readonly || props.disabled, // 只读
                readOnlyMessage: {
                  value: ibiz.i18n.t('editor.code.readOnlyPrompt'),
                },
                fontSize: 16, // 字体大小
                fixedOverflowWidgets: true, // 确保悬浮提示不会被裁剪
                scrollBeyondLastLine: false, // 取消代码后面一大段空白
                overviewRulerBorder: false, // 不要滚动条的边框
              });
              // 为当前编辑器实例添加自定义属性
              (editor as any).__instanceId = UUID;
              // 设置默认展开建议详情面板
              (
                editor.getContribution(
                  'editor.contrib.suggestController',
                ) as any
              )?.widget?.value?._setDetailsVisible(true);
              waitForTSFileReady(loaderMonaco, libName);
              const codeModuleCenter = new CodeModuleCenter(
                loaderMonaco,
                editor,
                {
                  libName,
                  abovelines,
                  belowlines,
                  controller: c,
                  globalVariable,
                  data: props.data,
                  inlinetriggermode,
                  setAILoadingState,
                  inlinecompletionmode,
                  functionToolbarItems,
                  enableAICompletion: ['all', 'inline'].includes(
                    completionmode,
                  ),
                },
              );
              if (c.deACMode && ['all', 'aichat'].includes(completionmode)) {
                codeLensProviderDisposable =
                  loaderMonaco.languages.registerCodeLensProvider(
                    props.language || props.controller.language,
                    {
                      provideCodeLenses: function (model, _token) {
                        if (!validate(model))
                          return { lenses: [], dispose: () => {} };
                        return {
                          lenses: [
                            {
                              id: 'AI',
                              range: new loaderMonaco.Range(1, 1, 1, 1),
                              command: {
                                title: `${c.deACMode!.logicName}`,
                                id: editor!.addCommand(0, () => openAIChat())!,
                              },
                            },
                          ],
                          dispose: () => {},
                        };
                      },
                      resolveCodeLens: (_model, codeLens, _token) => codeLens,
                    },
                  );
              }
            }

            c.onCreated(editor, loaderMonaco);

            setTimeout(() => {
              editor!.layout();
              editor!.setValue(currentVal.value);
            });

            // 创建空白提示
            const createDecorationsCollection = (): void => {
              if (decorationsCollection) decorationsCollection.clear();
              if (c.placeHolder && !editor?.getValue()) {
                decorationsCollection = editor!.createDecorationsCollection([
                  {
                    range: new loaderMonaco.Range(1, 1, 1, 1), // 影响第1行的开始位置
                    options: {
                      isWholeLine: true, // 是否作用于整行
                      beforeContentClassName: `${ns.e(
                        'first-prompt',
                      )} ghost-text-decoration`, // 在内容前加修饰 mtk8为注释样式类名
                    },
                  },
                ]);
              }
            };

            // 保存原始的 setValue 方法
            const originalSetValue = editor.setValue.bind(editor);
            // 重写 setValue 方法
            editor.setValue = (newValue: string): void => {
              // 调用原始的 setValue 方法
              originalSetValue(newValue);
              createDecorationsCollection();
            };

            // 获取焦点
            editor.onDidFocusEditorText(() => {
              decorationsCollection?.clear();
            });

            // 失去焦点
            editor.onDidBlurEditorText(() => {
              createDecorationsCollection();
            });

            // 监听值的变化
            editor.onDidChangeModelContent(() => {
              if (!hasEnableEdit.value) {
                currentVal.value = editor!.getValue();
                emit('change', currentVal.value);
              }
            });

            // 监听选择变化事件
            editor.onDidChangeCursorSelection(onSelectionChange);

            // 点击编辑器其他区域时隐藏工具栏
            editor.getDomNode()?.addEventListener('click', handleEditorClick);

            window.addEventListener('resize', () => {
              editor!.layout();
            });
          })
          .catch(() => {
            isLoading.value = false;
          });
      });
    };

    // 更改编辑状态
    const changeEditState = () => {
      readonlyState.value = !readonlyState.value;
      if (!editor) return;
      if (!readonlyState.value) {
        editor.updateOptions({
          readOnly: false,
        });
      } else {
        editor.updateOptions({
          readOnly: true,
        });
      }
    };

    // 更新全屏状态
    const changeFullScreenState = async () => {
      currentVal.value = String(editor?.getValue());
      unload();
      isFullScreen.value = !isFullScreen.value;
      editorInit();
    };

    // 绘制全屏图标
    const isAllowRenderFullScreen = () => {
      if (enableFullScreen.value)
        return (
          <span
            class={ns.be('toolbar', 'fullscreen')}
            title={ibiz.i18n.t(
              `editor.common.${isFullScreen.value ? 'minimize' : 'fullscreen'}`,
            )}
            onClick={() => changeFullScreenState()}
          >
            {isFullScreen.value ? (
              <i class='ch-icon ch-icon-minscreen' />
            ) : (
              <i class='ch-icon ch-icon-fullscreen'></i>
            )}
          </span>
        );
      return null;
    };

    // 绘制取消消息盒子
    const renderCancelMessage = () => {
      return (
        <div class={ns.be('message', 'message-content')}>
          <p>{ibiz.i18n.t('editor.common.confirmCancelPrompt')}</p>
          <p class={ns.bem('message', 'message-content', 'message-tip')}>
            {ibiz.i18n.t('editor.common.cancelEditPrompt')}
          </p>
        </div>
      );
    };

    // 取消编辑
    const cancelEdit = () => {
      if (props.value !== editor?.getValue()) {
        ElMessageBox({
          title: ibiz.i18n.t('editor.common.confirmCancel'),
          type: 'warning',
          customClass: ns.b('message'),
          message: renderCancelMessage(),
          showCancelButton: true,
          cancelButtonClass: ns.be('message', 'message-cancel'),
          confirmButtonClass: ns.be('message', 'message-comfire'),
        })
          .then(() => {
            editor?.setValue(String(props.value || ''));
            changeEditState();
          })
          .catch(() => {
            // 重新聚焦
            editor?.focus();
          });
      } else {
        changeEditState();
      }
    };

    // 确认保存
    const save = () => {
      changeEditState();
      if (editor) {
        currentVal.value = editor!.getValue();
        emit('change', currentVal.value);
      }
      if (isFullScreen.value) {
        changeFullScreenState();
      }
    };

    // 绘制底部取消确认按钮
    const renderFooter = () => {
      if (hasEnableEdit.value) {
        return (
          <div
            class={[
              ns.b('footer'),
              { [ns.b('footer-dialog')]: isFullScreen.value },
            ]}
          >
            <div class={ns.be('footer', 'cancel')} onClick={() => cancelEdit()}>
              {ibiz.i18n.t('app.cancel')}
            </div>
            <div class={ns.be('footer', 'save')} onClick={() => save()}>
              {ibiz.i18n.t('app.save')}
            </div>
          </div>
        );
      }
      return null;
    };

    // 绘制头部工具栏
    const renderHeaderToolbar = () => {
      if (hasEnableEdit.value || enableFullScreen.value) {
        return (
          <div class={ns.b('toolbar')}>
            {hasEnableEdit.value && enableEdit.value && readonlyState.value ? (
              <i
                class='fa fa-edit'
                aria-hidden='true'
                onClick={() => changeEditState()}
              ></i>
            ) : null}
            {isAllowRenderFullScreen()}
          </div>
        );
      }
      return null;
    };

    // 绘制代码框内容
    const renderCodeContent = () => {
      return (
        <div
          ref={codeEditBox}
          class={ns.e('box')}
          style={{ [ns.cssVarBlockName('placeholder')]: `"${c.placeHolder}"` }}
        >
          <div class={ns.e('loading')} v-loading={isAILoading.value}></div>
        </div>
      );
    };

    // 绘制行内文本编辑工具栏
    const renderTextEditorToolbar = () => {
      if (!textTBVisible.value) return null;
      return (
        <div
          ref='textTBRef'
          class={[ns.b('text-editor-toolbar')]}
          style={{
            ...textTBStyle.value,
          }}
        >
          <div
            class={[ns.be('text-editor-toolbar', 'item')]}
            title='AI'
            onClick={handleLineAiClick}
          >
            <svg
              version='1.1'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 1024 1024'
              width='1em'
              height='1em'
              fill='currentColor'
            >
              <path d='M274.344554 173.673875c16.429399 0 30.950568 8.00526 39.956484 20.338945a34.906655 34.906655 0 0 1 14.660796 15.754537l1.117013 2.815803 210.138065 597.927736c6.795162 19.268474-5.329083 40.817516-27.041022 48.147913-20.641469 6.95806-42.493035-1.419537-50.451753-18.803052l-1.117013-2.815803-54.477653-154.939008H134.997185L80.566074 837.039954c-6.771891 19.268474-29.856826 28.949253-51.568765 21.618855-20.641469-6.981331-32.602816-26.761769-27.925325-45.239025l0.861031-2.908888L212.047809 212.58316c4.025901-11.426112 13.799764-19.477914 25.598214-22.619512 9.029188-10.006575 22.107548-16.289773 36.67526-16.289773z m386.416675 169.460176c21.828295 0 39.723774 10.890876 41.469106 24.713912l0.116356 2.210755v461.652153c0 14.893506-18.616883 26.947938-41.585462 26.947938-21.805024 0-39.700503-10.890876-41.422565-24.737183l-0.162897-2.210755V370.081989c0-14.870235 18.616883-26.924667 41.585462-26.924667z m-389.697901-48.171184L163.620643 600.628812h214.88537l-107.442685-305.665945z m602.163076-206.181978a12.566396 12.566396 0 0 1 8.144887 8.051802l32.509731 99.041817 101.694723 36.07021a12.566396 12.566396 0 0 1-0.791218 23.922695l-99.53051 27.995137-30.857483 97.552467a12.566396 12.566396 0 0 1-23.899423 0.116355l-32.509732-99.018546-98.669479-31.322905a12.566396 12.566396 0 0 1-0.186169-23.876152l97.505924-32.812256 30.834212-97.529195a12.566396 12.566396 0 0 1 15.754537-8.191429zM649.544557 0.513593c2.676177 0.884302 4.770576 3.025243 5.608336 5.724692l18.523798 59.294772 60.970292 20.66474a8.796477 8.796477 0 0 1-0.325796 16.755194l-60.73758 18.058377-19.780438 59.550754a8.796477 8.796477 0 0 1-16.731924-0.162898l-18.523798-59.271501-59.062061-17.825665a8.796477 8.796477 0 0 1-0.395609-16.708653l59.574025-20.943993 19.780438-59.574025a8.796477 8.796477 0 0 1 11.100317-5.561794z'></path>
            </svg>
          </div>
        </div>
      );
    };

    onMounted(() => {
      editorInit();
      window.addEventListener('mousedown', handleMousedown.bind(this));
    });

    onUnmounted(() => {
      unload();
      window.removeEventListener('mousedown', handleMousedown.bind(this));
    });

    return {
      ns,
      isLoading,
      currentVal,
      codeEditBox,
      isFullScreen,
      hasEnableEdit,
      readonlyState,
      isTSFileLoading,
      textTBRef,
      renderFooter,
      renderCodeContent,
      renderHeaderToolbar,
      renderTextEditorToolbar,
      changeFullScreenState,
    };
  },
  render() {
    const isLoading = !this.controller.view?.state?.isLoading && this.isLoading;
    return !this.isFullScreen ? (
      <div
        class={[
          this.ns.b(),
          { [this.ns.b('editor-readonly')]: this.readonlyState },
          { [this.ns.b('editor-enable')]: !this.readonlyState },
        ]}
        v-loading={isLoading}
      >
        {this.renderTextEditorToolbar()}
        {this.renderHeaderToolbar()}
        {this.renderCodeContent()}
        {this.hasEnableEdit && !this.readonlyState ? this.renderFooter() : null}
      </div>
    ) : (
      <el-dialog
        v-model={this.isFullScreen}
        class={this.ns.b('dialog-full-screen')}
        onClose={() => this.changeFullScreenState()}
      >
        <div
          class={[
            this.ns.b(),
            { [this.ns.b('editor-readonly')]: this.readonlyState },
            { [this.ns.b('editor-enable')]: !this.readonlyState },
          ]}
          v-loading={isLoading}
        >
          {this.renderTextEditorToolbar()}
          {this.renderHeaderToolbar()}
          {this.renderCodeContent()}
          {this.hasEnableEdit && !this.readonlyState
            ? this.renderFooter()
            : null}
        </div>
      </el-dialog>
    );
  },
});
