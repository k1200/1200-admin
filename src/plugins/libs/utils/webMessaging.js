class WebMessaging {
	_timeout = 0; // 定时器
	_connectNum = 0; // 连接次数
	_maxConnectNum = 10; // 最大连接次数
	_connectTime = 300; // 定时器执行时间
	type = 'connect'; // WebMessaging 连接类型 connect：连接；answer：响应
	// 连接状态 wait:准备完成，待发起连接； pending:连接中；resolved:连接成功；rejected:连接失败；
	status = 'wait';
	_bindOnMessage = null;
	/**
	 * @desc WebMessaging 构造函数
	 * @param {object} data
	 * @param {object} [data.currentWindow] - 当前框架
	 * @param {object} [data.contentWindow] - 内嵌框架（有值：连接发起方，无值：连接响应方）
	 * @param {string} data.origin - 连接框架地址
	 * @param {function} data.onMessage - 消息响应函数
	 * @param {function} [data.successCallback] - 连接成功回调
	 * @param {function} [data.failCallback] - 连接失败回调
	 */
	constructor({ currentWindow = window, contentWindow, origin, onMessage, successCallback, failCallback }) {
		this.currentWindow = currentWindow;
		this.contentWindow = contentWindow;
		this.origin = origin;
		this.successCallback = successCallback;
		this.failCallback = failCallback;
		this.type = contentWindow ? 'connect' : 'answer';
		this._addMessageListener(onMessage);
		contentWindow && this._connect();
	}
	/**
	 * @desc 发送消息
	 * @param {object} data - 待发送信息
	 * @param {object} data.data - 消息体
	 * @param {string} data.token - 特定的加密信息。双方需进行解密校验(appId+用户token+origin+自定义秘钥)
	 * @returns
	 */
	postMessage(data) {
		let tempData = data;
		if (data && typeof data === 'object') {
			tempData = { type: 'POST-MESSAGE', ...tempData };
			tempData = JSON.stringify(tempData);
		} else {
			return console.error('data 必传且只能是对象');
		}
		this.contentWindow.postMessage(tempData, this.origin);
	}
	_addMessageListener(callback) {
		this._bindOnMessage = this._onMessage(callback);
		this.currentWindow.addEventListener('message', this._bindOnMessage);
	}
	removeMessageListener() {
		this.currentWindow.removeEventListener('message', this._bindOnMessage);
	}
	/**
	 * @desc 消息处理事件
	 * @param {function} callback - 消息处理函数
	 * @returns
	 */
	_onMessage(callback) {
		return ({ data, origin, source }) => {
			if (origin === this.origin) {
				// 验证消息是否来与指定源
				try {
					data = JSON.parse(data);
				} catch {
					console.log('');
				}

				if (data.type === 'POST-MESSAGE') {
					if (data.connectStatus) {
						this.status !== 'resolved' && this._connectSuccess({ data, origin, source });
					} else {
						callback && callback(data);
					}
				}
			} else if (origin !== this.currentWindow.location.origin && this.status !== 'resolved') {
				// 消息来自于其他源
				this.status = 'rejected';
				console.log(`webMessage 连接【${origin}】失败`);
				this.failCallback && this.failCallback();
				this._resetConnect(); // 发起重连
			}
		};
	}
	/**
	 * @desc 连接成功
	 * @returns
	 */
	_connectSuccess({ data, origin, source }) {
		this.status = 'resolved';
		if (this.type === 'connect') {
			// 连接
			clearTimeout(this._timeout);
			this.successCallback && this.successCallback({ data, origin, source });
			console.log(`webMessage 已成功连接【${origin}】`);
		} else if (this.type === 'answer') {
			// 响应
			try {
				this.contentWindow = source;
				this.postMessage({
					connectStatus: 1
				});
				console.log(`webMessage 已成功响应【${origin}】`);
			} catch (error) {
				this.status = 'pending';
			}
		}
	}
	// 发起连接(父级框架调用)
	_connect() {
		if (this._connectNum >= this._maxConnectNum) {
			this.status = 'rejected';
			this.failCallback && this.failCallback();
			this.removeMessageListener();
			return console.log(`webMessage 连接【${origin}】失败`);
		}
		this._connectNum++;
		this._timeout = setTimeout(() => {
			this.status = 'pending';
			this.postMessage({
				connectStatus: 1
			});
			this._connect();
		}, this._connectTime + 30);
	}
	// 发起重连(父级框架调用)
	_resetConnect() {
		this._connectNum = 0;
		this._connect();
	}
}
/**
 * Vue 自动注册 WebMessaging 实例
 * @param {object} Vue - Vue
 * @param {object} options - WebMessaging 实例所需参数
 * @param {string} options.origin - 父级框架地址
 * @param {function} options.onMessage - WebMessaging 响应回调函数
 */
WebMessaging.install = (Vue, options) => {
	Vue.prototype.$webMessage = new WebMessaging({
		origin: options.origin,
		onMessage: options.onMessage
	});
};
export default WebMessaging;
