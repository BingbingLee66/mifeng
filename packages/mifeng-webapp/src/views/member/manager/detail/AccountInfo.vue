<template>
  <Panel>
    <div class="block">
      <a-row>
        <h3 class="row-title">账号信息</h3>
      </a-row>
      <a-row>
        <a-col :span="1" class="wx-col col-title">ID</a-col>
        <a-col :span="2" class="wx-col">{{ member.id || '空' }}</a-col>
        <a-col :span="2" class="wx-col col-title">微信</a-col>
        <a-col :span="3" class="wx-col els-title">{{ member.uname || '未绑定' }}</a-col>
        <a-col :span="2" class="wx-col col-title">手机号</a-col>
        <a-col :span="3" class="wx-col">{{ userInfo.phone || '空' }}</a-col>
        <a-col :span="2" class="wx-col col-title">注册时间</a-col>
        <a-col :span="4" class="wx-col">{{ member.createdTs || '空' }}</a-col>
        <a-col :span="2" class="wx-col col-title">注册方式</a-col>
        <a-col :span="3" class="wx-col">{{ REGISTER_TYPE_MAP.get(member.registerType) || '空' }}</a-col>
      </a-row>
    </div>
    <div class="table_style mt20">
      <a-row>
        <h3 class="row-title">入会信息</h3>
        <a-button
          class="ml10"
          @click="
            $router.push({
              path: '/member/editor',
              query: { memberId: member.id }
            })
          "
          >修改</a-button
        >
        <a-button class="ml10" @click="handleAuthMember(member.authenticate)">
          {{ member.authenticate ? '取消身份认证' : '认证身份信息' }}
        </a-button>
      </a-row>
      <table width="100%" align="center" cellspacing="0">
        <tr align="center" height="45">
          <td width="100%" colspan="5">
            <div style="font-size: 18px; font-weight: 800">
              {{ member.chamberName }}
            </div>
          </td>
        </tr>
        <tr align="left" height="45">
          <td width="100%" colspan="5">
            <div style="margin-left: 15px; font-size: 18px; font-weight: 800">个人信息</div>
          </td>
        </tr>
        <tr align="center" height="45">
          <td width="24%" rowspan="15">
            <div class="head_portrait">
              <img v-if="userInfo.uavatar" :src="userInfo.uavatar" />
              <img v-else :src="defaultLogo" />
            </div>
          </td>
          <td width="8%">用户名</td>
          <td width="30%">{{ userInfo.uname }}</td>
          <td width="8%">注册电话</td>
          <td width="30%">{{ userInfo.phone }}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">联系电话</td>
          <td width="30%" colspan="3">
            <span v-for="(item, index) in telephones" :key="index"
              >{{ item.phone }}{{ index === telephones.length - 1 ? '' : ',' }}</span
            >
          </td>
        </tr>
        <tr v-for="(item, index) in userInfo.contactAddress" :key="index" align="center" height="45">
          <td width="8%">地址{{ index + 1 }}</td>
          <td width="30%" colspan="3">
            <div style="font-size: 18px">
              {{ item.province }}{{ item.city }}{{ item.area }}{{ item.street }}{{ item.address }}
            </div>
          </td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">性别</td>
          <td width="30%">
            <div v-if="userInfo.ugender == 1">男</div>
            <div v-if="userInfo.ugender == 2">女</div>
          </td>
          <td width="8%">邮箱</td>
          <td width="30%">{{ userInfo.email }}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">籍贯</td>
          <td width="30%">{{ userInfo.nativePlace }}</td>
          <td width="8%">生日</td>
          <td width="30%">{{ userInfo.birthday }}</td>
        </tr>
        <tr align="center" height="45">
          <td width="8%">个人简介</td>
          <td align="center" height="150" colspan="10">
            <span v-if="userInfo.introduction" class="text-btn-style" @click="openResumeDetail">详情</span>
            <span v-else> - - </span>
          </td>
        </tr>
      </table>
      <table width="100%">
        <tr align="left" height="45">
          <td width="100%" colspan="5">
            <div style="margin-left: 15px; font-size: 18px; font-weight: 800">入会信息</div>
          </td>
        </tr>
        <template v-if="member.type === 0">
          <tr height="45" align="center">
            <td width="8%">姓名</td>
            <td width="30%">{{ member.name }}</td>
            <td width="8%">手机号</td>
            <td width="30%">{{ member.phone }}</td>
          </tr>
          <tr height="45" align="center">
            <td width="8%">会内职位</td>
            <td width="30%">{{ member.postName }}</td>
            <td width="8%">所在部门</td>
            <td width="30%">{{ member.departmentName }}</td>
          </tr>
        </template>
        <template v-else-if="member.type === 1">
          <tr height="45" align="center">
            <td width="8%">企业名称</td>
            <td width="30%">{{ member.companyName }}</td>
            <td width="8%">联系人姓名</td>
            <td width="30%">{{ member.contactName }}</td>
          </tr>
          <tr height="45" align="center">
            <td width="8%">联系人电话</td>
            <td width="30%">{{ member.contactPhone }}</td>
            <td width="8%">会内职位</td>
            <td width="30%">{{ member.postName }}</td>
          </tr>
          <tr height="45" align="center">
            <td width="8%">所在部门</td>
            <td width="30%">{{ member.departmentName }}</td>
          </tr>
        </template>
        <template v-else-if="member.type === 2">
          <tr height="45" align="center">
            <td width="8%">社会组织名称</td>
            <td width="30%">{{ member.companyName }}</td>
            <td width="8%">社会组织logo</td>
            <td width="30%"><a-button type="link" @click="openOrganizationLogo">查看</a-button></td>
          </tr>
          <tr height="45" align="center">
            <td width="8%">联系人姓名</td>
            <td width="30%">{{ member.contactName }}</td>
            <td width="8%">联系人电话</td>
            <td width="30%">{{ member.contactPhone }}</td>
          </tr>
          <tr height="45" align="center">
            <td width="8%">会内职位</td>
            <td width="30%">{{ member.postName }}</td>
            <td width="8%">所在部门</td>
            <td width="30%">{{ member.departmentName }}</td>
          </tr>
          <tr height="45" align="center">
            <td width="8%">入会时间</td>
            <td width="30%">{{ member.joinedTs }}</td>
            <td width="8%">商会认证状态</td>
            <td width="30%">{{ member.authenticate ? '已认证' : '未认证' }}</td>
          </tr>
        </template>
      </table>
      <table v-if="member.type !== 2" width="100%">
        <tr align="left" height="45">
          <td width="100%" colspan="5">
            <div style="margin-left: 15px; font-size: 18px; font-weight: 800">其他信息</div>
          </td>
        </tr>
        <tr height="45" align="center">
          <td width="8%">入会时间</td>
          <td width="20%">{{ member.joinedTs }}</td>
          <td width="8%">营业执照</td>
          <td width="20%">
            <span v-if="member.license" class="text-btn-style" @click="() => setVisible(true)">详情</span>
            <span v-else> - - </span>
            <a-image
              :width="200"
              :style="{ display: 'none' }"
              :preview="{
                visible,
                onVisibleChange: setVisible
              }"
              :src="member.license"
            />
          </td>
          <td width="8%">企业职位</td>
          <td width="20%" style="border: 1px solid #dcdfe6">
            {{ member.companyPosition }}
          </td>
        </tr>
        <tr height="45" align="center">
          <td width="8%">商会认证状态</td>
          <td width="20%" style="border-right: 1px solid #dcdfe6">
            {{ member.authenticate ? '已认证' : '未认证' }}
          </td>
        </tr>
      </table>
    </div>
  </Panel>
