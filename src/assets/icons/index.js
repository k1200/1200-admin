

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)

const menus = require.context('./menus', false, /\.svg$/)
const iconList = []
for (const val of requireAll(menus)) {
  iconList.push(val.default.id.replace('icon-', ''))
}
export default iconList
