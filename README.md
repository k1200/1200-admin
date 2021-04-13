# 1200-admin
## 基础
### 介绍
1200-admin 是一个后台 微前端化 解决方案，它基于[Vue](https://github.com/vuejs/vue)、[element-ui](https://github.com/ElemeFE/element)、[qiankun](https://github.com/umijs/qiankun)实现。它使用了最新的前端技术栈，内置了 i18 国际化解决方案，动态路由，权限验证，微前端实现方案，它可以帮助公司快速搭建中后台产品原型。
#### 功能

> 登录 / 注销
>> 账户密码、登录
>> 手机验证码登录（计划）  
>> 微信扫一扫登录（计划）  
>> 钉钉扫一扫登录（计划）  

> 权限验证  
>> 页面权限  
>> 指令权限（按钮） 
>> 权限配置

> 全局功能   
>> 动态面包屑  
>> 快捷导航(标签页)  
>> Svg Sprite 图标   
>> 动态侧边栏（支持多级路由嵌套）  
>> 基于Vue-router的路由    
>> 基于Vuex的状态管理    
>> 基于Axios的Http Request  
>> 基于Vi18n的国际化多语言  
>> Screenfull全屏（【计划】）  
>> 自适应收缩侧边栏（【计划】）  
>> 本地/后端 mock 数据（计划）   
>> 多种动态换肤（计划）  

> 错误页面  
>> 404  
>> 403  
>> 500  

> 多模式发布  
>> 常规应用  
>> Iframe内嵌应用  
>> qiankun子应用  
>> qiankun父应用  
#### 前序准备  
本项目技术栈基于   
- ES2015+  
- [Vue](https://github.com/vuejs/vue)  
- [Vuex](https://github.com/vuejs/vuex)  
- [Vue-router](https://github.com/vuejs/vue-router)  
- [Vue-cli](https://github.com/vuejs/vue-cli)  
- [Axios](https://github.com/axios/axios)   
- [element-ui](https://github.com/ElemeFE/element)  
- [qiankun](https://github.com/umijs/qiankun)  

提前了解和学习这些知识会对使用本项目有很大的帮助。  
本项目不支持低版本浏览器(如 IE)
####  目录结构

```bash
├─.editorconfig # 编辑器配置项
├─.eslintignore # eslintignore
├─.eslintrc.js # eslint 配置项
├─.prettierrc # prettierrc 配置项
├─babel.config.js # babel 配置
├─jsconfig.json # jsconfig 配置
├─package.json # package.json
├─README.md
├─vue.config.js # vue-cli 配置
└─src # 源代码
	 ├─App.vue # 入口页面
	 ├─main.js # 入口文件
	 ├─views # 业务页面
	 ├─utils # 方法
	 ├─style # 全局样式
	 |   ├─mixin.scss # 全局混入
	 |   ├─variables.scss # 全局变量
	 |   └─element-ui # UI框架样式
	 ├─store # 全局 store管理
	 |   ├─getters.js # 全局 getters
	 |   └─modules # 分模块管理 store
	 |      └─remade.md
	 ├─router # 静态路由
	 |   ├─views # 业务页面（无需动态加载的路由）路由
	 |   └─pages # 非业务页面路由（登录，注册等）
	 ├─plugins # 全局插件（基础工程源码）
	 ├─pages # 非业务页面
	 ├─i18n # 国际化
	 ├─components # 组件 
	 ├─config # 全局配置管理
	 |   ├─const.js # 全局常量
	 |   ├─dict.js # 本地字典（枚举值）管理
	 |   └─website.js # 应用配置
	 ├─assets # 静态资源 
	 └─api # api管理
```
#### 安装
```shell
# 安装脚手架
npm install -g @space/cli --registry=http://172.16.163.24:8081/repository/npm-public/

# 创建项目(项目创建成功后，会自动打开 VsCode 编辑器)
space create <name>

# 进入项目目录
cd <nmae>

# 本地开发 启动项目
npm run serve
```

### 布局
### 路由和侧边栏
本项目的侧边栏和动态路由（需要配置权限的页面）依赖于数据配置，开发环境可通过Mock模拟相应数据；不需要权限的路由（页面）需要在`@/router/views`、`@/router/pages`中配置，它们区别会在下面讲到。
#### 路由
本项目路由分为两种，需要授权和不需要授权的。
- 需要授权的路由：实行动态加载，通过为当前账号的角色（或账号、或组织、或部门等）给于权限，前端通过解析数据实现动态加载页面。解决了用户知道某页面地址，即可打开相应页面的的问题；解决了前端重复写路由配置项的问题，减少项目体积。
- 不需要授权的路由
#### 配置项
> - 不需要授权的路由
> ```js
> {
>   path: '/login', // 路由Path
>   name: 'Login', // 路由名字，必填
>   component: () => import(/* webpackChunkName: "page" */ '@/pages/login'),
>   meta: {
> 	  title: '', // 设置该路由在侧边栏和面包屑中展示的名字
> 	  icon: '', // 设置该路由的图标(svg)
> 	  // 页面类型。0：站内页面，1：新窗口，2：iframe嵌套，4：新窗口带参数，5：大屏页面
> 	  type: 0, 
> 	  activeMenu: '', // 当路由设置了该属性，则会高亮相对应的侧边栏（默认''）
> 		/************* 下面拓展属性 后端暂无相应参数 暂时可通过 params 配置 ************/
> 	  keepLive: false, // 如果设置为false，则不被<keep-alive>缓存（默认true）
> 	  hiddenTags: false, // 如果设置为true，则不会在页签栏显示（默认false）
> 	  breadcrumb: false, // 如果设置为true，则不会在breadcrumb面包屑中显示（默认false）
> 	  // isNest: false, // 是否为嵌套路由（默认false）
> 	  // isDynamic: false, // 是否为动态路由(默认false)
>   },
>   children: []
> },
> ```

> - 需要授权的路由（Mock模拟的路由|数据配置的路由）
> ```js
> {
>   path: '/user', // 路由Path
>   component: '/user/index', // 组件路径
>   meta: {
> 	  title: '', 
> 	  icon: '',
> 	  // 页面类型。0：站内页面，1：新窗口，2：iframe嵌套，3：隐藏菜单页面，4：新窗口带参数，5：大屏页面
> 	  type: 0, 
> 	  activeMenu: '',
> 	  keepLive: false,
> 	  hiddenTags: false, 
> 	  breadcrumb: false,
> 	  // isNest: false,
> 	  // isDynamic: false,
>   },
>   children: []
> },
> ```
#### 侧边栏

### 权限验证
### 标签栏导航
### 新增页面
### 样式
### Htpp Request
### 引入外部模块
### 构建和发布
### 环境变量
### 子应用配置
### 父应用配置