</template>
<script>
import { defineComponent, reactive, toRefs, onMounted, createVNode, inject, ref } from 'vue'
import { getMemberDetail, authorizeMemberAuth, cancelAuthorizeMemberAuth } from '@/api/member/manager'
import { useRoute } from 'vue-router'
import { Modal } from 'ant-design-vue'
import useConstant from '@/constant/member-manager'
import { useImgUrl } from '@/hooks/useImgUrl'

export default defineComponent({
  setup() {
    const defaultLogo = `${useImgUrl('commons/nologo.png')}`
    const ckey = inject('ckey')
    const {
      params: { memberId = '', userId = '', ckey: routeCkey = '' }
    } = useRoute()
    const state = reactive({
      userInfo: {},
      member: {},
      telephones: [],
      contactAddress: []
    })
    const getMemberDetails = async () => {
      const { data } = await getMemberDetail({ memberId, wxUserId: userId, ckey: routeCkey })
      state.member = data.dtl ? { ...data.dtl[0] } : {}
      state.userInfo = data.userInfo ? { ...data.userInfo } : {}
      state.telephones = data.telephones ? [...data.telephones] : []
      state.contactAddress = data.contactAddress ? [...data.contactAddress] : []
    }

    const handleAuthMember = async isAuth => {
      const cancelContent = createVNode('div', {}, [
        createVNode('div', {}, '确定给该用户取消商会认证吗？'),
        createVNode('div', { style: 'color:#ccc;' }, '对已认证的用户取消认证，取消后，该用户将不再展示“商会认证”标识')
      ])
      const authContent = createVNode('div', {}, [
        createVNode('div', {}, '确定给该用户进行商会认证吗？'),
        createVNode('div', { style: 'color:red;' }, '商会认证主要是对该用户的个人信息、企业信息进行认证'),
        createVNode('div', { style: 'color:#ccc;' }, '1、认证后，该用户显示“商会认证”标识'),
        createVNode('div', { style: 'color:#ccc;' }, '2、认证后，可在【商协会成员-详情】页取消认证')
      ])
      Modal.confirm({
        title: isAuth ? '取消认证' : '商会认证',
        icon: '',
        content: isAuth ? cancelContent : authContent,
        async onOk() {
          await (isAuth ? cancelAuthorizeMemberAuth : authorizeMemberAuth)({
            ckey: ckey.value,
            wxUserId: state.member.wxUserId
          })
          getMemberDetails()
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    }

    const visible = ref(false)
    const setVisible = value => {
      visible.value = value
    }

    const openResumeDetail = () => {
      Modal.confirm({
        width: '800px',
        title: '个人履历',
        icon: '',
        content: state.userInfo.introduction,
        cancelButtonProps: { style: { display: 'none' } }
      })
    }

    const openOrganizationLogo = () => {
      Modal.confirm({
        width: '400px',
        title: '社会组织logo',
        icon: '',
        content: () => <img style="width:100%" src={state.member.socialOrganizationLogo} />,
        cancelButtonProps: { style: { display: 'none' } }
      })
    }

    onMounted(() => {
      getMemberDetails()
    })

    return {
      ...useConstant,
      ...toRefs(state),
      handleAuthMember,
      setVisible,
      visible,
      openResumeDetail,
      openOrganizationLogo,
      defaultLogo
    }
  }
})
</script>

<style lang="less">
.wx-col {
  border: 1px solid #dcdfe6;
  border-right: 0;
  border-radius: 0 !important;
  line-height: 40px;
  text-align: center;
}

.wx-col:last-child {
  border: 1px solid #dcdfe6;
}

.col-title {
  background-color: #b7f0ff;
}

.els-title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.row-title {
  font-size: 20px;
  font-weight: 800;
}

.head_portrait {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 20px auto;
  border-radius: 50%;
}

.head_portrait > img {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  top: 0;
  left: 0;
}

.text-detail {
  margin: 0 5%;
  line-height: 1.8;
  font-size: 15px;
}

.idcard-prv {
  border: solid 1px #ccc;
  border-radius: 10px;
  width: 90%;
  height: auto;
}

.d-btn-box {
  margin: 20px 0 40px 0;
  height: 10px;
}

.table_style {
  overflow: hidden;
  table {
    border-top: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    border-spacing: 0px;

    tr {
      td {
        border-bottom: 1px solid #dcdfe6;
        border-left: 1px solid #dcdfe6;
        // white-space: wrap;
      }
    }
  }
}
</style>
