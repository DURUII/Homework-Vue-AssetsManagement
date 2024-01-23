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
      style="width: 100%"
    >
      <el-table-column prop="id" label="资产内部编号" v-if="false">
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
      <el-table-column prop="applyer" label="申请者"> </el-table-column>
      <el-table-column prop="yesNo" label="是否同意">
        <template slot-scope="scope">
          <el-tag :type="scope.row.yesNo | statusFilter" disable-transitions>{{
            scope.row.yesNo | formatStata
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="审批者"> </el-table-column>
    </el-table>
        <!--分页-->
      <div class="pagination">
        <!-- current-page：默认页码
            page-sizes：每页选择条数项列表
            page-size：默认每页显示10条-->
        <!--                事件
                            @size-change：页码大小变动事件
                            @current-change：当前页变动事件-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total, sizes, prev, pager, next, jumper"
          :current-page.sync="pageCode"
          :page-sizes="pageOption"
          :page-size="5"
          :total="totalElements"
        >
        </el-pagination>
      </div>
  </div>
</template>

<script>
export default {
  name: "personApply",
  data() {
    return {
      tableData: [], //当前申请列表
      pageCode: 1, //默认页码
      pageSize: 6, //每页5条
      totalPage: 5, //总页数
      pageOption: [6, 10, 15],
      totalElements: 100, //总记录数
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
            //每页的条数发生改变的时候
    //val:每页的条数
    handleSizeChange(val) {
      this.findAllApplyInfo(this.pageCode, val);
      //重新设置每页的条数
      this.pageSize = val;
    },
    //翻页的时候
    //val:页码
    handleCurrentChange(val) {
      this.findAllApplyInfo(val, this.pageSize);
    },
    //获取当前用户的所有申请列表
    findAllApplyInfo(pageCode,pageSize) {
      //定义要传递的参数
      let params = new URLSearchParams();
      // 添加页码
      params.append("pageNo", pageCode);
      // 添加每页条数
      params.append("pageSize", pageSize);
      //获取所有的申请列表
      this.$axios.post("http://localhost:8090/apply/personList", params).then((res) => {
        // if (res.data == null) {
        //   this.$message.error("用户信息过期！请重新登陆");
        //   setTimeout("top.location.href = 'logout'", 1000);
        // }
        //设置当前页的员工列表
        this.tableData = res.data.obj.rows;
        // 设置总页数
        this.totalPage = res.data.obj.pageCount;
        // 设置总记录数
        this.totalElements = res.data.obj.total;
        // 输出到控制台
        // console.log(this.tableData);
      });
    },
  },
  created: function () {
    this.findAllApplyInfo(this.pageCode, this.pageSize);
  },
};
</script>