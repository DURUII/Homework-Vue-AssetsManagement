<template>
  <div>
    <el-table
      :data="tableData"
      :row-key="
        (row) => {
          return row.id;
        }
      "
      tooltip-effect="dark"
      stripe
      border
      height="580px"
      style="width: 100%"
    >
      <el-table-column prop="id" label="员工内部编号" v-if="false">
      </el-table-column>
      <el-table-column fixed prop="account" label="账号" width="120px">
      </el-table-column>
      <el-table-column prop="userName" label="名称" width="100px">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="65px"
        :filters="[
          { text: '男', value: '1' },
          { text: '女', value: '0' },
        ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.gender == '1' ? 'primary' : 'success'"
            disable-transitions
            >{{ scope.row.gender == "1" ? "男" : "女" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="creationTime"
        width="180px"
        label="登陆时间"
      >
      </el-table-column>

      <el-table-column prop="phone" width="130px" label="手机号">
      </el-table-column>
      <el-table-column prop="email" width="180px" label="邮箱">
      </el-table-column>
      <el-table-column sortable prop="birthday" width="130px" label="出生日期">
      </el-table-column>
      <el-table-column
        sortable
        prop="registerTime"
        width="180px"
        label="注册时间"
      >
      </el-table-column>
      <el-table-column prop="rolesList.rdesc" width="110px" label="角色信息">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.rolesList.rdesc | statusFilter"
            disable-transitions
            >{{ scope.row.rolesList.rdesc }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="是否禁用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isShow"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeSelect($event, scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="150px"
        label="设置管理员"
        v-if="role == 'admin'"
      >
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            @click="handleManagerYes(scope.$index, scope.row, tableData)"
            >升级
          </el-button>
          <el-button
            type="info"
            size="mini"
            @click="handleManagerNo(scope.$index, scope.row, tableData)"
            >取消
          </el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="100px" label="操作">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="handleDelete(scope.$index, scope.row, tableData)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "userList",
  data() {
    return {
      role: "",
      tableData: [], //当前申请列表
    };
  },
  filters: {
    // el-tag类型转换
    statusFilter(status) {
      const statusMap = {
        管理员: "danger",
        经理: "",
        员工: "info",
      };
      return statusMap[status];
    },
  },
  methods: {
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    filterTag(value, row) {
      return row.gender == value;
    },
    changeSelect(value, row) {
      this.$confirm("是否启用或禁用?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
      })
        .then(() => {
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取选中的申请流水号
          params.append("id", row.id);
          params.append("isShow", row.isShow);
          params.append("rName", row.rolesList.rname);
          this.$axios
            .post("http://localhost:8090/api/user/userShowYesOrNo", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 201) {
                //同意后,刷新页面
                this.$message.success("启用成功");
                this.findAllUserInfo();
              } else if (res.data.code == 202) {
                this.$message.success("禁用成功");
                this.findAllUserInfo();
              } else if (res.data.code == 203) {
                this.$message.error("没有权限禁用该用户！");
                this.findAllUserInfo();
              } else if (res.data.code == 500) {
                this.$message.error("操作失败！");
                this.findAllUserInfo();
              }
              // 输出标志
              // console.log(1, res);
            })
            .catch((err) => {
              const status = row.isShow === 0 ? 1 : 0;
              row.isShow = status;
              console.log(err);
            });
        })
        .catch(() => {
          const status = row.isShow === 0 ? 1 : 0;
          row.isShow = status;
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    // 获取用户信息一览
    findAllUserInfo() {
      // 定义要传递的参数
      let params = new URLSearchParams();
      // 获取不可用资产一览
      this.$axios
        .post("http://localhost:8090/api/user/allUserInfo", params)
        .then((res) => {
          // 设置当前页的员工列表
          this.tableData = res.data.obj;
          // 输出到控制台
          // console.log(this.tableData);
        });
    },
    /**
     * 对选中的资产进行删除操作
     * @param index 行索引
     * @param row 该行对应的部门对象
     * @param tableData 部门列表
     */
    handleManagerYes(index, row, tableData) {
      this.$confirm("是否将该员工设置为经理?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //获取当前要设置的员工内部编号
          let id = tableData[index].id;
          let rname = tableData[index].rolesList.rname;
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取当前要设置的员工内部编号
          params.append("id", id);
          params.append("rName", rname);
          //发送设置请求
          this.$axios
            .post("http://localhost:8090/api/user/managerYes", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //故障成功后,刷新页面
                this.findAllUserInfo();
                this.$message.success("经理设置成功");
              } else if (res.data.message == "没有权限") {
                this.$message.error("错误提示，没有权限设置该用户！");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，经理设置失败");
              }
            })
            .catch((err) => {
              //输出错误消息
              console.info(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消设置",
          });
        });
    },
    handleManagerNo(index, row, tableData) {
      this.$confirm("是否取消该员工为经理?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //获取当前要设置的员工内部编号
          let id = tableData[index].id;
          let rname = tableData[index].rolesList.rname;
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取当前要设置的员工内部编号
          params.append("id", id);
          params.append("rName", rname);
          //发送设置请求
          this.$axios
            .post("http://localhost:8090/api/user/managerNo", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //故障成功后,刷新页面
                this.findAllUserInfo();
                this.$message.success("经理设置成功");
              } else if (res.data.message == "没有权限") {
                this.$message.error("错误提示，没有权限设置该用户！");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，经理设置失败");
              }
            })
            .catch((err) => {
              //输出错误消息
              console.info(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消设置",
          });
        });
    },
    /**
     * 对选中的员工进行删除操作
     * @param index 行索引
     * @param row 该行对应的部门对象
     * @param tableData 员工列表
     */
    handleDelete(index, row, tableData) {
      this.$confirm("是否将该员工删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //获取当前要故障的资产内部编号
          let id = tableData[index].id;
          let account = tableData[index].account;
          let rname = tableData[index].rolesList.rname;
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取要故障的资产内部编号
          params.append("id", id);
          params.append("account", account);
          params.append("rName", rname);
          //发送故障请求
          this.$axios
            .post("http://localhost:8090/api/user/del", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //故障成功后,刷新页面
                this.findAllUserInfo();
                this.$message.success("员工删除成功！");
              } else if (res.data.message == "没有权限") {
                this.$message.error("错误提示，没有该权限删除改员工！");
              } else if (res.data.message == "资产使用") {
                this.$message.error(
                  "错误提示，该员工还有使用的资产，删除失败！"
                );
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，员工删除失败！");
              }
            })
            .catch((err) => {
              //输出错误消息
              console.info(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消故障",
          });
        });
    },
  },
  created: function () {
    this.findAllUserInfo();
    this.role = window.sessionStorage.getItem("roleInfo");
  },
};
</script>