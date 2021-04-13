import MockMenu from '../../mock/menu';
const website = {
	title: '统一门户', // 项目名称
	clientId: 'investment', // 与服务端约定的授权参数
	clientSecret: '37b21fa497b3f46996f10458b9ebe8a4', // 与服务端约定的授权参数
	appKey: 'space',
	lang: 'cn', // 默认的语言
	keepAlive: 5, // keep-alive 组件缓存的最大数量，
	MockMenu,
	fixedTags: [
		{
			path: '/',
			name: 'Home',
			key: 'Home',
			meta: {
				title: '首页',
				key: 'Home',
				icon: 'shouye',
				fixed: true
			}
		}
	], // 固定页签
	// 菜单数据解析
	formatMenus: {
		path: 'resourceContent', // 路由地址
		children: 'privilegeList', // 子级菜单
		icon: 'iconCls', // 菜单图标
		title: 'resourceName', // 菜单名称
		key: 'resourceCode', // 菜单唯一值
		type: 'webPageStyle' // 菜单类型
	},
	// 自定义全局配置 函数接受两个参数【auth, storage】(参数参考：axios)
	// eslint-disable-next-line no-unused-vars
	request(auth, storage) {
		return {
			headers: {
				Authorization: `Bearer ${auth.getToken()}` // token 参数名。 解决各个应用请求头中的 Token 参数名称不一致。
			}
			// timeout: 5000,
			// baseURL: ''
		};
	},
	// 环境变量配置
	env: {
		// 生产环境
		production: {
			// 默认模式
			default: {
				baseUrl: '',
				portalUrl: 'http://172.16.163.53:17205/portal/v1' // 统一门户接口
			},
			// 测试模式
			test: {},
			// 预览模式
			preview: {}
		},
		// 开发环境
		development: {
			baseUrl: '/api',
			isMock: true // 开启mock
		}
	}
};
export default website;
