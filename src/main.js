import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/css/icons.min.css';

import wysiwyg from "vue-wysiwyg";

import VueToastr from "vue-toastr";
import api from './services/api';
import VueTimeago from 'vue-timeago'
import datePicker from 'vue-bootstrap-datetimepicker';
import "vue-wysiwyg/dist/vueWysiwyg.css";
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'



import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
Vue.use(datePicker);
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

//use vue toastr
Vue.use(VueToastr);


Vue.use(wysiwyg, {});
//use date ago
//Vue.use(VueTimeago )

Vue.use(VueTimeago, {
  locale: 'en'});


Vue.config.productionTip = false

Vue.prototype.$http = api; 
api.defaults.timeout = 10000;

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.common["Authorization"] = 'Bearer '+token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

new Vue({
  router,
  
  render: h => h(App),
  mounted() {
    // You are able to access plugin from everywhere via this.$toastr
    this.$toastr.defaultPosition = "toast-top-right";
   
  }
}).$mount('#app')
