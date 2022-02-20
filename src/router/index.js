import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect: '/login'
  },

  //redirect(重定向，让用户访问/根，重定向到login登录页面)
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:()=>import('@/components/Home.vue')
  }
]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
    //to 代表将要访问的路径
    //from 代表从哪个路径跳转而来
    //next 是一个函数，代表放行
    //next 有两种调用方式 next()直接放行 next('/')强制跳转路径

//如果访问的是登陆页面直接放行
    if(to.path === '/login'){
      return next();
    }
    
    //获取token
    const tokensess = window.sessionStorage.getItem('token')

    if(!tokensess){
      return next('/login')
    }
    next()
})



export default router
