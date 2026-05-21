"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class WorkerManager {
  /**
   * Creates an instance of ManagedWorker.
   * @memberof ManagedWorker
   */
  constructor() {
    /**
     * @description worker实例
     * @private
     * @type {(Worker | null)}
     * @memberof WorkerManager
     */
    __publicField(this, "worker");
    /**
     * @description blobUrl
     * @private
     * @type {(string | null)}
     * @memberof WorkerManager
     */
    __publicField(this, "blobUrl");
    const blob = new Blob([this.workerCode], {
      type: "application/javascript"
    });
    this.blobUrl = URL.createObjectURL(blob);
    this.worker = new Worker(this.blobUrl);
  }
  /**
   * @description worker线程代码
   * @readonly
   * @private
   * @type {string}
   * @memberof WorkerManager
   */
  get workerCode() {
    return "\n      let abortController = null;\n      self.onmessage = async event => {\n        const { url, body, headers, method, enableAbort } = event.data;\n        try {\n          if (abortController) abortController.abort();\n          if (enableAbort) abortController = new AbortController();\n          const response = await fetch(url, {\n            body,\n            headers,\n            method,\n            signal: abortController?.signal,\n          });\n          if (response.ok) {\n            const data = await response.json();\n            self.postMessage({\n              type: 'success',\n              data,\n            });\n          } else {\n            self.postMessage({\n              type: 'error',\n              error: response.message,\n            });\n          }\n        } catch (error) {\n         // \u4E0D\u662F\u53D6\u6D88\u64CD\u4F5C\u7684\u9519\u8BEF\u624D\u629B\u51FA\n         if (error.name !== 'AbortError') {\n          self.postMessage({\n            type: 'error',\n            error: error.message,\n          });\n         }\n        } finally {\n          abortController = null;\n        }\n      };\n    ";
  }
  /**
   * @description post请求
   * @param {IWorkerMessage} message
   * @returns {*}  {Promise<{ ok: boolean, data: any }>}
   * @memberof WorkerManager
   */
  async post(message) {
    if (!this.worker)
      return { ok: false, data: void 0 };
    return new Promise((resolve) => {
      this.worker.postMessage({
        ...message,
        method: "POST"
      });
      this.worker.onmessage = (event) => {
        const { type, data } = event.data;
        const result = {
          ok: type === "success",
          data: type === "success" ? data : void 0
        };
        resolve(result);
      };
      this.worker.onerror = () => {
        resolve({ ok: false, data: void 0 });
      };
    });
  }
  /**
   * @description 销毁
   * @memberof WorkerManager
   */
  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }
  }
}

export { WorkerManager };
