## 国际化配置
```js
// /src/i18n/space/cn.js
	export default {
		name: '姓名',
		sex: '性别',
		userInfo: {
			olution: '解决方案',
			device: '设备监控'
		}
	}
```
```js
// /src/i18n/space/en.js
	export default {
		name: 'name',
		sex: 'sex',
		userInfo: {
			olution: 'jie jue fnag an',
			device: 'she bei jian kong'
		}
	}
```
### 使用
```js
// /src/views/space.vue
	<template>
		<span>name:{{ $t('space.name') }}</span>
		<span>olution:{{ $t('space.userInfo.olution') }}</span>
	</template>
	<script>
		export default {
			name: 'SpaceTable',
			created() {
				alert(this.$t('space.userInfo.olution'))
			}
		};
	</script>
	<style lang="scss" scoped></style>
```
