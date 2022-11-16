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
          <el-option v-for="item of usableFirstMenuList" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
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
            <el-option v-for="item of usableSecondMenuList" :key="item.menuId" :label="item.menuName" :value="item.menuId" />
          </el-select>
          <el-button v-if="index || menu.length" style="margin-left: 10px;" @click.prevent="removeSecondMenu(menu)">删除</el-button>
        </div>
      </el-form-item>

      <el-form-item v-if="usableSecondMenuList.length">
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
    // 递归处理菜单树
    const recursionHandleMenu = (menuList, level) => {
      const tempMenuList = []

      menuList.forEach(menu => {
        if (menu.children && menu.children.length) {
          menu.children = recursionHandleMenu(menu.children, 2)
        }

        tempMenuList.push({
          ...menu,
          menuName: menu.name,
          menuId: menu.id,
          menuRank: level,
          status: 1,
          menuUrl: menu.path,
          icon: menu.meta.icon,
        })
      })

      return tempMenuList
    }

    return {
      allMenuList: recursionHandleMenu(this.$store.state.menu.addRoutes, 1) || [],
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
      return this.allMenuList.filter(v => v.menuId !== this.formModel.firstMenu)
    },
    usableSecondMenuList() {
      const index = this.allMenuList.findIndex(v => v.menuId === this.formModel.firstMenu)
      const curSecondMenuList = this.allMenuList[index]?.children || []
      const disableSecMenuList = this.formModel.secondMenu.map(menu => menu.value)
      return curSecondMenuList.filter(v => !disableSecMenuList.includes(v.menuId))
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

        this.firstMenuList = this.allMenuList.find(v => v.menuId === this.formModel.firstMenu)
        const tempMenuList = this.formModel.secondMenu.map(v => v.value)
        this.secondMenuList = this.firstMenuList.children.filter(v => tempMenuList.includes(v.menuId))

        const params = {
          ...this.firstMenuList,
          sort: this.layout.length,
          children: []
        }

        this.secondMenuList.forEach(item => {
          params.children.push({
            ...item,
            sort: tempMenuList.findIndex(v => v === item.menuId),
          })
        })

        try {
          const { state, msg } = await addToolBar(params)
          if (!state) return
          this.$message({ message: msg, type: state === 1 ? 'success' : 'error' })
          this.onClose()
          this.$emit('success')
        } catch (e) {
          console.error(e)
        }
      })
    },

    onClose() {
      this.$emit('update:visible', false)
      this.$refs.form.resetFields()
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
