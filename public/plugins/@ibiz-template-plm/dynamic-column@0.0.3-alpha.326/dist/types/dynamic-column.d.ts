import { PropType } from 'vue';
import { GridRowState } from '@ibiz-template/runtime';
import { DynamicColumnController } from './dynamic-column.controller';
export declare const DynamicColumn: import("vue").DefineComponent<{
    controller: {
        type: PropType<DynamicColumnController>;
        required: true;
    };
    row: {
        type: PropType<GridRowState>;
        required: true;
    };
    attrs: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: false;
    };
}, {
    c: import("vue").ComputedRef<import("@ibiz-template/runtime").GridFieldEditColumnController>;
    ns: import("@ibiz-template/core").Namespace;
    tooltip: import("vue").ComputedRef<string | undefined>;
    editorProps: import("@ibiz-template/core").IApiData;
    componentRef: import("vue").Ref<any>;
    gridEditItemProps: import("@ibiz-template/core").IApiData;
    rowDataChange: (val: unknown, name?: string, ignore?: boolean) => Promise<void>;
    onInfoTextChange: (text: string) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    controller: {
        type: PropType<DynamicColumnController>;
        required: true;
    };
    row: {
        type: PropType<GridRowState>;
        required: true;
    };
    attrs: {
        type: PropType<import("@ibiz-template/core").IApiData>;
        required: false;
    };
}>>, {}, {}>;
