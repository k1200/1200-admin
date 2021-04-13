<template>
	<div class="search-bar m-tabel-search">
		<el-form :inline="inline" @submit.native.prevent>
			<div class="g-left">
				<slot />
				<el-form-item class="m-left-btns">
					<el-button v-if="resetBtn" @click="handleReset">{{ resetText }}</el-button>
					<el-button v-if="queryBtn" type="primary" @click="handleQuery">
						<i class="el-icon-plus" />
						{{ queryText }}
					</el-button>
				</el-form-item>
			</div>
			<div class="g-right">
				<el-form-item style="margin-right: 0;">
					<el-popover v-if="filterBtn" placement="bottom" width="40" trigger="click" class="filter-column">
						<template v-for="item in columns">
							<el-checkbox
								v-if="!item.hidden"
								:key="item.prop"
								:label="item"
								:checked="!item.invisible"
								@change="itemChecked($event, item)"
							>
								{{ item.label }}
							</el-checkbox>
						</template>

						<span slot="reference" class="table-filter-btn">
							<svg
								class="svg-icon icon"
								t="1616750932804"
								viewBox="0 0 1024 1024"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								p-id="7380"
								width="16"
								height="16"
							>
								<path
									d="M868.608 64.256c34.752 0 66.176 20.352 80.384 52.032a86.08 86.08 0 0 1-15.616 94.208l-3.456 3.456-269.44 215.616a18.496 18.496 0 0 0-6.4 13.952v426.624a86.656 86.656 0 0 1-85.312 87.872h-1.92c-15.04 0-28.8-3.584-42.176-10.496l-115.008-64.128a86.528 86.528 0 0 1-45.696-76.864v-365.44a18.176 18.176 0 0 0-6.976-13.824L91.136 213.952l-2.944-3.456a84.224 84.224 0 0 1-19.776-86.016l3.072-8.256c13.504-31.872 45.056-52.48 79.744-52.032h717.44z m0 69.376H151.296a16.384 16.384 0 0 0-13.632 6.4l-2.048 3.392a17.664 17.664 0 0 0 1.152 18.56l264.832 211.52c20.736 16.832 32.896 41.6 32.896 68.224v365.312c0 6.4 2.944 12.736 8.704 15.68l114.944 62.976c4.224 2.112 8.96 2.688 13.568 1.6l4.352-1.664a18.176 18.176 0 0 0 8.768-15.552V444.096c0-26.624 11.52-51.52 32.32-68.224l265.28-213.952a17.792 17.792 0 0 0 3.136-14.72l-1.344-3.712a17.408 17.408 0 0 0-15.616-9.856z m52.672 582.656c17.344 0 31.744 12.864 34.24 29.568l0.384 5.12a34.368 34.368 0 0 1-34.112 34.752h-197.696a34.752 34.752 0 0 1 0-69.44h197.12z m0-130.048c17.344 0 31.744 12.864 34.24 29.568l0.384 5.056a34.048 34.048 0 0 1-33.408 34.688h-198.4a34.752 34.752 0 0 1 0-69.312h197.12z m0-130.624c17.344 0 31.744 12.864 34.24 29.568l0.384 5.12a34.048 34.048 0 0 1-33.408 34.688h-198.4a34.752 34.752 0 0 1 0-69.44h197.12z"
									p-id="7381"
								></path>
							</svg>
						</span>
					</el-popover>
					<slot name="right" />
					<el-button v-if="addBtn" type="primary" @click="handleAdd">
						<i class="el-icon-plus" />
						{{ addText }}
					</el-button>
				</el-form-item>
			</div>
		</el-form>
	</div>
</template>
<script>
export default {
	name: 'SpaceSearch',
	props: {
		value: {
			type: Array,
			default: () => []
		},
		resetBtn: {
			type: Boolean,
			default: true
		},
		resetText: {
			type: String,
			default: '重置'
		},
		queryBtn: {
			type: Boolean,
			default: false
		},
		queryText: {
			type: String,
			default: '查询'
		},
		addBtn: {
			type: Boolean,
			default: true
		},
		addText: {
			type: String,
			default: '新增'
		},
		filterBtn: {
			type: Boolean,
			default: true
		},
		inline: {
			type: Boolean,
			default: true
		},
		handleQuery: {
			type: Function,
			default() {
				return () => {};
			}
		},
		handleReset: {
			type: Function,
			default() {
				return () => {};
			}
		},
		handleAdd: {
			type: Function,
			default() {
				return () => {};
			}
		}
	},
	data() {
		return {
			columns: [],
			visibleColumns: []
		};
	},
	computed: {
		permission() {
			return this.crudProvide.permission;
		}
	},
	watch: {
		value(val) {
			this.columns = [...val];
		}
	},
	created() {
		this.columns = [...this.value];
	},
	methods: {
		itemChecked(val, item) {
			item.invisible = !val;
		}
	}
};
</script>
<style lang="scss">
.m-tabel-search {
	.el-form-items {
		margin-bottom: 12px;
	}
}
</style>
<style lang="scss" scoped>
.el-form {
	display: flex;
}
.g-left {
	margin-right: auto;
}
.filter-column {
	width: 30px;
	height: 30px;
	display: inline-block;
	border: 1px solid #d9d9d9;
	text-align: center;
	line-height: 30px;
	vertical-align: middle;
	color: #595959;
	cursor: pointer;
	margin-right: 6px;
	&:hover {
		color: #409eff;
	}
}
.table-filter-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	border-color: #d9d9d9;
	border-radius: 2px;
}
.m-left-btns {
	.el-button + .el-button {
		margin-left: 6px;
	}
}
::v-deep {
	.el-form-item__content {
		line-height: unset;
	}
	.el-form-item {
		margin-bottom: 20px;
		margin-right: 6px;
	}
}
</style>
