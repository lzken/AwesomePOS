import Vue from 'vue'
import Router from 'vue-router'
import Pos from '@/components/view/Pos'

Vue.use(Router)

export default new Router({
  made:history,
  routes: [
    {
      path: '/',
      name: 'Pos',
      component: Pos
    }
  ]
})
