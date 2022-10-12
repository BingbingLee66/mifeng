<template>
  <el-dialog
    title="选择活动类型"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <div class="tag-group-list">
      <div v-for="tagGroup in tagGroupList" :key="tagGroup.id" class="tag-group-item">
        <div class="tag-group-name" style="margin: 10px 0; font-weight: bold">{{ tagGroup.name }}</div>

        <el-checkbox-group v-model="checkList">
          <el-checkbox-button
            v-for="tag in tagGroup.memberLabelVOList"
            :key="tag.id"
            :label="tag.id + ':' + tag.name"
            class="checkbox-item"
          >
            {{ tag.name }}
          </el-checkbox-button>
        </el-checkbox-group>
      </div>

      <el-pagination
        :page-sizes="[5, 10, 50, 100, 500]"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pageSize"
        :total="total"
        class="mt-20"
        @current-change="onNext"
      />
    </div>

    <template slot="footer" class="dialog-footer">
      <el-button @click="onClose">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import Labels from '@/api/labels/labels'

export default {
  name: 'ActiveTypeDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activeType: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checkList: [],
      tagGroupList: [],

      pageNum: 1,
      pageSize: 5,
      total: 0,
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.fetchData()
        this.checkList = this.activeType.map(v => `${v.labelId}:${v.label}`)
      }
    },
    checkList(val) {
      if (val.length > 5) {
        this.$message.error('最多只可选择5个')
        this.checkList = val.splice(0, 5)
      }
    },
  },
  methods: {
    async fetchData() {
      const { data } = await Labels.getLabelGroupLst({
        freeze: 0,
        dataSource: 0,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        total: true
      })

      if (!data.totalRows) return

      this.tagGroupList = data.list
      this.total = data.totalRows
    },

    onNext(num) {
      this.pageNum = num
      this.fetchData()
    },

    onClose() {
      this.$emit('update:visible', false)
    },

    onConfirm() {
      this.$emit('confirm', this.checkList.map(v => {
        const itemArr = v.split(':')

        return {
          label: itemArr[1],
          labelId: itemArr[0],
        }
      }))
      this.onClose()
    }
  }
}
</script>

<style scoped lang="scss">
.checkbox-item {
  margin: 0 10px 10px 0;

  & >>> .el-checkbox-button__inner {
    border: 1px solid #DCDFE6;
    border-radius: 0;
  }

  &.is-checked >>> .el-checkbox-button__inner {
    border-color: transparent;
  }
}
</style>
