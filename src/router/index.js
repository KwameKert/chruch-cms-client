import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth  from '../layouts/Auth';
import Dashboard from '../views/Dashboard';
import Default from '../layouts/Default';
import Login from '../views/Login';

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: Auth,
    children: [
      {path: '/', component:Login},
      {path: '/login', component:Login}
    ]
  },
  {
    path: '',
    component: Default,
    children: [
      {path: '/dashboard', component:Dashboard}
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
