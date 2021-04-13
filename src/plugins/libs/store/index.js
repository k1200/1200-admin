import user from './modules/user';
import app from './modules/app';
import tags from './modules/tags';
import getters from './getters';
import WebMessage from '../utils/webMessaging';
import { appModules, appGetters } from '../../import/store';

let store = null;
const createStore = async (Vue, Vuex, website, router) => {
	Vue.use(Vuex);
	const store = new Vuex.Store({
		state: {
			destroyInstance: [], // 待销毁的实例
			webMessage: null
		},
		mutations: {
			SET_PRUNEINSTANCE: (state, keys) => {
				if (Object.prototype.toString.call(keys) === '[object Array]') {
					state.destroyInstance = keys;
				} else {
					console.error('keys must Array');
				}
			},
			SET_WEBMESAGE(state, value) {
				state.webMessage = value;
			}
		},
		actions: {
			webMessage({ commit }, data) {
				if (data.origin) {
					const webMessage = new WebMessage({
						origin: data.origin,
						onMessage: data.onMessage
					});
					commit('SET_WEBMESAGE', webMessage);
				} else {
					console.error('data.origin is must');
				}
			}
		},
		modules: {
			user: user(website, router),
			app,
			tags: tags(website, router),
			...appModules
		},
		getters: {
			...getters,
			...appGetters
		}
	});
	return store;
};
export default store;
export { createStore };
