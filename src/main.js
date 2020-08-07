// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/style/reset.css'
import MintUI from 'mint-ui'
import '../node_modules/mint-ui/lib/style.min.css' // mint-ui
import store from './vuex/store'
import * as filters from './assets/js/filter'
import 'lib-flexible/flexible'
// import Vconsole from 'vconsole'

Vue.use(MintUI)
// let vConsole = new Vconsole()
// Vue.use(vConsole)

// 遍历过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
// Vue.use(ElementUI)
Vue.prototype.message = function (msg, type) { // 弹出提示信息
  this.$message({
    message: msg,
    type: type
  })
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
