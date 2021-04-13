// 验证文件类型
const vaildateAccept = (file, accept) => {
	const medias = ['image,video,audio'];
	const type = file.type.split('/')[0];
	let loading = true;
	if (this.fileType !== type) {
		this.loading = false;
	} else {
		const accepts = this.accept.split(',');
		if (!accepts.includes) {
			loading = false;
		}
	}
	if (medias.includes(this.fileType) && /^image|video|audio\/\*/.test(accept)) {
		loading = true;
	}
	if (!loading) {
		return '文件类型错误！';
	}
	return true;
};
// 验证文件大小
const vaildateSize = file => {
	const size = file.size;
	if (this.maxSize && this.maxSize < size) {
		this.$message.error('文件过大，请重新上传！');
		return false;
	}
	return true;
};
// 验证文件尺寸
const vaildateWh = file => {
	return true;
};
// 校验文件
export const vaildateFile = (file, accept, size) => {
	let vaildate = vaildateAccept(file, accept);
	vaildate = vaildate && vaildateSize(file, size);
	vaildate = vaildate && vaildateWh(file);
	return vaildate;
};
// 校验文件
export const canvasImage = file => {
	return '';
};
