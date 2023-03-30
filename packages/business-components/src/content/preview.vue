<template>
	<div class="preview-container flex-x-center-center" v-if="props.previewVisible">
		<div class="left flex-y-center">
			<span class="left-hd">扫码查看手机效果</span>
			<div class="flex-y">
				<span>与实际手机显示效果</span>
				<span>有微小差异, 请扫码查看</span>
			</div>
			<img class="er-code" :src="preObj.url" />
		</div>
		<div class="right">
			<div class="right-out"></div>
			<CloseCircleOutlined class="my-close" />
			<img :src="closeIcon" class="my-close" @click="hide" />
			<img class="right-bg" :src="phoneImg" />
			<div class="right-content">
				<div class="content">
					<div class="title">
						{{ props.previewObj.title }}
					</div>
					<div class="date flex-x-between-center">
						<span>文章出处</span>
						<span>{{ preObj.systemTime }}</span>
					</div>
					<div style="margin-top: 15px">
						<VideoUpLoad ref="videoRef" v-if="preObj.videoValue.length !== 0" v-model:value="preObj.videoValue" height="330px" />
					</div>
					<div class="phone-article-content" id="my-phone-article-content" v-html="props.previewObj.contentHtml"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { previewArticle } from '@business/common/src/content/api/article';
import VideoUpLoad from '@business/components/src/upload/video-uploader';
import dayjs from 'dayjs';
import { reactive, watch } from 'vue';
import { useImgUrl } from '@business/common/src/utils/useImgUrl';

const closeIcon = `${useImgUrl('commons/close.png')}`;
const phoneImg = `${useImgUrl('commons/phone.png')}`;
const props = defineProps({
	previewVisible: {
		type: Boolean,
		default: false,
	},
	previewObj: {
		type: Object,
		default: () => {},
	},
});
const emit = defineEmits(['update:previewVisible', 'freshData']);
const preObj = reactive({
	videoValue: [],
	url: null, // 小程序码
	systemTime: dayjs().format('YYYY年M月D日'),
});
const hide = () => {
	emit('update:previewVisible', false);
};
const previewArticleFunc = async () => {
	const params = reactive({
		articlePreviewId: props.previewObj.contentColumnId,
		content: props.previewObj.contentHtml,
		title: props.previewObj.title,
		videoCoverURL: props.previewObj.videoCoverURL,
		vid: props.previewObj.vid,
	});
	const { data } = await previewArticle(params);
	preObj.url = data.url;
};

watch(
	() => props.previewObj,
	(Val) => {
		if (Val.vid) {
			preObj.videoValue = [{ vid: Val.vid, videoCoverURL: Val.videoCoverURL }];
		}
	},
	{ immediate: true, deep: true }
);
watch(
	() => props.previewVisible,
	(newVal) => {
		if (newVal) {
			previewArticleFunc();
		}
	}
);
</script>
<style lang="scss">
.preview-container {
	background-color: rgba(0, 0, 0, 0.447058823529412);
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 100;
	.left {
		font-size: 16px;
		margin-right: 50px;

		color: #555555;
		.left-hd {
			color: #1890ff;
			font-size: 20px;
			margin-bottom: 15px;
		}
		width: 300px;
		height: 365px;
		background-color: #fff;
		padding: 30px 30px;
		.er-code {
			width: 200px;
			height: 200px;
			margin-top: 10px;
		}
	}

	.right-bg,
	.right-content,
	.right {
		width: 400px;
		height: 740px;
		position: absolute;
	}
	.right {
		position: relative;

		.my-close {
			width: 40px;
			height: 40px;
			position: absolute;
			right: -26px;
			z-index: 102;
		}
	}
	.right-out {
		position: absolute;
		top: 8%;
		right: 8%;
		width: 90px;
		height: 42px;
		background: #fff;
		z-index: 1000;
	}
	.right-bg {
		z-index: 101;
	}
	.right-content {
		margin-top: 110px;
		//   padding: 0px 26px;
		height: 600px;
		overflow-y: scroll;
		overflow-x: visible;
		z-index: 102;
		.content {
			padding: 0px 30px 0px 40px;
		}
		.title {
			font-size: 20px;
			font-weight: bold;
			line-height: 60rpx;
		}
		.date {
			margin-top: 14px;
		}
		.content-html {
			margin-top: 10px;
			overflow: hidden;
		}
	}
	.right-content::-webkit-scrollbar {
		display: none;
	}
}
.phone-article-content {
	width: 100%;
	position: relative;
	font-size: 14px;
	font-weight: 500;
	word-wrap: break-word;
	word-break: break-all;
	overflow: hidden;
	border: none !important;
}

#my-phone-article-content {
	width: 100%;
	position: relative;
	font-size: 14px;
	font-weight: 500;
	word-wrap: break-word;
	word-break: break-all;
	overflow: hidden;
	border: none !important;
}
#my-phone-article-content img {
	max-width: 100%;
	height: auto !important;
	max-height: 100% !important;
}
// .phone-article-content>p>img {
//   width: 100% !important;
//   height: auto !important;
//   max-height: 100% !important;
// }
.phone-article-content img {
	max-width: 100%;
	height: auto !important;
	max-height: 100% !important;
}
</style>
