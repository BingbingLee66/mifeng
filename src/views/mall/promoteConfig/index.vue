<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <el-button type="primary" :actionid="getId('', '创建推广信息')" v-if="has('', '创建推广信息')" @click.native="addPromoteChannel($event)">
            创建推广信息
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="block-table">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column label="推广ID" width="80px">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="关联渠道" width="120px">
          <template slot-scope="scope">
            <div> {{ scope.row.channelId }}</div>
            <div> {{ scope.row.channelName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="关联内容" width="200px">
          <template slot-scope="scope">
            <div v-if="scope.row.relType == 0">
              <div class="red-label">{{ scope.row.goodsId }}</div>
              <div> {{ scope.row.goodsName }}</div>
              <el-button type="text" style="margin-left:0px;" @click="detail($event, scope.row)">查看商品详情</el-button>
            </div>
            <div v-if="scope.row.relType == 1">首页 - 爆品必拼</div>
            <div v-if="scope.row.relType == 2">商会优选 - {{scope.row.relCkey | filterRelCkey(chamberOptions)}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="115px">
          <template slot-scope="scope">
            <img v-if="scope.row.relType == 0" class="goods-preview" :src="scope.row.descript" @click="openPreviewModal(scope.row.descript)">
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column label="来源商会" width="150px" >
          <template slot-scope="scope" >
            <div>{{ scope.row.relType == 0? scope.row.chamberName : '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="100px">
          <template slot-scope="scope">
            {{ scope.row.createdTs | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" width="100px">
          <template slot-scope="scope">
            {{ scope.row.operatorName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="has('', '生成渠道码')" type="text" :actionid="getId('', '生成渠道码')" @click="createCode($event, scope.row)">
              生成渠道码
            </el-button>
            <el-button v-if="has('', '生产短链接')" type="text" :actionid="getId('', '生产短链接')" @click="createLink($event, scope.row)">
              生成短链接
            </el-button>
            <!-- <el-button v-if="has('', '删除')" type="text" :actionid="getId('', '删除')" @click="delChannels($event, scope.row)">删除 </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="pageSizes"
      :page-size="limit"
      :total="total"
      :current-page.sync="currentpage"
      :style="{'padding-top': '15px'}"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
      title=""
      :visible.sync="previewImgVisible"
      width="50%">
      <img :src="previewUrl" style="width: 100%; padding:20px;">
    </el-dialog>

    <div class="code-dialog">
      <el-dialog
        title="生成渠道码"
        :visible.sync="channelCodeDialog"
        width="600px">
        <div style="width: 505px;margin: 0 auto">
          <div id="postdiv" class="channel-code-wrap">
            <div class="channel-code-img">
              <img class="qr-code" :src="channelCode">
            </div>
            <div class="channel-code-info">
              <div class="item">
                <div class="tit">推广渠道：</div>
                <div class="txt">{{ rowData.channelName }}</div>
              </div>
              <div class="item" v-if="rowData.relType == 0">
                <div class="tit">推广商品：</div>
                <div class="txt">{{ rowData.goodsName }}</div>
              </div>
              <div class="item" v-if="rowData.relType == 0">
                <div class="tit">来源商会：</div>
                <div class="txt txt-1">{{ rowData.chamberName }}</div>
              </div>
              <div class="item" v-if="rowData.relType != 0">
                <div class="tit">列表名称：</div>
                <div class="txt" v-if="rowData.relType == 1">首页 - 爆品必拼</div>
                <div class="txt" v-if="rowData.relType == 2">商会优选 - {{rowData.relCkey | filterRelCkey(chamberOptions)}}</div>
              </div>
              <div></div>
            </div>
          </div>
          <div style="text-align: center;margin-top: 5px">
            <el-button type="primary" @click="downloadCode" :loading="isLoading">保存</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <el-dialog
      title="生成短链接"
      :visible.sync="channelLinkDialog"
      width="500px">
      <el-row>
        <el-col style="width: 60px;">短链接：</el-col>
        <el-col style="width: 400px;">{{ channelLink }}</el-col>
      </el-row>
      <el-row>
        <el-col style="width: 60px;"></el-col>
        <el-col :span="10" :offset="3"><span style="color: #409eff;cursor: pointer;" @click="copyUrl">复制链接</span>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog
      title="创建推广信息"
      :visible.sync="promoteChannelDialog"
      width="30%"
    >
      <el-form :model="promoteForm" ref="promoteForm" label-width="100px" :rules="promoteRules">
        <el-form-item label="关联渠道：" prop="channelId">
          <el-col :span="16">
            <el-select v-model="promoteForm.channelId" placeholder="请选择" clearable>
              <el-option v-for="item in channelList" :key="item.id" :label="item.channelName" :value="item.id"/>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="关联商品：" >
          <el-col :span="16">
            <div class="flex-radio">
              <div class="required-point">*</div>
              <el-radio v-model="promoteForm.relType" label="0">单个商品</el-radio>
              <el-form-item prop="goodsId" class="single-input" v-if="promoteForm.relType == 0">
                <el-input v-model="promoteForm.goodsId" placeholder="商品ID" @blur="handleInput"></el-input>
                <div v-show="showGoodIdsDetail">
                  <div class="chamber-name">{{ goodsDetail.chamberName }}</div>
                  <div class="goods-name">{{ goodsDetail.name }}</div>
                </div>
             </el-form-item>
              <el-radio v-model="promoteForm.relType" label="list">商品列表</el-radio>
              <el-radio v-if="promoteForm.relType == 'list'" class="ml" v-model="promoteForm.relTypeChild" label="1">首页-爆品必拼</el-radio>
              <el-radio v-if="promoteForm.relType == 'list'" class="ml" v-model="promoteForm.relTypeChild" label="2">商会优选</el-radio>
              <el-form-item prop="relCkey" v-if="promoteForm.relType == 'list' && promoteForm.relTypeChild == 2" >
                <el-select v-model="promoteForm.relCkey" placeholder="请选择商会">
                 <el-option v-for="item in chamberOptions" :key="item.value" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="submitDisable" @click="submitPromote('promoteForm')">提交</el-button>
          <el-button @click="promoteChannelDialog=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="提示"
      :visible.sync="delDialog"
      width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialog = false">取 消</el-button>
    <el-button type="primary" @click="comfirmDel">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script src="./manager.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/common.scss";

.channel-code-wrap {
  width: 502px;
  height: 702px;
  background: #fff;
  border: 1px solid #d6d5d5;
  border-radius: 20px;
  font-size: 16px;
  font-family: PingFang SC, PingFang SC-Regular;
  color: #999999;
  overflow: hidden;

  .channel-code-img {
    width: 500px;
    height: 500px;
    background: #ffffff;
    border-bottom: 1px solid #d6d5d5;
    border-radius: 1px;

    .qr-code {
      width: 100%;
      height: 100%;
    }
  }

  .channel-code-info {
    padding: 20px 33px 33px 33px;
    box-sizing: border-box;

    .item {
      display: flex;
      margin-top: 18px;

      .tit {
        width: 80px;
        flex-shrink: 0;
        line-height: 24px;
      }

      .txt {
        font-weight: bold;
        color: #222222;
        line-height: 24px;
      }

      .txt-1 {
        color: #dc0000;
      }
    }
  }
}
.flex-radio {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  .el-radio {
    margin-bottom: 20px;
  }   
  .single-input{
   margin-bottom: 25px;
  }
  .ml{
    margin-left: 24px;
  }
  .required-point{
    position: absolute;
    top: -14px;
    left: -92px;
    color: #F56C6C;
  }
}
</style>
<style lang="scss">
.goods-preview {
  width: 90px;
  height: 90px;
  cursor: pointer;
  object-fit: cover;
}

.block-table .el-button {
  margin-left: 0;
  margin-right: 10px;
}

.red-label {
  color: #FF0000;
}

.code-dialog {
  .el-dialog {
    margin-top: 2vh !important;
  }
}
</style>
