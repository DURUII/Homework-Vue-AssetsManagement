<template>
  <div>
    <el-form
      :inline="true"
      :model="assetsSrch"
      class="demo-form-inline"
      style="margin-top: -5px"
      label-width="80px"
    >
      <el-form-item label="资产编号">
        <el-input
          v-model="assetsSrch.asIdSrch"
          prefix-icon="el-icon-search"
          placeholder="资产编号"
          clearable
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="资产型号">
        <el-input
          v-model="assetsSrch.asSpecSrch"
          prefix-icon="el-icon-search"
          placeholder="资产型号"
          clearable
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="资产状态">
        <el-select  clearable v-model="assetsSrch.asStateSrch" placeholder="资产状态" style="width: 150px"> 
          <el-option value="待用">待用</el-option>
          <el-option value="申请中">申请中</el-option>
          <el-option value="在用">在用</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="资产分类">
        <el-select
          v-model="value1"
          clearable
          placeholder="请选择"
          @change="changeTelescopicSearch"
          style="width: 150px"
        >
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.classify"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="购买范围">
        <template>
          <div class="block">
            <el-date-picker
              v-model="assetsSrch.asDateStart"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="开始日期"
              style="width: 150px"
            >
            </el-date-picker>
            <el-date-picker
              v-model="assetsSrch.asDateEnd"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
              style="width: 150px;margin-left: 10px"
            >
            </el-date-picker>
          </div>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button
          circle
          type="success"
          icon="el-icon-search"
          @click="handleSrch"
        ></el-button>
        <el-button type="primary" @click="handleAdd" v-if="role != 'employee'">添加</el-button>
        <el-button type="warning" @click="handleApply">申请</el-button>
        <el-button type="info" @click="handleBack">归还</el-button>
        <el-button type="danger" @click="handleBatchDel" v-if="role != 'employee'">批量故障</el-button>
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
        <el-table-column label="使用者" width="70">
          <template slot-scope="scope">
            <el-popover
              trigger="hover"
              placement="top"
              v-if="scope.row.userName != null"
            >
              <p>手机号: {{ scope.row.phone }}</p>
              <p>邮箱: {{ scope.row.email }}</p>
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.userName }}</el-tag>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作" shiro:hasPermission="update" v-if="role != 'employee'">
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
              >故障
            </el-button>
          </template>
        </el-table-column>
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
    <!--添加/编辑对话框-->
    <div v-show="show">
      <el-dialog
        title="资产信息"
        :visible.sync="dialogVisible"
        width="60%"
        v-if="dialogVisible"
      >
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
              <el-form-item label="资产编号" prop="noProp" v-if="isModify">
                <el-input
                  v-model="formAsset.asId"
                  :readonly="isModify"
                ></el-input>
              </el-form-item>
              <el-form-item label="资产编号" prop="asId" v-else>
                <el-input v-model="formAsset.asId"></el-input>
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
          <el-row>
            <el-form-item label="资产所属分类" prop="value">
              <el-select
                v-model="formAsset.value"
                clearable
                placeholder="请选择资产类型"
                @change="changeTelescopic"
              >
                <el-option
                  v-for="item in classifies"
                  :key="item.id"
                  :label="item.classify"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
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
  name: "assetSrch",
  data() {
    let validateAsId = (rule, value, callback) => {
      //判断账号的唯一性
      //定义要传递的参数
      let param = new URLSearchParams();
      //添加用户所录入的账号
      param.append("asId", value);
      this.$axios
        .post("http://localhost:8090/asset/chkAsId", param)
        .then((res) => {
          //判断是否存在
          if (res.data.code == 200) {
            callback("资产编号已存在");
          } else if (res.data.code == 500) {
            callback();
          }
        })
        .catch((err) => {
          //输出标志及错误信息
          console.log(2, err);
        });
    };
    return {
      role: '',
      show: false, //是否显示遮罩层
      isModify: false, //true:修改;false:添加
      tableData: [], //当前资产列表
      classifies: [],
      value1: "",
      options: [],
      pageCode: 1, //默认页码
      pageSize: 6, //每页5条
      totalPage: 5, //总页数
      pageOption: [6, 10, 15],
      totalElements: 100, //总记录数
      dialogVisible: false, //是否显示对话框
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
      rules: {
        /*对应el-form-item的prop属性*/
        asId: [
          {
            type: "string",
            required: true,
            message: "请输入资产编号",
            trigger: "blur",
          }, // 必填校验
          {
            // pattern: /^(host_|display_)[0-9]{3}$/,
            message: "只能输入有效的资产编号",
            trigger: "blur",
          },
          { validator: validateAsId, trigger: "blur" },
        ],
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
        value: [
          {
            type: "number",
            required: true,
            message: "请选择资产类型",
            trigger: "change",
          },
        ],
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
      this.$axios
        .post("http://localhost:8090/classify/init", params)
        .then((res) => {
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
    findAssetInfoWithPage(pageCode, pageSize) {
      // 定义要传递的参数
      let params = new URLSearchParams();
      // 添加页码
      params.append("pageNo", pageCode);
      // 添加每页条数
      params.append("pageSize", pageSize);
      // 添加要查询的资产编号
      params.append("asIdQuery", this.assetsSrch.asIdSrch);
      // 获取要查询的资产型号
      params.append("asSpecQuery", this.assetsSrch.asSpecSrch);
      // 获取要查询的资产状态
      params.append("asStateQuery", this.assetsSrch.asStateSrch);
      // 获取要查询开始购买日期
      params.append("asDateStart", this.assetsSrch.asDateStart);
      // 获取要查询结束购买日期
      params.append("asDateEnd", this.assetsSrch.asDateEnd);
      // 获取要查询资产分类
      params.append("classifyId", this.assetsSrch.classifyId);
      // 获取所有的资产列表
      this.$axios
        .post("http://localhost:8090/asset/init", params)
        .then((res) => {
          // 设置当前页的资产列表
          this.tableData = res.data.obj.rows;
          // 设置总页数
          this.totalPage = res.data.obj.pageCount;
          // 设置总记录数
          this.totalElements = res.data.obj.total;
          // 输出到控制台
          // console.log(this.tableData);
        });
    },
    handleSrch() {
      //设置资产一览可视
      this.isSrch = true;
      this.pageCode = 1;
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
    },
    //打开添加对话框
    handleAdd() {
      this.show = true; //显示遮罩层
      this.dialogVisible = true; //对话框可视
      //双向绑定数据
      this.formAsset.asId = ""; //资产编号
      this.formAsset.asSpec = ""; //资产型号
      this.formAsset.asDate = ""; //购买日期
      this.formAsset.asDefect = ""; //保修期
      this.formAsset.value = "";
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
          // 设置录入后的资产编号
          params.append("asId", this.formAsset.asId);
          // 设置录入后的资产型号
          params.append("asSpec", this.formAsset.asSpec);
          // 设置录入后的购买日期
          params.append("asDate", this.formAsset.asDate);
          // 设置录入后的保修期
          params.append("asDefect", this.formAsset.asDefect);
          // 设置资产分类id
          params.append("classifyId", this.formAsset.classifyId);
          this.$axios({
            method: "post",
            url: "http://localhost:8090/asset/add",
            data: params,
          })
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //添加成功后,刷新页面
                this.findAssetInfoWithPage(this.pageCode, this.pageSize);
                this.$message.success("资产添加成功");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，资产添加失败");
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
        this.$message.error("错误提示，请选中要故障的资产!");
        return;
      }
      this.selectedAssetObj.map((item) => {
        //遍历数组，把id存进自定义的数组里
        if (item.asState != 1) {
          this.$message.error("错误提示，该资产正在使用不能设置为故障!");
          return;
        }
      });
      //定义要传递的参数
      let params = new URLSearchParams();
      //获取录入后的部门信息
      params.append("ids", this.batchPassArr);

      this.$axios
        .post("http://localhost:8090/asset/batchDel", params)
        .then((res) => {
          //判断是否成功
          if (res.data.code == 200) {
            //故障成功后刷新页面
            this.findAssetInfoWithPage(this.pageCode, this.pageSize);
            this.$message.success("资产状态成功设置为故障");
          } else if (res.data.code == 500) {
            this.$message.error("错误提示", "资产批量故障失败");
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
      this.formAsset.asId = tableData[index].asId; //资产编号
      this.formAsset.asSpec = tableData[index].asSpec; //资产型号
      this.formAsset.asDate = tableData[index].asDate; //购买日期
      this.formAsset.asDefect = tableData[index].asDefect; //保修期
      this.formAsset.value = tableData[index].classifyId;
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
          // 设置资产分类id
          params.append("classifyId", this.formAsset.value);
          this.$axios
            .post("http://localhost:8090/asset/modify", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //辑成功后刷新页面
                this.findAssetInfoWithPage(this.pageCode, this.pageSize);
                this.$message.success("资产修改成功");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，资产修改失败");
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
      this.$confirm("是否将该资产设置为故障吗?, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //获取当前要故障的资产内部编号
          let id = tableData[index].id;
          // 判断是否设置为故障
          if (tableData[index].asState != 1) {
            this.$message.error("错误提示，该资产正在使用不能设置为故障!");
            return;
          }
          //定义要传递的参数
          let params = new URLSearchParams();
          //获取要故障的资产内部编号
          params.append("id", id);
          //发送故障请求
          this.$axios
            .post("http://localhost:8090/asset/del", params)
            .then((res) => {
              //判断是否成功
              if (res.data.code == 200) {
                //故障成功后,刷新页面
                this.findAssetInfoWithPage(this.pageCode, this.pageSize);
                this.$message.success("资产故障成功");
              } else if (res.data.code == 500) {
                this.$message.error("错误提示，资产故障失败");
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
    }, //申请
    handleApply() {
      //判断有没有选中要申请的资产
      if (this.batchPassArr.length == 0) {
        this.$message.error("错误提示，请选中要申请的资产!");
        return;
      }
      //是否有不可申请的资产的标志位
      let flg = false; //没有
      for (let int = 0; int < this.selectedAssetObj.length; int++) {
        //获取当前状态
        if (this.selectedAssetObj[int].asState != 1) {
          //设置标志位
          flg = true;
        }
      }
      //判断
      if (flg) {
        this.$message.error("只有待用的资产才方可申请!");
        // 清空选中的
        this.$refs.multipleTable.clearSelection();
        return;
      }
      //定义要传递的参数
      let params = new URLSearchParams();
      //获取录入后的资产信息
      params.append("asIds", this.batchAsIdsArr);
      this.$axios
        .post("http://localhost:8090/apply/app", params)
        .then((res) => {
          // 判断是否成功
          if (res.data.code == 200) {
            // 清空选中的
            this.batchPassArr = [];
            // 申请成功后刷新页面
            this.findAssetInfoWithPage(this.pageCode, this.pageSize);
            // 提示
            this.$message.success("资产申请已提交");
            // 清空选中的
            this.$refs.multipleTable.clearSelection();
          } else if (res.data.code == 500) {
            this.$message.error("资产申请失败");
          }
          // 输出标志
          console.log(1, res);
        })
        .catch((err) => {
          //输出标志及错误信息
          console.log(2, err);
        });
    }, //归还
    handleBack() {
      //判断有没有选中要归还的资产
      if (this.batchPassArr.length == 0) {
        this.$message.error("错误提示，请选中要归还的资产!");
        // 清空选中的
        this.$refs.multipleTable.clearSelection();
        return;
      } else {
        //是否有不可归还的资产的标志位
        let flg = false; //没有
        for (let int = 0; int < this.selectedAssetObj.length; int++) {
          //获取当前状态
          if (
            !this.selectedAssetObj[int].asState == 3 ||
            this.selectedAssetObj[int].account != window.sessionStorage.getItem("account")
          ) {
            //设置标志位
            flg = true;
          }
        }
        //判断
        if (flg) {
          this.$message.error("只有在用的并且是自己的机器才可以归还!");
          // 清空选中的
          this.$refs.multipleTable.clearSelection();
          return;
        }
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
              this.findAssetInfoWithPage(this.pageCode, this.pageSize);
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
      }
    },
  },
  created() {
    this.isSrch = true;
    this.role = window.sessionStorage.getItem("roleInfo");
    // 返回当前页的固定资产
    this.findAssetInfoWithPage(this.pageCode, this.pageSize);
    this.findClassify();
  },
};
</script>