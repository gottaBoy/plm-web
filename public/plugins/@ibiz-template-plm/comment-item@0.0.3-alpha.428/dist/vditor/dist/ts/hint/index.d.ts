/// <reference types="./types" />
export declare class Hint {
    timeId: number;
    element: HTMLDivElement;
    recentLanguage: string;
    private splitChar;
    private lastIndex;
    constructor(hintExtends: IHintExtend[]);
    render(vditor: IVditor): void;
    queryHint(query: string, key: string, item: IHintExtend, vditor: IVditor): Promise<void>;
    genHTML(data: IHintData[], key: string, vditor: IVditor, item?: IHintExtend): void;
    fillEmoji: (element: HTMLElement, vditor: IVditor) => void;
    select(event: KeyboardEvent, vditor: IVditor, enableSpace?: boolean): boolean;
    private getKey;
}
