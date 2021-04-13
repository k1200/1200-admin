import directives from './directives';
import permission from './directives/permission';
export default async (Vue, store) => {
	directives(Vue);
	Vue.directive('permission', permission(store));
};
