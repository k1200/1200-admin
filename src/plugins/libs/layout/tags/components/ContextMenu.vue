<template>
	<ul v-show="contextmenuVisble" class="contextmenu" :style="currentPoint">
		<li @click="refreshCurrent">刷新页面</li>
		<li @click="openScreenFull">全屏查看</li>
		<li v-show="canCloseCurrent" @click="handleContextmenu('tags/closeTag')">
			关闭当前
		</li>
		<li @click="handleContextmenu('tags/closeOthersTag')">关闭其他</li>
		<li @click="handleContextmenu('tags/closeAllTag')">关闭所有</li>
	</ul>
</template>
<script>
export default {
	name: 'ContextMenu',
	props: {
		contextmenuVisble: Boolean,
		contextmenuPoint: {
			type: Array,
			default() {
				return [0, 0];
			}
		},
		canCloseCurrent: Boolean
	},
	inject: ['screenFull'],
	computed: {
		currentPoint() {
			return {
				left: `${this.contextmenuPoint[0]}px`,
				top: `${this.contextmenuPoint[1]}px`
			};
		}
	},
	methods: {
		handleContextmenu(command) {
			this.$emit('handle-tag', command);
		},
		refreshCurrent() {
			this.$emit('refresh-current');
		},
		openScreenFull() {
			this.screenFull.value = true;
		}
	}
};
</script>
<style lang="scss" scoped>
.contextmenu {
	margin: 0;
	background: #fff;
	z-index: 3000;
	// position: absolute;
	position: fixed;
	line-height: 25px;
	list-style-type: none;
	padding: 5px 0;
	border-radius: 4px;
	font-size: $f12;
	font-weight: 400;
	color: #333;
	box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
.contextmenu li {
	margin: 0;
	padding: 0 16px;
	cursor: pointer;
	&:hover {
		background: #eee;
	}
}
</style>
