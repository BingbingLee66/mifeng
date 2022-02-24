/**
 * 改文件为公共数据源，请不要改源文件，可在页面代码自行更改
 */
//动态类型数组
export const dynamicTypeList = [{
      label: '全部',
      value: "0",
    },
    {
      label: '图文动态',
      value: "1",
    },
    {
      label: '视频动态',
      value: "2",
    }
  ];
  //发布状态list
  export const statusList = [{
        label: '全部',
        value: '-1'
      },
      {
        label: '已发布',
        value: '1'
      },
      {
        label: '已冻结',
        value: '3'
      },
      {
        label: '定时发布',
        value: '4'
      },
    ];
    //发布时间list
    export const publishTimeTypeList = [{
          label: '24小时',
          value: '1'
        },
        {
          label: '3天',
          value: '2'
        },
        {
          label: '7天',
          value: '3'
        },
        {
          label: '本月',
          value: '4'
        },
        {
          label: '所有',
          value: '0'
        }
      ]
