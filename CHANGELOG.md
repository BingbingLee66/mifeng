# CHANGELOG

## [1.8.1] - 2021-06-29

### Fixed
* 编辑会员页面，企业/团体logo是方形 [#181](https://gitlab.kd/yunshanghui/backend/api/-/issues/181)
* 总后台-添加/编辑商会，商会logo显示方形 [#180](https://gitlab.kd/yunshanghui/backend/api/-/issues/180)
* 商协会成员详情页面的头像变形 [#179](https://gitlab.kd/yunshanghui/backend/api/-/issues/179)
* 商会后台ui修改部分 [#164](https://gitlab.kd/yunshanghui/backend/api/-/issues/164)
* 切换登录账号，右上角的头像和名称没有变 [#163](https://gitlab.kd/yunshanghui/backend/api/-/issues/163)


## [1.6.0] - 2021-06-08

### Added
- 企业入会，增加【联系人姓名】、【会内职位】两个必填字段；个人入会，增加【会内职位】一个必填字段；[#98](https://gitlab.kd/yunshanghui/backend/api/-/issues/98)
- 优化会员修改记录审核：点详情弹窗：只拿已修改的数据，修改前和修改后的，需分别显示[#99](https://gitlab.kd/yunshanghui/backend/api/-/issues/99)
- 【商/协会成员】列表字段调整：原字段“姓名/企业名称”，改为“会员姓名/联系人姓名”； “会员姓名”为个人入会时填写； “联系人姓名”为企业入会时填写的”；[#100](https://gitlab.kd/yunshanghui/backend/api/-/issues/100)
- 成员详情 “姓名”： 如果是个人入会，则获取“会员姓名”； 如果是企业入会，则获取“联系人姓名”；[#101](https://gitlab.kd/yunshanghui/backend/api/-/issues/101)
- 修改成员 [#102](https://gitlab.kd/yunshanghui/backend/api/-/issues/102)
- 成员管理 【姓名】数据改动，增加【企业名称】、【入会类型】字段；[#104](https://gitlab.kd/yunshanghui/backend/api/-/issues/104)

### Fixed
* 商会后台，编辑其他资料之后，部门会消失 [#106](https://gitlab.kd/yunshanghui/backend/api/-/issues/106)
* 商会后台-成员管理，调整部门时，无法选择商会那一层 [#107](https://gitlab.kd/yunshanghui/backend/api/-/issues/107)
* 入会资料调整-小程序上传的企业logo显示成URL [#110](https://gitlab.kd/yunshanghui/backend/api/-/issues/110)
* 成员详情页面，企业简介的布局按个人简历一样摆放 [#111](https://gitlab.kd/yunshanghui/backend/api/-/issues/111)
* 企业入会，联系电话和姓名的位置反了 [#112](https://gitlab.kd/yunshanghui/backend/api/-/issues/112)
* 会员资料修改审核页面，审核详情弹框没有审核结果等内容 [#115](https://gitlab.kd/yunshanghui/backend/api/-/issues/115)
* 总后台-商会管理-编辑，联系人手机号，暂时不能让支持修改 [#117](https://gitlab.kd/yunshanghui/backend/api/-/issues/117)
* 商会后台-成员管理，调整部门时，需支持选择【商会】这一层 [#118](https://gitlab.kd/yunshanghui/backend/api/-/issues/118)

## [1.5.0] - 2021-05-31

### Added

- 组织架构 - 部门管理 - 添加、编辑、删除部门[#48](https://gitlab.kd/yunshanghui/backend/api/-/issues/48)
- 组织架构 - 成员管理 - 搜索成员、组织架构树、成员列表及分页查询、添加成员、调整部门、邀请成员加入[#49](https://gitlab.kd/yunshanghui/backend/api/-/issues/61)
- 会员管理-添加会员、入会审核、会员列表、会员详情增加部门字段 [#52](https://gitlab.kd/yunshanghui/backend/api/-/issues/52)

### Fixed
* 会员详情页面的注册时间为空 [#65](https://gitlab.kd/yunshanghui/backend/api/-/issues/65)
* 部门管理，添加和编辑部门可以输入空、空格 [#68](https://gitlab.kd/yunshanghui/backend/api/-/issues/68)
* 删除部门的提示语调整行间距 [#71](https://gitlab.kd/yunshanghui/backend/api/-/issues/48)
* 成员管理页面的部门名称显示不全 [#72](https://gitlab.kd/yunshanghui/backend/api/-/issues/48)
* 从组织机构进入，没有默认填充部门 [#73](https://gitlab.kd/yunshanghui/backend/api/-/issues/73)
* 添加成员后，没有返回到【 成员管理】的该部门页面 [#76](https://gitlab.kd/yunshanghui/backend/api/-/issues/76)
* 成员管理，最底层部门依然显示了折叠按钮 [#81](https://gitlab.kd/yunshanghui/backend/api/-/issues/81)
* 点击列表条目，未进入成员详情页 [#82](https://gitlab.kd/yunshanghui/backend/api/-/issues/82)
* 商会邀请入会二维码图标未更换成最新图标 [#84](https://gitlab.kd/yunshanghui/backend/api/-/issues/84)
* 商协会成员页面多出一列 [#85](https://gitlab.kd/yunshanghui/backend/api/-/issues/85)
* 成员管理调整部门后，会记录上次操作的部门，且无法手动清掉  [#86](https://gitlab.kd/yunshanghui/backend/api/-/issues/86)
* 商/协会成员，导出excel表缺少部门字段信息 [#87](https://gitlab.kd/yunshanghui/backend/api/-/issues/87)


## [1.4.0] - 2021-05-25

### Added

- 会员管理-添加/编辑会员页面分离，编辑页面重新设计，行业支持选择多个[#53](https://gitlab.kd/yunshanghui/backend/api/-/issues/53)
- 商会后台，会员信息的ui调整[#61](https://gitlab.kd/yunshanghui/backend/api/-/issues/61)

### Fixed

- 会员管理-商会会员，姓名/企业名称显示错误[#54]
  (https://gitlab.kd/yunshanghui/backend/api/-/issues/54)
- 编辑会员-企业入会页面需要修改的内容[#55]
  (https://gitlab.kd/yunshanghui/backend/api/-/issues/55)
- 编辑会员-个人入会页面的修改内容[#56]
  (https://gitlab.kd/yunshanghui/backend/api/-/issues/56)
- 编辑资料-身份证号的位数限制有误[#57]
  (https://gitlab.kd/yunshanghui/backend/api/-/issues/55)
- 编辑资料，手机号不允许修改[#58]
  (https://gitlab.kd/yunshanghui/backend/api/-/issues/58)

## [1.3.0] - 2021-05-18

### Added

- 入会资料调整-添加修改会员 yunshanghui/frontend/shanghui-admin#30
- 入会资料调整-入会审核 yunshanghui/frontend/shanghui-admin#31
- 入会资料调整-入会资料调整 yunshanghui/frontend/shanghui-admin#32
- 入会资料调整-商会会员 yunshanghui/frontend/shanghui-admin#33
- 入会资料调整-会员详情页 yunshanghui/frontend/shanghui-admin#34
- 商会入驻增加商会logo字段 yunshanghui/frontend/shanghui-admin#35
- 后台富文本编辑器，“视频”上传入口隐藏 yunshanghui/frontend/shanghui-admin#36

### Fixed

- 会员管理-入会审核，同意按钮没有加防抖 yunshanghui/frontend/shanghui-admin#45
- 商会后台，导出商会成员的表单与实际列名不同 yunshanghui/frontend/shanghui-admin#42
- 商会logo在列表样式 yunshanghui/frontend/shanghui-admin#41
- 总后台-用户管理，栏目名称改为操作 yunshanghui/frontend/shanghui-admin#38


