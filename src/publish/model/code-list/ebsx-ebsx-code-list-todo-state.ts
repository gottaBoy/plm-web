export default {
  codeListTag: 'ebsx__ebsx__CodeListTodoState',
  codeListType: 'STATIC',
  codeName: 'ebsx__ebsx__CodeListTodoState',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'active',
      color: '#67c23a',
      text: '待处理',
      value: 'ACTIVE',
      id: 'active',
    },
    {
      codeName: 'completed',
      color: '#57a3fd',
      text: '已处理',
      value: 'COMPLETED',
      id: 'completed',
    },
    {
      codeName: 'paused',
      color: '#f56c6c',
      text: '挂起',
      value: 'PAUSED',
      id: 'paused',
    },
    {
      codeName: 'canceled',
      color: '#909399',
      text: '已取消',
      value: 'CANCELED',
      id: 'canceled',
    },
  ],
  enableCache: true,
  name: '待办状态',
  id: 'plmweb.ebsx__ebsx__codelisttodostate',
};
