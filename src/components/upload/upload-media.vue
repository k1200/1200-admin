<template>
	<div class="upload-images web-upload-images">
		<el-upload
			ref="webUpload"
			:class="customClass"
			action="#"
			:accept="accept"
			:drag="drag"
			:before-upload="fn_upload__before"
			:on-success="fn_upload__suceess"
			:on-exceed="fn_upload__exceed"
			:file-list="fileList"
			v-bind="$attrs"
		>
			<template #trigger>
				<div v-show="!isExceed && !disabled" class="custom-trigger" :style="viewSize">
					<slot />
					<span class="u-custom-trigger-label">
						<span style="transform: translateY(35px);">上传{{ fileTypeLabel }}</span>
					</span>
				</div>
			</template>
			<div v-if="disabled && !fileList.length">
				<svg-icon
					v-if="fileType === 'image'"
					name="resourcesImage"
					:style="{ 'min-height': height + 'px', 'min-width': width + 'px' }"
				/>
				<svg-icon
					v-else-if="fileType === 'video'"
					name="resourcesVideo"
					:style="{ 'min-height': height + 'px', 'min-width': width + 'px' }"
				/>
			</div>
			<div
				v-else
				v-loading="loading"
				class="m-file-list"
				style="display: inline-block;"
				:style="{ 'min-height': height + 'px', 'min-width': width + 'px' }"
			>
				<draggable v-model="fileList">
					<transition-group>
						<template v-for="file in fileList">
							<div :key="file.url" class="m-custom-file" :style="viewSize">
								<img
									v-if="fileType === 'image'"
									class="u-file-item"
									:src="file.url + '?x-oss-process=image/resize,m_fill,w_' + width + ',h_' + height"
									:alt="file.name"
								/>
								<video v-if="fileType === 'video'" class="u-file-item" muted volume="0.0">
									<source :src="file.url" type="video/mp4" />
									您的浏览器不支持视频播放
								</video>
								<span v-if="!disabled" class="u-file-remove el-icon-error" @click="fn_click__remove(file)" />
								<span class="u-file-view" :class="iconView" @click="fn_click__preview(file)" />
							</div>
						</template>
					</transition-group>
				</draggable>
			</div>
		</el-upload>
		<el-image
			ref="previewFiles"
			class="m-preview-files"
			:src="previewUrl"
			:z-index="9999999999"
			:preview-src-list="previewList"
		/>
	</div>
