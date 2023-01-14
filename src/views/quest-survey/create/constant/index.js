export const COMPONENT_KEY = {
  // 单选
  SINGLE_SELECT: 'Component_Single_Select',
  // 多选
  MULTIPLE_SELECT: 'Component_Multiple_Select',
  // 单行文本
  SINGLE_TEXT: 'Component_Single_Text',
  // 多行文本：
  MULTIPLE_TEXT: 'Component_Multiple_Text',
  // 上传文件：
  UPLOAD_FILE: 'Component_Upload_File',
  // 上传视频
  UPLOAD_VIDEO: 'Component_Upload_Video',
  // 上传视频
  UPLOAD_IMAGE: 'Component_Upload_Image',
  // 下拉：
  PULLDOWN_SELECT: 'Component_Pulldown_Select',
  // 省市区
  PROVINCE_CITY_AREA: 'Component_Province_City_Area'

}

export const COMPONENT_KEY_MAP = new Map([
  [COMPONENT_KEY.SINGLE_SELECT, '单选'],
  [COMPONENT_KEY.MULTIPLE_SELECT, '多选'],
  [COMPONENT_KEY.SINGLE_TEXT, '单行填空'],
  [COMPONENT_KEY.MULTIPLE_TEXT, '多行文本'],
  [COMPONENT_KEY.UPLOAD_FILE, '上传文件'],
  [COMPONENT_KEY.UPLOAD_VIDEO, '上传视频'],
  [COMPONENT_KEY.UPLOAD_IMAGE, '上传图片'],
  [COMPONENT_KEY.PULLDOWN_SELECT, '下拉'],
  [COMPONENT_KEY.PROVINCE_CITY_AREA, '下拉级联'],
])
export const FILE_TYPE = {
  UPLOAD_IMG: 'uploadImg',
  UPLOAD_FILE: 'uploadFile',
}

export const FILE_TYPE_MAP = new Map([
  [FILE_TYPE.UPLOAD_IMG, '上传图片'],
  [FILE_TYPE.UPLOAD_FILE, '上传文件 '],
])

export const UPLOAD_MAP = new Map([
  [COMPONENT_KEY.UPLOAD_FILE, ['支持格式：png、jpeg、jpg', '最多9个，每个不超过30MB']],
  [COMPONENT_KEY.UPLOAD_IMAGE, ['支持格式：png、jpeg、jpg', '最多9个，每个不超过30MB']],
  [COMPONENT_KEY.UPLOAD_VIDEO, ['支持格式：mp4 ', '(最多9个，每个不超过300MB)']],
])
export const BUSINESS_TYPE = 'YSH_PSQ'

export const SHARE_TIPS = '将问卷分享给微信好友时的图片；若您未上传则使用默认图'
