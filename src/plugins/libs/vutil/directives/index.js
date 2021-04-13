const requireComponent = require.context(
	// 其组件目录的相对路径
	'.',
	// 是否查询其子目录
	false,
	// 匹配文件名的正则表达式
	/\.js$/
);
export default Vue => {
	requireComponent.keys().forEach(fileName => {
		const directiveName = fileName
			.split('/')
			.pop()
			.replace(/\.\w+$/, '');
		// 排除不必注册指令的文件
		if (directiveName === 'index') {
			return false;
		}
		// 获取文件
		const module = requireComponent(fileName);
		// 如果这个文件选项是通过 `export default` 导出的，
		// 那么就会优先使用 `.default`，
		// 否则回退到使用模块的根。
		const fun = module.default || module;
		// 全局注册指令
		Vue.directive(directiveName, fun);
	});
};
