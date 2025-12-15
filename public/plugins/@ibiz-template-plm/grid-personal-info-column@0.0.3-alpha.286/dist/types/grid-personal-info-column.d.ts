export declare const GridPersonalInfoColumn: import("vue").DefineComponent<{
    controller: {
        type: any;
        required: true;
    };
    row: {
        type: any;
        required: true;
    };
}, {
    ns: any;
    ns2: any;
    c: any;
    fieldValue: import("vue").ComputedRef<any>;
    onCellClick: (event: MouseEvent) => void;
    renderContent: () => JSX.Element | string;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    controller: {
        type: any;
        required: true;
    };
    row: {
        type: any;
        required: true;
    };
}>>, {}, {}>;
export default GridPersonalInfoColumn;
