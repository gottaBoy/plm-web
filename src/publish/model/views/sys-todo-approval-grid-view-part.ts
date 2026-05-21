export default {
  gridRowActiveMode: 1,
  xdataControlName: 'grid',
  loadDefault: true,
  deviewCodeName: 'approval_grid_view_part',
  deviewId: 'CE6B0DE1-B9CA-43E7-9C72-23B2297E8544',
  accUserMode: 2,
  capLanguageRes: {
    lanResTag: 'DE.LNAME.SYS_TODO',
  },
  caption: '零件审批单',
  codeName: 'sys_todo_approval_grid_view_part',
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
      caption: '零件审批单',
      codeName: 'approval_grid_view_part_captionbar',
      controlType: 'CAPTIONBAR',
      appDataEntityId: 'plmweb.systodo',
      controlParam: {},
      name: 'captionbar',
      id: 'approval_grid_view_part_captionbar',
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
  title: '零件审批单',
  viewStyle: 'DEFAULT',
  viewType: 'DEGRIDVIEW',
  enableDP: true,
  showCaptionBar: true,
  modelId: '1402b2c1595fd5484dc8c86dadd611cb',
  modelType: 'PSAPPDEVIEW',
  name: 'SysTodoapproval_grid_view_part',
  id: 'plmweb.sys_todo_approval_grid_view_part',
};
