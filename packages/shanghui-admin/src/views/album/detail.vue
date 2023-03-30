<template>
  <AlbumDetail ref="AlbumDetailRef">
    <template v-slot="{ selectedImgIds, albumDetail, handleFreezeDisabled, handleOverFreezeDisabled }">
      <a-button class="mr20" size="large" @click="toggleAlbumStatus(albumDetail, selectedImgIds)">
        {{ albumDetail.status === +ALBUM_TYPES.NORMAL ? '冻结相册' : '解冻相册' }}</a-button
      >
      <a-button
        size="large"
        class="mr20"
        :disabled="handleFreezeDisabled"
        @click="toggleImgFrozeeStatus(selectedImgIds, PICTURE_TYPE_FREEZE)"
        >冻结照片</a-button
      >
      <a-button
        size="large"
        class="mr20"
        :disabled="handleOverFreezeDisabled"
        @click="toggleImgFrozeeStatus(selectedImgIds, PICTURE_TYPE_OPEN)"
        >解冻照片</a-button
      >
      <!-- <a-button
        class="mr20"
        :disabled="handleDisabled"
        size="large"
        @click="toggleImgStatus(selectedImgIds, ALBUM_TYPE_FREEZE)"
        >冻结照片</a-button
      >
      <a-button
        class="mr20"
        :disabled="handleDisabled"
        size="large"
        @click="toggleImgStatus(selectedImgIds, ALBUM_TYPE_OPEN)"
        >解冻照片</a-button
      > -->
    </template>
  </AlbumDetail>
</template>
<script setup>
import AlbumDetail from '@business/components/src/album/AlbumDetail'
import {
  ALBUM_TYPES,
  ALBUM_TYPE_FREEZE,
  ALBUM_TYPE_OPEN,
  PICTURE_TYPE_FREEZE,
  PICTURE_TYPE_OPEN
} from '@business/common/src/album/constant'
import { changeAlbumFreezeStatus, changeBatchAlbumFreezeStatus } from '@business/common/src/album/api'
import { Message, Modal } from 'ant-design-vue'

import { ref } from 'vue'
import { useRoute } from 'vue-router'
const AlbumDetailRef = ref()

const route = useRoute()
// 切换相册冻结状态
const toggleAlbumStatus = async albumDetail => {
  const freezeParams = new Map([
    [
      ALBUM_TYPE_FREEZE,
      {
        title: '是否解冻相册？',
        content: '',
        status: 1,
        sucessMsg: '已取消解冻'
      }
    ],
    [
      ALBUM_TYPE_OPEN,
      {
        title: '冻结相册',
        content: '冻结相册后前台无法显示该相册内容，是否冻结？',
        status: 0,
        errorMsg: '已取消冻结'
      }
    ]
  ]).get(albumDetail.status)
  try {
    Modal.confirm({
      title: freezeParams.title,
      content: freezeParams.content,
      async onOk() {
        await changeAlbumFreezeStatus({ id: route.query.id, status: freezeParams.status })
        AlbumDetailRef.value.queryAlbumDetail()
      }
    })
  } catch (err) {
    Message.info(freezeParams.errorMsg)
  }
}
// 切换冻结图片状态
const toggleImgFrozeeStatus = async (imgIds, type) => {
  const freezeParams = new Map([
    [
      PICTURE_TYPE_OPEN,
      {
        title: '是否解冻图片？',
        content: '',
        errorMsg: '已取消解冻'
      }
    ],
    [
      PICTURE_TYPE_FREEZE,
      {
        title: '冻结图片',
        content: '冻结图片后前台无法显示该图片内容，是否冻结？',
        errorMsg: '已取消冻结'
      }
    ]
  ]).get(type)
  try {
    Modal.confirm({
      title: freezeParams.title,
      content: freezeParams.content,
      async onOk() {
        await changeBatchAlbumFreezeStatus({ imgIds: imgIds.join(','), status: type })
        AlbumDetailRef.value.imgList.forEach(v => {
          if (imgIds.includes(v.id)) {
            v.status = type
          }
        })
        AlbumDetailRef.value.selectedImgs = []
      }
    })
  } catch (err) {
    Message.info(freezeParams.errorMsg)
  }
}
</script>
<style lang="scss" scoped></style>
