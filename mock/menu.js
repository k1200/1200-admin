export default [
	/** !
	 // 菜单类型(默认meta.type=0)
		// meta.type = [
		//   { value: 0, label: '站内页面' },
		//   { value: 1, label: '新窗口' },
		//   { value: 2, label: 'iframe嵌套' },
		//   { value: 3, label: '隐藏菜单页面' },
		//   { value: 4, label: '新窗口带参数' },
		//   { value: 5, label: '大屏页面' },
		// ];
		// {
		//   path: '/', // 必须
		//   name: 'Home', // 必须
		//   component: '', // 组件路径，必须
		//   meta: {
		//     title: '首页', // 菜单图标，必须
		//     icon: 'index', // 菜单突变，非必须
		//     type: 0, // 页面类型（默认0），非必须
		//		 activeMenu: '', // 高亮菜单path, 当路由设置了该属性，则会高亮相对应的侧边栏，非必须
		//   }
		// }
	 **/
	{
		path: '/application',
		name: 'Application',
		component: '/application',
		meta: {
			title: '应用与授权',
			icon: 'dot'
		},
		children: [
			{
				path: '/application/applyManage',
				name: 'ApplicationApplyManage',
				component: '/applyManage/applyManage/index',
				meta: {
					title: '应用管理'
				}
			},
			{
				path: '/application/accredit',
				name: 'ApplicationApplyAccredit',
				component: '/applyManage/accredit/index',
				meta: {
					title: '授权管理'
				}
			},
			{
				path: '/application/applyGroup',
				name: 'ApplicationApplyApplyGroup',
				component: '/applyManage/applyGroup/applyGroup',
				meta: {
					title: '应用组管理'
				}
			}
		]
	},

	{
		path: '/tenant',
		name: 'Tenant',
		component: '/tenant',
		meta: {
			title: '租户管理'
		},
		children: [
			{
				path: '/tenant/index',
				name: 'TenantIndex',
				component: '/applyManage/applyManage/index',
				meta: {
					title: '租户列表'
				}
			},
			{
				path: '/tenant/review',
				name: 'TenantReview',
				component: '/tenant/tenantReview',
				meta: {
					title: '租户审核'
				}
			}
		]
	},
	{
		path: '/orgManage',
		name: 'OrgManage',
		component: '/orgManage',
		meta: {
			title: '组织架构'
		},
		children: [
			{
				path: '/orgManage/orgType',
				name: 'OrgManageOrgType',
				component: '/orgManage/orgType',
				meta: {
					title: '组织类型'
				}
			},
			{
				path: '/orgManage/orgList',
				name: 'OrgManageOrgList',
				component: '/orgManage/orgList',
				meta: {
					title: '组织列表'
				}
			},
			{
				path: '/orgManage/jobList',
				name: 'OrgManageJobList',
				component: '/orgManage/jobList',
				meta: {
					title: '岗位列表'
				}
			}
		]
	},
	{
		path: '/account',
		name: 'Account',
		component: '/account',
		meta: {
			title: '账户管理',
			icon: 'dot'
		},
		children: [
			{
				path: '/account/manage',
				name: 'AccountManage',
				component: '/account',
				meta: {
					title: '账号管理'
				}
			},
			{
				path: '/account/add',
				name: 'AccounAdd',
				component: '/account/add',
				meta: {
					title: '新增账号',
					type: 3,
					activeMenu: '/account/manage'
				}
			},
			{
				path: '/account/role',
				name: 'Role',
				component: '/account/role',
				meta: {
					title: '角色管理'
				}
			}
		]
	}
];
