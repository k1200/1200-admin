<script>
import website from '@libs/config/website';
export default {
	name: 'KeepCache',
	functional: true,
	data() {
		return {
			keys: [],
			cache: null,
			max: website.keepAlive
		};
	},
	computed: {
		cpKeepAlive() {
			return this.$route.meta;
		},
		cpDestroyInstance() {
			return this.$store.state.destroyInstance;
		}
	},
	watch: {
		cpDestroyInstance(keys) {
			keys.length > 0 && this.fnBeforeDestroyInstance(keys);
		},
		// eslint-disable-next-line prettier/prettier
    $route(to) {
			if (to.meta.keepAlive && !to.meta.key) {
				this.$nextTick(() => {
					this.fnGetCache();
					to.meta.key = this.keys.slice(-1)[0];
				});
			}
		}
	},
	mounted() {
		if (this.$route.meta.keepAlive) {
			this.$nextTick(() => {
				this.fnGetCache();
				this.$route.meta.key = this.keys[0];
			});
		}
	},
	methods: {
		// 销毁实例
		fnDestroyInstance(key) {
			let destroyVNode = this.cache[key], // 需要销毁的 vNode 节点
				destroyComponentInstance = destroyVNode.componentInstance; // 需要销毁的组件实例
			destroyComponentInstance.$destroy(); // 销毁组件
			this.keys.splice(
				this.keys.findIndex(item => item === key),
				1
			);
			delete this.cache[key];
		},
		// 获取 keepAlive 组件实例
		fnGetCache() {
			let vNode = this.$slots.default[0], // keep-alive 组件节点
				componentInstance = vNode.componentInstance; // keep-alive 组件实例
			this.cache = componentInstance.cache; // 缓存的组件节点集合
			this.keys = componentInstance.keys; // 缓存的组件标识集合
		},
		fnBeforeDestroyInstance(delKeys) {
			let len = delKeys.length;
			if (len > 0) {
				this.$nextTick(() => {
					this.fnGetCache();
					for (let key of delKeys) {
						// 彻底销毁缓存的组件实例
						this.keys.includes(key) && this.fnDestroyInstance(key);
					}
				});
			}
		}
	},
	render(h, context) {
		const vnodes = [];

		if (context.cpKeepAlive) {
			vnodes.push(
				<keep-alive max={context.max}>
					<router-view key="mainApp" class="m-content-wrap" />
				</keep-alive>
			);
		} else {
			vnodes.push(<router-view key="mainApp" class="m-content-wrap" />);
		}
		return vnodes;
	}
};
</script>
