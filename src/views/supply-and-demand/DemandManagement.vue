<template>
  <div class="demand-management">
    <el-form ref="query" :inline="true" label-position="right" :model="query">
      <el-row>
        <el-form-item :span="8" label="供需标题">
          <el-input v-model="query.title" clearable placeholder="关键词" maxlength="40" />
        </el-form-item>
        <el-form-item :span="8" label="来源商/协会">
          <el-select v-model="query.ckey" filterable no-match-text="暂无数据">
            <el-option
              v-for="cc in chamberOptions"
              :key="cc.value"
              :label="cc.label"
              :value="cc.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="供需状态">
          <el-select v-model="query.status">
            <el-option label="全部" :value="-1" />
            <el-option label="生效中" :value="1" />
            <el-option label="已关闭（过期关闭）" :value="2" />
            <el-option label="已关闭（成功合作）" :value="3" />
            <el-option label="已关闭（终止对接）" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="冻结状态">
          <el-select v-model="query.freezeStatus">
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="平台冻结" :value="2" />
            <el-option label="商会冻结" :value="3" />
          </el-select>
        </el-form-item>

      </el-row>
      <el-row>
        <el-form-item :span="8" label="删除状态">
          <el-select v-model="query.deleteStatus">
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="用户删除" :value="2" />
            <el-option label="商会后台删除" :value="3" />
            <el-option label="总后台删除" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="举报状态">
          <el-select v-model="query.reportStatus">
            <el-option label="全部" :value="-1" />
            <el-option label="正常" :value="1" />
            <el-option label="被举报" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="发布时间">
          <el-select v-model="query.publishTime">
            <el-option label="全部" :value="-1" />
            <el-option label="24小时内" :value="1" />
            <el-option label="3天内" :value="2" />
            <el-option label="7天内" :value="3" />
            <el-option label="一个月内" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item :span="8" label="供需ID">
          <el-input v-model="query.id" placeholder="关键词" clearable />
        </el-form-item>
        <el-button :span="8" type="primary" @click="handleCurrentChange(1)">查询</el-button>
      </el-row>
      <el-row>
        <el-button type="primary">批量认证身份信息</el-button>
      </el-row>
    </el-form>

    <el-table
      ref="table"
      v-loading="loading"
      :data="tableData"
      style="width:100%;"
      stripe
      border
      header-row-class-name="tableheader"
      empty-text="暂无数据"
    >
      <!-- <el-table-column width="55" type="selection" /> -->
      <el-table-column label="供需ID" width="120" prop="id" />
      <el-table-column label="供需标题" width="240">
        <template slot-scope="{row}">
          <el-tooltip effect="light" :content="row.title" placement="top">
            <div class="ellipsis">{{ row.title }}</div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          {{ row.readPeopleNum || 0 }}
        </template>
        <template slot="header">
          <el-button type="text" @click="handleSort('readSort')">浏览量<i class="el-icon-sort" /></el-button>
        </template>

      </el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          {{ row.collectNum || 0 }}
        </template>
        <template slot="header">
          <el-button type="text" @click="handleSort('collectSort')">收藏量<i class="el-icon-sort" /></el-button>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          {{ row.chatPeopleNum || 0 }}
        </template>
        <template slot="header">
          <el-button type="text" @click="handleSort('chatSort')">洽谈量<i class="el-icon-sort" /></el-button>
        </template>
      </el-table-column>
      <el-table-column label="发布信息" width="180">
        <template slot-scope="{row}">
          <div>{{ row.sourceInfo ? row.sourceInfo.userName : '' }}</div>
          <div>{{ +row.createdTs | dateFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column label="来源商/协会" width="180">
        <template slot-scope="{row}">
          <div v-for="item in row.sourceChamberVOList" :key="item.id">{{ item.name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="可见性" width="120">
        <template slot-scope="{row:{visibility}}">
          <div v-if="+visibility === -1">计算中</div>
          <div v-else-if="+visibility === 1">全平台可见</div>
          <div v-else-if="+visibility === 2">部分商会可见</div>
        </template>
      </el-table-column>
      <el-table-column label="举报状态">
        <template slot-scope="{row:{reportStatus}}">
          <div v-if="+reportStatus === 1">正常</div>
          <div v-else-if="+reportStatus === 2">被举报</div>
        </template>
      </el-table-column>
      <el-table-column label="举报信息">
        <template slot-scope="{row}">
          <el-button :disabled="!+row.repostNum" type="text" size="small" @click="showRepostInfo(row)">{{ row.repostNum }}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="供需状态">
        <template slot-scope="{row:{status,closeReason}}">
          <div v-if="+status === 1">生效中</div>
          <div v-else-if="+status === 2">已关闭（过期关闭）</div>
          <div v-else-if="+status === 3">已关闭（成功合作）</div>
          <div v-else-if="+status === 4">
            <div>已关闭（终止对接）</div>
            <el-button v-if="closeReason" type="text" size="small" @click="$confirm(closeReason, '关闭原因', { showCancelButton: false, confirmButtonText: '我知道了', })">查看原因</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="同步商/协会" width="180">
        <template slot-scope="{row}">
          <div v-for="item in row.syncChamberVOList" :key="item.id">{{ item.name }}</div>
        </template>
      </el-table-column>
      <el-table-column label="冻结状态" width="180">
        <template slot-scope="{row}">
          <div v-if="+row.freezeStatus === 1">正常</div>
          <div v-else-if="+row.freezeStatus === 2">
            <strong>【平台冻结】</strong>
            <div v-for="item in row.syncPlatformFreezeChamberVOList" :key="item.id">{{ item.name }}</div>
          </div>
          <div v-else-if="+row.freezeStatus === 3">
            <strong>【商会冻结】</strong>
            <div v-for="item in row.syncChamberFreezeChamberVOList" :key="item.id">{{ item.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="删除状态">
        <template slot-scope="{row:{deleteStatus}}">
          <div v-if="+deleteStatus === 1">正常</div>
          <div v-else-if="+deleteStatus === 2">用户删除</div>
          <div v-else-if="+deleteStatus === 3">商会后台删除</div>
          <div v-else-if="+deleteStatus === 4">总后台删除</div>
        </template>
      </el-table-column>
      <el-table-column label="供需成功匹配人" width="180">
        <template slot-scope="{row:{matchInfo}}">
          <template v-if="matchInfo">
            <div>{{ matchInfo.userName }}</div>
            <div>{{ matchInfo.phone }}</div>
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column label="是否后台发布" width="120">
        <template slot-scope="{row:{source}}">
          <div v-if="+source === 1">是（平台）</div>
          <div v-else-if="+source === 2">是（商会）</div>
          <div v-else-if="+source === 3">否</div>
        </template>
      </el-table-column>
      <el-table-column label="创建信息 (后台发布)" width="180">
        <template slot-scope="{row:{createInfo}}">
          <template v-if="createInfo">
            <div>{{ createInfo.userName }}</div>
            <div>{{ +createInfo.time | dateFormat }}</div>
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column label="更新信息" width="180">
        <template slot-scope="{row:{updateInfo}}">
          <template v-if="updateInfo">
            <div>{{ updateInfo.userName }}</div>
            <div>{{ +updateInfo.time | dateFormat }}</div>
          </template>
          <template v-else>--</template>
        </template>
      </el-table-column>
      <el-table-column label="商/协会认证状态">
        <template slot-scope="{row:{authenticate}}">
          <div v-if="authenticate">已认证</div>
          <div v-else>未认证</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="{row}">
          <div>
            <el-button type="text" size="small" @click="goToEdit(row)">编辑</el-button>
            <el-button type="text" size="small" @click="showDetail(row)">详情</el-button>
          </div>
          <div>
            <el-button type="text" size="small" @click="showFreezeDialog(row, true)">冻结</el-button>
            <el-button :disabled="row.freezeStatus===1" type="text" size="small" @click="showFreezeDialog(row, false)">解冻</el-button>
          </div>
          <div>
            <el-button :disabled="row.deleteStatus !== 1" type="text" size="small" @click="handleDelete(row)">删除</el-button>
            <el-button :disabled="row.deleteStatus === 1" type="text" size="small" @click="handleUnDelete(row)">撤销删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100, 500]"
      :page-size="query.pageSize"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 冻结相关弹窗 -->
    <el-dialog :visible.sync="freezeAboutDialog.visible" :title="freezeAboutDialog.isFreeze?'冻结':'解冻'">
      <div style="margin-bottom:10px;">请选择{{ freezeAboutDialog.isFreeze?'冻结':'解冻' }}发布商/协会
        <span style="color:red;">
          （{{ freezeAboutDialog.isFreeze?'可复选，冻结后，该动态不展示在已选商会中':'解冻后，该动态将恢复展示在已选商会中' }}）
        </span>
      </div>
      <el-checkbox-group v-model="freezeAboutDialog.checkList" v-loading="freezeAboutDialog.loading">
        <template v-for="item in freezeAboutDialog.list">
          <el-checkbox v-if="item.value" :key="item.id" style="display:block;margin-bottom:10px;" :label="item.value">{{ item.label }}</el-checkbox>
        </template>
      </el-checkbox-group>
      <div slot="footer">
        <el-button @click.native="freezeAboutDialog.visible=false">取消</el-button>
        <el-button type="primary" @click="handleFreeze">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailDialog.visible" width="60%" @close="$refs.videoRef&&$refs.videoRef.closeDia()">
      <div v-loading="detailDialog.loading" class="m-preview-wrap">
        <div class="m-preview-area">
          <div class="m-article-title">{{ detailDialog.data.title }}</div>
          <div class="content" style="padding: 0rpx;">
            <p class="text" style="font-size: 16px; line-height: 34px;letter-spacing: 2px;white-space: pre-wrap;" v-html="detailDialog.data.content" />
            <div class="img-list" style="display: flex;flex-wrap: wrap;min-height:2rpx;margin:20rpx auto 0;">
              <img v-for="(v,i) in detailDialog.data.imgs" :key="i" mode="widthFix" :src="v" style="width:226rpx;height:156rpx;margin:3rpx;border-radius: 2px;flex-shrink: 0;">
            </div>
          </div>
          <videoComponent v-if="detailDialog.data.vid" ref="videoRef" :vid="detailDialog.data.vid" height="530px" />
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { supplyDemandList,
  getReportList,
  getFreezeAbleList,
  getUnFreezeAbleList,
  freezeSupplyDemandByUpBackground,
  unFreezeSupplyDemandByUpBackground,
  deleteSupplyDemand,
  unDeleteSupplyDemand,
  getSupplyDemandDetail
} from '@/api/home/supplyDemandManger'
import { getChamberOptions } from '@/api/finance/finance'
import { formatDateTime } from '@/utils/date'
import videoComponent from '@/components/video/index'

export default {
  name: 'DemandManagement',
  components: {
    videoComponent
  },
  data() {
    return {
      query: {
        title: '',
        pageSize: 10,
        pageNum: 1,
        deleteStatus: -1,
        ckey: '',
        reportStatus: -1,
        status: -1,
        freezeStatus: -1,
        visibility: -1,
        readSort: 0,
        collectSort: 0,
        chatSort: 0,
        isHot: -1,
        publishTime: -1
      },
      total: 0,

      loading: false,

      chamberOptions: [],

      tableData: [],

      freezeAboutDialog: {
        isFreeze: true, // 是否为冻结
        visible: false,
        data: {},
        list: [],
        checkList: [],
        loading: true
      },

      detailDialog: {
        visible: false,
        data: {},
        loading: true
      },

    }
  },
  created() {
    this.querySupplyDemandList()
    this.getChamberOptions()
  },
  methods: {
    async getChamberOptions() {
      const { data } = await getChamberOptions()
      this.chamberOptions = data.data
      this.chamberOptions.unshift({ 'label': '全部商会', 'value': '' }, { 'label': '凯迪云商会', 'value': 'kaidiyun' })
    },

    async querySupplyDemandList() {
      this.loading = true
      const params = { ...this.query }
      Object.entries(params).forEach(([key, value]) => {
        if (value === '') delete params[key]
      })
      try {
        const { data: { list, totalRows }} = await supplyDemandList(params)
        this.tableData = list
        this.total = totalRows
      } catch (error) { /*  */ }
      this.loading = false
    },

    handleSizeChange(val) {
      this.query.pageSize = val
      this.querySupplyDemandList()
    },
    handleCurrentChange(val) {
      this.query.pageNum = val
      this.querySupplyDemandList()
    },

    handleSort(sortType) {
      const oldSort = this.query[sortType]
      this.query.readSort = 0
      this.query.collectSort = 0
      this.query.chatSort = 0
      this.query[sortType] = ({ '-1': 1, 0: 1, 1: -1 })[oldSort]
      this.querySupplyDemandList()
    },

    async showRepostInfo(row) {
      const { data: { list = [] }} = await getReportList({ tarId: row.id, page: 1, pageSize: 100 })

      this.$confirm(`
        <div style="margin:-10px -15px;border-top:1px solid #eee;">
          ${list.map(v => `<div style="padding:20px;border-bottom:1px solid #eee;">
            <div>举报人信息：${v.uname}</div>
            <div>举报人手机号：${v.phone}</div>
            <div>举报内容：${v.reason}</div>
            <div>举报时间：${formatDateTime(new Date(+v.createdTs), 'yyyy-MM-dd hh:mm:ss')}</div>
          </div>`).join('')}
        </div>
      `,
      '举报信息', {
        showCancelButton: false,
        confirmButtonText: '我知道了',
        dangerouslyUseHTMLString: true
      })
    },

    async showFreezeDialog(row, isFreeze) {
      this.freezeAboutDialog = { isFreeze, visible: true, data: row, list: [], checkList: [], loading: true }
      try {
        const { data = [] } = await (isFreeze ? getFreezeAbleList : getUnFreezeAbleList)({ id: row.id })
        this.freezeAboutDialog.list = data
      } catch (error) { /*  */ }
      this.freezeAboutDialog.loading = false
    },

    async handleFreeze() {
      try {
        const { data, checkList, isFreeze } = this.freezeAboutDialog

        const { state } = await (
          isFreeze
            ? freezeSupplyDemandByUpBackground
            : unFreezeSupplyDemandByUpBackground
        )(data.id, { freezeTargets: checkList })

        if (state === 1) {
          this.$message({ message: '冻结成功', type: 'success' })
          this.freezeAboutDialog.visible = false
          this.querySupplyDemandList()
          return
        }
      } catch (error) { /*  */ }

      this.$message({ message: '冻结失败', type: 'error' })
    },

    async handleDelete(row) {
      try {
        await this.$confirm('确定删除该供需吗', '提示')
        const { state, msg } = await deleteSupplyDemand(row.id)
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
        state === 1 && this.querySupplyDemandList()
      } catch (error) { /*  */ }
    },

    async handleUnDelete(row) {
      try {
        await this.$confirm(`
        <div>您确定撤销删除该供需吗？</div>
        <div style="color: #ccc;">撤销删除后，供需将恢复为正常状态，前台将恢复显示</div>
        `, '提示', { dangerouslyUseHTMLString: true })
        const { state, msg } = await unDeleteSupplyDemand(row.id)
        this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
        state === 1 && this.querySupplyDemandList()
      } catch (error) { /*  */ }
    },

    async showDetail(row) {
      this.detailDialog = { visible: true, data: {}, loading: true }
      try {
        const { data: { yshContentEditVO = {}}} = await getSupplyDemandDetail(row.id)
        this.detailDialog.data = yshContentEditVO
        if (yshContentEditVO.vid) {
          await this.$nextTick()
          this.$refs.videoRef.show(yshContentEditVO.vid)
        }
      } catch (error) { /*  */ }
      this.detailDialog.loading = false
    },

    async goToEdit(row) {
      try {
        const { data } = await getSupplyDemandDetail(row.id)
        const detailMap = JSON.parse(localStorage.getItem('supply_demand_detail') || '{}')
        detailMap[row.id] = data
        localStorage.setItem('supply_demand_detail', JSON.stringify(detailMap))
        this.$router.push({
          path: data.yshContentEditVO.contentType === 1 ? '/supply-and-demand/edit/img' : '/supply-and-demand/edit/video',
          query: { isEdit: 1, id: row.id }
        })
      } catch (error) { /*  */ }
    }
  },
}
</script>

<style scoped lang="scss">
.demand-management {
  padding: 20px;
}

.ellipsis {
  @include ellipsis(2)
}

.m-preview-wrap {
  width: 100%;
  height: 80vh;
}

.m-preview-area {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0 auto;
  border: 1px solid #d9dde2;
  overflow-y: auto;
}

.m-article-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  margin: 20px 40px 20px 40px;
}
</style>
