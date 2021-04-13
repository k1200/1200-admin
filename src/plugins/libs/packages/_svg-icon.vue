<template>
	<svg class="svg-icon" :class="svgClass" :style="position" aria-hidden="true" v-on="$listeners">
		<use :xlink:href="iconName"></use>
	</svg>
</template>
<script>
export default {
	name: 'SvgIcon',
	props: {
		name: {
			type: String,
			required: true
		},
		svgClass: {
			type: String,
			default: ''
		},
		width: {
			type: [Number, String],
			default: ''
		},
		height: {
			type: [Number, String],
			default: ''
		},
		// 字体大小
		size: {
			type: [Number, String],
			default: ''
		}
	},
	data() {
		return {};
	},
	computed: {
		iconName() {
			return `#icon-${this.name}`;
		},
		position() {
			let width = typeof this.width === 'string' ? this.width : this.width + 'px',
				height = typeof this.height === 'string' ? this.height : this.height + 'px',
				fontSize = typeof this.size === 'string' ? this.size : this.size + 'px';
			return { width, height, fontSize };
		}
	}
};
</script>
<style lang="scss" scoped>
.svg-icon {
	width: 1em;
	height: 1em;
	vertical-align: -0.15em;
	fill: currentColor;
	overflow: hidden;
	display: inline-block;
}
</style>
