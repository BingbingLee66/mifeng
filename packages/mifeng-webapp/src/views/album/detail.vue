<template>
  <div class="p-albumDetail wrap p-main-padding">
    <div class="container" @scroll="onScroll">
      <h2>{{ albumDetail.albumName }}</h2>
      <div class="flex-x-between-center">
        <div class="flex-x-start-center">
          <a-input
            v-model:value="query.fileName"
            style="width: 300px"
            size="large"
            class="mr20"
            placeholder="图片名称"
            @input="onQueryChange({ fileName: query.fileName, imgId: '', isFinished: false })"
          >
            <template #prefix>
              <search-outlined />
            </template>
          </a-input>
          展示状态
          <a-select
            v-model:value="auditStatus"
            style="width: 300px"
            size="large"
            class="ml20"
            :options="ALBUM_AUDIT_LIST"
            @change="onQueryChange({ auditStatus, imgId: '', isFinished: false })"
          />
        </div>
        <a-upload
          v-if="hasEditAuth"
          name="file"
          accept="image/jpg,image/png,image/jpeg,image/bmp"
          :customRequest="customRequest"
          :before-upload="beforeUpload"
          :showUploadList="false"
          multiple
        >
          <a-button type="primary" size="large"> 上传图片 </a-button>
        </a-upload>
      </div>

      <div class="content">
        <a-spin :spinning="loading">
          <div class="img-falls ml30">
            <a-timeline mode="left">
              <a-timeline-item v-if="albumDetail.img" color="green" type="success">
                <div class="timeline-item-title">相册封面</div>
                <BaseImg :img="albumDetail.img" :tag="generateTag({ useType: 1 })" />
              </a-timeline-item>
              <a-timeline-item v-for="date of imgFalls" color="gray" :key="date.name" type="primary">
                <div class="timeline-item-title">{{ date.name }}</div>
                <a-card class="img-fall-item">
                  <div class="imgs">
                    <template v-for="img of date.children" :key="img.id">
                      <UploadingImg
                        v-if="img.file"
                        :file="img.file"
                        :album-id="$route.query.id"
                        :index="uploadingList.findIndex(v => v.id === img.id)"
                        @delete="onDelUploadingImg(img, true)"
                        @reject="onUploadFail(img)"
                        @fail="onUploadFail(img)"
                        @success="onUploadSuccess(img, $event)"
                        @coverChange="onCoverChange"
                      />
                      <BaseImg
                        v-else
                        :img="img"
                        class="img-item"
                        :operations="!img.auditStatus || isCover(img) ? ['preview'] : ['preview', 'cover']"
                        :tag="generateTag(img)"
                        :edit-auth="hasEditAuth"
                        @click="toggleSelect(img)"
                        @coverChange="onCoverChange(img)"
                      >
                        <template v-if="hasEditAuth">
                          <div v-show="!isCover(img) && selectedImgIds.includes(img.id)" class="img-overlay" />
                          <close-circle-filled
                            v-if="!isCover(img)"
                            class="close-icon"
                            @click.stop="onDelImgs([img.id])"
                          />
                          <i
                            v-if="!isCover(img)"
                            class="radio"
                            :class="{ selected: selectedImgIds.includes(img.id) }"
                          />
                        </template>
                      </BaseImg>
                    </template>
                  </div>
                </a-card>
              </a-timeline-item>
              <a-timeline-item v-if="!imgFalls.length" color="yellow">
                <h3>暂无图片</h3>
                <BaseImg :img="{ img: 'https://ysh-cdn.kaidicloud.com/test/common/img_list_empty.png' }" />
              </a-timeline-item>
            </a-timeline>
          </div>
        </a-spin>
      </div>
    </div>
    <div class="footer flex-x-end-center">
      <template v-if="hasEditAuth">
        <a-button
          class="mr20"
          :disabled="handleDisabled"
          size="large"
          :loading="loadingData.del"
          :danger="!handleDisabled"
          @click="onDelImgs(selectedImgIds)"
          >删除</a-button
        >
        <a-button
          class="mr20"
          :disabled="handleDisabled"
          size="large"
          :loading="loadingData.hide"
          @click="toggleImgStatus(selectedImgIds, ALBUM_TYPE_FREEZE)"
          >隐藏</a-button
        >
        <a-button
          class="mr20"
          :disabled="handleDisabled"
          :loading="loadingData.open"
          size="large"
          @click="toggleImgStatus(selectedImgIds, ALBUM_TYPE_OPEN)"
          >公开</a-button
        >
        <a-button size="large" class="mr20" :loading="loadingData.download" @click="handleDownload">下载</a-button>
      </template>
      <template v-else>
        <a-button size="large" class="mr20" @click="toggleRelevance">取消关联</a-button>
      </template>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, computed, ref, onUnmounted } from 'vue'
