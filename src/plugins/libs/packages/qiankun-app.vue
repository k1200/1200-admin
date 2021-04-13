<template>
	<div id="appContainer">
		<span>正在加载子应用……</span>
	</div>
</template>

<script>
import { start } from 'qiankun';
export default {
	data() {
		return {};
	},
	mounted() {
		this.initApp();
	},
	methods: {
		initApp() {
			!window.qiankunStarted && start();
			start();
		}
	}
};
</script>

<style></style>
