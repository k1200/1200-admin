# space-admin
## 基础
### 介绍
space-admin 是一个后台 微前端化 解决方案，它基于[Vue](https://github.com/vuejs/vue)、[element-ui](https://github.com/ElemeFE/element)、[qiankun](https://github.com/umijs/qiankun)实现。它使用了最新的前端技术栈，内置了 i18 国际化解决方案，动态路由，权限验证，微前端实现方案，它可以帮助公司快速搭建中后台产品原型。
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
## 全局配置文件解析
	```js
		// @/config/website.js
		// 引入缓存工具函数
		import STORAGE from '@libs/utils/storage';
		// 引入Token工具函数
		import AUTH from '@libs/utils/auth';
		// 引入授权，获取用户信息登基本请求函数
		import { apiTriggerApp, apiGetAppList, apiLogout, apiRefreshToken } from '@/api/user';
		// 版本号
		const version = process.env.VUE_APP_VERSION;
		// 将缓存对象工具挂载到全局配置
		const storage = (window.STORAGE = STORAGE({ key: 'space' }));
		// 将授权对象工具挂载到全局配置
		const auth = (window.AUTH = AUTH({ tokenKey: 'Access-Token' }));
		// 全局配置
		const website = {
			title: '统一门户', // 默认Title
			appKey: 'system_431dcc93f793425a8b8c0a07c202d5a2', // 子应用ID
			key: 'space', // 自定义缓存前缀
			keepAlive: 8, // keep-alive 页面缓存的最大数量
			fixedTags: [], // 固定不可关闭的页签
			storage, // 缓存工具函数【必需】
			auth, // 授权工具函数【必需】
			// 服务端返回的路由列表参数解析
			formatMenus: {
				path: 'resourceContent', // 路由地址
				children: 'privilegeList', // 子级菜单
				icon: 'iconCls', // 菜单图标
				title: 'resourceName', // 菜单名称
				key: 'resourceCode', // 菜单唯一值
				type: 'webPageStyle' // 菜单类型
			},
			// 自定义全局请求配置(参数参考：axios)
			request() {
				return {
					headers: {
						Authorization: `Bearer ${auth.getToken()}`,
						version
					}
					// timeout: 5000,
					// baseURL: ''
				};
			},
			// 以下为系统类接口
			// 激活当前应用(获取用户信息)【必需】
			activeApp(appId) {
				return new Promise((resolve, reject) => {
					apiTriggerApp({ appId })
						.then(res => {
							console.log(res);
							const { buttonList: buttons, privilegeList: menus } = res.data;
							resolve({ buttons, menus, userInfo: res.data });
						})
						.catch(error => reject(error));
				});
			},
			// 刷新token
			// refreshToken() {
			// 	return new Promise(resolve => {
			// 		apiRefreshToken().finally(() => {
			// 			resolve([]);
			// 		});
			// 	});
			// },
			// 获取应用列表【必需】
			getAppList() {
				return new Promise((resolve, reject) => {
					apiGetAppList()
						.then(res => {
							resolve(res.data?.sysList || []);
						})
						.catch(() => reject([]));
				});
			},
			// 登出【必需】
			logout() {
				return new Promise(resolve => {
					apiLogout().finally(() => {
						resolve([]);
					});
				});
			},

			// 其他自定义配置参数
			client_id: 'investment', // 与服务端约定的授权参数
			client_secret: '37b21fa497b3f46996f10458b9ebe8a4', // 与服务端约定的授权参数
			tokenKey: 'Access-Token', // 与服务端约定的 token 前缀
			refreshTokenKey: 'Admin-Refresh-Token', // 与服务端约定的 refreshToken 前缀
		};
		export default website;
	```
## 安装

+ 安装脚手架
  ```js
  npm install @space/cli -g
  ```
+ 创建应用(应用创建成功后，会自动打开 VsCode 编辑器)
  ```js
  space create <name>
  ```
+ 启动应用
  ```js
    npm run server
  ```

## 布局

## 路由和侧边栏

### 配置项

tip：配置路由时提供了以下配置项

```js
{
  path: '/login',
  name: 'Login', // 路由名字，必填
  component: () => import(/* webpackChunkName: "page" */ '@/pages/login'),
  meta: {
	 title: '', // 设置该路由在侧边栏和面包屑中展示的名字
	 icon: '', // 设置该路由的图标(svg)
	 noAuth: true, // 设置为true，时该页面不会检验 token 是否失效（默认false）
	 type: 0, // 页面类型。0：站内页面，1：新窗口，2：iframe嵌套，3：隐藏菜单页面，4：新窗口带参数，5：大屏页面
		/************* 下面拓展属性 后端暂无相应参数 暂时可通过 params 配置 ************/
	 activeMenu: '', // 当路由设置了该属性，则会高亮相对应的侧边栏（默认''）
	 keepLive: false, // 如果设置为false，则不被<keep-alive>缓存（默认true）

	 tags: false, // 如果设置为false，则不会在页签栏显示（默认true）
	 breadcrumb: false, // 如果设置为false，则不会在breadcrumb面包屑中显示（默认true）
	  // isNest: false, // 是否为嵌套路由（默认false）
	  // isDynamic: false, // 是否为动态路由(默认false)
  }
},
```

### 路由

#### 静态路由

tip: 代表那些不需要动态判断权限的路由

+ 非业务路由: 顶级路由，不嵌套在基础布局组件（Layout）下

```js
// @/router/pages/index.js
export default [
	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "page" */ '@/pages/login'),
		meta: {
			noAuth: true
		}
	}
];
```

+ 业务路由: 次级路由，嵌套在基础布局组件（Layout）下
  ```js
    export default [
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: () => import(/* webpackChunkName: "page" */ '@/views/Home'),
    //   meta: {
    //     title: '首页',
    //     key: 'Home',
    //     icon: 'index',
    //     source: [],
    //     type: 0
    //   }
    // }
  ];
  ```

#### 动态路由

通过后台配置，需要动态添加的路由。

### 侧边栏

### 标签栏导航

## 权限验证

## 新增页面

+ 非业务页面（登录，注册等）：在@/pages目录下新增非业务页面
+ 业务页面：在@/views目录下新增业务页面

## 接口管理

+ 统一接口函数前缀：api
+ 建议功能前缀：增(apiAdd)，删(apiDel)，改(apiUpdate)，查(apiGet)，通过(apiResolve)，拒绝(apiReject)

```js
// @/api/example.js
// 引入request工具函数
import request from '@libs/utils/request';
// 导出接口
export const apiLogin = data => {
	return request(
		{
			url: '/oauth/token',
			method: 'post',
			data
		},
		{
			isAllowedRepeat: false, // 允许重复请求 (默认fasle)；设置为true， 会存在同时触发多个同样的请求（接口参数都相同）的情况（短时间内重复请求）
			isFormData: false, // 是否为表单提交 (默认fasle)；设置为true， 会转换为表单提交，自动设置请求头Headers[Content-Type] = 'application/x-www-form-urlencoded'
			isInterceptError: true // 是否全局拦截错误信息 (默认true)；设置为false， 需自行处理请求的错误
		}
	);
};
export const apiGetInfo = data => {
	return request({
		url: '/api/queryAccountPrivilegeInfo',
		method: 'post',
		data
	});
};
```

+ 一个简单的列表(增删改查)的常用接口，接口地址可变

```js
// @/api/user.js
// 引入request工具函数
import request from '@libs/utils/request';
// 前缀api用来区分函数类型；又因为改接口是在文件 @/api/user.js 之下，apiAddUser 中User就有点多余，利用命名空间 简化接口名称
// 新增用户
export apiAdd = data => {
	{
		url: '/user/save',
		method: 'post',
		data
	},
}
// 删除用户
export apiDel = params => {
	{
		url: '/user/delete',
		method: 'get',
		params
	},
}
// 修改用户
export apiUpdate = data => {
	{
		url: '/user/updata',
		method: 'post',
		data
	},
}
// 查询用户列表
export apiList = params => {
	{
		url: '/user/list',
		method: 'get',
		params
	},
}
// 查询用户详情
export apiDetails = params => {
	{
		url: '/user/details',
		method: 'get',
		params
	},
}
```

使用接口
与接口同名的组件使用

```js
// @/views/pages/user.vue
import { apiList, apiAdd, apiDel, apiDetails, apiUpdate } from '@/api/user'
export default {
	// ...
	methods: {
		getList() {
			apiList()
		},
		handleAdd() {
			apiAdd()
		},
		handleDel() {
			apiDel()
		},
		getDetails() {
			apiDetails()
		},
		handleUpdate() {
			apiUpdate()
		},
	}
	// ...
}
```

与接口不同名的组件使用

```js
// @/views/pages/goods.vue
import { apiList: apiUserList, apiAdd:apiAddUser, apiDel:apiDelUser, apiDetails:apiUserDetails, apiUpdate:apiUpdateUser } from '@/api/user'
export default {
	// ...
	methods: {
		getUserList() {
			apiUserList()
		},
		handleAddUser() {
			apiAddUser()
		},
		handleDelUser() {
			apiDelUser()
		},
		getUserDetails() {
			apiUserDetails()
		},
		handleUpdateUser() {
			apiUpdateUser()
		},
	}
	// ...
}
```

## 状态管理

Vuex状态管理，采用 modules 模式进行管理；基础工程已集成 @libs/store/app.js, @libs/store/tags, @libs/store/user.js 等基础模块。
并在@/libs/store/getters.js 中暴露了 以下状态：

```js
const getters = {
	token: state => state.user.token, // token
	userInfo: state => state.user.userInfo, // 用户信息
	menus: state => state.app.menus, // 菜单数
	buttons: state => state.app.buttons, // 按钮权限
	activeApp: state => state.app.activeApp, // 当前激活的应用
	activeAppId: state => state.app.activeAppId, // 当前激活的应用ID
	routerPaths: state => state.app.routerPaths, // 已注册的路由的扁平化数组
	activeRouter: state => state.tags.activeRouter, // 当前激活的路由
	tags: state => state.tags.tags, // 缓存的已打开的页面
	activeSource: state => state.tags.activeSource // 当前激活的路由的路径源
};
export default getters;
```

新增 /modules/goods.js

```js
// @/store/modules/goods.js
export default {
	namespaced: true, // 开启命名空间
	state: () => {
		return {
			count: 1 
		};
	},
	mutations: {},
	actions: {}
};
```

```js
// @/store/getters.js
const getters = {
	count: stats => state.goods.count
};
export default getters;
```

## 样式

tip: 本项目用的sass 为dart-sass;其深度选择器为 ::v-deep；组件累的scss尽量写在组件内，并带上scoped属性；尽量减少不必要的scss嵌套，用了scoped属性已经是全局唯一了，没必要在进行嵌套。

```scss
<style lang="scss" scoped>
::v-deep .className {

}
</style>
```

修改UI框架的样式统一放在以UI框架命名的文件夹下

```bash
style # 全局样式
  ├─mixin.scss # 全局混入
  ├─variables.scss # 全局变量
  └─element-ui # UI框架样式
		├─sp-button.scss # 全局按钮
		├─sp-input.scss # 全局输入框
		└─sp-table.scss # 全局表格
```
## 环境变量 | 构建和发布
下面演示新建一个测试环境的打包命令（`npm run build:test`）：
+ 在根目录下新建`.env.*`文件
	```bash
		# ./.env.test
		# 设置Node 的环境变量
		NODE_ENV = 'production' 
		# 设置自定义环境变量
		VUE_APP_ENV = test
	```
+ 修改`@/config/env.js`文件
  ```js
	// @/config/env.js
	// ...
	const env_conf = {
		test: {
			baseUrl: '',
			// ...
		}
	};
	// ...
	```
+ 修改构建命令 `./package.json`文件
  ```js
	// ./package.json
	// ...
	"script": {
		// ...
		"build:test": "vue-cli-service build --mode test"
		// ...
	}
	```



## CDN

## 更换主题

## 国际化

## 错误处理
