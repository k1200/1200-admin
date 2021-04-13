## 如果需要全局组件注册 组价名称以下划线开头，多单词以短线分开，组件名称以大驼峰命名。_space-table.vue
```js
// /src/components/_space-table.vue
	<template></template>
	<script>
		export default {
			name: 'SpaceTable' // 注册组件会以name作为组件的名称
		};
	</script>
	<style lang="scss" scoped></style>
```
### 使用
```js
// /src/components/_space-table.vue
	<template>
		<space-table/>
	</template>
	<script>
		export default {
			name: 'ExmapleSpaceTable'
		};
	</script>
	<style lang="scss" scoped></style>
```
