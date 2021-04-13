<template>
	<div v-if="visible" class="m-page-bar space-page">
		<slot>
			<el-pagination v-bind="options" @size-change="sizeChange" @current-change="currentChange" />
		</slot>
	</div>
</template>
<script>
export default {
	name: 'SpacePage',
	props: {
		sizeChange: {
			type: Function,
			default: () => {}
		},
		currentChange: {
			type: Function,
			default: () => {}
		}
	},
	data() {
		return {
			defaultPageProps: {
				currentPage: 1,
				total: 1,
				pageSizes: [10, 20, 50, 100],
				pageSize: 10,
				background: true,
				layout: 'prev, pager, next, total, sizes, jumper'
			}
		};
	},
	computed: {
		options() {
			return { ...this.defaultPageProps, ...this.$attrs, hideOnSinglePage: false };
		},
		visible() {
			if (this.$attrs.hideOnSinglePage && this.options.total / this.options.pageSize < 2) {
				return false;
			}
			return true;
		}
	}
};
</script>
<style lang="scss" scoped>
.el-pagination {
	font-weight: unset;
}
.m-page-bar {
	padding: 20px 0;
	text-align: right;
	color: #595959 !important;
}
::v-deep {
	.el-pagination.is-background button {
		background-color: transparent !important;
		color: #595959 !important;
		border: 1px solid #d9d9d9;
		border-radius: 2px;
	}
	.el-pager li:not(.active) {
		border: 1px solid #dfdfdf;
		background-color: #fff !important;
	}
}
</style>
