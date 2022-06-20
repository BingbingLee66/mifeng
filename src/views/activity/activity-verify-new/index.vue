<template>
  <div class="page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">广西商会会员大会</div>
              <div class="board-item mt20">报名时间 2022-06-01 14:31 ～ 2022-06-15 14:31</div>
              <div class="board-item">活动时间 2022-06-16 14:31 ～ 2022-06-30 14:31</div>
              <div class="board-item">举办地点 广东省广州市海珠区广报中心北塔8楼</div>
              <div class="board-item">参加限制 800/1000</div>
            </div>
            <div class="board-right flex-y-center-center">
              <img class="qr-code" src="@/assets/img/avatar.gif" @click="activityQrCodeShow=true">
              <div> 活动二维码 <el-button type="text">下载</el-button> </div>
              <el-dialog :visible.sync="activityQrCodeShow" width="40%">
                活动二维码
              </el-dialog>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">签到/签退码</div>
              <div class="flex-x-between-center">
                <div class="qr-code-wrap flex-y-center-center">
                  <img class="qr-code" src="@/assets/img/avatar.gif" @click="onRecordQrCodePreview({value:'@/assets/img/avatar.gif',title:'签到码'})">
                  <el-button type="text">下载签到码</el-button>
                </div>
                <div class="qr-code-wrap flex-y-center-center">
                  <img class="qr-code" src="@/assets/img/avatar.gif" @click="onRecordQrCodePreview({value:'@/assets/img/avatar.gif',title:'临时报名签到码'})">
                  <el-button type="text">临时报名签到码</el-button>
                </div>
                <div class="qr-code-wrap flex-y-center-center">
                  <img class="qr-code" src="@/assets/img/avatar.gif" @click="onRecordQrCodePreview({value:'@/assets/img/avatar.gif',title:'签退码'})">
                  <el-button type="text">下载签退码</el-button>
                </div>
              </div>
              <el-dialog :visible.sync="recordQrCodeDialog.show" width="40%">
                {{ recordQrCodeDialog.title }}
              </el-dialog>
            </div>
            <div class="board-right flex-y-center-center">
              <div class="desc">
                <div class="desc-title">使用说明</div>
                <div class="desc-item">保存图片打印在活动海报、易拉宝等场合 </div>
                <div class="desc-item">用户使用微信扫码即签到成功，并显示会场座位号。</div>
                <div class="desc-item">临时报名签到码用于临时到场会员，未报名无法签到情况，扫码后自动通过并签到。</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="5">
        <el-card shadow="never">
          <div class="board flex-x-between-center">
            <div class="board-left">
              <div class="board-title">座位表</div>
              <el-upload
                action="#"
                class="image-upload"
                list-type="picture-card"
                :http-request="upload"
                :show-file-list="false"
                :before-upload="beforeUpload"
              >
                <div
                  v-if="seatImg"
                  class="image-item"
                  :style="{backgroundImage: `url(${seatImg})`}"
                  @click.stop
                >
                  <i class="el-icon-circle-close" @click.stop="seatImg=''" />
                  <div class="image-preview" @click.stop="previewSeatDialogShow=true">预览</div>
                </div>
                <div v-else v-loading="imgLoading" class="upload-description">
                  <i class="el-icon-plus" />
                  <span>上传座位表</span>
                  <span>（0 / 1）</span>
                </div>
              </el-upload>
              <div class="mt5">会员可在小程序看到座位排序情况</div>
              <el-dialog :visible.sync="previewSeatDialogShow" width="40%">
                <img :src="seatImg" style="width:100%">
              </el-dialog>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="never">
      <el-tabs v-model="activeName">
        <el-tab-pane label="待审核（2）" name="ApprovePerson" />
        <el-tab-pane label="参与人员（300）" name="JoinPerson" />
        <el-tab-pane label="已驳回（1）" name="RejectPerson" />
      </el-tabs>
      <el-form inline>
        <el-form-item>
          <el-input v-model="query.name" placeholder="用户名、手机号" clearable />
        </el-form-item>
        <el-form-item label="签到状态">
          <el-select placeholder="请选择">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="空置座位">
          <el-select placeholder="请选择">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="flex-x-between-center">
        <el-button type="text">导入</el-button>
        <el-button type="primary">导表</el-button>
      </div>
      <KdTable class="mt5" :list="tableList" :data="tableData" @selection-change="onSelectionChange" />
      <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
    </el-card>
  </div>
