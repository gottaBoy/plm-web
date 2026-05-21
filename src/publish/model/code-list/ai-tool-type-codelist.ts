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
    {
      codeName: 'mcp_built_in_extension',
      text: '内置MCP扩展服务',
      tooltip: '用于提供逻辑扩展中的mcp服务',
      value: 'mcp_built_in_extension',
      id: 'mcp_built_in_extension',
    },
  ],
  enableCache: true,
  name: 'Tool类型',
  id: 'plmweb.ai__tool_type_codelist',
};
