<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-button type="success" @click="handleUserYes">同意</el-button>
      <el-button type="danger" @click="handleUserNo">不同意</el-button>
    </el-form>
    <el-table
      :data="tableData"
      :row-key="
        (row) => {
          return row.id;
        }
      "
      tooltip-effect="dark"
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true">
      </el-table-column>
      <el-table-column prop="id" label="申请流水号" v-if="false">
      </el-table-column>
      <el-table-column prop="account" label="账号"> </el-table-column>
      <el-table-column prop="userName" label="名称"> </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
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
      <el-table-column prop="phone" label="手机号"> </el-table-column>
      <el-table-column prop="birthday" label="出生日期"> </el-table-column>
      <el-table-column prop="creationTime" label="申请时间"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "userAroList",
  data() {
    return {
      tableData: [], //待审批一览
      batchPassArr: [], //待审批的申请流水号
      businessArr: [], //业务类型数组 1:申请;0:归还
    };
  },
  methods: {
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    filterTag(value, row) {
      return row.gender == value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    // 获取待审批一览
    findNoUserInfo() {
      // 定义要传递的参数
      let params = new URLSearchParams();
      // 获取所有的申请列表
      this.$axios
        .post("http://localhost:8090/api/user/noUserList", params)
        .then((res) => {
          // 设置当前页的员工列表
          this.tableData = res.data.obj;
          // 输出到控制台
          // console.log(this.tableData);
        });
    },
    //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.batchPassArr = []; // 每次点击需清空原本数组的内容
      this.multipleSelection.map((item) => {
        // 遍历数组，把id存进自定义的数组里
        // 将选中的待审批流水压入batchPassArr
        this.batchPassArr.push(item.id);
      });
      this.batchPassArr = this.batchPassArr.join(",");
      // console.log(this.batchPassArr);
    }, //同意
    handleUserYes() {
      //判断有没有选中要申请的资产
      if (this.batchPassArr.length == 0) {
        this.$message.error("错误提示，请选中要申请的用户账号!");
        return;
      }
      this.$confirm("您确认想要同意这些申请单据吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取选中的申请流水号
          params.append("ids", this.batchPassArr);
          this.$axios
            .post("http://localhost:8090/api/user/userAroYes", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //同意后,刷新页面
                this.findNoUserInfo();
                this.$message.success("用户账号申请已同意");
              } else if (res.data.code == 500) {
                this.$message.error("用户账号申请失败");
              }
              //输出标志
              console.log(1, res);
            })
            .catch((err) => {
              //输出标志及错误信息
              console.log(2, err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消同意",
          });
        });
    }, //不同意
    handleUserNo() {
      //判断有没有选中要申请的用户
      if (this.batchPassArr.length == 0) {
        this.$message.error("错误提示，请选中要待批的用户账号!");
        return;
      } else {
        this.$confirm("您确认想要不同意这些申请单据吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let params = new URLSearchParams();
            //获取选中的申请流水号
            params.append("ids", this.batchPassArr);
            this.$axios
              .post("http://localhost:8090/api/user/userAroNo", params)
              .then((res) => {
                //判断是否成功
                if (res.data.code == 200) {
                  //不同意后,刷新页面
                  this.findNoUserInfo();
                  this.$message.error("用户账号申请未同意!");
                } else if (res.data.code == 500) {
                  this.$message.error("操作失败");
                }
                //输出标志
                console.log(1, res);
              })
              .catch((err) => {
                //输出标志及错误信息
                console.log(2, err);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消不同意",
            });
          });
      }
    },
  },
  created: function () {
    this.findNoUserInfo();
  },
};
</script>