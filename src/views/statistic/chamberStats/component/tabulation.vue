<template>
  <div>
    <el-dialog title="" :visible.sync="detailVisible" width="70%">
         <el-table :data="list"  v-loading="listLoading" element-loading-text="Loading" border fit>        
                <template>
                    <el-table-column  v-for="(item,index) in tableData" :key="index"  align="center"  :label="item.name" :prop="item.vale"></el-table-column>
                </template>
         </el-table>
        <el-pagination 
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="pageSizes"
            :page-size="limit"
            :total="total"
            :current-page.sync="currentpage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :style="{'padding-top': '25px'}">
        </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import {
    getAllChamberStatsDataByCkeyList,
    getChamberTypeStatsDataByCkeyList
} from '@/api/statistics/chamberJoinData'
export default {
    props: {
        type: {
            type: Number,
            required: true,
            default: 1
        },
    },
  data() {
    return {
        detailVisible:false,
        pageSizes: [10, 20, 50, 100],
        total: 0,
        currentpage: 1,
        limit: 10,
        list:[],
        listLoading: false,
        //请求参数
        query:{
            date: '',
            ckey:"",
            moduleId:null,
            type:null
        },
        tableData:[],
         // 自定义埋点数据数组
        moduleList9:[{ name:'总点击数', vale:'total', },{ name:'热门供需_导航点击', vale:'hotDemandMenuSum', },
            { name:'热门供需_添加供需数量', vale:'hotDemandAddSum', },{ name:'轮播图更新_导航点击', vale:'carouselMenuSum', },
            { name:'轮播图更新_添加轮播图数量', vale:'carouselAddSum', },],
        moduleList10:[{ name:'总点击数', vale:'total', },{ name:'发布图文供需_导航点击', vale:'imageDemandMenuSum', },
            { name:'发布图文供需_发布图文供需数量', vale:'imageDemandAddSum', },{ name:'发布视频供需_导航点击', vale:'videoDemandMenuSum', },
            { name:'发布视频供需_发布视频供需数量', vale:'videoDemandAddSum', }, { name:'供需管理_导航点击', vale:'demandMenuSum', },
            { name:'供需管理_批量认证身份信息', vale:'demandAuthIdentitySum', }],
        moduleList11:[{ name:'总点击数', vale:'total', },{ name:'商/协会会员_导航点击', vale:'chamberMemberMenuSum', },{ name:'商/协会会员_添加会员数量', vale:'chamberMemberAddSum', },{ name:'商/协会会员_发送短信数量', vale:'chamberMemberMsgSendSum', },
            { name:'入会审核_导航点击', vale:'chamberVerifyMenuSum', }, { name:'入会审核_通过次数', vale:'chamberVerifyPassSum', },{ name:'入会审核_驳回次数', vale:'chamberVerifyRejectSum', }, { name:'会员资料修改审核_导航点击', vale:'infoUpdateMenuSum', },{ name:'会员资料修改审核_通过次数', vale:'infoUpdatePassSum', }, { name:'会员资料修改审核_驳回次数', vale:'infoUpdateRejectSum', },
            { name:'会费缴纳记录_导航点击', vale:'chamberCostMenuSum', }, { name:'会费缴纳记录_添加缴费记录', vale:'chamberCostAddSum', },
            { name:'会费缴纳通知_导航点击', vale:'chamberCostMsgMenuSum', }, { name:'会费缴纳通知_缴费通知', vale:'chamberCostMsgSendSum', },],
        moduleList12:[{ name:'总点击数', vale:'total', },{ name:'会内职务_导航点击', vale:'chamberPostMenuSum', },
            { name:'会内职务_添加商会职位', vale:'chamberPostAddSum', },{ name:'部门管理_导航点击', vale:'departmentMenuSum', },
            { name:'部门管理_添加部门', vale:'departmentAddSum', }, { name:'成员管理_导航点击', vale:'memberMenuSum', },
            { name:'成员管理_添加成员', vale:'memberAddSum', },{ name:'成员管理_调整部门', vale:'memberUpdateDepartmentSum', }],
    }
  },
  methods: {
    show(query,moduleId){
        this.tableData = []
        this.list = []
        this.currentpage = 1
        this.limit = 10
        if(query){
            this.query = JSON.parse(JSON.stringify(query))
            this.query.moduleId = moduleId
            this.choose(moduleId)  // 判断功能类型
            if(this.type == 1){
                this.fetchData()
            }else{
                this.fetDetails()
            }

        }else{
            this.detailVisible = true
        }
    },
    // 商会统计数据列表查询
    fetchData(){
        this.listLoading = true
        let params = {
        'startTime': this.query.date[0],
        'endTime': this.query.date[1],
        'pageNum': this.currentpage,
        'pageSize': this.limit, 
        'ckey':this.query.ckey,
        'moduleId':this.query.moduleId
        }
        getAllChamberStatsDataByCkeyList(params).then(response => {
            if(response.state == 1) {
                this.list = response.data.list || []
                this.total = response.data.totalRows
            }else{
                this.list = []
                this.total = 0
            }
            this.listLoading = false
            this.detailVisible = true
        })
    },
     // 商会详情统计数据列表查询
    fetDetails(){
        this.listLoading = true
        let params = {
          'startTime': this.query.date[0],
          'endTime': this.query.date[1],
          'pageNum': this.currentpage,
          'pageSize': this.limit, 
          'ckey':this.query.ckey,
          'moduleId':this.query.moduleId,
          'type': this.query.type,
        }
        getChamberTypeStatsDataByCkeyList(params).then(response => {
            if(response.state == 1) {
                this.list = response.data.list || []
                this.total = response.data.totalRows
            }else{
                this.list = []
                this.total = 0
            }
            this.listLoading = false
            this.detailVisible = true
        })
    },
    choose(moduleId){
        let stats = {name:'商协会名称', vale:'chamberName'}
        let detail = {name:'日期', vale:'date'}
        // type 1: 商会后台使用统计  2:商会详情
        this.tableData = JSON.parse(JSON.stringify(this.chamberStats(moduleId)))
        if (this.type == 1)  this.tableData.unshift(stats)
        if (this.type == 2)  this.tableData.unshift(detail)
        console.log('moduleId',moduleId,this.tableData)
    },
    // 获取对应的标头
    chamberStats(moduleId){
        //  0-全部功能 9-首页更新 10-供需管理 11-会员管理 12-组织架构 13-内容管理 14-活动管理 15-数据统计 16-系统设置
        switch (moduleId){ 
            case 9: return this.moduleList9; 
            case 10: return this.moduleList10;
            case 11: return this.moduleList11; 
            case 12: return this.moduleList12; 
            case 13: return this.moduleList13; 
            case 14: return this.moduleList14;
            case 15: return this.moduleList15; 
            case 16: return this.moduleList16; 
        }
    },
    handleSizeChange(val) {
        this.limit = val
        this.currentpage = 1
        if(this.type == 1){
            this.fetchData()
        }else{
            this.fetDetails()
        }
    },
    handleCurrentChange(val) {
        this.currentpage = val
        if(this.type == 1){
            this.fetchData()
        }else{
            this.fetDetails()
        }
    },
  },
}
</script>
<style lang="scss" scoped>


</style>
