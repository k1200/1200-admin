<template>
	<space-panel title="新增账号" :back-btn="true" :footer="true">
		<el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px" label-position="left">
			<el-form-item label="用户名称" prop="">
				<el-input v-model="form.nickName" maxlength="20"></el-input>
			</el-form-item>

			<el-form-item label="所属部门" prop="positions">
				<el-input v-model="form.orgCode" readonly></el-input>
			</el-form-item>

			<el-form-item label="账号" prop="account">
				<el-input v-model="form.account" maxlength="20"></el-input>
			</el-form-item>

			<el-form-item label="密码" prop="password">
				<el-input id="password" v-model="form.password" type="password" maxlength="20" :readonly="password"></el-input>
			</el-form-item>

			<el-form-item label="手机号" prop="phone">
				<el-input v-model="form.phone" maxlength="11"></el-input>
			</el-form-item>

			<el-form-item label="邮箱" prop="email">
				<el-input v-model="form.email" maxlength="20"></el-input>
			</el-form-item>

			<el-form-item label="角色" prop="roles">
				<el-input :value="cpGetRoleName" readonly></el-input>
			</el-form-item>

			<el-form-item label="岗位" prop="orgCode">
				<el-input :value="cpGetPostionName" readonly></el-input>
			</el-form-item>

			<el-row>
				<el-col :span="8">
					<el-form-item label="状态" prop="status">
						<el-switch v-model="form.status" active-text="启动" inactive-text="禁用"></el-switch>
					</el-form-item>
				</el-col>

				<el-col :span="8">
					<el-form-item label="园区管理员">
						<el-switch v-model="form.parkAdmin" active-text="是" inactive-text="否"></el-switch>
					</el-form-item>
				</el-col>
			</el-row>

			<el-form-item label="工号" prop="number">
				<el-input v-model="form.number" maxlength="20"></el-input>
			</el-form-item>

			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" type="textarea" maxlength="100" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" type="textarea" maxlength="100" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" type="textarea" maxlength="100" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" type="textarea" maxlength="100" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" type="textarea" maxlength="100" show-word-limit></el-input>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input v-model="form.remark" type="textarea" maxlength="100" show-word-limit></el-input>
			</el-form-item>
		</el-form>
	</space-panel>
</template>

<script>
export default {
	name: 'AccountAdd',
	data() {
		return {
			form: {
				nickName: '',
				account: '',
				phone: '',
				number: '',
				email: '',
				password: '',
				avatarUrl: '',
				status: true,
				roles: [], // 角色
				orgCode: '', // 部门
				positions: [],
				remark: '',
				orgUserType: 0,
				parkAdmin: false
			},
			rules: {
				nickName: [
					{ required: true, message: '用户名称不能为空', trigger: 'blur' },
					{
						max: 50,
						message: '用户名称不能超过50个字符',
						trigger: 'blur'
					}
				],
				remark: [
					{
						max: 100,
						message: '备注最长不能超过100个字符',
						trigger: 'blur'
					}
				],
				account: [
					{ required: true, message: '账号不能为空', trigger: 'blur' },
					{
						max: 20,
						message: '账号不能超过20个字符',
						trigger: ['blur', 'change']
					}
				],
				email: [
					{
						validator: (rule, value, callback) => {
							const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
							if (!value) {
								callback();
							}
							setTimeout(() => {
								if (mailReg.test(value)) {
									callback();
								} else {
									callback(new Error('请输入正确的邮箱格式'));
								}
							}, 100);
						},
						trigger: 'blur'
					}
				],
				phone: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{
						pattern: /1[3456789]\d{8}$/,
						message: '请输入正确的手机号码'
					}
				],
				password: [
					{
						required: true,
						validator: (rule, value, callback) => {
							const passwordreg = /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{8,20}$/;
							const isValid = passwordreg.test(value);
							if (!value) {
								callback(new Error('请输入密码'));
							} else if (isValid != true && value !== '*') {
								callback(new Error('密码必须包含大写字母，小写字母，数字，特殊字符其中的2种及以上，且长度为8到20位！'));
							} else {
								callback();
							}
						},
						trigger: 'change'
					}
				],
				status: [{ required: true, message: '', trigger: 'blur' }]
			}
		};
	},
	computed: {
		// 通过form.positions计算出用逗号隔开的positionName
		cpGetPostionName() {
			return this.form.positions
				.reduce((re, item) => {
					const positionName = this.postlist.find(child => child.positionCode === item)?.positionName;
					if (positionName) re.push(positionName);
					return re;
				}, [])
				.join(', ');
		},

		// 通过form.roles计算出用逗号隔开的roleName

		cpGetRoleName() {
			return this.form.roles
				.reduce((re, item) => {
					const roleName = this.rolelist.find(child => child.roleCode === item)?.roleName;
					if (roleName) re.push(roleName);
					return re;
				}, [])
				.join(', ');
		}
	}
};
</script>

<style></style>
