<template>
  <div>
    <!-- 新增/编辑领导风采 -->
    <el-dialog
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      :close-on-click-modal="false"
      width="800px"
      @close="close"
    >
      <div v-loading="dialogLoading">
        <el-form ref="formObj" :model="formObj" :rules="rules" label-width="120px">
          <el-form-item label="领导照片：" prop="leaderImg">
            <el-upload
              style="width: 150px; height: 150px"
              class="uploader-card"
              action="/"
              accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP"
              list-type="picture-card"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :http-request="uploadKingkongImage"
            >
              <el-image
                v-if="formObj.leaderImg"
                style="width: 150px; height: 150px"
                :src="formObj.leaderImg"
                @click.stop="previewImg"
              />
              <i v-if="formObj.leaderImg" class="el-icon-circle-close close-icon" @click.stop="deleteImg" />
              <i v-else class="el-icon-plus" />
            </el-upload>
            <div style="color: #999;">
              建议尺寸：210x210px; 支持jpg、png
            </div>
          </el-form-item>
          <el-form-item label="领导名字：" prop="leaderName">
            <el-input
              v-model.trim="formObj.leaderName"
              style="width: 60%"
              placeholder="请输入领导名字，不超过50个字符"
              maxlength="50"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item label="会内职务：" prop="postName">
            <el-input
              v-model.trim="formObj.postName"
              style="width: 60%"
              placeholder="请输入会内职务，不超过15个字符"
              maxlength="15"
              show-word-limit
              clearable
            />
          </el-form-item>
          <el-form-item label="其他身份：" prop="otherIdentities">
            <el-input
              v-model.trim="formObj.otherIdentities"
              style="width: 60%"
              placeholder="请输入，多个身份请用英文逗号隔开"
              clearable
            />
          </el-form-item>
          <el-form-item label="领导简介：" prop="leaderIntroduce">
            <el-input
              v-model.trim="formObj.leaderIntroduce"
              type="textarea"
              style="width: 90%"
              placeholder="请输入"
              rows="4"
              resize="none"
              clearable
              show-word-limit
              maxlength="2000"
            />
          </el-form-item>
          <el-form-item label="相关报道">
            <!-- <el-select
              v-model="formObj.leaderStyleRelationIdsDTOS"
              style="width: 90%"
              multiple
              collapse-tags
              placeholder="请选择"
            >
              <el-option v-for="item in optionsData" :key="item.id" :label="item.label" :value="item.id" />
            </el-select> -->
            <el-row>
              <span class="text-blue cur" @click="handleSelect">请选择</span>
              <div style="max-height: 100px; overflow: auto;">
                <div v-for="article in articleList" :key="article.id" style="line-height:20px;">
                  <el-tag closable effect="plain" type="info" @close="remove(article.id)">
                    {{ article.id }} {{ article.title }}
                  </el-tag>
                </div>
              </div>
            </el-row>
          </el-form-item>
          <el-form-item label="">
            <div class="mt-20">
              <el-button class="mr-20" @click="close">取消</el-button>
              <el-button v-dbClick type="primary" @click="submit">保存</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-image-viewer
        v-if="showViewer"
        style="z-index: 99999"
        :on-close="closeViewer"
        :url-list="[formObj.leaderImg]"
      />
    </el-dialog>
    <selcet-dialog ref="selectRef" @confirm="handleConfirm" />
  </div>
</template>

<script>
import { uploadFile } from '@/api/content/article'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import SelcetDialog from './SelcetDialog'
import Home from '@/api/home-config/Home'

