import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/MainView.vue'
import Login from '../components/Login.vue'

// import store from '@/store/store'
Vue.use(VueRouter)

const routes = [{
    path: '/mainview',
    // name: 'mainview',
    component: Main,
    children: [
      {
        path: '/userInfo',
        name: 'userInfo',
        component: () => import(/* webpackChunkName: "main" */ '../views/UserInfo.vue')
      },   
      // {
      //   path: '/',
      //   redirect: {name: 'assetSrch'}
      //   // path: '/',
      //   // name: 'assetSrch',
      //   // component: () => import(/* webpackChunkName: "main" */ '../views/AssetSrch.vue')
      // },
      {
        path: '/',
        redirect: {name: 'mainStystem'}
        // path: '/',
        // name: 'assetSrch',
        // component: () => import(/* webpackChunkName: "main" */ '../views/AssetSrch.vue')
      }, 
      {
        path: '/mainStystem',
        name: 'mainStystem',
        component: () => import(/* webpackChunkName: "main" */ '../views/MainSystem.vue')
      },
      {
        path: '/assetSrch',
        name: 'assetSrch',
        component: () => import(/* webpackChunkName: "main" */ '../views/AssetSrch.vue')
      },
      {
        path: '/assetClassify',
        name: 'assetClassify',
        component: () => import(/* webpackChunkName: "main" */ '../views/AssetClassify.vue')
      },
      {
        path: '/aroList',
        name: 'aroList',
        component: () => import(/* webpackChunkName: "main" */ '../views/AroList.vue')
      },
      {
        path: '/userApply',
        name: 'userApply',
        component: () => import(/* webpackChunkName: "main" */ '../views/UserApply.vue')
      },
      {
        path: '/assetDepreciation',
        name: 'assetDepreciation',
        component: () => import(/* webpackChunkName: "main" */ '../views/AssetDepreciation.vue')
      },
      {
        path: '/personApply',
        name: 'personApply',
        component: () => import(/* webpackChunkName: "main" */ '../views/PersonApply.vue')
      },
      {
        path: '/personAsset',
        name: 'personAsset',
        component: () => import(/* webpackChunkName: "main" */ '../views/PersonAsset.vue')
      },
      {
        path: '/userList',
        name: 'userList',
        component: () => import(/* webpackChunkName: "main" */ '../views/UserList.vue')
      },
      {
        path: '/userAroList',
        name: 'userAroList',
        component: () => import(/* webpackChunkName: "main" */ '../views/UserAroList.vue')
      },
      {
        path: '/assetTypeRate',
        name: 'assetTypeRate',
        component: () => import(/* webpackChunkName: "main" */ '../views/AssetTypeRate.vue')
      },
      {
        path: '/assetWorthless',
        name: 'assetWorthless',
        component: () => import(/* webpackChunkName: "main" */ '../views/AssetWorthless.vue')
      },
      {
        path: '/404',
        name: '404',
        component: () => import(/* webpackChunkName: "main" */ '../views/404.vue')
      },
    ]
  },
  {
    path: '/',
    redirect: {
        name: 'login'
    }
    // path: '/',
    // name: 'login',
    // component: Login
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },

]

const router = new VueRouter({
  mode: 'history',
  routes
})

// let whilelist = [
//     '/login'
// ]
  
// router.beforeEach((to, from ,next)=>{
//   //  如果没有登陆状态需要登陆
//   let token = store.getters.getToken;
//   if(!token ){
//     next({name: 'login'})
//   } else {
//     next()
//   }
// })

router.beforeEach((to, from, next) => {
  if (to.path === '/login') next()
  const tokenStr = window.sessionStorage.getItem('token')
  // 增加判断条件
  if (!tokenStr && to.path !== '/login') return next('/login')
  next()
})

export default router 