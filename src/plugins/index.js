import dependencies from '@libs/utils/dependencies';
import website from '@libs/config/website';
// vuex 注册函数
import { createStore } from '@libs/store';
// vue-router 注册函数
import { createRouter } from '@libs/router';
// vue-router 全局钩子函数
import routerEach from '@libs/utils/permission';
// ElementUI 注册函数
import installElementUI from './libs/element-ui';
// axios 拦截器 函数
import { createRequest } from '@libs/utils/request';
// Vue 注册 全局指令，混入，过滤器 函数
import Vutil from './libs/vutil';
// 引入Webmessage 插件
import webMessaging from '@libs/utils/webMessaging';
// 基础工程 全局组件注册函数
import Packages from '@libs/packages';
import App from '@/App.vue';

import '@libs/style/base.scss';
import '@libs/assets/icons'; // 注册图标库
import './libs/assets/icons/iconfonts/iconfont.css'; // 注册图标库
import * as utils from './libs/utils/utils';
import qs from 'qs';
// eslint-disable-next-line no-unused-vars
let [store, router, request, instance, packages] = [null, [], null, null, {}];

const render = async ({ select, callback }) => {
	// eslint-disable-next-line no-unused-vars
	let { Vue, Vuex, VueRouter, axios, ElementUI, VueI18n, locale, zhLocale, enLocale, Message } = await dependencies();
	Vue = Vue.default || Vue;
	Vuex = Vuex.default || Vuex;
	VueRouter = VueRouter.default || VueRouter;
	axios = axios.default || axios;
	locale = locale.default || locale;
	zhLocale = zhLocale.default || zhLocale;
	enLocale = enLocale.default || enLocale;

	Vue.config.productionTip = process.env.NODE_ENV !== 'production';
	router = createRouter(Vue, VueRouter);
	store = await createStore(Vue, Vuex);
	routerEach(router, store, website);
	request = createRequest({ axios, store, router, website, Message });
	installElementUI(Vue, ElementUI, zhLocale);
	Vutil(Vue);
	Packages(Vue);
	callback && callback(Vue);

	Vue.prototype.$auth = website.auth;
	Vue.prototype.$storage = website.storage;

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
	// 应用实例
	instance = new Vue({
		router,
		store,
		render: h => h(App)
	}).$mount(select);
};
export default render;
export { store, router, request, packages, utils };
