import { message } from 'antd'
import router from '@/router'
import { initMenus } from '@/router/menus'
import store from '@/store'
import { TITLE } from '@/constant'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getPermission } from '@/utils/permission'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 重定向到登录页
const redirectToLogin = (to, from, next) => {
  next({
    path: '/login',
    query: {
      redirect: encodeURIComponent(to.fullPath)
    }
  })
}

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = to.meta.title ? `${to.meta.title} - ${TITLE}` : TITLE

  // determine whether the user has logged in
  const { roles = [], token } = store.state.user
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (roles.length) {
        getPermission(to.meta.id)
        next()
      } else {
        try {
          // get user info
          await Promise.all([store.dispatch('user/getInfo'), initMenus()])
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          message.error(typeof error === 'string' ? error : error.message)
          store.dispatch('user/resetToken')
          redirectToLogin(to, from, next)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token */
    if (whiteList.includes(to.path)) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      redirectToLogin(to, from, next)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