import { Message, Modal, Timeline } from 'ant-design-vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { getAlbumImgList, delAlbumImgs, changeAlbumImgStatus, getAlbumDetail, cancelReleAlbum } from '@/api/album'
import { downloadFile } from '@/utils'
import BaseImg from './components/BaseImg'
import UploadingImg from './components/UploadingImg'
import {
  ALBUM_AUDIT_LIST,
  PICTURE_TYPE_OPEN,
  PICTURE_TYPE_FREEZE,
  ALBUM_TYPE_OPEN,
  ALBUM_TYPE_FREEZE
} from './constant'
export default defineComponent({
  components: { BaseImg, UploadingImg, ATimeline: Timeline, ATimelineItem: Timeline.Item },
  setup() {
    const query = reactive({ fileName: '', imgId: '', isFinished: false, pageSize: 20 })
    const auditStatus = ref('')
    const loading = ref(false)
    const uploadingList = ref([])
    const imgList = ref([])
    const selectedImgs = ref([])
    const route = useRoute()
    const router = useRouter()

    const loadingData = reactive({
      download: false,
      del: false,
      open: false,
      hide: false
    })
    // 懒加载照片和query变化获取数据的定时器
    let scrollTimer
    let queryTimer
    const albumDetail = reactive({
      imgCount: 0
    })
    // 时间轴瀑布 主轴按日期划分 每个日期再划分24个时段
    // eq [{name: '2022-08-30 10:00 ~ 11:00',children:[{name:'图片名称'}]}]
    const imgFalls = computed(() => {
      return arrToTree([...uploadingList.value, ...imgList.value], '$date')
    })
    const hasEditAuth = computed(() => {
      const { editAuth } = route.query
      if (typeof editAuth === 'number') return !!editAuth
      if (typeof editAuth === 'string') return !!Number(editAuth)

      return true
    })
    const selectedImgIds = computed(() => {
      return selectedImgs.value.map(v => v.id)
    })
    const handleDisabled = computed(() => {
      return !selectedImgs.value.length || selectedImgs.value.some(isCover)
    })

    const handleFreezeDisabled = computed(() => {
      const hasOPEN = selectedImgs.value.some(v => v.status === PICTURE_TYPE_OPEN)
      const hasFreeze = selectedImgs.value.some(v => v.status === PICTURE_TYPE_FREEZE)
      return !selectedImgs.value.length || hasFreeze || !hasOPEN
    })
    const handleOverFreezeDisabled = computed(() => {
      const hasOPEN = selectedImgs.value.some(v => v.status === PICTURE_TYPE_OPEN)
      const hasFreeze = selectedImgs.value.some(v => v.status === PICTURE_TYPE_FREEZE)
      return !selectedImgs.value.length || hasOPEN || !hasFreeze
    })

    /**
     * 上传图片之前的处理
     * @param file 当前上传文件
     */
    const beforeUpload = file => {
      if (uploadingList.value.length >= albumDetail.maxImgCount - albumDetail.imgCount) {
        Message.error(`${file.name}上传失败,最多只能上传${albumDetail.maxImgCount}个文件`)
        return false
      }
      if (!file.size) {
        Message.error('请不要上传空文件')
        return false
      }
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'].includes(file.type) ||
        !/(jpeg)|(jpg)|(png)|(bmp)$/i.test(file.name)
      ) {
        Message.error('上传图片只能是 JPG 或 PNG 或 BMP 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 10) {
        Message.error('上传图片大小不能超过 10MB!')
        return false
      }
      return true
    }
    const customRequest = ({ file }) => {
      albumDetail.imgCount++
      uploadingList.value.unshift(formatImgData({ file, createdTs: Date.now(), id: `uid_${file.uid}` }))
    }
    // 按key将数组生成树
    const arrToTree = (arr, key, ...restKeys) => {
      if (!key) return arr
      const map = arr.reduce((map, cur) => {
        const value = cur[key]
        if (!map[value]) {
          map[value] = { name: value, children: [cur] }
        } else {
          map[value].children.push(cur)
        }
        return map
      }, {})
      const res = Object.values(map)
      res.forEach(v => (v.children = arrToTree(v.children, ...restKeys)))
      return res
    }

    // 是否为封面
    const isCover = img => {
      return +img.useType === 1
    }
    // 格式化照片数据
    const formatImgData = img => {
      if (img.$date) return
      // eslint-disable-next-line
      const [dateStr, timeStr] = dayjs(+img.createdTs).format('YYYY-MM-DD@hh').split('@')
      img.$date = `${dateStr} ${timeStr}:00 ~ ${+timeStr + 1}:00`
      return img
    }

    const handleDownload = () => {
      if (!selectedImgIds.value.length) return Message.warning('请选择下载图片')
      const downloadQueue = [...selectedImgIds.value]
      let downloadingLen = 0
      const downloadProcess = () => {
        if (downloadingLen >= 5) return // 维持5个并发
        if (!downloadingLen && !downloadQueue.length) {
          // 下载完毕
          loadingData.download = false
          Message.success('下载完成')
        }
        const preDownloadingQueue = downloadQueue.splice(0, 5 - downloadingLen)
        selectedImgs.value.forEach(async v => {
          if (preDownloadingQueue.includes(v.id)) {
            downloadingLen++
            try {
              await downloadFile({ url: v.img, title: v.fileName }) // 下载
              const index2 = selectedImgs.value.findIndex(img => v.id === img.id) // 下载完后将对应的选择框取消
              selectedImgs.value.splice(index2, 1)
            } finally {
              // 防止失败仍占坑
              downloadingLen--
              downloadProcess(v.id) // 递归
            }
          }
        })
      }
      downloadProcess()
      loadingData.download = true
    }

    const toggleRelevance = () => {
      Modal.confirm({
        title: '',
        content: '确定取消关联？',
        async onOk() {
          await cancelReleAlbum({
            albumCkey: route.query.albumCkey || ''
          })
          setTimeout(() => {
            router.go(-1)
          }, 500)
        }
      })
    }
    const onDelImgs = async imgIds => {
      try {
        Modal.confirm({
          title: '删除后无法恢复',
          content: '是否继续删除？',
          async onOk() {
            loadingData.del = true
            try {
              await delAlbumImgs({ imgIds })
              imgList.value = imgList.value.filter(v => !imgIds.includes(v.id))
              selectedImgs.value = []
              albumDetail.imgCount = albumDetail.imgCount - imgIds.length
            } catch (error) {}
            loadingData.del = false
          }
        })
      } catch (err) {
        Message.info('已取消删除')
      }
    }

    // 切换图片状态
    const toggleImgStatus = async (imgIds, type) => {
      loadingData[type === ALBUM_TYPE_OPEN ? 'open' : 'hide'] = true
      try {
        await changeAlbumImgStatus({ imgIds: imgIds.join(','), type })
        imgList.value.forEach(v => {
          if (imgIds.includes(v.id)) {
            v.auditStatus = type
          }
        })
        selectedImgs.value = []
      } catch (error) {}
      loadingData[type === ALBUM_TYPE_OPEN ? 'open' : 'hide'] = false
    }
    // 获取相册数据
    const queryAlbumDetail = async () => {
      const { data } = await getAlbumDetail(route.query)
      Object.assign(albumDetail, data)
    }
    // 获取图片数据
    const fetchData = async () => {
      if (query.isFinished || loading.value) return
      loading.value = true
      try {
        const {
          data: { list }
        } = await getAlbumImgList({
          ...query,
          albumId: route.query.id
        })
        list.forEach(formatImgData)
        query.isFinished = list.length < query.pageSize
        if (!query.imgId) {
          // 初次查询
          imgList.value = list
        } else {
          // 翻页查询
          imgList.value.push(...list)
        }
        const lastImg = list[list.length - 1]
        query.imgId = lastImg && lastImg.id // 最后一张照片id
      } finally {
        loading.value = false
      }
    }

    // 懒加载数据
    const onScroll = e => {
      if (scrollTimer) return
      scrollTimer = setTimeout(() => {
        scrollTimer = null
        const { scrollTop, clientHeight, scrollHeight } = e.target
        if (scrollHeight - clientHeight - scrollTop < 50) {
          fetchData()
        }
      }, 200)
    }
    const onQueryChange = e => {
      Object.assign(query, e)
      if (e.auditStatus === '3') {
        delete query.auditStatus
        query.status = 3
      } else {
        delete query.status
        query.auditStatus = e.auditStatus
      }
      if (!e.imgId && selectedImgs.value.length) selectedImgs.value = []
      clearTimeout(queryTimer)
      queryTimer = setTimeout(() => fetchData(), 300)
    }
    // 生成标签
    const generateTag = img => {
      if (isCover(img)) return { name: '封面', type: 'success' }

      if (+img.status === 3) {
        return { name: '已冻结', type: 'error' }
      } else if (+img.auditStatus === 0) {
        return { name: '隐藏', type: 'default' }
      } else {
        return { name: '公开' }
      }
    }
    // 封面切换
    const onCoverChange = img => {
      imgList.value.forEach(v => {
        v.useType = 0
      })
      img.useType = 1
      albumDetail.img = img
    }
    // 选择照片
    const toggleSelect = img => {
      if (isCover(img)) return

      const index = selectedImgs.value.findIndex(v => v.id === img.id)
      if (index > -1) {
        // 删除
        selectedImgs.value.splice(index, 1)
      } else {
        // 添加
        selectedImgs.value.push(img)
      }
    }

    const onDelUploadingImg = (img, isDelete) => {
      if (isDelete) albumDetail.imgCount--
      const index = uploadingList.value.findIndex(v => v.id === img.id)
      uploadingList.value.splice(index, 1)
    }
    const onUploadFail = img => {
      onDelUploadingImg(img)
      uploadingList.value.push(img)
      albumDetail.imgCount--
    }
    const onUploadSuccess = (img, { value }) => {
      onDelUploadingImg(img) // 删除正在上传
      imgList.value.unshift(formatImgData(value)) // 添加已上传
    }

    onUnmounted(() => {
      clearTimeout(queryTimer)
      clearTimeout(scrollTimer)
    })
    queryAlbumDetail()
    fetchData()
    return {
      query,
      uploadingList,
      albumDetail,
      hasEditAuth,
      selectedImgs,
      handleOverFreezeDisabled,
      handleFreezeDisabled,
      handleDisabled,
      selectedImgIds,
      imgList,
      loading,
      auditStatus,
      imgFalls,
      beforeUpload,
      customRequest,
      handleDownload,
      toggleRelevance,
      onQueryChange,
      onScroll,
      toggleImgStatus,
      onDelImgs,
      generateTag,
      isCover,
      onCoverChange,
      toggleSelect,
      onUploadSuccess,
      onUploadFail,
      onDelUploadingImg,
      ALBUM_AUDIT_LIST,
      PICTURE_TYPE_OPEN,
      PICTURE_TYPE_FREEZE,
      ALBUM_TYPE_OPEN,
      ALBUM_TYPE_FREEZE,
      loadingData
    }
  }
})
</script>

