<template>
	<div class="phone-preview-wrap">
		<img src="https://ysh-cdn.kaidicloud.com/test/bee/preview-phone.png" />
		<img class="wxtitle" src="https://ysh-cdn.kaidicloud.com/test/bee/wx-title.jpg" />
		<div class="wxtitle title-text">云商会</div>
		<div class="phone-preview-area">
			<div class="phone-article-title">{{ title }}</div>
			<div class="phone-article-source">文章出处</div>
			<div class="phone-article-time">{{ dayjs().format('YYYY-MM-DD HH:mm:ss') }}</div>
			<div class="phone-article-content" v-html="htmlObj"></div>
		</div>
	</div>
</template>
<script setup>
import dayjs from 'dayjs';
import { useImgUrl } from '@business/common/src/utils/useImgUrl';
// solink 图
const iphone = useImgUrl('preview-phone.png');
// bee 图
const wxTitle = useImgUrl('wx-title.jpg');
const props = defineProps({
	title: {
		type: String,
		required: true,
		default: '',
	},
	htmlObj: {
		type: String,
		required: true,
		default: '',
	},
});
</script>
<style lang="scss" scoped>
.phone-preview-wrap {
	margin: auto;
	position: relative;
	width: 80%;
	height: auto;
}
.phone-preview-wrap > img {
	width: 100%;
	margin: 0 10px;
}
.wxtitle {
	position: absolute;
	width: 86% !important;
	top: 9%;
	left: 7%;
}
.title-text {
	width: 93% !important;
	text-align: center;
	margin-top: 3%;
	font-size: 13px;
}
.phone-preview-area {
	position: absolute;
	width: 86%;
	top: 16%;
	left: 10%;
	height: 74%;
	overflow-y: scroll;
}
.phone-preview-area::-webkit-scrollbar {
	display: none;
}
.phone-article-title {
	width: 95%;
	position: relative;
	font-size: 14px;
	font-weight: 700;
	margin: 15px 10px 0 10px;
	word-wrap: break-word;
	word-break: break-all;
	overflow: hidden;
}
.phone-article-source {
	position: relative;
	font-size: 13px;
	font-weight: 500;
	margin-top: 0px;
	padding: 20px 10px 0 10px;
}
.phone-article-time {
	position: relative;
	font-size: 10px;
	font-weight: 500;
	margin-top: 5px;
	padding: 5px 10px 0 10px;
}
.phone-article-content {
	width: 100%;
	position: relative;
	font-size: 14px;
	font-weight: 500;
	margin: 20px 0 0 5px;
	padding: 0 5px;
	word-wrap: break-word;
	word-break: break-all;
	overflow: hidden;
	border-top: 2px solid #d9dde2;
}
.phone-article-content > p > img {
	/* width: 100% !important; */
	max-width: 100% !important;
	height: auto !important;
	max-height: 100% !important;
}
.phone-article-content > p > video {
	max-width: 100% !important;
	height: auto !important;
	max-height: 100% !important;
}
</style>
