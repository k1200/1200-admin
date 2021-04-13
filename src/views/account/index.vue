<template>
	<space-panel title="账号管理">
		<space-table-page
			ref="spaceTable"
			:columns="columns"
			:table-props="tableProps"
			:action="getList"
			:table-data="tableData"
			:search-props="searchProps"
			:page-props="pageProps"
			:selected="selected"
			:selectable="setSelectable"
			:reserve-selection="reserveSelection"
			:size="size"
			@sort-method="sortMethod"
			@filter-method="filterMethod"
		>
			<template #search>
				<el-form-item>
					<suffix-input
						v-model="searchForm.keyword"
						width="200px"
						placeholder="请输入账号/用户名称/手机号"
						@change="handleQuery"
					></suffix-input>
				</el-form-item>
				<el-form-item>
					<el-date-picker
						v-model="searchForm.daterange"
						type="daterange"
						range-separator="至"
						start-placeholder="筛选开始日期"
						end-placeholder="筛选结束日期"
						value-format="yyyy-MM-dd"
						@change="handleQuery"
					></el-date-picker>
				</el-form-item>
			</template>
			<template #account="{row, column, $index}">
				<span>
					<b>{{ column.prop }}</b>
					-{{ row.account }}-
					<b>{{ $index }}</b>
				</span>
			</template>
			<template #accountHeader="{column}">
				<b style="color: red">{{ column.label }}</b>
			</template>
			<template #columnAfter>
				<el-table-column prop="handle" label="操作">
					<el-button type="text" size="mini">详情</el-button>
					<el-button type="text" size="mini">编辑</el-button>
					<el-button type="text" size="mini">删除</el-button>
					<el-button type="text" size="mini">重置密码</el-button>
				</el-table-column>
			</template>
			<template #multiple>
				<el-button type="danger">删除</el-button>
			</template>
		</space-table-page>
		<space-table
			:columns="columns"
			:table-props="tableProps"
			:action="getList"
			:table-data="tableData"
			:selected="selected"
			:selectable="setSelectable"
			:reserve-selection="reserveSelection"
			:size="size"
			@sort-method="sortMethod"
			@filter-method="filterMethod"
			@selection-change="selectionChange"
		>
			<!-- <template #account="{row, column, $index}">
				<span>
					<b>{{ column.prop }}</b>
					-{{ row.account }}-
					<b>{{ $index }}</b>
				</span>
			</template>
			<template #accountHeader="{column}">
				<b style="color: red">{{ column.label }}</b>
			</template> -->
			<template #columnBefore>
				<el-table-column prop="handle" label="操作">
					<el-button type="text" size="mini">详情</el-button>
					<el-button type="text" size="mini">编辑</el-button>
					<el-button type="text" size="mini">禁用</el-button>
					<el-button type="text" size="mini">重置密码</el-button>
				</el-table-column>
			</template>
		</space-table>
		<space-table
			:columns="columns"
			:table-props="tableProps"
			:action="getList"
			:table-data="tableData"
			:selected="selected"
			:selectable="setSelectable"
			:reserve-selection="reserveSelection"
			:size="size"
			@sort-method="sortMethod"
			@filter-method="filterMethod"
			@selection-change="selectionChange"
		>
			<!-- <template #account="{row, column, $index}">
				<span>
					<b>{{ column.prop }}</b>
					-{{ row.account }}-
					<b>{{ $index }}</b>
				</span>
			</template>
			<template #accountHeader="{column}">
				<b style="color: red">{{ column.label }}</b>
			</template> -->
			<template #columnBefore>
				<el-table-column prop="handle" label="操作">
					<el-button type="text" size="mini">详情</el-button>
					<el-button type="text" size="mini">编辑</el-button>
					<el-button type="text" size="mini">禁用</el-button>
					<el-button type="text" size="mini">重置密码</el-button>
				</el-table-column>
			</template>
		</space-table>
	</space-panel>
</template>

