export default {
  codeListTag: 'ai__api_auth_type_codelist',
  codeListType: 'STATIC',
  codeName: 'ai__api_auth_type_codelist',
  emptyText: '未定义',
  codeItems: [
    {
      codeName: 'none',
      text: '无认证',
      value: 'none',
      default: true,
      id: 'none',
    },
    {
      codeName: 'api_key',
      text: 'API Key',
      value: 'api_key',
      id: 'api_key',
    },
    {
      codeName: 'bearer_token',
      text: 'Bearer Token',
      value: 'bearer_token',
      id: 'bearer_token',
    },
    {
      codeName: 'oauth2',
      text: 'OAuth2',
      value: 'oauth2',
      id: 'oauth2',
    },
    {
      codeName: 'access_key_secret',
      text: 'Access Key/Secret',
      value: 'access_key_secret',
      id: 'access_key_secret',
    },
  ],
  enableCache: true,
  name: '认证方式',
  id: 'plmweb.ai__api_auth_type_codelist',
};
