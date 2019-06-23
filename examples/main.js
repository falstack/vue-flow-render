import Vue from 'vue'
import App from './App.vue'
import Render from '../src/render.js'

Vue.config.productionTip = false
Vue.component('v-render', Render)

new Vue({
  render: h => h(App)
}).$mount('#app')
