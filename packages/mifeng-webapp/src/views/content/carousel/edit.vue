<template>
  <Panel :hasPadding="false">
    <a-form class="form" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }" :model="formModel" @finish="onFinish">
      <a-form-item label="关联内容" name="type">
        <a-select v-model:value="formModel.type" class="input-item" placeholder="请选择">
          <a-select-option :value="1"> 文章 </a-select-option>
          <a-select-option :value="2"> 商品 </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="formModel.type === 1" label="文章标题" name="articleTitle" :rules="formRules.articleTitle">
        <a-select
          class="input-item"
          v-model:value="formModel.articleTitle"
          show-search
          placeholder="请选择"
          :default-active-first-option="false"
          :filter-option="false"
          :options="options"
          @search="onSearch"
          @change="onChange"
        >
        </a-select>
      </a-form-item>
      <a-form-item v-if="formModel.type !== 1" :label="typeName" name="articleId" :rules="formRules.articleId">
        <a-input autocomplete="off" v-model:value="formModel.articleId" class="input-item" placeholder="请输入" />
      </a-form-item>
      <a-form-item label="轮播图标题" name="title" :rules="formRules.title">
        <a-input
          autocomplete="off"
          v-model:value="formModel.title"
          class="input-item"
          :maxlength="formModel.type === 1 ? 60 : 30"
          :placeholder="formModel.type === 1 ? '60字内' : '30字内'"
          show-count
        />
      </a-form-item>
      <a-form-item label="上传图片" name="img" :rules="formRules.img">
        <CropperUpLoad
          v-model:url="formModel.img"
          :limit="1"
          :pattern="new RegExp(/\.(?:png|jpg|jpeg)$/i)"
          :autoCropWidth="702"
          :autoCropHeight="276"
          isArticleCoverImg
        />
        <div class="input-item">建议尺寸：702x276 支持jpg、png</div>
      </a-form-item>
      <a-row class="form-footer">
        <a-col :span="8" />
        <a-col :span="16">
          <a-button type="primary" class="form-btn" html-type="submit">发布</a-button>
          <a-button class="form-btn" @click="$router.back()">取消</a-button>
        </a-col>
      </a-row>
    </a-form>
  </Panel>
</template>

<script>
import { computed, defineComponent, defineAsyncComponent, inject, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { checkUpperLimit, saveBanner, getArticleTitle } from '@/api/content/bannerImg'
import { BANNER_DETAIL } from '@/constant'
import { getChamberContentList } from '@/api/content/article'
export default defineComponent({
  components: {
    CropperUpLoad: defineAsyncComponent(() => import('@/components/upload/cropper-uploader/index.vue'))
  },
  setup() {
    const router = useRouter()
    const ckey = inject('ckey')

    const bannerDetail = JSON.parse(localStorage.getItem(BANNER_DETAIL) || '{}')
    bannerDetail.type = bannerDetail.type || undefined
    const formModel = reactive(
      Object.assign(
        {
          type: '',
          articleTitle: bannerDetail?.title || undefined,
          articleId: '',
          title: '',
          img: ''
        },
        bannerDetail
      )
    )
    const options = ref()

    async function getArticleList() {
      const { data } = await getArticleTitle({ ckey: ckey.value })
      options.value = data.map(item => {
        return {
          value: item.id,
          label: item.title
        }
      })
    }

    const onChange = (value, option) => {
      formModel.articleId = option.value
      formModel.title = option.label
    }

    const onSearch = async value => {
      if (!value) return getArticleList()
      value = value.replace(/'/g, '')
      const params = {
        page: 1,
        pageSize: 100,
        title: value,
        ckey: ckey.value,
        contentModuleId: 5,
        contentColumnId: -1,
        status: -1
      }
      const {
        data: { data }
      } = await getChamberContentList(params)
      options.value = data.list.map(item => {
        return {
          value: item.id,
          label: item.title
        }
      })
    }

    getArticleList()
    return {
      formModel,
      formRules: {
        articleId: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value) => {
              if (!value) return Promise.reject(new Error('ID不能为空'))
              if (!/^$|^([1-9]\d*)$/.test(value)) return Promise.reject(new Error('必须是大于0的整数'))
              return Promise.resolve()
            }
          }
        ],
        articleTitle: { required: true, trigger: 'blur', message: '文章标题不能为空' },
        title: [
          {
            required: true,
            trigger: 'blur',
            // message: '轮播图标题不能为空'
            validator: (rule, value) => {
              if (!value.replace(/\s*/g, '')) return Promise.reject(new Error('轮播图标题不能为空'))
              return Promise.resolve()
            }
          }
        ],
        img: [{ required: true, message: '图片必须上传', trigger: 'blur' }]
      },
      typeName: computed(() => {
        const { type } = formModel
        if (type === 2) return '商品ID'
        return '活动ID'
      }),
      async onFinish() {
        // 新增则需要校验轮播图数量是否大于10张
        if (!formModel.id) {
          const { data, state, msg } = await checkUpperLimit({
            ckey: ckey.value
          })
          if (state !== 1) throw msg
          if (data.count >= 10) return message.warn('轮播图数量已达上限10张')
        }

        const { state } = await saveBanner({
          ...formModel,
          ckey: ckey.value,
          type: formModel.type || 0,
          clientType: 0
        })
        if (state === 1) router.go(-1)
      },
      options,
      onChange,
      onSearch
    }
  }
})
</script>

<style lang="scss" scoped>
.form {
  padding: 32px;

  :deep(.ant-form-item) {
    margin-bottom: 32px;

    &.ant-form-item-with-help {
      margin-bottom: 8px;
      transition: none;
    }
  }
}
.input-item {
  max-width: 468px;
}
.form-footer {
  margin: 32px 0;
}
.form-btn {
  margin-right: map-get($map: $space, $key: sm);
}
</style>
