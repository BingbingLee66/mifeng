<template>
  <el-dialog title="添加工具栏" v-bind="$attrs" width="40%" v-on="$listeners" @open="onDialogShow">
    <el-form ref="form" :model="formModel" label-width="100px">
      <el-form-item
        label="一级菜单"
        prop="firstMenu"
        :rules="{
          required: true, message: '一级菜单不能为空', trigger: 'blur'
        }"
      >
        <el-select v-model="formModel.firstMenu" filterable>
          <el-option v-for="item of usableFirstMenuList" :key="item.id" :label="item.menuName" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item
        v-for="(menu, index) in formModel.secondMenu"
        :key="menu.key"
        :label="index === 0 ? '二级菜单' : ''"
        :prop="'secondMenu.' + index + '.value'"
        :rules="{
          required: true, message: '二级菜单不能为空', trigger: 'blur'
        }"
      >
        <div class="flex-x">
          <el-select v-model="menu.value" filterable>
            <el-option v-for="item of usableSecondMenuList" :key="item.id" :label="item.menuName" :value="item.id" />
          </el-select>
          <el-button v-if="index || menu.length" style="margin-left: 10px;" @click.prevent="removeSecondMenu(menu)">删除</el-button>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="text" @click="addSecondMenu"> <i class="el-icon-plus" />添加二级菜单</el-button>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addToolBar, getMenuNoList } from '@/api/admin-user-menu'

export default {
  name: 'MaterialModal',
  props: {
    layout: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      allMenuList: this.$store.state.menu.addRoutes.map(v => {
        return {
          ...v,
          menuName: v.name,
          menuId: v.id,
          menuRank: 1,
          status: 1,
          menuUrl: v.path,
          icon: v.meta.icon,
        }
      }) || [],
      firstMenuList: [],
      secondMenuList: [],
      formModel: {
        firstMenu: '',
        secondMenu: [{ value: '' }]
      },

    }
  },
  computed: {
    usableFirstMenuList() {
      return this.allMenuList.filter(v => v.id !== this.formModel.firstMenu)
    },
    usableSecondMenuList() {
      const index = this.allMenuList.findIndex(v => v.id === this.formModel.firstMenu)
      const curSecondMenuList = this.allMenuList[index]?.children || []
      const disableSecMenuList = this.formModel.secondMenu.map(menu => menu.value)
      return curSecondMenuList.filter(v => !disableSecMenuList.includes(v.id))
    },
  },
  watch: {
    'formModel.firstMenu'() {
      this.formModel.secondMenu = [{ value: '' }]
    }
  },
  methods: {
    onDialogShow() {
      this.fetchMenuNoList()
    },

    async fetchMenuNoList() {
      try {
        const { data, state } = await getMenuNoList()
        if (!state) return
        this.allMenuList = data
      } catch (e) {
        console.error(e)
      }
    },

    onConfirm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false

        this.firstMenuList = this.allMenuList.find(v => v.id === this.formModel.firstMenu)
        const tempMenuList = this.formModel.secondMenu.map(v => v.value)
        this.secondMenuList = this.firstMenuList.children.filter(v => tempMenuList.includes(v.id))

        const params = {
          ...this.firstMenuList,
          sort: this.layout.length,
          children: []
        }

        this.secondMenuList.forEach(item => {
          params.children.push({
            ...item,
            sort: tempMenuList.findIndex(v => v === item.id),
          })
        })

        try {
          const { state, msg } = await addToolBar(params)
          if (!state) return
          this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
          this.onClose()
          this.$refs.form.resetFields()
          this.$emit('success')
        } catch (e) {
          console.error(e)
        }
      })
    },

    onClose() {
      this.$emit('update:visible', false)
    },

    addSecondMenu() {
      this.formModel.secondMenu.push({
        value: '',
        key: Date.now()
      })
    },

    removeSecondMenu(item) {
      const index = this.formModel.secondMenu.indexOf(item)
      if (index !== -1) {
        this.formModel.secondMenu.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
