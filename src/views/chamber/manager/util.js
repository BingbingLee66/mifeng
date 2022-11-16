export const remarksRules = {
  business: [{ required: true, message: '不能为空', trigger: 'change' }, ],
  operating: [{ required: true, message: '不能为空', trigger: 'change' }, ],
}
export const codeRules = {
  codeNum: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 1, max: 999, message: '单次生成邀请码的数量需大于0小于等于999', trigger: 'blur' }
  ],

}
