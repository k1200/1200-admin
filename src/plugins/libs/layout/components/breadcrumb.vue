<template>
	<el-breadcrumb class="g-app-breadcrumb" separator="/">
		<transition-group name="breadcrumb">
			<el-breadcrumb-item v-for="item in breadcrumbList" :key="item.key">
				<span v-if="!item.path" class="u-app-noredirect">
					{{ item.label }}
				</span>
				<router-link v-else :to="{ path: item.path }">{{ item.label }}</router-link>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'GAppBreadcrumb',
	computed: {
		...mapGetters(['activeSource']),
		breadcrumbList() {
			return [
				{
					path: '/',
					label: '首页',
					key: 'Home'
				},
				...this.activeSource
			];
		}
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
.g-app-breadcrumb {
	font-size: $f14;
	line-height: 50px;
	&:not(:first-child) {
		margin-left: 8px;
	}
}
.u-app-noredirect {
	color: #97a8be;
	cursor: default;
}
</style>
