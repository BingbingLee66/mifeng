/**
 *
 * @param {*} path img图片名称：例如: img.png
 * @type string
 * @returns url
 */
import { BASE_CDN_URL, BASE_CDN_URL2 } from '../config/index'

export const useImgUrl = path => BASE_CDN_URL + path

export const useImgUrlAdmin = path => BASE_CDN_URL2 + path
