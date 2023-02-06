/**
 *
 * @param {*} path img图片名称：例如: img.png
 * @type string
 * @returns url
 */
import { BASE_CDN_URL } from '@/constant'

export const useImgUrl = path => BASE_CDN_URL + path
