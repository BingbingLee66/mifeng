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
  // 下拉：
  PULLDOWN_SELECT: 'Component_Pulldown_Select'

}

export const COMPONENT_KEY_MAP = new Map([
  [COMPONENT_KEY.SINGLE_SELECT, '单选'],
  [COMPONENT_KEY.MULTIPLE_SELECT, '多选'],
  [COMPONENT_KEY.SINGLE_TEXT, '单行文本'],
  [COMPONENT_KEY.MULTIPLE_TEXT, '多行文本'],
  [COMPONENT_KEY.UPLOAD_FILE, '上传视频'],
  [COMPONENT_KEY.UPLOAD_VIDEO, '单选'],
  [COMPONENT_KEY.PULLDOWN_SELECT, '下拉'],
])
