<template>
  <div class="el-container">
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="headone">
          <img src="../assets/logo.png" alt="" class="logo" />
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click="loginout">退出</el-button>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="island ?'64px' :'200px' ">
          <div class="toggle-button" @click="toggle">|||</div>
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
             :unique-opened='true'
             :collapse='island'
             :collapse-transition='false'
             :router='true'
             :default-active='activePath'
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <!-- 一级菜单的模板区 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsobj[item.id]"></i>
                <!-- 文本区域 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+subitem.path"
                v-for="subitem in item.children"
                :key="subitem.id"
                @click="saveNavState('/'+subitem.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本区域 -->
                  <span>{{ subitem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体部分 -->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      iconsobj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-fold',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-data-analysis'
      },
      island:false,
      //被激活的链接地址
      activePath:''
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath')
    // console.log(this.activePath);
 
  },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.menulist = res.data;
      }
      // console.log(res);
    },
    //折叠与展开按钮
    toggle(){
      this.island= !this.island
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
  components: {},
};
</script>

<style scoped lang="less">
// * {
//   margin: 0;
//   padding: 0;
// }

.el-container {
  height: 100%;
}
.el-header {
  background-color: rgb(54, 61, 64);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
}
.headone {
  display: flex;
}
.logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.headone span {
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-left: 15px;
}
.el-aside {
  background-color: rgb(49, 55, 67);

}
.el-menu{
  border-right: none;
}
.el-main {
  background-color: rgb(233, 237, 241);
}
  .toggle-button{
    background-color: #4a5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
