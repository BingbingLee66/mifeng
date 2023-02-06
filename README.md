# 云商会管理后台

## 项目介绍

此项目是云商会后台管理系统前端项目，其中包含了[运营总后台（scrm）](./packages/shanghui-admin/)、[商会管理后台（秘锋）](./packages/mifeng-webapp/)、以及项目中的[公用资源（common）](./packages/business-common/)、[组件（components）](./packages/business-components/)、以及[业务逻辑（logics）](./packages/business-logics/)。

## 项目技术栈
项目使用了 monorepo 的方式管理，使用了 pnpm 作为包管理工具，使用了 pnpm-workspace 作为工作区管理工具。

- [x] [pnpm](https://pnpm.io/zh)
- [x] [pnpm-workspace](https://pnpm.js.org/en/workspaces)
- [x] [monorepo](https://en.wikipedia.org/wiki/Monorepo)

## 项目结构

```bash
├── README.md
├── package.json
├── packages
│   ├── business-common
│   ├── business-components
│   ├── business-logics
│   ├── mifeng-webapp
│   └── shanghui-admin
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## 项目应用

- [运营总后台（scrm）](./packages/shanghui-admin/)
- [商会管理后台（秘锋）](./packages/mifeng-webapp/)
- [公用资源（common）](./packages/business-common/)
- [组件（components）](./packages/business-components/)
- [业务逻辑（logics）](./packages/business-logics/)

## 项目启动

### 安装依赖

```bash
pnpm install
```

### 启动项目

```bash
pnpm -F ${project} run ${script}
```

示例：

```bash
pnpm -F mifeng run dev
```

### 项目打包

  ```bash
  pnpm -F ${project} run ${script}
  ```

示例：

  ```bash
  pnpm -F mifeng run build
  ```

### pnpm 常用命令

`--filter, -F` 
筛选出需要执行的项目

```bash
pnpm -F ${project} run ${script}
# or
pnpm -F ${project} add ${package}

```


`--workspace`
将依赖安装在项目的根目录下，共用依赖

```bash
pnpm -w add ${package}
```