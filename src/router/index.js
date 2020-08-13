import Vue from 'vue'
import Router from 'vue-router'
import { UrlSearch } from '@/assets/js/utils'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
const lottery = () => import(/* webpackChunkName: "lottery" */ '@/components/page/lottery/lottery')
const register = () => import(/* webpackChunkName: "register" */ '@/components/page/lottery/registered')
const invite = () => import(/* webpackChunkName: "invite" */ '@/components/page/lottery/invite')
const error = () => import(/* webpackChunkName: "error" */ '@/components/page/lottery/error')
const purchase = () => import(/* webpackChunkName: "purchase" */ '@/components/page/purchase')
const buyProduct = () => import(/* webpackChunkName: "purchase" */ '@/components/page/purchase/buy-product')

const router = new Router({
  mode: 'history',
  base: '/h5/',
  routes: [
    {
      path: '/',
      name: 'login',
      component: lottery,
      meta: {
        isNeedLogin: false,
        isNeedParam: true
      }
    },
    {
      path: '/lottery',
      name: 'lottery',
      component: lottery,
      meta: {
        isNeedLogin: false,
        isNeedParam: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: register,
      meta: {
        isNeedLogin: false
      }
    },
    {
      path: '/invite',
      name: 'invite',
      component: invite,
      meta: {
        isNeedLogin: false,
        isNeedParam: true
      }
    },
    {
      path: '/err-page',
      name: 'err-page',
      component: error,
      meta: {
        isNeedLogin: false
      }
    },
    {
      path: '/purchase',
      name: 'purchase',
      component: purchase,
      meta: {
        isNeedLogin: false,
        isNeedParam: false
      }
    },
    {
      path: '/buy-product',
      name: 'buy-product',
      component: buyProduct,
      meta: {
        isNeedLogin: false,
        isNeedParam: false
      }
    }
  ]
})
// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if (to.meta.isNeedLogin) {
    let token = localStorage.getItem('token')
    if (!token || token === 'null' || token === 'undefined') {
      next('/')
    } else {
      next()
    }
  } else {
    if (to.meta.isNeedParam) {
      let token = new UrlSearch().token // 从url中获取
      let prizeCode = new UrlSearch().prizeCode // 从url中获取
      if (!token || !prizeCode) {
        next('/err-page')
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

export default router
