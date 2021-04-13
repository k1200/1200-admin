/** !
 * FileName      : index
 * Version       : v1.0.0
 * Description   : 业务页面（在基础布局下）
 * Author        : 1200 1053182739@qq.com
 * Created       : 2021-03-10 19:42
 **/

export default [
	{
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "page" */ '@/views/Home'),
		meta: {
			title: '首页',
			key: 'Home'
		}
	}
];
