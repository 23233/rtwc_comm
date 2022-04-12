import { defineConfig } from 'dumi';
import * as path from 'path';

// git仓库名称
let storeName = 'rtwc_comm';

export default defineConfig({
  title: '无ui通用抽象业务代码',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',

  // more config: https://d.umijs.org/config
  // base和publicPath 主要作用于github page访问
  base: '/' + storeName,
  publicPath: '/' + storeName + '/', // 打包文件时，引入地址生成 publicPath/xxx.js
});
