export default {
  codeListTag: 'ai__model_capability',
  codeListType: 'STATIC',
  codeName: 'ai__model_capability',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'reasoning',
      text: '强推理',
      value: 'reasoning',
      id: 'reasoning',
    },
    {
      codeName: 'coding',
      text: '代码生成',
      value: 'coding',
      id: 'coding',
    },
    {
      codeName: 'function_calling',
      text: '工具调用',
      value: 'function_calling',
      id: 'function_calling',
    },
    {
      codeName: 'streaming',
      text: '流式输出',
      value: 'streaming',
      id: 'streaming',
    },
    {
      codeName: 'long_context',
      text: '长上下文',
      value: 'long_context',
      id: 'long_context',
    },
  ],
  enableCache: true,
  name: '模型能力',
  id: 'plmweb.ai__model_capability',
};
