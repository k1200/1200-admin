import getters from '@/store/getters';
const appGetters = getters;
const appModules = {};
try {
	const requireComponent = require.context(
		// 其组件目录的相对路径
		'@/store/modules',
		// 是否查询其子目录
		false,
		// 匹配文件名的正则表达式
		/\.js$/
	);
	requireComponent.keys().forEach(fileName => {
		const storeName = fileName
			.split('/')
			.pop()
			.replace(/\.\w+$/, '');
		// 排除不需要的文件
		if (storeName === 'index') {
			return false;
		}
		// 获取文件
		let module = requireComponent(fileName);
		// 如果这个文件选项是通过 `export default` 导出的，
		// 那么就会优先使用 `.default`，
		// 否则回退到使用模块的根。
		module = module.default || module;
		appModules[storeName] = module;
	});
} catch (error) {
	console.warn('not found /src/store/modules');
}
export { appGetters, appModules };
