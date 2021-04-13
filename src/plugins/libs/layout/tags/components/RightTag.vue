<template>
	<el-dropdown class="top-tags__menu" @command="handleClose">
		<el-button type="primary" size="mini">
			更多
			<i class="el-icon-arrow-down el-icon--right"></i>
		</el-button>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item command="refresh-current">刷新页面</el-dropdown-item>
			<el-dropdown-item command="fn_a_tag__close_others">关闭其它</el-dropdown-item>
			<el-dropdown-item command="fn_a_tag__clear">关闭所有</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
</template>
<script>
export default {
	name: 'RightTag',
	methods: {
		handleClose(command) {
			if (command === 'refresh-current') {
				this.$emit(command);
			} else {
				this.$emit('handle-tag', command);
			}
		}
	}
};
</script>
