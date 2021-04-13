<template>
	<space-panel
		title="组件集合"
		sub-title="单表格，终合表格，弹窗，抽屉详情，pageCard"
		:edit="handleEdit2"
		:remove="handleRemove"
		:back="true"
	>
		<template #handle>
			<el-button>按钮1</el-button>
			<el-button>按钮2</el-button>
		</template>
		<template #sider>
			<span>我是space-panel的sider插槽</span>
		</template>
		<template #footer>
			<span>我是space-panel的footer插槽</span>
		</template>
		<template #footerBtns>
			<el-button>按钮1</el-button>
			<el-button>按钮2</el-button>
		</template>

		<!-- <page-card
		title="组件集合"
		sub-title="单表格，终合表格，弹窗，抽屉详情，pageCard"
		:border="true"
		:dot="true"
		:go-back="goBack"
	>
		<template #header>
			<el-button>按钮1</el-button>
			<el-button>按钮2</el-button>
		</template>
		<template #sider>
			<span>我是page-card的sider插槽</span>
		</template>
		<template #bottom>
			<span>我是page-card的bottom插槽</span>
		</template> -->
		<div class="dom-item">
			<p class="dom-item-tip">数据统计（建筑）：</p>
			<data-card
				:value="1"
				placeholder="请选择产品"
				:data-props="dataCardProp"
				:select-list="projectList"
				:get-data="getDeviceCount"
			></data-card>
		</div>

		<div class="dom-item">
			<p class="dom-item-tip">表格页(含搜索栏，工具栏，多选操作栏，分页)：</p>
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
					<el-table-column prop="handle" label="操作" min-width="125">
						<template slot-scope="{ row }">
							<el-button type="text" size="mini" @click="viewDetails(row)">详情</el-button>
							<el-button type="text" size="mini" @click="dialogVisible = true">编辑</el-button>
							<el-button type="text" size="mini">删除</el-button>
							<el-button type="text" size="mini">重置密码</el-button>
						</template>
					</el-table-column>
				</template>
				<template #multiple>
					<el-button type="danger" :disabled="selected.length === 0" @click="delSelected">删除</el-button>
				</template>
			</space-table-page>
		</div>

		<div class="dom-item" style="border: none">
			<p class="dom-item-tip">表格：</p>
			<space-table
				:selected="selected"
				style="margin-top 32px"
				:columns="columns"
				size="mini"
				:table-data="tableData"
			></space-table>
			<!-- 右侧抽屉详情 -->
			<detail-draer
				ref="detail"
				:data="activeRow"
				title="数据详情"
				:show-footer="false"
				@handleEdit="handleEdit"
			></detail-draer>
		</div>
		<!-- 弹窗 -->
		<space-dialog
			title="我是弹窗"
			:visible.sync="dialogVisible"
			:submit="dialogSubmit"
			:cancel="dialogCancel"
			:before-close="beforeClose"
		>
			<p>我是小尺寸表格：</p>
			<space-table :columns="columns" size="mini" :table-data="tableData"></space-table>
		</space-dialog>
		<!-- </page-card> -->
	</space-panel>
</template>

<script>
import { apiGetList } from '@/api/account/account';
import { utils } from '@/plugins';
import DetailDraer from 'detail-drawer';
import SpaceDialog from 'space-dialog';
import { PageCard } from 'page-card';
import SpaceTablePage, { SpaceTable } from 'space-table-page';
export default {
	name: 'Account',
	components: {
		DetailDraer,
		SpaceDialog,
		PageCard,
		SpaceTable,
		SpaceTablePage
	},
	data() {
		return {
			searchForm: { keyword: '', daterange: [] },
			tableProps: {},
			tableData: [],
			searchProps: {
				handleReset: this.handleReset,
				queryBtn: true,
				handleAdd: this.handleAdd,
				handleQuery: this.handleQuery
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
			reset: false,

			activeRow: [],
			dialogVisible: false,

			dataCardProp: [
				{
					prop: 'totalNum',
					labell: '设备总数'
				},
				{
					prop: 'onlineNum',
					labell: '在线总数',
					color: '#15af15'
				},
				{
					prop: 'offlineNum',
					labell: '离线总数',
					color: '#bfbfbf'
				},
				{
					prop: 'malfunctionNum',
					labell: '故障总数',
					color: '#ffa100'
				},
				{
					prop: 'alarmNum',
					labell: '告警总数',
					color: '#ff3338'
				}
			],
			projectList: [
				{
					name: '选项一',
					id: 1
				},
				{
					name: '选项二',
					id: 2
				},
				{
					name: '选项三',
					id: 3
				},
				{
					name: '选项四',
					id: 4
				},
				{
					name: '选项五',
					id: 5
				}
			]
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
			alert('handleQuery');
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
			alert(`filterMethod:${JSON.stringify(val)}`);
			this.handleQuery();
		},
		// 数据排序
		sortMethod(val) {
			this.searchForm = { ...this.searchForm, ...val };
			console.log(`sortMethod:${JSON.stringify(val)}`);
			alert(`sortMethod:${JSON.stringify(val)}`);
			this.handleQuery();
		},

		viewDetails(row) {
			this.activeRow = this.columns.map(column => {
				return { label: column.label, value: row[column.prop] };
			});
			this.$refs.detail.showDrawer();
		},
		handleEdit() {
			alert('handleEdit');
		},

		beforeClose() {
			console.log(123);
			// alert('close dialog');
			// this.dialogVisible = false;
		},
		dialogSubmit() {
			alert('dialogSubmit');
			this.dialogVisible = false;
		},
		dialogCancel() {
			alert('dialogCancel');
			this.dialogVisible = false;
		},
		goBack() {
			alert('我是返回按钮');
		},

		handleRemove() {
			alert('我是删除按钮');
		},
		handleEdit2() {
			alert('我是编辑按钮');
		},
		delSelected() {
			console.log(this.selected);
		},
		getDeviceCount() {
			return new Promise(resolve => {
				setTimeout(() => {
					resolve({
						totalNum: 0,
						onlineNum: 0,
						offlineNum: 0,
						malfunctionNum: 0,
						alarmNum: 0
					});
				}, 420);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.dom-item {
	margin: 0 -20px;
	padding: 20px;
	border-bottom: 10px solid #edf2f8;
	&:first-child {
		padding-top: 0;
	}
}
.dom-item .dom-item-tip {
	font-weight: bold;
	margin-bottom: 18px;
}
</style>
