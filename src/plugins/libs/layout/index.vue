<!-- space-theme -->
<template>
	<div class="g-app-layout space-theme" :class="appClass">
		<g-app-sidebar />
		<div class="g-app-main-wrap" :class="cpCustomClass">
			<g-app-header />
			<!-- 顶部标签卡 -->
			<g-app-tags />

			<div class="g-main-view">
				<transition-group name="fade-transform" mode="out-in">
					<template v-if="+$route.meta.requestCode === 403">
						<code-error :key="$route.meta.key" :code="403"></code-error>
					</template>
					<template v-else>
						<keep-cache />
					</template>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script>
import GAppHeader from './header';
import GAppSidebar from './sidebar';
import GAppTags from './tags';
import KeepCache from '@libs/packages/keep-cache';
import CodeError from '@libs/packages/error-page/code-error';
import { mapGetters } from 'vuex';
export default {
	name: 'Layout',
	provide() {
		return {
			userInfo: this.userInfo || {},
			isCollapse: this.isCollapse,
			screenFull: this.screenFull
		};
	},
	components: {
		KeepCache,
		GAppHeader,
		GAppSidebar,
		GAppTags,
		CodeError
	},
	data() {
		return {
			isCollapse: { value: false },
			screenFull: { value: false },
			openIframe: false
		};
	},
	computed: {
		...mapGetters(['userInfo']),
		cpCustomClass() {
			return { 'open-iframe': this.openIframe };
		},
		appClass() {
			return {
				'is-collapse': this.isCollapse.value,
				'screen-full': this.screenFull.value
			};
		}
	}
};
</script>
<style scoped lang="scss">
.g-app-layout {
	height: 100%;
	width: 100%;
	overflow: hidden;
	display: flex;
}
.g-app-main-wrap {
	width: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	position: relative;
	background-color: $pageBg;
}
.g-app-header {
	z-index: 20;
}
.g-app-sidebar {
	z-index: 10;
}
.g-main-view {
	padding: 20px;
	height: 100%;
	overflow: overlay;
}
.g-app-layout.screen-full {
	.g-app-sidebar {
		position: fixed;
		z-index: 100;
		height: 100%;
		top: 0;
		left: 0;
		&::after {
			content: '';
			position: fixed;
			height: 100%;
			width: 100%;
			top: 0;
			left: 240px;
			opacity: 0.5;
			background: #000;
			z-index: 1;
		}
	}
	.g-main-view {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		width: 100%;
		background: #edf2f8;
	}
	::v-deep {
		.m-panel-footer {
			position: fixed;
		}
		.m-app-child-app-btn {
			top: 55px;
		}
		.g-app-child-app {
			top: 0;
		}
		.m-app-child-wrap::after {
			display: none;
		}
	}
}
.g-app-tags {
	z-index: 9;
}
#appContainer .app-warp {
	background: #fff;
}
</style>
