<div align="center">
<img src="public/icon-128.png" alt="logo"/>
<h1> Chrome Extension Boilerplate with<br/>React + Vite + TypeScript</h1>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/build-zip.yml/badge.svg)
<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/Jonghakseo/chrome-extension-boilerplate-react-viteFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>


> This project is listed in the [Awesome Vite](https://github.com/vitejs/awesome-vite)

</div>


## 项目启动

使用 node 版本：16.18.0
## 项目功能

TOP 优化项：(2024.03.30 23:41:47)
- [ ] 编辑书签-所属文件夹
- [ ] 批量修改-修改所属文件夹；
- [ ] 修改筛选顺序，依次为-时间，文件夹名-书签名；

**书签管理**
- 书签搜索
  - [x] 默认按照 【近期一周】 添加的 书签进行搜索；对筛选条件【收藏日期】设置初始值为最近一周；
  - 根据不同的筛选条件进行搜索；
    - [x] 书签名；
    - [x] 按来源分类；
    - [x] 收藏日期；
  - [x] 分页搜索、跳转页面；

- 修改书签
  - [x] 修改 书签自带属性：书签名，链接；
  - [ ] 修改 书签自定义属性：自定义描述，来源；
  - [ ] 上述修改书签，考虑数据持久化，存储在 storage 中，支持多端同步；

- 删除书签
  - [x] 单个删除
  - [x] 批量删除，代码暂时注释了，这个操作风险太大了；
  - [x] 删除添加日志，缓存到 localstorage 中；

- 列表展示优化：
  - [ ] 链接和标题，定义最大宽度，超长省略；

- 创建片段
  - [ ] 可设置一张主图，图片来源参考 必应的 主题图片；
  - [x] 可设置片段名；
  - [x] 可预览添加的 书签列表；
  - [x] 支持书签上下拖拽排序
  - [x] 数据保存在 storage 中，~~支持多端同步~~（暂不支持）；

**片段管理**

- 片段搜索
  - [ ] 按照片段名、创建日期 筛选条件搜索；【创建日期】默认值为最近一周；
  - [ ] 默认搜索展示 最近一周数据；
- 查看详情
  - [ ] 删除单行书签；
- 列表：多选 片段，创建日报；
  - [ ] 进入创建日报详情页，里面是左右2侧看板，左边是 markdown 的书签和片段；右侧是预览；

**日报管理**

- 日报搜索
  - 筛选条件：
    - [ ] 日报名称；
    - [ ] 创建时间；
- 列表页：
  - [ ] 列表行，操作列可单个编辑，支持编辑日报，跳转至日报编辑页面；
- 日报详情页
  - 日报编辑
  - 导出日报：支持多种导出格式：`md, html,`
- 自动化部署，支持配置化自动部署到个人网站；

**模板管理**

拥有多个子菜单，分为如下：
- 片段模板
- 日报模板
- 周报模板；

**数据同步管理**

支持同步多个博客平台的浏览记录：

- 掘金
- 博客园
- CSDN
- 思否
- 知乎

## Table of Contents

- [项目启动](#项目启动)
- [项目功能](#项目功能)
- [Table of Contents](#table-of-contents)
- [Intro ](#intro-)
- [Features ](#features-)
- [Installation ](#installation-)
  - [Procedures ](#procedures-)
- [Screenshots ](#screenshots-)
  - [New Tab ](#new-tab-)
  - [Popup ](#popup-)
- [Sample ](#sample-)
- [Documents ](#documents-)
- [Star History](#star-history)
- [Thanks To](#thanks-to)

## Intro <a name="intro"></a>
This boilerplate is made for creating chrome extensions using React and Typescript.
> The focus was on improving the build speed and development experience with Vite.

## Features <a name="features"></a>
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vite](https://vitejs.dev/)
- [SASS](https://sass-lang.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- HRR(Hot Rebuild & Refresh/Reload)

## Installation <a name="installation"></a>

### Procedures <a name="procedures"></a>
1. Clone this repository.
2. Change `name` and `description` in package.json => **Auto synchronize with manifest** 
3. Run `yarn install` or `npm i` (check your node version >= 16.6, recommended >= 18)
4. Run `yarn dev` or `npm run dev`
5. Load Extension on Chrome
   1. Open - Chrome browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpacked extension
   5. Select - `dist` folder in this project (after dev or build)
6. If you want to build in production, Just run `yarn build` or `npm run build`.

## Screenshots <a name="screenshots"></a>

### New Tab <a name="newtab"></a>

<img width="971" src="https://user-images.githubusercontent.com/53500778/162631646-cd40976b-b737-43d0-8e6a-6ac090a2e2d4.png">

### Popup <a name="popup"></a>

<img width="314" alt="popup" src="https://user-images.githubusercontent.com/53500778/203561728-23517d46-12e3-4139-8a4f-e0b2f22a6ab3.png">

## Sample <a name="sample"></a>
- https://github.com/Jonghakseo/drag-gpt-extension
- https://github.com/Jonghakseo/pr-commit-noti

## Documents <a name="documents"></a>
- [Vite Plugin](https://vitejs.dev/guide/api-plugin.html)
- [ChromeExtension](https://developer.chrome.com/docs/extensions/mv3/)
- [Rollup](https://rollupjs.org/guide/en/)
- [Rollup-plugin-chrome-extension](https://www.extend-chrome.dev/rollup-plugin)


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Jonghakseo/chrome-extension-boilerplate-react-vite&type=Date)](https://star-history.com/#Jonghakseo/chrome-extension-boilerplate-react-vite&Date)



---
## Thanks To

| [Jetbrains](https://jb.gg/OpenSourceSupport)                                                                           | [Jackson Hong](https://www.linkedin.com/in/j-acks0n/)                                            |
|--------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| <img width="100" src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" alt="JetBrains Logo (Main) logo."> | <img width="100" src='https://avatars.githubusercontent.com/u/23139754?v=4' alt='Jackson Hong'/> |


---

[Jonghakseo](https://nookpi.tistory.com/)
