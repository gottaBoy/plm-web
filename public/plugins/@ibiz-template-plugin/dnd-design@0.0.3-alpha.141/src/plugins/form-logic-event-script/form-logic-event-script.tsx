/* eslint-disable no-unsafe-finally */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  getCodeProps,
  useNamespace,
  getEditorEmits,
} from '@ibiz-template/vue3-util';
import { createUUID } from 'qx-util';
import loader from '@monaco-editor/loader';
import * as monaco from 'monaco-editor';
import { CodeModuleCenter } from './module';
import { Monaco } from './module/interface';
import { FormLogicEventScriptEditorController } from './form-logic-event-script.controller';
import './form-logic-event-script.scss';

export const FormLogicEventScript: ReturnType<typeof defineComponent> =
  defineComponent({
    name: 'IBizFormLogicEventScript',
    props: getCodeProps<FormLogicEventScriptEditorController>(),
    emits: getEditorEmits(),
    setup(props) {
      const ns = useNamespace('form-logic-event-script');
      const c = props.controller;
      const codeEditBox = ref();
      const UUID = createUUID();
      let editor: monaco.editor.IStandaloneCodeEditor | null;
      let monacoEditor: typeof monaco.editor;
      let codeModuleCenter: CodeModuleCenter | null;
      let codeLensProviderDisposable: monaco.IDisposable | null;
      let inlineCompletionsProviderDisposable: monaco.IDisposable | null;
      let decorationsCollection: monaco.editor.IEditorDecorationsCollection | null;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let chatInstance: any;
      // 额外库文件名称
      const libName = 'ibiz-global.d.ts';
      // 语言初始化是否在加载中
      const isTSFileLoading = ref(false);
      // 是否加载中
      const isLoading = ref(false);

      const { UIStore, zIndex } = useUIStore();

      // 编辑器主题
      const getMonacoTheme = (name: string): string => {
        return name === 'dark' ? `vs-${UIStore.theme}` : 'vs'; // 官方自带三种主题vs, hc-black, or vs-dark
      };

      watch(
        () => UIStore.theme,
        newVal => {
          monacoEditor.setTheme(getMonacoTheme(newVal));
        },
      );

      watch(
        [(): boolean => props.readonly, (): boolean => props.disabled],
        () => {
          editor?.updateOptions({
            readOnly: props.readonly || props.disabled,
          });
        },
        {
          immediate: true,
        },
      );

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
        inlineCompletionsProviderDisposable?.dispose();
        inlineCompletionsProviderDisposable = null;
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
            ibiz.message.error(error as string);
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
        chatInstance = await (ibiz as any).aiChatUtil.getAIChat();
        const { containerOptions, chatOptions } = await (
          ibiz as any
        ).aiChatUtil.getEditorExAIChatParams(
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
              if (action === 'backfill') editor!.setValue(message.realcontent);
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

      const editorInit = (): void => {
        nextTick(() => {
          isLoading.value = true;
          loader.config({
            paths: {
              vs: `${ibiz.env.pluginBaseUrl}/monaco-editor@0.52.2/min/vs`,
            },
          });
          loader
            .init()
            .then(loaderMonaco => {
              isLoading.value = false;
              // 初始化编辑器
              if (!editor) {
                codeModuleCenter = new CodeModuleCenter(loaderMonaco, {
                  id: c.model.id!,
                  data: props.data,
                  context: c.context,
                  params: c.params,
                  language: props.controller.language,
                  libName,
                  globalVariable: c.globalVariable,
                });
                monacoEditor = loaderMonaco.editor;
                editor = monacoEditor.create(codeEditBox.value, {
                  language: props.controller.language,
                  theme: codeModuleCenter.theme.themeName,
                  foldingStrategy: 'indentation',
                  renderLineHighlight: 'all', // 行亮
                  selectOnLineNumbers: true, // 显示行号
                  lineNumbers: c.hideLineNumbers ? 'off' : 'on',
                  minimap: {
                    enabled: !c.hideMinimap,
                  },
                  suggest: {
                    preview: true,
                    matchOnWordStartOnly: false,
                  },
                  quickSuggestions: true,
                  readOnly: props.readonly || props.disabled, // 只读
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
                codeModuleCenter.initModules(editor);
                if (c.deACMode) {
                  codeLensProviderDisposable =
                    loaderMonaco.languages.registerCodeLensProvider(
                      props.controller.language,
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
                                  id: editor!.addCommand(0, () =>
                                    openAIChat(),
                                  )!,
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
              setTimeout(() => {
                editor!.layout();
                editor!.setValue(c.logicData?.condvalue);
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
                const value = editor!.getValue();
                c.saveScriptContent(value);
              });

              window.addEventListener('resize', () => {
                editor!.layout();
              });
            })
            .catch(() => {
              isLoading.value = false;
            });
        });
      };

      onMounted(() => {
        editorInit();
      });

      onUnmounted(() => {
        unload();
      });

      return {
        ns,
        isLoading,
        codeEditBox,
      };
    },
    render() {
      return (
        <div class={[this.ns.b()]} v-loading={this.isLoading}>
          <div ref='codeEditBox' class={this.ns.e('box')}></div>
        </div>
      );
    },
  });
