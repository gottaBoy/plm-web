export default {
  tabLayout: 'TOP',
  loadDefault: true,
  showDataInfoBar: true,
  deviewCodeName: 'tab_exp_view',
  deviewId: '1adddab03add8fb394096535326669c7',
  accUserMode: 2,
  capLanguageRes: {
    lanResTag: 'PAGE.CAPTION.EXTEND_SCHEDULED_TASK.TAB_EXP_VIEW',
  },
  caption: '计划任务作业',
  codeName: 'extend_scheduled_task_tab_exp_view',
  appDataEntityId: 'plmweb.extend_scheduled_task',
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
                caption: '工具栏',
                itemStyle: 'DEFAULT',
                itemType: 'CTRLPOS',
                layoutPos: {
                  shrink: 1,
                  layout: 'FLEX',
                },
                showCaption: true,
                id: 'toolbar',
              },
              {
                rawItem: {
                  predefinedType: 'TELEPORT_PLACEHOLDER',
                  id: 'tab_toolbar',
                },
                caption: '传送部件占位',
                itemStyle: 'DEFAULT',
                itemType: 'RAWITEM',
                layoutPos: {
                  shrink: 1,
                  layout: 'FLEX',
                },
                showCaption: true,
                id: 'tab_toolbar',
              },
            ],
            layout: {
              align: 'flex-start',
              dir: 'row',
              layout: 'FLEX',
              valign: 'center',
            },
            dataRegionType: 'INHERIT',
            caption: '容器',
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
                          key: 'routeattributekeys',
                          value: 'category',
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
        dedrtabPages: [
          {
            caption: '计划任务',
            appViewId: 'plmweb.extend_scheduled_task_grid_view',
            id: 'task',
          },
          {
            caption: '作业历史',
            appViewId: 'plmweb.extend_scheduled_task_his_grid_view',
            id: 'task_his',
          },
          {
            caption: '任务类型',
            appViewId: 'plmweb.extend_task_type_grid_view',
            id: 'task_type',
          },
        ],
        dataRelationTag: 'Default',
        editItemCapLanguageRes: {
          lanResTag: 'DE.LNAME.EXTEND_SCHEDULED_TASK',
        },
        editItemCaption: '扩展计划任务',
        uniqueTag: 'extend_scheduled_task_tab_exp_view__tabexppanel',
        autoLoad: true,
        showBusyIndicator: true,
        codeName: 'default',
        controlType: 'DRTAB',
        appDataEntityId: 'plmweb.extend_scheduled_task',
        controlParam: {
          id: 'tabexppanel',
        },
        modelId: '8771df722db91d1584a149c52bd00a4c',
        modelType: 'PSDEDRTAB',
        name: 'tabexppanel',
        id: 'default',
      },
      {
        capLanguageRes: {
          lanResTag: 'PAGE.CAPTION.EXTEND_SCHEDULED_TASK.TAB_EXP_VIEW',
        },
        caption: '计划任务作业',
        codeName: 'tab_exp_view_captionbar',
        controlType: 'CAPTIONBAR',
        appDataEntityId: 'plmweb.extend_scheduled_task',
        controlParam: {},
        name: 'captionbar',
        id: 'tab_exp_view_captionbar',
      },
    ],
    codeName: 'usr0523312624',
    controlType: 'VIEWLAYOUTPANEL',
    logicName: 'tab_exp_view分页导航视图布局面板',
    appDataEntityId: 'plmweb.extend_scheduled_task',
    controlParam: {},
    modelId: 'd955eb98e0e3deaed73224331d20c284',
    modelType: 'PSSYSVIEWLAYOUTPANEL',
    name: 'layoutpanel',
    id: 'usr0523312624',
  },
  title: '计划任务作业',
  titleLanguageRes: {
    lanResTag: 'PAGE.TITLE.EXTEND_SCHEDULED_TASK.TAB_EXP_VIEW',
  },
  viewStyle: 'DEFAULT',
  viewType: 'DETABEXPVIEW',
  enableDP: true,
  showCaptionBar: false,
  modelId: 'db9ed1491dc1db46cf195234236a01cb',
  modelType: 'PSAPPDEVIEW',
  name: 'extend_scheduled_tasktab_exp_view',
  id: 'plmweb.extend_scheduled_task_tab_exp_view',
};
