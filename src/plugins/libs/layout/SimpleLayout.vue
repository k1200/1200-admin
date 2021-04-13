<template>
	<div class="g-simple-layout">
		<header v-if="header" class="g-simple-header"></header>
		<div class="g-simple-main">
			<div class="simple-main">
				<slot></slot>
			</div>
		</div>
		<div v-if="footer" class="g-simple-footer"></div>
	</div>
</template>
<script>
export default {
	name: 'GSimpleLayout',
	components: {},
	props: {
		header: {
			type: Boolean,
			default: true
		},
		footer: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	created() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.g-simple-layout,
.g-simple-main,
.simple-main {
	height: 100%;
	width: 100%;
	position: relative;
	overflow: hidden;
}
</style>
