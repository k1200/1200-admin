/* eslint-disable no-unused-vars */
/** !
 * FileName      : util
 * Version       : v1.0.0
 * Description   : store 模块工具函数
 * Author        : 1200 1053182739@qq.com
 * Created       : 2020-08-31 18:42
 **/
import { router as routerInstance } from '../../index';
import Layout from '../layout';
import ErrorComponent from '../packages/error-page/asyncerror';
import IframeComponent from '../packages/web-iframe';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { getUrlInfo, encodeString } from './utils';
import website from '../config/website';

/**
 * @desc 异步加载路由组件
 * @param {Strin} component 组件路径
 * @returns {Promise}
 */
const loadComponent = (path1, path2) => {
	// 异步加载组件 出错时返回一个默认的错误组件
	return () => {
		const component = import(`@/views${path1}`);
		return new Promise(resolve => {
			component
				.then(() => resolve(component))
				.catch(async () => {
					let component = ErrorComponent;
					if (path2 && typeof path2 === 'string') {
						try {
							component = await import(`@/views${path2}`);
						} catch (error) {
							component = ErrorComponent;
						}
					}
					resolve(component);
				});
		});
		// 网上方法
		// const asyncComponent = () => ({
		//   // 需要加载的组件 (应该是一个 `Promise` 对象)
		//   component: import(`@/views/${path}`),
		//   // 异步组件加载时使用的组件
		//   loading: LoadingComponent,
		//   // 加载失败时使用的组件
		//   error: ErrorComponent,
		//   // 展示加载时组件的延时时间。默认值是 200 (毫秒)
		//   delay: 200,
		//   // 如果提供了超时时间且组件加载也超时了，
		//   // 则使用加载失败时使用的组件。默认值是：`Infinity`
		//   timeout: 3000
		// });
		// // // ？？？
		// return Promise.resolve({
		//   functional: true,
		//   render(h) {
		//     return h(asyncComponent);
		//   }
		// });
	};
};
/**
 * @desc 路由解析
 * @param {Array} router 路由数据
 * @param {Array} button 按钮权限数据
 * @param {Array} [route]
 * @param {Array} [menu]
 * @param {Array} [source]
 * @returns {Object}
 */

