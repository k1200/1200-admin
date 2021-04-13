import { appPages } from '../../import/router';
import appViews from './views';
import { flattenDeep } from '@libs/utils/utils';
const routesAll = [...appPages, ...appViews];
let router = {};
let routeMatch = [];
const createRouter = (Vue, VueRouter, mode = 'hash') => {
	// 解决 vue-router 3.0+ 跳转相同地址会报错误的问题
	const ROUTER_PUSH = VueRouter.prototype.push;
	const ROUTER_REPLACE = VueRouter.prototype.replace;
	VueRouter.prototype.push = function(location, onComplete, onAbort) {
		let temp = ROUTER_PUSH.call(this, location, onComplete, onAbort);
		if (temp) {
			return temp.catch(error => error);
		}
	};
	VueRouter.prototype.replace = function(location, onComplete, onAbort) {
		let temp = ROUTER_REPLACE.call(this, location, onComplete, onAbort);
		if (temp) {
			return temp.catch(error => error);
		}
	};
	Vue.use(VueRouter);
	router = new VueRouter({
		scrollBehavior(to, from, savedPosition) {
			// savedPosition 这个参数当且仅当导航 (通过浏览器的 前进/后退 按钮触发) 时才可用,
			// 效果和 router.go() 或 router.back()
			if (savedPosition) {
				// 返回savedPosition 其实就是 当用户点击 返回的话，保持之前浏览的高度
				return savedPosition;
			} else {
				if (from.meta && from.meta.keepAlive) {
					from.meta.savedPosition = document.body.scrollTop;
				}
				return {
					x: 0,
					y: to.meta.savedPosition || 0
				};
			}
		},
		mode,
		routes: routesAll
	});
	routeMatch = router.match;
	return router;
};
let routerPaths = [
	...flattenDeep(routesAll, item => {
		if (item.children && item.children.length) {
			return [item.path, item.children];
		}
		return item.path;
	}),
	''
];
export default router;
export { routeMatch, createRouter, routerPaths };
