import Cookies from 'js-cookie';
// 设计成函数 方便后期兼容多应用切换 挂在appsite 上
export default function(appsite) {
	const TokenKey = appsite.tokenKey;
	const RefreshTokenKey = appsite.refreshTokenKey;
	const expiresIn = 3600 * 2 * 1000; // token 过期时间 默认两个小时
	let inFifteenMinutes = (time = expiresIn) => new Date(new Date().getTime() + time + 1000 * 300);
	return {
		// 获取 TOKEN
		getToken() {
			let token = window.sessionStorage.getItem(TokenKey);
			return Cookies.get(TokenKey) || (token && JSON.parse(token).content);
		},
		// 获取 TOKEN 过期时间
		getTokenExpires() {
			return Cookies.get(TokenKey + '-Expires') - 300000;
		},
		// 设置Token
		setToken(token, time) {
			time = inFifteenMinutes(time);
			Cookies.set(TokenKey + '-Expires', time.getTime(), {
				expires: time
			});
			const obj = {
				dataType: typeof token,
				content: token,
				datetime: new Date().getTime()
			};
			window.sessionStorage.setItem(TokenKey, JSON.stringify(obj));
			return Cookies.set(TokenKey, token, { expires: time });
		},
		// 删除Token
		removeToken() {
			Cookies.remove(TokenKey + '-Expires');
			return Cookies.remove(TokenKey);
		},

		// 获取 refreshToken
		getRefreshToken() {
			return Cookies.get(RefreshTokenKey);
		},
		// 设置 refreshToken
		setRefreshToken(refreshToken, time) {
			return Cookies.set(RefreshTokenKey, refreshToken, {
				expires: inFifteenMinutes(time)
			});
		},
		// 删除 refreshToken
		removeRefreshToken() {
			return Cookies.remove(RefreshTokenKey);
		},
		// 获取全部cookie
		getCookie() {
			return Cookies.get();
		},
		clear() {
			Cookies.remove(TokenKey + '-Expires');
			Cookies.remove(TokenKey);
			Cookies.remove(RefreshTokenKey);
		}
	};
}
