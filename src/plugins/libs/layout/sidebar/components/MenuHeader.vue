<template>
	<div class="m-app-menu-header">
		<template v-if="!openChild">
			<svg-icon class="u-app-svg" :name="icon" />
			<span v-show="!isCollapse.value" class="title">{{ title }}</span>
		</template>
		<template v-else>
			<svg-icon class="u-app-svg" name="parkingLotMenu2" />
			<template v-show="isCollapse.value">
				<span class="title">产品与服务</span>
				<i class="el-icon-caret-right" />
			</template>
		</template>
	</div>
</template>
<script>
import website from '@libs/config/website';
import { mapGetters } from 'vuex';
export default {
	name: 'MAppMenuHeader',
	inject: ['isCollapse'],
	components: {},
	props: {
		openChild: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	computed: {
		...mapGetters(['activeApp']),
		title() {
			return this.activeApp.name || website.title;
		},
		icon() {
			return this.activeApp.iconCls || 'yunying';
		}
	},
	watch: {},
	created() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.m-app-menu-header {
	display: flex;
	align-items: center;
	position: relative;
	height: 50px;
	padding: 0 30px;
	margin-bottom: 15px;
	line-height: 50px;
	font-size: $f14;
	color: #fff;
	background: #3a5678;
	.u-app-svg {
		width: 18px;
		height: 18px;
		margin-right: 7px;
	}
	.el-icon-caret-right {
		position: absolute;
		top: 50%;
		right: 20px;
		margin-top: -7px;
		width: 14px;
		height: 14px;
		line-height: 14px;
		text-align: center;
		border-radius: 50%;
		background: #596d86;
	}
}
</style>
