// 全局组件注册 组价名称以下划线开头，多单词以短线分开，组件名称以大驼峰命名。_upload-media.vue
let tempMap = [];
try {
	// eslint-disable-next-line no-useless-escape
	const requireComponent = require.context('../../components', true, /_[a-z/\-?]+\.vue$/);
	requireComponent.keys().forEach(fileName => {
		const module = requireComponent(fileName);
		const component = module.default || module;
		tempMap.push({ name: component.name, component });
	});
} catch {
	console.log('not found /src/components');
}
export default tempMap;
