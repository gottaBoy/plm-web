/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @description worker 消息接口
 * @export
 * @interface IWorkerMessage
 */
export interface IWorkerMessage {
  /**
   * @description 请求路径
   * @type {string}
   * @memberof IWorkerMessage
   */
  url: string;
  /**
   * @description 请求体
   * @type {(string | null)}
   * @memberof IWorkerMessage
   */
  body: string | null;
  /**
   * @description 请求头
   * @type {HeadersInit}
   * @memberof IWorkerMessage
   */
  headers: HeadersInit;
  /**
   * @description 是否启用中断
   * @type {boolean}
   * @memberof IWorkerMessage
   */
  enableAbort: boolean;
}

/**
 * @description  Worker管理器
 * @export
 * @class WorkerManager
 */
export class WorkerManager {
  /**
   * @description worker实例
   * @private
   * @type {(Worker | null)}
   * @memberof WorkerManager
   */
  private worker: Worker | null;

  /**
   * @description blobUrl
   * @private
   * @type {(string | null)}
   * @memberof WorkerManager
   */
  private blobUrl: string | null;

  /**
   * @description worker线程代码
   * @readonly
   * @private
   * @type {string}
   * @memberof WorkerManager
   */
  private get workerCode(): string {
    return `
      let abortController = null;
      self.onmessage = async event => {
        const { url, body, headers, method, enableAbort } = event.data;
        try {
          if (abortController) abortController.abort();
          if (enableAbort) abortController = new AbortController();
          const response = await fetch(url, {
            body,
            headers,
            method,
            signal: abortController?.signal,
          });
          if (response.ok) {
            const data = await response.json();
            self.postMessage({
              type: 'success',
              data,
            });
          } else {
            self.postMessage({
              type: 'error',
              error: response.message,
            });
          }
        } catch (error) {
         // 不是取消操作的错误才抛出
         if (error.name !== 'AbortError') {
          self.postMessage({
            type: 'error',
            error: error.message,
          });
         }
        } finally {
          abortController = null;
        }
      };
    `;
  }

  /**
   * Creates an instance of ManagedWorker.
   * @memberof ManagedWorker
   */
  constructor() {
    const blob = new Blob([this.workerCode], {
      type: 'application/javascript',
    });
    this.blobUrl = URL.createObjectURL(blob);
    this.worker = new Worker(this.blobUrl);
  }

  /**
   * @description post请求
   * @param {IWorkerMessage} message
   * @returns {*}  {Promise<{ ok: boolean, data: any }>}
   * @memberof WorkerManager
   */
  async post(message: IWorkerMessage): Promise<{ ok: boolean; data: any }> {
    if (!this.worker) return { ok: false, data: undefined };
    return new Promise(resolve => {
      this.worker!.postMessage({
        ...message,
        method: 'POST',
      });
      this.worker!.onmessage = event => {
        const { type, data } = event.data;
        const result = {
          ok: type === 'success',
          data: type === 'success' ? data : undefined,
        };
        resolve(result);
      };
      this.worker!.onerror = () => {
        resolve({ ok: false, data: undefined });
      };
    });
  }

  /**
   * @description 销毁
   * @memberof WorkerManager
   */
  destroy(): void {
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
