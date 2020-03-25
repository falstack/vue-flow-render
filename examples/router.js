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
      path: '/known-single-for',
      name: 'known-single-for',
      component: () => import('./pages/known-single-for')
    },
    {
      path: '/known-single-prop',
      name: 'known-single-prop',
      component: () => import('./pages/known-single-prop')
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
    },
    {
      path: '/vue-virtual-scroll-list',
      name: 'vue-virtual-scroll-list',
      component: () => import('./pages/vue-virtual-scroll-list')
    },
    {
      path: '/normal-list',
      name: 'normal-list',
      component: () => import('./pages/normal.vue')
    }
  ]
})
