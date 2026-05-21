export default {
  tabLayout: 'TOP',
  loadDefault: true,
  showDataInfoBar: true,
  deviewCodeName: 'management_tab_exp_view',
  deviewId: '68b310c8f5a011111506b15a86a072ad',
  accUserMode: 2,
  capLanguageRes: {
    lanResTag: 'PAGE.CAPTION.AI_KNOWLEDGE_BASE.MANAGEMENT_TAB_EXP_VIEW',
  },
  caption: '知识库',
  codeName: 'ai_knowledge_base_management_tab_exp_view',
  appDataEntityId: 'plmweb.ai_knowledge_base',
  viewLayoutPanel: {
    viewProxyMode: true,
    layoutMode: 'FLEX',
    layout: {
      layout: 'FLEX',
    },
    rootPanelItems: [
      {
        actionGroupExtractMode: 'ITEM',
        panelItems: [
          {
            actionGroupExtractMode: 'ITEM',
            panelItems: [
              {
                caption: '标题栏',
                itemStyle: 'DEFAULT',
                itemType: 'CTRLPOS',
                layoutPos: {
                  shrink: 1,
                  layout: 'FLEX',
                },
                showCaption: true,
                id: 'captionbar',
              },
            ],
            layout: {
              layout: 'FLEX',
            },
            dataRegionType: 'INHERIT',
            caption: '容器',
            itemStyle: 'DEFAULT',
            itemType: 'CONTAINER',
            layoutPos: {
              shrink: 1,
              layout: 'FLEX',
            },
            id: 'view_captionbar',
          },
          {
            actionGroupExtractMode: 'ITEM',
            panelItems: [
              {
                caption: '分页导航',
                itemStyle: 'DEFAULT',
                itemType: 'CTRLPOS',
                layoutPos: {
                  shrink: 1,
                  layout: 'FLEX',
                },
                showCaption: true,
                id: 'tabexppanel',
              },
            ],
            layout: {
              layout: 'FLEX',
            },
            dataRegionType: 'INHERIT',
            caption: '容器',
            itemStyle: 'DEFAULT',
            itemType: 'CONTAINER',
            layoutPos: {
              grow: 1,
              shrink: 1,
              layout: 'FLEX',
            },
            id: 'view_tabexppanel',
          },
          {
            actionGroupExtractMode: 'ITEM',
            panelItems: [
              {
                rawItem: {
                  predefinedType: 'TELEPORT_PLACEHOLDER',
                  id: 'tabsearchbar',
                },
                caption: '传送部件占位',
                itemStyle: 'DEFAULT',
                itemType: 'RAWITEM',
                layoutPos: {
                  shrink: 1,
                  layout: 'FLEX',
                },
                showCaption: true,
                id: 'tabsearchbar',
              },
            ],
            layout: {
              layout: 'FLEX',
            },
            dataRegionType: 'INHERIT',
            caption: '容器',
            cssStyle: 'margin-right:10px',
            itemStyle: 'DEFAULT',
            itemType: 'CONTAINER',
            layoutPos: {
              shrink: 1,
              layout: 'FLEX',
            },
            id: 'container2',
          },
        ],
        predefinedType: 'VIEWHEADER',
        layout: {
          dir: 'row',
          layout: 'FLEX',
          valign: 'center',
        },
        dataRegionType: 'INHERIT',
        caption: '容器',
        itemStyle: 'DEFAULT',
        itemType: 'CONTAINER',
        layoutPos: {
          shrink: 0,
          layout: 'FLEX',
        },
        id: 'view_header',
      },
      {
        actionGroupExtractMode: 'ITEM',
        panelItems: [
          {
            actionGroupExtractMode: 'ITEM',
            layout: {
              layout: 'FLEX',
            },
            dataRegionType: 'INHERIT',
            caption: '容器',
            itemStyle: 'DEFAULT',
            itemType: 'CONTAINER',
            layoutPos: {
              shrink: 0,
              layout: 'FLEX',
            },
            id: 'view_tabexppanel_left',
          },
          {
            actionGroupExtractMode: 'ITEM',
            panelItems: [
              {
                actionGroupExtractMode: 'ITEM',
                panelItems: [
                  {
                    rawItem: {
                      rawItemParams: [
                        {
                          key: 'EXPCACHE',
                          value: 'NO_CACHE',
                        },
                      ],
                      predefinedType: 'NAV_POS',
                      id: 'nav_pos',
                    },
                    caption: '导航区占位',
                    itemStyle: 'DEFAULT',
                    itemType: 'RAWITEM',
                    layoutPos: {
                      grow: 1,
                      shrink: 1,
                      layout: 'FLEX',
                    },
                    showCaption: true,
                    id: 'nav_pos',
                  },
                ],
                predefinedType: 'VIEWCONTENT',
                layout: {
                  layout: 'FLEX',
                },
                dataRegionType: 'INHERIT',
                caption: '容器',
                itemStyle: 'DEFAULT',
                itemType: 'CONTAINER',
                layoutPos: {
                  grow: 1,
                  shrink: 1,
                  layout: 'FLEX',
                },
                id: 'view_content',
              },
              {
                actionGroupExtractMode: 'ITEM',
                layout: {
                  layout: 'FLEX',
                },
                dataRegionType: 'INHERIT',
                caption: '容器',
                itemStyle: 'DEFAULT',
                itemType: 'CONTAINER',
                layoutPos: {
                  shrink: 0,
                  layout: 'FLEX',
                },
                id: 'view_tabexppanel_bottom',
              },
            ],
            layout: {
              layout: 'FLEX',
            },
            dataRegionType: 'INHERIT',
            caption: '容器',
            itemStyle: 'DEFAULT',
            itemType: 'CONTAINER',
            layoutPos: {
              grow: 1,
              shrink: 1,
              layout: 'FLEX',
            },
            id: 'container1',
          },
          {
            actionGroupExtractMode: 'ITEM',
            layout: {
              layout: 'FLEX',
            },
            dataRegionType: 'INHERIT',
            caption: '容器',
            itemStyle: 'DEFAULT',
            itemType: 'CONTAINER',
            layoutPos: {
              shrink: 0,
              layout: 'FLEX',
            },
            id: 'view_tabexppanel_right',
          },
        ],
        layout: {
          dir: 'row',
          layout: 'FLEX',
        },
        dataRegionType: 'INHERIT',
        caption: '容器',
        itemStyle: 'DEFAULT',
        itemType: 'CONTAINER',
        layoutPos: {
          grow: 1,
          shrink: 1,
          layout: 'FLEX',
        },
        id: 'container',
      },
    ],
    layoutPanel: true,
    appViewEngines: [
      {
        engineCat: 'VIEW',
        engineType: 'TabExpView',
        id: 'engine',
      },
    ],
    controls: [
      {
        tabExpPageIds: ['actived', 'deleted'],
        tabLayout: 'TOP',
        uniqueTag: 'ai_knowledge_base_management_tab_exp_view__tabexppanel',
        appViewRefs: [
          {
            realTitle: '知识库',
            realTitleLanguageRes: {
              lanResTag: 'PAGE.TITLE.AI_KNOWLEDGE_BASE.ACTIVED_GRID_VIEW',
            },
            refAppViewId: 'plmweb.ai_knowledge_base_actived_grid_view',
            name: 'EXPITEM:actived',
            id: 'expitem:actived',
          },
          {
            realTitle: '知识库',
            realTitleLanguageRes: {
              lanResTag: 'PAGE.TITLE.AI_KNOWLEDGE_BASE.DELETED_GRID_VIEW',
            },
            refAppViewId: 'plmweb.ai_knowledge_base_deleted_grid_view',
            name: 'EXPITEM:deleted',
            id: 'expitem:deleted',
          },
        ],
        controls: [
          {
            caption: '已启用',
            embeddedAppDEViewId: 'plmweb.ai_knowledge_base_actived_grid_view',
            codeName: 'management_tab_exp_view_actived',
            controlType: 'TABVIEWPANEL',
            appDataEntityId: 'plmweb.ai_knowledge_base',
            controlParam: {
              id: 'actived',
            },
            modelId: '0a141244baf881d3929cbbaf7d18acb8_actived',
            modelType: 'PSVIEWPANEL',
            name: 'actived',
            id: 'management_tab_exp_view_actived',
          },
          {
            caption: '已删除',
            embeddedAppDEViewId: 'plmweb.ai_knowledge_base_deleted_grid_view',
            codeName: 'management_tab_exp_view_deleted',
            controlType: 'TABVIEWPANEL',
            appDataEntityId: 'plmweb.ai_knowledge_base',
            controlParam: {
              id: 'deleted',
            },
            modelId: '0a141244baf881d3929cbbaf7d18acb8_deleted',
            modelType: 'PSVIEWPANEL',
            name: 'deleted',
            id: 'management_tab_exp_view_deleted',
          },
        ],
        codeName: 'management_tab_exp_view_tabexppanel',
        controlType: 'TABEXPPANEL',
        appDataEntityId: 'plmweb.ai_knowledge_base',
        controlParam: {},
        modelId: '0a141244baf881d3929cbbaf7d18acb8_tabexppanel',
        modelType: 'PSTABEXPPANEL',
        name: 'tabexppanel',
        id: 'management_tab_exp_view_tabexppanel',
      },
      {
        capLanguageRes: {
          lanResTag: 'PAGE.CAPTION.AI_KNOWLEDGE_BASE.MANAGEMENT_TAB_EXP_VIEW',
        },
        caption: '知识库',
        codeName: 'management_tab_exp_view_captionbar',
        controlType: 'CAPTIONBAR',
        appDataEntityId: 'plmweb.ai_knowledge_base',
        controlParam: {},
        name: 'captionbar',
        id: 'management_tab_exp_view_captionbar',
      },
    ],
    codeName: 'usr0416853629',
    controlType: 'VIEWLAYOUTPANEL',
    logicName: 'kb_management_tab_exp_view分页导航视图布局面板',
    appDataEntityId: 'plmweb.ai_knowledge_base',
    controlParam: {},
    modelId: 'd49fc5506a478c894078446555c48769',
    modelType: 'PSSYSVIEWLAYOUTPANEL',
    name: 'layoutpanel',
    id: 'usr0416853629',
  },
  title: '配置中心管理分页',
  titleLanguageRes: {
    lanResTag: 'PAGE.TITLE.AI_KNOWLEDGE_BASE.MANAGEMENT_TAB_EXP_VIEW',
  },
  viewStyle: 'DEFAULT',
  viewType: 'DETABEXPVIEW',
  enableDP: true,
  showCaptionBar: false,
  modelId: '0a141244baf881d3929cbbaf7d18acb8',
  modelType: 'PSAPPDEVIEW',
  name: 'ai_knowledge_basemanagement_tab_exp_view',
  id: 'plmweb.ai_knowledge_base_management_tab_exp_view',
};
