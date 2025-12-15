export default {
  codeListTag: 'ai__slice_status',
  codeListType: 'STATIC',
  codeName: 'ai__slice_status',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'unparsed',
      text: '未解析',
      value: '0',
      id: 'unparsed',
    },
    {
      codeName: 'ready',
      text: '就绪',
      value: '1',
      id: 'ready',
    },
    {
      codeName: 'parsing',
      text: '解析中',
      value: '2',
      id: 'parsing',
    },
    {
      codeName: 'failed',
      text: '失败',
      value: '3',
      id: 'failed',
    },
  ],
  enableCache: true,
  name: '文档切片状态',
  id: 'plmweb.ai__slice_status',
};
