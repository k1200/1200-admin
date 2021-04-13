<template>
	<el-select
		v-if="type === 'select'"
		ref="customFilter"
		v-model="selectedValue"
		class="m-filter-select"
		popper-class="m-table-filter-pop"
		@change="fn_change__selectedValue"
	>
		<template #prefix>
			<span class="u-filter-btn" :class="{ active: selectedValue || selectedValue === 0 }" />
		</template>
		<el-option
			v-for="item in dict"
			:key="item[dictProp.key]"
			:label="item[dictProp.label]"
			:value="item[dictProp.value]"
		/>
	</el-select>
	<span v-else class="m-date-picker">
		<el-date-picker
			ref="datePicker"
			v-model="selectedValue"
			v-bind="filterProps"
			popper-class="m-date-popper"
			@change="fn_change__datetime"
		/>
		<span class="u-filter-btn" :class="{ active: selectedValue.length }" @click="fn_click__openPicker" />
	</span>
</template>
<script>
export default {
	name: 'TableFilters',
	props: {
		column: {
			type: Object,
			required: true
		},
		isTrigger: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			selectedValue: '',
			customFilter: null,
			parentNode: null,
			popPosition: null
		};
	},
	computed: {
		filterProps() {
			return this.column.filterProps || {};
		},
		type() {
			return this.filterProps.type || 'select';
		},
		prop() {
			return this.column.prop;
		},
		dict() {
			const defaultItem = {
				label: '全部',
				value: ''
			};
			const dict = this.column.dict || [];
			if (dict.find(item => item[this.dictProp.value] === '')) {
				return dict;
			} else {
				return [
					{
						[this.dictProp.label]: defaultItem.label,
						[this.dictProp.value]: defaultItem.value
					},
					...dict
				];
			}
		},
		dictProp() {
			return {
				label: 'label',
				value: 'value',
				key: 'value',
				...(this.column.dictProps || {})
			};
		},
		isReset() {
			return this.tableProvide.reset;
		}
	},
	inject: ['tableProvide'],
	watch: {
		isTrigger() {
			this.customFilter && (this.customFilter.invisible = false);
		},
		isReset() {
			this.selectedValue = '';
		}
	},
	mounted() {
		this.customFilter = this.$refs.customFilter;
	},
	methods: {
		formatterValue(val) {
			if (this.filterProps.formatter) {
				return this.filterProps.formatter(val);
			}
			return { [this.dictProp.prop || this.prop]: val };
		},
		fn_change__selectedValue(val) {
			this.$emit('filter-method', this.formatterValue(val));
		},
		fn_change__datetime(val) {
			this.selectedValue = val;
			this.$emit('filter-method', this.formatterValue(val));
		},
		fn_click__openPicker() {
			this.$refs.datePicker.pickerVisible = true;
		}
	}
};
</script>
<style lang="scss">
.m-filter-select {
	height: 24px;
	display: inline-block;
	.el-input__inner,
	.el-input__suffix {
		display: none;
	}
}
.m-table-filter-pop {
	transform: translate(-50%, 15px);
	.popper__arrow {
		left: 50% !important;
	}
}
.m-date-popper {
	transform: translateY(-12px);
}
</style>
<style lang="scss" scoped>
.u-filter-btn {
	display: inline-block;
	width: 12px;
	height: 23px;
	background: url('../libs/images/filter-icon.png') no-repeat;
	background-position: center;
	cursor: pointer;
}
.u-filter-btn.active {
	background: url('../libs/images/filter1.png') no-repeat;
	background-position: center;
}
.m-date-picker {
	.u-filter-btn {
		margin-left: 5px;
		vertical-align: middle;
		cursor: pointer;
	}
	.el-date-editor {
		position: absolute;
		left: 0;
		z-index: -1;
		opacity: 0;
	}
	.el-input__inner {
		height: 23px;
		line-height: 23px;
		padding: 0;
	}
}
</style>
