export default {
  codeListTag: 'ai__import_method',
  codeListType: 'STATIC',
  codeName: 'ai__import_method',
  emptyText: '未定义',
  appDataEntityId: 'plmweb.ai_kb_document_wizard',
  codeItems: [
    {
      codeName: 'space_manual',
      text: '手动从空间导入',
      value: 'space_manual',
      id: 'space_manual',
    },
    {
      codeName: 'space_auto_sync',
      text: '自动从空间同步',
      value: 'space_auto_sync',
      id: 'space_auto_sync',
    },
    {
      codeName: 'local_upload',
      text: '上传本地文件',
      value: 'local_upload',
      id: 'local_upload',
    },
  ],
  enableCache: true,
  name: '导入方式',
  id: 'plmweb.ai__import_method',
};
