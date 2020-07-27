/* 初始化数据 */
const state = {
  token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
}

// 异步获取数据，commit给mutations，mutations改变state
const actions = {
  // 获取登录状态
  setLogin ({commit}, result) {
    commit('setToken', result)
  },
  delLogin ({commit}) {
    commit('delToken')
  }
}

const getters = {
  // 获取登录状态
  token: state => state.token
}

// 同步获取
const mutations = {
  setToken (state, result) {
    state.token = result
    localStorage.setItem('token', result)
  },
  delToken (state) {
    state.token = ''
    localStorage.removeItem('token')
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
