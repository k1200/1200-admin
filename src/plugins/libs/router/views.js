import Layout from '@libs/layout';
import { appViews } from '../../import/router';
export let tempRouter = [
	{
		path: '/404',
		component: () => import(/* webpackChunkName: "page" */ '@libs/packages/error-page/asyncerror'),
		name: '404',
		meta: {
			title: '404',
			noAuth: true
		}
	},
	{
		path: '/403',
		component: () => import(/* webpackChunkName: "page" */ '@libs/packages/error-page/asyncerror'),
		name: '403',
		meta: {
			title: '403',
			noAuth: true
		}
	},
	{
		path: '/500',
		component: () => import(/* webpackChunkName: "page" */ '@libs/packages/error-page/asyncerror'),
		name: '500',
		meta: {
			title: '500',
			noAuth: true
		}
	},
	...appViews
];
if (!window.__IFRAME_APP__) {
	tempRouter = [
		{
			path: '/',
			name: '首页',
			component: Layout,
			redirect: '/',
			children: tempRouter
		}
	];
}
export default tempRouter;
