<template>
  <div class="data-board">
    <div v-if="title || defineList.length" class="data-title">
      <span class="title">{{ title }}</span>
      <DataDefinition :define-list="defineList" />
    </div>
    <div class="data-card">
      <template v-for="(v,i) of list">
        <div :key="`cell${i}`" class="card-cell">
          <span class="card-value" v-html="v.value||0" />
          <span class="card-name" v-html="v.name||''" />
        </div>
        <div v-if="i < list.length - 1 && !v.hideBorder" :key="`line${i}`" class="line" />
      </template>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    DataDefinition: () => import('@/components/statistic/DataDefinition')
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    defineList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return { }
  },
}
</script>

<style lang="scss" scoped>
.data-title {
  height:20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.title {
  font-weight: 600;
  font-size: 18px;
  float: left;
}
.data-card {
  width: 100%;
  height: 120px;
  border-radius: 2px;
  border: 1px solid #ccc;
  display: flex;
}

.card-cell {
  height: 100%;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.card-value{
  margin-bottom: 10px;
  color: #008000;
  font-weight: 600;
}

.line {
  &::after {
    content: '';
    display: block;
    width: 1px;
    height: 100%;
    border-right: 1px solid #ccc;
  }
}

</style>
