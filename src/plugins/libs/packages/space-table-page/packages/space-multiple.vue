<template>
	<div class="m-multiple-bar">
		<!-- <span
      style="font-size: 12px"
    >当前已选择 {{ selected.length }} 项数据。</span> -->
		<!-- <el-button class="u-clear-btn" type="danger" :disabled="!selected.length" size="small" @click="fn_clear__selection">
      清空选择
    </el-button> -->
		<slot />
	</div>
</template>
<script>
export default {
	name: 'SpaceMultiple',
	props: {
		selected: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	methods: {
		fn_clear__selection() {
			this.$emit('clear-selection');
		}
	}
};
</script>
