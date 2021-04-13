import SpaceSearch from '../packages/space-search';
import SpaceTable from '../packages/space-table';
import SpacePage from '../packages/space-page';
import SpaceTool from '../packages/space-tool';
import SpaceMultiple from '../packages/space-multiple';
export default {
	name: 'SpaceTablePage',
	components: { SpaceSearch, SpaceTable, SpacePage, SpaceMultiple, SpaceTool },
	props: {
		columns: {
			type: Array,
			required: true
		},
		tableData: {
			type: Array,
			default() {
				return [];
			}
		},
		/** table-bar props */
		tableProps: {
			type: Object,
			default() {
				return {};
			}
		},
		/** search-bar props */
		searchProps: {
			type: Object,
			default() {
				return {};
			}
		},
		pageProps: {
			type: Object,
			default() {
				return {};
			}
		},
		multipleProps: {
			type: Object,
			default() {
				return {};
			}
		},
		size: {
			type: String,
			default: 'small'
		},
		selected: {
			type: Array,
			default: null
		},
		permission: {
			type: Object,
			default: () => ({})
		},
		tableIndex: {
			type: Boolean,
			default: true
		},
		indexLable: {
			type: String,
			default: '序号'
		},
		reserveSelection: {
			type: Boolean,
			default: false
		},
		selectable: {
			type: Function,
			default: () => true
		},

		action: {
			type: Function,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			spaceTable: null,
			tableColumns: [],
			slotColumns: [],
			slotHeaderColumns: [],
			slotFilterColumns: [],
			loading: false
		};
	},
	watch: {
		options(val) {
			this.getColumns(val);
		}
	},
	created() {
		this.getColumns();
		this.getList();
	},
	mounted() {
		this.spaceTable = this.$refs.spaceTable.table;
	},
	methods: {
		setSlotHeaderName(prop) {
			return prop + 'Header';
		},
		setSlotFilterName(prop) {
			return prop + 'Filter';
		},
		getColumns(newColumns) {
			const [slotColumns, slotHeaderColumns, slotFilterColumns] = [[], [], []];
			this.tableColumns =
				this.columns.map((item, index) => {
					item.slot && slotColumns.push(item);
					item.headerSlot && slotHeaderColumns.push(item);
					item.filterSlot && slotFilterColumns.push(item);
					if (newColumns && this.columns[index]) {
						item.invisible = this.columns[index].invisible;
						// eslint-disable-next-line eqeqeq
						item.hidden != this.columns[index].hidden && (item.invisible = false);
						return item;
					}
					item.invisible = false;
					return item;
				}) || [];

			this.slotColumns = slotColumns;
			this.slotHeaderColumns = slotHeaderColumns;
			this.slotFilterColumns = slotFilterColumns;
		},
		getList() {
			this.loading = true;
			try {
				this.action().finally((this.loading = false));
			} catch (error) {
				this.loading = false;
			}
		},

		pageSizeChange(val) {
			this.pageProps.pageSize = val;
			this.handleQuery();
		},
		currentPageChange(val) {
			this.pageProps.currentPage = val;
			this.getList();
		},
		handleQuery() {
			this.pageProps.currentPage = 1;
			this.getList();
		},
		filterMethod(params) {
			this.$emit('filter-method', params);
		},
		sortMethod(params) {
			this.$emit('sort-method', params);
		},

		selectionChange(val) {
			const len = this.selected.length;
			this.selected.splice(0, len, ...val);
		},
		clearSelection() {
			this.spaceTable.clearSelection();
			this.$emit('clear-selection');
		},
		/** 向外暴露的方法 */
		handleReset() {
			this.$refs.spaceTable.handleReset();
		}
	}
};
