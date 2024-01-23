<template>
  <div>
    <div class="from-left">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <div style="margin: 0 auto; text-align: center">
          <el-upload
            class="avatar-uploader"
            action=""
            v-model="ruleForm.url"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="changeUpload"
          >
            <el-avatar :src="ruleForm.url" :size="90"></el-avatar>
          </el-upload>
        </div>
        <el-descriptions class="margin-top" :column="1" :size="size" border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              用户名
            </template>
            {{ ruleFormInfo.account }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-s-custom"></i>
              名称
            </template>
            {{ ruleFormInfo.userName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号
            </template>
            {{ ruleFormInfo.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-female"></i>
              性别
            </template>
            {{ ruleFormInfo.gender == 1 ? "男" : "女" }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              出生日期
            </template>
            {{ ruleFormInfo.birthday }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-chat-dot-round"></i>
              邮箱
            </template>
            {{ ruleFormInfo.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-time"></i>
              最近登录
            </template>
            {{ ruleFormInfo.creationTime }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-time"></i>
              注册时间
            </template>
            {{ ruleFormInfo.registerTime }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
    <div class="from-right">
      <el-card class="box-card" shadow="hover">
        <div slot="header" class="clearfix">
          <span>基本资料</span>
        </div>
        <template>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="个人信息" name="first"></el-tab-pane>
            <el-tab-pane label="修改密码" name="second"></el-tab-pane>
          </el-tabs>
        </template>
        <div v-show="showUser">
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
                    :readonly="true"
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
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
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
            <el-form-item>
              <!--注册的提交按钮-->
              <el-button>取消</el-button>
              <el-button type="primary" @click="handleUpdateUser('ruleForm')"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div v-show="showPwd">
          <el-form
            :model="ruleFormPwd"
            status-icon
            :rules="rulesPwd"
            ref="ruleFormPwd"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-row>
              <el-col :span="10">
                <el-form-item label="原密码" prop="oldPwd">
                  <el-input
                    type="password"
                    v-model="ruleFormPwd.oldPwd"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="新密码" prop="newPwd">
                  <el-input
                    type="password"
                    v-model="ruleFormPwd.newPwd"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="确认密码" prop="confirmPwd">
                  <el-input
                    type="password"
                    v-model="ruleFormPwd.confirmPwd"
                    autocomplete="off"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <el-button @click="resetForm('ruleFormPwd')">重置</el-button>
              <el-button type="primary" @click="updateUserPwd('ruleFormPwd')"
                >提交</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" :visible.sync="dialogVisible" append-to-body>
      <div class="cropper-content">
        <div class="cropper" style="text-align: center">
          <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
          ></vueCropper>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="finish" :loading="loading"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { client, getFileNameUUID } from "../utils/alioss";

export default {
  name: "userInfo",
  data() {
    let validateOldPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        callback();
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleFormPwd.confirmPwd !== "") {
          this.$refs.ruleFormPwd.validateField("confirmPwd");
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleFormPwd.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
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
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        // autoCropWidth: 300, // 默认生成截图框宽度
        // autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [5, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      picsList: [], //页面显示的数组
      // 防止重复提交
      loading: false,
      fileList: [],
      size: "medium",
      activeName: "",
      showUser: true,
      showPwd: false,
      ruleForm: {
        id: "",
        account: "",
        userName: "",
        photoFile: null,
        url: "",
        pwd: "",
        gender: "",
        phone: "",
        birthday: "",
        email: "",
        creationTime: "",
      },
      ruleFormInfo: {
        account: "",
        userName: "",
        gender: "",
        phone: "",
        birthday: "",
        email: "",
        creationTime: "",
        registerTime: "",
      },
      ruleFormPwd: {
        newPwd: "",
        confirmPwd: "",
        oldPwd: "",
      },
      rules: {
        /*对应el-form-item的prop属性*/
        userName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
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
      rulesPwd: {
        oldPwd: [{ validator: validateOldPwd, trigger: "blur" }],
        newPwd: [{ validator: validatePass, trigger: "blur" }],
        confirmPwd: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 上传按钮   限制图片大小
    changeUpload(file, fileList) {
      const isJPEG = file.name.split(".")[1] === "jpeg";
      const isJPG = file.name.split(".")[1] === "jpg";
      const isPNG = file.name.split(".")[1] === "png";
      const isWEBP = file.name.split(".")[1] === "webp";
      const isGIF = file.name.split(".")[1] === "gif";
      if (!isJPG && !isJPEG && !isPNG && !isWEBP && !isGIF) {
        this.$message.error("上传图片只能是 JPEG/JPG/PNG 格式!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
        return false;
      }
      this.fileinfo = file;

      // 上传成功后将图片地址赋值给裁剪框显示图片
      this.$nextTick(() => {
        this.option.img = window.URL.createObjectURL(file.raw);
        this.dialogVisible = true;
      });
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    finish() {
      this.$refs.cropper.getCropBlob((data) => {
        // var fileName = 'goods' + this.fileinfo.uid
        var fileName = "image/" + "banner" + this.fileinfo.uid + ".jpeg";
        this.loading = true;
        //上传阿里云服务器
        client()
          .put(fileName, data)
          .then((result) => {
            this.dialogVisible = false;
            this.picsList.push(result.url);
            //此处赋值，是相当于上传成功之后，手动拼接服务器地址和文件名
            this.ruleForm.url =
              "https://csb-gulimall.oss-cn-chengdu.aliyuncs.com/" + fileName;
            //定义要传递的参数
            let params = new URLSearchParams();
            //设置账号
            params.append("url", this.ruleForm.url);
            //添加部门信息
            this.$axios({
              method: "post",
              url: "http://localhost:8090/api/user/updateHeadPortrait",
              data: params,
            })
              .then((res) => {
                //判断是否成功
                if (res.data.code == 200) {
                  this.$message.success("头像上传成功！");
                  location.reload();
                  //top.location.href = "logout"
                } else if (res.data.code == 500) {
                  this.$message.error("头像上传失败！");
                }
              })
              .catch((err) => {
                //输出错误消息
                console.info(err);
              });
          })
          .catch((err) => {
            console.log(err);
            this.loading = false;
          });
      });
    },
    // handleBeforeUpload(file) {
    //   const isJPEG = file.name.split(".")[1] === "jpeg";
    //   const isJPG = file.name.split(".")[1] === "jpg";
    //   const isPNG = file.name.split(".")[1] === "png";
    //   const isWEBP = file.name.split(".")[1] === "webp";
    //   const isGIF = file.name.split(".")[1] === "gif";
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isJPG && !isJPEG && !isPNG && !isWEBP && !isGIF) {
    //     this.$message.error("上传图片只能是 JPEG/JPG/PNG 格式!");
    //   }
    //   if (!isLt2M) {
    //     this.$message.error("单张图片大小不能超过 2MB!");
    //   }
    //   return (isJPEG || isJPG || isPNG || isWEBP || isGIF) && isLt500K;
    // },
    // uploadURL(file) {
    //   //注意哦，这里指定文件夹'image/'，尝试过写在配置文件，但是各种不行，写在这里就可以
    //   var fileName = "image/" + "banner" + `${Date.parse(new Date())}` + ".jpg";
    //   //定义唯一的文件名，打印出来的uid其实就是时间戳
    //   client()
    //     .multipartUpload(fileName, file.file, {
    //       progress: function (percentage, cpt) {
    //         console.log("打印进度", percentage);
    //       },
    //     })
    //     .then((res) => {
    //       //此处赋值，是相当于上传成功之后，手动拼接服务器地址和文件名
    //       this.ruleForm.url =
    //         "https://csb-gulimall.oss-cn-chengdu.aliyuncs.com/" + fileName;
    //       //定义要传递的参数
    //       let params = new URLSearchParams();
    //       //设置账号
    //       params.append("url", this.ruleForm.url);
    //       //添加部门信息
    //       this.$axios({
    //         method: "post",
    //         url: "http://localhost:8090/api/user/updateHeadPortrait",
    //         data: params,
    //       })
    //         .then((res) => {
    //           //判断是否成功
    //           if (res.data.code == 200) {
    //             this.$message.success("头像上传成功！");
    //             location.reload();
    //             //top.location.href = "logout"
    //           } else if (res.data.code == 500) {
    //             this.$message.error("头像上传失败！");
    //           }
    //         })
    //         .catch((err) => {
    //           //输出错误消息
    //           console.info(err);
    //         });
    //     });
    // },
    findAccountInfo() {
      // 设置当前页的员工列表
      this.$axios
        .post("http://localhost:8090/api/user/findAccountInfo")
        .then((res) => {
          // if (res.data == "") {
          //   this.$message.error("用户信息过期！请重新登陆");
          //   setTimeout("top.location.href = 'logout'", 1000);
          // }
          // 设置当前页的员工列表
          this.ruleForm.id = res.data.obj.id;
          this.ruleForm.account = res.data.obj.account;
          this.ruleForm.userName = res.data.obj.userName;
          //this.ruleForm.pwd = res.data.obj.pwd;
          //this.ruleForm.photoFile = res.data.obj.photoFile;
          this.ruleForm.url = res.data.obj.photoFile;
          this.ruleForm.phone = res.data.obj.phone;
          this.ruleForm.gender = res.data.obj.gender;
          this.ruleForm.email = res.data.obj.email;
          this.ruleForm.birthday = res.data.obj.birthday;
          this.ruleForm.creationTime = res.data.obj.creationTime;
        });
    },
    handleClick(tab, event) {
      if (tab.index == 0) {
        this.showUser = true;
        this.showPwd = false;
      } else if (tab.index == 1) {
        this.showUser = false;
        this.showPwd = true;
      }
    },
    handleUpdateUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //定义要传递的参数
          let params = new URLSearchParams();
          //设置账号
          params.append("account", this.ruleForm.account);
          //设置更改后的名称
          params.append("userName", this.ruleForm.userName);
          //设置更改后的手机号
          params.append("phone", this.ruleForm.phone);
          //设置更改后的性别
          params.append("gender", this.ruleForm.gender);
          //设置更改后的出生日期
          params.append("birthday", this.ruleForm.birthday);
          //设置更改后的邮箱
          params.append("email", this.ruleForm.email);
          //添加部门信息
          this.$axios({
            method: "post",
            url: "http://localhost:8090/api/user/updateUserInfo",
            data: params,
          })
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                // 添加成功后,刷新页面
                // this.findAccountInfo();
                this.$message.success("个人信息修改成功!");
                location.reload();
                // this.$router.push({path: '/mainStystem'})
                // setTimeout(location.reload(),1000)
              } else if (res.data.code == 500) {
                this.$message.error("个人信息修改失败!");
              }
            })
            .catch((err) => {
              //输出错误消息
              console.info(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    updateUserPwd(formName) {
      this.$confirm("此操作将修改密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              //定义要传递的参数
              let params = new URLSearchParams();
              //设置账号
              params.append("account", this.ruleForm.account);
              //设置修改后的密码
              params.append("oldPwd", this.ruleFormPwd.oldPwd);
              //设置修改后的密码
              params.append("pwd", this.ruleFormPwd.newPwd);
              //添加部门信息
              this.$axios({
                method: "post",
                url: "http://localhost:8090/api/user/updateUserPwd",
                data: params,
              })
                .then((res) => {
                  //判断是否成功
                  if (res.data.code == 200) {
                    this.$message.success("密码修改成功，请重新登陆！");
                    setTimeout(this.$router.push({ path: "/login" }), 1000);
                    //top.location.href = "logout"
                  } else if (res.data.message == "原密码错误") {
                    this.$message.error("原密码错误，密码修改失败");
                  } else if (res.data.code == 500) {
                    this.$message.error("密码修改失败");
                  }
                })
                .catch((err) => {
                  //输出错误消息
                  console.info(err);
                });
            } else {
              console.log("error submit!");
              return false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
  created: function () {
    this.findAccountInfo();
    this.ruleFormInfo.account = window.sessionStorage.getItem("account");
    this.ruleFormInfo.userName = window.sessionStorage.getItem("username");
    this.ruleFormInfo.phone = window.sessionStorage.getItem("phone");
    this.ruleFormInfo.gender = window.sessionStorage.getItem("gender");
    this.ruleFormInfo.birthday = window.sessionStorage.getItem("birthday");
    this.ruleFormInfo.email = window.sessionStorage.getItem("email");
    this.ruleFormInfo.creationTime =
      window.sessionStorage.getItem("creationTime");
    this.ruleFormInfo.registerTime =
      window.sessionStorage.getItem("registerTime");
  },
};
</script>


<style>
.cropper-content .cropper {
  width: auto;
  height: 300px;
}
.from-left {
  float: left;
  min-width: 30%;
}

.from-right {
  float: left;
  padding-left: 30px;
  min-width: 60%;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 132px;
  height: 132px;
  line-height: 132px;
  text-align: center;
}
.avatar {
  width: 132px;
  height: 132px;
  display: block;
}
</style>