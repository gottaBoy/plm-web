import { PropType, Ref } from 'vue';
import { FileData } from '../../use-iview-upload';
import { Online3DViewerController } from '../../online-3d-viewer.controller';
export declare const ImgPreview: import("vue").DefineComponent<{
    imageFiles: {
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
        default: () => never[];
    };
    controller: {
        type: PropType<Online3DViewerController>;
        required: true;
    };
    data: {
        type: ObjectConstructor;
        default: () => void;
    };
}, {
    ns: any;
    currentImageIndex: Ref<number>;
    imgStyle: import("vue").ComputedRef<IData>;
    showTitle: Ref<boolean>;
    currentImageRef: Ref<any>;
    loading: Ref<boolean>;
    imgPreviewContentRef: Ref<any>;
    onRotate: () => void;
    onImgLoad: (event: Event) => void;
    renderToolbar: () => JSX.Element | null;
    renderFooter: () => JSX.Element | null;
    onImgLoadError: () => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    imageFiles: {
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
        default: () => never[];
    };
    controller: {
        type: PropType<Online3DViewerController>;
        required: true;
    };
    data: {
        type: ObjectConstructor;
        default: () => void;
    };
}>>, {
    imageFiles: FileData[];
    data: Record<string, any>;
}, {}>;
