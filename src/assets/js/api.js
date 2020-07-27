/**
 * 后台访问接口
 * @author lixiaopan
 * @date 2018/5/25
 */
'use strict'
import Vue from 'vue'
import qs from 'qs'
import axios from 'axios'
import store from '../../vuex/store'
import router from '../../router'
// 接口根地址
/* eslint-disable no-undef */
var baseUrl = baseApiUrl
// axios 配置
axios.defaults.timeout = 100000
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 添加请求拦截器，在请求头中加token
// 执行 POST 请求
function post (opt) {
  return http('post', opt)
}

// 执行 GET 请求
function get (opt) {
  return http('get', opt)
}

function post2Form (opt) {
  return http('post2Form', opt)
}
// 执行无JSON格式的 GET 请求
function getData (opt) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: baseApiUrl + opt.url,
      params: opt.params
    }).then(
      res => {
        resolve(res.data)
      }
    )
  })
}

function http (method, opt) {
  return new Promise((resolve, reject) => {
    let config = {
      method: method,
      url: baseUrl + opt.url
    }
    if (opt.all) {
      config = {
        method: method,
        url: opt.url
      }
    }
    if (method === 'get') {
      config = Object.assign({params: opt.params}, config)
    } else if (method === 'post') {
      let headOpt = {
        'Content-Type': 'application/json'
      }
      if (config.url.indexOf('/login') === -1 && localStorage.getItem('token')) {
        headOpt = Object.assign({Authorization: 'Bearer ' + localStorage.getItem('token')}, headOpt)
      }
      config = Object.assign({data: opt.params || {}, headers: headOpt}, config)
      // config = Object.assign({data: qs.stringify(opt.params)}, config)
    } else {
      config.method = 'post'
      let headOpt = {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
      config = Object.assign({data: qs.stringify(opt.params) || {}, headers: headOpt}, config)
    }
    axios(config)
      .then(res => {
        if (res.data && (res.data.error.returnCode === 0 || res.data.error.returnCode === 200)) {
          resolve(res.data)
        } else if (res.data.error.returnCode === 10003) {
          store.dispatch('delLogin')
          router.replace({
            path: '/',
            query: {redirect: router.currentRoute.fullPath} // 登录成功后跳入浏览的当前页面
          })
        } else if (opt.url.indexOf('/app') !== -1) {
          resolve(res.data)
        } else {
          let erMsg = res.data.error.returnMessage
          Vue.prototype.$message({
            message: erMsg,
            type: 'info'
          })
          errorhandle(erMsg, reject, opt.error)
        }
      }, err => {
        console.log(opt.ctx)
        errorhandle(err, reject, opt.error)
      })
      .catch((err) => {
        console.log(opt.ctx)
        errorhandle(err, reject, opt.error)
      })
  })
}

function upload (opt) {
  return new Promise((resolve, reject) => {
    let config = {
      method: 'POST',
      url: baseUrl + opt.url
    }
    if (opt.all) {
      config = {
        method: 'POST',
        url: opt.url
      }
    }
    config = Object.assign({data: opt.params || {}, headers: {'Content-Type': 'multipart/form-data'}}, config)
    axios(config).then(res => {
      resolve(res.data)
    }, err => {
      console.log(opt.ctx)
      errorhandle(err, reject, opt.error)
    }).catch((err) => {
      console.log(opt.ctx)
      errorhandle(err, reject, opt.error)
    })
  })
}

function errorhandle (err, reject) {
  console.error('请求失败！', err)
  reject(err)
}

export default {
  post,
  get,
  post2Form,
  getData,
  upload
}
