<template>
	<router-link
		class="m-tag-item"
		:class="{ 'is-active': isActive }"
		:to="{ path: value.path, query: value.query }"
		@contextmenu.native.prevent="openContextmenu"
	>
		{{ value.meta.title || '- -' }}
		<span v-if="!value.meta.fixed" class="el-icon-close" @click.prevent.stop="closeTag" />
	</router-link>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
	name: 'TagItem',
	components: {},
	props: {
		value: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {};
	},
	computed: {
		...mapGetters(['activeRouter']),
		isActive() {
			return this.activeRouter.meta.key === this.value.meta.key;
		}
	},
	watch: {},
	created() {},
	methods: {
		closeTag() {
			this.$store.dispatch('tags/closeTag', this.value);
		},
		openContextmenu(e) {
			this.$emit('open-contextmenu', e);
		}
	}
};
</script>
<style lang="scss" scoped>
.m-tag-item {
	display: inline-block;
	height: 22px;
	line-height: 21px;
	font-size: $f12;
	border: 1px solid $border;
	color: $contentText;
	border-radius: 2px;
	padding: 0 8px;
	&:not(:first-child) {
		margin-left: 5px;
	}
}
.m-tag-item.is-active {
	background: $activeFont;
	color: #fff;
	border-color: $activeFont;
	&::before {
		content: '';
		background: #fff;
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		position: relative;
		margin-right: 2px;
	}
}
.el-icon-close {
	width: 13px;
	height: 13px;
	font-size: $f12;
	line-height: 13px;
	text-align: center;
	border-radius: 50%;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	transform-origin: 100% 50%;
	&:before {
		display: block;
		font-size: $f12;
		transform: scale(0.8);
		transform-origin: center;
	}
	&:hover {
		background-color: #fff;
		color: $activeFont;
	}
}
</style>
