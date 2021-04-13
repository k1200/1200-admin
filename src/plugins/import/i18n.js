import { camelCase } from 'lodash';
let i18n = {
	en: {},
	cn: {}
};
let filtersFiles = ['index']; // 需要过滤的文件名
try {
	const requireComponent = require.context('../../i18n', true, /\.js$/);
	requireComponent.keys().forEach(fileName => {
		const dirNames = fileName.split('/');
		const dirName = camelCase(dirNames.slice(0, -1).join('_'));
		const name = camelCase(dirNames.pop().replace(/\.\w+$/, ''));
		if (filtersFiles.includes(name)) {
			return false;
		}
		const module = requireComponent(fileName);
		const fun = module.default || module;
		i18n[name][dirName] = fun;
	});
} catch {
	console.warn('not found /src/i18n');
}
export default i18n;
