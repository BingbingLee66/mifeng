 <template>
  <div>
    <el-dialog
      :title="showGroupType === 'delete' ? '移除标签' : '查看标签'"
      :visible.sync="moreVisible"
      width="80%"
      :before-close="close"
    >
      <div class="d-felx mb-20" v-if="showGroupName">
        <div style="width: 80px" class="text-right">标签组：</div>
        <div class="txt">{{ labelData.name }}</div>
      </div>
      <div v-if="showGroupType === 'delete'">
        <div>会员：{{ labelData.uname }}</div>
        <div class="d-felx mt-20">
          <div>标签：</div>
          <el-checkbox-group v-model="checkedLabel">
            <el-checkbox-button
              v-for="i in labelData.lableList"
              :key="i.id"
              :label="i.id"
              >{{ i.name }}</el-checkbox-button
            >
          </el-checkbox-group>
        </div>
      </div>
      <div v-else class="d-felx">
        <div style="width: 80px" class="text-right">标签：</div>
        <div class="txt">
          <el-tag
            v-for="item in labelData.labeList"
            :key="item.name"
            type="info"
            effect="plain"
            style="margin: 0 6px 6px 0"
          >
            {{ item.name }}
          </el-tag>
        </div>
      </div>

      <div slot="footer" class="text-center">
        <el-button v-if="showGroupType === 'delete'" @click="close"
          >取消</el-button
        >
        <el-button
          v-if="showGroupType === 'delete'"
          type="primary"
          @click="remove"
        >
          确定
        </el-button>
        <el-button v-else type="primary" @click="close">我知道了</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Labels from "@/api/labels/labels";
export default {
  data() {
    return {
      checkedLabel: [],
    };
  },
  props: {
    labelData: {
      type: Object,
      value: {},
    },
    moreVisible: {
      type: Boolean,
      value: false,
    },
    showGroupName: {
      type: Boolean,
      value: true,
    },
    showGroupType: {
      type: String,
      value: "",
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    async remove() {
      if (this.checkedLabel.length === 0)
        return this.$message.error("请至少选择一个标签");
      const tagIds = this.checkedLabel.join(",");
      const res = await Labels.removeLabel(this.labelData.wxUserId, tagIds);
      if (res.state !== 1) return;
      this.$message.success(res.msg);
      this.$emit("remove");
    },
  },
};
</script>


<style lang="scss" scoped>
/deep/ .el-checkbox-button {
  display: inline-block;
  position: relative;
  border: 1px solid #dcdfe6;
  margin-right: 20px;
}
</style>