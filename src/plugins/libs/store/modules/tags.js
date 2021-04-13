import website from '../../config/website';
const fixedTags = website.fixedTags ? website.fixedTags : [];
export default (website, router) => {
	const { storage: STORAGE } = website;
	return {
		namespaced: true,
		state: () => {
			return {
				activeRouter: STORAGE.getItem('activeRouter') || fixedTags[0],
				tags: STORAGE.getItem('tags') && STORAGE.getItem('tags').length ? STORAGE.getItem('tags') : [...fixedTags],
				activeSource: STORAGE.getItem('activeSource') || []
			};
		},
		mutations: {
			SET_ACTIVE_TOUTER(state, value) {
				state.activeRouter = value || fixedTags[0];
				STORAGE.setItem({ name: 'activeRouter', content: state.activeRouter });
			},
			ADD_TAG(state, value) {
				state.tags.push(value);
				STORAGE.setItem({ name: 'tags', content: state.tags });
			},
			CLOSE_TAG(state, value) {
				state.tags.splice(value, 1);
				STORAGE.setItem({ name: 'tags', content: state.tags });
			},
			CLOSE_OTHER_TAG(state, value) {
				state.tags = [...fixedTags, value];
				STORAGE.setItem({ name: 'tags', content: state.tags });
			},
			CLOSE_ALL_TAG(state) {
				state.tags = [...fixedTags];
				STORAGE.setItem({ name: 'tags', content: state.tags });
			},
			SET_ACTIVE_SOURCE(state, value = []) {
				state.activeSource = value;
				STORAGE.setItem({ name: 'activeSource', content: state.activeSource });
			}
		},
		actions: {
			addTag({ commit, state }, value) {
				const { path, name = '--', meta, query } = value;
				// eslint-disable-next-line no-unused-vars
				let { hiddenTags = false, title = '--', source = [], key } = meta;
				const tempTag = { path, name, meta, query, key: key || path };
				let activeRouter = state.activeRouter || {};
				// 判断路由是否添加到 tags 中
				if (hiddenTags || path === activeRouter.path) {
					return false;
				}
				// tags 已存在不需要再次push
				if (
					state.tags.findIndex(item => item.meta.key === key) === -1 &&
					fixedTags.findIndex(item => item.path === value.path) === -1
				) {
					commit('ADD_TAG', tempTag);
				}
				commit('SET_ACTIVE_TOUTER', tempTag);
				commit('SET_ACTIVE_SOURCE', source);
			},
			closeTag({ commit, state }, value) {
				const index = state.tags.findIndex(item => item.path === value.path);
				commit('CLOSE_TAG', index);
				if (value.path === state.activeRouter.path) {
					// 关闭的是已激活的tag, 激活tag向前移
					let prevTag = state.tags[index - 1] || null;
					commit('SET_ACTIVE_TOUTER', prevTag);
					router.push(prevTag ? prevTag.path : '/').catch(error => error);
				}
			},
			closeOthersTag({ commit }, value) {
				commit('SET_ACTIVE_TOUTER', value);
				commit('CLOSE_OTHER_TAG', value);
				router.push(value ? value.path : '/').catch(error => error);
			},
			closeAllTag({ commit }) {
				commit('SET_ACTIVE_TOUTER', null);
				commit('SET_ACTIVE_SOURCE');
				commit('CLOSE_ALL_TAG');
				router.push('/').catch(error => error);
			}
		}
	};
};
