<template>
  <div class="nav-info">
    <a-breadcrumb v-show="breadcrumbs.length" class="breadcrumb">
      <a-breadcrumb-item v-for="(v, i) of breadcrumbs" :key="i">
        <a
          v-if="i !== breadcrumbs.length - 1 && v.fullPath"
          href="javascript:void(0);"
          @click="$router.push(v.fullPath)"
        >
          {{ v.name }}
        </a>
        <template v-else> {{ v.name }}</template>
      </a-breadcrumb-item>
    </a-breadcrumb>
    <div class="main-title">{{ $route.meta.title || $route.name }}</div>
  </div>
</template>

<script>
import { Breadcrumb } from 'antd'
import { breadcrumbs } from '@/utils/breadcrumbs'
export default {
  components: {
    ABreadcrumb: Breadcrumb,
    ABreadcrumbItem: Breadcrumb.Item
  },
  setup() {
    return {
      breadcrumbs
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-info {
  padding: 16px 32px;
  background-color: #fff;
}
</style>
