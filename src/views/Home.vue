<template>
	<div class="m-home">
		<div class="u-label">{{ (userInfo && userInfo.nickName) || 'xxx' }}，您好！</div>
		<div class="u-tip">欢迎来到{{ title }}</div>
		<img src="@/assets/images/home_bg.png" alt="" width="244" height="212" />
	</div>
</template>

<script>
import website from '@/config/website';
import { mapGetters } from 'vuex';
import _spacePanel from '@/plugins/libs/packages/_space-panel.vue';
export default {
	name: 'Home',
	components: { _spacePanel },
	data() {
		return {
			title: website.title
		};
	},
	computed: {
		...mapGetters(['userInfo'])
	},
	created() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
.m-home {
	background: #fff;
	border-radius: 2px;
	min-height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.u-label {
	font-size: $f16;
	color: $activeFont;
	line-height: 40px;
}
.u-tip {
	font-size: $f14;
	color: $noteText;
	margin-bottom: 83px;
}
</style>
