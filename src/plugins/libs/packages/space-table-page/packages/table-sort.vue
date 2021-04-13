<template>
	<span class="m-custom-caret">
		<i
			class="sort-caret ascending u-custom-caret"
			:class="{ active: sort === ascending }"
			@click.stop="fn_click__sort(ascending)"
		/>
		<i
			class="sort-caret descending u-custom-caret"
			:class="{ active: sort === descending }"
			@click.stop="fn_click__sort(descending)"
		/>
	</span>
</template>
<script>
export default {
	name: 'TableSort',
	props: {
		column: {
			type: Object,
			default: () => {}
		},
		isTrigger: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			sort: ''
		};
	},
	computed: {
		prop() {
			return this.sortProps.prop || this.column.prop;
		},
		sortProps() {
			return this.column.sortProps || {};
		},
		// 升序
		ascending() {
			return this.sortProps.ascending || 2;
		},
		// 降序
		descending() {
			return this.sortProps.descending || 1;
		},
		isReset() {
			return this.tableProvide.reset;
		}
	},
	inject: ['tableProvide'],
	watch: {
		isTrigger() {
			if (this.sort === this.ascending) {
				this.sort = this.descending;
			} else if (this.sort === this.descending) {
				this.sort = '';
			} else {
				this.sort = this.ascending;
			}
		},
		sort(val) {
			this.$emit('sort-method', this.formatterValue(val));
		},
		isReset() {
			this.sort = '';
		}
	},
	methods: {
		fn_click__sort(sort) {
			if (this.sort === sort) {
				this.sort = '';
			} else {
				this.sort = sort;
			}
		},
		formatterValue(val) {
			if (this.sortProps.formatter) {
				return this.sortProps.formatter(val);
			}
			return { [this.prop]: val };
		}
	}
};
</script>
<style lang="scss" scoped>
.m-custom-caret {
	width: 16px;
	height: 20px;
	position: relative;
	.sort-caret {
		border-color: transparent;
		cursor: pointer;
		&.ascending {
			border-bottom-color: #c0c4cc;
			top: -0.5px;
		}
		&.descending {
			border-top-color: #c0c4cc;
			bottom: -0.5px;
		}
	}
	.sort-caret.ascending.active {
		border-bottom-color: #409eff;
	}
	.sort-caret.descending.active {
		border-top-color: #409eff;
	}
}
</style>
