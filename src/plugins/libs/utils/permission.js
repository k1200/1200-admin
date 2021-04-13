import qs from 'qs';
import { isEmpty } from '@libs/utils/utils';
// 是否有权限访问页面
const isAuth = (url, store) => {
	const routerPaths = store.getters.routerPaths;
	const queryIndex = url.indexOf('?');
	let path = url.slice(0, queryIndex > -1 ? queryIndex : url.length);
	if (path.slice(-1) === '/') path = path.slice(0, -1);
	if (routerPaths.includes(path)) {
		return {
			path: path,
			query: qs.parse(url.slice(queryIndex + 1))
		};
	}
	return null;
};
const routerEach = (router, store, website) => {
	router.beforeEach((to, from, next) => {
		const userInfo = store.getters.userInfo;
		const hasToken = website.auth.getToken();
		const redirect = from.query.redirect; // 获取重定向路径
		if (from.path === '/login' && redirect) {
			// 从登录页跳出且带有重定向路径
			let authRouter = isAuth(redirect, store);
			if (authRouter) {
				return next({ path: authRouter.path, query: authRouter.query, replace: true });
			}
			return next({ path: '/', replace: true });
		}

		let authRouter = isAuth(to.path, store);
		if (!hasToken && !to.meta.noAuth) {
			// token 失效 && 页面未授权访问
			return next('/login');
		}

		if (isEmpty(userInfo) && hasToken) {
			// 用户信息丢失(浏览器刷新操作)
			// 获取用户信息
			store.dispatch('user/getInfo').then(() => {
				next({ ...to, replace: true });
			});
			return;
		}
		to.meta.requestCode = '200';
		if (!authRouter) {
			// 路由未注册（无权限访问）
			// to.meta.requestCode = '403';
			next({ path: '/403' });
		}
		store.dispatch('tags/addTag', to);
		next();
	});
	router.afterEach(to => {
		document.title = to.meta.title || website.title; // 动态设置浏览器标题
	});
};
export default routerEach;
