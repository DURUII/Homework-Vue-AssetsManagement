<template>
  <div>
    <el-container :style="{ height: isHeight }" style="border: 1px solid #eee">
      <el-aside
        :width="isCollapse ? '64px' : '220px'"
        style="background-color: #545c64"
      >
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <router-link to="mainStystem">
            <el-menu-item style="height: 60px">
              <div class="icon-warp">
                <img src="../assets/img/icon1.png" />
                <span slot="title">&nbsp;&nbsp;资产管理系统</span>
              </div>
            </el-menu-item>
          </router-link>
          <router-link to="mainStystem">
            <el-menu-item index="1">
              <i class="el-icon-s-promotion"></i>
              <span slot="title">首页</span>
            </el-menu-item>
          </router-link>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-notebook-1"></i>
              <span>资产管理</span>
            </template>
            <el-menu-item-group>
              <router-link to="assetSrch">
                <el-menu-item index="2-1">
                  <i class="el-icon-search"></i>
                  <span slot="title">资产查询</span>
                </el-menu-item>
              </router-link>
              <router-link to="assetClassify">
                <el-menu-item index="2-2">
                  <i class="el-icon-c-scale-to-original"></i>
                  <span slot="title">资产分类</span>
                </el-menu-item>
              </router-link>
              <router-link to="aroList">
                <el-menu-item index="2-3">
                  <i class="el-icon-finished"></i>
                  <span slot="title">资产待审批情况</span>
                </el-menu-item>
              </router-link>
              <router-link to="userApply">
                <el-menu-item index="2-4">
                  <i class="el-icon-s-data"></i>
                  <span slot="title">用户申请资产情况</span>
                </el-menu-item>
              </router-link>
              <!-- <router-link to="assetDepreciation">
                <el-menu-item index="2-5" v-show="role != 'employee'">
                  <i class="el-icon-s-release"></i>
                  <span slot="title">资产报废</span>
                </el-menu-item>
              </router-link> -->
              <router-link to="assetWorthless">
                <el-menu-item index="2-6">
                  <i class="el-icon-document-delete"></i>
                  <span slot="title">不可用资产情况</span>
                </el-menu-item>
              </router-link>
              <router-link to="assetTypeRate">
                <el-menu-item index="2-7">
                  <i class="el-icon-pie-chart"></i>
                  <span slot="title">各种资产占比</span>
                </el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-goods"></i>
              <span>个人中心</span>
            </template>
            <el-menu-item-group>
              <router-link to="personAsset">
                <el-menu-item index="3-3">
                  <i class="el-icon-sell"></i>
                  <span slot="title">个人资产</span>
                </el-menu-item>
              </router-link>
              <router-link to="personApply">
                <el-menu-item index="3-1">
                  <i class="el-icon-document"></i>
                  <span slot="title">个人资产申请情况</span>
                </el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4" v-show="role == 'admin'">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item-group>
              <router-link to="userList">
                <el-menu-item index="4-1">
                  <i class="el-icon-search"></i>
                  <span slot="title">用户查询</span>
                </el-menu-item>
              </router-link>
              <router-link to="userAroList">
                <el-menu-item index="4-2">
                  <i class="el-icon-s-data"></i>
                  <span slot="title">用户账号申请情况</span>
                </el-menu-item>
              </router-link>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header
          style="
            font-size: 14px;
            background-color: #545c64;
            margin-left: -20px;
            line-height: 60px;
          "
        >
          <div class="show-i" style="margin-top: 8px">
            <div v-show="isShow" @click="toggleCollapse">
              <i class="el-icon-s-fold"></i>
            </div>
            <div v-show="!isShow" @click="toggleCollapse">
              <i class="el-icon-s-unfold"></i>
            </div>
          </div>
          <el-dropdown style="float: right; line-height: 60px">
            <div style="padding: 10px">
              <el-avatar shape="square" :src="imageBase64"></el-avatar>
            </div>
            <el-dropdown-menu slot="dropdown" class="el-dropdown-menu">
              <el-dropdown-item>
                <router-link to="userInfo">
                  <el-link type="primary">
                    <i class="el-icon-user"></i>
                    个人资料
                  </el-link>
                </router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-link type="primary" @click="logout">
                  <i class="el-icon-switch-button"></i>
                  退出系统
                </el-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span
            style="
              color: white;
              float: right;
              text-align: right;
              line-height: 60px;
            "
          >
            在线用户: {{ findName }}
          </span>
        </el-header>
        <el-main class="mainMain">
          <router-view></router-view>
        </el-main>
        <el-footer style="height: 26px">
          <!-- <div style="text-align: center; margin-top: 10px; height: 18px">
            <a
              target="_blank"
              style="
                display: inline-block;
                text-decoration: none;
                height: 18px;
                line-height: 18px;
              "
            >
              <p
                style="
                  font-size: 10px;
                  float: left;
                  height: 18px;
                  line-height: 18px;
                  margin: 0px 0px 0px 5px;
                "
              >
                Copyright © 2022 Assets Management Project
              </p>
            </a>
          </div> -->
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import photo from "../assets/img/head.png";
export default {
  name: "mainview",
  data() {
    return {
      isHeight: "",
      isCollapse: false,
      isShow: true,
      imageBase64: "",
      findName: "",
      role: "",
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push({ path: "/login" });
    },
    toggleCollapse() {
      this.isShow = !this.isShow;
      this.isCollapse = !this.isCollapse;
    },
    findAccountPhoto() {
      this.isHeight = window.outerHeight - 116 + "px";
      this.$axios({
        method: "post",
        url: "http://localhost:8090/api/user/findAccountInfo",
      }).then((res) => {
        // let token=window.sessionStorage.getItem('token').split(".");
        // console.log(token);
        // let str=token[1];
        // let user=JSON.parse(decodeURIComponent(escape(window.atob(str))));
        // console.log(user.username);
        // 设置当前页的员工列表
        // this.role = res.data.obj.rolesList.rname;
        window.sessionStorage.setItem("roleInfo", res.data.obj.rolesList.rname);
        window.sessionStorage.setItem("account", res.data.obj.account);
        window.sessionStorage.setItem("username", res.data.obj.userName);
        window.sessionStorage.setItem("phone", res.data.obj.phone);
        window.sessionStorage.setItem("gender", res.data.obj.gender);
        window.sessionStorage.setItem("birthday", res.data.obj.birthday);
        window.sessionStorage.setItem("email", res.data.obj.email);
        window.sessionStorage.setItem(
          "creationTime",
          res.data.obj.creationTime
        );
        window.sessionStorage.setItem(
          "registerTime",
          res.data.obj.registerTime
        );
        this.role = window.sessionStorage.getItem("roleInfo");
        this.findName = window.sessionStorage.getItem("username");
        if (res.data.obj.photoFile == null) {
          this.imageBase64 = photo;
        } else {
          this.imageBase64 = res.data.obj.photoFile;
        }
      });
    },
  },
  created: function () {
    this.findAccountPhoto();
  },
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
  border: none;
}

.icon-warp {
  font-size: 20px;
}

.show-i {
  float: left;
}

.show-i i {
  font-size: 35px;
  color: white;
}

.el-dropdown-menu {
  top: 57px !important;
}

a {
  text-decoration: none;
}
</style>