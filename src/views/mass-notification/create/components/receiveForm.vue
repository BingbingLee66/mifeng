<template>
  <div style="margin-bottom: 20px">
    <el-form :model="form">
      <el-form-item label="接收人" prop="receive">
        <el-radio-group v-model="form.receive" @change="radioChange">
          <el-radio v-for="(item, index) in receiveList" :key="index" :label="item.type">{{ item.n }}</el-radio>
        </el-radio-group>
        <!-- 所有会员（总后台） 本商会会员（商会后台）-->
        <SelectShow v-if="form.receive === -1 || form.receive === 1" :num="memberNum" @showDialog="showDialog" />
        <!-- 指定商会会员 -->
        <SelectShow
          v-if="form.receive === 5"
          :btn-text="btnTextComput"
          :num="memberCount"
          @selectEmit="selectEmit"
          @showDialog="selectEmit"
        />
        <!-- 指定职位 -->
        <div v-if="form.receive === 2">
          <el-select v-model="form.position" class="my-input" multiple placeholder="请选择" value-key="id">
            <el-option v-for="(item, index) in options" :key="index" :label="item.postName" :value="item">
              {{ item.postName }}({{ item.memberNum }})</el-option>
          </el-select>
          <div>
            <SelectShow v-if="positionCount > 0" :num="positionCount" @showDialog="showDialog" />
          </div>

          <!-- <span style="margin-left:10px">已选{{positionCount}}人</span> -->
        </div>

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

          <SelectShow v-if="departmentCount > 0" :num="departmentCount" @showDialog="showDialog" />
          <div v-if="showTree" class="tree">
            <el-tree
              ref="tree"
              :data="treeList"
              show-checkbox
              default-expand-all
              node-key="id"
              :default-checked-keys="defaultChecked"
              highlight-current
              :props="defaultProps"
              @check-change="checkChange"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                {{ node.label }}
                <span>({{ data.peopleCount }})</span>
                <!-- <span v-if="data.departmentRespList.length > 0">({{ data.departmentRespList.peopleCount }})</span> -->
              </span>
              >
            </el-tree>
          </div>
        </div>
        <!-- 指定会员 -->
        <div v-if="form.receive === 4">
          <SelectShow
            :btn-text="btnTextComput"
            :num="selectMemberList.length"
            @selectEmit="selectEmit"
            @showDialog="selectEmit"
          />
        </div>
        <!-- 手机号 -->
        <div v-if="form.receive === 6">
          <el-input
            v-model="form.phones"
            type="textarea"
            placeholder="请输入手机号"
            autosize
            style="width: 600px"
          />
          <div class="tips">
            <span>提示:</span>
            <span>1.输入多个手机号时，请以回车换行。</span>
            <span>2.单次指定的手机号不得大于1000个。</span>
          </div>
        </div>
      </el-form-item>
      <receiveDialog
        ref="receiveRef"
        :page-size="pageSize"
        :current-page="page"
        :total="total"
        :commit-type="commitType"
        :table-data="tableData"
        :column-config="columnConfig"
        @change="change"
        @tableSelect="tableSelect"
        @hide="hide"
      >
        <!-- 搜索框 -->
        <div slot="form">
          <el-form :inline="true">
            <el-form-item :label="labelComputed">
              <!-- <el-input class="search-input" v-model="query.chamberName" :placeholder="placeholder"></el-input> -->
              <el-input v-model="query.attr" class="search-input" :placeholder="placeholder" />
            </el-form-item>

            <el-button @click="getNumberList(true)">查询</el-button>
          </el-form>

          <!-- <el-form-item :label="labelComputed" v-if="form.receive === -1">
            <el-input class="search-input" v-model="query.chamberName" :placeholder="placeholder"></el-input>
          </el-form-item>

          <el-form-item label="搜索" v-if="form.receive === 5">
            <el-input class="search-input" v-model="name" placeholder="商协会名称"></el-input>
          </el-form-item> -->
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
import { getMemberList, getMemberCountList, getChamberMemberList, memberPostList } from '@/api/mass-notification/index'
import cloneDeep from 'lodash/cloneDeep'
import { memberTableConfig, memberCountTableConfig, memberPageListConfig } from '../../util/label'
export default {
  name: 'ReceiveForm',
  components: { receiveDialog, SelectShow },
  props: {
    activityType: {
      type: Number,
      default: 2
    },
    receiveList: {
      type: Array,
      default() { return [] }
    },
    receive: {
      type: Number,
      default: -1

    },
    ckey: {
      type: String,
      default: -1
    }, id: {
      type: String,
      default: null
    } },
  // provide() {
  //   return {
  //     tableMsg: this
  //   }
  // },
  data() {
    return {
      form: {
        receive: 4,
        position: [],
        department: null,
        // 输入手机号
        phones: ''
      },
      query: {
        attr: '',
        // // 手机号/姓名/企业名称 商会后台本商会会员 1
        // keyword: '',
        // // 手机号/姓名  指定会员商会后台 4
        // keyword: '',
        // // 姓名  所有会员 -1
        // uname: '',
        // // 商协会名称 指定商会会员 5
        // chamberName: ''
      },
      // 会内职位
      options: [],
      treeList: [],
      // 默认选择的tree数据
      defaultChecked: [],
      defaultProps: {
        children: 'departmentRespList',
        label: 'departmentName'
      },
      // 显示部门树结构
      showTree: false,
      // 所有会员数
      memberNum: 0,
      // 已选指定会员数，用来显示和储存
      selectMemberList: [],
      // 已选数，用户编辑操作
      selectUpdateList: [],
      // 操作type 1 查看 2选择
      commitType: 1,
      name: '',
      placeholder: '请输入',
      // 表格配置

      selectData: [], // 已选表格数据,临时
      tableData: [],
      columnConfig: [], // 列配置
      // 分页
      page: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    memberCount() {
      const { selectMemberList } = this
      if (!selectMemberList.length > 0) { return 0 }
      return selectMemberList.reduce((pre, cur) => { console.log('pre', pre); return pre + cur.memberCount }, 0)
    },
    departmentCount() {
      return this.sum(this.form.department)
      // if (this.form.department) {
      //   this.form.department.reduce((pre, cur) => {
      //     if (cur?.departmentRespList) {
      //       return pre + cur?.departmentRespList.length
      //     } else {
      //       pre + 0
      //     }
      //   }, 0)
      // }
      // return  this.form.department.reduce((pre, cur) => pre + cur?.departmentRespList.length || 0, 0)
      //   : 0
    },
    btnTextComput() {
      return this.selectMemberList.length > 0 ? '查看' : '去选择'
    },
    positionCount() {
      const {
        options,
        form: { position }
      } = this
      if (!position.length > 0) return 0
      let count = 0
      for (const v of position) {
        const result = options.find(item => item.id === v.id)
        result && (count += result.memberNum)
      }
      console.log('count', count)
      return count
    },
    labelComputed() {
      const {
        form: { receive }
      } = this
      return receive === -1
        ? '姓名'
        : receive === 5
          ? '商协会名称'
          : receive === 4
            ? '手机号/姓名'
            : '手机号/姓名/企业名称'
    }
  },
  watch: {
    'form.receive'() {
      console.log('接收人发生改变', this.form.receive)
      this.page = 1
      this.pageSize = 10
      // 所有会员
      if (this.form.receive === -1 || this.form.receive === 4 || this.form.receive === 1) {
        this.getNumberList()
      } else if (this.form.receive === 3) {
        // 指定部门
        this.getDepartmentListFunc()
      } else if (this.form.receive === 2) {
        // 指定职位
        this.memberPostListFunc()
      }
      // 清楚已选数据
      this.selectData = []
      this.columnConfig = []
      this.selectMemberList = []
      // 置空已选会员
      this.$refs['receiveRef'].$refs['tableRef'] && this.$refs['receiveRef'].$refs['tableRef'].cancelSelect()
      // 清除query
      this.query.attr = ''
    },

  },
  created() {
    this.form.receive = this.receive
    console.log('this.receive', this.receive)
    // this.getDepartmentListFunc()
    // this.getNumberList()
  },
  methods: {
    // 设置receive phone
    setFormData(type = 'receive', val) {
      console.log('val', val)
      if (type === 'receive') { this.form.receive = val } else if (type === 'phones') { this.form.phones = val.join('\n') }
    },

    // 设置已选数 编辑回显时用
    async setSelectMemberList(val) {
      setTimeout(() => {
        if (this.form.receive === 5 || this.form.receive === 4) {
          this.getNumberList().then(() => {
            // 编辑模式，根据后端的id数组，查找列表中的已选数组
            const arr = []
            console.log('tableData', this.tableData)
            val.forEach(item => {
              let result = null
              // 5 根据ckey查找 4根据id
              if (this.form.receive === 5) { result = this.tableData.find(val => item === val.ckey) }
              if (this.form.receive === 4) { result = this.tableData.find(val => item === val.id) }
              console.log('result', result)
              result && arr.push(result)
            })
            this.selectMemberList = arr
          })
        } else if (this.form.receive === 2) {
          this.form.position = val.map(v => { return { id: v.id, postName: v.name } })
        } else if (this.form.receive === 3) {
          this.form.department = val.map(v => { return { id: v.id, departmentName: v.name } })
          this.defaultChecked = val.map(v => v.id)
          this.showTree = true
        }
      }, 500)
      // console.log('val', val)
      // console.log('tableData', this.tableData)
      // this.selectMemberList = val
    },
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
      this.form.department.splice(this.form.department.indexOf(item => item.id === id), 1)
      // 手动设置tree树 setChecked(key/data, checked, deep) 接收三个参数，1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false
      this.$refs.tree.setChecked(id, false, true)
    },
    /** 请求 */
    // 拉取部门
    async getDepartmentListFunc() {
      const { data } = await getDepartmentList({ ckey: this.ckey, parentId: 0 })
      console.log('data', data)
      this.treeList = data[0].departmentRespList
    },
    // 拉取职位
    async memberPostListFunc() {
      const { data } = await memberPostList({ ckey: this.ckey })
      this.options = data
      console.log('data', data)
    },
    // 拉取
    async getNumberList() {
      console.log('query', this.query.attr)
      console.log('aComputed', this.aComputed)
      const { page, pageSize, ckey, query: { attr } } = this
      const params = { page, pageSize, ckey }
      let API = getMemberList
      // 所有会员
      if (this.form.receive === -1) {
        API = getMemberList
        params['uname'] = attr
      } else if (this.form.receive === 5) {
        // 指定商会会员
        API = getMemberCountList
        params['chamberName'] = attr
      } else if (
        this.form.receive === 2 ||
        this.form.receive === 3 ||
        this.form.receive === 4 ||
        this.form.receive === 1
      ) {
        // 指定商会会员 and本商会会员 商会后台用
        const {
          form: { position, department }
        } = this
        API = getChamberMemberList
        if (this.form.receive === 2) {
          params.postIds = position.map(v => v.id)
        }
        if (this.form.receive === 3) {
          params['departmentIds'] = department && department.map(v => v.id)
        }
        // todo 写到query传参
        params['keyword'] = attr
      }

      const { data } = await API(params)
      this.memberNum = data.totalRows
      this.total = data.totalRows
      this.tableData = data.list
      // if (flag) {
      //   // 回显数据
      //   this.$refs['receiveRef'].$refs['tableRef'].toggleSelection(this.selectMemberList)
      // }
      // const { data } = await getMemberList({ page, pageSize })
      // this.memberNum = data.totalRows
      // this.total=data.totalRows
      // this.tableData=data.list
    },
    /** 行为操作 */
    save() {
      // 点击确定按钮
      console.log('this.selectData', this.selectData)
      console.log('this.$refs.$children', this.$refs['receiveRef'].$refs['tableRef'])
      // 查看模式
      if (this.commitType === 1) {
        console.log('aa')
      } else {
        this.selectMemberList = this.selectData
        // // 选择模式   去重数组，如果没有再添加
        // this.selectData.forEach(item => {
        //   if (! this.selectMemberList.some(s => s.id === item.id)) {
        //     this.selectMemberList.push(item)
        //   }
        // })
        // // this.tableData 当前页的数据
        // // this.selectData 表格当前页已选数据
        // // 因为不知道哪些是用户取消勾选，所以只能通过这种方法拿到当前页没有选的数据，去已选数组中删除
        // const deleteArr = []
        // this.tableData.forEach(item => {
        //   if (!this.selectData.some(s => s.id === item.id)) {
        //     deleteArr.push(item)
        //   }
        // })
        // console.log('deleteArr', deleteArr)
        // // 从已选数组中删除
        // deleteArr.forEach(item => {
        //   const index = this.selectMemberList.findIndex(v => v.id === item.id)
        //   console.log('index', index)
        //   if (index > 0) {
        //     this.selectMemberList.splice(index, 1)
        //   }
        // })
      }
      this.hide()
    },
    // 接收人发生改变
    radioChange() {
      this.$emit('receiveChange', this.form.receive)
    },

    /** 与子组件交互 */
    // 点击查看
    // showDialog() {

    // },
    // 点击去选择按钮
    async  selectEmit() {
      this.commitType = 2
      // this.dialogVisible = true
      // 显示弹框组件
      this.$refs['receiveRef'].$children[0].show()
      // 回显已选数据
      setTimeout(() => {
        console.log('this.$refs.$children', this.$refs['receiveRef'].$refs['tableRef'])
        // this.$refs['receiveRef'].$refs['tableRef'].toggleSelection(this.selectMemberList)
      }, 500)
      console.log('form.receive ', this.form.receive)
      // 指定商会会员
      if (this.form.receive === 5) {
        this.columnConfig = cloneDeep(memberCountTableConfig)
        // this.columnConfig = [{ type: 'select' }]
        await this.getNumberList()
        if (this.id) {
          // 编辑模式，需要回显数据
          this.$refs['receiveRef'].$refs['tableRef'].toggleSelection(this.selectMemberList)
        }
      } else if (this.form.receive === 4) {
        this.columnConfig = cloneDeep(memberPageListConfig)
        await this.getNumberList()
        if (this.id) {
          // 编辑模式，需要回显数据
          this.$refs['receiveRef'].$refs['tableRef'].toggleSelection(this.selectMemberList)
        }
      }
    },
    // 已选表格
    tableSelect(val) {
      console.log('手动获取已选表格', this.$refs['receiveRef'].$refs['tableRef'].$refs['multipleTable'].selection)
      this.selectData = val
    },
    // 关闭弹框
    hide() {
      this.$refs['receiveRef'].$children[0].hide()
    },
    showRefDialog() {
      this.$refs['receiveRef'].$children[0].show()
    },
    // 点击查看按钮
    showDialog() {
      this.commitType = 1
      console.log('查看按钮')
      console.log('this.form.receive', this.form.receive)
      // 显示弹框组件

      // 指定商会会员
      if (this.form.receive === 5) {
        this.columnConfig = cloneDeep(memberCountTableConfig)
      } else if (this.form.receive === 4 && this.selectMemberList.length > 0) {
        this.showRefDialog()
        this.columnConfig = cloneDeep(memberPageListConfig)
        this.$refs['receiveRef'].$refs['tableRef'].toggleSelection(this.selectMemberList)
      } else if (this.form.receive === 3 || this.form.receive === 2 || this.form.receive === 1 || this.form.receive === -1) { // 指定部门 //指定职位
        this.showRefDialog()
        this.columnConfig = this.form.receive === -1 ? cloneDeep(memberTableConfig) : cloneDeep(memberPageListConfig)
        this.form.receive !== -1 && this.columnConfig.shift()
        this.getNumberList()
      } else {
        // this.form.receive === -1
        this.columnConfig = cloneDeep(memberTableConfig)
      }
      // else if () {
      //   this.showRefDialog()
      //   this.columnConfig = this.form.receive === 1 ? cloneDeep(memberPageListConfig) : cloneDeep(memberTableConfig)
      //   this.form.receive === 1 && this.columnConfig.shift()
      //   this.getNumberList()
      // }
    },
    // 分页的改变
    async change(val) {
      this.page = val.pageNum ? val.pageNum : this.page
      this.pageSize = val.pageSize ? val.pageSize : this.pageSize
      await this.getNumberList()
      if ((this.form.receive === 4 || this.form.receive === 5) && this.selectMemberList.length > 0) {
        // setTimeout(()=>{
        console.log('this.$refs.$children', this.$refs['receiveRef'].$refs['tableRef'])
        this.$refs['receiveRef'].$refs['tableRef'].toggleSelection(this.selectMemberList)
        // },500)
        // this.$refs['receiveRef'].$refs['tableRef'].toggleSelection(this.selectMemberList)
      }
      console.log('val', val)
    },
    // 部门人数递归累加
    sum(department) {
      if (!department || !department.length > 0) return 0
      let count = 0
      function sonSum(list) {
        list.forEach(item => {
          if (item.departmentRespList && item.departmentRespList.length > 0) {
          // 有子集就递归
            sonSum(item.departmentRespList)
          } else {
            count = count + item.peopleCount
          }
        })
      }
      sonSum(department)
      return count
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
.search-input {
  width: 280px;
  margin-bottom: 20px;
}
.my-input {
  width: 500px;
  display: flex;
}
.custom-tree-node {
  margin-left: 5px;
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
  max-height: 250px;
  overflow-y: scroll;
}
.tips {
  display: flex;
  flex-direction: column;
  color: #7f7f7f;
  line-height: 22px;
}
</style>
