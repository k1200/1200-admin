let dependencies = async () => {
	let [Vue, Vuex, VueRouter, axios, VueI18n, ElementUI, locale, zhLocale, enLocale] = await Promise.all([
		import('vue'),
		import('vuex'),
		import('vue-router'),
		import('axios'),
		import('vue-i18n'),
		import('element-ui'),
		import('element-ui/lib/locale'),
		import('element-ui/lib/locale/lang/zh-CN'),
		import('element-ui/lib/locale/lang/en')
	]);
	return {
		Vue,
		Vuex,
		VueRouter,
		axios,
		VueI18n,
		ElementUI: ElementUI.default,
		Message: ElementUI.Message,
		locale,
		zhLocale,
		enLocale
	};
};

export default dependencies;
