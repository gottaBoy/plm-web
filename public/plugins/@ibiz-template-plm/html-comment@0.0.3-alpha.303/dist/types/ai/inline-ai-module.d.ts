import { IButtonMenu, IDomEditor } from '@wangeditor/editor';
export declare class InLineAIButton implements IButtonMenu {
    title: string;
    tag: string;
    iconSvg?: string;
    constructor();
    getValue(editor: IDomEditor): string | boolean;
    isActive(editor: IDomEditor): boolean;
    isDisabled(editor: IDomEditor): boolean;
    exec(editor: IDomEditor, value: string | boolean): void;
}
