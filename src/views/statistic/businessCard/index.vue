<template>
  <div class="app-container">
    <div class="chamber-statistics">
        <h3>名片数据</h3>
        <div class="text-btn-style" @click="showMeaning=true">数据定义</div>
    </div>
    <div class="data-card">
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.cardShareSum }}</div>
            <div class="card-key">名片分享数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.cardVisitorSum }}</div>
            <div class="card-key">名片访客数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.cardCollectSum }}</div>
            <div class="card-key">名片收藏数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.cardBackSum }}</div>
            <div class="card-key">回递名片数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.cardLabelAddSum }}</div>
            <div class="card-key">标签评论数</div>
          </div>
        </div>
        <div class="h-cut-line"></div>
        <div class="c-card-box">
          <div class="card-box-3">
            <div class="card-value">{{ sumData.cardLabelAcceptSum }}</div>
            <div class="card-key">标签点赞数</div>
          </div>
        </div>
    </div>
    <!-- 表格 -->
    <div class="chamber-statistics">
        <div>
            <span class="time">时间</span>
            <el-radio-group size="mini" style="margin-right:20px" v-model="days"  @change="initDatePicker">
                <el-radio-button :label="7">7天</el-radio-button>
                <el-radio-button :label="14">14天</el-radio-button>
                <el-radio-button :label="30">30天</el-radio-button>
            </el-radio-group>
            <el-date-picker
                size="mini"
                style="margin-right:20px"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                v-model="query.date"
                type="daterange"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="fetchData"
               >
            </el-date-picker>
            <el-radio-group size="mini" v-model="query.type"  @change="typeDatePicker">
                <el-radio-button :label="1">日</el-radio-button>
                <el-radio-button :label="2">周</el-radio-button>
                <el-radio-button :label="3">月</el-radio-button>
            </el-radio-group>
        </div>
        <el-button type="primary"  size="mini" :loading="exportLoaing"  @click="exportExcel">导表</el-button>
    </div>
    <el-table :data="list"  v-loading="listLoading" element-loading-text="Loading" border fit highlight-current-row >     
        <el-table-column align="center"  label="日期">
            <template slot-scope="scope">
            {{ scope.row.date }}
            </template>
        </el-table-column>
        <el-table-column align="center"  label="名片分享数" >
            <template slot-scope="scope">
            {{ scope.row.cardShareSum }}
            </template>
        </el-table-column>
        <el-table-column align="center"  label="名片访客数" >
            <template slot-scope="scope">
            {{ scope.row.cardVisitorSum }}
            </template>
        </el-table-column>
        <el-table-column align="center"  label="名片收藏数" >
            <template slot-scope="scope">
            {{ scope.row.cardCollectSum }}
            </template>
        </el-table-column>
        <el-table-column align="center"  label="回递名片数" >
            <template slot-scope="scope">
            {{ scope.row.cardBackSum }}
            </template>
        </el-table-column>
        <el-table-column align="center"  label="标签评论数" >
            <template slot-scope="scope">
            {{ scope.row.cardLabelAddSum }}
            </template>
        </el-table-column>
        <el-table-column align="center"  label="标签点赞数" >
            <template slot-scope="scope">
            {{ scope.row.cardLabelAcceptSum }}
            </template>
        </el-table-column>
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
      :style="{'padding-top': '15px'}">
    </el-pagination>


    
    <el-dialog title="数据定义" :visible.sync="showMeaning" width="496px">
      <div class="meaning-wrap">
        <div class="meaning-item">
          <div class="tit">名片分享数</div>
          <div class="sub">用户分享名片模版的次数<span style="color: #ff0000">（同一模版分享多次，则算多次）</span></div>
        </div>
        <div class="meaning-item">
          <div class="tit">名片访客数</div>
          <div class="sub">
            访问名片模版<span style="color: #ff0000">（第三人称）</span>的用户人数
            <span style="color: #ff0000">（UV）</span>
            </div>
        </div>
        <div class="meaning-item">
          <div class="tit">名片收藏数</div>
          <div class="sub">用户名片收藏成功的次数</div>
        </div>
        <div class="meaning-item">
          <div class="tit">回递名片数</div>
          <div class="sub">用户点击回递名片成功的次数</div>
        </div>
        <div class="meaning-item">
          <div class="tit">标签评论数</div>
          <div class="sub">统用户标签评论成功的次数</div>
        </div>
        <div class="meaning-item">
          <div class="tit">标签点赞数</div>
          <div class="sub">用户标签点赞成功的次数</div>
        </div>
      </div>
      <div style="text-align: center;">
        <el-button type="primary" @click="showMeaning=false">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {  downloadFile } from '../../activity/verify-detail/util'
