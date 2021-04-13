<template>
	<div id="app" class="app-warp">
		<router-view />
	</div>
</template>
<script>
export default {
	name: 'APP',
	mounted() {
		// this.initWebMessage(); // 响应 Iframe 通信
	},
	methods: {
		initWebMessage() {
			const { fullPath, path, query } = this.$route;
			console.log(this.$webMessage.status);
			if (this.$webMessage.status === 'resolved') {
				this.$webMessage.postMessage({
					route: { fullPath, path, query }
				});
			}
		},
		onMessage(data) {
			console.log(data);
		}
	}
};
</script>
