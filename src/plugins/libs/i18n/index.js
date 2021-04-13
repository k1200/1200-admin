import website from '@libs/config/website';
import langs from '../../import/i18n';
export default (Vue, VueI18n, locale, zhLocale, enLocale) => {
	Vue.use(VueI18n);
	// 从localStorage中拿到用户的语言选择，如果没有，那默认中文。
	const messages = { en: { ...langs.en, ...enLocale }, cn: { ...langs.cn, ...zhLocale } };
	const i18n = new VueI18n({
		locale: localStorage.lang || website.lang,
		messages
	});
	locale.i18n((key, value) => i18n.t(key, value));
	return i18n;
};
