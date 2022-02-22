<template>
  <div class="login_contaion">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 表单输入框区域 -->
      <el-form
        label-width="0"
        class="login_form"
        :model="form"
        :rules="rules"
        ref="loginformreset"
      >
        <!-- 登录 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入账号"
            prefix-icon="el-icon-user-solid"
            v-model="form.username"
            clearable
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="form.password"
            show-password
          ></el-input>
        </el-form-item>
        <!-- 登录 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 重置 -->
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      form: {
        username: "admin",
        password: "123456",
      },
      rules: {
        //验证账号
        username: [
          { required: true, message: "请输入你的账号", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        //验证密码
        password: [
          { required: true, message: "请输入你的密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    reset() {
      // console.log(this);
      this.$refs.loginformreset.resetFields();
    },
    login() {
      //表单登录预验证
      this.$refs.loginformreset.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.form);
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message({
            type:'error',
            message:'登陆失败',
            showClose:true,
            duration:1000
          })
        } else {
          this.$message({
             showClose: true,
             type:'success',
             message:'登陆成功',
             duration:1000
          });
          window.sessionStorage.setItem('token',res.data.token);
          this.$router.push("/home");
        }
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.login_contaion {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .avatar_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.login_form {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 10px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: right;
}
</style>
