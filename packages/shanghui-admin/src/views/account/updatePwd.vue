<template>
  <panel>
    <div class="flex">
      <div>
        <img class="user-avatar" :src="userInfo.systemlogo || 'https://ysh-cdn.kaidicloud.com/prod/ysh/avatar.png'" />
        <div class="user-info mt-10">
          <UserOutlined class="mr2" style="font-size: 20px; color: #1890ff" />
          {{ userInfo.name }}
        </div>
        <div v-if="userInfo.chambername" class="user-info mt-10">
          <shop-two-tone style="font-size: 20px" />
          {{ userInfo.chambername }}
        </div>
      </div>
      <a-form
        :label-col="{ span: 8 }"
        ref="passwordForm"
        class="update-form"
        :model="passwordItem"
        :rules="rules"
        @finish="handleFinish"
      >
        <a-form-item label="新密码" name="newPassword">
          <a-input class="input-w" v-model:value="passwordItem.newPassword" type="password" />
        </a-form-item>
        <a-form-item label="重复密码" name="confirmPassword">
          <a-input class="input-w" v-model:value="passwordItem.confirmPassword" type="password" />
        </a-form-item>
        <a-form-item :wrapper-col="{ offset: 14, span: 16 }">
          <a-button type="primary" html-type="submit">确定</a-button>
        </a-form-item>
      </a-form>
    </div>
  </panel>
</template>
<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { updatePass } from '@/api/authority/user'

export default {
  setup() {
    const store = useStore()
    const userInfo = store.state.user
    const passwordItem = ref({
      newPassword: '',
      confirmPassword: ''
    })
    const validatePass = (rule, value) => {
      if (value === '') {
        return Promise.reject(new Error('请再次输入新密码！'))
      } else if (value !== passwordItem.value.newPassword) {
        return Promise.reject(new Error('两次密码不一致！'))
      } else {
        return Promise.resolve()
      }
    }
    const handleFinish = async () => {
      await updatePass({ newPass: passwordItem.value.newPassword })
      setTimeout(() => {
        store.dispatch('user/logout')
      }, 1000)
    }
    const rules = {
      newPassword: [
        { required: true, message: '请输入新密码！', trigger: 'blur' },
        { min: 5, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' }
      ],
      confirmPassword: [{ validator: validatePass, trigger: 'change' }]
    }
    return { userInfo, passwordItem, rules, handleFinish }
  }
}
</script>
<style lang="scss">
.user-avatar {
  @include size(200px, 200px);
}

.user-info {
  width: 200px;
  font-size: 18px;
}

.update-form {
  margin-top: 100px;
  margin-left: 50px;
  font-size: 18px;
}

.input-w {
  width: 300px;
}
</style>
