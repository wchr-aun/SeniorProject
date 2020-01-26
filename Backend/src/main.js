import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ImageUploader from 'vue-image-upload-resize'
import ProgressBar from 'vuejs-progress-bar'
import VueResource from "vue-resource"
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(VueResource);
Vue.use(ProgressBar)
Vue.use(ImageUploader);
Vue.use(Buefy)
Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) }
}).$mount('#app')
