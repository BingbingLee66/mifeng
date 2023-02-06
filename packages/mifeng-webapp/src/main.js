import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import plugins from '@/plugins'
import '@/router/permission'
import '@/utils/breadcrumbs'
import '@/styles/common.scss'
import GlobalComponents from '@/components'
import VCharts from 'vue-echarts'
import { use } from 'echarts/core'
import { DataCollect } from '@/utils/dataCollect'

// 手动引入 ECharts 各模块来减小打包体积
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

DataCollect.Config.init()

const app = createApp(App)

app.component('VChart', VCharts)

app.use(plugins).use(GlobalComponents).use(store).use(router).mount('#app')
