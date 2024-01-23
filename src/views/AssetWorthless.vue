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
      height="520px"
      style="width: 100%"
    >
      <el-table-column prop="id" label="资产内部编号" v-if="false">
      </el-table-column>
      <el-table-column prop="asId" label="资产编号"> </el-table-column>
      <el-table-column prop="asSpec" label="型号"> </el-table-column>
      <el-table-column prop="asState" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.asState | statusFilter"
            disable-transitions
            >{{ scope.row.asState | formatStata }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column sortable prop="asDate" label="购买日期">
      </el-table-column>
      <el-table-column prop="asDefect" label="保修期"> </el-table-column>
      <el-table-column prop="isBreak" label="是否故障">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isBreak == '1' ? 'danger' : 'success'"
            disable-transitions
            >{{ scope.row.isBreak == "1" ? "故障" : "正常" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="role != 'employee'">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row, tableData)"
            
            v-if="scope.row.isBreak =='1'"

            >维修
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--添加/编辑对话框-->
    <div v-show="show">
      <el-dialog title="title" :visible.sync="dialogVisible" width="70%">
        <div slot="title" class="el-dialog__header">
          <span>资产信息</span>
          <el-tag type="danger" effect="dark">故障</el-tag>
        </div>
        <el-form
          label-position="top"
          label-width="formLabelWidth"
          :rules="rules"
          ref="formAsset"
          :model="formAsset"
        >
          <!--vue,如果key就不会渲染;所以,在添加和修改不同的状态下,都需要2个资产编号框,给不同prop属性-->
          <el-row>
            <el-col :span="10">
              <el-form-item label="资产编号" prop="asId">
                <el-input v-model="formAsset.asId" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="2">&nbsp;&nbsp;</el-col>
            <el-col :span="10">
              <el-form-item label="资产型号" prop="asSpec">
                <el-input v-model="formAsset.asSpec"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="购买日期" prop="asDate">
                <template>
                  <div class="block">
                    <el-date-picker
                      v-model="formAsset.asDate"
                      type="date"
                      placeholder="购买日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                  </div>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="保修期" prop="asDefect">
                <el-input v-model="formAsset.asDefect"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <!--编辑的提交按钮-->
          <el-button type="primary" @click="handleModify">维修</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "assetWorthless",
  data() {
    return {
      role: '',
      tableData: [], //当前申请列表
      show: false, //是否显示遮罩层
      dialogVisible: false, //是否显示对话框
      rules: {
        /*对应el-form-item的prop属性*/
        asSpec: [
          {
            type: "string",
            required: true,
            message: "请输入资产型号",
            trigger: "blur",
          },
        ],
        asDate: [
          {
            type: "string",
            required: true,
            message: "请输入购买日期",
            trigger: "blur",
          },
        ],
        asDefect: [
          {
            type: "string",
            required: true,
            message: "请输入保修期",
            trigger: "blur",
          },
        ],
      },
      formAsset: {
        id: "",
        asId: "",
        asSpec: "",
        asDate: "",
        isBreak: "",
        asDefect: "", //保修期
      },
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
    //获取不可用资产一览
    findAllWorthlessInfo() {
      //定义要传递的参数
      let params = new URLSearchParams();
      //获取不可用资产一览
      this.$axios
        .post("http://localhost:8090/asset/worthless", params)
        .then((res) => {
          //设置当前页的员工列表
          this.tableData = res.data.obj;
          // 输出到控制台
          // console.log(this.tableData);
        });
    },
    /**
     * 编辑 要回显数据
     * @param index 行号
     * @param row 当前行所对应的部门对象
     * @param tableData 当前部门信息
     */
    handleEdit(index, row, tableData) {
      //让遮罩层显示
      this.show = true;
      //对话框显示
      this.dialogVisible = true;
      //回填
      this.formAsset.id = tableData[index].id; //资产内部编号
      this.formAsset.asId = tableData[index].asId; //资产编号
      this.formAsset.asSpec = tableData[index].asSpec; //资产型号
      this.formAsset.asDate = tableData[index].asDate; //购买日期
      this.formAsset.asDefect = tableData[index].asDefect; //保修期
    },
    handleModify() {
      this.$refs["formAsset"].validate((valid) => {
        if (valid) {
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取修改后的资产信息
          params.append("id", this.formAsset.id);
          params.append("asId", this.formAsset.asId);
          params.append("asSpec", this.formAsset.asSpec);
          params.append("asDate", this.formAsset.asDate);
          params.append("asDefect", this.formAsset.asDefect);
          this.$axios
            .post("http://localhost:8090/asset/maintain", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //辑成功后刷新页面
                this.findAllWorthlessInfo();
                this.$message.success("资产维修成功");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，资产维修失败");
              }
              //关闭遮罩层
              this.show = false;
              //关闭对话框
              this.dialogVisible = false;
              //输出标志
              console.log(1, res);
            })
            .catch((err) => {
              //输出标志及错误信息
              console.log(2, err);
            });
        }
      });
    },
  },
  created: function () {
    this.findAllWorthlessInfo();
    this.role = window.sessionStorage.getItem("roleInfo");
  },
};
</script>