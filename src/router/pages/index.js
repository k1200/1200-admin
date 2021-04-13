/** !
 * FileName      : index
 * Version       : v1.0.0
 * Description   : 非业务页面（不在基础布局下）
 * Author        : 1200 1053182739@qq.com
 * Created       : 2021-03-10 19:41
 **/

export default [
	{
		path: '/login',
		name: 'Login',
		component: () => import(/* webpackChunkName: "page" */ '@/pages/login'),
		meta: {
			noAuth: true,
			hiddenTags: true
		}
	},
	{
		path: '/register',
		name: 'Register',
		component: () => import(/* webpackChunkName: "page" */ '@/pages/register'),
		meta: {
			noAuth: true
		}
	},
	{
		path: '/forgetPass',
		name: 'ForgetPassword',
		component: () => import(/* webpackChunkName: "page" */ '@/pages/forget-password'),
		meta: {
			noAuth: true
		}
	}
];
