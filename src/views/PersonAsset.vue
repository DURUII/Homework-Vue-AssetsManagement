<template>
  <div>
    <div v-show="isSrch">
      <el-table
        ref="multipleTable"
        :row-key="
          (row) => {
            return row.id;
          }
        "
        :data="tableData"
        tooltip-effect="dark"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :reserve-selection="true" width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="资产内部编号"
          width="100"
          v-if="false"
        >
        </el-table-column>
        <el-table-column prop="asId" label="资产编号" width="100">
        </el-table-column>
        <el-table-column prop="asSpec" label="型号" width="100">
        </el-table-column>
        <el-table-column prop="classify" label="类别" width="100">
        </el-table-column>
        <el-table-column prop="asState" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.asState | statusFilter"
              disable-transitions
              >{{ scope.row.asState | formatStata }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="asDate" label="购买日期" width="120">
        </el-table-column>
        <el-table-column prop="asDefect" label="保修期" width="70">
        </el-table-column>
        <el-table-column prop="rate" label="折旧率" width="70">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleBack(scope.$index, scope.row, tableData)"
              >归还
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "personAsset",
  data() {
    return {
      show: false, //是否显示遮罩层
      isModify: false, //true:修改;false:添加
      tableData: [], //当前资产列表
      classifies: [],
      value1: "",
      options: [],
      assetsSrch: {
        asIdSrch: "", //资产编号
        asSpecSrch: "", //资产型号
        asStateSrch: "", //资产状态
        asDateStart: "", //开始购买日期
        asDateEnd: "", //结束购买日期
        classifyId: "",
      },
      formAsset: {
        asId: "",
        asSpec: "",
        asDate: "",
        asDefect: "", //保修期
        asState: "",
        classifyId: "",
        value: "",
      },
      formLabelWidth: "120px", //表单项目宽度
      batchPassArr: [], //要删除的资产编号数组
      isSrch: true, //是否显示资产一览
      selectedAssetObj: [], //被选中的资产对象
    };
  },
  filters: {
    // el-tag类型转换
    statusFilter(status) {
      const statusMap = {
        1: "",
        2: "warning",
        3: "success",
        4: "danger",
      };
      return statusMap[status];
    },
    // 状态显示转换
    formatStata(status) {
      const statusMap = {
        1: "待用",
        2: "申请中",
        3: "在用",
        4: "报废",
      };
      return statusMap[status];
    },
  },
  methods: {
    findClassify() {
      // 定义要传递的参数
      let params = new URLSearchParams();
      // 获取所有的分类列表
      this.$axios.post("http://localhost:8090/classify/init", params).then((res) => {
        // 设置分类列表
        this.classifies = res.data.obj;
        this.options = res.data.obj;
      });
    },
    changeTelescopic(data) {
      this.formAsset.classifyId = data;
      // console.log(this.formAsset.classifyId);
    },
    changeTelescopicSearch(data) {
      this.assetsSrch.classifyId = data;
      // console.log(this.formAsset.classifyId);
    },
    //获取所有的部门信息
    /**
     * pageCode:页码
     * pageSize:每页大小
     **/
    findAssetInfoWithPage() {
      // 定义要传递的参数
      let params = new URLSearchParams();
      // 获取所有的资产列表
      this.$axios.post("http://localhost:8090/asset/person", params).then((res) => {
        // 设置当前页的资产列表
        this.tableData = res.data.obj;
      });
    },
    handleSrch() {
      //设置资产一览可视
      this.isSrch = true;
      //返回当前页的固定资产
      this.findAssetInfoWithPage(this.pageCode, this.pageSize);
    }, //点击多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectedAssetObj = []; //被选中的资产对象
      this.batchPassArr = []; //每次点击需清空原本数组的内容
      this.batchAsIdsArr = [];
      this.multipleSelection.map((item) => {
        //遍历数组，把id存进自定义的数组里
        this.batchPassArr.push(item.id);
        //将选中的资产编号压入batchAsIdsArr
        this.batchAsIdsArr.push(item.asId);
        //将选中的资产对象压入selectedAssetObj
        this.selectedAssetObj.push(item);
      });
      this.batchPassArr = this.batchPassArr.join(",");
      this.batchAsIdsArr = this.batchAsIdsArr.join(",");
      console.log(this.batchPassArr);
      //输出选中的资产对象
      console.log(this.selectedAssetObj);
    },
    //每页的条数发生改变的时候
    //val:每页的条数
    handleSizeChange(val) {
      this.findAssetInfoWithPage(this.pageCode, val);
      //重新设置每页的条数
      this.pageSize = val;
    },
    //翻页的时候
    //val:页码
    handleCurrentChange(val) {
      this.findAssetInfoWithPage(val, this.pageSize);
    }, //归还
    handleBack() {
      //定义要传递的参数
      let params = new URLSearchParams();
      //获取录入后的资产信息
      params.append("asIds", this.batchAsIdsArr);
      this.$axios
        .post("http://localhost:8090/apply/back", params)
        .then((res) => {
          //判断是否成功
          if (res.data.code == 200) {
            // 清空选中的
            this.batchPassArr = [];
            //申请归还申请成功后刷新页面
            this.findAssetInfoWithPage();
            // 提示
            this.$message.success("资产归还申请提交");
            // 清空选中的
            this.$refs.multipleTable.clearSelection();
          } else if (res.data.code == 500) {
            this.$message.error("资产归还申请失败");
          }
          //输出标志
          console.log(1, res);
        })
        .catch((err) => {
          //输出标志及错误信息
          console.log(2, err);
        });
    },
  },
  created() {
    this.isSrch = true;
    // 返回当前页的固定资产
    this.findAssetInfoWithPage();
    this.findClassify();
  },
};
</script>