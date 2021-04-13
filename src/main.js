import CreateApp, { qiankunConf } from '@/plugins';
let options = {
	select: '#app', // 挂载的DOM，不要与主应用重名(建议以项目名称作为ID)
	callback: async () => {},
	mounted() {}, // 挂载后
	create() {} // 创建后
};
let mount = null;
if (+process.env.VUE_APP_PARENT === 1) {
	// 如果为父级应用
	options.microApps = [
		{
			name: 'dataplatform', // 子应用名称
			entry: '/dataplatform/', // 子应用入口
			activeRule: '/#/dataplatform' // 子应用路由匹配规则
		},
		{
			name: 'datareport', // 子应用名称
			entry: '/datareport/', // 子应用入口
			activeRule: '/#/datareport' // 子应用路由匹配规则
		}
	];
	CreateApp(options);
} else {
	if (!window.__POWERED_BY_QIANKUN__) {
		// 作为单独的项目运行（本地开发）
		CreateApp(options);
	} else {
		// 如果为子应用
		// mount 必须为异步函数
		mount = async props => {
			options.parent = props.data;
			options.container = props.container;
			CreateApp(options);
		};
	}
}
const { unmount, bootstrap } = qiankunConf;
export { mount, unmount, bootstrap };
