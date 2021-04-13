<template>
	<div class="g-app-header">
		<app-header-left />
		<app-header-right />
	</div>
</template>
<script>
import AppHeaderLeft from './left.vue';
import AppHeaderRight from './right.vue';

export default {
	name: 'GAppHeader',
	inject: ['isCollapse'],
	components: { AppHeaderLeft, AppHeaderRight },
	props: {},
	data() {
		return {};
	},
	computed: {
		marginLeft() {
			return {
				'margin-left': this.isCollapse.value ? '70px' : '240px'
			};
		}
	},
	watch: {},
	created() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.g-app-header {
	position: relative;
	flex-shrink: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 50px;
	min-height: 50px;
	padding: 0 25px;
	background: #fff;
	box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
}
</style>