</template>

<script>
import { checkFile, uploadFile, } from '@/api/content/article'

export default {
  components: {
    KdTable: () => import('@/components/KdTable/index'),
    KdPagination: () => import('@/components/common/KdPagination'),
  },
  props: {},
  data() {
    return {
      activityQrCodeShow: false,
      recordQrCodeDialog: {
        show: false,
        title: '',
        value: ''
      },
      seatImg: '', // 座位表
      previewSeatDialogShow: false,
      imgLoading: false,
      activeName: 'ApprovePerson',
      tableData: [
        {}
      ],
      // 查询参数
      query: {
        pageSize: 10,
        pageNum: 1,
        name: ''
      },
      total: 0
    }
  },
  computed: {
    tableList() {
      const commonList = [
        { type: 'selection', width: 55 },
        {
          label: '用户信息',
          minWidth: 180,
          render: () => (<div>
            <img
              style='width:50px;height:50px'
              src='https://ysh-cdn.kaidicloud.com/ysh-test/license/5e9826c210b04a368c11be6ef98d39ca.png'
            />
            <div>李天明</div>
            <div>13554533811</div>
          </div>)
        },
        {
          label: '所属商会',
          minWidth: 180,
          render: () => (<div>
            <div>山大附啦-会长</div>
            <div>山大附啦1-会长</div>
          </div>)
        },
      ]
      try {
        return this[`get${this.activeName}TableList`](commonList) || commonList
      } catch (error) {
        return commonList
      }
    }
  },
  methods: {
    // 上传前校验
    beforeUpload(file, index) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        return false
      }
      if (file.size > 1024 * 1024 * 2) {
        this.$message.error('上传图片大小不能超过 2MB!')
        return false
      }
    },
    // 上传逻辑
    async upload(content) {
      this.imgLoading = true

      let formData = new FormData()
      formData.append('file', content.file)

      try {
        const { state, msg } = await checkFile(formData)
        if (state !== 1) {
          this.$message.error(msg)
          this.imgLoading = false
          return
        }
        const { data } = await uploadFile(formData, 'demand')
        this.seatImg = data
      } catch (error) { /*  */ }
      this.imgLoading = false
    },
    onRecordQrCodePreview({ title, value }) {
      this.recordQrCodeDialog = { show: true, title, value }
    },
    onQueryChange(e) {
      this.query = { ...this.query, ...e }
      this.getSupplyDemandStatsList()
    },
    onSelectionChange(e) {
      this.selectionDatas = e.map(v => ({

      }))
    },

    // 待审核
    getApprovePersonTableList(list = []) {
      return [
        ...list,
        {
          label: '报名时间',
          render: () => '2020-06-12 14:22'
        },
        {
          label: '报名信息',
          minWidth: 200,
          render: () => (<div>
            <div>会员名称：李天明</div>
            <div>联系方式：13554533811</div>
            <div>到场方式：直升机</div>
            <div>是否绿码：是</div>
          </div>)
        },
        {
          label: '操作',
          fixed: 'right',
          minWidth: 80,
          render: () => (<div>
            <el-button type='text'>通过</el-button>
            <br />
            <el-button type='text'><div style='color:red;'>驳回</div></el-button>
          </div>)
        }
      ]
    },
    // 参与人员
    getJoinPersonTableList(list = []) {
      return [
        ...list,
        {
          label: '报名信息',
          minWidth: 200,
          render: () => (<div>
            <div>会员名称：李天明</div>
            <div>联系方式：13554533811</div>
            <div>到场方式：直升机</div>
            <div>是否绿码：是</div>
          </div>)
        },
        {
          label: '替补',
          minWidth: 120,
          render: () => (<div>
            <el-button type='text'>设置替补人员</el-button>
          </div>)
        },
        {
          label: '到场人数',
          minWidth: 120,
          render: () => (<div>
            <div>预计到场：3</div>
            <div>到场人数：1</div>
          </div>)
        },
        {
          label: '座位号',
          minWidth: 120,
          render: () => (<div>
            <div>01桌12</div>
            <div>01桌12</div>
            <div>01桌12</div>
          </div>)
        },
        {
          label: '签到',
          render: () => '是'
        },
        {
          label: '签退',
          render: () => '是'
        },
        {
          label: '报名时间',
          minWidth: 150,
          render: () => '2020-06-12 14:22'
        },
        {
          label: '报名时间',
          render: () => '导入'
        },
        {
          label: '备注',
          render: () => (<div>
            <el-button type='text'>备注</el-button>
          </div>)
        },
        {
          label: '操作',
          fixed: 'right',
          minWidth: 100,
          render: () => (<div>
            <div><el-button type='text'>设置座位号</el-button></div>
            <div><el-button type='text'>签到</el-button></div>
            <div><el-button type='text'>签退</el-button></div>
            <div><el-button type='text'><div style='color:red;'>移除</div></el-button></div>
          </div>)
        },
      ]
    },
    // 已驳回
    getRejectPersonTableList(list = []) {
      return [
        ...list,
        {
          label: '报名时间',
          minWidth: 150,
          render: () => '2020-06-12 14:22'
        },
        {
          label: '驳回时间',
          minWidth: 150,
          render: () => '2020-06-12 14:22'
        },
        {
          label: '驳回理由',
          render: () => '哈哈哈'
        },
        {
          label: '报名信息',
          minWidth: 200,
          render: () => (<div>
            <div>会员名称：李天明</div>
            <div>联系方式：13554533811</div>
            <div>到场方式：直升机</div>
            <div>是否绿码：是</div>
          </div>)
        },
        {
          label: '操作',
          fixed: 'right',
          minWidth: 130,
          render: () => <el-button type='text'>重新审核并通过</el-button>
        }
      ]
    },
  },
}
</script>

