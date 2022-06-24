<template>
  <div class="app-container">
    <div class="block">
        <el-form ref="query" :inline="true"  label-position="right" :model="query">
          <el-row>
              <el-form-item label="标题：">
                <el-input clearable   v-model="query.title" placeholder="关键词" maxlength="60" />
              </el-form-item>
            <el-form-item  label="一级菜单：" >
              <el-select   @change="onselectMenu" v-model="query.menu1Id" placeholder="请选择">
                  <el-option
                  v-for="(item, index) in menu1List"
                  :key="index"
                  :label="item.menuName"
                  :value="item.id"
                  />
              </el-select>
            </el-form-item>
            <el-form-item  label="二级菜单：">
              <el-select v-model="query.menu2Id" placeholder="请选择">
                  <el-option
                  v-for="(item, index) in menu2List"
                  :key="index"
                  :label="item.menuName"
                  :value="item.id"
                  />
              </el-select>
            </el-form-item>
            <el-button type="primary" @click="queryData">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-row>
        </el-form>

        <div class="chamber-middle"  v-loading="listLoading">
          <div v-if="list.length == 0" class="chamber-not">暂无数据~</div>
          <div v-else class="chamber-content">
            <div @click="ondetail(item.id)" class="chamber-grid" v-for="(item,index) in list" :key="index">
              <!-- 图片 -->
              <div class="chamber-pre">
                <el-image
                  :src="item.vcover"
                  class="chamber-avatar"
                />
                 <i class="el-icon-video-play" />
              </div>
              <!-- 文字 -->
              <div class="chamber-title">{{ item.title }} </div>
            </div>
          </div>
        </div>

        <el-pagination
          style="margin:20px 0;"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="pageSizes"
            :page-size="limit"
            :total="total"
            :current-page.sync="currentpage"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
  </div>
</template>

<script src="./chamberGuide.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/common.scss';
.el-input {
  width: 400px;
}
.chamber-middle{
  padding: 20px 0;
  .chamber-not{
    margin: 0 auto;
    width: 200px;
  }
  .chamber-content{
    display: flex;
    flex-wrap: wrap;
    // justify-content: center;
    width: 90%;
    .chamber-grid{
      width: 280px;
      height: 230px;
      text-align: center;
      margin: 0 20px 20px 20px;
      padding-top: 10px;
      border: 1px solid #000;
      cursor: pointer;
      .chamber-pre{
        border-radius: 6px;
        position: relative;
        width: 248px;
        height: 148px;
        overflow: hidden;
        margin: 0 auto;
        .chamber-avatar{
          width: 100%;
          height: 100%;
        }
        .el-icon-video-play{
          position: absolute;
          top: 22%;
          left: 31%;
          font-size: 70px;
          color: #fff;
        }
      }
      .chamber-title{
        margin-top: 5px;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;				//溢出内容隐藏
        text-overflow: ellipsis;		//文本溢出部分用省略号表示
        display: -webkit-box;			//特别显示模式
        -webkit-line-clamp: 2;			//行数
        line-clamp: 2;					
        -webkit-box-orient: vertical;	//盒子中内容竖直排列
        width: 100%;
        padding: 0 16px;
      }
    }
  }
}
</style>