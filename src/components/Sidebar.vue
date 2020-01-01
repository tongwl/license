<template>
  <div class="sidebar-container">
    <el-radio-group v-model="isCollapse">
      <el-radio-button :label="true" v-show="!isCollapse">
        <i class="el-icon-arrow el-icon-arrow-left" ></i>
      </el-radio-button>
      <el-radio-button :label="false" v-show="isCollapse">
        <i class="el-icon-arrow el-icon-arrow-right"></i>
      </el-radio-button>
    </el-radio-group>
    <el-menu
      router
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :collapse="isCollapse">
      <div class="img-container">
        <img src="../assets/logo.svg"  alt="" :class="{small: isCollapse}">
      </div>
      <el-menu-item index="2" :route="{name:'licenseList', params: {type: '授权码管理'}}">
        <i class="el-icon-menu"></i>
        <span slot="title">授权码管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "Sidebar",
    data () {
      return {
        isCollapse: false,

      }
    },
    methods: {
      menuRouteChange(type) {
        this.$emit('routeChange', type);
      },

    },
    watch: {
      $route(to) {
        this.menuRouteChange(to.params.type);
      }
    }
  }
</script>

<style lang="scss">
  .sidebar-container{
    height: 100%;
    width: auto!important;
    position: relative;
    .el-radio-group {
      font-size: 14px;
      position:absolute;
      right: 1px;
      top: 50%;
      transform: translate(0, -50%);
      z-index: 1;
      display: inline-block;
      width:15px;
      height:40px;
      line-height: 40px;
      cursor: pointer;

      &:hover {
        .el-radio-button {
          .el-radio-button__inner {
            color: #fff;
            opacity: 0.8;
          }
        }
      }

      .el-radio-button {
        display: inline-block;
        width: 100%;
        height:100%;
        line-height: 100%;

        .el-radio-button__inner {
          width: 100%;
          height: 100%;
          line-height: 40px;
          padding: 0;
          background-color: #54616e;
          opacity: 0.6;
          color: #e3eaf1;
          border: 0;
          border-radius: 0 !important;
        }
      }
    }
    .el-menu{
      height: 100%;
      &:not(.el-menu--collapse) {
        width: 160px;
      }
      .img-container {
        text-align: center;
        padding: 10px 0;
        img {
          width: 128px;
          transition: width 1s;
        }

        img.small {
          width: 38px;
        }
      }
      .el-submenu .el-menu-item {
        min-width: 199px;
      }
    }
  }
</style>
