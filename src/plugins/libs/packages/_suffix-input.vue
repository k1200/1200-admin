<template>
	<el-input v-model="keyWords" size="small" :style="{ width }" v-bind="$attrs" @keyup.enter.native="change">
		<i slot="suffix" class="el-input__icon" :class="icon" @click.stop="change" />
	</el-input>
</template>

<script>
export default {
	name: 'SuffixInput',
	props: {
		value: {
			type: String,
			default: ''
		},
		width: {
			type: String,
			default: '200px'
		},
		icon: {
			type: String,
			default: 'el-icon-search'
		}
	},
	computed: {
		keyWords: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit('input', val);
			}
		}
	},
	methods: {
		change() {
			this.$emit('change', this.value);
		}
	}
};
</script>

<style lang="scss" scoped>
::v-deep {
	.el-input__suffix {
		cursor: pointer;
		width: 30px;
		height: 28px;
		line-height: 28px;
		top: 2px;
		right: 0;
		&:hover {
			background: rgba(82, 146, 255, 0.08);
		}
	}
}
</style>
