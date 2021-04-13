import website from '@libs/config/website';
import { routerPaths } from '@libs/router';
import { formatterRouters, formatterButtons } from '@libs/utils/addRouter';
const { storage: STORAGE, fixedTags, formatMenus } = website;
import { apiTriggerApp } from '@libs/api';
export default {
	namespaced: true,
	state: {
		menus: [],
		buttons: [],
		appList: [],
		activeAppId: STORAGE.getItem('activeAppId') || '',
		routerPaths: routerPaths
	},
	mutations: {
		SET_MENUS(state, value) {
			state.menus = [...fixedTags, ...value];
		},
		SET_BUTTONS(state, value) {
			state.buttons = value;
		},
		SET_APPLIST: (state, value) => {
			state.appList = value;
		},
		SET_ACTIVE_APP_ID(state, value) {
			state.activeAppId = value || '';
			STORAGE.setItem({ name: 'activeAppId', content: value });
		},
		SET_ROUTER_PATHS(state, value = []) {
			state.routerPaths = [...new Set([...state.routerPaths, ...value])];
		}
	},
	actions: {
		triggerApp({ commit, dispatch }, item) {
			const { appId } = item;
			apiTriggerApp({ appId }).then(res => {
				let { privilegeList, buttonList, appId: activeAppId } = res.data;
				dispatch('tags/closeAllTag', null, { root: true });
				const { menus, routerPaths } = formatterRouters(privilegeList, formatMenus);
				const buttons = formatterButtons(buttonList);
				commit('SET_MENUS', menus);
				commit('SET_BUTTONS', buttons);
				commit('SET_ROUTER_PATHS', routerPaths);
				commit('SET_ACTIVE_APP_ID', activeAppId);
			});
		},
		resetApp({ commit }) {
			commit('SET_ACTIVE_APP_ID', '');
			commit('SET_MENUS', []);
			commit('SET_BUTTONS', []);
			commit('SET_ROUTER_PATHS', []);
			commit('SET_APPLIST', []);
		}
	}
};
