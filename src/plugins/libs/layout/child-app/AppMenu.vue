<template>
	<div class="m-app-child-wrap">
		<transition name="slide-fade">
			<div class="m-app-child-content" @click.stop>
				<span class="u-close-btn el-icon-close" @click="fn_click__close_app" />
				<ul v-show="value" class="m-app-child-list">
					<li
						v-for="(item, index) in appList"
						:key="index"
						class="m-app-child-item"
						:class="{ 'is-active': activeAppId === item.appId }"
						@click="fn_click__open_app(item)"
					>
						<h4 class="u-app-title">{{ item.name }}</h4>
						<div class="m-app-content">
							<div class="u-app-desc">{{ item.detail }}</div>
							<svg-icon class="u-app-icon" name="iot" />
						</div>
					</li>
				</ul>
			</div>
		</transition>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	name: 'GAppChildApp',
	components: {},
	props: {
		value: {
			type: Boolean,
			default: false
		},
		appList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {};
	},
	computed: {
		...mapGetters(['activeAppId'])
	},
	watch: {},
	created() {},
	methods: {
		fn_click__open_app(item) {
			if (+process.env.VUE_APP_PARENT !== 1) {
				window.location.href = `${item.url}&appId=${item.appId}&accessToken=${this.$auth.getToken()}`;
			} else {
				this.$emit('input', false);
				this.$store.dispatch('app/triggerApp', item);
			}
		},
		fn_click__close_app() {
			this.$emit('input', false);
		}
	}
};
</script>
<style lang="scss" scoped>
.m-app-child-wrap {
	width: 320px;
	height: 100%;
	position: absolute;
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
.m-app-child-content {
	position: relative;
	z-index: 2;
	padding-top: 50px;
	background: #fff;
	height: 100%;
}
.m-app-child-list {
	padding: 10px 20px 80px;
	max-height: 100%;
	overflow: overlay;
	::-webkit-scrollbar {
		width: 0;
	}
}
.m-app-child-item {
	font-size: $f12;
	cursor: pointer;
	border: 1px solid $border;
	border-radius: 3px 3px 2px 2px;
	transition: box-shadow 0.2s, transform 0.2s;
	overflow: hidden;
	&:hover {
		transform: translateY(-5px);
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
	}
	&.is-active {
		border-color: $activeFont;
	}
}
.m-app-child-item + .m-app-child-item {
	margin-top: 20px;
}
.u-app-title {
	padding: 10px 16px;
	background: #f5f5f5;
	color: $title;
}
.m-app-content {
	display: flex;
	padding: 16px;
	.u-app-icon {
		flex-shrink: 0;
		width: 58px;
		height: 58px;
	}
}
.u-app-desc {
	padding-right: 10px;
	font-size: $f12;
	line-height: 1.67;
	color: $contentText;
	text-align: justify;
	flex-grow: 1;
}
.u-close-btn {
	position: absolute;
	top: 20px;
	right: 20px;
	font-size: 19px;
	color: $tableTh;
	cursor: pointer;
}
</style>
