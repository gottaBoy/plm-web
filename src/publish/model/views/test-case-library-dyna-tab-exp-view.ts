export default {
  tabLayout: 'TOP',
  loadDefault: true,
  showDataInfoBar: true,
  openMode: 'INDEXVIEWTAB_POPUPMODAL',
  deviewCodeName: 'library_dyna_tab_exp_view',
  deviewId: 'e6f3c0a0d1bc8097a55caa0cbb7c84a1',
  accUserMode: 2,
  capLanguageRes: {
    lanResTag: 'DE.LNAME.TEST_CASE',
  },
  caption: '测试用例表单动态设计',
  codeName: 'test_case_library_dyna_tab_exp_view',
  height: 90,
  appDataEntityId: 'plmweb.test_case',
  appViewEngines: [
    {
      engineCat: 'VIEW',
      engineType: 'TabExpView',
      id: 'engine',
    },
  ],
  controls: [
    {
      dedrtabPages: [
        {
          caption: '显示视图配置',
          appViewId: 'plmweb.psdeformdesign_modal',
          navigateContexts: [
            {
              key: 'PSDEFORM',
              value:
                'FIELD__TEST_LIBRARY_ID__${library}@TestMgmt.test_case.Main',
              name: 'PSDEFORM',
              id: 'psdeform',
            },
          ],
          id: 'show_view',
        },
        {
          caption: '新建视图配置',
          appViewId: 'plmweb.psdeformdesign_modal',
          navigateContexts: [
            {
              key: 'PSDEFORM',
              value:
                'FIELD__TEST_LIBRARY_ID__${library}@TestMgmt.test_case.quick_create_view',
              name: 'PSDEFORM',
              id: 'psdeform',
            },
          ],
          id: 'new_view',
        },
      ],
      dataRelationTag: 'library_dyna_tab_exp_view_DR',
      editItemCapLanguageRes: {
        lanResTag: 'DE.LNAME.TEST_CASE',
      },
      editItemCaption: '用例',
      uniqueTag: 'test_case_library_dyna_tab_exp_view__tabexppanel',
      autoLoad: true,
      showBusyIndicator: true,
      codeName: 'library_dyna_tab_exp_view_dr',
      controlType: 'DRTAB',
      appDataEntityId: 'plmweb.test_case',
      controlParam: {
        id: 'tabexppanel',
      },
      modelId: '99f7b86d5939fd322a1511566f093168',
      modelType: 'PSDEDRTAB',
      name: 'tabexppanel',
      id: 'library_dyna_tab_exp_view_dr',
    },
    {
      capLanguageRes: {
        lanResTag: 'DE.LNAME.TEST_CASE',
      },
      caption: '测试用例表单动态设计',
      codeName: 'library_dyna_tab_exp_view_captionbar',
      controlType: 'CAPTIONBAR',
      appDataEntityId: 'plmweb.test_case',
      controlParam: {},
      name: 'captionbar',
      id: 'library_dyna_tab_exp_view_captionbar',
    },
  ],
  viewLayoutPanel: {
    layoutBodyOnly: true,
    useDefaultLayout: true,
    layoutPanel: true,
    codeName: 'layoutpanel',
    controlStyle: 'APPDETABEXPVIEW',
    controlType: 'VIEWLAYOUTPANEL',
    appDataEntityId: 'plmweb.test_case',
    controlParam: {},
    id: 'layoutpanel',
  },
  title: '测试用例表单动态设计',
  viewStyle: 'DEFAULT',
  viewType: 'DETABEXPVIEW',
  width: 90,
  enableDP: true,
  showCaptionBar: true,
  modelId: '62828d7b66155667ac78d853c4bb69a6',
  modelType: 'PSAPPDEVIEW',
  name: 'test_caselibrary_dyna_tab_exp_view',
  id: 'plmweb.test_case_library_dyna_tab_exp_view',
};
