/* eslint-disable no-unused-vars */
import CreateApp from '@/plugins';
import SpaceTablePage, { SpaceTable } from 'space-table-page';
CreateApp({
	select: '#app',
	callbackk: Vue => {
		Vue.use(SpaceTablePage);
		Vue.use(SpaceTable);
		// 其他全局代码执行逻辑  do list
	}
});
