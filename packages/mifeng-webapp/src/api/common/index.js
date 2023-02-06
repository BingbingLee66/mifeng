/**
 * 全局通用api统一放在这个文件下
 */

import request from '@/utils/request'

/**
 * base64转PNG
 * @param data：dataUri=base64文件
 * @returns {Promise<AxiosResponse<any>>}
 */
export const base64ToPNG = data =>
  request.post('/ecservice/ec/upload/random/DataURI/fileUpload', data, { hiddenSuccess: true })
