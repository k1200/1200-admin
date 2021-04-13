/* eslint-disable vue/max-len */
// 引入request工具函数
/**
 * 统一接口规范
 * 基本前缀：api
 * 功能前缀（预定义）：增->add；删->del；改->update；查->get；通过->resolve；拒绝->reject。其他操作遵循命名语义化，尽量不用缩写。
 * egg: apiAdd,apiDel,apiUpdate
 */
import request from '@libs/utils/request';

export const apiLogin = data => {
	return request(
		{
			url: '/oauth/token',
			method: 'post',
			data
		},
		{
			isAllowedRepeat: false, // 允许重复请求 (默认fasle)
			isFormData: false, // 是否为表单提交 (默认fasle)
			isInterceptError: true // 是否拦截错误信息 (默认true)
		}
	);
};
export const apiGetInfo = data => {
	return request({
		url: '/api/queryAccountPrivilegeInfo',
		method: 'post',
		data
	});
};
