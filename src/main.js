import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import axios from '@/utils/axios'
import router from './router/index.js'
// import VueAxios from 'vue-axios'
import VueCropper from 'vue-cropper'
import lottie from 'vue-lottie';


Vue.component('lottie', lottie)

Vue.use(VueCropper)
Vue.prototype.$axios = axios;//this.$axios使用
// Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.use(ElementUI);

import store from '@/store/store';

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
