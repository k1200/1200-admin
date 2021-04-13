import { router } from '@/plugins';
import { formatterRouters, formatterButtons } from '@libs/utils/addRouter';
import website from '@libs/config/website';
import { apiLogin, apiTriggerApp, apiLogout } from '@libs/api';
const { storage: STORAGE, auth: AUTH, formatMenus, refreshToken, MockMenu } = website;
export default {
	namespaced: true,
	state() {
		return {
			token: AUTH.getToken(),
			refreshToken: AUTH.getToken(),
			refreshTokenTimeout: STORAGE.getItem('refreshTokenTimeout') || 0,
			userInfo: null
		};
	},
	mutations: {
		SET_TOKEN(state, value) {
			state.token = value;
		},
		SET_REFRESH_TOKEN(state, value) {
			state.refreshToken = value;
		},
		SET_REFRESH_TOKEN_TIMEOUT(state, value) {
			state.refreshTokenTimeout = value;
			STORAGE.setItem({ name: 'refreshTokenTimeout', content: value });
		},
		SET_USERINFO(state, value) {
			state.userInfo = value;
			// STORAGE.setItem({ name: 'userInfo', content: value });
		},
		SET_SPCODE(state, value) {
			state.spCode = value;
		},
		SET_SPNAME(state, value) {
			state.spName = value;
		},
		RESET_USER(state) {
			state.token = '';
			state.refreshToken = '';
			state.refreshTokenTimeout = 0;
			state.userInfo = null;
			STORAGE.clear();
			AUTH.clear();
		}
	},
	actions: {
		login({ commit }, data) {
			return new Promise((resolve, reject) => {
				apiLogin(data)
					.then(res => {
						// eslint-disable-next-line no-unused-vars
						const { access_token, refresh_token, expires_in } = res;
						// dispatch('refreshToken', res.expires_in);
						commit('SET_TOKEN', access_token);
						// commit('SET_REFRESH_TOKEN', refresh_token);
						AUTH.setToken(access_token, expires_in * 1000);
						// AUTH.setRefreshToken(refresh_token, expires_in * 1000);
						resolve();
					})
					.catch(error => reject(error));
			});
		},
		refreshToken({ commit, dispatch, state }, timeout) {
			if (!timeout) {
				let expires = new Date(AUTH.getTokenExpires());
				if (!expires) return;
				timeout = expires - new Date().getTime();
			}
			clearTimeout(state.refreshTokenTimeout);
			commit(
				'SET_REFRESH_TOKEN_TIMEOUT',
				// 实时刷新TOKEN
				setTimeout(() => {
					refreshToken(state.refreshToken)
						.then(res => {
							const { access_token, refresh_token, expires_in } = res;
							commit('SET_TOKEN', access_token);
							commit('SET_REFRESH_TOKEN', refresh_token);
							AUTH.setToken(access_token, expires_in);
							AUTH.setRefreshToken(refresh_token, expires_in);
							dispatch('refreshToken', res.expires_in);
						})
						.catch(error => console.error(error));
				}, timeout - 60 * 1000)
			);
		},
		// 主动退出
		logout({ commit, dispatch }) {
			return new Promise(resolve => {
				apiLogout().finally(() => {
					commit('RESET_USER');
					dispatch('app/resetApp', null, { root: true });
					dispatch('tags/closeAllTag', null, { root: true });
					router.push('/login');
					resolve();
				});
			});
		},
		// 被动退出
		logoutByPassive({ commit }) {
			return new Promise(resolve => {
				apiLogout().finally(() => {
					commit('SET_TOKEN', '');
					commit('SET_REFRESH_TOKEN', '');
					commit('SET_REFRESH_TOKEN_TIMEOUT', '');
					AUTH.clear();
					router.push('/login');
					resolve();
				});
			});
		},
		getInfo({ commit, dispatch, rootGetters }, appKey) {
			return new Promise(resolve => {
				let appId = appKey || rootGetters.activeAppId || '';
				apiTriggerApp({ appId })
					.then(res => {
						let { privilegeList, buttonList, appId: activeAppId } = res.data;
						if (website.env.isMock) {
							privilegeList = (MockMenu && MockMenu.length && MockMenu) || [];
						}
						// const initAppKey = data.menus.length ? data.menus[0].appCode : '';
						const { menus, routerPaths } = formatterRouters(privilegeList, formatMenus);
						const buttons = formatterButtons(buttonList);
						// commit('app/SET_ACTIVE_APP_ID', initAppKey, { root: true });
						commit('SET_USERINFO', res.data);
						commit('app/SET_MENUS', menus, { root: true });
						commit('app/SET_BUTTONS', buttons, { root: true });
						commit('app/SET_ROUTER_PATHS', routerPaths, { root: true });
						commit('app/SET_ACTIVE_APP_ID', activeAppId, { root: true });
						resolve();
					})
					.catch(error => {
						console.log(error);
						dispatch('logout');
					});
			});
		}
	}
};
