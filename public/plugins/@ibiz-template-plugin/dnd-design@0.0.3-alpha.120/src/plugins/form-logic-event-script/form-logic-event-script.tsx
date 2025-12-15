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
import {
  CoreConst,
  StringUtil,
  IBizContext,
  IChatMessage,
  getAppCookie,
  IPortalAsyncAction,
} from '@ibiz-template/core';
import { SysUIActionTag, UIActionUtil } from '@ibiz-template/runtime';
import * as monaco from 'monaco-editor';
import { AxiosProgressEvent } from 'axios';
import { calcAiToolbarItemsByAc } from './util';
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
        const {
          contentToolbarItems,
          footerToolbarItems,
          questionToolbarItems,
          otherToolbarItems,
        } = calcAiToolbarItemsByAc(c.deACMode);
        let curData: IData | undefined;
        if (c.editorParams.srfaiappendcurdata === 'true')
          curData = await loadAIData();
        const module = await import('@ibiz-template-plugin/ai-chat');
        chatInstance = module.chat || module.default.chat;
        let id: string = '';
        let abortController: AbortController;
        chatInstance.create({
          containerOptions: {
            zIndex: zIndex.increment(),
          },
          chatOptions: {
            caption: c.deACMode.logicName,
            context: { ...c.context },
            params: { ...c.params, srfactag: c.deACMode.codeName },
            // 编辑器参数srfaiappendcurdata，是否传入对象参数，用于历史查询传参
            appendCurData: curData,
            // 编辑器参数srfaiappendcurcontent，传入编辑内容作为用户消息,获取历史数据后附加
            appendCurContent: c.editorParams.srfaiappendcurcontent
              ? StringUtil.fill(
                  c.editorParams.srfaiappendcurcontent,
                  c.context,
                  c.params,
                  curData,
                )
              : undefined,
            appDataEntityId: c.model.appDataEntityId,
            contentToolbarItems,
            footerToolbarItems,
            questionToolbarItems,
            otherToolbarItems,
            question: async (
              aiChat: any,
              ctx: IContext,
              param: IParams,
              other: IParams,
              arr: IChatMessage[],
            ) => {
              id = createUUID();
              abortController = new AbortController();
              const deService = await ibiz.hub
                .getApp(ctx.srfappid)
                .deService.getService(ctx, other.appDataEntityId);
              try {
                await deService.aiChatSse(
                  (msg: IPortalAsyncAction) => {
                    // 20: 持续回答中，消息会持续推送。同一个消息 id 会显示在同一个框内
                    if (msg.actionstate === 20 && msg.actionresult) {
                      aiChat.addMessage({
                        messageid: id,
                        state: msg.actionstate,
                        type: 'DEFAULT',
                        role: 'ASSISTANT',
                        content: msg.actionresult as string,
                      });
                    }
                    // 30: 回答完成，包含具体所有消息内容。直接覆盖之前的临时拼接消息
                    else if (msg.actionstate === 30 && msg.actionresult) {
                      const result = JSON.parse(msg.actionresult as string);
                      const choices = result.choices;
                      if (choices && choices.length > 0) {
                        aiChat.replaceMessage({
                          messageid: id,
                          state: msg.actionstate,
                          type: 'DEFAULT',
                          role: 'ASSISTANT',
                          content: choices[0].content || '',
                        });
                      }
                    }
                    // 40: 回答报错，展示错误信息
                    else if (msg.actionstate === 40) {
                      aiChat.replaceMessage({
                        messageid: id,
                        state: msg.actionstate,
                        type: 'ERROR',
                        role: 'ASSISTANT',
                        content: msg.actionresult as string,
                      });
                    }
                  },
                  abortController,
                  ctx,
                  param,
                  {
                    messages: arr,
                  },
                );
              } catch (error) {
                aiChat.replaceMessage({
                  messageid: id,
                  state: 40,
                  type: 'ERROR',
                  role: 'ASSISTANT',
                  content:
                    (error as IData).message || ibiz.i18n.t('app.aiError'),
                });
                abortController?.abort();
              } finally {
                // 标记当前消息已经交互完成
                aiChat.completeMessage(id, true);
                return true;
              }
            },
            abortQuestion: async (aiChat: any) => {
              abortController?.abort();
              await aiChat.stopMessage({
                messageid: id,
                state: 30,
                type: 'DEFAULT',
                role: 'ASSISTANT',
                content: '',
              });
              // 标记当前消息已经交互完成
              await aiChat.completeMessage(id, true);
            },
            action: ((action: string, message: IData) => {
              if (action === 'backfill') editor!.setValue(message.realcontent);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any,
            history: async (ctx: IContext, param: IParams, other: IParams) => {
              const deService = await ibiz.hub
                .getApp(ctx.srfappid)
                .deService.getService(ctx, other.appDataEntityId);
              const historyData = other.appendCurData
                ? other.appendCurData
                : {};
              const result = await deService.aiChatHistory(
                ctx,
                param,
                historyData,
              );
              if (result.data && Array.isArray(result.data)) {
                let preMsg: IData | undefined;
                result.data.forEach(item => {
                  if (item.role === 'TOOL') {
                    if (preMsg && item.content) {
                      chatInstance.aiChat!.updateRecommendPrompt(
                        preMsg as any,
                        item.content,
                      );
                    }
                  } else {
                    const msg = {
                      messageid: createUUID(),
                      state: 30,
                      type: 'DEFAULT',
                      role: item.role,
                      content: item.content,
                      completed: true,
                    } as const;
                    preMsg = msg;
                    chatInstance.aiChat!.addMessage(msg);
                  }
                });
              }
              return true;
            },
            recommendPrompt: async (
              ctx: IContext,
              param: IParams,
              other: IParams,
            ) => {
              const deService = await ibiz.hub
                .getApp(ctx.srfappid)
                .deService.getService(ctx, other.appDataEntityId);
              const result = await deService.aiChatRecommendPrompt(
                ctx,
                param,
                other.message,
              );
              if (result.ok && result.data) {
                const choices = result.data.choices;
                if (choices && choices.length > 0) {
                  return choices[0];
                }
                return null;
              }
              return null;
            },
            uploader: {
              onUpload: async (
                file: File,
                reportProgress: (progress: number) => void,
                options?: IData,
              ) => {
                const fileMeata = ibiz.util.file.calcFileUpDownUrl(
                  options?.context || c.context,
                  options?.params || c.params,
                  {},
                );
                const uploadHeaders = {};
                const token = getAppCookie(CoreConst.TOKEN);
                if (token) {
                  Object.assign(uploadHeaders, {
                    [`${ibiz.env.tokenHeader}Authorization`]: `${ibiz.env.tokenPrefix}Bearer ${token}`,
                  });
                }
                const formData = new FormData();
                formData.append('file', file);
                const res = await ibiz.net.axios({
                  url: fileMeata.uploadUrl,
                  method: 'post',
                  headers: uploadHeaders,
                  data: formData,
                  onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    const percent =
                      (progressEvent.loaded / progressEvent.total!) * 100;
                    reportProgress(percent);
                  },
                });
                return res.data;
              },
            },
            extendToolbarClick: async (
              event: MouseEvent,
              source: IData,
              context: IData,
              params: IData,
              data: IData,
            ) => {
              const result = await UIActionUtil.exec(
                source.id,
                {
                  view: c.view,
                  ctrl: c.ctrl,
                  context: IBizContext.create(context),
                  params,
                  data: [data],
                  event,
                },
                source.appId,
              );
              if (result.closeView) {
                // 修复编辑器失焦后，调整数据后直接点击关闭按钮导致无法触发自动保存
                // params.view.modal.ignoreDismissCheck = true;
                c.view.closeView({ ok: true });
              } else if (result.refresh) {
                switch (result.refreshMode) {
                  case 1:
                    c.view.callUIAction(SysUIActionTag.REFRESH);
                    break;
                  case 2:
                    c.view.parentView?.callUIAction(SysUIActionTag.REFRESH);
                    break;
                  case 3:
                    c.view.getTopView()?.callUIAction(SysUIActionTag.REFRESH);
                    break;
                  default:
                }
              }
              return result;
            },
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
                  minimap: {
                    enabled: false,
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
