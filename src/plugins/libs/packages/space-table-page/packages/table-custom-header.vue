<template>
	<div class="m-custom-table-header" :class="headerClass" @click.stop="fn_click__handle">
		<span class="u-header-title">{{ column.label }}</span>

		<table-sort
			v-if="sortable"
			class="m-header-control"
			:column="column"
			:is-trigger="isTrigger"
			@sort-method="fn_change__sort"
		/>
		<table-filters
			v-if="filtertable"
			class="m-header-control"
			:column="column"
			:is-trigger="isTrigger"
			@filter-method="fn_change__selectedValue"
		/>
	</div>
</template>
<script>
import TableFilters from './table-filters';
import TableSort from './table-sort';
export default {
	name: 'TableCustomHeader',
	components: {
		TableFilters,
		TableSort
	},
	props: {
		column: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			isTrigger: true
		};
	},
	computed: {
		attrs() {
			return this.column.attrs || {};
		},
		sortable() {
			return this.column.sortable;
		},
		filtertable() {
			return this.column.filtertable;
		},
		headerClass() {
			return {
				'is-sort': this.sortable,
				'is-filters': this.filtertable
			};
		}
	},
	methods: {
		fn_change__selectedValue(params) {
			this.$emit('filter-method', params);
		},
		fn_change__sort(params) {
			this.$emit('sort-method', params);
		},
		fn_click__handle() {
			if (this.sortable && this.filtertable) {
				return false;
			} else {
				this.isTrigger = !this.isTrigger;
			}
		}
	}
};
</script>
<style lang="scss" scoped>
.m-custom-table-header {
	display: flex;
	align-items: center;
	white-space: nowrap;
}
.u-header-title {
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
}
.m-header-control {
	min-width: 16px;
}
</style>
