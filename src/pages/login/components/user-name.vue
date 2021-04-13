<template>
	<el-form
		ref="form"
		v-error-focus="validateState"
		:model="form"
		label-position="top"
		status-icon
		:rules="rules"
		class="m-user-name"
	>
		<el-form-item label="用户名：" prop="username">
			<el-input
				v-model="form.username"
				placeholder="请输入用户名："
				@keyup.enter.native="fnSubmitForm"
				@input="form.username = form.username.replace(/\s/g, '')"
			/>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input
				v-model="form.password"
				placeholder="请输入密码"
				type="password"
				@keyup.enter.native="fnSubmitForm"
				@input="form.password = form.password.replace(/\s|[\u4e00-\u9fa5]/g, '')"
			/>
		</el-form-item>
		<el-form-item class="m-login-submit">
			<el-button class="m-login-btn" type="primary" :loading="loading" @click="fnSubmitForm">登录</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import website from '@/config/website';
import crypto from 'crypto';
const validateUserName = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入账号'));
	} else {
		callback();
	}
};
const validatePass = (rule, value, callback) => {
	if (value === '') {
		callback(new Error('请输入密码'));
	} else {
		callback();
	}
};
export default {
	name: 'MUserName',
	data() {
		return {
			form: {
				username: '',
				password: '',
				grant_type: 'password',
				scope: 'read',
				client_id: website.clientId,
				client_secret: website.clientSecret
			},
			rules: {
				username: [{ validator: validateUserName, trigger: 'blur' }],
				password: [{ validator: validatePass, trigger: 'blur' }]
			},
			validateState: true, // 表单校验状态
			loading: false
		};
	},
	methods: {
		fnSubmitForm() {
			console.log(website);
			let refs = this.$refs;
			this.loading = true;
			refs.form.validate(valid => {
				if (valid) {
					const md5 = crypto.createHash('md5');
					md5.update(this.form.password);
					const password = md5.digest('hex');
					this.$store
						.dispatch('user/login', { ...this.form, password })
						.then(() => {
							this.loading = false;
							this.$router.replace('/');
						})
						.catch(err => {
							console.log(err);
							this.loading = false;
						});
				} else {
					this.validateState = !this.validateState;
					this.loading = false;
					return false;
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.m-user-name {
	background-color: #fff;
	border-radius: 10px;
	padding: 32px;
	width: 380px;
}
.m-login-btn {
	width: 100%;
	height: 38px;
	line-height: 38px;
	font-size: 14px;
	padding: 0;
}
.el-input {
	::v-deep .el-input__inner {
		height: 38px;
		line-height: 38px;
	}
}
.m-login-submit {
	margin: 50px 0 0 !important;
}
::v-deep {
	.el-form-item__label {
		color: #333333a3;
		font-weight: 600;
		padding: 0;
	}
}
</style>
