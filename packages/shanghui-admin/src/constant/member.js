const AUDIT_STATUS = {
  all: -1, // 所有
  pending: 0, // 待审核
  passed: 1, // 已通过
  rejected: 2 // 已驳回
}

const AUDIT_STATUS_MAP = new Map([
  [AUDIT_STATUS.all, '所有'],
  [AUDIT_STATUS.pending, '待审核'],
  [AUDIT_STATUS.passed, '已通过'],
  [AUDIT_STATUS.rejected, '已驳回']
])

export { AUDIT_STATUS, AUDIT_STATUS_MAP }
