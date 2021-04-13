<template>
	<div class="m-error-page">
		<img class="u-error-img" :src="activeError.imgSrc" />
		<div class="m-error-content">
			<img class="u-error-status" :src="activeError.codeSrc" />
			<div class="u-tip">{{ activeError.tip }}</div>
			<div class="actions">
				<router-link tag="el-button" class="el-button--primary el-button--small" :to="{ path: '/' }">
					返回首页
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
import png403 from './images/403.png';
import png403Text from './images/403-text.png';
import png404 from './images/404.png';
import png404Text from './images/404-text.png';
import png500 from './images/500.png';
import png500Text from './images/500-text.png';

export default {
	name: 'AsyncError',
	data() {
		return {
			downTime: 10,
			timeIndex: '',
			activeError: {},
			errorCode: {
				403: {
					imgSrc: png403,
					codeSrc: png403Text,
					tip: '抱歉，您无权访问该页面，请联系管理员添加权限'
				},
				404: {
					imgSrc: png404,
					codeSrc: png404Text,
					tip: '抱歉，你访问的页面不存在'
				},
				500: {
					imgSrc: png500,
					codeSrc: png500Text,
					tip: '抱歉，服务器出错了'
				}
			}
		};
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.activeError = vm.errorCode[to.path.slice(1)] || vm.errorCode[404];
		});
	},
	beforeRouteLeave(to, form, next) {
		clearInterval(this.timeIndex);
		next();
	},
	watch: {
		$route() {
			// this.fn_reset();
		}
	},
	created() {
		// this.fn_setInterval();
	},
	methods: {
		fn_setInterval() {
			this.timeIndex = setInterval(() => {
				this.downTime--;
				if (this.downTime === 0) {
					clearInterval(this.timeIndex);
					this.$router.replace('/');
				}
			}, 1000);
		},
		fn_reset() {
			this.downTime = 10;
			clearInterval(this.timeIndex);
			this.fn_setInterval();
		}
	}
};
</script>
<style lang="scss" scoped>
.m-error-page {
	display: flex;
	align-items: center;
	margin: -15px;
	padding: 80px 0 0 142px;
	background: $pageBg;
}
.m-error-content {
	margin-left: 65px;
}
.u-error-img {
	width: 450px;
	height: 450px;
}
.u-error-status {
	width: 162px;
	height: 74px;
}
.u-tip {
	font-size: $f16;
	color: $tableTh;
	letter-spacing: 0;
	line-height: 28px;
	margin: 12px 0;
}
</style>
