<template>
	<div class="m-sider-footer" :style="{ 'text-align': isCollapse.value ? 'center' : 'left' }">
		<span
			class="footer-collapse"
			:class="isCollapse.value ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
			@click.stop="setCollapse"
		></span>
	</div>
</template>
<script>
export default {
	name: 'MSiderFooter',
	inject: ['isCollapse'],
	methods: {
		setCollapse() {
			this.isCollapse.value = !this.isCollapse.value;
		}
	}
};
</script>
<style lang="scss" scoped>
.m-sider-footer {
	position: absolute;
	bottom: 0;
	width: 100%;
	height: 50px;
	line-height: 50px;
	padding: 0 20px;
	border-top: 1px solid rgba(255, 255, 255, 0.2);
	color: #dde1e6;
	font-size: 16px;
}
.footer-collapse {
	cursor: pointer;
}
</style>
