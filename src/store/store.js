import Vue from 'vue'
import Vuex from 'vuex'
//import createPersistedstate from 'vuex-persistedstate'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 设置插件 默认设置到localStorage
    // plugins: [createPersistedstate()],
    // 数据
    state: {
        token: ''
    },
    // 操作
    mutations: {
        setToken(state, token) {
            // 将外部传递过来的token，放到公共类
            state.token = token;
            // window.localStorage 本地存储
            window.sessionStorage.setItem("token", token);
        }
    },
    // 获取状态中的属性值
    getters: {
        getToken: function (state) {
            if (!state.token) {
                return window.sessionStorage.getItem("token")
            }
            return state.token;
        }
    }

})

export default store;