/// <reference types="./types" />
import { MenuItem } from "./MenuItem";
export declare class Color extends MenuItem {
    element: HTMLElement;
    private applyColor;
    constructor(vditor: IVditor, menuItem: IMenuItem);
    getRangeNodes(range: Range): HTMLElement[];
}
