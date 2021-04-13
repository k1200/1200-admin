import SpaceTablePage from '../src/index.vue';
import spaceTable from '../packages/space-table.vue';
// import { apiGetTable } from '@/api/example'
export default {
	name: 'ExampleTable',
	components: { SpaceTablePage, spaceTable },
	data() {
		return {
			refTable: null, // 表格DOM
			// 查询参数
			searchForm: {},
			/** 组件属性配置项 组件属性配置项 组件属性配置项 **/
			tableData: [], // 表格数据
			// 表格属性配置 参考element-ui
			tableProps: {
				attrs: {}, // 属性
				listeners: {} // 事件 会严格区分驼峰和短横线
			},
			// 搜索栏配置
			searchProps: {
				resetBtn: true, // 是否显示重置按钮
				resetText: '重置', // 重置按钮文本
				queryBtn: true, // 是否显示搜索按钮
				queryText: '查询', // 搜索按钮文本
				addBtn: true, // 是否显示新增按钮
				addText: '新增', // 新增按钮文本
				filterBtn: true, // 是否显示 控制列显示 按钮
				handleReset: this.handleReset, // 搜索重置回调函数
				handleAdd: this.handleAdd, // 点击新增按钮回调函数
				handleQuery: this.handleQuery // 触发搜索回调函数
			},

			// 分页参数
			pageProps: {
				pageSize: 10,
				currentPage: 1,
				total: 0,
				totalPage: 0
			},

			// 表格多选配置
			selection: true, // 是否显示多选控制栏
			selected: [], // 已选择数据
			reserveSelection: false, // 是否在数据更新之后保留之前选中的数据

			tableIndex: true, // 是否开启列的序号
			indexLable: '序号', // 列序号的表头文本

			size: 'small', // 表格尺寸
			reset: false, // 重置表格查询条件
			/** 组件属性配置项 组件属性配置项 组件属性配置项 **/

			// 其他依赖参数
			projectList: [
				{
					id: '',
					projectName: '全部项目'
				},
				{
					id: 192,
					projectName: '科兴科学园'
				},
				{
					id: 193,
					projectName: '科兴二期'
				},
				{
					id: 194,
					projectName: '中科大厦'
				},
				{
					id: 195,
					projectName: '创益科技大厦'
				},
				{
					id: 196,
					projectName: '云升科学园'
				},
				{
					id: 198,
					projectName: '同方信息港'
				},
				{
					id: 323,
					projectName: '清法信息港'
				}
			],
			activeRow: null
		};
	},
	computed: {
		columns() {
			return [
				{
					prop: 'projectName',
					label: '项目名称',
					invisible: false,
					hidden: this.isHidden,
					filtertable: true,
					slot: true,
					headerSlot: false,
					filterSlot: false,
					dictProps: {
						label: 'projectName',
						value: 'id'
					},
					dict: this.projectList,
					attrs: {
						// element-ui 属性集合
						minWidth: 163,
						fixed: 'left'
					}
				},
				{
					prop: 'endTime',
					label: '装修完成时间',
					sortable: true,
					sortProps: {
						descending: 2,
						ascending: 1,
						prop: 'tag'
					},
					filtertable: true,
					// eslint-disable-next-line no-unused-vars
					formatter(row, column, $index) {
						// console.log(row, column, $index)
						return new Date(row[column.prop]);
					},
					filterProps: {
						type: 'daterange',
						rangeSeparator: '至',
						startPlaceholder: '开始日期',
						endPlaceholder: '结束日期',
						valueFormat: 'yyyy-MM-dd',
						formatter(value) {
							return {
								startTime: value[0],
								endTime: value[1]
							};
						}
					},
					attrs: {
						minWidth: 152,
						sortable: true
					}
				},
				{
					prop: 'area',
					label: '面积(㎡)'
				},
				{
					prop: 'decorateCharge',
					label: '费用(元)'
				},
				{
					prop: 'status',
					label: '状态',
					type: 'enum',
					filtertable: true,
					dict: [
						{
							label: '草稿',
							value: 1
						},
						{
							label: '已完成',
							value: 0
						}
					]
				}
			];
		}
	},
	created() {},
	mounted() {
		this.refTable = this.$refs.table;
	},
	methods: {
		// 获取数据(返回一个异步函数)
		getList() {
			return [];
			// const data = this.formatterReqdata()
			// const params = {
			//   pageSize: this.pageProps.pageSize,
			//   pageNo: this.pageProps.currentPage
			// }
			// return apiGetTable(data, params).then(res => {
			//   this.formatterResdata(res)
			// }).catch(() => {
			//   this.tableData = []
			// })
		},
		// 格式化响应数据
		formatterResdata(res) {
			this.pageProps.total = res.data.total;
			this.tableData = res.data.records;
		},
		// 格式化请求参数
		formatterReqdata() {
			const data = this.searchForm;
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
		},
		// 控制当前列是否可选（返回true可选）
		setSelectable(row, index) {
			return index !== 4;
		},

		// 重置搜索条件
		handleReset() {
			console.log('handleReset');
			this.searchForm = {};
			this.pageProps.currentPage = 1;
			this.reset = !this.reset;
			this.getList();
		},

		// 数据筛选
		filterMethod(val) {
			console.log(`filterMethod:${JSON.stringify(val)}`);
		},
		// 数据排序
		sortMethod(val) {
			console.log(`sortMethod:${JSON.stringify(val)}`);
		},

		// 删除
		handleRemove(row) {
			let ids = '';
			let tempTip = [];
			if (Object.prototype.toString.call(row) === '[object Array]') {
				ids = row
					// eslint-disable-next-line no-sequences
					.map(item => (tempTip.push(item.projectName), item.id))
					.toString();
			} else {
				ids = row.id;
				tempTip = [row.label];
			}
			if (ids) {
				this.$confirm(`确认删除【${tempTip.join(' | ')}】的数据, 是否继续?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					closeOnPressEscape: false,
					type: 'warning'
				})
					.then(() => {
						this.getList();
						console.log('操作成功!');
					})
					.catch(() => {
						this.$message.info('已取消删除！');
					});
			} else {
				this.$message.warning('请至少选择一条数据!');
			}
		}
	}
};
