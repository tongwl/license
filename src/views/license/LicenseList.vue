<template>
  <el-container class="license-el-container">
    <el-header>
      <span class="title">授权码管理</span>
      <el-input
        v-model="search"
        placeholder="请输入关键字搜索..."
        prefix-icon="el-icon-search"
        size="small"
      ></el-input>
      <el-button class="create-btn-top" type="primary" round @click="openCreateLicenseDialog()">生成授权码</el-button>
    </el-header>
    <el-main>
      <div class="license-container">
        <el-table
          :data="filterLicense()"
          stripe
          border
          style="width: 100%">
          <el-table-column
            prop="company"
            sortable
            label="公司"
          >
          </el-table-column>
          <el-table-column
            prop="installedID"
            sortable
            label="安装ID"
          >
          </el-table-column>
          <el-table-column
            prop="clusterSize"
            sortable
            label="集群规模"
          >
          </el-table-column>
          <el-table-column
            prop="licenseKey"
            sortable
            label="授权码"
          >
            <template slot-scope="scope">
              <el-tooltip popper-class="licenseKey-tooltip" effect="dark" :content="scope.row.licenseKey" placement="left-start">
                <span>{{scope.row.licenseKey}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="licenseDays"
            sortable
            label="授权天数"
          >
          </el-table-column>
          <el-table-column
            prop="activeTime"
            sortable
            label="授权时间"
          >
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="140">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改" placement="bottom">
                <i class="icon-i el-icon-edit" @click="openUpdateLicenseDialog(scope)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="导出授权码" placement="bottom">
                <i class="icon-i el-icon-download" @click="exportLicense(scope.row.licenseKey)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                <i class="icon-i el-icon-delete" @click="openDeleteLicenseDialog(scope.row.id, scope.row.company)"></i>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          :fullscreen="false"
          :destroy-on-close="true"
          :visible.sync="editDialogVisible"
          class="common-dialog-container"
          :title="dialogTitle"
        >
          <div>
            <el-row>
              <el-form :model="licenseInfo" :rules="rules" ref="licenseForm" label-width="100px">
                <el-col :span="24">
                  <el-form-item class="el-form-item-temp" label="临时授权码:" prop="isTemp">
                    <el-col>
                      <el-checkbox v-model="licenseInfo.isTemp" @change="changeLicenseInfo()"></el-checkbox>
                    </el-col>
                  </el-form-item>
                  <el-form-item label="公司名:" prop="company">
                    <el-col>
                      <el-input v-model="licenseInfo.company"  placeholder="请输入公司名"></el-input>
                    </el-col>
                  </el-form-item>

                  <el-form-item label="安装ID:" prop="installedID">
                    <input type="file" id="upload-installed-id" name="dashupload" class="hide" @change="uploadInstalledID($event)"/>
                    <el-input v-model="licenseInfo.installedID" class="upload-installedID-label"  placeholder="请输入安装ID">
                      <label title="导入安装ID" slot="append" for="upload-installed-id"><i class="el-icon-upload"></i></label>
                    </el-input>
                  </el-form-item>

                  <el-form-item label="授权天数:" prop="licenseDays">
                    <el-input v-model="licenseInfo.licenseDays"  placeholder="请输入授权天数" type="number"></el-input>
                  </el-form-item>

                  <el-form-item label="集群规模:" prop="clusterSize">
                    <el-input v-model="licenseInfo.clusterSize"  placeholder="请输入集群规模" type="number"></el-input>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>

          </div>
          <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('licenseForm')">取消</el-button>
        <el-button v-if="dialogTitle === '生成授权码'" type="primary" @click="submitForm('licenseForm', 'create')">确定</el-button>
        <el-button v-else type="primary" @click="submitForm('licenseForm', 'update')">确定</el-button>
      </span>
        </el-dialog>

        <el-dialog
          :fullscreen="false"
          :destroy-on-close="true"
          :visible.sync="deleteLicenseDialogVisible"
          class="common-dialog-container delete-dialog-container"
          @close="deleteLicenseDialogVisible = false"
          width="30%"
          top="30vh"
          title="提示"
        >
          <div class="delete-info-contariner">
            <i class="el-icon-warning"></i>请确认是否删除<b>{{deleteCompany}}</b>公司的授权码?
          </div>
          <span slot="footer" class="dialog-footer">
        <el-button @click="deleteLicenseDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteLicense()">确定</el-button>
      </span>
        </el-dialog>
      </div>
    </el-main>
  </el-container>
</template>

<script>
  import moment from "moment";
  import { saveAs } from 'file-saver';
  export default {
    name: 'LicenseManage',
    data() {
      return {
        host: "",
        editDialogVisible: false,
        deleteLicenseDialogVisible: false,
        dialogTitle: "生成授权码",
        licenseList: [],
        search: "",
        licenseInfo: {
          isTemp: false,
          id: null,
          company: null,
          installedID: null,
          licenseDays: null,
          clusterSize: null
        },
        rules: {
          company: [
            { required: true, message: '请输入公司名', trigger: 'blur' },
          ],
          installedID: [
            { required: true, message: '请输入安装ID', trigger: 'blur' }
          ],
          licenseDays: [
            { required: true, message: '请输入授权天数', trigger: 'blur' }
          ],
          clusterSize: [
            { required: true, message: '请输入集群规模', trigger: 'blur' }
          ]
        },
        deleteId: null,
        deleteCompany: null

      }
    },
    methods: {
      //license
      getLicenseList() {
        this.axios.get(`${this.host}license/licenseList`).then( res => {
          if (res && res.data) {
            this.licenseList = res.data;
            this._.forEach(this.licenseList, license => {
              license.activeTime = moment(license.activeTime).format("YYYY-MM-DD HH:mm:ss");
            });
          }
        },
        err => {}
        );
      },
      filterLicense() {
        return this._.filter(this.licenseList,
          data => {
          return !this.search ||
            String(data.licenseKey).toLowerCase().includes(this.search.toLowerCase()) ||
            String(data.activeTime).toLowerCase().includes(this.search.toLowerCase()) ||
            String(data.company).toLowerCase().includes(this.search.toLowerCase()) ||
            String(data.licenseDays).toLowerCase().includes(this.search.toLowerCase()) ||
            String(data.installedID).toLowerCase().includes(this.search.toLowerCase()) ||
            String(data.clusterSize).toLowerCase().includes(this.search.toLowerCase());
        });
      },
      initLicenseInfo() {
        this.licenseInfo = {
          isTemp: false,
          id: null,
          company: null,
          installedID: null,
          licenseDays: null,
          clusterSize: null
        };
      },
      uploadInstalledID(evt) {
        if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
          this.$notify.error({
            title: "error",
            message: this.$createElement('span', {style: 'color: teal'}, '您使用的浏览器并不支持文件上传，请手动输入授权码！'),
            position: 'bottom-right'
          });
          return;
        }
        const file = evt.target['files'][0];
        let me = this;
        const readerOnload = () => {
          return e => {
            let dash;
            try {
              dash = JSON.parse(e.target.result);
              me.licenseInfo.installedID = dash['installedID'];
            } catch (err) {
              me.$notify.error({
                title: "error",
                message: this.$createElement('span', {style: 'color: teal'}, '解析异常，请选择有效的文件！'),
                position: 'bottom-right'
              });
              return;
            }
          };
        };
        const reader = new FileReader();
        reader.onload = readerOnload();
        reader.readAsText(file);
        document.getElementById("upload-installed-id").innerText = "";
      },
      openCreateLicenseDialog() {
        this.editDialogVisible = true;
        this.dialogTitle = "生成授权码";
        this.initLicenseInfo();
      },
      createLicense() {
        this.axios.post(`${this.host}license/create`,
          {
            "isTemp": this.licenseInfo.isTemp ? 1 : 0,
            "company": this.licenseInfo.company,
            "installedID": this.licenseInfo.installedID,
            "licenseDays": this.licenseInfo.licenseDays,
            "clusterSize": this.licenseInfo.clusterSize
          }
          ).then(res => {
          this.editDialogVisible = false;
            if(res && res.status === 200) {
              this.getLicenseList();
              this.$notify({
                title: "Success",
                message: this.$createElement('span', {style: 'color: teal'}, '生成授权码成功!'),
                type: 'success',
                position: 'bottom-right'
              });
            } else {
              this.$notify.error({
                title: "error",
                message: this.$createElement('span', {style: 'color: teal'}, '生成授权码失败!'),
                position: 'bottom-right'
              });
            }
        }, () => {
          this.editDialogVisible = false;
          this.$notify.error({
            title: "error",
            message: this.$createElement('span', {style: 'color: teal'}, '生成授权码失败!'),
            position: 'bottom-right'
          });
        });
      },
      openUpdateLicenseDialog(licenseInfo) {
        this.editDialogVisible = true;
        this.dialogTitle = "修改授权码";
        this.licenseInfo = {
          id: licenseInfo.row.id,
          isTemp: licenseInfo.row.isTemp == 1 ? true : false,
          company: licenseInfo.row.company,
          installedID: licenseInfo.row.installedID,
          licenseDays: licenseInfo.row.licenseDays,
          clusterSize: licenseInfo.row.clusterSize
        }
      },
      updateLicense() {
        this.axios.put(`${this.host}license/update`,
          {
            "id": this.licenseInfo.id,
            "isTemp": this.licenseInfo.isTemp ? 1 : 0,
            "company": this.licenseInfo.company,
            "installedID": this.licenseInfo.installedID,
            "licenseDays": this.licenseInfo.licenseDays,
            "clusterSize": this.licenseInfo.clusterSize
          }
        ).then(res => {
          this.editDialogVisible = false;
          if (res && res.status === 200) {
            this.getLicenseList();
            this.$notify({
              title: "Success",
                message: this.$createElement('span', {style: 'color: teal'}, '修改授权码成功!'),
              type: 'success',
              position: 'bottom-right'
            });
          } else {
            this.$notify.error({
              title: "error",
              message: this.$createElement('span', {style: 'color: teal'}, '修改授权码失败!'),
              position: 'bottom-right'
            });
          }
        }, () => {
          this.editDialogVisible = false;
          this.$notify.error({
            title: "error",
            message: this.$createElement('span', {style: 'color: teal'}, '修改授权码失败!'),
            position: 'bottom-right'
          });
        });
      },
      changeLicenseInfo() {
        if (this.licenseInfo.isTemp) {
          this.licenseInfo.company = "temp";
          this.licenseInfo.installedID = "temp";
          this.licenseInfo.licenseDays = 30;
          this.licenseInfo.clusterSize = 10;
        } else {
          this.licenseInfo.company = null;
          this.licenseInfo.installedID = null;
          this.licenseInfo.licenseDays = null;
          this.licenseInfo.clusterSize = null;
        }
      },
      resetForm(formName) {
        this.editDialogVisible = false;
        this.$refs[formName].resetFields();
      },
      submitForm(formName, operation) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (operation === "update") {
              this.updateLicense();
            } else {
              this.createLicense();
            }
          } else {
            return false;
          }
        });
      },
      openDeleteLicenseDialog(id, company) {
        this.deleteLicenseDialogVisible = true;
        this.deleteId = id;
        this.deleteCompany = company;
      },
      deleteLicense() {
        if (this.deleteId) {
          this.axios.delete(`${this.host}license/delete?id=${this.deleteId}`)
            .then(res => {
              this.deleteLicenseDialogVisible = false;
              if (res && res.status === 200) {
                this.getLicenseList();
                this.$notify({
                  title: "Success",
                  message: this.$createElement('span', {style: 'color: teal'}, '删除授权码成功!'),
                  type: 'success',
                  position: 'bottom-right'
                });
              } else {
                this.$notify.error({
                  title: "error",
                  message: this.$createElement('span', {style: 'color: teal'}, '删除授权码失败!'),
                  position: 'bottom-right'
                });
              }
            }, () => {
              this.deleteLicenseDialogVisible = false;
              this.$notify.error({
                title: "error",
                message: this.$createElement('span', {style: 'color: teal'}, '删除授权码失败!'),
                position: 'bottom-right'
              });
            });
        }
      },
      exportLicense(licenseKey) {
        const blob = new Blob(
          [
            JSON.stringify({
              "授权码": licenseKey,
            })
          ],
          {
            type: 'application/json;charset=utf-8',
          }
        );
        saveAs(blob, 'licenseKey.json');
      },
    },
    mounted() {
      this.axios.get('./host.json').then( res => {
        if(res && res.data) {
          this.host = res.data.host;
          this.getLicenseList();
        }
      });
    }
  }
