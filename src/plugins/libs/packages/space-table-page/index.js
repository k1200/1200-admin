import SpaceTable from './packages/space-table';
SpaceTable.install = function(Vue) {
	Vue.component(SpaceTable.name, SpaceTable);
};
import SpaceTablePage from './src/index';
SpaceTablePage.install = function(Vue) {
	Vue.component(SpaceTablePage.name, SpaceTablePage);
};
export default SpaceTablePage;
export { SpaceTable };
