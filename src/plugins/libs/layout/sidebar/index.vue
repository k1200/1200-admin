<template>
	<div class="g-app-sidebar" :class="{ 'is-collapse': isCollapse.value }">
		<app-group-logo />
		<app-menu-header :open-child="openChild" />
		<child-app @on-visible="childAppVisible" />
		<div ref="sidebar" class="m-app-sidebar">
			<!-- <div ref="sidebar" class="m-app-sidebar" :style="setHeight"> -->
			<!-- <el-scrollbar style="height: 100%" class="page-scrollbar-hidden"> -->
			<el-menu
				:unique-opened="false"
				:collapse-transition="false"
				:default-active="defaultActive"
				:collapse="isCollapse.value"
				:router="false"
				@open="fn_handle__open"
				@close="fn_handle__close"
			>
				<menu-item v-model="menus" :is-first="true" />
			</el-menu>
			<!-- </el-scrollbar> -->
		</div>
		<app-sidebar-footer />
	</div>
</template>

<script>
import AppGroupLogo from '../components/GroupLogo';
import AppMenuHeader from './components/menu-header';
import AppSidebarFooter from './components/sidebar-footer';
import MenuItem from './components/menu-item';
import ChildApp from '../child-app';
import { mapGetters } from 'vuex';
export default {
	name: 'AppSidebar',
	inject: ['isCollapse'],
	components: {
		AppGroupLogo,
		AppMenuHeader,
		MenuItem,
		ChildApp,
		AppSidebarFooter
	},
	props: {},
	data() {
		return {
			top: 0,
			bottom: 50,
			deviceHeight: 0,
			openChild: false
		};
	},
	computed: {
		...mapGetters(['menus', 'activeRouter']),
		defaultActive() {
			const route = this.$route;
			const { meta, path } = route;
			console.log({ meta, path });
			if (meta.activeMenu || meta.key) {
				return meta.activeMenu || meta.key;
			}
			return path;
		},
		setHeight() {
			const offsetY = this.top + this.bottom;
			return {
				height: `${this.deviceHeight - offsetY}px`
			};
		}
	},
	mounted() {
		const { sidebar } = this.$refs;
		this.top = sidebar.getBoundingClientRect().top;
		this.deviceHeight = document.body.clientHeight;
	},
	methods: {
		// eslint-disable-next-line no-unused-vars
		fn_handle__open(key, keyPath) {
			// console.log(key, keyPath);
		},
		// eslint-disable-next-line no-unused-vars
		fn_handle__close(key, keyPath) {
			// console.log(key, keyPath);
		},
		childAppVisible(val) {
			this.openChild = val;
		}
	}
};
</script>

<style scoped lang="scss">
.g-app-sidebar {
	display: flex;
	flex-direction: column;
	width: 240px;
	min-width: 240px;
	padding-bottom: 50px;
	background: $menuBg;
	transition: width 0.28s;
	position: relative;
	&.is-collapse {
		width: 70px;
		min-width: 70px;
		transition: width 0.28s;
		.m-app-menu-header {
			justify-content: center;
			padding: 0 8px;
		}
	}
	// .el-menu {
	//   background: transparent;
	//   border-right: 0;
	//   width: 100%;
	// }
}
.m-app-sidebar {
	overflow: overlay;
	&::-webkit-scrollbar {
		width: 0;
	}
}
::v-deep {
	.page-scrollbar-hidden {
		.el-scrollbar__wrap {
			overflow-x: hidden;
		}
		.el-scrollbar__bar {
			display: none;
		}
	}
	.g-app-sidebar.is-collapse .m-app-child-wrap::after {
		left: 70px;
	}
	.el-menu {
		background: transparent;
		border-right: 0;
		width: 100%;
		overflow: hidden;
	}
}
</style>
