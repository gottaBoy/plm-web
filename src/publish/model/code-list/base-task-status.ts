export default {
  codeListTag: 'Base__TaskStatus',
  codeListType: 'STATIC',
  codeName: 'Base__TaskStatus',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'pending',
      text: '待处理',
      value: 'PENDING',
      id: 'pending',
    },
    {
      codeName: 'running',
      text: '运行中',
      value: 'RUNNING',
      id: 'running',
    },
    {
      codeName: 'success',
      text: '成功',
      value: 'SUCCESS',
      id: 'success',
    },
    {
      codeName: 'failed',
      text: '失败',
      value: 'FAILED',
      id: 'failed',
    },
    {
      codeName: 'cancelled',
      text: '已取消',
      value: 'CANCELLED',
      id: 'cancelled',
    },
  ],
  enableCache: true,
  name: '任务状态',
  id: 'plmweb.base__taskstatus',
};
