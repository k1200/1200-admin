<template>
	<div class="m-crud space-table-page">
		<!-- 头部搜索栏 -->
		<space-search v-model="tableColumns" v-bind="searchProps" :size="size" :reset-method="handleReset">
			<template #default>
				<slot name="search" />
			</template>
			<template #right>
				<slot name="searchBtns" />
			</template>
		</space-search>
		<space-tool>
			<template #default>
				<slot name="tool" />
			</template>
		</space-tool>
		<!-- 表格 -->
		<space-table
			ref="spaceTable"
			v-loading="loading"
			:columns="tableColumns"
			:table-data="tableData"
			:options="tableProps"
			:selected="selected"
			:reserve-selection="reserveSelection"
			:selectable="selectable"
			:table-index="tableIndex"
			:index-lable="indexLable"
			:size="size"
			@filter-method="filterMethod"
			@sort-method="sortMethod"
			@selection-change="selectionChange"
		>
			<!-- 完全自定义列 -->
			<template #columnBefore>
				<slot name="columnBefore" />
			</template>
			<template #columnAfter>
				<slot name="columnAfter" />
			</template>
			<!-- 自定义 列 -->
			<template v-for="item of slotColumns" v-slot:[item.prop]="{ row, $index }">
				<slot :name="item.prop" :row="row" :column="item" :$index="$index" />
			</template>
			<!-- 自定义表头 -->
			<template v-for="item of slotHeaderColumns" v-slot:[setSlotHeaderName(item.prop)]>
				<slot :name="item.prop + 'Header'" :column="item" />
			</template>
			<template v-for="item of slotFilterColumns" v-slot:[setSlotFilterName(item.prop)]>
				<slot :name="item.prop + 'Filter'" :column="item" />
			</template>
		</space-table>
		<!-- 底部栏 -->
		<div class="m-table-footer">
			<!-- 多选栏 -->
			<space-multiple v-if="selected" :selected="selected" @clear-selection="clearSelection">
				<template #default>
					<slot name="multiple" />
				</template>
			</space-multiple>
			<!-- 分页 -->
			<space-page v-bind="pageProps" :size-change="pageSizeChange" :current-change="currentPageChange">
				<slot name="page" />
			</space-page>
		</div>
	</div>
</template>
<script>
import conf from './conf';
export default conf;
</script>
<style lang="scss" scoped>
.m-table-footer {
	display: flex;
	justify-content: flex-end;
	align-items: center;
}
.space-page {
	margin-left: auto;
}
</style>
