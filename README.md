# egg-react-cli

> 该脚手架支持使用 webpack.DllPlugin 对常用npm包进行预编译，减少开发时的重复编译时间

> 使用了 [react-hot-loader](https://github.com/gaearon/react-hot-loader/tree/next)

## 开始
```bash
$ git clone git@github.com:ymzuiku/mutil-react-cli.git new-project
$ cd new-project
$ yarn install && npm run dll && npm run start
```

## 常用命令
> 下载项目、修改项目名、安装依赖、编译固定npm包至dll、启动egg并且启动webpack watch打包
```bash
$ npm run dll  (预先打包前端固定依赖)
$ npm run start  (启动client-project文件夹内的前端项目)
$ npm run build  (编译client-project文件夹内的前端项目)
```

### 针对某个目录启动

例如需要启动 client-store 目录：
```bash
$ client=client-store npm run start
```
以下命令可以设置目录，默认为 client-store 目录:
```bash
$ client=prject-name npm run dll
$ client=prject-name npm run start
$ client=prject-name npm run start-open  // 启动时自动打开浏览器
$ client=prject-name npm run build (编译至public/name)
```
client也可以简写成c
```bash
$ c=prject-name npm run dll
```

### 前端编译
预先编译dll包可以大幅度提高平时webpack的打包速度
```bash
$ c=client-project npm run dll
```
如果要修改dll打包设定，请修改package.json 中的 dll 数组, 当前默认设置为react相关的依赖，请根据需要自行修改.

### 代理
修改 package.json 中的 proxy为您所需的代理路径, 文档参考：
https://github.com/chimurai/http-proxy-middleware

约定，当 proxy 的端口和 prot 一致时，不启用代理, 以下是判断逻辑
```js
var ignoreHost = [
  'http://0.0.0.0:' + package.port,
  'http://127.0.0.1:' + package.port,
  'http://localhost:' + package.port,
]
if (package.proxy['/']) {
  ignoreHost.map((v)=>{
    if(package.proxy['/'].target === v) {
      package.proxy['/'] = {}
    }
  })
}
```

### 资源

所有非js的资源都放到项目文件夹下的 assets 中, 在项目编译时, 会把assets文件夹拷贝到编译的目标路径