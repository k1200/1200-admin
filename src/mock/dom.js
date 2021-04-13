export const apiGetList = data => {
	return request(
		{
			url: '/user/queryUserList',
			method: 'post',
			data
		},
		{
			isFormData: true
		}
	);
};
