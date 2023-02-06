<template>
  <Panel>
    <div v-if="!dataList.length" class="mail-not"><a-empty /></div>
    <div v-else>
      <a-list item-layout="horizontal" :loading="loading" :data-source="dataList" :pagination="pagination">
        <template #renderItem="{ item }">
          <a-list-item @click="goDetails(item)">
            <div v-if="item.readStatus == '2'" class="mail-dot" />
            <a-list-item-meta>
              <template #title>
                <div class="mail-top">
                  <div class="mail-title">您收到一条平台消息</div>
                  <div>{{ item.sendTs }}</div>
                </div>
              </template>
              <template #avatar>
                <a-avatar :src="item.logo" />
              </template>
              <template #description>
                <div class="mail-mat">{{ item.title }}</div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </Panel>
</template>
<script>
import { stationPageList, readStationMail } from '@/api/mass-notification/index'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { READ_STATUS } from '@/constant/sms'
export default {
  setup() {
    const mailInfo = mail()
    return { ...mailInfo }
  }
}
function mail() {
  const dataList = ref([])
  const loading = ref(false)
  const pagination = reactive({
    pageSize: 5,
    current: 1,
    showQuickJumper: true,
    onChange: page => {
      pagination.current = page
      fetchData()
    }
  })
  const fetchData = async () => {
    loading.value = true
    const condition = {
      pageSize: pagination.pageSize,
      page: pagination.current
    }
    const {
      data: { list }
    } = await stationPageList(condition)
    dataList.value = list
    loading.value = false
  }
  fetchData()
  // 跳转站内信
  const router = useRouter()
  const goDetails = async row => {
    if (row.readStatus === READ_STATUS.UNREAD) await readStationMail({ id: row.shrId })
    router.push({
      name: '站内信详情',
      query: {
        id: row.gsId
      }
    })
  }
  return {
    dataList,
    pagination,
    loading,
    goDetails
  }
}
</script>
<style lang="scss" scoped>
.ant-list-item {
  display: flex;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  .mail-dot {
    position: absolute;
    right: 7px;
    top: 7px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: red;
  }
}
.mail-top {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  .mail-title {
    font-weight: bold;
  }
}
.mail-mat {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}
.mail-not {
  margin: 100px auto;
  width: 200px;
}
</style>
