export default {
  codeListTag: 'ai__trimming_strategy',
  codeListType: 'STATIC',
  codeName: 'ai__trimming_strategy',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'oldest',
      text: '丢弃最早消息',
      value: 'oldest',
      id: 'oldest',
    },
    {
      codeName: 'least_important',
      text: '基于内容重要性',
      value: 'least_important',
      id: 'least_important',
    },
    {
      codeName: 'summarize_oldest',
      text: '摘要保留早期',
      value: 'summarize_oldest',
      id: 'summarize_oldest',
    },
  ],
  enableCache: true,
  name: '截断策略',
  id: 'plmweb.ai__trimming_strategy',
};
