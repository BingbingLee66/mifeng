<template>
  <div>
    <el-form :model="form">
      <el-form-item label="接收人" prop="receive">
        <el-radio-group v-model="form.receive">
          <el-radio v-for="(item, index) in receiveList" :key="index" :label="item.type">{{ item.n }}</el-radio>
        </el-radio-group>
        <!-- 本商会会员 -->
        <SelectShow v-if="form.receive === 5" :num="memberNum" />
        <!-- 指定职位 -->
        <el-select v-if="form.receive === 2" v-model="form.position" class="my-input" multiple placeholder="请选择">
          <el-option v-for="(item, index) in options" :key="index" :value="item.name">
            {{ item.name }}({{ item.count }})</el-option
          >
        </el-select>

        <!-- 指定部门 -->
        <div v-if="form.receive === 3">
          <SelectShow :only-show="false" @clickItem="showTreeFunc" />
          <div v-if="showTree && form.department" class="department">
            <div v-if="form.department">
              <el-tag v-for="item in form.department" :key="item.id" closable @close="handleClose(item.id)">{{
                item.departmentName
              }}</el-tag>
            </div>
          </div>

          <SelectShow v-if="departmentCount > 0" :num="departmentCount" />
          <div v-if="showTree" class="tree">
            <el-tree
              ref="tree"
              :data="treeList"
              show-checkbox
              default-expand-all
              node-key="id"
              highlight-current
              :props="defaultProps"
              @check-change="checkChange"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                {{ node.label }} <span v-if="data.departmentRespList.length > 0">({{ data.departmentRespList.length }})</span> </span>
              >
            </el-tree>
          </div>
        </div>
        <!-- 指定会员 -->
        <div v-if="form.receive === 4">
          <SelectShow :btn-text="btnTextComput " :num="selectMember" @selectEmit="selectEmit" @showDialog="showDialog" />
        </div>      
      </el-form-item>
      <receiveDialog v-if="show" />
    </el-form>
  </div>
</template>

<script>
import receiveDialog from '../../components/common/receiveDialog'
import SelectShow from '../../components/content/selectShow'
import { getDepartmentList } from '@/api/org-structure/org'
import { list } from '@/api/member/manager'
export default {
  name: 'ReceiveForm',
  components: { receiveDialog, SelectShow },
  props: ['receiveList', 'ckey'],
  data() {
    return {
      form: {
        receive: 3,
        position: null,
        department: null
      },
      // 会内职位
      options: [
        { name: '会长', count: 33 },
        { name: '学生', count: 93 }
      ],
      treeList: [],
      defaultProps: {
        children: 'departmentRespList',
        label: 'departmentName'
      },
      // 显示部门树结构
      showTree: false,
      // 本商会会员数
      memberNum: 0,
      // 指定会员数
      selectMember: 0,
      show: false
    }
  },
  computed: {
    departmentCount() {
      return this.form.department
        ? this.form.department.reduce((pre, cur) => pre + cur.departmentRespList.length, 0)
        : 0
    },
    btnTextComput(){
      return this.selectMember > 0 ? '查看' : '去选择'
    }
  },
  created() {
    this.form.receive = this.receiveList[0].type
    this.getDepartmentListFunc()
    this.listFunc()
  },
  methods: {
    showTreeFunc() {
      this.showTree = !this.showTree
    },
    checkChange() {
      this.form.department = this.$refs.tree.getCheckedNodes()
    },
    // 删除标签
    handleClose(id) {
      console.log('id', id)
      // 删除表单中已选tree数据
      this.form.department.splice(
        this.form.department.indexOf(item => item.id === id),
        1
      )
      // 手动设置tree树 setChecked(key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false
      this.$refs.tree.setChecked(id, false, true)
    },
    /** 请求 */
    async listFunc(){
      await list({
        pageSize: 10,
        page: 1,
        ckey: 'tlUMN9'
      })
    },
    async getDepartmentListFunc() {
      const {
        data: { data }
      } = await getDepartmentList({ ckey: this.ckey, parentId: 0 })
      this.treeList = data[0].departmentRespList
    },

    /** 与子组件交互 */

    // 点击去选择按钮
    selectEmit(){
      console.log('去选择')
      this.show = true

    },
    // 点击查看按钮
    showDialog(){
      console.log('查看按钮')
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
.btn {
  height: 30px;
}

.text {
  color: #c0c4cc;
}
.my-input {
  width: 500px;
  display: flex;
}
.department {
  min-height: 100px;
  border: 1px solid #dcdfe6;
  max-width: 500px;
  margin-bottom: 10px;
}
.el-tag {
  margin: 5px;
}
.tree {
  width: 500px;
  border: 1px solid #dcdfe6;
  margin-top: 10px;
  max-height: 200px;
  overflow-y: scroll;
}
</style>
