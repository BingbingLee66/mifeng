<template>
  <el-dialog :title="`${isEdit ? '编辑' : '添加'}工具栏`" v-bind="$attrs" width="40%" v-on="$listeners" @open="onDialogShow">
    <el-form ref="form" :model="formModel" label-width="100px">
      <el-form-item
        label="一级菜单"
        prop="firstMenu"
        :rules="{
          required: true, message: '一级菜单不能为空', trigger: 'blur'
        }"
      >
        <el-select v-model="formModel.firstMenu" filterable :disabled="isEdit">
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
import { addToolBar, editToolBar, getMenuNoList } from '@/api/admin-user-menu'
import { cloneDeep, uniq } from 'lodash'

// 递归处理菜单树
const recursionHandleMenu = (menuList, level) => {
  const tempMenuList = []

  menuList.forEach(menu => {
    if (menu.children && menu.children.length) {
      menu.children = recursionHandleMenu(menu.children, 2)
    }

    tempMenuList.push({
      ...menu,
      menuName: menu.name || menu.menuName,
      menuId: menu.id || menu.menuId,
      menuRank: level,
      status: 1,
      menuUrl: menu.path || menu.menuUrl,
      icon: menu.meta?.icon || menu.icon,
    })
  })

  return tempMenuList
}

const FORM_MODEL = {
  firstMenu: '',
  secondMenu: [{ value: '' }]
}

export default {
  name: 'MaterialModal',
  props: {
    layout: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      allMenuList: recursionHandleMenu(this.$store.state.menu.addRoutes, 1) || [],
      firstMenuList: [],
      secondMenuList: [],
      formModel: FORM_MODEL,
    }
  },
  computed: {
    isEdit() {
      return !!this.form.firstMenu
    },
    usableFirstMenuList() {
      return this.isEdit ? this.allMenuList : this.allMenuList.filter(v => v.menuId !== this.formModel.firstMenu)
    },
    usableSecondMenuList() {
      const index = this.allMenuList.findIndex(v => v.menuId === this.formModel.firstMenu)
      const curSecondMenuList = this.allMenuList[index]?.children || []
      const disableSecMenuList = this.formModel.secondMenu.map(menu => menu.value)
      return this.isEdit ? curSecondMenuList : curSecondMenuList.filter(v => !disableSecMenuList.includes(v.menuId))
    },
  },
  watch: {
    'formModel.firstMenu'() {
      if (!this.isEdit) this.formModel.secondMenu = [{ value: '' }]
    }
  },
  methods: {
    onDialogShow() {
      this.formModel = cloneDeep(FORM_MODEL)
      if (this.isEdit) {
        this.formModel = cloneDeep(this.form)
      } else {
        this.fetchMenuNoList()
      }
    },

    async fetchMenuNoList() {
      try {
        const { data, state } = await getMenuNoList()
        if (!state) return
        this.allMenuList = recursionHandleMenu(data, 1)
      } catch (e) {
        console.error(e)
      }
    },

    hasDuplicates(val) {
      return uniq(val).length !== val.length
    },

    onConfirm() {
      this.$refs.form.validate(async valid => {
        if (!valid) return false

        this.firstMenuList = this.allMenuList.find(v => v.menuId === this.formModel.firstMenu)
        const tempMenuList = this.formModel.secondMenu.map(v => v.value)
        this.secondMenuList = this.firstMenuList.children.filter(v => tempMenuList.includes(v.menuId))

        if (this.hasDuplicates(tempMenuList)) return this.$message({ message: '二级菜单不能存在重复值', type: 'error' })

        const params = {
          ...this.firstMenuList,
          sort: this.layout.length,
          children: []
        }

        this.secondMenuList.forEach(item => {
          params.children.push({
            ...item,
            sort: tempMenuList.findIndex(v => v === item.menuId),
            id: this.formModel.secondMenu.find(v => v.value === item.menuId)?.id
          })
        })

        try {
          let editItem = {}
          let editParams = []

          if (this.isEdit) {
            editItem = this.layout.find(v => v.menuId === this.form.firstMenu) || {}
            editParams = [
              {
                ...editItem,
                children: params.children
              }
            ]
          }

          const { state, msg } = this.isEdit
            ? await editToolBar(editParams)
            : await addToolBar(params)
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
      this.allMenuList = recursionHandleMenu(this.$store.state.menu.addRoutes, 1) || []
      this.firstMenuList = []
      this.secondMenuList = []
      this.formModel = FORM_MODEL
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
