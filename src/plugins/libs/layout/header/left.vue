<template>
	<div class="g-app-header-left">
		<!-- <div class="m-app-fold" @click="fn_click__change_collapse">
			<svg-icon :name="isCollapse.value ? 'fold' : 'unfold'" />
		</div> -->
		<app-breadcrumb />
		<!-- <router-link style="margin-left: 18px" to="/investment/login">子应用</router-link>
		<router-link style="margin-left: 18px" to="/platform/examples/table">租户管理</router-link> -->
	</div>
</template>
<script>
import AppBreadcrumb from '../components/breadcrumb';
export default {
	name: 'GAppHeaderLeft',
	inject: ['isCollapse'],
	components: {
		AppBreadcrumb
	},
	props: {},
	data() {
		return {};
	},
	computed: {},
	watch: {},
	created() {},
	methods: {
		fn_click__change_collapse() {
			this.isCollapse.value = !this.isCollapse.value;
		}
	}
};
</script>
<style lang="scss" scoped>
.g-app-header-left {
	display: flex;
	align-items: center;
}
.m-app-fold {
	cursor: pointer;
	.svg-icon {
		width: 14px;
		height: 12px;
	}
}
.g-app-breadcrumb {
	padding-left: 0px;
	font-size: $f12;
	color: $contentText;
}
</style>
