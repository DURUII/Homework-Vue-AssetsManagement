<template>
  <div>
    <h2>资产报废</h2>
    每年折旧25%,四年这个机器就报废了!<br />
    <el-button type="primary" @click="handleDepreciation">资产折旧</el-button>
  </div>
</template>

<script>
export default {
  name: "assetDepreciation",
  methods: {
    //资产折旧
    handleDepreciation() {
      //定义要传递的参数
      let params = new URLSearchParams();
      //发送故障请求
      this.$axios
        .post("http://localhost:8090/asset/depreciation", params)
        .then((res) => {
          //判断是否成功
          if (res.data.code == 200) {
            //资产折旧成功后,给予提示
            this.$message("提示，资产折旧成功");
          } else if (res.data.code == 500) {
            this.$message.error("错误提示，资产折旧失败");
          }
        })
        .catch((err) => {
          //输出错误消息
          console.info(err);
        });
    },
  },
};
</script>