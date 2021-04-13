<template>
	<el-table
		ref="table"
		class="m-space-table space-table"
		:class="'space-table-' + size"
		style="width: 100%"
		:data="tableData"
		:border="true"
		:row-key="attrs.rowKey || 'id'"
		size="small"
		:selected="selected"
		v-bind="attrs"
		v-on="listeners"
	>
		<template slot="empty">
			<div class="empty-table">
				暂无数据
			</div>
		</template>
		<el-table-column
			v-if="selected"
			fixed="left"
			align="center"
			:selectable="selectable"
			:reserve-selection="reserveSelection"
			width="54"
			type="selection"
		/>
		<el-table-column
			v-if="tableIndex"
			align="center"
			fixed="left"
			type="index"
			width="64"
			:label="indexLable"
			class-name="el-table-column--index"
			label-class-name="el-table-column--index"
		/>
		<slot name="columnBefore" />
		<template v-for="columnItem of columns">
			<el-table-column
				v-if="!columnItem.invisible && !columnItem.hidden"
				:key="columnItem.prop"
				v-bind="columnItem.attrs"
				:prop="columnItem.prop"
				:label="columnItem.label"
				show-overflow-tooltip
			>
				<template #default="{ row, $index }">
					<slot :name="columnItem.prop" :row="row" :$index="$index" :column="columnItem">
						{{ fn_set__columnValue(row, columnItem, $index) }}
					</slot>
				</template>
				<template #header>
					<slot :name="columnItem.prop + 'Header'">
						<table-custom-header :column="columnItem" @filter-method="filterMethod" @sort-method="sortMethod" />
					</slot>
				</template>
			</el-table-column>
		</template>
		<slot name="columnAfter" />
	</el-table>
</template>
<script>
import TableCustomHeader from './table-custom-header';
export default {
	name: 'SpaceTable',
	components: {
		TableCustomHeader
	},
	props: {
		// 表格配置
		options: {
			type: Object,
			default: () => {}
		},
		// 列 配置
		columns: {
			type: Array,
			required: true
		},
		// 表数据
		tableData: {
			type: Array,
			default() {
				return [];
			}
		},
		selected: {
			type: Array,
			default: () => null
		},
		reserveSelection: {
			type: Boolean,
			default: false
		},
		selectable: {
			type: Function,
			default: () => true
		},
		tableIndex: {
			type: Boolean,
			default: true
		},
		indexLable: {
			type: String,
			default: '序号'
		},
		size: {
			type: String,
			default: 'small'
		}
	},
	provide() {
		return {
			tableProvide: this.tableProvide
		};
	},
	data() {
		return {
			table: null,
			tableProvide: {
				reset: false
			}
		};
	},
	computed: {
		attrs() {
			return (this.options && this.options.attrs) || {};
		},
		listeners() {
			return (this.options && this.options.listeners) || { ...this.$listeners };
		}
	},
	mounted() {
		this.table = this.$refs.table;
	},
	methods: {
		// 设置 列 的显示值
		fn_set__columnValue(row, column, $index) {
			if (column.formatter) {
				return column.formatter(row, column, $index);
			} else if (column.type === 'enum') {
				const dict = column.dict;
				const dictProps = column.dictProps || { label: 'label', value: 'value' };
				const res = dict.find(item => item[dictProps.value] === row[column.prop]);
				return res ? res[dictProps.label] : row[column.prop] || '-';
			} else {
				return row[column.prop] || '-';
			}
		},
		filterMethod(params) {
			this.$emit('filter-method', params);
		},
		sortMethod(params) {
			this.$emit('sort-method', params);
		},
		handleReset() {
			this.tableProvide.reset = !this.tableProvide.reset;
		}
	}
};
</script>
<style lang="scss" scoped>
.m-space-table::v-deep {
	.el-table__column-filter-trigger,
	.caret-wrapper:not(.m-custom-caret) {
		display: none;
	}
	.el-table__fixed-right::before,
	.el-table__fixed::before {
		display: none;
	}
	.cell {
		padding: 0 20px;
	}
	.el-table-column--selection .cell,
	.el-table-column--index .cell {
		padding: 0 10px;
	}
	th {
		padding: 9px 0;
	}
	td .cell {
		line-height: 32px;
	}
}
.space-table-mini.m-space-table::v-deep {
	th {
		padding: 7px 0;
	}
	td {
		padding: 5px 0;
	}
}
.el-table-filter {
	display: none;
}
.empty-table {
	height: 140px;
	background-image: url('../libs/images/empty.svg');
	background-repeat: no-repeat;
	background-position: center 38%;
	line-height: 185px;
	color: #bfbfbf;
	color: 12px;
}
</style>
