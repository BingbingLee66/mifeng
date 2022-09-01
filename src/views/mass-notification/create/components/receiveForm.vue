<template>
  <div style="margin-bottom: 20px">
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
                {{ node.label }}
                <span v-if="data.departmentRespList.length > 0">({{ data.departmentRespList.length }})</span>
              </span>
              >
            </el-tree>
          </div>
        </div>
        <!-- 指定会员 -->
        <div v-if="form.receive === 4">
          <SelectShow :btn-text="btnTextComput" :num="selectMember" @selectEmit="selectEmit" @showDialog="showDialog" />
        </div>
        <!-- 手机号 -->
        <div v-if="form.receive === 6">
          <el-input
            v-model="form.phones"
            type="textarea"
            placeholder="请输入手机号"
            autosize
            style="width: 600px"
          ></el-input>
          <div class="tips">
            <span>提示:</span>
            <span>1.输入多个手机号时，请以回车换行。</span>
            <span>2.单次指定的手机号不得大于1000个。</span>
          </div>
        </div>
      </el-form-item>
      <receiveDialog ref="receiveRef" :commit-type="commitType" @tableSelect="tableSelect" @hide="hide">
        <!-- 搜索框 -->
        <div slot="form">
          <el-form-item label="搜索">
            <el-input v-model="name" :placeholder="placeholder"></el-input>
          </el-form-item>
        </div>
        <div slot="receive">
          <el-button v-if="commitType === 1" type="primary" @click="save">我知道了</el-button>
          <div v-if="commitType === 2">
            <el-button type="primary" @click="save">确定</el-button>
            <el-button @click="hide">取消</el-button>
          </div>
        </div>
      </receiveDialog>
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
  provide() {
    return {
      columnConfig: [
        { type: 'select' },
        {
          prop: 'name',
          label: '名称',
          width: 180,
          formatter: row => {
            return 'formatter之后的名称' + row.name
          }
        },
        { prop: 'address', label: '地址', width: 180 }
      ],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎22',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎333',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  data() {
    return {
      form: {
        receive: 6,
        position: null,
        department: null,
        // 输入手机号
        phones: ''
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
      // 操作type 1 查看 2选择
      commitType: 1,
      name: '',
      placeholder: '请输入',
      // 已选表格数据
      selectData: []
    }
  },
  computed: {
    departmentCount() {
      return this.form.department
        ? this.form.department.reduce((pre, cur) => pre + cur.departmentRespList.length, 0)
        : 0
    },
    btnTextComput() {
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
    async listFunc() {
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
    /** 行为操作 */
    save() {
      // 点击确定按钮
      console.log('this.selectData', this.selectData)
    },

    /** 与子组件交互 */

    // 点击去选择按钮
    selectEmit() {
      this.commitType = 2
      // this.dialogVisible = true
      // 显示弹框组件
      console.log(this.$refs['receiveRef'].$children[0].show())
    },
    // 已选表格
    tableSelect(val) {
      this.selectData = val
    },
    // 关闭弹框
    hide() {
      this.$refs['receiveRef'].$children[0].hide()
    },
    // 点击查看按钮
    showDialog() {
      this.commitType = 1
      console.log('查看按钮')
    }
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
.tips {
  display: flex;
  flex-direction: column;
  color: #7f7f7f;
  line-height: 22px;
}
</style>
