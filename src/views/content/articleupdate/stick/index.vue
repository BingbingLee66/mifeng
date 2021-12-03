<template>
  <div class="preview-wrap">
    <el-table
        :data="list"
        border
      >
        <el-table-column key="activeName5" label="文章ID" width="80px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="文章标题">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
         <el-table-column label="权重" width="100px">
          <template slot-scope="scope">
            <span class="blue-label" @click="setLevel(scope.row)">
              {{ scope.row.sort }}
            </span>
          </template>
        </el-table-column>
         <el-table-column label="创建信息" width="180px">
          <template slot-scope="scope">
            <div>{{ scope.row.operator }}</div>
             <div>{{ scope.row.createdTs }}</div>
          </template>
        </el-table-column>
           <el-table-column label="更新信息">
        <template slot-scope="scope">
          <div>
            {{ scope.row.updater }}
          </div>
          <div>
            {{ scope.row.updatedTs }}
          </div>
        </template>
      </el-table-column>
        <el-table-column label="发布时间" width="160px">
          <template slot-scope="scope">
            <div v-if=" scope.row.status===4">定时发布</div>
            {{ scope.row.publishTs }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status == 0">已冻结</div>
          <div v-if="scope.row.status == 1">正常</div>
        </template>
      </el-table-column>
        <el-table-column label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <a
              class="my-btn"
               @click="updateTop(scope.row)"
            >
              取消置顶
            </a>
          </template>
        </el-table-column>
      </el-table>
         <kd-dialog
      ref="levelDialog"
      dialogTitle="权重"
      @savePopupData="savePopupData"
    >
      <div slot="content">
        <el-form
          :model="levelForm"
          :rules="levelRules"
          ref="levelForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="权重" prop="level">
            <el-input v-model.number="levelForm.level"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </kd-dialog>
  </div>
</template>

<script src="./detail.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
  .my-btn{
    color: #409eff;
  }
  .preview-wrap{
    margin: 30px 30px;
    padding-right: 80px;
  }
</style>
<style>

</style>
