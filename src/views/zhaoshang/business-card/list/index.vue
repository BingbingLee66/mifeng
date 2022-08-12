<template>
  <div class="app-container">
    <div class="title">广州南沙自贸区</div>
    <div class="query-form">
      <el-form
        ref="query"
        :inline="true"
        :model="query"
        label-width="100px"
        label-position="right"
        size="small"
      >

        <el-form-item label="姓名">
          <el-input v-model.trim="query.name" clearable placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item label="公司名称">
          <el-input v-model.trim="query.companyName" clearable placeholder="请输入公司名称" />
        </el-form-item>

        <el-form-item label="商协会">
          <el-select v-model="query.chamber" placeholder="请选择">
            <el-option
              v-for="item in chamberOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="标签筛选">
          <el-select v-model="query.tag" placeholder="请选择">
            <el-option
              v-for="item in tagOpt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-button type="primary" size="small" @click.native="fetchData">查询</el-button>
        </el-form-item>
      </el-form>

      <div class="card-wrap">
        <div v-for="card in cardList" :key="card.id" class="card" @click="goToDetail(card.id)">
          <div class="header">
            <div class="brief">
              <div class="name">{{ card.name }}</div>
              <div class="companyName">{{ card.companyName }}</div>
            </div>
            <div class="avatar">
              <img :src="card.avatar" alt="">
            </div>
          </div>

          <div class="post" style="font-size: 16px;">职位：{{ card.post }}</div>
          <div class="phone">联系电话：{{ card.phone }}</div>
          <div class="chamber">
            <div>所在商协会：</div>
            <div>{{ card.chamberList.join(' ') }}</div>
          </div>
          <div class="tag">
            <div>标签：</div>
            <div class="tag-content">{{ card.tagList.join('，') }}</div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatarBg from '@/assets/img/avatar.gif'

export default {
  name: 'BusinessCardList',
  data() {
    return {
      query: {
        name: '',
        companyName: '',
        chamber: null,
        tag: null,
      },
      chamberOpt: [
        { label: '广东省江西商会', value: 'jx' },
        { label: '广东省商会', value: 'gd' },
      ],
      tagOpt: [
        { label: '房地产', value: 'fdc' },
        { label: '跨境电商', value: 'kj' },
      ],
      cardList: [
        {
          id: '1',
          name: '张三',
          companyName: '广州凯迪云科技有限公司',
          avatar: avatarBg,
          post: '董事长',
          phone: '13000000000',
          chamberList: ['广东省江西商会'],
          tagList: ['跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境']
        },
        {
          id: '2',
          name: '张三',
          companyName: '广州凯迪云科技有限公司',
          avatar: avatarBg,
          post: '董事长',
          phone: '13000000000',
          chamberList: ['广东省江西商会'],
          tagList: ['房地产', '跨境贸易', '跨境贸易', '跨境贸易', '跨境贸易', '跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易']
        },
        {
          id: '3',
          name: '张三',
          companyName: '广州凯迪云科技有限公司',
          avatar: avatarBg,
          post: '董事长',
          phone: '13000000000',
          chamberList: ['广东省江西商会'],
          tagList: ['房地产', '跨境贸易', '跨境贸易', '跨境贸易', '跨境贸易', '跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易']
        },
        {
          id: '4',
          name: '张三',
          companyName: '广州凯迪云科技有限公司',
          avatar: avatarBg,
          post: '董事长',
          phone: '13000000000',
          chamberList: ['广东省江西商会'],
          tagList: ['房地产', '跨境贸易', '跨境贸易', '跨境贸易', '跨境贸易', '跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易跨境贸易']
        }
      ]
    }
  },
  computed: {
    chamberId() {
      return this.$route.params.chamberId || ''
    }
  },
  mounted() {
    console.log('chamberId', this.chamberId)
  },
  methods: {
    fetchData() {
      // TODO 待完善
      console.log('fetchData')
    },

    goToDetail(id) {
      let path = ''
      if (this.$route.path.indexOf('/information-publish') > -1) path = `/zhaoshang/information-publish/${id}/card-detail`
      else path = `/zhaoshang/activity/${id}/card-detail`
      this.$router.push({ path })
    }
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
      margin: 0 20px 20px 0;
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