<style lang="scss" scoped>
.wrap {
  // padding-bottom: 0;
  height: calc(100vh - 150px);
  // margin-bottom: -30px;
  background-color: #eff2f6;
  display: flex;
  flex-direction: column;
  .red {
    color: red;
  }
  .container {
    flex: 1;
    background-color: #fff;
    padding: 20px;
    overflow: auto;
  }

  .input-item {
    width: 300px;
    margin: 0 20px;

    &:first-child {
      margin-left: 0;
    }
  }

  .content {
    margin-top: 20px;
  }
  .timeline-item-title {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin-bottom: 10px;
  }

  .img-fall-item {
    .date-item {
      .time {
        color: #999;
        margin-bottom: 4px;
      }
    }

    .imgs {
      display: flex;
      flex-wrap: wrap;
      margin: -20px 0 0 -20px;

      .img-item {
        margin: 20px 0 0 20px;
        cursor: pointer;
      }

      .img-overlay {
        position: absolute;
        left: 0;
        top: 0;
        width: 200px;
        height: 200px;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 9;
      }

      .close-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 24px;
        border-radius: 50%;
        z-index: 19;

        &::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 8px;
          height: 8px;
          transform: translate(-50%, -50%);
          background-color: #fff;
          z-index: -1;
        }
      }

      .radio {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 19;
        width: 24px;
        height: 24px;
        border: 1px solid #dcdfe6;
        border-radius: 100%;
        background-color: #fff;
        cursor: pointer;
        box-sizing: border-box;

        &::after {
          width: 4px;
          height: 4px;
          border-radius: 100%;
          background-color: #fff;
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0);
        }

        &.selected {
          border-color: #409eff;
          background: #409eff;
          &::after {
            transform: translate(-50%, -50%) scale(1);
          }
        }
      }
    }
  }

  .footer {
    flex-shrink: 0;
    height: 65px;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0px -1px 4px 0px rgba(0, 21, 41, 0.12);
  }
}
:deep(.ant-timeline-item-tail) {
  height: calc(100% - 10px);
}
:deep(.ant-card-body) {
  box-shadow: 0px 5px 5px #80808026;
}
</style>
