<template>
	<div class="m-app-menu-wrap" :class="{ 'is-collapse': isCollapse.value }">
		<div v-for="(item, index) in menus" :key="index" class="m-app-item-wrap">
			<el-submenu v-if="item.children && item.children.length > 0" :index="item.key" popper-class="m-pop-menu">
				<template #title>
					<svg-icon v-if="isFirst && isCollapse.value" class="menu-icon" :name="item.meta.icon || 'dot'" />
					<div class="m-app-menu-content">
						<svg-icon v-if="isFirst" class="menu-icon" :name="item.meta.icon || 'dot'" />
						<span class="u-app-title-content">{{ item.meta.title }}</span>
					</div>
				</template>

				<menu-item v-model="item.children" :parent-level="level" />
			</el-submenu>
			<el-menu-item v-else :index="item.key" @click="fn_click__open(item)">
				<svg-icon v-if="isFirst && isCollapse.value" class="menu-icon" :name="item.meta.icon || 'dot'" />
				<template #title>
					<div class="m-app-menu-content" :class="{ 'next-children-menu': level > 1 }" :style="menuActive">
						<svg-icon v-if="isFirst && !isCollapse.value" class="menu-icon" :name="item.meta.icon || 'dot'" />
						<span class="u-app-title-content">{{ item.meta.title }}</span>
					</div>
				</template>
			</el-menu-item>
		</div>
	</div>
</template>
<script>
export default {
	name: 'MenuItem',
	inject: ['isCollapse'],
	props: {
		value: {
			type: Array,
			default: () => []
		},
		isFirst: {
			type: Boolean,
			default: false
		},
		parentLevel: {
			type: Number,
			default: -1
		}
	},
	data() {
		return {
			meta: {}
		};
	},
	computed: {
		menus() {
			return this.value;
		},
		level() {
			return this.parentLevel + 1;
		},
		menuItem() {
			if (this.isFirst) {
				return {
					paddingLeft: '30px'
				};
			}
			return null;
		},
		menuActive() {
			if (this.isCollapse.value) return null;
			if (this.level <= 1) {
				return {
					width: `calc(100% - ${this.level * 30 || 12}px)`
				};
			}
			return {
				width: `calc(100% - ${this.level * 26}px)`
			};
		}
	},
	methods: {
		fn_click__open(menu) {
			this.$router.push(menu.path);
		}
	}
};
</script>
<style lang="scss">
.m-pop-menu {
	.el-menu--popup {
		padding: 0;
		.el-menu-item.is-active {
			background: #2e4a6c;
		}
	}
}
.m-app-sidebar {
	.el-menu.el-menu--collapse {
		.el-submenu__title,
		.el-menu-item {
			text-align: center;
		}
		.el-submenu__icon-arrow {
			display: none;
		}
		.el-menu-item.is-active {
			background: none;
		}
	}
}
</style>
<style lang="scss" scoped>
.el-menu {
	background-color: transparent;
}
.m-app-item-wrap {
	.svg-icon {
		width: 18px;
		height: 14px;
		vertical-align: middle;
	}
}
.el-menu-item {
	background: $menuBg;
}

.el-menu.el-menu--collapse {
	.u-app-title-content {
		display: none;
		padding: 0 !important;
	}
	.el-submenu__icon-arrow {
		display: none;
	}
}
.u-app-title-content {
	margin-left: 6px;
}
.m-app-menu-wrap:not(.is-collapse) .m-app-menu-content {
	display: inline-block;
	padding-left: 10px;
}
.m-app-item-wrap .is-active ::v-deep {
	.el-submenu__title,
	.el-menu-item {
		background-color: #3a5678;
	}
	background-color: #3a5678;
}
.el-menu-item.is-active {
	color: $activeFont;
}
.el-menu-item:hover {
	background-color: #2e4a6c !important;
}
.m-app-menu-wrap:not(.is-collapse) .el-menu-item.is-active {
	overflow: hidden;
	.m-app-menu-content::after {
		content: '';
		position: absolute;
		border-radius: 10px;
		background: #edf2f8;
		width: 10px;
		right: -8px;
		top: -4px;
		height: calc(100% + 8px);
	}
	.m-app-menu-content {
		background: #edf2f8;
		position: absolute;
		top: 5px;
		height: 40px;
		line-height: 40px;
		padding-left: 18px;
		border-top-left-radius: 40px;
		border-bottom-left-radius: 40px;
		right: 0;
	}
}
::v-deep {
	.el-menu.el-menu--collapse {
		.el-submenu__title,
		.el-menu-item {
			text-align: center;
		}
		.el-submenu__icon-arrow {
			display: none;
		}
		.el-menu-item.is-active {
			background: none;
		}
	}
	.el-menu-item,
	.el-submenu__title {
		height: 50px;
		line-height: 50px;
		font-size: $f12;
		color: $navItem;
		background: $menuBg;
		&:hover {
			background-color: #2e4a6c;
		}
	}
	.el-submenu__icon-arrow {
		width: 14px;
		height: 14px;
		line-height: 14px;
		text-align: center;
		border-radius: 50%;
		background: $navBg2;
		&::before {
			content: '\e790';
			color: #fff;
		}
	}
}
</style>
