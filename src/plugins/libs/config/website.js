import appWebsite from '../../import/website';
import STORAGE from '@libs/utils/storage';
import AUTH from '@libs/utils/auth';
const env = process.env;
const NODE_ENV = env.NODE_ENV; // Node 环境变量
const APP_ENV = env.VUE_APP_ENV || 'default'; // 自定义环境变量
// eslint-disable-next-line no-unused-vars
const storage = (window.STORAGE = STORAGE({ key: appWebsite.appKey || 'app' })); // 将缓存对象工具挂载到全局配置
const auth = (window.AUTH = AUTH({ tokenKey: `${appWebsite.appKey || 'app'}-token` })); // 将授权对象工具挂载到全局配置
const website = {
	clientId: 'investment', // 与服务端约定的授权参数
	clientSecret: '37b21fa497b3f46996f10458b9ebe8a4', // 与服务端约定的授权参数
	lang: 'cn', // 默认的语言
	keepAlive: 5, // keep-alive 组件缓存的最大数量
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
	storage,
	auth,
	formatMenus: {
		path: 'resourceContent', // 路由地址
		children: 'privilegeList', // 子级菜单
		icon: 'iconCls', // 菜单图标
		title: 'resourceName', // 菜单名称
		key: 'resourceCode', // 菜单唯一值
		type: 'webPageStyle' // 菜单类型
	}
};
for (let key in appWebsite) {
	if (
		Object.prototype.hasOwnProperty.call(appWebsite, key) &&
		Object.prototype.toString.call(appWebsite[key]) === '[object Function]'
	) {
		website[`_${key}`] = appWebsite[key];
		delete appWebsite[key];
		Object.defineProperties(appWebsite, {
			[key]: {
				get() {
					return website[`_${key}`](auth, storage);
				}
			}
		});
	}
}
appWebsite.env = appWebsite.env[NODE_ENV][APP_ENV] || appWebsite.env[NODE_ENV];
appWebsite.__proto__ = website;
export default appWebsite;
