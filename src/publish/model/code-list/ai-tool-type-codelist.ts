export default {
  codeListTag: 'ai__tool_type_codelist',
  codeListType: 'STATIC',
  codeName: 'ai__tool_type_codelist',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'api',
      text: 'HTTP 接口',
      value: 'api',
      default: true,
      id: 'api',
    },
    {
      codeName: 'mcp',
      text: 'MCP服务',
      value: 'mcp',
      id: 'mcp',
    },
  ],
  enableCache: true,
  name: 'Tool类型',
  id: 'plmweb.ai__tool_type_codelist',
};
