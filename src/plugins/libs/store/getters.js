const getters = {
	token: state => state.user.token,
	userInfo: state => state.user.userInfo,
	menus: state => state.app.menus,
	buttons: state => state.app.buttons,
	activeApp: state => {
		return state.app.appList.find(app => app.appId === state.app.activeAppId) || {};
	},
	activeAppId: state => state.app.activeAppId,
	routerPaths: state => state.app.routerPaths,
	activeRouter: state => state.tags.activeRouter,
	tags: state => state.tags.tags,
	activeSource: state => state.tags.activeSource
};
export default getters;
