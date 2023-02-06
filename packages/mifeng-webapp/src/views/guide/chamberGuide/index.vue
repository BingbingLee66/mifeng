<template>
  <Panel>
    <a-form ref="formRef" :model="listFilter" class="form-select">
      <a-form-item label="标题" name="title">
        <a-input
          v-model:value="listFilter.title"
          placeholder="关键词"
          :maxlength="40"
          allowClear
          style="width: 150px"
        />
      </a-form-item>
      <a-form-item label="一级菜单" name="menu1Id">
        <a-select
          v-model:value="listFilter.menu1Id"
          :options="menu1List"
          placeholder="请选择一级菜单"
          allowClear
          style="width: 180px"
        />
      </a-form-item>
      <a-form-item label="二级菜单" name="menu2Id">
        <a-select
          v-model:value="listFilter.menu2Id"
          :options="menu2List"
          placeholder="请选择二级菜单"
          allowClear
          style="width: 180px"
        />
      </a-form-item>
    </a-form>
    <div class="flex-x-end-center">
      <a-button type="primary" class="mr-5" @click="fetchData">查询</a-button>
      <a-button @click="resetFilters">重置</a-button>
    </div>
  </Panel>
  <Panel>
    <a-spin :spinning="listLoading">
      <div class="chamber-middle">
        <div v-if="listData.length == 0" class="chamber-not">暂无数据~</div>
        <div v-else class="chamber-content">
          <a-row>
            <a-col :span="8" class="chamber-grid" v-for="item in listData" :key="item.id">
              <a-card hoverable>
                <div @click="ondetail(item.id)">
                  <div class="chamber-pre">
                    <img :src="item.vcover" class="chamber-avatar" />
                    <play-circle-outlined class="video-play" />
                  </div>
                  <div class="chamber-bottom">
                    <div class="chamber-title">{{ item.title }}</div>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-pagination
        v-model:current="listFilter.pageNum"
        v-model:pageSize="listFilter.pageSize"
        show-quick-jumper
        showSizeChanger
        :pageSizeOptions="['5', '10', '20', '30', '40']"
        :total="listTotal"
        @change="fetchData"
        :show-total="total => `共 ${total} 条`"
      />
    </a-spin>
  </Panel>
</template>
<script setup>
import { ref, reactive, watch, toRefs } from 'vue'
import { getguideList, getListByRank } from '@/api/guide/guide'
import { useResetFilter } from '@/use/useResetFilter'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const listFilter = reactive({
  title: '', // 标题
  menu1Id: null, // 一级菜单
  menu2Id: null, // 二级菜单
  pageNum: 1,
  pageSize: 5
})
const listTotal = ref(0)
const listData = ref([])
const listLoading = ref(false)
const menu1List = ref([])
const menu2List = ref([])

watch(
  () => listFilter.menu1Id,
  menuId => ongetListByTwin(menuId)
)
// 获取一级菜单
const ongetListByRank = async () => {
  const { data } = await getListByRank({ rank: 1 })
  menu1List.value = data.map(item => ({ value: item.id, label: item.menuName })) || []
  menu2List.value = []
}
// 选择二级级菜单
const ongetListByTwin = async menuId => {
  const { data } = await getListByRank({ rank: 2, menuId })
  menu2List.value = data.map(item => ({ value: item.id, label: item.menuName })) || []
}

// 获取数据
const fetchData = async () => {
  listLoading.value = true
  try {
    const {
      data: { list, totalRows }
    } = await getguideList({ ...listFilter })
    listData.value = list || []
    listTotal.value = totalRows
  } catch (error) {}
  listLoading.value = false
}

// 点击视频
const ondetail = id => {
  router.push({
    name: '操作指引详情',
    query: {
      detailsId: id
    }
  })
}
const { resetFilters } = useResetFilter({ ...toRefs(listFilter) }, fetchData)

ongetListByRank()
if (route.query.menu1Id) {
  listFilter.menu1Id = route.query.menu1Id
  listFilter.menu2Id = route.query.menu2Id
  ongetListByTwin(listFilter.menu1Id)
  //  清除页面缓存路由参数
  delete route.query.menu1Id
  delete route.query.menu2Id
}
fetchData()
</script>
<style lang="scss" scoped>
.form-select {
  display: flex;
  justify-content: space-between;
}
.chamber-middle {
  padding: 20px 0;
  .chamber-not {
    margin: 0 auto;
    width: 200px;
  }
  .chamber-content {
    width: 90%;
    .chamber-grid {
      width: 270px;
      margin: 0 50px 40px 0;
      cursor: pointer;
      .chamber-pre {
        position: relative;
        width: 100%;
        height: 260px;
        overflow: hidden;
        .chamber-avatar {
          width: 100%;
          height: 100%;
        }
        .video-play {
          position: absolute;
          top: 83%;
          right: 3%;
          font-size: 34px;
          color: #fff;
        }
      }
      .chamber-bottom {
        margin-top: 20px;
        height: 50px;
        font-size: 13px;
        font-weight: 700;
        .chamber-title {
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden; //溢出内容隐藏
          text-overflow: ellipsis; //文本溢出部分用省略号表示
          display: -webkit-box; //特别显示模式
          -webkit-line-clamp: 2; //行数
          line-clamp: 2;
          -webkit-box-orient: vertical; //盒子中内容竖直排列
          width: 100%;
          padding: 0 10px;
        }
      }
    }
  }
}
</style>
