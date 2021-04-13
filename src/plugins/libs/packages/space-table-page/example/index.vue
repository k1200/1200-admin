<template>
	<div style="padding: 20px">
		<space-table-page
			ref="table"
			:columns="columns"
			:action="getList"
			:table-data="tableData"
			:search-props="searchProps"
			:page-props="pageProps"
			:selected="selected"
			:selectable="setSelectable"
			:reserve-selection="reserveSelection"
			:size="size"
			:reset="reset"
			:filter-method="filterMethod"
			:sort-method="sortMethod"
		>
			<!-- 搜索栏 -->
			<template #search>
				<el-form-item>
					<el-input
						v-model="searchForm.roomNumber"
						:size="size"
						placeholder="请输入房源号搜索"
						@keyup.enter.native="handleQuery"
					>
						<i slot="suffix" class="el-icon-search el-input__icon" @click="handleQuery" />
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="searchForm.projectId" :size="size" filterable placeholder="项目名称">
						<el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
					</el-select>
				</el-form-item>
			</template>
			<!-- 搜索栏按钮组 -->
			<template #searchBtns>
				<el-button type="primary" :size="size">下载</el-button>
				<el-button type="primary" :size="size">导出</el-button>
			</template>
			<!--
        表格主体 自定义列
        row： 当前行数据
        column: 当前列属性
        $index: index
      -->
			<template #projectNameHeader="{column}">
				<span>{{ column.label }}</span>
			</template>
			<template #projectName="{row, $index, column}">
				<span style="color: red">{{ row[column['prop']] }}</span>
			</template>
			<template #projectNameFilter="{column}">
				<span style="color: red">{{ column.prop }}</span>
			</template>
			<!-- 完全自定义列 靠前 -->
			<!-- <template #columnBefore>
        <el-table-column>靠前</el-table-column>
      </template> -->
			<!-- 完全自定义列 靠后 -->
			<template #columnAfter>
				<el-table-column label="操作" :min-width="165" fixed="right">
					<template #default="{row}">
						<el-button size="small" type="text">详情</el-button>
						<el-button size="small" type="text">编辑</el-button>
						<el-button size="small" type="text" @click="handleRemove(row)">删除</el-button>
					</template>
				</el-table-column>
			</template>
			<!-- 表格多选 -->
			<template #multiple>
				<el-button type="danger" :disabled="!selected.length" size="small" @click="handleRemove(selected)">
					批量删除
				</el-button>
			</template>
		</space-table-page>

		<space-table :columns="columns" :table-data="tableData" :selected="selected" />
	</div>
</template>

<script>
import conf from './conf';
export default conf;
</script>

<style lang="scss" scoped></style>
