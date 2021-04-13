/* eslint-disable no-unused-vars */
/** !
 * FileName      : request
 * Version       : v1.0.0
 * Description   : 全站http请求配置
 * Author        : 1200 1053182739@qq.com
 * Created       : 2021-03-01 12:01
 **/
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import qs from 'qs';
let [service, CancelToken, pending, request] = [null, '', null, null];
NProgress.configure({
	showSpinner: false
});

const createRequest = ({ axios, store, router, website, Message }) => {
	/**
	 * 拦截重复请求
	 * 使用 cancel token 取消请求。 参考 http://www.axios-js.com/zh-cn/docs/#%E5%8F%96%E6%B6%88
	 */
	CancelToken = axios.CancelToken;
	pending = {};
	// 取消请求
	const fnCancelRequest = (key, isRequest = false) => {
		if (pending[key] && isRequest) {
			pending[key]('CancelRequest');
		}
		delete pending[key];
	};
	// 获取请求标识
	const fnGetRequestIdentify = config => {
		const url = config.url;
		// 返回url及请求参数 post方法请求参数为config.data  get方法请求参数为config.params
		if (config.method === 'post') {
			return encodeURIComponent(config.url + JSON.stringify(config.data));
		}
		return encodeURIComponent(url + JSON.stringify(config.params));
	};
	service = axios.create({
		timeout: 15000, // request timeout
		baseURL: website.env.baseUrl
		// withCredentials: true // 跨域请求，允许保存cookie
	});

	service.interceptors.request.use(
		config => {
			NProgress.start();
			const options = config.options;
			if (process.env.NODE_ENV !== 'production') {
				let pathRewrite = config.url.slice(1).split('/')[0];
				if ('portal' === pathRewrite) config.baseURL = '';
			}

			/**
			 * 重复请求拦截配置。根据实际情况自行配置
			 **/
			if (!options.isAllowedRepeat) {
				// 不允许重复请求，开启拦截(默认不允许)
				const requestData = fnGetRequestIdentify(config);
				fnCancelRequest(requestData, true);
				config.cancelToken = new CancelToken(c => {
					pending[requestData] = c;
				});
			}
			if (config.method === 'post' && options.isFormData) {
				// 模拟表单提交 会自动设置 Content-Type = application/x-www-form-urlencoded
				config.data = qs.stringify(config.data);
			}
			// 请求数据签名，服务端配合，后期跟进修改
			// ……
			delete config.options;
			return config;
		},
		error => {
			return Promise.reject(error);
		}
	);

	service.interceptors.response.use(
		response => {
			const res = response.data;
			const httpStatus = response.status; // 请求状态码
			if (httpStatus === 200) {
				return res;
			}
		},
		error => {
			return Promise.reject(error);
		}
	);

	/**
	 *
	 * @param {object} config - axios的配置项
	 * @param {object} options - 自定义配置项
	 * @param {boolean} [options.isAllowedRepeat=false] - 允许重复请求
	 * @param {boolean} [options.isFormData=false] - 请求是否为表单提交
	 * @param {boolean} [options.isInterceptError=true] - 是否拦截错误信息
	 * @param {function} [options.response] - 自行处理响应信息
	 */
	const _request = (config, options = {}) => {
		options = {
			isAllowedRepeat: false,
			isFormData: false,
			isInterceptError: true,
			...options
		};
		config.options = options;
		let requestConf = website.request || {};

		config = { ...requestConf, ...config };
		if (options.response) {
			return service(config);
		}
		return new Promise((resolve, reject) => {
			service(config)
				.then(res => {
					NProgress.done();
					// 请求成功
					// 全局处理业务请求错误
					const appStatus = res.code || res.returnCode; // 业务状态码
					const message = res.msg || res.message || '未知错误';
					const successCode = [200, '200', 0, '0'];
					// ……

					if (successCode.includes(appStatus) || !appStatus) {
						return resolve(res);
					} else {
						// 自定义错误处理
						if (!options.isInterceptError) {
							return resolve(res);
						}
						if (+appStatus === 401) {
							// 登录失效
							Message({
								message: message,
								type: 'error',
								duration: 5 * 1000
							});
							store.commit('user/RESET_USER');
							// store.dispatch('user/logoutByPassive');
							router.push('/login');
							return reject();
						}
					}
					Message({
						message: message,
						type: 'error',
						duration: 5 * 1000
					});
					return reject(res);
				})
				.catch(error => {
					NProgress.done();
					let { message } = error;
					if (message === 'CancelRequest') return reject();

					if (error.response) {
						const { data, status, header: config } = error.response;
						message = data.msg || message;
						// 自定义错误处理
						if (!options.isInterceptError) {
							const { data, status, config } = error.response;
							return reject({ data, status, config, message });
						}
						let isReject = false;
						if (message == 'Network Error') {
							message = '后端接口连接异常';
							isReject = true;
						} else if (message.includes('timeout')) {
							message = '系统接口请求超时';
							isReject = true;
						}
						if (!isReject) {
							if (status === 401) {
								// 登录失效
								Message({
									message: message,
									type: 'error',
									duration: 5 * 1000
								});
								store.commit('user/RESET_USER');
								router.push('/login');
								return reject();
							}
						}

						Message({
							message: message,
							type: 'error',
							duration: 5 * 1000
						});
						return reject({ data, status, config, message });
					}
					Message({
						message: message,
						type: 'error',
						duration: 5 * 1000
					});
					console.log(error.config);
					reject(error);
				});
		});
	};
	request = _request;
	request.get = (config, options = {}) => {
		config.method = 'get';
		return _request(config, options);
	};
	request.post = (config, options = {}) => {
		config.method = 'post';
		return _request(config, options);
	};
	request.formData = (config, options = {}) => {
		config.method = 'post';
		options.isFormData = true;
		return _request(config, options);
	};
	request.create = options => {
		return axios.create(options);
	};
	return request;
};
export { createRequest };
export default request;
