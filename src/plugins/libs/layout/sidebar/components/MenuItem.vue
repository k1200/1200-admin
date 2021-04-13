<template>
	<div class="m-app-menu-wrap" :class="{ 'is-collapse': isCollapse.value }">
		<div v-for="(item, index) in menus" :key="index" class="m-app-item-wrap">
			<el-submenu v-if="item.children && item.children.length > 0" :index="item.key" popper-class="m-pop-menu">
				<template #title>
					<svg-icon v-if="isFirst" :name="item.meta.icon || 'dot'" />
					<span class="u-app-title-content" style="padding-left:6px">{{ item.meta.title }}</span>
				</template>

				<menu-item v-model="item.children" />
			</el-submenu>
			<el-menu-item v-else :index="item.key" @click="fn_click__open(item)">
				<!-- 如果路由为第三方链接 点击鼠标右键 会有默认操作 -->
				<svg-icon v-if="isFirst" :name="item.icon || 'dot'" />
				<template #title>
					<span class="u-app-title-content" style="padding-left:6px">{{ item.meta.title }}</span>
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
.el-menu-item.is-active {
	background-image: url('~@/assets/images/space_theme/menu-bg.png');
	background-repeat: no-repeat;
	background-position: 100%;
	background-color: unset;
	color: $activeFont;
}
.el-menu-item.is-active:hover {
	background-color: #2e4a6c;
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
