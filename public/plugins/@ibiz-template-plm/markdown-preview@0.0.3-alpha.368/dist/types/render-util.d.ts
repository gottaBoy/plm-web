import { VNode } from 'vue';
/**
 * 图片预览渲染 Hook
 * 提供 Markdown 编辑器图片预览功能（点击图片弹窗预览、ESC 关闭）
 * @param ns 命名空间（用于 CSS 类名）
 */
export declare function useImgPreviewRender(ns: {
    e: (name: string) => string;
}): {
    renderImgPreview: () => VNode;
    onMDEditorCreated: (mdeditor: IParams) => void;
};
export declare const formatHtml: (html: string) => string;
export declare const formatSvg: (svg: string) => string;
