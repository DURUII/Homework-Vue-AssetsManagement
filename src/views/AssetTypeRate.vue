<template>
  <div>
    <div id="pieReport" style="width: 45%; height: 500px; float: left"></div>
    <div id="histogram" style="width: 100%; height: 500px; float: left"></div>
  </div>
  
</template>

<script>
const echarts = require('echarts');
export default {
  name: "assetTypeRate",
  data() {
    return {
      opinion: [],
      opinionData: [],
      option1: [],
      optionData: [],
    };
  },
  methods: {
    //异步
    async drawPie(id) {
      //定义要传递的参数
      let params = new URLSearchParams();
      //发送请求,获取各种类型资产的个数
      //等待
      await this.$axios
        .post("http://localhost:8090/asset/assetTypesRate", params)
        .then((res) => {
          //判断是否成功
          if (res.data.obj) {
            this.opinionData = [];
            this.opinion = [];
            res.data.obj.map((item) => {
              //遍历数组，把id存进自定义的数组里
              this.opinion.push({ name: item.asState });
              this.opinionData.push({ name: item.asState, value: item.asNum });
            });
            // 输出到控制台
            // console.log(this.opinionData);
            // console.log(this.opinion);
          }
        })
        .catch((err) => {
          //输出错误消息
          console.info(err);
        });
      var charts = echarts.init(document.getElementById(id));
      charts.setOption({
        title: {
          text: "各种资产的占比",
          subtext: "占比数据",
          left: "center",
        },
        tooltip: {
          trigger: "item", //将每一种状态的资产都触发
          formatter: "{a}<br/>{b}:{c}({d}%)", //a:系列名;b:数据名(类型名称);c:数据值;d:百分比
        },
        legend: {
          orient: "vertical", //布局朝向
          x: "left", //标记靠左还是靠右
          data: this.opinion, //提供标记数据(各种资产类型名称)
        },
        //系列
        series: [
          {
            name: "各种资产的占比", //系列名
            type: "pie", //图形类型
            radius: "70%", //饼图外半径
            center: ["50%", "60%"], //中心的坐标
            data: this.opinionData, //各种资产类型信息(类型名称,个数)
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      });
    },
    async drawHistogram(id) {
      //定义要传递的参数
      let params = new URLSearchParams();
      //发送请求,获取各种类型资产的个数
      //等待
      await this.$axios
        .post("http://localhost:8090/classify/classifyTypesRate", params)
        .then((res) => {
          //判断是否成功
          if (res.data.obj) {
            this.optionData = [];
            this.option1 = [];
            res.data.obj.map((item) => {
              //遍历数组，把id存进自定义的数组里
              this.option1.push(item.classify);
              this.optionData.push(item.classifyNum);
            });
            // 输出到控制台
            // console.log(this.optionData);
            // console.log(this.option1);
          }
        })
        .catch((err) => {
          //输出错误消息
          console.info(err);
        });
      var charts1 = echarts.init(document.getElementById(id));
      charts1.setOption({
        xAxis: {
          type: "category",
          data: this.option1,
          axisLabel:{
            rotate:-20,
          },
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.optionData,
            type: "bar",
            showBackground: true,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      });
    },
  },
  mounted: function () {
    this.drawPie("pieReport");
    this.drawHistogram("histogram");
  },
};
</script>