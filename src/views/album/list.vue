<template>
  <div class="wrap">
    <el-tabs v-if="!ckey" :value="query.queryType" @tab-click="onQueryChange({queryType:$event.name, albumName: '', pageNum: 1})">
      <el-tab-pane label="云商会" name="0" />
      <el-tab-pane label="商协会" name="1" />
    </el-tabs>
    <div class="flex-x-start-center">
      <el-input :value="query.albumName" class="input-item" placeholder="相册名称、商协会名称" prefix-icon="el-icon-search" @input="onQueryChange({albumName:$event,pageNum:1})" />
      <template v-if="query.queryType === '1'">
        相册状态
        <el-select :value="query.status" class="input-item" @change="onQueryChange({status:$event,pageNum:1})">
          <el-option label="全部" value="" />
          <el-option label="正常" value="1" />
          <el-option label="冻结" value="0" />
        </el-select>
      </template>
    </div>
    <KdTable v-loading="loading" style="margin-top:20px;" :columns="columns" :rows="tableData" />
    <KdPagination :page-size="query.pageSize" :current-page="query.pageNum" :total="total" @change="onQueryChange" />
    <el-dialog :visible.sync="dialog.visible" width="450px" title="修改数据" @close="onDialogClose">
      <el-form ref="dialogForm" style="padding:0 20px;" :model="dialog" :rules="formRules" label-width="80px">
        <el-form-item label="修改类型" prop="updateType">
          <el-select v-model="dialog.updateType" :disabled="dialog.typeDisabled">
            <el-option
              v-for="v of updateTypeOptions"
              :key="v.value"
              :label="v.label"
              :value="v.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="原数值">
          <el-button type="text" disabled>{{ dialog.sourceData[dialog.updateKeys[dialog.updateType]] }}</el-button>
        </el-form-item>
        <el-form-item label="修改数值" prop="num">
          <el-input v-model="dialog.num" placeholder="请输入" />
        </el-form-item>
        <el-form-item style="text-align:right;">
          <el-button @click="dialog.visible=false">返回</el-button>
          <el-button type="primary" @click="onModifyData">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAlbumList, modifyAlbumData, changeAlbumFreezeStatus } from '@/api/album'

const updateKeys = ['browseNum', 'visitorsNum', 'downloadNum', 'shareNum']

const generateDialog = () => ({
  visible: false,
  updateType: '', // 0-浏览数 1-浏览人数 2-下载数 3-分享数
  num: '', // 要修改的数据
  sourceData: {}, // 源数据
  typeDisabled: false,
  updateKeys
})

const updateTypeOptions = [
  { value: '0', label: '浏览量' },
  { value: '1', label: '浏览人数' },
  { value: '2', label: '下载数' },
  { value: '3', label: '分享数' },
]

export default {
  components: {
    KdTable: () => import('@/components/common/KdTable'),
    KdPagination: () => import('@/components/common/KdPagination')
  },
  props: {},
  data() {
    return {
      query: {
        queryType: '0', // 0-云商会  1-商协会
        pageNum: 1,
        pageSize: 10,
        albumName: '',
        status: ''
      },
      total: 0,
      tableData: [],
      loading: false,
      dialog: generateDialog(),
      formRules: {
        updateType: [{ required: true, message: '修改类型不能为空', trigger: 'blur' }],
        num: [
          { required: true, message: '修改数值不能为空', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              const { sourceData, updateType, updateKeys } = this.dialog
              const sourceValue = sourceData[updateKeys[updateType]]
              if (sourceValue && value < sourceValue) return callback(new Error('修改数值不能小于原数值'))
              callback()
            },
            trigger: 'change'
          },
        ],
      },
      updateTypeOptions
    }
  },

  computed: {
    ckey() {
      return this.$store.getters.ckey
    },
    columns() {
      const { ckey, query } = this
      const isPlatform = query.queryType === '0' // 云商会平台
      return [
        {
          label: '相册信息',
          render: ({ row }) => <div>{row.id}<br/>{row.albumName}</div>
        },
        {
          label: '关联业务',
          render: ({ row }) => row.type === 2 ? <div>活动<br/>{row.businessId}<br/>{row.businessName}</div> : '-'
        },
        { label: '商协会', hidden: isPlatform },
        { label: '图片数', prop: 'imgNum' },
        { label: '浏览量', render: e => this.generateModifiedData(e, 'browseNum') },
        { label: '浏览人数', render: e => this.generateModifiedData(e, 'visitorsNum') },
        { label: '点赞数', prop: 'likeNum' },
        { label: '下载数', render: e => this.generateModifiedData(e, 'downloadNum') },
        { label: '分享数', render: e => this.generateModifiedData(e, 'shareNum') },
        { label: '相册状态', hidden: isPlatform },
        {
          label: '操作',
          fixed: 'right',
          render: ({ row }) => <div>
            {
              isPlatform || ckey ? <div>
                <el-button type='text' onClick={() => this.goPage({ path: '/album/edit', query: { id: row.id }})}>编辑</el-button>
                <el-button type='text' onClick={() => this.goPage({ path: '/album/detail', query: { id: row.id }})}>进入相册</el-button>
              </div> : <el-button type='text' onClick={() => this.toggleFreeze(row)}>{+row.status === 1 ? '冻结' : '解冻'}</el-button>
            }
            {!ckey ? <el-button type='text' onClick={() => this.changeDialog({ visible: true, sourceData: row })}>修改数据</el-button> : ''}
          </div>
        },
      ]
    }
  },
  created() {
    this.onQueryChange({ queryType: this.ckey ? '1' : '0' })
  },
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  methods: {
    onQueryChange(e) {
      Object.assign(this.query, e)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => this.queryTableData(), 300)
    },
    async queryTableData() {
      this.loading = true
      try {
        const { data: { list, totalRows }} = await getAlbumList({
          ...this.query,
          ckey: this.ckey,
          total: true
        })
        this.tableData = list
        this.total = totalRows
      } catch { }
      this.loading = false
    },
    generateModifiedData({ row, column }, key) {
      const realKey = `real${key.replace(/[a-z]/, _ => _.toUpperCase())}`
      if (row[realKey] >= row[key] || this.ckey) return row[key]
      return <div>
        <el-button
          type='text'
          style='color:red;margin-right:8px;'
          onClick={() => this.changeDialog({
            visible: true,
            typeDisabled: true,
            sourceData: row,
            updateType: `${updateKeys.indexOf(key)}`
          })}
        > 改 </el-button>
        {row[key]}
      </div>
    },
    goPage(params) {
      this.$router.push(params)
    },
    changeDialog(obj) {
      Object.assign(this.dialog, obj)
    },
    onDialogClose() {
      this.changeDialog(generateDialog())
      this.$refs.dialogForm.clearValidate()
    },
    // 修改数据
    async onModifyData() {
      await this.$refs.dialogForm.validate()
      const { updateType, num, sourceData } = this.dialog
      const { state } = await modifyAlbumData({ updateType, num, albumCkey: sourceData.albumCkey })
      if (state === 1) {
        this.changeDialog({ visible: false })
        this.$set(sourceData, updateKeys[updateType], num)
      }
    },
    // 切换冻结状态
    async toggleFreeze(row) {
      const { status, id } = row
      const { state } = await changeAlbumFreezeStatus({ id, status: +!status })
      if (state === 1) {
        this.$set(row, 'status', +!status)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 20px;

  .input-item {
    width: 300px;
    margin: 0 20px;

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