import { getCardStatsDataList,getCardTotalData,listChamberTypeStatsDataByCkeyDownload } from '@/api/statistics/businessCard'
export default {
    components: {},
    data() { 
        return {
            showMeaning: false,
            sumData: {}, // 名片详情统计
            list: [],
            currentpage: 1,
            limit: 10,
            pageSizes: [10, 20, 50, 100, 500],
            query: {
                date: '',
                type: 1
            },
            days: 7, // 7天 14天 30天
            total: 0,
            listLoading: false,
            exportLoaing: false, //导表加载
        } 
    },
    created() {
         // 初始化时间
        this.initDatePicker()
        this.getTotalData()
    },
    methods: {
        getTotalData(){
            getCardTotalData().then(res => {
                if (res.state === 1) {
                    this.sumData = res.data
                }
            })
        },
        // 初始化时间
        initDatePicker() {
          const endDateNs = new Date()
          const startDateNs = new Date()
          startDateNs.setTime(startDateNs.getTime() - 3600 * 1000 * 24 * this.days)
          // 月、日 不够10补0
          const defalutStartTime = startDateNs.getFullYear() + '-' + ((startDateNs.getMonth() + 1) >= 10 ? (startDateNs.getMonth() + 1) : '0' + (startDateNs.getMonth() + 1)) + '-' + (startDateNs.getDate() >= 10 ? startDateNs.getDate() : '0' + startDateNs.getDate())
          const defalutEndTime = endDateNs.getFullYear() + '-' + ((endDateNs.getMonth() + 1) >= 10 ? (endDateNs.getMonth() + 1) : '0' + (endDateNs.getMonth() + 1)) + '-' + (endDateNs.getDate() >= 10 ? endDateNs.getDate() : '0' + endDateNs.getDate())
          this.query.date = [defalutStartTime, defalutEndTime]
          this.fetchData()
        },
        fetchData(){
            this.listLoading = true
            let params = {
            'startTime': this.query.date[0],
            'endTime': this.query.date[1],
            'pageNum': this.currentpage,
            'pageSize': this.limit, 
            'type': this.query.type,
            }
            getCardStatsDataList(params).then(response => {
                if(response.state == 1) {
                    this.list = response.data.list || []
                    this.total = response.data.totalRows
                } else {
                    this.list = []
                    this.total = 0
                }
                this.listLoading = false
            })
        },
        // 选择日周月
        typeDatePicker(val) {
            this.query.type = val
            this.fetchData()
        },
        // 导表
        async exportExcel(){
            this.exportLoaing = true
            try {
                const { query: { type, date }, currentpage, limit } = this
                const blob = await listChamberTypeStatsDataByCkeyDownload({ type, endTime:date[1], startTime:date[0], pageNum: currentpage, pageSize: limit})
                downloadFile({
                    title: `【名片数据】.xlsx`,
                    url: window.URL.createObjectURL(blob)
                })
            } catch (error) {
                // console.log(error)
            }
            this.exportLoaing = false
        },
        handleSizeChange(val) {
            this.limit = val
            this.currentpage = 1
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.currentpage = val
            this.fetchData()
        },


    },
  
}
</script>

<style lang="scss" scoped>
.app-container{
    .chamber-statistics{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        .time{
            color: #bbb;
            margin-right: 20px;
        }
    }
    .data-card {
        margin-bottom: 20px;
        width: 100%;
        height: 120px;
        border-radius: 2px;
        border: 1px solid #ccc;
        .c-card-box {
            float: left;
            width: 16.5%;
            height: 100%;
            text-align: center;
            display: table;
        }

        .card-box-3 {
            width: 100%;
            display: table-cell;
            vertical-align: middle;
        }

        .card-value {
            margin-bottom: 10px;
            color: #008000;
            font-weight: 600;
        }

        .h-cut-line {
            float: left;
            width: 1px;
            height: 100%;
            border-left: 1px solid #ccc;
        }
    }
}

</style>
