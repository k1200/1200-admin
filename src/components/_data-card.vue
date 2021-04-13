<template>
	<div class="overview-head">
		<div class="overview-device">
			<div class="overview-device-item">
				<slot name="search">
					<el-select
						v-model="searchForm.keywords"
						size="small"
						class="all-type"
						:placeholder="placeholder"
						filterable
						@change="change(val)"
					>
						<el-option
							v-for="item in selectList"
							:key="item[selectProps.value]"
							:label="item[selectProps.name]"
							:value="item[selectProps.value]"
						></el-option>
					</el-select>
				</slot>
			</div>
			<template v-for="item of dataProps">
				<el-divider :key="item.prop" direction="vertical" class="line"></el-divider>
				<div :key="item.prop" class="overview-device-item">
					<div class="label">{{ dataList[item.label] }}</div>
					<div class="value" :style="{ color: item.color }">{{ dataList[item.prop || '-'] }}</div>
				</div>
			</template>
			<el-divider direction="vertical" class="line"></el-divider>
			<div class="overview-device-item">
				<el-button size="small" class="co-button button-fresh" @click="change">刷&ensp;新</el-button>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'DataCard',
	props: {
		value: {
			type: [String, Number],
			default: ''
		},
		dataProps: {
			type: Array,
			required: true
		},
		placeholder: {
			type: String,
			default: '请选择'
		},
		selectList: {
			type: Array,
			default: () => []
		},
		selectProps: {
			type: Object,
			default: () => {
				return {
					label: 'name',
					value: 'id'
				};
			}
		},
		// 异步函数
		getData: {
			type: Function,
			required: true
		}
	},
	data() {
		return {
			searchForm: { keywords: '' },
			dataList: {}
		};
	},
	watch: {
		$route(to) {
			this.searchForm.keywords = to.query.id || '';
		}
	},
	mounted() {},
	created() {
		this.searchForm.keywords = this.keywords || '';
		this.change();
	},
	methods: {
		async change(val = '') {
			this.$emit('change', val);
			this.dataList = await this.getData(this.searchForm);
		}
	}
};
</script>
<style lang="scss" scoped>
.text-danger {
	color: #ff3338 !important;
}
.text-warning {
	color: #ffa100 !important;
}
.text-success {
	color: #15af15 !important;
}
.text-disables {
	color: #bfbfbf !important;
}
.line {
	height: 49px;
}
.overview-head {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
	.overview-device {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: #262626;
		background-color: #fff;
		width: 100%;
		// &:nth-of-type(1){

		// }
		&:nth-of-type(2) {
			width: 33%;
			margin-left: 10px;
			padding-left: 100px;
		}
		&-item {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			// border-left: 1px solid #e9e9e9;
			// flex: auto;
			.label {
				font-size: 12px;
				line-height: 17px;
				color: #8c8c8c;
			}
			.value {
				margin-top: 2px;
				line-height: 28px;
				font-size: 20px;
				color: #262626;
			}
		}
		&-item:first-child {
			align-items: flex-start;
			width: 180px;
		}
		&-item:last-child {
			border-left: none;
			align-items: flex-end;
			width: 30px;
		}
	}
}
</style>
