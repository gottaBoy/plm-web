export default {
  codeListTag: 'ai__ai_conversation_status',
  codeListType: 'STATIC',
  codeName: 'ai__ai_conversation_status',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'active',
      text: '进行中',
      value: 'active',
      id: 'active',
    },
    {
      codeName: 'paused',
      text: '暂停',
      value: 'paused',
      id: 'paused',
    },
    {
      codeName: 'ended',
      text: '已结束',
      value: 'ended',
      id: 'ended',
    },
    {
      codeName: 'archived',
      text: '已归档',
      value: 'archived',
      id: 'archived',
    },
  ],
  enableCache: true,
  name: 'AI会话状态',
  id: 'plmweb.ai__ai_conversation_status',
};
