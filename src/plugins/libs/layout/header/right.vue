<template>
	<div class="g-app-header-right">
		<el-dropdown class="m-user-info">
			<span class="el-dropdown-link">
				<img :src="avatarUrl" class="u-app-avatar" alt />
				<span class="u-app-user-name">{{ userInfo.nickName || userInfo.account }}</span>
				<i class="el-icon-caret-bottom el-icon--right" />
			</span>
			<template #dropdown>
				<el-dropdown-menu class="m-app-logout">
					<el-dropdown-item class="m-app-user-detail" disabled>
						<img :src="avatarUrl" class="u-app-avatar" alt />
						<div class="el-dropdown-link u-app-fullName">
							{{ userInfo.nickName || userInfo.account }}
						</div>
					</el-dropdown-item>
					<el-dropdown-item class="m-app-btns">
						<div class="m-app-logout-btn" @click="fn_click__logout">
							<span>退出登录</span>
						</div>
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>
<script>
import avatarUrl from '@libs/assets/images/user.png';
export default {
	name: 'GAppHeaderRight',
	inject: ['userInfo'],
	components: {},
	props: {},
	data() {
		return {};
	},
	computed: {
		avatarUrl() {
			return this.userInfo.avatarUrl || avatarUrl;
		}
	},
	watch: {},
	created() {},
	methods: {
		async fn_handle__loginout() {
			await this.$store.dispatch('user/logout');
			// this.$router.push(`/login?redirect=${this.$route.fullPath}`);
			// this.$router.push('/login');
		},
		fn_click__logout() {
			this.$confirm('是否确认退出?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					this.fn_handle__loginout();
				})
				.catch(() => {});
		}
	}
};
</script>
<style lang="scss" scoped>
.m-user-info {
	margin-left: 30px;
	height: 30px;
	cursor: pointer;
}
.el-dropdown-link {
	display: flex;
	align-items: center;
}
.u-app-avatar {
	border-radius: 100%;
	display: block;
	margin-right: 6px;
	border-radius: 50%;
	width: 30px;
	height: 30px;
}
.m-app-logout {
	padding-bottom: 0;
	width: 240px;
}
.m-app-user-detail {
	display: flex;
	.u-app-avatar {
		width: 32px;
		height: 32px;
	}
}
.u-app-fullName {
	margin-left: 10px;
}
.m-app-btns {
	border-top: 1px solid $border;
	margin-top: 10px;
}
.m-app-logout-btn {
	height: 43px;
	text-align: center;
	span {
		font-size: $f12;
		color: $contentText;
		line-height: 18px;
	}
}
</style>
