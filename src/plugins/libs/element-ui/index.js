import './theme/index.css';
import './style/index.scss';
export default (Vue, ElementUI, locale) => {
	// 全局设置表格不换行
	ElementUI.TableColumn.props.showOverflowTooltip = {
		type: Boolean,
		default: true
	};
	// 分页
	// ElementUI.Pagination.props.layout.default = 'sizes, total, prev, pager, next, jumper';
	// ElementUI.Pagination.props.background = {
	// 	default: true
	// };
	// ElementUI.Pagination.props.hideOnSinglePage = {
	// 	default: true
	// };
	// ElementUI.Pagination.props.pageSizes.default = () => [10, 20, 50, 100];
	// 全局设置表格中的tooltip的风格为light
	ElementUI.Table.props.tooltipEffect = { type: String, default: 'light' };
	// ElementUI.Table.props.border = {
	// 	default: true
	// };
	Vue.use(ElementUI, { locale });
};
