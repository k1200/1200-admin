if (window.__POWERED_BY_QIANKUN__) {
	// eslint-disable-next-line no-undef
	__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
/**
 * 下面三个函数必须为异步函数
 */
export async function bootstrap() {
	console.log('vue app bootstraped');
}
export async function mount(props, render) {
	console.log('props from main framework', props);
	render(props);
}
export async function unmount(instance, unmount) {
	instance.$destroy();
	instance.$el.innerHTML = '';
	unmount && unmount();
}
export const registerMicroApps = async (instance, container, microApps, plugin) => {
	const { registerMicroApps } = await import('qiankun');
	const resData = {
		parentStore: instance.$store,
		parentRouter: instance.$router,
		token: window.AUTH.getToken(),
		userInfo: instance.$store.state.user.userInfo
	};
	const defaultInfo = {
		libraryTarget: 'umd',
		container,
		props: {
			data: {
				plugin,
				data: resData
			}
		}
	};

	registerMicroApps(
		microApps.map(item => {
			return { ...defaultInfo, ...item };
		})
	);
};
export const mountBefore = (store, parent, routerPaths) => {
	store.commit('user/SET_USERINFO', parent.data?.userInfo); // 缓存用户信息
	parent.data.parentStore.commit('app/SET_ROUTER_PATHS', routerPaths); // 注册子应用静态路由地址（主应用作权限控制）
};
