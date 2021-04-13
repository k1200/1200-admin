import { isEmpty } from './utils';
export default function(website = { key: 'web' }) {
	const keyName = website.key + '-';
	// 设置缓存
	const setStorage = (params = {}) => {
		let { name, content, type = 'sessionStorage' } = params;
		name = keyName + name;
		const obj = {
			dataType: typeof content,
			content: content,
			datetime: new Date().getTime()
		};
		window[type].setItem(name, JSON.stringify(obj));
	};
	return {
		setItem: (params = {}) => {
			const type = Object.prototype.toString.call(params);
			if (type === '[object Object]') {
				setStorage(params);
			} else if (type === '[object Array]') {
				params.forEach(ele => {
					setStorage(ele);
				});
			}
		},
		// 获取缓存
		getItem: name => {
			name = keyName + name;
			let obj = {};
			let content;
			obj = window.sessionStorage.getItem(name);
			if (isEmpty(obj)) {
				obj = window.localStorage.getItem(name);
				if (isEmpty(obj)) {
					return;
				}
			}
			try {
				obj = JSON.parse(obj);
			} catch {
				return obj;
			}
			if (obj.dataType === 'string') {
				content = obj.content;
			} else if (obj.dataType === 'number') {
				content = Number(obj.content);
			} else if (obj.dataType === 'boolean') {
				content = eval(obj.content);
			} else if (obj.dataType === 'object') {
				content = obj.content;
			}
			return content;
		},
		// 删除某个缓存
		removeItem: name => {
			name = keyName + name;
			window.sessionStorage.removeItem(name);
			window.localStorage.removeItem(name);
		},
		// 清空缓存
		clear: () => {
			window.sessionStorage.clear();
			window.localStorage.clear();
		}
	};
}
