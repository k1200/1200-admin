<template>
	<div class="iframe-container">
		<iframe
			ref="childWindow"
			class="WebIframe"
			:src="fullPath"
			width="100%"
			height="100%"
			name="webiframe"
			noresize
		></iframe>
	</div>
</template>
<script>
import website from '@libs/config/website';
import WebMessage from '@libs/utils/webMessaging';
import qs from 'qs';
export default {
	name: 'WebIframe',
	props: {
		fullPath: {
			type: String,
			default: ''
		},
		origin: {
			type: String,
			default: ''
		},
		hash: {
			type: String,
			default: ''
		},
		search: {
			type: String,
			default: ''
		},
		pathname: {
			type: String,
			default: ''
		},
		appId: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			childWindow: null,
			token: website.auth.getToken(),
			webMessage: null,
			connectNum: 0,
			timeout: 300 // 300ms 未收到响应，重新发送消息
		};
	},
	computed: {
		path() {
			let path = '';
			if (this.params) {
				path = this.params;
			}
			return this.hash ? path + this.hash.slice(1) : path;
		},
		query() {
			return this.search ? qs.parse(this.search.slice(1)) : {};
		}
	},
	watch: {
		origin() {
			this.postMessage();
		},
		fullPath() {
			this.webMessage.removeMessageListener();
		}
	},

	beforeDestroy() {
		this.webMessage.removeMessageListener();
	},
	mounted() {
		this.childWindow = this.$refs.childWindow.contentWindow;
		this.initWebMessage(); // 发起连接
	},
	created() {},
	methods: {
		initWebMessage() {
			this.webMessage = new WebMessage({
				contentWindow: this.childWindow,
				origin: this.origin,
				onMessage: this.onMessage,
				successCallback: this.postMessage
			});
		},
		onMessage(data) {
			console.log(data);
		},
		postMessage() {
			this.webMessage.postMessage({
				data: {
					token: this.token,
					appId: this.appId,
					theme: 'default',
					route: {
						path: this.path,
						query: this.query
					}
				},
				token: `${this.token}-${this.appId}-${this.origin}`
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.iframe-container {
	width: 100%;
	height: 100%;
	overflow: hidden;
	padding: 0;
	border-radius: 4px;
}
</style>
