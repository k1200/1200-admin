<template>
	<div class="m-app-group-logo">
		<template v-if="!isCollapse.value">
			<img v-if="userInfo.spImgSrc" class="u-app-logo-img" :src="userInfo.spImgSrc" />
			<svg-icon v-else name="logo" style="width:90px;height:32px" />
		</template>
		<template v-else>
			<img v-if="userInfo.spImgSrc" class="u-app-logo-img" :src="userInfo.spImgSrc" />
			<svg-icon v-else-if="userInfo.logo" name="logo" style="width:32px;height:32px" />
			<svg-icon v-else name="small_logo" style="width:32px;height:32px" />
		</template>
	</div>
</template>
<script>
export default {
	name: 'MAppGroupLogo',
	inject: ['isCollapse', 'userInfo'],
	components: {},
	props: {},
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
.m-app-group-logo {
	padding-left: 20px;
	height: 50px;
	min-height: 50px;
	position: relative;
	display: flex;
	align-items: center;
}
.u-app-logo-img {
	display: block;
	height: 18px;
	&.u-small-logo {
		position: absolute;
		top: 7px;
		left: 17px;
		height: 36px;
		width: 36px;
	}
}
</style>
