import dependencies from './dependencies';
import website from './libs/config/website';
import * as qiankunConf from './qiankun.conf';
// vuex 注册函数
import { createStore } from './libs/store';
// vue-router 注册函数
import { createRouter, routerPaths } from './libs/router';
// vue-router 全局钩子函数
import routerEach from './libs/utils/permission';
// ElementUI 注册函数
import installElementUI from './libs/element-ui';
// axios 拦截器 函数
import { createRequest } from './libs/utils/request';
// Vue 注册 全局指令，混入，过滤器 函数
import Vutil from './libs/vutil';
// 引入Webmessage 插件
import webMessaging from './libs/utils/webMessaging';
// 基础工程 全局组件注册函数
import components from './libs/packages';
import langs from './libs/i18n';
import App from '@/App.vue';

import './libs/style/base.scss';
import './libs/assets/icons'; // 注册图标库
import './libs/assets/icons/iconfonts/iconfont.css'; // 注册图标库
import * as utils from './libs/utils/utils';
import qs from 'qs';
// eslint-disable-next-line no-unused-vars
let [store, router, request, instance, packages, i18n] = [null, [], null, null, {}, {}];
/**
 * @param {Object} options
 * @param {string} options.select - 挂载的Dom节点
 * @param {function} [options.callback] - Vue注册前执行的回调函数
 * @param {object} [options.parent] - 父应用传来的参数
 * @param {object} options.parent.Vue - 父应用传来的参数
 * @param {object} options.parent.Vuex - 父应用传来的参数
 * @param {object} options.parent.VueRouter - 父应用传来的参数
 * @param {object} options.parent.ElementUI - 父应用传来的参数
 * @param {object} options.parent.axios - 父应用传来的参数
 * @param {string} options.parent.token - 父应用传来的参数
 * @param {Function} options.parent.Message - 父应用传来的参数
 * @param {object[]} [options.microApps] - 需要注册的子应用
 * @param {string} options.microApps[].name - 子应用名称
 * @param {string} options.microApps[].entry - 子应用入口（地址）
 * @param {string|array|function} options.microApps[].activeRule - 子应用路由匹配规则
 * @param {string} [options.microApps[].container=#appContainer] - 子应用存放容器
 */
const render = async ({ select, callback, mounted = () => {}, create = () => {}, parent = {}, microApps = [] }) => {
	// eslint-disable-next-line no-unused-vars
	let { Vue, Vuex, VueRouter, axios, VueI18n, ElementUI, locale, zhLocale, enLocale, Message } =
		(await dependencies()) || parent.plugin || {};
	Vue = Vue.default || Vue;
	Vuex = Vuex.default || Vuex;
	VueRouter = VueRouter.default || VueRouter;
	axios = axios.default || axios;
	VueI18n = VueI18n.default || VueI18n;
	locale = locale.default || locale;
	zhLocale = zhLocale.default || zhLocale;
	enLocale = enLocale.default || enLocale;

	Vue.config.productionTip = process.env.NODE_ENV !== 'production';

	router = createRouter(Vue, VueRouter); // 创建路由
	store = await createStore(Vue, Vuex, website, router); // 创建Store
	routerEach(router, store, website); // 设置全局路由钩子函数
	request = createRequest({ axios, store, router, website, Message }); // 创建Http请求
	installElementUI(Vue, ElementUI, zhLocale); // 初始化UI框架
	components(Vue); // 全局组件注册
	Vutil(Vue); // 注册全局指令，过滤器
	i18n = langs(Vue, VueI18n, locale, zhLocale, enLocale);
	callback && callback(Vue, ElementUI, request, store); // 使用者回调函数

	Vue.prototype.$auth = website.auth; // 全局挂载Auth方法
	Vue.prototype.$storage = website.storage; // 全局挂载Storage方法

	if (!window.__POWERED_BY_QIANKUN__) {
		// 应用地址解析
		const urlInfo = utils.getUrlInfo(window.location.href);
		const urlHash = urlInfo.hash;
		let param = {};
		if (urlHash) {
			let index = urlHash.indexOf('?');
			param = qs.parse(urlHash.slice(index + 1));
		} else {
			param = qs.parse(urlInfo.search, { ignoreQueryPrefix: true });
		}

		// 通过其他应用跳转而来
		if (param?.accessToken) {
			website.auth.setToken(param.accessToken);
			store.commit('user/SET_TOKEN', param.accessToken);
			store.commit('app/SET_ACTIVE_APP_ID', param.appId);
			await store.dispatch('user/getInfo', param.appId);
		}
		// 作为Iframe子应用嵌入
		if (param.spaceApp) {
			window.__IFRAME_APP__ = '__IFRAME_APP__';
			Vue.use(webMessaging, {
				origin: param.origin,
				onMessage: res => {
					console.log(res.data);
					// eslint-disable-next-line no-unused-vars
					let { apppId, token, route, theme } = res.data;
					store.commit('user/SET_TOKEN', token);
				}
			});
		}
	} else {
		qiankunConf.mountBefore(store, parent, routerPaths);
	}
	// 应用实例
	instance = new Vue({
		router,
		store,
		create,
		mounted,
		i18n,
		render: h => h(App)
	}).$mount(select);
	// 父应用模式运行
	if (+process.env.VUE_APP_PARENT === 1) {
		qiankunConf.registerMicroApps(instance, '#appContainer', microApps, {
			Vue,
			Vuex,
			VueRouter,
			axios,
			VueI18n,
			ElementUI,
			locale,
			zhLocale,
			enLocale,
			Message
		});
	}
};
export default render;
export { store, router, request, utils, qiankunConf };
