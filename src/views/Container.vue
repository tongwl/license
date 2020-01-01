<template>
  <el-container>
    <el-aside>
      <Sidebar v-on:routeChange = 'changeReportTitle'></Sidebar>
    </el-aside>
    <router-view></router-view>
  </el-container>
</template>

<script>
  import Sidebar from '../components/Sidebar';
  export default {
    name: "Container",
    data () {
      return {
          reportTitle: '授权码管理',
      }
    },
    methods: {
      changeReportTitle(e) {
        /* eslint-disable */
        this.reportTitle = e;
      }
    },
    components: {
      Sidebar
    }
  }
</script>

<style lang="scss">
  .el-container {
    $title-color: #67C23A;
    height: 100%;
    .el-aside {
      height: 100%;
      width: auto!important;
    }
    .el-header {
      padding: 10px 20px;
      border-bottom: 2px solid $title-color;

      span.title {
        font-size: 28px;
        color: $title-color;
      }
    }
    .el-main {
      padding: 20px;
    }
  }
</style>
