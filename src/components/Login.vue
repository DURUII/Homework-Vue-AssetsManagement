<template>
  <div>
    <section class="login_bg">
      <div class="login_title">
        <h1>欢迎登录资产管理系统</h1>
      </div>
      <el-form ref="form" :model="userForm">
        <div class="loginPane">
          <img src="../assets/img/yun.jpg" class="loginImg" />
          <div class="loginInputBox">
            <el-input
              placeholder="用户名"
              v-model="userForm.account"
              class="mb-20"
            >
              <i slot="prefix" class="el-input__icon el-icon-user"></i>
            </el-input>
            <el-input
              placeholder="用户密码"
              v-model="userForm.pwd"
              class="mb-20"
              show-password
            >
              <!-- @keyup.enter.native="login" -->
              <i slot="prefix" class="el-input__icon el-icon-unlock"></i>
            </el-input>
            <div style="height: 38px; width: 385px; align-content: center">
              <template>
                <div class="drag wrapper" ref="dragDiv">
                  <div class="drag_bg"></div>
                  <div class="drag_text f14">{{ confirmWords }}</div>
                  <!-- 移动的模块 -->
                  <div
                    ref="moveDiv"
                    @mousedown="mousedownFn($event)"
                    :class="{ handler_ok_bg: confirmSuccess }"
                    class="handler handler_bg"
                  ></div>
                </div>
              </template>
            </div>
            <el-button type="text" @click="addUser"
              >点击这里注册</el-button
            >
            <div class="clear"></div>
            <el-button
              type="primary"
              class="loginBtn mt-20"
              @click="login"
              @keyup.enter="login"
              >立即登录
            </el-button>
          </div>
          <!-- <div>
            <p
              style="
                height: 20px;
                text-align: center;
                font-size: 8px;
                margin-top: 150px;
              "
            >
              Copyright © 2022 Assets Management Project
            </p>
          </div> -->
        </div>
      </el-form>
    </section>
    <el-dialog
      title="用户注册"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      v-if="dialogVisible"
    >
      <el-form
        label-width="80px"
        class="demo-ruleForm"
        :rules="rules"
        ref="ruleForm"
        :model="ruleForm"
      >
        <!--vue,如果key就不会渲染;所以,在添加和修改不同的状态下,都需要2个资产编号框,给不同prop属性-->
        <el-row>
          <el-col :span="10">
            <el-form-item label="账号" prop="account">
              <el-input
                v-model="ruleForm.account"
                size="medium"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;</el-col>
          <el-col :span="10">
            <el-form-item label="名称" prop="userName">
              <el-input
                v-model="ruleForm.userName"
                size="medium"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="密码" prop="pwd">
              <el-input
                v-model="ruleForm.pwd"
                size="medium"
                show-password
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;</el-col>
          <el-col :span="10">
            <el-form-item label="确认密码" prop="confirmPwd">
              <el-input
                v-model="ruleForm.confirmPwd"
                size="medium"
                show-password
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="ruleForm.phone"
                size="medium"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;</el-col>
          <el-col :span="10">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="ruleForm.gender" size="medium">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="出生日期" prop="birthday">
              <template>
                <div class="block">
                  <el-date-picker
                    v-model="ruleForm.birthday"
                    type="date"
                    size="medium"
                    placeholder="出生日期"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </div>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="2">&nbsp;&nbsp;</el-col>
          <el-col :span="10">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="ruleForm.email"
                size="medium"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <!--注册的提交按钮-->
        <el-button type="primary" @click="handleAddUser('ruleForm')"
          >提交</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    // 验证账号的唯一性
    const validateAccount = (rule, value, callback) => {
      //判断账号的唯一性
      //定义要传递的参数
      let param = new URLSearchParams();
      //添加用户所录入的账号
      param.append("account", value);
      this.$axios({
        method: "post",
        url: "http://localhost:8090/api/user/chkAccount",
        data: param,
      })
        .then((res) => {
          //判断是否存在
          if (res.data.code == 200) {
            callback("账号已存在");
          } else if (res.data.code == 500) {
            // console.log("账号bu存在");
            callback();
          }
        })
        .catch((err) => {
          //输出标志及错误信息
          console.log(2, err);
        });
    };
    // 设置手机号的验证规则
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入联系方式"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的电话"));
        }
      }
    };
    // 设置确认密码的验证规则
    const checkPassAgain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (
        /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(value) ||
        !value
      ) {
        callback();
      } else {
        callback(new Error("请输入正确邮箱"));
      }
    };
    return {
      userForm: {
        account: "",
        pwd: "",
      },
      ruleForm: {
        account: "",
        userName: "",
        pwd: "",
        confirmPwd: "",
        phone: "",
        gender: "",
        birthday: "",
        email: "",
      },
      rules: {
        /*对应el-form-item的prop属性*/
        account: [
          {
            type: "string",
            required: true,
            message: "请输入账号",
            trigger: "blur",
          }, // 必填校验
          { validator: validateAccount, trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
        pwd: [
          {
            type: "string",
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        confirmPwd: [
          {
            type: "string",
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
          { validator: checkPassAgain, trigger: "blur" },
        ],
        phone: [
          {
            type: "string",
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          }, // 必填校验
          { validator: checkPhone, trigger: "blur" },
        ],
        birthday: [
          { required: true, message: "请选择出生日期", trigger: "change" },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" }, // 必填校验
          { validator: validateEmail, trigger: "blur" },
        ],
      },
      dialogVisible: false,
      beginClientX: 0, // 距离屏幕左端距离
      mouseMoveStata: false, // 触发拖动状态  判断
      maxwidth: "", // 拖动最大宽度，依据滑块宽度算出来的
      confirmWords: "拖动滑块验证", // 滑块文字
      confirmSuccess: false, // 验证成功判断
    };
  },
  mounted() {
    // 根据滑块宽度计算可拖动最大宽度
    this.maxwidth =
      this.$refs.dragDiv.clientWidth - this.$refs.moveDiv.clientWidth;
    // 监听手指的触摸事件
    document
      .getElementsByTagName("html")[0]
      .addEventListener("mousemove", this.mouseMoveFn);
    // 监听手指离开事件
    document
      .getElementsByTagName("html")[0]
      .addEventListener("mouseup", this.moseUpFn);
    // 绑定监听事件
    window.addEventListener("keydown", this.keyDown);
  },
  destroyed() {
    // 销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
  methods: {
    mousedownFn: function (e) {
      if (!this.confirmSuccess) {
        e.preventDefault && e.preventDefault(); //阻止文字选中等 浏览器默认事件
        this.mouseMoveStata = true;
        this.beginClientX = e.clientX;
      }
    },
    //mousedoen 事件
    successFunction() {
      this.confirmSuccess = true;
      this.confirmWords = "验证通过";
      this.$emit("onValidation", true);
      if (window.addEventListener) {
        document
          .getElementsByTagName("html")[0]
          .removeEventListener("mousemove", this.mouseMoveFn);
        document
          .getElementsByTagName("html")[0]
          .removeEventListener("mouseup", this.moseUpFn);
      } else
        document
          .getElementsByTagName("html")[0]
          .removeEventListener("mouseup", () => {});
      document.getElementsByClassName("drag_text")[0].style.color = "#fff";
      document.getElementsByClassName("handler")[0].style.left =
        this.maxwidth + "px";
      document.getElementsByClassName("drag_bg")[0].style.width =
        this.maxwidth + "px";
    },
    //验证成功函数
    mouseMoveFn(e) {
      if (this.mouseMoveStata) {
        let width = e.clientX - this.beginClientX;
        if (width > 0 && width <= this.maxwidth) {
          document.getElementsByClassName("handler")[0].style.left =
            width + "px";
          document.getElementsByClassName("drag_bg")[0].style.width =
            width + "px";
        } else if (width > this.maxwidth) this.successFunction();
      }
    },
    //mousemove事件
    moseUpFn(e) {
      this.mouseMoveStata = false;
      var width = e.clientX - this.beginClientX;
      if (width < this.maxwidth) {
        document.getElementsByClassName("handler")[0].style.left = 0 + "px";
        document.getElementsByClassName("drag_bg")[0].style.width = 0 + "px";
      }
    },
    addUser() {
      this.dialogVisible = true;
    },
    handleAddUser(ruleForm) {
      // console.log(2);
      // console.log(this.$refs[ruleForm]);
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取注册的用户信息
          params.append("account", this.ruleForm.account);
          params.append("userName", this.ruleForm.userName);
          params.append("pwd", this.ruleForm.pwd);
          params.append("phone", this.ruleForm.phone);
          params.append("gender", this.ruleForm.gender);
          params.append("birthday", this.ruleForm.birthday);
          params.append("email", this.ruleForm.email);
          this.$axios({
            method: "post",
            url: "http://localhost:8090/api/user/add",
            data: params,
          })
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                this.validateDisabled = false;
                this.$message.success("账号申请成功,请等待管理员审批！");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，账号申请失败");
              }
              //关闭对话框
              this.dialogVisible = false;
              //输出标志
              console.log(1, res);
            })
            .catch((err) => {
              //输出标志及错误信息
              console.log(2, err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 点击回车键登录
    keyDown(e) {
      // 回车则执行登录方法 enter键的ASCII是13
      if (e.keyCode === 13) {
        this.login(); // 定义的登录方法
      }
    },

    // 登录
    login: function () {
      // 定义要传递的参数
      let params = new URLSearchParams();
      // 获取录入后的登录信息
      params.append("account", this.userForm.account);
      params.append("pwd", this.userForm.pwd);
      // 将form数据->json字符串
      // let userInfo = JSON.stringify(this.form);
      // 输出
      // console.log(userInfo, 999);
      if (this.userForm.account == "") {
        this.$message.error("请输入账号!");
      } else if (this.userForm.pwd == "") {
        this.$message.error("请输入密码!");
      } else if (this.confirmSuccess == false) {
        this.$message.error("请通过滑块验证!");
      } else if (this.confirmSuccess == true) {
        // 登陆
        this.$axios({
          method: "post",
          url: "http://localhost:8090/api/login",
          data: params,
        })
          .then((res) => {
            // 判断是否成功
            if (res.data.code == 200) {
              this.$notify({
                title: "成功",
                message: "登陆成功！欢迎来到资产管理系统",
                type: "success",
              });
              // console.info(res.data.obj);
              this.$store.commit("setToken", res.data.obj);
              // $.cookie("account", this.userForm.account);
              // 迁移到main页面
              // location.href = "main";
              this.$router.push({ path: "/mainview" });
            } else if (res.data.code == 204) {
              this.$message.error("该账号已被禁用,请联系管理员!");
            } else if (res.data.code == 203) {
              this.$message.error("该账号正在申请,请等待管理员同意!");
            } else if (res.data.code == 201) {
              this.$message.error("该账号有误!");
            } else if (res.data.code == 202) {
              this.$message.error("密码有误!");
            }
          })
          .catch((err) => {
            // 输出错误消息
            console.info(err);
          });
      }
    },
  },
};
</script>

<style>
@import url("../assets/css/main.css");
.el-input {
  width: 100%;
}
</style>