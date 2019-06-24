import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Render from '../src/render.js'
import ItemFactory from './item-factory'

Vue.config.productionTip = false
Vue.component('v-render', Render)
Vue.prototype.$factory = ItemFactory

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

