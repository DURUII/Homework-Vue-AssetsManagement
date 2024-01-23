<template>
  <div>
    <el-form
      :inline="true"
      :model="assetsClassify"
      class="demo-form-inline"
      style="margin-top: -5px"
    >
      <el-form-item label="资产分类名称">
        <el-input
          v-model="assetsClassify.classify"
          prefix-icon="el-icon-search"
          placeholder="资产分类名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="资产分类描述">
        <el-input
          v-model="assetsClassify.cdesc"
          prefix-icon="el-icon-search"
          placeholder="资产分类描述"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="handleSrch"
        ></el-button>
        <el-button type="primary" @click="handleAdd" v-if="role != 'employee'">添加</el-button>
        <el-button type="danger" @click="handleBatchDel" v-if="role != 'employee'">批量删除</el-button>
      </el-form-item>
    </el-form>
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
        <el-table-column prop="classify" label="分类名称" width="100">
        </el-table-column>
        <el-table-column prop="cdesc" label="分类描述" width="320">
        </el-table-column>
        <el-table-column label="操作" v-if="role != 'employee'">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row, tableData)"
              >编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row, tableData)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加/编辑对话框-->
    <div v-show="show">
      <el-dialog title="资产信息" :visible.sync="dialogVisible" width="50%">
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
              <el-form-item label="分类名称" prop="classify">
                <el-input v-model="formAsset.classify"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item label="分类描述" prop="cdesc">
                <el-input v-model="formAsset.cdesc"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <!--编辑的提交按钮-->
          <el-button type="primary" @click="handleModify" v-show="isModify"
            >保存</el-button
          >
          <!--添加的提交按钮-->
          <el-button type="primary" @click="add" v-show="!isModify"
            >添加</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "assetClassify",
  data() {
    return {
      role: '',
      show: false, //是否显示遮罩层
      isModify: false, //true:修改;false:添加
      tableData: [], //当前资产列表
      dialogVisible: false, //是否显示对话框
      assetsClassify: {
        id: "", // 分类编号
        classify: "", // 分类型号
        cdesc: "", // 分类状态
      },
      formAsset: {
        id: "", // 分类编号
        classify: "", // 分类型号
        cdesc: "", // 分类状态
      },
      rules: {
        classify: [
          {
            type: "string",
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
        cdesc: [
          {
            type: "string",
            required: true,
            message: "请输入分类描述",
            trigger: "blur",
          },
        ],
      },
      formLabelWidth: "120px", //表单项目宽度
      batchPassArr: [], //要删除的资产编号数组
      isSrch: true, //是否显示资产一览
      selectedAssetObj: [], //被选中的资产对象
    };
  },
  methods: {
    //获取所有的部门信息
    /**
     * pageCode:页码
     * pageSize:每页大小
     **/
    findAssetInfoWithPage() {
      //定义要传递的参数
      let params = new URLSearchParams();
      //设置录入后的资产型号
      params.append("classify", this.assetsClassify.classify);
      //设置录入后的购买日期
      params.append("cdesc", this.assetsClassify.cdesc);
      //获取所有的部门列表
      this.$axios
        .post("http://localhost:8090/classify/init", params)
        .then((res) => {
          //设置当前页的员工列表
          this.tableData = res.data.obj;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectedAssetObj = []; //被选中的资产对象
      this.batchPassArr = []; //每次点击需清空原本数组的内容
      this.multipleSelection.map((item) => {
        //遍历数组，把id存进自定义的数组里
        this.batchPassArr.push(item.id);
        //将选中的资产对象压入selectedAssetObj
        this.selectedAssetObj.push(item);
      });
      this.batchPassArr = this.batchPassArr.join(",");
      console.log(this.batchPassArr);
      //输出选中的资产对象
      console.log(this.selectedAssetObj);
    },
    handleSrch() {
      //设置资产一览可视
      this.isSrch = true;
      //返回当前页的固定资产
      this.findAssetInfoWithPage();
    },
    //打开添加对话框
    handleAdd() {
      this.show = true; //显示遮罩层
      this.dialogVisible = true; //对话框可视
      //双向绑定数据
      this.formAsset.classify = ""; //资产编号
      this.formAsset.cdesc = ""; //资产型号
      //对话框为添加对话框
      this.isModify = false;
    },
    add() {
      //获取资产编号
      /*if(!/^(host_|display_)[0-9]{3}$/.test(this.formAsset.asId)){
                    this.$message.error('错误提示，不是有效的资产编号！');
                    return;
                }*/
      this.$refs["formAsset"].validate((valid) => {
        if (valid) {
          //定义要传递的参数
          let params = new URLSearchParams();
          //设置录入后的资产型号
          params.append("classify", this.formAsset.classify);
          //设置录入后的购买日期
          params.append("cdesc", this.formAsset.cdesc);
          //添加部门信息
          this.$axios({
            method: "post",
            url: "http://localhost:8090/classify/add",
            data: params,
          })
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //添加成功后,刷新页面
                this.findAssetInfoWithPage();
                this.$message.success("资产类别添加成功");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，资产类别添加失败");
              }
              //同时关闭遮罩层
              this.show = true;
              //关闭对话框
              this.dialogVisible = false;
            })
            .catch((err) => {
              //输出错误消息
              console.info(err);
            });
        } else {
          console.log("error");
        }
      });
    },
    handleBatchDel() {
      //判断有没有选中要故障的资产
      if (this.batchPassArr.length == 0) {
        this.$message.error("错误提示，请选中要删除的资产分类!");
        return;
      }
      //定义要传递的参数
      let params = new URLSearchParams();
      //获取录入后的部门信息
      params.append("ids", this.batchPassArr);

      this.$axios
        .post("http://localhost:8090/classify/batchDel", params)
        .then((res) => {
          //判断是否成功
          if (res.data.code == 200) {
            //故障成功后刷新页面
            this.findAssetInfoWithPage();
            this.$message.success("资产分类成功删除！");
          } else if (res.data.code == 301) {
            this.$message.error("错误提示，该资产类别正在使用删除失败！");
          } else if (res.data.code == 500) {
            this.$message.error("错误提示", "资产分类批量删除失败");
          }
          //输出标志
          console.log(1, res);
        })
        .catch((err) => {
          //输出标志及错误信息
          console.log(2, err);
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
      //对话框为修改对话框
      this.isModify = true;
      //回填
      this.formAsset.id = tableData[index].id; //资产内部编号
      this.formAsset.classify = tableData[index].classify; //资产编号
      this.formAsset.cdesc = tableData[index].cdesc; //资产型号
    },
    handleModify() {
      this.$refs["formAsset"].validate((valid) => {
        if (valid) {
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取修改后的资产信息
          params.append("id", this.formAsset.id);
          params.append("classify", this.formAsset.classify);
          params.append("cdesc", this.formAsset.cdesc);
          this.$axios
            .post("http://localhost:8090/classify/modify", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //辑成功后刷新页面
                this.findAssetInfoWithPage();
                this.$message.success("资产类别修改成功");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，资产类别修改失败");
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
    /**
     * 对选中的资产进行删除操作
     * @param index 行索引
     * @param row 该行对应的部门对象
     * @param tableData 部门列表
     */
    handleDelete(index, row, tableData) {
      this.$confirm("是否将该资产分类删除?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取要故障的资产内部编号
          params.append("id", tableData[index].id);
          //发送故障请求
          this.$axios
            .post("http://localhost:8090/classify/del", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //故障成功后刷新页面
                this.findAssetInfoWithPage();
                this.$message.success("资产分类成功删除！");
              } else if (res.data.code == 301) {
                this.$message.error("错误提示，该资产类别正在使用删除失败！");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示", "资产分类删除失败");
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
            message: "已取消删除！",
          });
        });
    },
  },
  created() {
    this.isSrch = true;
    this.role = window.sessionStorage.getItem("roleInfo");
    // 返回当前页的固定资产
    this.findAssetInfoWithPage();
  },
};
</script>