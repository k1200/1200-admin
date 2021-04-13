<template>
	<div id="app" class="app-warp">
		<router-view />
	</div>
</template>
<script>
export default {
	name: 'APP',
	watch: {
		// $route(val) {
		// 	const { fullPath, path, query } = val;
		// 	this.$store.state.webMessage &&
		// 		this.$store.state.webMessage.postMessage({
		// 			route: { fullPath, path, query }
		// 		});
		// }
	},
	mounted() {
		// this.initWebMessage(); // 响应 Iframe 通信
	},
	methods: {
		initWebMessage() {
			this.$store.dispatch('webMessage', {
				origin: '',
				onMessage: this.onMessage
			});
		},
		// eslint-disable-next-line no-unused-vars
		onMessage(data) {
			// console.log(data);
		}
	}
};
</script>