</template>
<script>
const imagesAccept = /^image\/\*/; // 图片默认格式
const videosAccept = /^video\/\*/; // 视频默认格式
const audiosAccept = /^audio\/\*/; // 音频默认格式
import { fn_api__upload } from '@/api/common';
import { fn_util__canvasImage } from '@libs/utils/utils';
import draggable from 'vuedraggable';
export default {
	name: 'UploadMedia',
	components: {
		draggable
	},
	inheritAttrs: false,
	props: {
		// 已上传的文件数组
		value: {
			type: Array,
			default: () => []
		},
		// 文件上传类型
		accept: {
			type: String,
			required: true
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
		// * 文件预览方式；可选值有[list,avatar]
		previewType: {
			type: String,
			default: ''
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

		drag: {
			type: Boolean,
			default: false
		},
		// 文件存放路径
		dirname: {
			type: [Number, String],
			required: true
		}
	},
	data() {
		return {
			uploadEle: null,
			fileAccept: '', // 实际文件 accept 属性
			previewUrl: '',
			isExceed: false,
			loading: false
		};
	},
	computed: {
		viewSize() {
			return {
				width: `${this.width}px`,
				height: `${this.height}px`
			};
		},
		// 是否对图片进行压缩
		isCompress() {
			return this.targetWidth || this.targetHeight;
		},
		// 上传文件类型 [image,video,audio,other]
		fileType() {
			if (imagesAccept.test(this.accept)) {
				return 'image';
			} else if (videosAccept.test(this.accept)) {
				return 'video';
			} else if (audiosAccept.test(this.accept)) {
				return 'audio';
			}
			return 'other';
		},
		fileList: {
			get() {
				return this.value.map(item => {
					return { url: item };
				});
			},
			set(val) {
				this.$emit(
					'input',
					val.map(item => item.url)
				);
			}
		},
		fileTypeLabel() {
			if (imagesAccept.test(this.accept)) {
				return '图片';
			} else if (videosAccept.test(this.accept)) {
				return '视频';
			} else if (audiosAccept.test(this.accept)) {
				return '音频';
			}
			return '文件';
		},
		iconView() {
			if (this.fileType === 'image') {
				return 'el-icon-view';
			} else if (this.fileType === 'video') {
				return 'el-icon-video-play';
			} else {
				return '';
			}
		},
		// 预览列表
		previewList() {
			if (this.fileType === 'image') {
				return this.fileList.map(item => item.url);
			} else {
				return [this.previewUrl];
			}
		},
		limit() {
			return this.$attrs.limit;
		},
		customClass() {
			let uploadClass = '';
			if (this.isExceed || this.value.length === this.limit) {
				uploadClass = 'is-exceed ';
			}
			if (this.disabled) {
				return uploadClass + 'is-disabled ';
			}
			return uploadClass + this.uploadClass;
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
		// 删除
		fn_click__remove(file) {
			const index = this.fileList.findIndex(item => item === file);
			this.fileList.splice(index, 1);
			this.$emit(
				'input',
				this.fileList.map(item => item.url)
			);
			this.isExceed = false;
		},
		// 预览
		fn_click__preview(file) {
			this.previewUrl = file.url;
			this.$refs.previewFiles.showViewer = true;
			if (this.fileType === 'video') {
				this.$nextTick(() => {
					this.fn_preview__video(file);
				});
			}
		},
		// 预览视频
		fn_preview__video(file) {
			const f = document.createDocumentFragment();
			const viewerWrapper = document.querySelector('.el-image-viewer__wrapper');
			f.appendChild(viewerWrapper);
			const viewer = viewerWrapper.querySelector('.el-image-viewer__canvas');
			const oldChild = viewer.querySelector('img');
			const video = document.createElement('video');
			video.controls = true;
			video.autoplay = true;
			video.muted = true;
			video.src = file.url;
			viewer.replaceChild(video, oldChild);
			viewerWrapper.removeChild(viewerWrapper.querySelector('.el-image-viewer__actions'));
			document.body.appendChild(f);
		},
		// 文件超出个数
		fn_upload__exceed(files, fileList) {
			this.isExceed = true;
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
		// 上传前
		fn_upload__before(file) {
			this.loading = true;
			this.fileAccept = file.type;
			const vaildate = this.fn_vaildate__file(file);
			if (vaildate) {
				this.fn_handle__upload(file);
			} else {
				this.loading = false;
			}
			return false;
		},
		// 上传成功
		fn_upload__suceess(res, file) {
			this.fileList.unshift({
				name: file.name,
				url: res.data
			});
			this.$emit(
				'input',
				this.fileList.map(item => item.url)
			);
			if (this.fileList.length >= this.limit) {
				this.isExceed = true;
			}
			this.loading = false;
		},
		// 上传
		async fn_handle__upload(file) {
			let res = null;
			if (this.fileType === 'image') {
				res = await this.fn_upload__images(file);
			} else if (this.fileType === 'video') {
				res = this.fn_upload__video(file);
			}
			const formData = new FormData();
			formData.append('file', res);
			formData.append('type', this.dirname);
			res = await fn_api__upload(formData);
			if (res.data !== '1010') {
				this.fn_upload__suceess(res, file);
			} else {
				this.loading = false;
				this.$message.errorr('图片上传失败');
			}
		},
		// 图片上传
		async fn_upload__images(file) {
			try {
				const uploadFile = await fn_util__canvasImage(file, {
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
		},
		// 校验文件
		fn_vaildate__file(file) {
			let vaildate = this.fn_vaildate__accept(file);
			vaildate = vaildate && this.fn_vaildate__size(file);
			vaildate = vaildate && this.fn_vaildate__wh(file);
			return vaildate;
		},
		// 验证文件类型
		fn_vaildate__accept() {
			const medias = ['image,video,audio'];
			const type = this.fileAccept.split('/')[0];
			if (this.fileType !== type) {
				this.loading = false;
			} else {
				const accepts = this.accept.split(',');
				if (!accepts.includes) {
					this.loading = false;
				}
			}
			if (medias.includes(this.fileType) && /^image|video|audio\/\*/.test(this.accept)) {
				this.loading = true;
			}
			if (!this.loading) {
				this.$message.error('文件类型错误！');
				return false;
			}
			return true;
		},
		// 验证文件大小
		fn_vaildate__size(file) {
			const size = file.size;
			if (this.maxSize && this.maxSize < size) {
				this.$message.error('文件过大，请重新上传！');
				return false;
			}
			return true;
		},
		// 验证文件尺寸
		fn_vaildate__wh() {
			return true;
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
