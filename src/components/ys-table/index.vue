<template>
  <div>
    <el-row v-if="toolData && toolData.length > 0" class="mb-20">
      <el-button
        v-for="item in toolData"
        :key="item.name"
        :type="item.type || 'primary'"
        :size="item.size || 'small'"
        :icon="item.icon || ''"
        @click="item.callback(item.name, $event)"
      >
        {{ item.name }}
      </el-button>
      <slot name="toolSlot"></slot>
    </el-row>
    <!-- 
      row-key => 行数据的 Key,reserve-selection为true时，必须指定
     -->
    <el-table
      ref="yyTable"
      border
      fit
      highlight-current-row
      v-loading="tableConfig.loading || false"
      :data="tableData"
      :element-loading-text="tableConfig.loadingText || 'Loading'"
      :height="tableConfig.height || null"
      :max-height="tableConfig.maxHeight || '600px'"
      :size="tableConfig.size || 'medium'"
      :header-cell-style="
        tableConfig.headerCellStyle || {
          background: '#fafafa',
          color: '#606266',
        }
      "
      :row-key="tableConfig.rowKey"
      @selection-change="handleSelectionChange"
    >
      <el-table-column label width="35" v-if="tableConfig.single">
        <template slot-scope="scope">
          <el-radio
            :label="scope.row[tableConfig.singleKey]"
            @change="
              (e) => {
                handleSligleChange(e, scope.row);
              }
            "
            v-model="singleSelection"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>

      <!--  reserve-selection => 是否保留之前选中的数据  -->
      <el-table-column
        type="selection"
        width="50px"
        v-if="tableConfig.selection"
        :reserve-selection="tableConfig.reserve"
      />
      <template v-for="item in tableColumn">
        <!-- 纯文本渲染 -->
        <el-table-column
          v-if="!item.type"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="item.tooltip || false"
          :width="item.width || ''"
          :min-width="item.minWidth || ''"
          :align="item.align || 'left'"
        ></el-table-column>
        <!-- 图片渲染 -->
        <el-table-column
          v-if="item.type === 'image'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <el-image
              :style="{ width: '100px',height: '100px', borderRadius: item.radius || 0}"
              :src="item.url && item.url(scope.row)"
              :preview-src-list="item.urlList && item.urlList(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- 链接 -->
        <el-table-column
          v-if="item.type === 'router'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <router-link
              :to="{
                name: item.name,
                query: item.params && item.params(scope.row),
              }"
            >
              <span class="blue-label">{{ scope.row[item.prop] }}</span>
            </router-link>
          </template>
        </el-table-column>
        <!-- html渲染 -->
        <el-table-column
          v-if="item.type === 'html'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <div v-html="scope.row[item.prop]"></div>
          </template>
        </el-table-column>
        <!-- 回调渲染   -->
        <el-table-column
          v-if="item.type === 'function'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="true"
          :width="item.width || ''"
          :min-width="item.minWidth || ''"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <span>
              {{ item.callback && item.callback(scope.row, item.prop) }}
            </span>
          </template>
        </el-table-column>
        <!-- 插槽渲染   -->
        <el-table-column
          v-if="item.type === 'slot'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :show-overflow-tooltip="item.tooltip || false"
          :width="item.width || ''"
          :min-width="item.minWidth || ''"
          :fixed="item.fixed || undefined"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <slot :name="item.slotName" :data="scope.row"></slot>
          </template>
        </el-table-column>

        <!-- 自定义渲染（按业务需求添加） -->
        <!-- 权重 -->
        <el-table-column
          v-if="item.type === 'level'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <span
              class="blue-label"
              @click="
                handleLevel(
                  scope.row[item.prop],
                  scope.row[item.lid],
                  scope.row
                )
              "
            >
              {{ scope.row[item.prop] }}
            </span>
          </template>
        </el-table-column>
        <!-- 时间 -->
        <el-table-column
          v-if="item.type === 'time'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <div>{{ scope.row[item.prop] | dateFormat }}</div>
          </template>
        </el-table-column>
        <!-- 操作者信息 -->
        <el-table-column
          v-if="item.type === 'operator'"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
          :align="item.align || 'left'"
        >
          <template slot-scope="scope">
            <div>{{ scope.row[item.operatorName] || "--" }}</div>
            <div>{{ scope.row[item.operatorTime] | dateFormat }}</div>
          </template>
        </el-table-column>
      </template>

      <!-- 表格操作 -->
      <el-table-column
        v-if="handleData"
        :key="handleData.label"
        :label="handleData.label"
        :width="handleData.width || ''"
        :fixed="handleData.fixed || 'right'"
        :align="handleData.align || 'left'"
      >
        <template slot-scope="scope">
          <div :style="handleData.handleStyle || {}">
            <span
              v-for="option in handleData.options"
              :key="option.key"
              :class="option.btnStyle"
              style="margin-right: 20px"
              @click="option.callback(scope.row)"
            >
              {{ option.name }}
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row v-if="pageData" class="mt-20">
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
    </el-row>

    <!-- 权重弹窗 -->
    <level-dialog ref="levelDialog" @levelCallback="handleLevelCallback" />
  </div>
</template>

<script>
import levelDialog from "@/components/levelDialog";
export default {
  components: {
    "level-dialog": levelDialog,
  },
  props: {
    toolData: {
      type: Array,
      default: () => [],
    },
    tableConfig: {
      type: Object,
      default: () => {},
    },
    tableColumn: {
      type: Array,
      default: () => {},
    },
    tableData: {
      type: Array,
      default: () => {},
    },
    pageData: {
      type: Object,
      default: () => {},
    },
    handleData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      rowData: {},
      singleSelection: "",
    };
  },
  computed: {
    getRowKeys(row) {
      return row[this.tableConfig.rowKey];
    },
  },
  methods: {
    handleSizeChange(data) {
      this.$emit("handleSizeChange", data);
    },
    handleCurrentChange(data) {
      this.$emit("handleCurrentChange", data);
    },
    handleSelectionChange(data) {
      this.$emit("handleSelectionChange", data);
    },
    handleSelectionClear() {
      this.$refs.yyTable.clearSelection();
    },
    handleLevel(data, id, row) {
      this.$refs["levelDialog"].show(data, id, row);
    },
    handleLevelCallback(data, row) {
      this.$emit("handleLevelCallback", data, row);
    },
    handleSligleChange(e, data) {
      this.$emit("handleSligleChange", data);
    },
    handleSelection() {
      let rows = this.update;
      if (rows) {
        rows.forEach((row) => {
          this.$refs["yyTable"].toggleRowSelection(row);
        });
      } else {
        this.$refs["yyTable"].clearSelection();
      }
    },
  },
  watch: {
    tableData: {
      handler() {
        this.$nextTick(() => {
          this.$refs.yyTable.doLayout(); // 解决表格错位问题
        });
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>


