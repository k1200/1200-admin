/* eslint-disable no-undef */
process.env.VUE_APP_VERSION = `v${require('./package.json').version}`; // 获取版本号
const path = require('path');
function resolve(dir) {
	return path.join(__dirname, dir);
}
module.exports = {
	publicPath: './',
	outputDir: 'dist',
	assetsDir: 'static',
	lintOnSave: process.env.NODE_ENV === 'development',
	productionSourceMap: false,
	chainWebpack(config) {
		// set svg-sprite-loader
		// set svg-sprite-loader
		config.module
			.rule('svg')
			.exclude.add(resolve('src/plugins/libs/assets/icons'))
			.end();
		config.module
			.rule('icons')
			.test(/\.svg$/)
			.include.add(resolve('src/plugins/libs/assets/icons'))
			.end()
			.use('svg-sprite-loader')
			.loader('svg-sprite-loader')
			.options({
				symbolId: 'icon-[name]',
			})
			.end()
	},
	configureWebpack: {
		resolve: {
			alias: {
				'@libs': resolve('src/plugins/libs'),
			},
		},
	},
	css: {
		loaderOptions: {
			scss: {
				prependData: '@import "~@/style/variables.scss"; @import "~@/style/mixin.scss";',
			},
			sass: {
				implementation: require('sass'), // This line must in sass option
			},
		},
	},
	devServer: {
		port: 8080,
		proxy: {
			// 统一门户接口
			'^/portal': {
				target: 'http://183.62.141.206:17205/portal/v1',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'/portal': '',
				},
			},
			// 业务接口
			'^/api': {
				target: 'http://183.62.141.206:17205/portal/v1',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'/api': '',
				},
			},
			'^/dataplatform': {
				target: 'http://172.16.163.69',
				ws: true,
				changeOrigin: true,
				pathRewrite: {
					'/dataplatform': '',
				},
			},
			'/dictApi': {
        target: 'http://53.space.com:8072/portal/v1',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/dictApi': ''
        }
      },
		},
		// before: require('./mock/mock-server.js')
	},
};
