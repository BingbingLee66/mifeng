<template>
  <div class="app-container">
    <div class="title">{{ title }}</div>
    <div class="query-form">
      <el-form
        ref="query"
        :inline="true"
        :model="query"
        label-width="70px"
        label-position="right"
        size="small"
      >

        <el-form-item label="姓名">
          <el-input v-model.trim="query.userName" clearable placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="公司名称">
          <el-input v-model.trim="query.companyName" clearable placeholder="请输入公司名称" />
        </el-form-item>

        <el-form-item label="商协会">
          <el-select v-model="query.ckey" clearable placeholder="请选择">
            <el-option
              v-for="item in chamberList"
              :key="item.id" :label="item.name" :value="item.ckey"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标签筛选">
          <el-select v-model="query.memberLabelId" clearable placeholder="请选择">
            <el-option
              v-for="item in tagOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" size="small" @click.native="fetchData(true)">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="card-wrap" v-loading="listLoading">
        <div v-for="card in cardList" :key="card.id" class="card" @click="goToDetail(card.cardId)">
          <div class="header">
            <div class="brief">
              <div class="name">{{ card.userName }}</div>
              <div class="companyName">{{ card.cardIdentityUnit }}</div>
            </div>
            <div class="avatar">
              <img :src="card.avatar || 'https://ysh-sh.oss-cn-shanghai.aliyuncs.com/prod/png/default_avatar.png'" alt="">
            </div>
          </div>

          <div class="post" style="font-size: 16px;">职位：{{ card.cardIdentityPost }}</div>
          <div class="phone">联系电话：{{ card.cardPhone }}</div>
          <div class="chamber">
            <div>所在商协会：</div>
            <div v-if="card.cardChambers">{{ card.cardChambers.join(' ') }}</div>
          </div>
          <div class="tag">
            <div>标签：</div>
            <div v-if="card.tagList" class="tag-content">{{ card.tagList.join('，') }}</div>
          </div>

        </div>
      </div>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="pageSizes"
        :page-size="limit"
        :total="total"
        :current-page.sync="currentpage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getAndTargetId,getDetailsByInvesKey } from '@/api/attract'
import avatarBg from '@/assets/img/avatar.gif'
import {chamberSearchList} from '@/api/chamber/manager'
export default {
  name: 'BusinessCardList',
  data() {
    return {
      query: {
        userName: '', // 姓名
        companyName: '', // 公司名称
        ckey: null, // 商协会唯一标识
        memberLabelId: null,  // 标签筛选
      },
      title:'', // 招商办名称
      chamberList: [],
      tagOpt: [
        { label: '房地产', value: 'fdc' },
        { label: '跨境电商', value: 'kj' },
      ],
      cardList: [],
      pageSizes: [6, 12, 18, 24],
      total: 0,
      currentpage: 1,
      limit: 6,
      listLoading:true
    }
  },
  computed: {
    chamberId() { // 招商活动或招商信息id
      return this.$route.params.chamberId || ''
    },
    chamberkey() { //  招商办key
      return this.$route.params.chamberkey || ''
    },
    type() {  // 1-招商信息2-招商活动
      return this.$route.params.type || ''
    }
  },
  mounted(){
    this.onGetDetailsByInvesKey()  // 招商办名称
    this.chamberSearchListFunc() // 获取商协会
    this.fetchData()
  },
  methods: {
      // 获取招商办名称
      onGetDetailsByInvesKey(){
          getDetailsByInvesKey(this.chamberkey).then(res=>{
            this.title = res.data.name
          })
      },
      // 获取商协会
      chamberSearchListFunc(){
      let param={
        name:""
      }
      chamberSearchList(param).then(res=>{
        if(res.state===1){
          this.chamberList=res.data
        }
      })
    },
    // 获取页面数据
    fetchData(reset) { 
      if (reset) this.currentPage = 1
      this.listLoading = true
      let params = {
        pageSize: this.limit,
        pageNum :this.currentpage,
        userName : this.query.userName,
        companyName : this.query.companyName,
        ckey : this.query.ckey,
        memberLabelId : this.query.memberLabelId,
        targetId : this.chamberId,
        type:this.type // 1-招商信息2-招商活动
      } 
      getAndTargetId(params).then(res=>{
        this.cardList = res.data.list
        this.cardList.forEach((v)=>{
          v.tagList = []
          v.memberLabels.forEach((j)=>{
            v.tagList.push(j.memberLabelName)
          })
        })
        console.log('this.cardList',this.cardList)
        this.total = res.data.totalRows
        this.listLoading = false;
      })
    },
    // 获取标题
    onGetInfoDetails(){
      getInfoDetails(this.chamberId).then(response => {
          this.title = response.data.name
      })
    },

    goToDetail(id) {
      let path = ''
      if (this.$route.path.indexOf('/information-publish') > -1) path = `/zhaoshang/information-publish/${id}/${this.type}/${this.chamberId}/card-detail`
      else path = `/zhaoshang/activity/${id}/${this.type}/${this.chamberId}/card-detail`
    
      this.$router.push({ path })
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
  }
}
</script>

<style scoped lang="scss">
.app-container {

  .title {
    padding-bottom: 20px;
    font-size: 20px;
  }

  .card-wrap {
    display: flex;
    flex-wrap: wrap;

    .card {
      width: 380px;
      border: 1px solid #6e6e6e;
      padding: 20px;
      margin: 0 40px 20px 0;
      cursor: pointer;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        font-size: 20px;
        font-weight: bold;
      }

      .companyName {
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
      }

      .avatar {
        width: 60px;
        height: 60px;

        img {
          width: 100%;
        }
      }
    }

    .post, .phone, .chamber, .tag {
      line-height: 22px;
      font-size: 14px;
    }

    .post, .tag {
      margin-top: 40px;
    }

    .tag-content {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

  }
}
</style>