<script>
import { apiGetList } from '@/api/account/account';
import { utils } from '@/plugins';
export default {
	name: 'Account',
	components: {},
	data() {
		return {
			searchForm: { keyword: '', daterange: [] },
			tableProps: {},
			tableData: [],
			searchProps: {
				handleReset: this.handleReset,
				queryBtn: true,
				handleAdd: this.handleAdd
			},
			pageProps: {
				pageSize: 10,
				currentPage: 1,
				total: 0,
				totalPage: 0
			},
			selected: [],
			reserveSelection: false,
			tableIndex: true,
			indexLable: '序号',

			size: 'small',
			reset: false
		};
	},
	computed: {
		columns() {
			return [
				{
					prop: 'account',
					label: '账号',
					slot: true,
					headerSlot: true
				},
				{
					prop: 'nickName',
					label: '用户名称'
				},
				{
					prop: 'phone',
					label: '手机号'
				},
				{
					prop: 'status',
					label: '状态',
					filtertable: true,
					// eslint-disable-next-line no-unused-vars
					formatter(row, column, $index) {
						return row.status.desc;
					},
					dict: [
						{
							label: '启用',
							value: 1
						},
						{
							label: '禁用',
							value: 0
						}
					]
				},
				{
					prop: 'createTime',
					label: '创建时间',
					// 排序
					sortable: true,
					sortProps: {
						descending: 2, // 升序
						ascending: 1, // 降序
						prop: 'tag' // 自定义标示量，默认取column.prop
					},
					// 筛选
					filtertable: true,
					filterProps: {
						type: 'daterange',
						rangeSeparator: '至',
						startPlaceholder: '开始日期',
						endPlaceholder: '结束日期',
						valueFormat: 'yyyy-MM-dd',
						// 返回格式化后的时间
						formatter(value) {
							return {
								startTime: value[0],
								endTime: value[1]
							};
						}
					}
				}
			];
		}
	},
	created() {
		this.getList();
	},
	methods: {
		// 获取数据(返回一个异步函数)
		getList() {
			const data = this.formatterReqdata();
			const params = {
				pageSize: this.pageProps.pageSize,
				pageNo: this.pageProps.currentPage
			};
			return apiGetList({ ...data, ...params })
				.then(res => {
					this.formatterResdata(res);
				})
				.catch(() => {
					this.tableData = [];
				});
		},
		// 格式化响应数据
		formatterResdata(res) {
			this.pageProps.total = res.data.totalCount;
			this.pageProps.totalPage = res.data.totalPage;
			this.tableData = res.data.list;
		},
		// 格式化请求参数
		formatterReqdata() {
			const data = utils.filterObjEmpty(this.searchForm);
			if (data.daterange) {
				data.startTime = data.daterange[0];
				data.endTime = data.daterange[1];
				delete data.daterange;
			}
			console.log(data);
			return data;
		},
		// 搜索
		handleQuery() {
			console.log('handleQuery');
			this.pageProps.currentPage = 1;
			this.getList();
		},
		// 新增函数
		handleAdd() {
			console.log('handleAdd');
			this.$router.push('/account/add');
		},
		// 控制当前列是否可选（返回true可选）
		setSelectable(row, index) {
			return index !== 4;
		},

		// 重置搜索条件
		handleReset() {
			this.$refs.spaceTable.handleReset();
			this.searchForm = {};
			this.pageProps.currentPage = 1;
			this.reset = !this.reset;
			this.getList();
		},
		selectionChange(val) {
			const len = this.selected.length;
			this.selected.splice(0, len, ...val);
		},

		// 数据筛选
		filterMethod(val) {
			this.searchForm = { ...this.searchForm, ...val };
			console.log(`filterMethod:${JSON.stringify(val)}`);
			this.handleQuery();
		},
		// 数据排序
		sortMethod(val) {
			this.searchForm = { ...this.searchForm, ...val };
			console.log(`sortMethod:${JSON.stringify(val)}`);
			this.handleQuery();
		}
	}
};
</script>

<style></style>
