import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
/* 接入百度统计 */
router.beforeEach(async (to, from, next) => {
  if (to.path) {
    if (window._hmt) {
      window._hmt.push(['_trackPageview', '/#' + to.fullPath])
    }
  }
  next()
})
export default router
