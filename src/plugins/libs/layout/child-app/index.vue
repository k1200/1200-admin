<template>
	<div v-if="appList.length" class="g-app-child-app">
		<div v-show="!visible" class="m-app-child-app-btn" @click.stop="openChildApp">
			<svg-icon name="parkingLotMenu2" />
		</div>
		<transition name="fade">
			<app-menu v-show="visible" v-model="visible" :app-list="appList"></app-menu>
		</transition>
	</div>
</template>
<script>
import AppMenu from './AppMenu.vue';
import { mapGetters } from 'vuex';
import { apiGetAppList } from '@libs/api';
export default {
	name: 'GAppChildApp',
	components: { AppMenu },
	props: {},
	data() {
		return {
			appList: [],
			visible: false,
			closeChildApp: this.closeApp
		};
	},
	computed: {
		...mapGetters(['activeAppId'])
	},
	watch: {
		visible(val) {
			this.$emit('on-visible', val);
		}
	},
	created() {
		this.getChildApp();
	},
	mounted() {
		document.body.addEventListener('click', this.closeChildApp);
	},
	beforeDestroy() {
		document.body.removeEventListener('click', this.closeChildApp);
	},
	methods: {
		getChildApp() {
			apiGetAppList().then(res => {
				this.appList = res.data.sysList;
				this.$store.commit('app/SET_APPLIST', this.appList);
			});
		},
		openChildApp() {
			this.visible = !this.visible;
		},
		closeApp() {
			this.visible = false;
		}
	}
};
</script>
<style lang="scss" scoped>
.g-app-child-app {
	position: absolute;
	right: 0;
	top: 50px;
	// top: 150px;
	z-index: 9;
	height: 100%;
	background: #fff;
}
.m-app-child-app-btn {
	position: absolute;
	z-index: 12;
	left: -20px;
	top: 5px;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	border: 4px solid #fff;
	background: #3a5678;
	cursor: pointer;
	.svg-icon {
		display: block;
		width: 14px;
		height: 14px;
		margin: 9px auto 0;
	}
}
</style>
