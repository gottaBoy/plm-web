import { ref, watch, nextTick, onMounted, onUnmounted, createVNode, resolveDirective, withDirectives, defineComponent } from 'vue';
import { getCodeProps, getEditorEmits, useNamespace, useUIStore } from '@ibiz-template/vue3-util';
import { createUUID } from 'qx-util';
import '../../node_modules/.pnpm/@monaco-editor_loader@1.4.0_monaco-editor@0.52.2/node_modules/@monaco-editor/loader/lib/es/index.mjs';
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
      const data = await loadAIData();
      chatInstance = await ibiz.aiChatUtil.getAIChat();
      const {
        containerOptions,
        chatOptions
      } = await ibiz.aiChatUtil.getEditorExAIChatParams(c.editorParams, c.context, c.params, data, c.deACMode, {
        chatInstance,
        view: c.view,
        ctrl: c.ctrl
      });
      chatInstance.create({
        containerOptions: {
          zIndex: zIndex.increment(),
          ...containerOptions
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
          appDataEntityId: c.model.appDataEntityId,
          ...chatOptions,
          action: (action, message) => {
            if (action === "backfill")
              editor.setValue(message.realcontent);
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
              lineNumbers: c.hideLineNumbers ? "off" : "on",
              minimap: {
                enabled: !c.hideMinimap
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
