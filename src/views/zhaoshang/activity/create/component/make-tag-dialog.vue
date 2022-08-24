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
        <el-input v-model.trim="query.labelGroupName" clearable maxlength="16" placeholder="关键词" />
      </el-form-item>

      <el-form-item label="标签">
        <el-input v-model.trim="query.labelName" clearable maxlength="16" placeholder="关键词" />
      </el-form-item>

      <el-form-item label="">
        <!-- 下个版本在加新增标签 -->
        <!-- <el-button type="primary" @click="$emit('add')">新增</el-button> -->
        <el-button type="primary" size="small" @click.native="fetchData(true)">搜索</el-button>
      </el-form-item>

      <div class="tag-group-list">
        <div v-for="tagGroup in lableList" :key="tagGroup.id" class="tag-group-item">
          <div class="tag-group-name" style="margin: 10px 0; font-weight: bold;">{{ tagGroup.name }}</div>
          <el-checkbox-group v-model="checkTagList" size="mini">
             <el-checkbox-button
                  v-for="i in tagGroup.memberLabelVOList"
                  :key="i.id"
                  :label="i.id"
                  style="margin-bottom: 10px;margin-right:5px"
                  >{{ i.name }}</el-checkbox-button
              >
          </el-checkbox-group>
        </div>
      </div>
    </el-form>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageData.pageSizes"
      :page-size="pageData.limit"
      :total="pageData.total"
      :current-page.sync="pageData.currentpage"
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
import Labels from "@/api/labels/labels";
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
    },
    list: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      query: {
        labelGroupName: '', // 标签组
        labelName: '',  // 标签
      },
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0,
      },
      lableList: [],
      checkTagList: [] // 选中数组
    }
  },
  watch: {
    visible(n) {
      if (!n) return
      this.fetchData(true);
    },
    list(n) {
      if (!n.length) return
      this.checkTagList = n
    }
  },
  methods: {
    async fetchData(reset) {
      if (reset) this.pageData.currentPage = 1
      this.lableList = []
      // TODO 待完善
      const { labelGroupName, labelName  } = this.query;
      const { currentpage, limit } = this.pageData;
      console.log('labelGroupName',labelGroupName,labelName)
      const params = {
        weightZero: false,
        freeze: 0,
        selectType:'1',
        labelGroupName,
        labelName,
        pageNum: currentpage,
        pageSize: limit,
      };
      let res = await Labels.getLabelGroupLst(params);
      if (res.state !== 1) return;
      res.data.list.forEach((item) => {
        item.labelList = item.memberLabelVOList || [];
      });
      this.lableList = res.data.list;
      this.pageData.total = res.data.totalRows;
    },
    // 确认
    confirm() {
      let checkTagListAll = []
      this.lableList.forEach((v)=>{
        v.memberLabelVOList.forEach(t =>{
          this.checkTagList.forEach(j =>{
            if(t.id == j){
            let obj = {
              label:t.name,
              labelId:t.id
            }
              checkTagListAll.push(obj)
            }
          })
        })
     
      })
      this.$emit('confirm', checkTagListAll)
      this.close()
    },
    // 关闭
    close() {
      this.$emit('update:visible', false)
      this.query = {
        labelGroupName: '',
        labelName: '',
      }
      this.pageData= {
        currentpage: 1,
        limit: 10,
        total: 0,
      }
      this.checkTagList = []
    },
    handleSizeChange(val) {
      this.pageData.limit = val;
      this.fetchData(1);
    },

    handleCurrentChange(val) {
      this.pageData.currentpage = val;
      this.fetchData();
    },
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
