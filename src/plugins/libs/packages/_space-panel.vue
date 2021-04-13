<template>
	<div class="m-space-panel" :style="{ 'margin-bottom': $slots.footer || $slots.footerBtns ? '50px' : '0' }">
		<div v-if="header" class="m-panel-header">
			<div class="m-header-left">
				<span v-if="back" class="u-panel-back" @click.stop="onBack"><svg-icon name="back"></svg-icon></span>
				<div class="u-panel-title">
					<slot name="title">{{ title }}</slot>
				</div>
				<div class="u-panel-subtitle">
					<slot name="title">{{ subTitle }}</slot>
				</div>
			</div>
			<div class="m-header-right">
				<el-button v-if="edit" type="primary" @click.stop="edit">编辑</el-button>
				<el-button v-if="remove" type="danger" @click.stop="remove">删除</el-button>
				<slot name="handle"></slot>
			</div>
		</div>
		<div class="m-panel-main">
			<div v-if="$slots.sider" class="m-panel-sider" :style="{ width: siderWidth }">
				<slot name="sider"></slot>
			</div>
			<div class="m-panel-content">
				<slot />
			</div>
		</div>
		<div v-if="$slots.footer || $slots.footerBtns" class="m-panel-footer">
			<div v-if="$slots.footer" class="m-footer-content">
				<slot name="footer"></slot>
			</div>
			<div class="m-footer-btns">
				<slot name="footerBtns">按钮组</slot>
			</div>
		</div>
	</div>
</template>

<script>
import _svgIcon from './_svg-icon.vue';
export default {
	name: 'SpacePanel',
	components: { _svgIcon },
	props: {
		title: {
			type: String,
			default: ''
		},
		subTitle: {
			type: String,
			default: ''
		},
		edit: {
			type: Function,
			default: null
		},
		remove: {
			type: Function,
			default: null
		},
		back: {
			type: Function | Boolean,
			default: null
		},
		header: {
			type: Boolean,
			default: true
		},
		siderWidth: {
			type: String,
			default: '250px'
		}
	},
	methods: {
		onBack() {
			if (typeof this.back === 'function') {
				return this.back();
			}
			this.$router.back();
		}
	}
};
</script>

<style lang="scss" scoped>
.m-space-panel {
	background-color: #fff;
	border-radius: 2px;
}
.m-panel-header {
	height: 50px;
	line-height: 50px;
	display: flex;
	justify-content: space-between;
	padding: 0 20px;
	border-bottom: 1px solid #e9e9e9;
}
.m-header-left {
	display: flex;
	align-items: center;
}
.u-panel-back {
	margin-right: 10px;
	color: #8c8c8c;
	cursor: pointer;
	.svg-icon {
		font-size: 14px;
	}
}
.u-panel-title {
	color: #262626;
	font-weight: 600;
}
.u-panel-subtitle {
	font-size: 12px;
	margin-left: 20px;
	color: #8c8c8c;
	font-family: 'PingFangSC-Regular, PingFang SC';
}
.m-panel-main {
	padding: 20px;
	display: flex;
}
.m-panel-sider {
	padding-right: 20px;
	border-right: 1px solid #e9e9e9;
}
.m-panel-content {
	padding-left: 20px;
	flex: 1;
}
.m-panel-footer {
	position: absolute;
	z-index: 9;
	width: 100%;
	left: 0;
	bottom: 0;
	display: flex;
	justify-content: flex-end;
	height: 50px;
	line-height: 50px;
	background-color: #fff;
	padding: 0 20px;
	box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.06);
}
.m-footer-content {
	flex: 1;
}
.m-footer-btns {
	margin-left: auto;
}
</style>
