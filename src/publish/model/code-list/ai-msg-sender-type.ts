export default {
  codeListTag: 'ai__msg_sender_type',
  codeListType: 'STATIC',
  codeName: 'ai__msg_sender_type',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'user',
      text: '用户',
      value: 'user',
      id: 'user',
    },
    {
      codeName: 'agent',
      text: 'AI智能体',
      value: 'agent',
      id: 'agent',
    },
    {
      codeName: 'system',
      text: '系统通知',
      value: 'system',
      id: 'system',
    },
  ],
  enableCache: true,
  name: '消息发送方类型',
  id: 'plmweb.ai__msg_sender_type',
};
