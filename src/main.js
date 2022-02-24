import Vue from 'vue'
import ZkTable from 'vue-table-with-tree-grid'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/global.css'


Vue.component('tree-table', ZkTable)

Vue.config.productionTip = false

//引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI)

//引入axios
import axios from 'axios'
// import { config } from 'vue/types/umd'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//请求头拦截
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// Vue.prototype.$http = axios
// import VueAxios from 'vue-axios'

// Vue.use(VueAxios, axios)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
