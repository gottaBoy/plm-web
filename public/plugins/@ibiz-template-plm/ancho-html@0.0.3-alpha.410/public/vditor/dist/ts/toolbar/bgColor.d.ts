/// <reference types="./types" />
import { MenuItem } from "./MenuItem";
export declare class BgColor extends MenuItem {
    element: HTMLElement;
    constructor(vditor: IVditor, menuItem: IMenuItem);
    getRangeNodes(range: Range): HTMLElement[];
}
