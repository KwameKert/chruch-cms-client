import Vue from 'vue'
import VueRouter from 'vue-router'
import Auth  from '../layouts/Auth';
import Dashboard from '../views/Dashboard';
import Verse from '../views/Verse';
import Sermon from '../views/Sermon';
import Event from '../views/Event';
import Default from '../layouts/Default';
import Login from '../views/Login';

Vue.use(VueRouter)

function guardMyroute(to, from, next)
{
 var isAuthenticated= false;
//this is just an example. You will have to find a better or 
// centralised way to handle you localstorage data handling 
if(localStorage.getItem('user') )
  isAuthenticated = true;
 else
  isAuthenticated= false;
 if(isAuthenticated) 
 {
  next(); // allow to enter route
 } 
 else
 {
  next('/login'); // go to '/login';
 }
}


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
      {path: '/dashboard', component:Dashboard},
      {path: '/verse', component:Verse},
      {path: '/sermon', component:Sermon},
      {path: '/event', component:Event}
    ],
    beforeEnter : guardMyroute
    
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
