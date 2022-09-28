

# 商会管理后台

- [商会管理后台](#antv%E6%A8%A1%E6%9D%BF%E5%B7%A5%E7%A8%8B)
    - [环境搭建](#%E7%8E%AF%E5%A2%83%E6%90%AD%E5%BB%BA)
        - [Yarn](#yarn)
    - [运行](#%E8%BF%90%E8%A1%8C)
    - [构建](#%E6%9E%84%E5%BB%BA)
    - [检查和修复文件](#%E6%A3%80%E6%9F%A5%E5%92%8C%E4%BF%AE%E5%A4%8D%E6%96%87%E4%BB%B6)
    - [编辑器配置保存自动修复代码](#%E7%BC%96%E8%BE%91%E5%99%A8%E9%85%8D%E7%BD%AE%E4%BF%9D%E5%AD%98%E8%87%AA%E5%8A%A8%E4%BF%AE%E5%A4%8D%E4%BB%A3%E7%A0%81)
    - [开发规范](#%E5%BC%80%E5%8F%91%E8%A7%84%E8%8C%83)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## 环境搭建

推荐使用 [Yarn](https://www.yarnpkg.com/zh-Hans/) 来管理您的依赖


### Yarn

如果你还没有安装过 Yarn，请参照[Yarn 的安装说明](https://www.yarnpkg.com/zh-Hans/docs/install)进行安装。

Yarn 安装完毕后，运行以下命令启用 Yarn Workspaces：

```
yarn config set workspaces-experimental true
```


## 运行
* 依次运行
```
yarn install
yarn dev
```

## 构建
```
yarn build:dev
yarn build:test
yarn build:prod
```

## 打包预览
```
yarn preview
```

## 检查和修复文件
```
yarn lint --fix

历史原因 项目内部未启用eslint
在gitHooks中添加pre-commit 对修改的文件进行eslint检查 未通过会报错
```

## 编辑器配置保存自动修复代码
* vscode 参考 [此链接](https://www.mainblog.cn/257.html)
* WebStorm 参考 [此链接](https://prettier.io/docs/en/webstorm.html)



## 开发规范
文档地址：[前端开发规范](https://gitlab.kd/yunshanghui/engineering/frontend/guidelines/-/wikis/%E5%B7%A5%E4%BD%9C%E8%A7%84%E8%8C%83/%E5%89%8D%E7%AB%AF%E4%BB%A3%E7%A0%81%E8%A7%84%E8%8C%83)

在开发本项目前都应用仔细阅读 **kd** 的前端开发规范,以及

* [Git工作流规范](https://gitlab.kd/yunshanghui/engineering/frontend/guidelines/-/wikis/git/%E5%A4%A7%E5%89%8D%E7%AB%AFgit%E5%88%86%E6%94%AF%E8%A7%84%E8%8C%83)
* [提交信息规范](https://gitlab.kd/yunshanghui/engineering/frontend/guidelines/-/wikis/git/git-Commit%E8%A7%84%E8%8C%83%E6%8C%87%E5%8D%97)
  ...