export default {
  components: { ElImageViewer, SelcetDialog },
  data() {
    return {
      dialogVisible: false,
      dialogLoading: false,
      dialogTitle: '',
      optionsData: [],
      formObj: {
        leaderImg: '', // 领导照片
        leaderName: '', // 领导名字
        postName: '', // 会内职务
        otherIdentities: '', // 其他身份
        leaderIntroduce: '', // 领导简介
      },
      rules: {
        leaderImg: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        leaderName: [
          { min: 1, max: 50, message: '只限50个字以内哦', trigger: 'blur' },
          { required: true, message: '请输入领导名字', trigger: 'blur' }
        ],
        postName: [
          { min: 1, max: 15, message: '只限15个字以内哦', trigger: 'blur' },
          { required: true, message: '请输入会内职务', trigger: 'blur' }
        ]
      },
      showViewer: false,
      articleList: []
    }
  },
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.$on('add', () => {
        this.add()
      })
      this.$on('edit', data => {
        this.edit(data)
      })
    })
  },
  methods: {
    /** 打开新增弹窗 */
    add() {
      this.dialogTitle = '新增领导'
      this.dialogVisible = true
    },

    /** 打开编辑弹窗 */
    edit(data) {
      this.dialogTitle = '编辑领导'
      const { leaderImg, leaderName, postName, otherIdentities, leaderIntroduce, yshLeaderStyleRelationVOList, id } = data
      if (yshLeaderStyleRelationVOList) {
        this.articleList = yshLeaderStyleRelationVOList.map(i => {
          return {
            id: i.businessId,
            title: i.businessName
          }
        })
      }
      this.formObj = {
        leaderImg,
        leaderName,
        postName,
        otherIdentities,
        leaderIntroduce,
        id
      }
      this.dialogVisible = true
    },

    /** 关闭弹窗 */
    close() {
      this.formObj = {
        leaderImg: '', // 领导照片
        leaderName: '', // 领导名字
        postName: '', // 会内职务
        otherIdentities: '', // 其他身份
        leaderIntroduce: '', // 领导简介
      }
      this.articleList = []
      this.$refs['formObj'].clearValidate()
      this.dialogVisible = false
    },

    handleSelect() {
      this.$refs.selectRef.$emit('select')
    },

    handleConfirm(data) {
      if (data) {
        this.articleList = data.map(i => {
          return { id: i.id, title: i.title }
        })
      }
    },

    /** 上传金刚区图片校验 */
    beforeUpload(file) {
      if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/gif' &&
        file.type !== 'image/png'
      ) {
        this.$message.error('上传图片只能是 JPG 或 PNG 或 gif 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('图片大小不能超过 2MB!')
        return false
      }
    },

    /** 上传金刚区图片 */
    uploadKingkongImage(content) {
      const formData = new FormData()
      formData.append('file', content.file)
      uploadFile(formData, 'demand').then(res => {
        this.formObj.leaderImg = res.data
        this.$refs.formObj.validateField('leaderImg')
      })
    },

    previewImg() {
      this.showViewer = true
    },

    deleteImg() {
      this.formObj.leaderImg = ''
    },

    closeViewer() {
      this.showViewer = false
    },

    remove(id) {
      const idx = this.articleList.findIndex(i => i.id === id)
      this.articleList.splice(idx, 1)
    },

    async submit() {
      this.$refs['formObj'].validate(async valid => {
        if (valid) {
          const relationIds = this.articleList.map(i => i.id)
          const res = await Home.saveLeader({
            ...this.formObj,
            leaderStyleRelationIdsDTOS: [{ relationIds, type: 2 }],
            ckey: this.$store.getters.ckey || ''
          })
          if (res.state !== 1) {
            this.$message.error(res.msg)
          } else {
            this.$message.success(res.msg)
            this.close()
            this.$emit('refresh')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
  margin-top: 3vh !important;
  min-height: 60vh !important;
}

/deep/ .el-select__tags .el-tag--info:nth-child(1) {
  width: 80% !important;
}

.uploader-card /deep/.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader-card /deep/.el-upload:hover {
  border-color: #409eff;
}

.close-icon {
  z-index: 100;
  position: absolute;
  top: 0;
  right: 0;
  color: #FFCA00;
}

/deep/ .el-tag--plain.el-tag--info {
  border: 0;
  padding: 0;
  height: 25px;
}
</style>
