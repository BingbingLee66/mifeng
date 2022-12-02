<template>
  <div class="">
    <el-dialog title="修改活动时间" :visible.sync="updateTimeVisible" :before-close="close" width="40%">
      <div>
        <el-form label-position="right" label-width="140px">
          <el-form-item label="活动时间">
            <el-date-picker
              v-model="timeList"
              type="datetimerange"
              disabled
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item v-if="liveEntranceCloseTime" label="直播入口结束时间">
            <el-date-picker
              v-model="liveEntranceCloseTime"
              type="datetime"
              value-format="timestamp"
              disabled
              placeholder="选择日期时间"
            />
          </el-form-item>
          <el-form-item label="时间修改为">
            <el-date-picker
              v-model="endTime"
              value-format="timestamp"
              type="datetime"
              placeholder="选择日期时间"
            />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateActivityTime } from '@/api/activity/activity'
export default {
  components: {},
  props: {
    updateTimeVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 状态
      reject: null,
      resolve: null,
      timeList: [],
      liveEntranceCloseTime: '',
      endTime: '',
      item: null
    }
  },
  methods: {
    close() {
      this.endTime = ''
      this.reject = null
      this.resolve = null
      this.$emit('update:updateTimeVisible', false)
    },
    show(item) {
      // startTime endTime  liveEntranceCloseTime
      return new Promise(async (resolve, reject) => {
        console.log('item', item)
        this.timeList = item.startTime ? [item.startTime, item.endTime] : []
        this.liveEntranceCloseTime = item?.liveEntranceCloseTime || ''
        this.item = item
        this.resolve = resolve
        this.reject = reject
      })
    },
    async submit() {
      const { item: { id }, endTime } = this
      if (!endTime) { this.$message('请输入修改后的结束时间'); return }
      const res = await updateActivityTime(id, endTime)
      if (res.state === 1) {
        this.$message.success('修改成功')
        this.resolve()
        this.close()
      } else { this.$message.error(res.msg) }
    }
  }
}
</script>

<style lang="scss" scoped></style>
