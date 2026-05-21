export default {
  gridRowActiveMode: 1,
  xdataControlName: 'grid',
  loadDefault: true,
  deviewCodeName: 'approval_grid_view',
  deviewId: 'B9EE2955-033E-42AB-93C8-64E4CB285ACC',
  accUserMode: 2,
  capLanguageRes: {
    lanResTag: 'DE.LNAME.SYS_TODO',
  },
  caption: '文档审批单',
  codeName: 'sys_todo_approval_grid_view',
  appDataEntityId: 'plmweb.systodo',
  appViewEngines: [
    {
      engineCat: 'VIEW',
      engineType: 'GridView',
      id: 'engine',
    },
  ],
  appViewLogics: [
    {
      logicTrigger: 'CUSTOM',
      logicType: 'APPUILOGIC',
      builtinAppUILogic: {
        actionAfterWizard: 'DEFAULT',
        newDataAppView: {
          refAppViewId: 'plmweb.sys_todo_edit_view',
        },
        appUILogicRefViews: [
          {
            refAppViewId: 'plmweb.sys_todo_edit_view',
          },
        ],
        builtinLogic: true,
        logicType: 'PREDEFINED',
        viewLogicType: 'APP_NEWDATA',
        id: '新建数据',
      },
      builtinLogic: true,
      id: 'newdata',
    },
    {
      logicTrigger: 'CUSTOM',
      logicType: 'APPUILOGIC',
      builtinAppUILogic: {
        openDataAppView: {
          refAppViewId: 'plmweb.sys_todo_edit_view',
        },
        editMode: true,
        appUILogicRefViews: [
          {
            refAppViewId: 'plmweb.sys_todo_edit_view',
          },
        ],
        builtinLogic: true,
        logicType: 'PREDEFINED',
        viewLogicType: 'APP_OPENDATA',
        id: '打开数据',
      },
      builtinLogic: true,
      id: 'opendata',
    },
  ],
  appViewRefs: [
    {
      realTitle: '待办编辑视图',
      realTitleLanguageRes: {
        lanResTag: 'PAGE.TITLE.SYS_TODO.EDITVIEW',
      },
      refAppViewId: 'plmweb.sys_todo_edit_view',
      name: 'NEWDATA',
      id: 'newdata',
    },
    {
      realTitle: '待办编辑视图',
      realTitleLanguageRes: {
        lanResTag: 'PAGE.TITLE.SYS_TODO.EDITVIEW',
      },
      refAppViewId: 'plmweb.sys_todo_edit_view',
      name: 'EDITDATA',
      id: 'editdata',
    },
  ],
  controls: [
    {
      groupMode: 'SINGLE',
      quickSearchMode: 1,
      enableQuickSearch: true,
      controlType: 'SEARCHBAR',
      appDataEntityId: 'plmweb.systodo',
      controlParam: {
        id: 'searchbar',
      },
      id: 'searchbar',
    },
    {
      capLanguageRes: {
        lanResTag: 'DE.LNAME.SYS_TODO',
      },
      caption: '文档审批单',
      codeName: 'approval_grid_view_captionbar',
      controlType: 'CAPTIONBAR',
      appDataEntityId: 'plmweb.systodo',
      controlParam: {},
      name: 'captionbar',
      id: 'approval_grid_view_captionbar',
    },
  ],
  viewLayoutPanel: {
    layoutBodyOnly: true,
    useDefaultLayout: true,
    layoutPanel: true,
    codeName: 'layoutpanel',
    controlStyle: 'APPDEGRIDVIEW',
    controlType: 'VIEWLAYOUTPANEL',
    appDataEntityId: 'plmweb.systodo',
    controlParam: {},
    id: 'layoutpanel',
  },
  title: '文档审批单',
  viewStyle: 'DEFAULT',
  viewType: 'DEGRIDVIEW',
  enableDP: true,
  showCaptionBar: true,
  modelId: 'eabf2dcd4eabd94bf1d9eb5780a9c75b',
  modelType: 'PSAPPDEVIEW',
  name: 'SysTodoapproval_grid_view',
  id: 'plmweb.sys_todo_approval_grid_view',
};
