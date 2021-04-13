<template>
	<div class="upload-images space-upload-images">
		<el-upload
			:class="elUploadClass"
			action="#"
			:file-list="fileList"
			:show-file-list="showFileList"
			:list-type="elListType"
			:on-success="handleSuccess"
			:on-error="handleError"
			:before-upload="beforeUpload"
			:on-preview="handlePreview"
			:on-remove="handleRemove"
			:on-exceed="uploadExceed"
			multiple
		>
			<el-button size="small" type="primary">点击上传</el-button>
			<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
		</el-upload>
	</div>
</template>
<script>
// 如果上传文件类型不为图片和视频，则默认以列表形式呈现上传后的效果
const imagesAccept = /^image\/\*/; // 图片默认格式
const videosAccept = /^video\/\*/; // 视频默认格式
export default {
	name: 'UploadFiles',
	components: {},
	inheritAttrs: false,
	props: {
		// 已上传的文件数组
		value: {
			type: Array,
			default: () => []
		},
		httpRequest: {
			type: Function,
			required: true
		},
		// 文件上传类型
		accept: {
			type: String,
			required: true
		},
		// 是否开启多选模式
		multiple: {
			type: Boolean,
			default: false
		},
		// 能否操作文件
		disabled: {
			type: Boolean,
			default: false
		},
		// 清空已上传文件
		reset: {
			type: Boolean | Function,
			default: false
		},
		// * 选择文件的方式；可选值有[button,drag]
		triggerType: {
			type: String,
			default: ''
		},
		// 自定义上传组件的类名
		uploadClass: {
			type: String,
			default: ''
		},
		// * 文件预览方式；可选值有[text,avatar,picture-card, picture]
		listType: {
			type: String,
			default: 'picture-card'
		},
		// * 文件上传的最大数量
		limit: {
			type: Number,
			default: 0
		},
		// * 文件上传的提示信息
		tip: {
			type: String,
			default: ''
		},
		// 文件最大size
		maxSize: {
			type: Number,
			default: 0
		},
		// 上传文件为图片，视频类型并且为默认预览方式的宽度
		width: {
			type: Number,
			default: 138
		},
		//上传文件为图片，视频类型并且为默认预览方式的高度
		height: {
			type: Number,
			default: 104
		},
		// 上传文件为图片类型 如果有传 targetWidth 或 targetHeight，说明需要对图片进行压缩(等比缩放)
		targetWidth: {
			type: Number,
			default: 0
		},
		// 上传文件为图片类型 如果有传 targetWidth 或 targetHeight，说明需要对图片进行压缩(等比缩放)
		targetHeight: {
			type: Number,
			default: 0
		},
		// 上传文件为图片类型 水印背景（不需要水印，不传或传空）
		watermark: {
			type: String,
			default: ''
		},
		// 上传文件为图片类型时是否开启裁剪功能
		cropper: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			uploadEle: null,
			fileAccept: '', // 实际文件 accept 属性
			loading: false
		};
	},
	computed: {
		fileList: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		},
		// 上传文件类型 [image,video,other]
		fileType() {
			if (imagesAccept.test(this.accept)) {
				return 'image';
			} else if (videosAccept.test(this.accept)) {
				return 'video';
			}
			return 'other';
		},
		// 是否即将超过上传的最大数量
		isExceed() {
			return this.limit > 0 && this.value.length === this.limit;
		},
		elUploadClass() {
			let $class = this.uploadClass;
			this.disabled && ($class += ' is-disabled');
			this.isExceed && ($class += ' is-exceed');
			return $class.trim();
		},
		elListType() {
			if (['image', 'video'].includes(this.fileType)) {
				return this.listType;
			}
			return 'text';
		},
		showFileList() {
			if (this.listType === 'avatar') return false;
			return true;
		}
	},
	watch: {
		reset() {
			this.fileList = [];
		}
	},
	mounted() {
		this.uploadEle = this.$refs.webUpload;
	},
	methods: {
		// 上传成功
		handleSuccess(res, file) {
			this.fileList.unshift({ name: file.name, url: res.data });
		},
		// 删除
		handleRemove(file) {
			const index = this.fileList.findIndex(item => item === file);
			this.fileList.splice(index, 1);
		},
		// 上传失败
		handleError(err, file) {
			console.log(err, file);
		},
		// 上传
		async handleUpload(file) {
			let $file = null;
			if (this.fileType === 'image') {
				$file = await this.uploadImages(file);
			} else if (this.fileType === 'video') {
				$file = this.uploadVideo(file);
			}
			this.httpRequest($file)
				.then(res => {
					this.handleSuccess(res, file);
				})
				.catch(error => {
					this.handleError(error, file);
				});
		},
		// 上传前
		beforeUpload(file) {
			this.loading = true;
			this.fileAccept = file.type;
			const vaildate = this.vaildateFile(file);
			if (vaildate) {
				this.handleUpload(file);
			} else {
				this.loading = false;
			}
			return false;
		},
		// 文件超出个数
		uploadExceed(files, fileList) {
			const len = fileList.length;
			const l = this.limit - len;
			if (l > 0) {
				// handleStart submit 这两个函数参考 element 源码
				// console.log(this.uploadEle)
				Array.from(files)
					.slice(0, l)
					.forEach(rawFile => {
						this.uploadEle.handleStart(rawFile);
					});
				this.$nextTick(() => {
					this.uploadEle.submit();
				});
			}
		},
		// 图片上传
		async fn_upload__images(file) {
			try {
				const uploadFile = await canvasImage(file, {
					fileType: 'file'
				});
				console.log(uploadFile);
				return uploadFile.file;
			} catch (error) {
				this.$message.errorr('图片上传失败');
				console.log(error);
			}
		},
		fn_upload__video(file) {
			return file;
		}
	}
};
</script>
<style lang="scss" scoped>
.upload-images {
	position: relative;
}
.custom-trigger {
	border: 1px dashed #d9d9d9;
	border-radius: 4px;
	border-radius: 4px;
	text-align: center;
	position: relative;
}
.custom-trigger:hover {
	border-color: #5292ff;
}
.u-custom-trigger-label::after,
.u-custom-trigger-label::before {
	content: '';
	display: block;
	position: absolute;
	background: #bfbfbf;
	top: -20px;
	left: 0;
	bottom: 0;
	right: 0;
	margin: auto;
}
.u-custom-trigger-label::after {
	width: 18px;
	height: 3px;
}
.u-custom-trigger-label::before {
	width: 3px;
	height: 18px;
}
.u-custom-trigger-label {
	position: absolute;
	font-size: $f12;
	display: flex;
	justify-content: center;
	color: #bfbfbf;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	margin: auto;
	line-height: 40px;
}
.m-custom-file {
	display: inline-block;
	position: relative;
	cursor: pointer;
	.u-file-item {
		max-width: 100%;
		max-height: 100%;
	}
	.u-file-remove {
		position: absolute;
		top: -7px;
		right: -7px;
		z-index: 2;
		color: #c0c4cc;
		background-color: #fff;
		border-radius: 50%;
	}
	&:hover::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.55);
	}
	.u-file-view {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		width: 16px;
		height: 12px;
		color: #fff;
		z-index: 2;
		display: none;
	}
	&:hover .u-file-view {
		display: block;
	}
}
.m-custom-file {
	margin-left: 20px;
	margin-bottom: 20px;
}
.m-file-list {
	display: inline-flex;
	vertical-align: top;
	margin-left: -20px;
}
.m-preview-files {
	position: absolute;
	width: 100px;
	height: 100px;
	z-index: -1;
	opacity: 0;
}

::v-deep {
	.is-exceed,
	.is-disabled {
		.el-upload--text {
			display: none;
		}
		.m-file-list > div > span::before {
			display: none;
		}
	}
	.el-upload {
		width: auto;
		height: auto;
		line-height: unset;
		margin: 0 20px 20px 0;
		position: absolute;
		left: 0;
		z-index: 9;
	}
	.el-upload-list {
		display: none;
	}
	.m-file-list > div > span::before {
		content: '';
		display: inline-block;
		width: 120px;
		height: 90px;
		margin-right: 20px;
	}
}
</style>
