# Danmaku-host

基于 Electron 的 QQ 弹幕机，将 QQ 群消息显示为屏幕上的弹幕。

## 运行方法

1. 全局安装 Electron `npm i -g electron` 或下载 [Electron 可执行文件](https://github.com/electron/electron/releases)
2. `electron index.js`

## 项目结构

- index.js
    - Electron 主进程（Node）脚本，没有特殊功能，只是打开 index 和 overlay 两个窗口

- index.html
    - 控制台窗口，同时发起连接到一个 mirai-http-api websocket 接口，监听消息流
    - 发送需要显示的弹幕信息到 overlay

- overlay.html
    - 渲染弹幕的窗口

## 打包发布
- 加入electron-forge作为打包工具，打包文件在本地out目录下
- ``` bash
    npm install
    npm run make
  ```
## TODO

- 用 React 重写 (?)
- 集成 [oicq](https://github.com/takayama-lily/oicq) 等 bot 库，独立运行。
