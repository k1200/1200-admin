<template>
	<g-simple-layout title="SPACE">
		<m-user-name />
	</g-simple-layout>
</template>

<script>
import GSimpleLayout from '@libs/layout/SimpleLayout';
import MUserName from './components/user-name';
export default {
	name: 'Login',
	components: {
		MUserName,
		GSimpleLayout
	},
	data() {
		return {};
	},
	computed: {},
	mounted() {},
	methods: {}
};
</script>

<style scoped lang="scss">
.g-simple-layout {
	background: url('~@/assets/images/background.jpg') no-repeat #01242d;
	background-size: cover;
}
.m-user-name {
	position: absolute;
	top: 25%;
	right: 10%;
}
</style>