<style lang="scss" scoped>
.page {
  padding: 20px;
}
.mt20 {
  margin-top: 20px;
}
.mt5 {
  margin-top: 5px;
}
.board {
  font-size: 14px;

  .board-title {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .board-item {
    margin-bottom: 4px;
  }

  .qr-code {
    width: 75px;
    height: 75px;
  }

  .qr-code-wrap {
    margin-right: 15px;
  }

  /deep/ .el-button {
    padding-top: 5px;
    padding-bottom: 0;
  }

  .desc-title {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  .desc-item {
    position: relative;
    padding-left: 15px;
    &::before{
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      display: block;
      width: 4px;
      height: 4px;
      background-color: #000;
      border-radius: 50%;
    }
  }

}

.upload-description {
  line-height: 16px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

  .image-item {
    width: 100%;
    height: 100%;
    position: relative;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 220px;
    cursor: pointer;

    .el-icon-circle-close {
      display: none;
      position: absolute;
      right: 5px;
      top: 5px;
      font-size: 20px;
      color: #fd5d5d;
      z-index: 10;
    }

    .image-preview {
      display: none;
      position: absolute;
      height: 30px;
      line-height: 30px;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      background-color: rgba($color: #000000, $alpha: 0.5);
      color: #fff;
      z-index: 10;
    }

    &:hover {
      .el-icon-circle-close,.image-preview {
        display: block;
      }
    }
  }
</style>
