<template>
	<div class="g-app-tags">
		<div class="m-app-tags">
			<el-scrollbar ref="scrollTags" class="m-scroll-tags" style="width: 100%" @wheel.native.prevent="handleScroll">
				<template v-for="tag in cpTagList">
					<tag-item :key="tag.key" ref="tags" :value="tag" @open-contextmenu="openContextmenu($event, tag)" />
				</template>
			</el-scrollbar>
		</div>
		<context-menu
			:contextmenu-visble="contextmenuVisble"
			:contextmenu-point="contextmenuPoint"
			:can-close-current="cpCanCloseCurrenttag"
			@refresh-current="refreshCurrentPage"
			@handle-tag="clickTag"
		/>
	</div>
</template>

<script>
import ContextMenu from './components/ContextMenu';
import tagItem from './components/TagItem';
import { mapGetters } from 'vuex';
export default {
	name: 'GaAppTags',
	components: {
		ContextMenu,
		tagItem
	},
	data() {
		return {
			tag_dom: null,
			contextmenuVisble: false,
			contextmenuPoint: [0, 0],
			closeContextmenu: this.triggerContextmenuVisble,
			contextmenuTag: null,
			tagAndTagSpacing: 4
		};
	},
	computed: {
		...mapGetters(['activeRouter', 'tags']),
		cpTagList() {
			return [...this.tags];
		},
		cpCanCloseCurrenttag() {
			return !(this.contextmenuTag && this.contextmenuTag.meta.fixed);
		},
		cpScrollWrapper() {
			return this.$refs.scrollTags.$refs.wrap;
		}
	},
	watch: {
		cpCanCloseCurrenttag() {
			return !(this.contextmenuTag && this.contextmenuTag.meta.fixed);
		},
		activeRouter(val) {
			this.$nextTick(() => {
				this.moveToTarget(val);
			});
		}
	},
	mounted() {
		this.tag_dom = this.$refs.tag_dom;
		document.body.addEventListener('click', this.closeContextmenu);
		this.moveToTarget(this.activeRouter);
	},
	beforeDestroy() {
		document.body.removeEventListener('click', this.closeContextmenu);
	},
	methods: {
		openContextmenu(event, tag) {
			this.contextmenuPoint = [event.clientX, event.clientY];
			this.contextmenuVisble = true;
			this.contextmenuTag = tag;
		},
		handleScroll(e) {
			this.triggerContextmenuVisble();
			const eventDelta = e.wheelDelta || -e.deltaY * 40;
			const scrollWrapper = this.cpScrollWrapper;
			scrollWrapper.scrollLeft = scrollWrapper.scrollLeft + eventDelta / 4;
		},
		clickTag(command, tag = this.contextmenuTag) {
			this.$store.dispatch(command, tag);
		},
		refreshCurrentPage() {
			this.$router.replace({
				path: this.contextmenuTag.path,
				query: this.contextmenuTag.query
			});
		},
		triggerContextmenuVisble() {
			this.contextmenuVisble = false;
		},
		moveToTarget(currentTag) {
			const container = this.$refs.scrollTags.$el;
			const containerWidth = container.offsetWidth;
			const scrollWrapper = this.cpScrollWrapper;
			const tagList = this.$refs.tags;
			let firstTag = null;
			let lastTag = null;
			if (tagList.length > 0) {
				firstTag = tagList[0];
				lastTag = tagList[tagList.length - 1];
			}
			if (firstTag.value.key === currentTag.key) {
				scrollWrapper.scrollLeft = 0;
			} else if (lastTag.value.key === currentTag.key) {
				scrollWrapper.scrollLeft = scrollWrapper.scrollWidth - containerWidth;
			} else {
				const currentIndex = tagList.findIndex(item => item.value.key === currentTag.key);
				const prevTag = tagList[currentIndex - 1];
				const nextTag = tagList[currentIndex + 1];
				const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + this.tagAndTagSpacing;
				const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - this.tagAndTagSpacing;
				if (afterNextTagOffsetLeft > scrollWrapper.scrollLeft + containerWidth) {
					scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth;
				} else if (beforePrevTagOffsetLeft < scrollWrapper.scrollLeft) {
					scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
				}
			}
		}
	}
};
</script>

<style scoped lang="scss">
.g-app-tags {
	height: 30px;
	min-height: 30px;
	padding: 0 25px;
	background-color: #fff;
	display: flex;
	align-items: center;
	position: relative;
	box-shadow: 0 1px 4px 0 rgba(0, 21, 41, 0.12);
}
.m-app-tags {
	width: 100%;
	max-width: 100%;
	white-space: nowrap;
	&::-webkit-scrollbar {
		display: none;
	}
}
.m-scroll-tags {
	overflow: unset;
	::v-deep .el-scrollbar__bar.is-horizontal {
		bottom: -10px;
	}
}
</style>
