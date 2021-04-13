import { request } from '@/plugins';
export const apiLogin = data => {
	return request(
		{
			// url: '/uc/api/v1/auth/msLogin',
			url: '/oauth/token',
			method: 'post',
			data
		},
		{
			isFormData: true,
			isInterceptError: false
		}
	);
};
export const apiRefreshToken = data => {
	return request(
		{
			url: '/oauth/freshToken',
			method: 'post',
			data
		},
		{
			isFormData: true
		}
	);
};

export const apiTriggerApp = (params = {}) => {
	return request(
		{
			// url: '/uc/api/v1/portal/userInfo',
			url: '/api/queryAccountPrivilegeInfo',
			method: 'post',
			params: {
				...params,
				t: new Date().getTime()
			}
		},
		{
			isFormData: true
		}
	);
};

export const apiGetAppList = data => {
	return request({
		url: '/api/queryAppList',
		method: 'post',
		data
	});
};
export const apiLogout = () => {
	return request({
		url: '/user/logout',
		method: 'post'
	});
};
/** 以上接口 不要更改函数名 **/

export function fnApiUpdatePassword(data) {
	return request({
		url: '/user/updPwd',
		method: 'post',
		data
	});
}
