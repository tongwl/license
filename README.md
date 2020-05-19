# 简介

### 依赖工具

node (v10.15.3)

npm  (6.4.1)

### 安装插件

```
npm install
```

### 修改service ip和端口

若启动的service不与前端服务在同一机器上，或service端口不是8080，在**public/host.json**文件中修改service ip和port。

### 启动服务

```
yarn start
```

**若以上自带的前端服务器不能满足需求，可以通过以下命令打包，然后部署到更好的服务器上(如nginx等)。**

### 打包发布

```
npm run build
```

* 运行上述命令后会产生一个dist文件夹，将该文件夹部署在服务器上，将入口文件指定为dist文件夹下的index.html即可。
* **如若使用dist文件夹拿去部署，那么请再dist/host.json配置api service host。**

### nodes

linux离线安装nginx教程：

[https://github.com/tongwl/nginx_learning/tree/master/linux_nginx/linux%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85nginx%E6%95%99%E7%A8%8B](https://github.com/tongwl/nginx_learning/tree/master/linux_nginx/linux离线安装nginx教程)



