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
              <el-select  v-model="query.menu2Id" placeholder="请选择">
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
            <el-row>
              <el-col  :span="8" class="chamber-grid" v-for="(item, index) in list" :key="index" >
                 <el-card shadow="always" :body-style="{ padding: '0px' }">
                    <div @click="ondetail(item.id)">
                      <div class="chamber-pre">
                        <el-image
                          :src="item.vcover"
                          class="chamber-avatar"
                        />
                        <i class="el-icon-video-play" />
                      </div>
                      <div class="chamber-bottom">
                        <div class="chamber-title">{{ item.title }} </div>
                      </div>
                    </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>

        <el-pagination
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
    width: 90%;
    .chamber-grid{
      width: 270px;
      margin: 0 50px 40px 0;
      cursor: pointer;
      .chamber-pre{
        position: relative;
        width: 100%;
        height: 260px;
        overflow: hidden;
        .chamber-avatar{
          width: 100%;
          height: 100%;
        }
        .el-icon-video-play{
          position: absolute;
          top: 83%;
          right: 3%;
          font-size: 34px;
          color: #fff;
        }
      }
      .chamber-bottom{
        margin-top: 20px;
        height: 50px;
        font-size: 13px;
        font-weight: 700;
        .chamber-title{
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;				//溢出内容隐藏
          text-overflow: ellipsis;		//文本溢出部分用省略号表示
          display: -webkit-box;			//特别显示模式
          -webkit-line-clamp: 2;			//行数
          line-clamp: 2;					
          -webkit-box-orient: vertical;	//盒子中内容竖直排列
          width: 100%;
          padding: 0 10px;
        }
      }

    }
  }
}
</style>