<template>
  <el-dialog
    :visible="visible"
    title="打标签"
    width="50%"
    @close="close"
  >
    <el-form
      :inline="true"
      :model="query"
      label-width="80px;"
      label-position="left"
      size="small"
    >
      <el-form-item label="标签组">
        <el-input v-model.trim="query.tagGroup" clearable maxlength="16" placeholder="关键词" />
      </el-form-item>

      <el-form-item label="标签">
        <el-input v-model.trim="query.tag" clearable maxlength="16" placeholder="关键词" />
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="$emit('add')">新增</el-button>
        <el-button type="primary" size="small" @click.native="fetchData(true)">搜索</el-button>
      </el-form-item>

      <div class="tag-group-list">
        <div v-for="tagGroup in tagGroupList" :key="tagGroup.id" class="tag-group-item">
          <div class="tag-group-name" style="margin: 10px 0; font-weight: bold;">{{ tagGroup.name }}</div>
          <el-checkbox-group v-model="checkTagList" size="mini">
            <el-checkbox-button v-for="tag in tagGroup.tagList" :key="tag" :label="tag" style="margin-right: 10px;" />
          </el-checkbox-group>
        </div>
      </div>
    </el-form>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <div class="btn-group" style="text-align: center; margin-top: 20px;">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TableMixins from '@/mixins/table'

export default {
  name: 'MakeTagDialog',
  mixins: [TableMixins],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    customGroup: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      query: {
        tagGroup: '',
        tag: '',
      },
      tagGroupList: [
        { id: '1', name: '赞助商', tagList: ['不是赞助商', '是赞助商'] },
        { id: '2', name: '活跃度', tagList: ['高活跃', '中活跃', '低活跃'] },
        { id: '3', name: '活动意向', tagList: ['有意向', '无意向'] },
        { id: '4', name: '活动意向', tagList: ['有意向', '无意向1'] },
        { id: '5', name: '活动意向', tagList: ['有意向', '无意向'] },
        { id: '6', name: '活动意向', tagList: ['有意向', '无意向'] },
        { id: '7', name: '活动意向', tagList: ['有意向', '无意向'] },
        { id: '8', name: '活动意向', tagList: ['有意向', '无意向'] },
        { id: '9', name: '活动意向', tagList: ['有意向', '无意向'] },
        { id: '10', name: '活动意向', tagList: ['有意向', '无意向'] },
      ],
      checkTagList: []
    }
  },
  watch: {
    customGroup(n) {
      if (JSON.stringify(n) === '{}') return
      this.tagGroupList.unshift({
        id: `custom-${n.tagGroup}`,
        name: n.tagGroup,
        tagList: n.tagList,
      })
    }
  },
  methods: {
    fetchData(reset) {
      if (reset) this.currentPage = 1
      // TODO 待完善
    },

    confirm() {
      this.$emit('confirm', this.checkTagList)
      this.close()
    },

    close() {
      this.$emit('update:visible', false)
      this.query = {
        tagGroup: '',
        tag: '',
      }
    }
  }
}
</script>

<style scoped lang="scss">
.el-checkbox-button /deep/ .el-checkbox-button__inner {
  border: 1px solid #DCDFE6;
  box-shadow: none;
}
.tag-group-list {
  overflow: scroll;
  max-height: 400px;
  margin-bottom: 20px;
}
</style>
