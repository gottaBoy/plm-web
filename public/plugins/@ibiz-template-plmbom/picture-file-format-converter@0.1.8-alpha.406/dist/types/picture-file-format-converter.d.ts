
export declare const PictureFileFormatConverter: import('vue').DefineComponent<{}, {
    ns: import('@ibiz-template/core').Namespace;
    accept: string;
    base64Url: import('vue').Ref<string, string>;
    fileInputRef: import('vue').Ref<any, any>;
    handleFileUpload: () => void;
    handleFileChange: (e: Event) => void;
    clearFile: (e: MouseEvent) => void;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    change: (_value: unknown, _name?: string, _ignore?: boolean) => boolean;
    blur: (_event?: IData) => boolean;
    focus: (_event?: IData) => boolean;
    enter: (_event?: IData) => boolean;
    infoTextChange: (_text: string) => boolean;
}, string, import('vue').PublicProps, Readonly<{}> & Readonly<{
    onChange?: ((_value: unknown, _name?: string | undefined, _ignore?: boolean | undefined) => any) | undefined;
    onBlur?: ((_event?: import('@ibiz-template/core').IApiData | undefined) => any) | undefined;
    onFocus?: ((_event?: import('@ibiz-template/core').IApiData | undefined) => any) | undefined;
    onEnter?: ((_event?: import('@ibiz-template/core').IApiData | undefined) => any) | undefined;
    onInfoTextChange?: ((_text: string) => any) | undefined;
}>, {} | {
    [x: string]: any;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
