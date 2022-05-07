import {
  addHotActivity,
  delHotActivity,
  getActivitySource,
  getHotActivityList,
  updateHotActivitySort
} from '@/api/activity/hot-activity'

export default {
  data() {
    return {
      //查询表单对象
      query:{
        title:null,
        ckey:null,
        //0-全部 1-生效中 2-已关闭(过期关闭) 3-已关闭(成功合作) 4-已关闭(终止对接)
        status:'0',
        //冻结状态  0-全部 1-正常 2-平台冻结 3-商会冻结,
        publishStatus:'0',
        id:null,
        //发布时间 1-24小时,2-3天,3-7天,4-本月,0-所有
        publishTime:'0'
      },
      //供需状态
      statusList:[{label:'全部',value:'0'},{label:'生效中',value:'1'},{label:'已关闭(过期关闭)',value:'2'},{label:'已关闭(成功合作)',value:'3'},{label:'已关闭(终止对接)',value:'4'}],
      publishStatusList:[{label:'全部',value:'0'},{label:'正常',value:'1'},{label:'平台冻结',value:'2'},{label:'商会冻结',value:'3'}],
      publishTimeList:[{label:'所有',value:'0'},{label:'24小时',value:'1'},{label:'3天',value:'2'},{label:'7天',value:'3'},{label:'本月',value:'4'}]
     
    }
  },
  created() {

    this.fetchData()
  },
  methods: {
    fetchData(){},
    /**
     * 请求类
     */
    //拉取商会
     getChamberOptions() {
      getActivitySource().then(res => {
        this.chamberOptions = res.data
        console.log('this.chamberOptions', this.chamberOptions)
      })
    },
  }
}
