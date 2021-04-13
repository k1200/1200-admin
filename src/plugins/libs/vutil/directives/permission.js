export default store => {
	return {
		inserted(el, binding) {
			const { value } = binding;
			const btns = (store.getters && store.getters.buttons) || {};
			let valueType = typeof value;
			// 布尔|字符串|数组
			if (
				(valueType === 'boolean' && valueType) ||
				(valueType === 'string' && btns[value]) ||
				(valueType === 'object' && value.some(k => btns[k]))
			) {
				return false;
			}
			el.parentNode && el.parentNode.removeChild(el);
		}
	};
};
