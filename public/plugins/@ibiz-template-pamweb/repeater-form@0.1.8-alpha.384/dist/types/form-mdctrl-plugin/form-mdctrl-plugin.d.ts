import { PropType } from 'vue';
import { IDEFormMDCtrl, IUIActionGroupDetail } from '@ibiz/model-core';

export declare const FormMDCtrlPlugin: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    modelData: {
        type: PropType<IDEFormMDCtrl>;
        required: true;
    };
    controller: {
        type: any;
        required: true;
    };
}>, {
    c: any;
    ns: any;
    hasCaption: any;
    hasHeader: any;
    onActionClick: (detail: IUIActionGroupDetail, event: MouseEvent) => Promise<void>;
}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {}, string, import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    modelData: {
        type: PropType<IDEFormMDCtrl>;
        required: true;
    };
    controller: {
        type: any;
        required: true;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
export default FormMDCtrlPlugin;
