import { EditorController } from '@ibiz-template/runtime';
import { IFileUploader } from '@ibiz/model-core';

export declare class ImgToBase64Controller extends EditorController<IFileUploader> {
    /**
     * 是否支持拖拽
     */
    isDrag: boolean;
    /**
     * 是否多选
     */
    multiple: boolean;
    /**
     * 接受上传的文件类型
     */
    accept: string;
    /**
     * 上传的文件大小
     *
     * @type {number}
     * @memberof ImgToBase64Controller
     */
    size: number;
    /**
     * 上传参数
     */
    uploadParams?: IParams;
    /**
     * 下载参数
     */
    exportParams?: IParams;
    /**
     * 自适应预览
     * 只读状态下且配置了编辑器参数autoPreview ，加载完图片后自动调整大小达到预览态，且禁用图片hover工具栏
     *
     * @type {boolean}
     * @memberof ImgToBase64Controller
     */
    autoPreview: boolean;
    /**
     * @description 图片宽度
     * @type {number}
     * @memberof ImgToBase64Controller
     */
    imageWidth: number;
    /**
     * @description 图片高度
     * @type {number}
     * @memberof ImgToBase64Controller
     */
    imageHeight: number;
    /**
     * 上传文件信息的映射规则字符串，格式为"源键:目标键;源键2:目标键2"
     */
    infoMap: string;
    protected onInit(): Promise<void>;
    /**
     * 根据配置的映射关系转换对象属性
     * 将源对象的指定属性，按照映射规则映射到新对象的目标属性
     *
     * @param {IData} [_data={}] - 源数据对象，包含需要被映射的原始属性
     * @param {string} [infoMap=''] - 映射规则字符串，格式为"源键:目标键;源键2:目标键2"
     * @param {boolean} [isEmit=false] - 是否为抛值时处理，抛值时将源键替换为目标键
     * @returns {IData} 转换后的新对象，仅包含映射规则中定义的属性
     *
     * @example
     * // isEmit=false
     * // 源对象：{ filesize:'10000', fileext:'.gif', folder:'file' };
     * // 映射规则：'filesize:size;fileext:ext;folder:folder';
     * // 转换结果: { size:'10000', ext:'.gif', folder:'file' }
     *
     * // isEmit=true
     * // 源对象：{ filesize:'10000', fileext:'.gif', folder:'file' };
     * // 映射规则：'filesize:size;fileext:ext;folder:folder';
     * // 转换结果: { size:undefined, ext:undefined, folder:'file' }
     */
    transformInfoMap: (_data?: IData, infoMap?: string, isEmit?: boolean) => IData;
}
