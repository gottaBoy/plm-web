/// <reference types="./types" />
export declare class Toolbar {
    elements: {
        [key: string]: HTMLElement;
    };
    element: HTMLElement;
    originToolbar: IMenuItem[];
    offsetWidth: number;
    constructor(vditor: IVditor, id?: string, toolbar?: IMenuItem[]);
    initToolbar(vditor: IVditor, toolbar: IMenuItem[]): void;
    calcEllipsisToolbar(vditor: IVditor): void;
    updateConfig(vditor: IVditor, options: IToolbarConfig): void;
    private genItem;
}
