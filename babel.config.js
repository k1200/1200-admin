// 生产环境 去掉调试
const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
	plugins: [
		...prodPlugins
	]
};
