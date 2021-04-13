let tempMap = [];
try {
	// eslint-disable-next-line no-useless-escape
	const requireComponent = require.context('../../mock', true, /.\.js$/);
	requireComponent.keys().forEach(fileName => {
		const module = requireComponent(fileName);
		const mock = module.default || module;
		tempMap.push(mock);
	});
} catch {
	console.log('not found /src/mock');
}

export default tempMap;
