<!-- <template>
  <div>
    <div style="float: left; width: 50%">
      <el-card
        shadow="hover"
        class="box-card"
        style="width: 300px; height: 120px"
      >
        <div>
          <div style="float: left;margin-top: -15px;">
            <lottie
              :options="defaultOptions"
              :height="100"
              :width="100"
              v-on:animCreated="handleAnimation"
            />
          </div>
          <div
            style="
              float: left;
              font-size: medium;
              line-height: 5;
              margin-left: 5px;
            "
          >
            今日新增用户：{{ dayAddUser }} 人
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 20px">
        <div id="pie" style="width: 100%; height: 380px"></div>
      </el-card>
    </div>

    <div style="float: left; width: 50%">
      <el-card
        shadow="hover"
        class="box-card"
        style="width: 300px; height: 120px; margin-left: 20px"
      >
        <div>
          <div style="float: left;margin-top: -15px;">
            <lottie
              :options="defaultOptions1"
              :height="100"
              :width="100"
              v-on:animCreated="handleAnimation2"
            />
          </div>
          <div
            style="
              float: left;
              font-size: medium;
              line-height: 5;
              margin-left: 15px;
            "
          >
            <div>今日新增资产：{{ dayAddAssets }}</div>
          </div>
        </div>
      </el-card>
      <el-card style="margin-top: 20px; margin-left: 20px">
        <div id="his" style="width: 100%; height: 380px"></div>
      </el-card>
    </div>
  </div>
</template>


<script>
import animationData from "../assets/lottie/data.json";
import animationData1 from "../assets/lottie/head.json";
const echarts = require("echarts");
export default {
  name: "mainStystem",
  data() {
    return {
      defaultOptions: { animationData: animationData },
      defaultOptions1: { animationData: animationData1 },
      animationSpeed: 1,
      anim: {},
      anim1: {},
      dayAddUser: "",
      dayAddAssets: "",
      opinion: [],
      opinionData: [],
      option1: [],
      optionData: [],
    };
  },
  methods: {
   
    handleAnimation: function (anim) {
      this.anim = anim;
      console.log(anim); //这里可以看到 lottie 对象的全部属性
    },
    handleAnimation2: function (anim1) {
      this.anim1 = anim1;
      console.log(anim1); //这里可以看到 lottie 对象的全部属性
    },
    //异步
    async drawPie(id) {
      //定义要传递的参数
      let params = new URLSearchParams();
      //发送请求,获取各种类型资产的个数
      //等待
      await this.$axios
        .post("http://localhost:8090/api/user/addUserNumRate", params)
        .then((res) => {
          //判断是否成功
          if (res.data.obj) {
            this.opinionData = [];
            this.opinion = [];
            this.dayAddUser = res.data.obj.dayAdd;
            res.data.obj.userNumRate.map((item) => {
              //遍历数组，把id存进自定义的数组里
              this.opinion.push(item.time);
              this.opinionData.push(item.userNum);
            });
            // 输出到控制台
            console.log(this.opinionData);
            console.log(this.opinion);
          }
        })
        .catch((err) => {
          //输出错误消息
          console.info(err);
        });
      var charts = echarts.init(document.getElementById(id));
      charts.setOption({
        title: {
          text: "近30天新增用户",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.opinion,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            // name: "Line 2",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(0, 221, 255)",
                },
                {
                  offset: 1,
                  color: "rgb(77, 119, 255)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: this.opinionData,
          },
        ],
      });
    },
    async drawHistogram(id) {
      //定义要传递的参数
      let params = new URLSearchParams();
      //发送请求,获取各种类型资产的个数
      //等待
      await this.$axios
        .post("http://localhost:8090/asset/addAssetsNumRate", params)
        .then((res) => {
          //判断是否成功
          if (res.data.obj) {
            this.optionData = [];
            this.option1 = [];
            this.dayAddAssets = res.data.obj.dayAddAsset;
            res.data.obj.assetNumRate.map((item) => {
              //遍历数组，把id存进自定义的数组里
              this.option1.push(item.time);
              this.optionData.push(item.assetsNum);
            });
            // 输出到控制台
            console.log(this.optionData);
            // console.log(this.option1);
          }
        })
        .catch((err) => {
          //输出错误消息
          console.info(err);
        });
      var charts1 = echarts.init(document.getElementById(id));
      charts1.setOption({
        title: {
          text: "近30天资产新增数量",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.option1,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [
          {
            // name: "Line 5",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            label: {
              show: true,
              position: "top",
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgb(255, 191, 0)",
                },
                {
                  offset: 1,
                  color: "rgb(224, 62, 76)",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: this.optionData,
          },
        ],
      });
    },

  },
  mounted: function () {
    this.drawPie("pie");
    this.drawHistogram("his");
  },
};
</script> -->