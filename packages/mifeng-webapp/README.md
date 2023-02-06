# AntV 模板工程

- [AntV 模板工程](#antv%E6%A8%A1%E6%9D%BF%E5%B7%A5%E7%A8%8B)
  - [项目技术栈](#%E9%A1%B9%E7%9B%AE%E6%8A%80%E6%9C%AF%E6%A0%88)
  - [目录](#%E7%9B%AE%E5%BD%95)
  - [环境搭建](#%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA)
    - [Yarn](#yarn)
  - [运行](#%E8%BF%90%E8%A1%8C)
  - [构建](#%E6%9E%84%E5%BB%BA)
  - [检查和修复文件](#%E6%A3%80%E6%9F%A5%E5%92%8C%E4%BF%AE%E5%A4%8D%E6%96%87%E4%BB%B6)
  - [编辑器配置保存自动修复代码](#%E7%BC%96%E8%BE%91%E5%99%A8%E9%85%8D%E7%BD%AE%E4%BF%9D%E5%AD%98%E8%87%AA%E5%8A%A8%E4%BF%AE%E5%A4%8D%E4%BB%A3%E7%A0%81)
  - [开发规范](#%E5%BC%80%E5%8F%91%E8%A7%84%E8%8C%83)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

### 项目技术栈

vue3 + eslint + prettier + [antd-vue](https://www.antdv.com/components/overview-cn/)

### 目录

```
.
├── README.md
├── babel.config.js
├── jsconfig.json
├── lint-staged.config.js
├── mock                        # mock数据
├── package-lock.json
├── package.json
├── public
│   ├── favicon.ico
│   └── index.html
├── src
│   ├── App.vue
│   ├── api
│   ├── assets
│   ├── components        # 公共组件
│   ├── constant          # 常量
│   ├── layout
│   ├── main.js
│   ├── views
│   ├── plugins
│   │   ├── index.js          # 插件出口文件
│   │   ├── provides.js       # 全局注入参数
│   │   ├── directives.js     # 全局指令
│   │   ├── global.js         # 全局方法或属性
│   │   └── icons.js          # 异步导入antd图标
│   ├── router
│   ├── store
│   ├── styles
│   ├── use               # 公共use
│   └── utils
├── vue.config.js
└── yarn.lock


```

## 环境搭建

推荐使用 [pnpm](https://pnpm.io/zh) 来管理您的依赖

### pnpm

```bash
npm install -g pnpm
```
## 运行

- 依次运行

```
pnpm install
pnpm run dev
```

## 构建

```
pnpm run build
```

## 编辑器配置保存自动修复代码

- vscode 参考 [此链接](https://www.mainblog.cn/257.html)
- WebStorm 参考 [此链接](https://prettier.io/docs/en/webstorm.html)

## 开发规范

文档地址：[前端团队指引](https://gitlab.kd/webdev-team/guidelines)

在开发本项目前都应用仔细阅读 **kd** 的前端开发规范,以及

- [Git 工作流规范](https://gitlab.kd/yunshanghui/engineering/frontend/guidelines/-/wikis/git/%E5%A4%A7%E5%89%8D%E7%AB%AFgit%E5%88%86%E6%94%AF%E8%A7%84%E8%8C%83)
- [提交信息规范](https://gitlab.kd/yunshanghui/engineering/frontend/guidelines/-/wikis/git/git-Commit%E8%A7%84%E8%8C%83%E6%8C%87%E5%8D%97)

#### 开发注意事项

##### 异步路由添加

开发环境的异步路由是从本地 mock 异步拉取，在 mock/menu.js 内添加新路由

```js
// 详见 src/router/menus.js
const { data } = process.env.NODE_ENV === 'development' ? await getMockMenuList() : await getMenuList()
```

##### 富文本编辑器统一使用 wangEditor 详见组件 src/components/WangEditor

##### 组件使用规范

```html
<!-- 自定义组件使用驼峰写法 -->
<TableFilter />

<!-- 第三方组件使用中划线写法 -->
<a-button />
```

##### 全局指令 见 src/plugins/directives.js

###### 新增了 action 指令

大家如果在旧项目中看到
v-if="has('', '查询')" :actionid="getId('', '查询')"
事件里面有
window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))

请变更使用指令 并去除 js 中代码 window.localStorage.setItem('actionId', e.currentTarget.getAttribute('actionid'))
v-if="has('', '查询')" :actionid="getId('', '查询')"  
===> v-action="'查询'"

v-if="has('商会资讯', '查询')" :actionid="getId('商会资讯', '查询')"
===> v-action="'商会资讯-查询'"

src/utils/permission.js 新增 watchActionEffect watchActionRequestEffect
如在老项目中：

```js
if (this.has('', '查询')) {
  this.fetchData()
}
```

新项目中：

```js
watchActionRequestEffect('查询', () => fetchData())
```

##### 全局注入参数 见 src/plugins/provides.js

用于 js 中常用参数取用

```js
const ckey = inject('ckey')
```

##### 全局方法或属性 见 src/plugins/global.js

用于 template 中常用属性或方法取用

```html
<!-- 比如如已挂载ckey可直接使用 无须在setup中声明 -->
<div v-if="!record.syncChamberVOList.some(v => v.ckey === ckey.value)">--</div>
```

###### 新增全局方法 $filters 用于替代 vue2 过滤器

+row.publishTime | dateFormat  
==> $filters.dateFormat(+row.publishTime)

##### 表格页头部筛选统一 使用 src/components/TableFilter/index.vue

### 通用表格

项目中的表格可以 PlusTable 组件为基础开发 ,[组件文档](./src/components/plusTable/README.md)

##### iconfont
项目中antd-icon已注册全局异步组件，可直接使用
远程iconfont地址可在 plugins/icons 中更新

