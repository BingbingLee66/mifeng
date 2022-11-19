export const remarksRules = {
  business: [{ required: true, message: '选择商务负责人', trigger: 'change' }, ],
  operating: [{ required: true, message: '选择运营负责人', trigger: 'change' }, ],
}
export const codeRules = {
  codeNum: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 1, max: 999, message: '单次生成邀请码的数量需大于0小于等于999', trigger: 'blur' }
  ],

}
export const beforeSystemLogoUploadUtil = file => {
  if (file.type !== 'image/jpeg' &&
    file.type !== 'image/jpg' &&
    file.type !== 'image/png') {
    this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
    return false
  }
  if (file.size > 1024 * 1024 * 2) {
    this.$message.error('上传头像图片大小不能超过 2MB!')
    return false
  }
}
