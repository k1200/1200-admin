export default [
	{
		path: '/dom',
		name: 'Dom',
		component: '/dom',
		meta: {
			title: '组件Dom',
			icon: 'dot'
		},
		children: [
			{
				path: '/dom/index',
				name: 'DomIndex',
				component: '/dom/index',
				key: 'DomIndex',
				meta: {
					title: '综合'
				}
			},
			{
				path: '/dom/table',
				name: 'DomTable',
				component: '/dom/table',
				key: 'DomTable',
				meta: {
					title: '表格'
				}
			},
			{
				path: '/dom/tablePage',
				name: 'DomTablePage',
				component: '/dom/table-page',
				key: 'DomTablePage',
				meta: {
					title: '表格页'
				}
			},
			{
				path: '/dom/dialog',
				name: 'DomDialog',
				component: '/dom/dialog',
				meta: {
					title: '弹窗'
				}
			}
		]
	}
];
