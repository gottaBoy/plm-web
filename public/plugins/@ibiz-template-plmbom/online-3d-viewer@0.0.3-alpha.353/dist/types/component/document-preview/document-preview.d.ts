import { PropType } from 'vue';
import { FileData } from '../../use-iview-upload';
import { Online3DViewerController } from '../../online-3d-viewer.controller';
export declare const DocumentPreview: import("vue").DefineComponent<{
    documentList: {
        type: {
            (arrayLength: number): FileData[];
            (...items: FileData[]): FileData[];
            new (arrayLength: number): FileData[];
            new (...items: FileData[]): FileData[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        default: never[];
    };
    controller: {
        type: PropType<Online3DViewerController>;
        required: true;
    };
}, {
    ns: any;
    loading: import("vue").Ref<boolean>;
    currentIframeIndex: import("vue").Ref<number>;
    renderHeader: (currentIframe: FileData) => false | JSX.Element;
    renderContent: (url: string) => JSX.Element;
    renderFooter: () => JSX.Element | null;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    documentList: {
        type: {
            (arrayLength: number): FileData[];
            (...items: FileData[]): FileData[];
            new (arrayLength: number): FileData[];
            new (...items: FileData[]): FileData[];
            isArray(arg: any): arg is any[];
            readonly prototype: any[];
            from<T>(arrayLike: ArrayLike<T>): T[];
            from<T_1, U>(arrayLike: ArrayLike<T_1>, mapfn: (v: T_1, k: number) => U, thisArg?: any): U[];
            from<T_2>(iterable: Iterable<T_2> | ArrayLike<T_2>): T_2[];
            from<T_3, U_1>(iterable: Iterable<T_3> | ArrayLike<T_3>, mapfn: (v: T_3, k: number) => U_1, thisArg?: any): U_1[];
            of<T_4>(...items: T_4[]): T_4[];
            readonly [Symbol.species]: ArrayConstructor;
        };
        default: never[];
    };
    controller: {
        type: PropType<Online3DViewerController>;
        required: true;
    };
}>>, {
    documentList: FileData[];
}, {}>;
