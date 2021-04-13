import { request } from '@/plugins';
import website from '@libs/config/website';
let key = process.env.NODE_ENV === 'production' ? website.env.portalUrl : '/portal';
export const apiLogin = data => {
	return request.formData({
		url: `${key}/oauth/token`,
		data
	});
};
export const apiTriggerApp = (params = {}) => {
	return request.formData({
		url: `${key}/api/queryAccountPrivilegeInfo`,
		params: {
			...params,
			t: new Date().getTime()
		}
	});
};

export const apiGetAppList = data => {
	return request({
		url: `${key}/api/queryAppList`,
		method: 'post',
		data
	});
};
export const apiLogout = () => {
	return request({
		url: `${key}/user/logout`,
		method: 'post'
	});
};
