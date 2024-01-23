<template>
  <div>
    <div style="margin-bottom: 10px;">
      <el-form :inline="true" class="demo-form-inline" v-if="role != 'employee'">
        <el-button type="success" @click="handleYes">同意</el-button>
        <el-button type="danger" @click="handleNo">不同意</el-button>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      :row-key="
        (row) => {
          return row.id;
        }
      "
      tooltip-effect="dark"
      stripe
      style="width: 100%;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" :reserve-selection="true">
      </el-table-column>
      <el-table-column prop="id" label="申请流水号" v-if="false">
      </el-table-column>
      <el-table-column prop="asId" label="资产编号"> </el-table-column>
      <el-table-column prop="isBack" label="业务类型">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isBack == '1' ? '' : 'warning'"
            disable-transitions
            >{{ scope.row.isBack == "1" ? "申请" : "归还" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="申请者"> </el-table-column>
      <el-table-column prop="yesNo" label="是否同意">
        <template slot-scope="scope">
          <el-tag :type="scope.row.yesNo | statusFilter" disable-transitions>{{
            scope.row.yesNo | formatStata
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="approval" label="审批者"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "aroList",
  data() {
    return {
      role: '',
      tableData: [], //待审批一览
      batchPassArr: [], //待审批的申请流水号
      businessArr: [], //业务类型数组 1:申请;0:归还
    };
  },
  filters: {
    // el-tag类型转换
    statusFilter(status) {
      const statusMap = {
        1: "info",
        2: "success",
        3: "danger",
      };
      return statusMap[status];
    },
    // 状态显示转换
    formatStata(status) {
      const statusMap = {
        1: "初始",
        2: "同意",
        3: "不同意",
      };
      return statusMap[status];
    },
  },
  methods: {
    //获取待审批一览
    findNoApprovalInfo() {
      //定义要传递的参数
      let params = new URLSearchParams();
      //获取所有的申请列表
      this.$axios.post("http://localhost:8090/aro/noApprovalList", params).then((res) => {
        //设置当前页的员工列表
        this.tableData = res.data.obj;
        //输出到控制台
        console.log(this.tableData);
      });
    },
    yseNoStatus(row, column) {
      //声明返回变量
      let rtn = "";
      //判断
      if (row.yesNo == 1) {
        rtn = "初始";
      } else if (row.yesNo == 2) {
        rtn = "同意";
      } else if (row.yesNo == 3) {
        rtn = "不同意";
      }
      //返回
      return rtn;
    }, //多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.batchPassArr = []; //每次点击需清空原本数组的内容
      this.multipleSelection.map((item) => {
        //遍历数组，把id存进自定义的数组里
        //将选中的待审批流水压入batchPassArr
        this.batchPassArr.push(item.id);
        //将选中的
        this.businessArr.push(item.isBack);
        //输出
        console.info(this.businessArr);
      });
      this.batchPassArr = this.batchPassArr.join(",");
      console.log(this.batchPassArr);
    }, //同意
    handleYes() {
      //判断有没有选中要申请的资产
      if (this.batchPassArr.length == 0) {
        this.$message.error("错误提示，请选中要申请的资产!");
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
            .post("http://localhost:8090/aro/yes", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //同意后,刷新页面
                this.findNoApprovalInfo();
                this.$message.success("资产申请已同意");
              } else if (res.data.code == 500) {
                this.$message.error("资产申请同意失败");
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
    handleNo() {
      //判断有没有选中要申请的资产
      if (this.batchPassArr.length == 0) {
        this.$message.error("错误提示，请选中要待批的资产!");
        return;
      } else {
        //是否有关归还业务
        let isBack = false; //false:没有归还;true:有归还
        //遍历待处理的业务类型列表
        for (let i = 0; i < this.businessArr; i++) {
          //判断有没有归还业务
          if (this.businessArr[i] == 0) {
            //设置标志位
            isBack = true;
            //返回
            return;
          }
        }
        if (isBack) {
          this.$message.error("归还业务没有不同意!");
          return;
        }
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
              .post("http://localhost:8090/aro/no", params)
              .then((res) => {
                //判断是否成功
                if (res.data.code == 200) {
                  //不同意后,刷新页面
                  this.findNoApprovalInfo();
                  this.$message.error("资产申请未同意!");
                } else if (res.data.code == 500) {
                  this.$message.error("资产申请同意失败");
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
    this.findNoApprovalInfo();
    this.role = window.sessionStorage.getItem("roleInfo");
  },
};
</script>