import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./pages/index')
    },
    {
      path: '/unknown-single',
      name: 'unknown-single',
      component: () => import('./pages/unknown-single')
    },
    {
      path: '/unknown-multiple',
      name: 'unknown-multiple',
      component: () => import('./pages/unknown-multiple')
    }
  ]
})
