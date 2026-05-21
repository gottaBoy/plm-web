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
export declare class WorkerManager {
    /**
     * @description worker实例
     * @private
     * @type {(Worker | null)}
     * @memberof WorkerManager
     */
    private worker;
    /**
     * @description blobUrl
     * @private
     * @type {(string | null)}
     * @memberof WorkerManager
     */
    private blobUrl;
    /**
     * @description worker线程代码
     * @readonly
     * @private
     * @type {string}
     * @memberof WorkerManager
     */
    private get workerCode();
    /**
     * Creates an instance of ManagedWorker.
     * @memberof ManagedWorker
     */
    constructor();
    /**
     * @description post请求
     * @param {IWorkerMessage} message
     * @returns {*}  {Promise<{ ok: boolean, data: any }>}
     * @memberof WorkerManager
     */
    post(message: IWorkerMessage): Promise<{
        ok: boolean;
        data: any;
    }>;
    /**
     * @description 销毁
     * @memberof WorkerManager
     */
    destroy(): void;
}
