import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Annotation from '../views/Annotation'
import uploadImage from '../views/uploadImage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  },
  {
    path: '/annotate',
    name: 'annotate',
    component: Annotation
  },
  {
    path: '/uploadImage',
    name: 'uploadImage',
    component: uploadImage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
