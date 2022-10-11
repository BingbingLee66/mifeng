<template>
  <div class="wrap">

    <div class="container" @scroll="onScroll">
      <h2>{{ albumDetail.albumName }}</h2>
      <div class="flex-x-between-center">
        <div class="flex-x-start-center">
          <el-input :value="query.fileName" class="input-item" placeholder="图片名称" prefix-icon="el-icon-search" @input="onQueryChange({fileName:$event,imgId:'',isFinished:false})" />
          展示状态
          <el-select v-model="queryStatus" class="input-item" @change="onQueryChange({auditStatus:$event,imgId:'',isFinished:false})">
            <el-option value="" label="全部" />
            <el-option value="1" label="公开" />
            <el-option value="0" label="隐藏" />
            <el-option value="3" label="已冻结" />
          </el-select>
        </div>
        <el-upload
          v-if="isFirstPerson"
          action="#"
          accept="image/jpg,image/png,image/jpeg,image/bmp"
          multiple
          :show-file-list="false"
          :limit="Math.max(albumDetail.maxImgCount - albumDetail.imgCount, 0.1)"
          :file-list="uploadingList"
          :before-upload="beforeUpload"
          :http-request="onUpload"
          :on-exceed="onExceed"
        >
          <el-button type="primary">上传图片</el-button>
        </el-upload>

      </div>

      <div class="content">

        <div v-loading="loading" class="img-falls">
          <el-timeline>
            <el-timeline-item v-if="albumDetail.img" type="success" timestamp="相册封面" placement="top">
              <BaseImg :img="albumDetail.img" :tag="generateTag({useType:1})" />
            </el-timeline-item>
            <el-timeline-item v-for="date of imgFalls" :key="date.name" type="primary" size="large" :timestamp="date.name" placement="top">
              <el-card class="img-fall-item">
                <div class="imgs">

                  <template v-for="img of date.children">
                    <UploadingImg
                      v-if="img.file"
                      :key="img.id"
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
                      :key="img.id"
                      :img="img"
                      class="img-item"
                      :operations="!img.auditStatus||isCover(img)?['preview']:['preview', 'cover']"
                      :tag="generateTag(img)"
                      :edit-auth="isFirstPerson || hasEditAuth"
                      @click="toggleSelect(img)"
                      @coverChange="onCoverChange(img)"
                    >
                      <template v-if="hasEditAuth">
                        <div v-show="!isCover(img) && selectedImgIds.includes(img.id)" class="img-overlay" />
                        <i v-if="!isCover(img)" class="close-icon el-icon-error" @click.stop="onDelImgs([img.id])" />
                        <i v-if="!isCover(img)" class="radio" :class="{selected:selectedImgIds.includes(img.id)}" />
                      </template>
                    </BaseImg>
                  </template>

                </div>
              </el-card>
            </el-timeline-item>
            <el-timeline-item v-if="!imgFalls.length" type="wraning" timestamp="暂无图片" placement="top">
              <BaseImg :img="{img:'https://ysh-cdn.kaidicloud.com/test/common/img_list_empty.png'}" />
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

    </div>
    <div class="footer flex-x-end-center">
      <template v-if="hasEditAuth">
        <template v-if="isFirstPerson">
          <el-button :disabled="handleDisabled" :class="{red:!handleDisabled}" @click="onDelImgs(selectedImgIds)">删除</el-button>
          <el-button :disabled="handleDisabled" @click="toggleImgStatus(selectedImgIds, 0)">隐藏</el-button>
          <el-button :disabled="handleDisabled" @click="toggleImgStatus(selectedImgIds, 1)">公开</el-button>
        </template>
        <template v-else>
          <el-button @click="toggleAlbumStatus">{{ albumDetail.status === 1 ? '冻结相册' : '解冻相册' }}</el-button>
          <el-button :disabled="handleFreezeDisabled" @click="toggleImgFrozeeStatus(selectedImgIds, 3)">冻结照片</el-button>
          <el-button :disabled="handleOverFreezeDisabled" @click="toggleImgFrozeeStatus(selectedImgIds, 1)">解冻照片</el-button>
        </template>
        <el-button @click="downloadImgs">下载</el-button>
      </template>
      <template v-else>
        <el-button @click="toggleRelevance">取消关联</el-button>
      </template>
    </div>

  </div>
