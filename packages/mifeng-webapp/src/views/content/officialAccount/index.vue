<template>
  <a-tabs v-model:activeKey="activeKey" @change="fetchTableData({ page: 1 })" class="bg-white pl-8">
    <a-tab-pane key="publish" tab="发布记录" />
    <a-tab-pane key="authorized" tab="授权账号" />
  </a-tabs>

  <PlusTable
    :columns="activeKey === 'publish' ? columns1 : columns2"
    :data-source="tableData"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    :scroll="{ x: 'max-content' }"
  >
    <template #toolBar>
      <a-button
        v-if="activeKey === 'authorized' && tableData.length < 1"
        type="primary"
        :disabled="tableData.length > 0"
        @click="onBinding"
        >授权公众号</a-button
      >
    </template>
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex === 'officialAccountType'">
        公众号类型
        <a-tooltip>
          <template #title
            >根据微信规定，每个订阅号，每天可发布一次，每次最多8篇文章；每个服务号，每月可发布4次，每次最多8篇文章.</template
          >
          <question-circle-filled />
        </a-tooltip>
      </template>
    </template>
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'title'">
        <div class="pre">{{ record.title }}</div>
      </template>
      <template v-if="column.dataIndex === 'releaseTime'">
        {{ $filters.dateFormat(record.releaseTime) }}
      </template>
      <template v-if="column.dataIndex === 'operate'">
        <a-button v-if="record.authStatus == 2" @click="onBinding" type="link">授权</a-button>
        <a-button v-else @click="onRelieve(record)" type="link" danger>解除授权</a-button>
      </template>
    </template>
  </PlusTable>
  <!-- 绑定公众号协议组件 -->
  <agreement ref="agreements" @save="onSave" />
  <!-- 文章二维码 -->
  <a-modal title="" v-model:visible="isShow" width="40%" :before-close="handleClose" :footer="null">
    <div class="box">
      <h3>已发布到云商会，扫码立即分享</h3>
      <a-image
        style="width: 250px; height: 250px"
        :src="qrCode[0]"
        :preview="{ visible: false }"
        @click="visible = true"
      />
      <div style="display: none">
        <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
          <a-image v-for="(item, index) in qrCode" :src="item" :key="index" />
        </a-image-preview-group>
      </div>
    </div>
    <div class="btn">
      <a-button type="primary" @click="handleClose">取消</a-button>
    </div>
  </a-modal>
</template>
<script>
import { useAntTable } from '@/use/useAntTable'
import { inject, ref } from 'vue'
import agreement from './component/agreement'
import { Modal } from 'ant-design-vue'
import {
  officialAccountList,
  officialAccountUrl,
  getArticleSyncRecord,
  getArticleQRCode,
  officialAccountAuthInfo,
  officialAccountUnbind
} from '@/api/content/officialAccount'
import { useRoute, useRouter } from 'vue-router'
export function useTable(type) {
  const activeKey = type
  const releaseStatusList = new Map([
    [0, ''],
    [1, '发布成功'],
    [2, '发布失败'],
    [3, '发布中'],
    [4, '未发布']
  ])
  const statusMap = new Map([
    [1, 'success'],
    [2, 'error'],
    [3, 'processing'],
    [4, 'default']
  ])
  const tableData = ref([])
  const ckey = inject('ckey')
  const { fetchTableData, pagination, handleTableChange, loading } = useAntTable({
    async fetchFn({ current: page, pageSize }) {
      let API = officialAccountList
      const params = {
        page,
        pageSize
      }
      if (activeKey.value === 'publish') {
        API = getArticleSyncRecord
        params.ckey = ckey.value
      }

      const { data } = await API(params)

      tableData.value = data.list || []
      return { total: data.totalRows || 0 }
    }
  })
  fetchTableData()

  // 解除授权
  const onRelieve = row => {
    Modal.confirm({
      title: '提示',
      content: '是否确定解除授权该公众号？解绑之后无法进行将文章发布到公众号。',
      okText: '确定解除授权',
      cancelText: '点错了，保持授权',
      async onOk() {
        const { state, msg } = await officialAccountUnbind({ id: row.id })
        if (state !== 1) throw msg
        fetchTableData()
      }
    })
  }
  const subscribe = 1
  const weChat = 1
  return {
    activeKey,
    columns1: [
      { title: '文章标题', dataIndex: 'title' },
      {
        title: '发布平台',
        dataIndex: 'releasePlatform',
        width: 120,
        customRender: ({ record }) => {
          return record.releasePlatform === weChat ? '微信公众号' : ' --'
        }
      },
      { title: '发布时间', dataIndex: 'releaseTime', width: 200 },
      {
        title: '状态',
        dataIndex: 'freezeStatus',
        customRender: ({ record }) => {
          return (
            <div>
              <a-badge status={statusMap.get(record.releaseStatus)} v-show={record.releaseStatus} />
              {releaseStatusList.get(record.releaseStatus)}
            </div>
          )
        },
        width: 120
      },
      { title: '备注', dataIndex: 'comment', width: 200 }
    ],
    columns2: [
      { title: '授权的公众号', dataIndex: 'officialAccountName' },
      {
        title: '公众号类型',
        dataIndex: 'officialAccountType',
        customRender: ({ record }) => {
          return record.officialAccountType === subscribe ? '订阅号' : ' 服务号'
        }
      },
      { title: '操作', dataIndex: 'operate' },
      {
        title: '说明',
        dataIndex: 'comment',
        width: 200
      }
    ],
    tableData,
    fetchTableData,
    pagination,
    handleTableChange,
    loading,
    onRelieve
  }
}