// 菜单（路由）基本结构
// var menu = {
//   path: 'table',
//   name: 'Table',
//   component: () =>
//     import(/* webpackChunkName: "page" */ '@/examples/table/index'),
//   meta: {
//     icon: '',
//     title: '例子-表格'
//   }
// };
const routerPaths = []; // 路由路径扁平化
const formatterRouter = (router, props, route = [], menu = [], source = []) => {
	let [tempMenu, tempRoute] = [{}, {}];
	if (Object.prototype.toString.call(router) === '[object Array]') {
		// source[] 路由(菜单)链 孙->父->爷
		// source[index].path
		// source[index].key
		// source[index].label

		// menu.meta.source // 菜单链

		// menu.meta = {}
		// menu.meta.title // 菜单名称
		// menu.meta.icon // 菜单图标

		// menu.meta.hiddenTags // 该页面是否需要在tags栏（默认true）
		// menu.meta.isNest // 嵌套路由
		// menu.meta.isDynamic // 动态路由
		// menu.meta.keepLive // 页面缓存

		// 菜单类型
		// const webPageStyle = [
		//   { value: 0, label: '站内页面' },
		//   { value: 1, label: '新窗口' },
		//   { value: 2, label: 'iframe嵌套' },
		//   { value: 3, label: '隐藏菜单页面' },
		//   { value: 4, label: '新窗口带参数' },
		//   { value: 5, label: '大屏页面' },
		// ];
		// 递归 处理子路由
		router.forEach(item => {
			formatterRouter(item, props, route, menu, source);
		});
	} else {
		const params = {
			[props.hiddenTags]: false,
			[props.keepLive]: true,
			...router.params
		}; // 配置参数

		const isButton = false; // 是否为按钮数据
		const isMenu = !isButton; // 是否为菜单数据
		const type = +router[props.type] || 0; // 菜单类型
		const isRouterButton = isButton && !!router.alias; // 是否跳转页面按钮

		const isNewWindow = [1, 4].includes(type); // 是否打开新窗口
		let path = router[props.path];
		let key = encodeString(path);
		const iframeKey = router[props.key];
		// 是否为外链
		const isLink = /^https?:\/\/.+/.test(path) || type === 2;
		const isChildApp = type === 6 || type === 7; // 是否为qiankun子应用
		const component = router[props.component] || ErrorComponent; // 组件路径（/page/index）必须
		const hiddenTags = params[props.hiddenTags]; // 该页面是否需要在tags栏（默认false）
		const keepLive = params[props.keepLive]; // 页面是否需要缓存（默认true）

		const isNest = params[props.isNest]; // 是否为嵌套路由
		const activeMenu = router[props.activeMenu] && encodeString(router[props.activeMenu]); // 需要激活的菜单

		const meta = router[props.meta]
			? {
					keepLive,
					hiddenTags,
					key,
					source: [...source],
					...router[props.meta],
					activeMenu: router[props.meta][props.activeMenu] && encodeString(router[props.meta][props.activeMenu])
			  }
			: {
					title: router[props.title],
					icon: router[props.icon],
					key,
					keepLive,
					hiddenTags,
					type,
					activeMenu,
					source: [...source]
			  };
		let tempSource = {
			path,
			key,
			label: meta.title
		};
		const isShowMenu = meta.type !== 3 && meta.type !== 7; // 是否显示菜单
		// const parent = source.slice(-1)[0] || null;
		let isLoadComponent = isMenu || isRouterButton || type === 0; // 是否需要加载组件
		// console.log(parent);
		// // 上一级是动态路由，子级不再加载组件
		// if (parent && parent.key.match(':')) {
		//   console.log(source);
		//   isLoadComponent = false;
		// }
		// 判断是否为外链
		// 是外链加载 webiframe 组件
		if (isLink) {
			tempMenu.meta = meta;
			tempMenu.key = key;
			tempMenu.path = '/webiframe/' + key;
			tempSource.path = tempMenu.path;
			const urlInfo = getUrlInfo(path);
			isMenu && (tempSource.isMenu = true);
			tempMenu.meta.source.push(tempSource);
			let queryIndex = path.indexOf('?');
			if (queryIndex > -1) {
				path = path.replace(
					'?',
					`?spaceApp=iframe&origin=${window.location.origin}&accessToken=${website.auth.getToken()}&isIframe=1&`
				);
			} else {
				path =
					path + `?spaceApp=iframe&origin=${window.location.origin}&accessToken=${website.auth.getToken()}&isIframe=1`;
			}
			tempRoute = {
				meta: { ...tempMenu.meta },
				name: key,
				path: `/webiframe/${key}`,
				component: IframeComponent,
				props: () => ({
					fullPath: path,
					origin: urlInfo.origin,
					search: urlInfo.search,
					hash: urlInfo.hash,
					pathname: urlInfo.pathname,
					appId: iframeKey || key
				})
			};
			route.push(tempRoute);
			routerPaths.push(tempRoute.path);
		} else {
			// 菜单基本结构根据实际情况解析
			tempMenu.path = path;
			tempMenu.key = key;
			tempMenu.meta = meta;
			tempMenu.meta.source.push(tempSource);
			tempRoute = {
				path: path,
				meta: { ...tempMenu.meta },
				name: upperFirst(camelCase(path))
			};

			// 如果存在 children， 优先处理 children
			if (router[props.children] && router[props.children].length) {
				let lastSource = tempMenu.meta.source.slice(-1)[0];
				lastSource.path = router[props.children][0].path;
				let currentRoute = route;
				// 嵌套路由
				if (isNest) {
					tempRoute.children = [];
					currentRoute = tempRoute.children;
					tempRoute.component = loadComponent(router.path, component);
					route.push(tempRoute);
				}
				let children = formatterRouter(router[props.children], props, currentRoute, [], tempMenu.meta.source);
				tempMenu.children = children.menu;
				// if (isDynamic) {
				//   // 默认以路径(path)作为组件路径，以别名(alias)作为待选组件路径
				//   tempRoute.component = loadComponent(router.path, router.alias); // 异步加载组件
				//   route.push(tempRoute);
				// }
			}
			if (isLoadComponent) {
				if (isChildApp && +process.env.VUE_APP_PARENT === 1) {
					// 菜单为子应用且项目为父级项目
					tempRoute.component = () => import('../packages/qiankun-app');
				} else {
					// 默认以路径(path)作为组件路径，以别名(component)作为待选组件路径
					tempRoute.component = loadComponent(path, component); // 异步加载组件
				}
				if (isMenu) {
					tempRoute.meta.isMenu = true;
				} else {
					tempRoute.meta.source = tempSource;
				}
				route.push(tempRoute);
				routerPaths.push(path);
			}
		}
		if (tempMenu && isMenu && isShowMenu) {
			// 需不需要：如果该级菜单有且只有一个子级菜单，该级菜单 = 该级菜单的子级菜单
			// if (tempMenu.children && tempMenu.children.length === 1) {
			//   tempMenu = tempMenu.children
			// }
			menu.push(tempMenu);
		}
	}
	return { route, menu };
};

/**
 * @desc 动态注册路由
 * @param {array} routers
 * @param {array} [button]
 */
export const formatterRouters = (routers, props = {}) => {
	let routerWarp = [];
	let options = {
		path: 'path',
		children: 'children',
		component: 'component',
		title: 'title',
		icon: 'icon',
		key: 'key',
		hiddenTags: 'hiddenTags',
		keepLive: 'keepLive',
		isNest: 'isNest',
		isDynamic: 'isDynamic',
		type: 'type',
		activeMenu: 'activeMenu',
		meta: 'meta'
	};
	options = { ...options, ...props };
	let { route: router, menu } = formatterRouter(routers, options);
	// 如果当前顶级菜单长度为1 顶级菜单 =  顶级菜单[0].children
	// if (menu.length === 1 && menu[0].children.length > 0) {
	//   menu = menu[0].children;
	// }
	routerWarp = [
		{
			path: '',
			component: Layout,
			children: router
		}
	];
	if (window.__IFRAME_APP__ || window.__POWERED_BY_QIANKUN__) {
		routerInstance.addRoutes(router);
	} else {
		routerInstance.addRoutes(routerWarp);
	}
	return {
		menus: menu,
		router: routerWarp,
		routerPaths
	};
};
/**
 * @desc 动态注册路由
 * @param {array} routers
 * @param {array} [button]
 */
export const formatterButtons = buttons => {
	const tempButtons = {};
	for (const button of buttons) {
		tempButtons[button] = true;
	}
	return tempButtons;
};