</template>

<script>
import { formatDateTime } from '@/utils/date'
import {
  getAlbumImgList,
  delAlbumImgs,
  changeAlbumImgStatus,
  getAlbumDetail,
  cancelReleAlbum,
  changeBatchAlbumFreezeStatus,
  changeAlbumFreezeStatus
} from '@/api/album'
import { downloadFile } from '@/utils'

export default {
  components: {
    BaseImg: () => import('./components/BaseImg'),
    UploadingImg: () => import('./components/UploadingImg')
  },
  props: {},
  data() {
    return {
      albumDetail: {
        imgCount: 0
      },
      queryStatus: '',
      query: {
        pageSize: 20,
        fileName: '',
        imgId: '',
        isFinished: false
      },
      loading: false,
      uploadingList: [],
      imgList: [],
      selectedImgs: [],
    }
  },
  computed: {
    // 时间轴瀑布 主轴按日期划分 每个日期再划分24个时段
    // eq [{name: '2022-08-30 10:00 ~ 11:00',children:[{name:'图片名称'}]}]
    imgFalls() {
      return this.arrToTree([...this.uploadingList, ...this.imgList], '$date')
    },
    selectedImgIds() {
      return this.selectedImgs.map(v => v.id)
    },
    handleDisabled() {
      const { selectedImgs, isCover } = this
      return !selectedImgs.length || selectedImgs.some(isCover)
    },
    handleFreezeDisabled() {
      const { selectedImgs } = this
      return !selectedImgs.length || selectedImgs.some(v => v.status === 3) || !selectedImgs.some(v => v.status === 1)
    },
    handleOverFreezeDisabled() {
      const { selectedImgs } = this
      return !selectedImgs.length || selectedImgs.some(v => v.status === 1) || !selectedImgs.some(v => v.status === 3)
    },
    hasEditAuth() {
      const { editAuth } = this.$route.query

      if (typeof editAuth === 'number') return !!editAuth
      if (typeof editAuth === 'string') return !!Number(editAuth)

      return true
    },
    queryType() {
      return this.$route.query.type
    },
    isFirstPerson() {
      return +this.queryType === 0
    },
    albumCkey() {
      return this.$route.query.albumCkey || ''
    }
  },
  created() {
    this.queryAlbumDetail()
    this.fetchData()
  },
  beforeDestroy() {
    clearTimeout(this.timer)
    clearTimeout(this.scrollTimer)
  },
  methods: {
    async queryAlbumDetail() {
      const { data } = await getAlbumDetail(this.$route.query)
      this.albumDetail = data
    },
    onQueryChange(e) {
      Object.assign(this.query, e)
      if (e.auditStatus === '3') {
        delete this.query.auditStatus
        this.query.status = 3
      } else {
        delete this.query.status
        this.query.auditStatus = e.auditStatus
      }

      if (!e.imgId && this.selectedImgs.length) this.selectedImgs = []
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.fetchData(), 300)
    },
    formatImgData(img) {
      if (img.$date) return
      const [dateStr, timeStr] = formatDateTime(new Date(+img.createdTs), 'yyyy-MM-dd@hh').split('@')
      return Object.assign(img, { $date: `${dateStr} ${timeStr}:00 ~ ${+timeStr + 1}:00` })
    },
    async fetchData() {
      const { query, loading, $route: { query: { id } } } = this
      if (query.isFinished || loading) return
      this.loading = true
      try {
        const { data: { list } } = await getAlbumImgList({
          ...query,
          albumId: id
        })
        list.forEach(this.formatImgData)
        query.isFinished = list.length < query.pageSize
        if (!query.imgId) { // 初次查询
          this.imgList = list
        } else { // 翻页查询
          this.imgList.push(...list)
        }
        const lastImg = list[list.length - 1]
        query.imgId = lastImg && lastImg.id // 最后一张照片id
      } finally {
        this.loading = false
      }
    },
    onScroll(e) {
      if (this.scrollTimer) return
      this.scrollTimer = setTimeout(() => {
        this.scrollTimer = null
        const { scrollTop, clientHeight, scrollHeight } = e.target
        if (scrollHeight - clientHeight - scrollTop < 50) {
          this.fetchData()
        }
      }, 200)
    },
    arrToTree(arr, key, ...restKeys) {
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
      res.forEach(v => (v.children = this.arrToTree(v.children, ...restKeys)))
      return res
    },
    toggleSelect(img) {
      if (this.isCover(img)) return

      const { selectedImgs } = this
      const index = selectedImgs.findIndex(v => v.id === img.id)
      if (index > -1) { // 删除
        selectedImgs.splice(index, 1)
      } else { // 添加
        selectedImgs.push(img)
      }
    },
    async onDelImgs(imgIds) {
      try {
        await this.$confirm('删除后无法恢复', '是否继续删除？', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消'
        })
        const { state } = await delAlbumImgs({ imgIds })
        if (state === 1) {
          this.imgList = this.imgList.filter(v => !imgIds.includes(v.id))
          this.selectedImgs = []
          this.albumDetail.imgCount = this.albumDetail.imgCount - imgIds.length
        }
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    // 切换相册冻结状态
    async toggleAlbumStatus() {
      const freezeParams = {
        0: {
          title: '是否解冻相册？',
          content: '',
          status: 1,
        },
        1: {
          title: '冻结相册',
          content: '冻结相册后前台无法显示该相册内容，是否冻结？',
          status: 0,
        }
      }[this.albumDetail.status]

      try {
        await this.$confirm(freezeParams.content, freezeParams.title)

        const { state, msg } = await changeAlbumFreezeStatus({ id: this.$route.query.id, status: freezeParams.status })
        if (state) {
          this.$message.success('操作成功')
          this.queryAlbumDetail()
        } else {
          this.$message.error(msg)
        }
      } catch (err) {
        let msg = null
        if (this.albumDetail.status === 0) {
          msg = '已取消解冻'
        } else {
          msg = '已取消冻结'
        }
        this.$message({
          type: 'info',
          message: msg
        })
      }
    },
    // 切换图片状态
    async toggleImgStatus(imgIds, type) { // 0-隐藏 1-公开
      const { state } = await changeAlbumImgStatus({ imgIds: imgIds.join(','), type })
      if (state === 1) {
        this.imgList.forEach(v => {
          if (imgIds.includes(v.id)) {
            this.$set(v, 'auditStatus', type)
          }
        })
        this.selectedImgs = []
      }
    },
    // 切换冻结图片状态
    async toggleImgFrozeeStatus(imgIds, type) {
      const freezeParams = {
        1: {
          title: '是否解冻图片？',
          content: '',
        },
        3: {
          title: '冻结图片',
          content: '冻结图片后前台无法显示该图片内容，是否冻结？',
        }
      }[type]
      try {
        await this.$confirm(freezeParams.content, freezeParams.title)
        const { state } = await changeBatchAlbumFreezeStatus({ imgIds: imgIds.join(','), status: type })
        if (state === 1) {
          this.$message.success('操作成功')
          this.imgList.forEach(v => {
            if (imgIds.includes(v.id)) {
              this.$set(v, 'status', type)
            }
          })
          this.selectedImgs = []
        }
      } catch (err) {
        let msg = null
        if (type === 1) {
          msg = '已取消解冻'
        } else {
          msg = '已取消冻结'
        }
        this.$message({
          type: 'info',
          message: msg
        })
      }
    },
    async toggleRelevance() {
      await this.$confirm('', '确定取消关联？')

      const { state, msg } = await cancelReleAlbum({
        albumCkey: this.albumCkey,
      })

      if (state) {
        this.$message.success('操作成功')
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      } else {
        this.$message.error(msg)
      }
    },
    // 生成标签
    generateTag(img) {
      if (this.isCover(img)) return { name: '封面', type: 'success' }

      if (+img.status === 3) {
        return { name: '已冻结', type: 'danger' }
      } else if (+img.auditStatus === 0) {
        return { name: '隐藏', type: 'info' }
      } else {
        return { name: '公开' }
      }
    },
    // 是否为封面
    isCover(img) {
      return +img.useType === 1
    },
    // 上传前校验
    beforeUpload(file) {
      if (
        !['image/jpeg', 'image/jpg', 'image/png', 'image/bmp'].includes(file.type) ||
        !/(jpeg)|(jpg)|(png)|(bmp)$/i.test(file.name)
      ) {
        this.$message.error('上传图片只能是 JPG 或 PNG 或 BMP 格式!')
        return false
      }

      if (file.size > 1024 * 1024 * 10) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
    },
    // 超出1000张
    onExceed() {
      this.$message.error(`图片数量超过${this.albumDetail.maxImgCount}张`)
    },
    onUpload({ file }) {
      this.albumDetail.imgCount++
      this.uploadingList.unshift(this.formatImgData({ file, createdTs: Date.now(), id: `uid_${file.uid}` }))
    },
    onDelUploadingImg(img, isDelete) {
      if (isDelete) this.albumDetail.imgCount--
      const index = this.uploadingList.findIndex(v => v.id === img.id)
      this.uploadingList.splice(index, 1)
    },
    onUploadFail(img) {
      this.onDelUploadingImg(img)
      this.uploadingList.push(img)
      this.albumDetail.imgCount--
    },
    onUploadSuccess(img, { value }) {
      this.onDelUploadingImg(img) // 删除正在上传
      this.imgList.unshift(this.formatImgData(value)) // 添加已上传
    },
    // 封面切换
    onCoverChange(img) {
      this.imgList.forEach(v => {
        v.useType = 0
      })
      img.useType = 1
      this.$set(this.albumDetail, 'img', img)
    },
    downloadImgs() {
      if (!this.selectedImgIds.length) return this.$message({ message: '请选择下载图片', type: 'warning' })
      this.handleDownload(this.selectedImgIds)
      this.selectedImgIds = []
    },
    handleDownload(imgIds = []) {
      if (!this.downloadQueue) {
        this.downloadQueue = []
        this.downloadingQueue = []
      }
      if (imgIds.length) this.downloadQueue.push(...imgIds)
      const downloadingCount = this.downloadingQueue.length
      if (!this.downloadQueue.length || downloadingCount >= 5) return // 维持5个并发
      const preDownloadingQueue = this.downloadQueue.splice(0, 5 - downloadingCount)
      this.imgList.forEach(async v => {
        if (preDownloadingQueue.includes(v.id)) {
          try {
            await downloadFile({ url: v.img, title: v.fileName }) // 下载
          } finally {
            this.handleDownload() // 递归
          }
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.wrap {
  height: calc(100vh - 84px);
  padding: 20px;
  background-color: #eff2f6;
  display: flex;
  flex-direction: column;
  .red {
    color: red;
  }
  .container {
    flex: 1;
    background-color: #fff;
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
        background-color: rgba(0,0,0,.4);
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
          transform: translate(-50%,-50%);
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
        border: 1px solid #DCDFE6;
        border-radius: 100%;
        background-color: #FFF;
        cursor: pointer;
        box-sizing: border-box;

        &::after {
          width: 4px;
          height: 4px;
          border-radius: 100%;
          background-color: #FFF;
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%,-50%) scale(0);
        }

        &.selected{
          border-color: #409EFF;
          background: #409EFF;
          &::after {
            transform: translate(-50%,-50%) scale(1);
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

  /deep/ .el-timeline-item__timestamp {
    font-size: 16px;
    font-weight: 700;
    color: #333;
  }

}
</style>
