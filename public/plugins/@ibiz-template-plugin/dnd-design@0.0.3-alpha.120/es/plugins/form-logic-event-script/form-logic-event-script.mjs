import { ref, watch, nextTick, onMounted, onUnmounted, createVNode, resolveDirective, withDirectives, defineComponent } from 'vue';
import { getCodeProps, getEditorEmits, useNamespace, useUIStore } from '@ibiz-template/vue3-util';
import { createUUID } from 'qx-util';
import '../../node_modules/.pnpm/@monaco-editor_loader@1.4.0_monaco-editor@0.52.2/node_modules/@monaco-editor/loader/lib/es/index.mjs';
import { StringUtil, CoreConst, getAppCookie, IBizContext } from '@ibiz-template/core';
import { UIActionUtil, SysUIActionTag } from '@ibiz-template/runtime';
import { calcAiToolbarItemsByAc } from './util.mjs';
import { CodeModuleCenter } from './module/index.mjs';
import './form-logic-event-script.css';
import loader from '../../node_modules/.pnpm/@monaco-editor_loader@1.4.0_monaco-editor@0.52.2/node_modules/@monaco-editor/loader/lib/es/loader/index.mjs';

"use strict";
const FormLogicEventScript = /* @__PURE__ */ defineComponent({
  name: "IBizFormLogicEventScript",
  props: getCodeProps(),
  emits: getEditorEmits(),
  setup(props) {
    const ns = useNamespace("form-logic-event-script");
    const c = props.controller;
    const codeEditBox = ref();
    const UUID = createUUID();
    let editor;
    let monacoEditor;
    let codeModuleCenter;
    let codeLensProviderDisposable;
    let inlineCompletionsProviderDisposable;
    let decorationsCollection;
    let chatInstance;
    const libName = "ibiz-global.d.ts";
    const isTSFileLoading = ref(false);
    const isLoading = ref(false);
    const {
      UIStore,
      zIndex
    } = useUIStore();
    const getMonacoTheme = (name) => {
      return name === "dark" ? "vs-".concat(UIStore.theme) : "vs";
    };
    watch(() => UIStore.theme, (newVal) => {
      monacoEditor.setTheme(getMonacoTheme(newVal));
    });
    watch([() => props.readonly, () => props.disabled], () => {
      editor == null ? void 0 : editor.updateOptions({
        readOnly: props.readonly || props.disabled
      });
    }, {
      immediate: true
    });
    const unload = () => {
      editor == null ? void 0 : editor.dispose();
      editor = null;
      decorationsCollection == null ? void 0 : decorationsCollection.clear();
      decorationsCollection = null;
      codeLensProviderDisposable == null ? void 0 : codeLensProviderDisposable.dispose();
      codeLensProviderDisposable = null;
      inlineCompletionsProviderDisposable == null ? void 0 : inlineCompletionsProviderDisposable.dispose();
      inlineCompletionsProviderDisposable = null;
      chatInstance == null ? void 0 : chatInstance.close();
    };
    const loadAIData = async () => {
      let data = props.data;
      if (c.model.appDataEntityId) {
        try {
          const result = await ibiz.hub.getApp(c.model.appId).deService.exec(c.model.appDataEntityId, "GetTempRealTimeData", c.context, c.params);
          if (result.ok && result.data)
            data = result.data;
        } catch (error) {
          ibiz.message.error(error);
        }
      }
      return data;
    };
    const openAIChat = async () => {
      if (!c.deACMode || !c.model.appDataEntityId)
        return;
      const {
        contentToolbarItems,
        footerToolbarItems,
        questionToolbarItems,
        otherToolbarItems
      } = calcAiToolbarItemsByAc(c.deACMode);
      let curData;
      if (c.editorParams.srfaiappendcurdata === "true")
        curData = await loadAIData();
      const module = await import('@ibiz-template-plugin/ai-chat');
      chatInstance = module.chat || module.default.chat;
      let id = "";
      let abortController;
      chatInstance.create({
        containerOptions: {
          zIndex: zIndex.increment()
        },
        chatOptions: {
          caption: c.deACMode.logicName,
          context: {
            ...c.context
          },
          params: {
            ...c.params,
            srfactag: c.deACMode.codeName
          },
          // 编辑器参数srfaiappendcurdata，是否传入对象参数，用于历史查询传参
          appendCurData: curData,
          // 编辑器参数srfaiappendcurcontent，传入编辑内容作为用户消息,获取历史数据后附加
          appendCurContent: c.editorParams.srfaiappendcurcontent ? StringUtil.fill(c.editorParams.srfaiappendcurcontent, c.context, c.params, curData) : void 0,
          appDataEntityId: c.model.appDataEntityId,
          contentToolbarItems,
          footerToolbarItems,
          questionToolbarItems,
          otherToolbarItems,
          question: async (aiChat, ctx, param, other, arr) => {
            id = createUUID();
            abortController = new AbortController();
            const deService = await ibiz.hub.getApp(ctx.srfappid).deService.getService(ctx, other.appDataEntityId);
            try {
              await deService.aiChatSse((msg) => {
                if (msg.actionstate === 20 && msg.actionresult) {
                  aiChat.addMessage({
                    messageid: id,
                    state: msg.actionstate,
                    type: "DEFAULT",
                    role: "ASSISTANT",
                    content: msg.actionresult
                  });
                } else if (msg.actionstate === 30 && msg.actionresult) {
                  const result = JSON.parse(msg.actionresult);
                  const choices = result.choices;
                  if (choices && choices.length > 0) {
                    aiChat.replaceMessage({
                      messageid: id,
                      state: msg.actionstate,
                      type: "DEFAULT",
                      role: "ASSISTANT",
                      content: choices[0].content || ""
                    });
                  }
                } else if (msg.actionstate === 40) {
                  aiChat.replaceMessage({
                    messageid: id,
                    state: msg.actionstate,
                    type: "ERROR",
                    role: "ASSISTANT",
                    content: msg.actionresult
                  });
                }
              }, abortController, ctx, param, {
                messages: arr
              });
            } catch (error) {
              aiChat.replaceMessage({
                messageid: id,
                state: 40,
                type: "ERROR",
                role: "ASSISTANT",
                content: error.message || ibiz.i18n.t("app.aiError")
              });
              abortController == null ? void 0 : abortController.abort();
            } finally {
              aiChat.completeMessage(id, true);
              return true;
            }
          },
          abortQuestion: async (aiChat) => {
            abortController == null ? void 0 : abortController.abort();
            await aiChat.stopMessage({
              messageid: id,
              state: 30,
              type: "DEFAULT",
              role: "ASSISTANT",
              content: ""
            });
            await aiChat.completeMessage(id, true);
          },
          action: (action, message) => {
            if (action === "backfill")
              editor.setValue(message.realcontent);
          },
          history: async (ctx, param, other) => {
            const deService = await ibiz.hub.getApp(ctx.srfappid).deService.getService(ctx, other.appDataEntityId);
            const historyData = other.appendCurData ? other.appendCurData : {};
            const result = await deService.aiChatHistory(ctx, param, historyData);
            if (result.data && Array.isArray(result.data)) {
              let preMsg;
              result.data.forEach((item) => {
                if (item.role === "TOOL") {
                  if (preMsg && item.content) {
                    chatInstance.aiChat.updateRecommendPrompt(preMsg, item.content);
                  }
                } else {
                  const msg = {
                    messageid: createUUID(),
                    state: 30,
                    type: "DEFAULT",
                    role: item.role,
                    content: item.content,
                    completed: true
                  };
                  preMsg = msg;
                  chatInstance.aiChat.addMessage(msg);
                }
              });
            }
            return true;
          },
          recommendPrompt: async (ctx, param, other) => {
            const deService = await ibiz.hub.getApp(ctx.srfappid).deService.getService(ctx, other.appDataEntityId);
            const result = await deService.aiChatRecommendPrompt(ctx, param, other.message);
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
            onUpload: async (file, reportProgress, options) => {
              const fileMeata = ibiz.util.file.calcFileUpDownUrl((options == null ? void 0 : options.context) || c.context, (options == null ? void 0 : options.params) || c.params, {});
              const uploadHeaders = {};
              const token = getAppCookie(CoreConst.TOKEN);
              if (token) {
                Object.assign(uploadHeaders, {
                  ["".concat(ibiz.env.tokenHeader, "Authorization")]: "".concat(ibiz.env.tokenPrefix, "Bearer ").concat(token)
                });
              }
              const formData = new FormData();
              formData.append("file", file);
              const res = await ibiz.net.axios({
                url: fileMeata.uploadUrl,
                method: "post",
                headers: uploadHeaders,
                data: formData,
                onUploadProgress: (progressEvent) => {
                  const percent = progressEvent.loaded / progressEvent.total * 100;
                  reportProgress(percent);
                }
              });
              return res.data;
            }
          },
          extendToolbarClick: async (event, source, context, params, data) => {
            var _a, _b;
            const result = await UIActionUtil.exec(source.id, {
              view: c.view,
              ctrl: c.ctrl,
              context: IBizContext.create(context),
              params,
              data: [data],
              event
            }, source.appId);
            if (result.closeView) {
              c.view.closeView({
                ok: true
              });
            } else if (result.refresh) {
              switch (result.refreshMode) {
                case 1:
                  c.view.callUIAction(SysUIActionTag.REFRESH);
                  break;
                case 2:
                  (_a = c.view.parentView) == null ? void 0 : _a.callUIAction(SysUIActionTag.REFRESH);
                  break;
                case 3:
                  (_b = c.view.getTopView()) == null ? void 0 : _b.callUIAction(SysUIActionTag.REFRESH);
                  break;
                default:
              }
            }
            return result;
          }
        }
      });
    };
    const validate = (model) => {
      const currentEditor = monacoEditor.getEditors().find((e) => e.getModel() === model);
      if (!currentEditor || currentEditor.__instanceId !== UUID)
        return false;
      return true;
    };
    const waitForTSFileReady = async (_monaco, _fileName) => {
      const libs = _monaco.languages.typescript.typescriptDefaults.getExtraLibs();
      if (libs[_fileName])
        return;
      isTSFileLoading.value = true;
      const getWorker = await _monaco.languages.typescript.getTypeScriptWorker();
      const worker = await getWorker(_monaco.Uri.parse(_fileName));
      let timer;
      const checkLoaded = async () => {
        const files = await worker.getScriptFileNames();
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
    const editorInit = () => {
      nextTick(() => {
        isLoading.value = true;
        loader.config({
          paths: {
            vs: "".concat(ibiz.env.pluginBaseUrl, "/monaco-editor@0.52.2/min/vs")
          }
        });
        loader.init().then((loaderMonaco) => {
          var _a, _b, _c;
          isLoading.value = false;
          if (!editor) {
            codeModuleCenter = new CodeModuleCenter(loaderMonaco, {
              id: c.model.id,
              data: props.data,
              context: c.context,
              params: c.params,
              language: props.controller.language,
              libName,
              globalVariable: c.globalVariable
            });
            monacoEditor = loaderMonaco.editor;
            editor = monacoEditor.create(codeEditBox.value, {
              language: props.controller.language,
              theme: codeModuleCenter.theme.themeName,
              foldingStrategy: "indentation",
              renderLineHighlight: "all",
              // 行亮
              selectOnLineNumbers: true,
              // 显示行号
              minimap: {
                enabled: false
              },
              suggest: {
                preview: true,
                matchOnWordStartOnly: false
              },
              quickSuggestions: true,
              readOnly: props.readonly || props.disabled,
              // 只读
              readOnlyMessage: {
                value: ibiz.i18n.t("editor.code.readOnlyPrompt")
              },
              fontSize: 16,
              // 字体大小
              fixedOverflowWidgets: true,
              // 确保悬浮提示不会被裁剪
              scrollBeyondLastLine: false,
              // 取消代码后面一大段空白
              overviewRulerBorder: false
              // 不要滚动条的边框
            });
            editor.__instanceId = UUID;
            (_c = (_b = (_a = editor.getContribution("editor.contrib.suggestController")) == null ? void 0 : _a.widget) == null ? void 0 : _b.value) == null ? void 0 : _c._setDetailsVisible(true);
            waitForTSFileReady(loaderMonaco, libName);
            codeModuleCenter.initModules(editor);
            if (c.deACMode) {
              codeLensProviderDisposable = loaderMonaco.languages.registerCodeLensProvider(props.controller.language, {
                provideCodeLenses: function(model, _token) {
                  if (!validate(model))
                    return {
                      lenses: [],
                      dispose: () => {
                      }
                    };
                  return {
                    lenses: [{
                      id: "AI",
                      range: new loaderMonaco.Range(1, 1, 1, 1),
                      command: {
                        title: "".concat(c.deACMode.logicName),
                        id: editor.addCommand(0, () => openAIChat())
                      }
                    }],
                    dispose: () => {
                    }
                  };
                },
                resolveCodeLens: (_model, codeLens, _token) => codeLens
              });
            }
          }
          setTimeout(() => {
            var _a2;
            editor.layout();
            editor.setValue((_a2 = c.logicData) == null ? void 0 : _a2.condvalue);
          });
          const createDecorationsCollection = () => {
            if (decorationsCollection)
              decorationsCollection.clear();
            if (c.placeHolder && !(editor == null ? void 0 : editor.getValue())) {
              decorationsCollection = editor.createDecorationsCollection([{
                range: new loaderMonaco.Range(1, 1, 1, 1),
                // 影响第1行的开始位置
                options: {
                  isWholeLine: true,
                  // 是否作用于整行
                  beforeContentClassName: "".concat(ns.e("first-prompt"), " ghost-text-decoration")
                  // 在内容前加修饰 mtk8为注释样式类名
                }
              }]);
            }
          };
          const originalSetValue = editor.setValue.bind(editor);
          editor.setValue = (newValue) => {
            originalSetValue(newValue);
            createDecorationsCollection();
          };
          editor.onDidFocusEditorText(() => {
            decorationsCollection == null ? void 0 : decorationsCollection.clear();
          });
          editor.onDidBlurEditorText(() => {
            createDecorationsCollection();
          });
          editor.onDidChangeModelContent(() => {
            const value = editor.getValue();
            c.saveScriptContent(value);
          });
          window.addEventListener("resize", () => {
            editor.layout();
          });
        }).catch(() => {
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
      codeEditBox
    };
  },
  render() {
    return withDirectives(createVNode("div", {
      "class": [this.ns.b()]
    }, [createVNode("div", {
      "ref": "codeEditBox",
      "class": this.ns.e("box")
    }, null)]), [[resolveDirective("loading"), this.isLoading]]);
  }
});

export { FormLogicEventScript };