</script>

<style lang="scss">
  .license-el-container {
    $table-border-color: #ddd;
    $font-color: #333;
    $background-color: #67C23A;
    .el-header {
      position: relative;
      min-width: 620px;
      .create-btn-top {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: $background-color;
        border-color: $background-color;
      }

      .el-input {
        position: absolute;
        top: 50%;
        right: 140px;
        transform: translate(0, -50%);
        width: 180px;
        margin-bottom: 10px;
        input {
          border: none;

          &:focus {
            background: #f0f0f0;

            &::placeholder {
              color: #aaa;
            }
          }
        }

        i.el-icon-search {
          font-weight: bold;
          color: #999;
        }
      }
    }

    .license-container {
      .upload-installedID-label {
        label {
          &:hover {
            cursor: pointer;
            opacity: .6;
          }
        }
      }
      .el-table {
        color: $font-color;
        border-color: $table-border-color;
        thead{
          color: $font-color;
        }
        border-color: $table-border-color;
        th.is-leaf, td{
          border-bottom: 1px solid $table-border-color;
          border-right:1px solid $table-border-color;
          &:first-child{
            font-weight: bold;
          }
        }
        tbody{
          td{
            .icon-i{
              font-weight: bold;
              margin: 0 10px;
              &:hover{
                cursor: pointer;
              }
              &.el-icon-download {
                color: #67C23A;
              }
              &.el-icon-delete {
                color: #F56C6C;
              }
              &.el-icon-edit {
                color: #E6A23C;
              }
            }

            &:nth-child(4) {
              .cell {
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
        &::before {
          background-color: $table-border-color;
        }

        .el-table__fixed-right::before, .el-table__fixed::before {
          background-color: $table-border-color;
        }
      }
      .el-dialog {
        .el-form-item__label{
          font-weight: bold;
          text-align: right;
          padding-right: 20px;
          color: $font-color;
        }
        .el-dialog__header {
          border-bottom: 1px solid #efefef;
        }
        .el-dialog__body{
          padding-top: 5px;
          padding-bottom: 0;
        }
        .el-row{
          margin: 10px;
          .title-name{
            height: 40px;
            line-height: 40px;
          }
        }

        .el-form-item-temp {
          margin-bottom: 6px;

          .el-checkbox {
            .el-checkbox__label {
              font-weight: normal;
              color: #303133;
              font-size: 14px;
            }
          }
        }
      }

      .delete-dialog-container {
        .el-dialog {
          .el-dialog__header {
            border-bottom: 0;
          }

          .el-dialog__body {
            color: rgb(96, 98, 102);
            padding: 10px 20px;

            .delete-info-contariner {
              height: 24px;
              line-height: 24px;
              i {
                color: rgb(230, 162, 60);
                font-size: 20px;
                position: relative;
                top: 2px;
                margin-right: 5px;
              }
              b {
                font-weight: bold;
                color: #f33;
              }
            }
          }
        }
      }

      .common-dialog-container {
        padding: 20px;
      }
    }
  }

  .licenseKey-tooltip {
    display: block;
    word-break: break-all;
    width: 300px;
  }

  .hide {
    display: none;
  }

</style>