function authorization() {
  const agreements = ref()
  // 点击授权
  const onBinding = () => {
    agreements.value.open()
  }

  // 手动添加mate标签
  const addMeta = (name, content) => {
    const meta = document.createElement('meta')
    meta.content = content
    meta.name = name
    document.getElementsByTagName('head')[0].appendChild(meta)
  }
  // 确定授权
  const onSave = () => {
    addMeta('referrer', 'origin-when-cross-origin')
    window.location.href = link.value
  }
  const link = ref('')
  // 公众号外部链接
  const externalLinks = async () => {
    const params = {
      deviceType: 0, // 设备类型：0-PC, 1-H5
      platformType: 0 // 平台类型： 0-微信公众号
    }
    const { data } = await officialAccountUrl(params)
    link.value = data || ''
  }
  externalLinks()

  // 如果创建完文章跳转过来显示二维码
  const isShow = ref(false)
  const qrCode = ref([])
  const ckey = inject('ckey')
  const QRCode = async articleId => {
    const params = {
      articleId, // 文章ID
      ckey: ckey.value
    }

    const {
      data: { qrCodeUrl }
    } = await getArticleQRCode(params)
    qrCode.value = qrCodeUrl
    isShow.value = true
  }
  // 查询授权信息
  const onOfficialAccountAuthInfo = async authCode => {
    const params = {
      authCode, // 授权码
      platformType: 0
    }
    await officialAccountAuthInfo(params)
  }
  const route = useRoute()
  const { query } = route
  const type = ref('publish')
  if (query.articleId) QRCode(query.articleId)

  // 授权处理完 调起查询授权信息
  if (query.auth_code) {
    type.value = 'authorized'
    onOfficialAccountAuthInfo(query.auth_code)
  }
  // 关闭弹窗
  const router = useRouter()
  const handleClose = () => {
    isShow.value = false
    router.push({ query: {} })
  }
  return { agreements, onBinding, onSave, isShow, type, handleClose, qrCode }
}
export default {
  components: { agreement },

  setup() {
    const { type, ...authInfo } = authorization()
    const tableInfo = useTable(type)
    return { ...tableInfo, ...authInfo, visible: ref(false) }
  }
}
</script>

<style lang="scss" scoped>
:deep(.ant-tabs-nav) {
  margin: 0;
}
.btn {
  width: 100%;
  text-align: center;
  margin: 50px 0 20px 0;
}
.box {
  width: 100%;
  text-align: center;
}
.pre {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分省略号 */
  word-break: break-all; /* break-all(允许在单词内换行。) */
  display: -webkit-box; /* 对象作为伸缩盒子模型显示 */
  -webkit-box-orient: vertical; /* 设置或检索伸缩盒对象的子元素的排列方式 */
  -webkit-line-clamp: 2; /* 显示的行数 */
}
</style>
