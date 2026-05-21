import { CollaborateManager } from '../y-websocket';
declare global {
    interface VditorInstance {
        element: HTMLElement;
        lute: {
            SpinVditorIRDOM: (md: string) => string;
            VditorIRDOM2HTML: (ir: string) => string;
        };
        ir: {
            element: HTMLElement;
        };
        outline: {
            render: (vditor: VditorInstance) => void;
            toggle: (vditor: VditorInstance, show: boolean) => void;
        };
        toolbar: {
            elements: Record<string, {
                children: any[];
            }>;
        };
    }
    interface Vditor {
        vditor: VditorInstance;
        readonly version: string;
        getValue: () => string;
        setValue: (content: string) => void;
        insertValue: (content: string) => void;
        getHTML: () => string;
        refresh: () => void;
        disabled: () => void;
        enable: () => void;
        destroy: () => void;
        focus: () => void;
        blur: (value: string) => void;
        getCursorPosition: () => {
            left: number;
            top: number;
        };
        setCursorPosition: (pos: number) => void;
    }
}
/**
 * Vditor Yjs 桥接配置项
 */
export interface VditorYjsBridgeConfig {
    vditor: Vditor | IData;
    context: IContext;
    params: IParams;
    roomName: string;
    enableCursorSync?: boolean;
    editorId?: string;
    userInfo?: {
        id: string;
        name: string;
        color: string;
    };
}
/**
 * Vditor Yjs 桥接类（处理双向同步、光标渲染、状态管理）
 */
export declare class VditorYjsBridge {
    private readonly config;
    private yDoc;
    collaborateRoom: any;
    private contentChangeDebounceTimer;
    isYjsInitiatedUpdate: boolean;
    collaborateManager: CollaborateManager | null;
    scrollTimer: any;
    constructor(config: VditorYjsBridgeConfig);
    /**
     * 当前用户信息（包含name，光标状态等信息）
     *
     * @readonly
     * @type {IData}
     * @memberof VditorYjsBridge
     */
    get userState(): IData;
    /**
     * 当前房间所有用户信息
     *
     * @readonly
     * @type {IData[]}
     * @memberof VditorYjsBridge
     */
    get allUsers(): IData[];
    /**
     * 初始化 Yjs 文档
     */
    private initYjsDoc;
    /**
     * 绑定 Vditor 内容变更监听
     */
    private bindVditorContentChange;
    /**
     * 初始化协同房间（连接 MQTT 同步服务）
     */
    init(): Promise<void>;
    /**
     * 处理 Yjs 数据变更
     *
     * @private
     * @param {Map<string, IData>} changedKeys
     * @param {Y.Map<any>} collabAllData
     * @memberof VditorYjsBridge
     */
    private handleCollabDataChange;
    /**
     * vdito 内容变更
     *
     * @private
     * @return {*}  {void}
     * @memberof VditorYjsBridge
     */
    private vditorContentChangeListener;
    /**
     * 计算光标在编辑器中的相对位置以及对应的选区数据
     *
     * @return {*}  {({
     *     cursorOffset: number | null;
     *     selection: IData | null;
     *   })}
     * @memberof VditorYjsBridge
     */
    calcCursorRealPosition(): {
        cursorOffset: number | null;
        selection: IData | null;
    };
    /**
     * 更新用户光标状态和编辑内容
     *
     * @memberof VditorYjsBridge
     */
    updateOtherClient(): void;
    /**
     * 获取 Vditor 选区的字符偏移 + 坐标数据（用于跨端传输）
     * @param {Vditor} vditor Vditor 实例
     * @returns {IData|null} 包含字符偏移、坐标、文本等信息
     */
    calcVditorSelection(vditor: VditorInstance): IData | null;
    /**
     * 获取无选区时的焦点字符偏移量
     *
     * @param {VditorInstance} vditor
     * @return {*}  {(number | null)}
     * @memberof VditorYjsBridge
     */
    getcursorOffset(vditor: VditorInstance): number | null;
    /**
     * 绘制多个用户光标选区遮罩
     *
     * @param {VditorInstance} vditor
     * @param {(IData | null)} selectionData
     * @return {*}  {void}
     * @memberof VditorYjsBridge
     */
    renderMultiSegmentMask(vditor: VditorInstance, selectionData: IData | null): void;
    /**
     * 绘制单个用户光标
     *
     * @param {VditorInstance} vditor
     * @param {IData} user
     * @return {*}  {void}
     * @memberof VditorYjsBridge
     */
    rendercursorFocus(vditor: VditorInstance, user: IData): void;
    /**
     * 清除所有遮罩(包括选中与光标)
     *
     * @param {*} vditor
     */
    clearAllSelectionMasks(vditor: VditorInstance): void;
    /**
     * 同步 Vditor 内容到 Yjs
     *
     * @param {boolean} [isInit=false] 是否为初始化同步（强制覆盖）
     * @return {*}  {void}
     * @memberof VditorYjsBridge
     */
    syncVditorToYjs(isInit?: boolean): void;
    /**
     * 同步 Yjs 内容到 Vditor（Yjs 文档变更时触发）
     *
     * @private
     * @return {*}  {void}
     * @memberof VditorYjsBridge
     */
    private syncYjsToVditor;
    /**
     * 恢复 Vditor 焦点
     *
     * @param {VditorInstance} vditor
     * @param {{
     *       cursorOffset: number;
     *       start?: number;
     *       end?: number;
     *     }} focusData
     * @return {*}  {void}
     * @memberof VditorYjsBridge
     */
    restoreVditorFocus(vditor: VditorInstance, focusData: {
        cursorOffset: number | null;
        selection: null | IData;
    }): void;
    /**
     * 渲染远程用户光标
     *
     * @private
     * @param {IData[]} [items=[]]
     * @return {*}  {void}
     * @memberof VditorYjsBridge
     */
    private renderRemoteCursors;
    /**
     * 处理编辑器滚动事件
     *
     * @private
     * @memberof VditorYjsBridge
     */
    private handleVditorScroll;
    /**
     * 绑定编辑器滚动事件，动态设置远程信息
     *
     * @private
     * @memberof VditorYjsBridge
     */
    private bindEditorScroll;
    /**
     * 更新本地用户光标状态
     */
    private updateLocalCursorState;
    /**
     * 失焦时移除当前用户光标
     *
     * @memberof VditorYjsBridge
     */
    vditorBlurListener(): void;
    /**
     * 销毁桥接实例（释放资源）
     */
    destroy(): Promise<void>;
}
