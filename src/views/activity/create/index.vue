<template>
  <div class="app-container">
    <preview ref="preview" />
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane
        v-bind:label="activityId ? '编辑活动' : '创建活动'"
        name="1"
      ></el-tab-pane>
      <el-tab-pane label="活动介绍" name="3"></el-tab-pane>
      <el-tab-pane label="活动报名表" name="2"></el-tab-pane>
    </el-tabs> -->

    <div v-show="activeName == '1'">
      <div class="active-top">
        <div class="active-title">{{ activityId ? '编辑活动 (1/2)' : '创建活动 (1/2)' }}</div>
        <div class="active-con">
          <span class="active-bule">活动信息</span>
          一一
          <span>报名信息</span>
        </div>
      </div>
      <!-- 内容 -->
      <div class="create-container mydiv">
        <el-form
          ref="form"
          :model="formObj"
          :rules="rules"
          label-position="right"
          label-width="180px"
        >
          <el-row>
            <el-col style="width: 600px; height: 50px">
              <el-form-item label="活动名称：" prop="activityName">
                <el-input
                  v-model="formObj.activityName"
                  show-word-limit
                  maxlength="60"
                  placeholder="限60字内"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col style="width: 700px">
              <el-form-item class="date-wrap" label="报名时间：" prop="applyDate">
                <!--    -->
                <el-date-picker
                  v-model="formObj.applyDate"
                  format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  value-format="timestamp"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :disabled="status == 2 || status == 3"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col style="width: 700px">
              <el-form-item class="date-wrap" label="活动时间：" prop="date">
                <el-date-picker
                  v-model="formObj.date"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="timestamp"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :disabled="status == 2 || status == 3"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item
                class="address-wrap"
                label="活动地点："
                prop="addressInfo"
              >
                <div class="address-may">
                  <!-- <el-select
                    v-model="provinceValue"
                    placeholder="请选择省份"
                    @change="provinceChange"
                    :disabled="status == 2 || status == 3"
                  >
                    <el-option
                      v-for="item in provinceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select> -->
                  <div class="address-Obscuration">
                    <el-input v-model="formObj.addressInfo" style="width:450px;" :disabled="status == 2 || status == 3" clearable placeholder="请输入地址" @input="addressChange">
                      <i
                        slot="suffix"
                        class="el-icon-location-information"
                      />
                    </el-input>
                    <div v-if="addressList" class="Obscuration-tier">
                      <div v-for="(item,index) in addressList" :key="index" class="Obscuration-map" @click="onaddress(item)">
                        {{ item.title }}
                        <span class="address">{{ item.address }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <el-select
                  v-model="cityValue"
                  placeholder="请选择市"
                  @change="cityChange"
                  :disabled="status == 2 || status == 3"
                >
                  <el-option
                    v-for="item in cityOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select> -->

                <!-- <el-select
                  v-model="countryValue"
                  placeholder="请选择区"
                  @change="countryChange"
                  :disabled="status == 2 || status == 3"
                >
                  <el-option
                    v-for="item in countryOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select> -->
                <!-- <el-input
                  class="address-inp"
                  type="textarea"
                  resize="none"
                  :rows="2"
                  v-model="formObj.addressInfo"
                  show-word-limit
                  maxlength="50"
                  placeholder="详细地址，限50字内"
                  :disabled="status == 2 || status == 3"
                ></el-input> -->

                <!-- 腾讯地图 -->
                <div ref="mapBox" style="width:800px; height:390px;z-index:0" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col style="width: 700px; height: 20px">
              <el-form-item label="报名对象：" required>
                <el-checkbox
                  v-model="applyObject.unlimit"
                  :disabled="status == 2 || status == 3"
                  @change="handleCheckTarget($event, 0)"
                >不限</el-checkbox>
                <el-checkbox
                  v-model="applyObject.limit"
                  :disabled="status == 2 || status == 3"
                  @change="handleCheckTarget($event, 1)"
                >
                  {{ ckey ? "限本商会成员" : "限云商会成员" }}
                </el-checkbox>
                <el-checkbox
                  v-if="ckey"
                  v-model="applyObject.port"
                  :disabled="status == 2 || status == 3"
                  @change="handleCheckTarget($event, 2)"
                >
                  限定本商会内指定职位
                </el-checkbox>
                <el-checkbox
                  v-if="ckey"
                  v-model="applyObject.department"
                  :disabled="status == 2 || status == 3"
                  @change="handleCheckTarget($event, 3)"
                >
                  限本商会内指定部门
                </el-checkbox>
                <!--                <span style="margin-left: 20px;color: #ff0000" v-if="!ckey">指云商会平台的任意商会的任意成员</span>-->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="applyObject.port">
            <el-col style="width: 600px; height: 40px">
              <el-form-item label="会内职位：" required>
                <el-select
                  v-model="portValue"
                  multiple
                  placeholder="请选择"
                  :disabled="status == 2 || status == 3"
                >
                  <el-option
                    v-for="item in portSelect"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="applyObject.department">
            <el-col style="width: 600px">
              <el-form-item label="会内部门：" required>
                <div>
                  <!-- <el-cascader
                    placeholder="请选择"
                    :options="options"
                    :props="{ multiple: true, checkStrictly: true}"
                    clearable
                    filterable
                    v-model="valueTree"
                    @change="test()"
                  >
                  </el-cascader> -->
                  <treeselect
                    id="treeselect"
                    v-model="valueTree"
                    :multiple="true"
                    :options="options"
                    placeholder="请选择"
                    :normalizer="normalizer"
                    :flat="true"
                    no-children-text="无子部门"
                    no-options-text="暂时没有部门"
                    no-results-text="没找到部门"
                    :default-expand-level="3"
                    :disabled="status == 2 || status == 3"
                  />
                  <!-- <treeselect-value :value="valueTree" /> -->
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col style="width: 900px">
              <el-form-item label="参加人数：" required>
                <el-checkbox
                  v-model="applyCount.unlimit"
                  :disabled="status == 2 || status == 3"
                  @change="handleCheckNum($event, 0)"
                >不限</el-checkbox>
                <el-checkbox
                  v-model="applyCount.limit"
                  :disabled="status == 2 || status == 3"
                  @change="handleCheckNum($event, 1)"
                >限</el-checkbox>
                <el-input
                  v-show="applyCount.limit"
                  v-model="formObj.applyCount"
                  style="width: 200px"
                  placeholder="大于0的整数"
                  maxlength="9"
                  :disabled="status == 2 || status == 3"
                >
                  <template slot="append">人</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 900px;margin-top: -38px;">
              <el-form-item label="报名审核：" required>
                <el-checkbox
                  v-model="auditStatus.unlimit"
                  :disabled="status == 2 || status == 3"
                  @change="handleAuditStatus( 0)"
                >无需审核</el-checkbox>
                <el-checkbox
                  v-model="auditStatus.limit"
                  :disabled="status == 2 || status == 3"
                  @change="handleAuditStatus( 1)"
                >需审核</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 扩展功能 -->
          <el-row>
            <el-col style="width: 700px; height: 40px;margin-top: -38px;">
              <el-form-item label="扩展功能：">
                <el-checkbox-group v-model="roleIds">
                  <el-checkbox :disabled="status == 2 || status == 3" :label="1">签到</el-checkbox>
                  <el-checkbox :disabled="status == 2 || status == 3" :label="2">签退</el-checkbox>
                  <el-checkbox :disabled="status == 2 || status == 3" :label="3">座位表</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px; height: 160px">
              <el-form-item
                label="活动头图："
                prop="headImage"
                class="upload-style"
              >
                <el-upload
                  class="uploader-pic-wrap"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="uploadHeadImage"
                >
                  <img
                    v-if="formObj.headImage"
                    :src="formObj.headImage"
                    class="pic"
                  >
                  <i v-else class="el-icon-plus uploader-pic-icon" />
                </el-upload>
                <div style="color: #999; line-height: 1.3; margin-top: 8px">
                  建议尺寸 744*300，支持jpg、png
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px; height: 120px">
              <el-form-item
                label="活动分享图："
                prop="listImage"
                class="upload-style"
              >
                <el-upload
                  class="uploader-lpic-wrap"
                  action="/"
                  :show-file-list="false"
                  :before-upload="beforeUpload"
                  :http-request="uploadListImage"
                >
                  <img
                    v-if="formObj.listImage"
                    :src="formObj.listImage"
                    class="lpic"
                  >
                  <i v-else class="el-icon-plus uploader-lpic-icon" />
                </el-upload>
                <div style="color: #999; line-height: 1.3; margin-top: 8px">
                  建议尺寸 678*540，支持jpg、png
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col style="width: 900px">
              <el-form-item label="活动介绍：" class="upload-style">
                <Ckeditor ref="ckeditor1" @getHtml="getHtml" />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="album-row">
            <el-row>
              <el-col>
                <el-form-item label="用户图片直播关联权限：">
                  <el-radio-group v-model="formObj.authAlbum" @change="onReleChange">
                    <el-radio :label="1">可关联</el-radio>
                    <el-radio :label="0">不可关联</el-radio>
                  </el-radio-group>
                  <div class="tips">开启后，参与人员可将图片直播关联到 活动详情 的 会员图片 展示</div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div v-if="ruleCkeys.includes(ckey) || (!ckey)">
            <el-row>
              <el-col>
                <el-form-item label="直播链接类型：">
                  <el-radio-group v-model="formObj.linkType">
                    <el-radio :label="1">云会播小程序</el-radio>
                    <el-radio :label="2">H5链接</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col style="width: 600px; height: 50px">
                <el-form-item label="直播间链接：" prop="link">
                  <el-input
                    v-model="formObj.link"
                    show-word-limit
                    maxlength="2000"
                    placeholder="输入直播间链接，在活动开始后的活动详情页面会显示相应的入口"
                  />
                </el-form-item>
              </el-col>
              <div class="tips" style="width: 600px; padding-left: 120px">
                <div>提示：</div>
                <div style="margin: 5px 0px">若不输入链接，则不显示入口；</div>
                <div>在发布活动后，也可以修改链接。</div>
              </div>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="观看权限：" prop="competence">
                  <el-radio v-model="formObj.competence" label="0">不限</el-radio>
                  <el-radio v-if="ckey" v-model="formObj.competence" label="1">限本商会会员</el-radio>
                  <el-radio v-else v-model="formObj.competence" label="2">限云商会会员</el-radio>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="入口显示：">
                  <div>
                    入口开放时间：
                    <el-radio-group v-model="formObj.showEnter.status">
                      <el-radio :label="0">报名成功后</el-radio>
                      <el-radio :label="1">活动开始后</el-radio>
                    </el-radio-group>
                  </div>
                  <div>
                    入口关闭时间：
                    <el-date-picker
                      v-model="formObj.showEnter.closeDate"
                      format="yyyy-MM-dd HH:mm:ss"
                      type="datetime"
                      value-format="timestamp"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <el-row>
            <el-col style="width: 600px; padding-left: 120px">
              <!-- <el-button type="primary" v-dbClick @click="save">保存</el-button>
              <el-button @click="cancel">取消</el-button> -->
              <el-button @click="onpreview">预览</el-button>
              <el-button type="primary" @click="onnext">下一步</el-button>

            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div v-show="activeName == '2'">
      <div>
        <div class="active-top">
          <div class="active-title">{{ activityId ? '编辑活动 (2/2)' : '创建活动 (2/2)' }}</div>
          <div class="active-con">
            <span>活动信息</span>
            一一
            <span class="active-bule">报名信息</span>
          </div>
        </div>
        <div class="sgin-up">
          <div class="sgin-way">
            <div class="sgin-left">报名方式：</div>
            <el-radio-group v-model="formObj.signType">
              <el-radio :disabled="status == 2 || status == 3" :label="0">自定义报名表</el-radio>
              <el-radio :disabled="status == 2 || status == 3" :label="1">一键报名</el-radio>
            </el-radio-group>
          </div>
          <div class="sgin-surface">报名表</div>
          <div class="sgin-way">
            <div class="sgin-left">到场人数
              <span><i class="el-icon-question" @click="isPresent = true" /></span>
            </div>
            <el-radio-group v-model="formObj.arriveType">
              <el-radio :disabled="status == 2 || status == 3" :label="1">需填写</el-radio>
              <el-radio :disabled="status == 2 || status == 3" :label="0">无需填写</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>

      <div class="create-container mydiv">
        <el-form
          v-show="formObj.signType == 0"
          ref="form1"
          :rules="rules"
          label-position="right"
        >
          <!-- <el-row style="margin-top: 8px">
            <span style="color: #f5222d; margin-left: 60px"
              >提示：报名信息请限制在 10 个以内</span
            >
          </el-row> -->
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item
                label="姓名："
                prop="name"
                :rules="[{ required: true, message: '不能为空' }]"
              >
                <el-input
                  show-word-limit
                  maxlength="30"
                  placeholder="请输入"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->
          <!-- <el-row>
            <el-col style="width: 600px; height: 50px">
              <el-form-item
                label="手机："
                prop="phone"
                :rules="[{ required: true, message: '不能为空' }]"
              >
                <el-input
                  show-word-limit
                  maxlength="30"
                  placeholder="请输入"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->

          <!-- <el-row>
            <el-col style="width: 600px;height: 50px">
              <el-form-item label="邮箱：" prop="email">
                <el-input show-word-limit maxlength="30" placeholder="请输入" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col style="width: 600px;height: 50px">
              <el-form-item label="微信：" prop="wechat">
                <el-input show-word-limit maxlength="30" placeholder="请输入" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row> -->

          <el-row style="margin-left:30px;">
            <el-form-item>
              <el-button
                type="primary"
                :disabled="arrayData.length >= 6 ||(status == 2 || status == 3)"
                @click="iscustom = true"
              >+自定义报名信息</el-button>
            </el-form-item>
          </el-row>

          <div v-for="(item, index) in arrayData" :key="item.id" style="margin-left:30px;">
            <el-row>
              <el-col :span="12">
                <el-form-item
                  :prop="'col' + index"
                  :required="item.check === 1"
                >
                  <div class="sign">
                    <span v-if="item.check === 1" class="sign-star">*</span>
                    {{ item.title }}
                  </div>
                  <div class="sign-con">
                    <el-input
                      v-if="item.type == 0"
                      show-word-limit
                      :maxlength="item.lengthLimit"
                      :placeholder="item.msgAlert"
                      :disabled="true"
                    />
                    <el-input
                      v-if="item.type == 1"
                      show-word-limit
                      :placeholder="item.selects[0].value"
                      :disabled="true"
                    >
                      <i slot="suffix" class="el-icon-arrow-down" />
                    </el-input>
                    <div class="sign-right">
                      <el-link type="primary" @click="edit(index,item.type)">编辑</el-link>
                      <el-link type="primary" @click="up(index)">上移</el-link>
                      <el-link type="primary" @click="down(index)">下移</el-link>
                      <el-link type="primary" @click="del(index)">删除</el-link>
                    </div>
                  </div>

                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </el-form>
      </div>
      <!-- 自定义信息 -->
      <el-dialog
        :title="(editCol ? '编辑' : '新增') + '自定义信息'"
        :visible.sync="dialogFormVisible"
        width="500px"
        :close-on-click-modal="false"
        @close="cancel1"
      >
        <el-form ref="f2" :model="colData" label-width="120px">
          <el-form-item label="信息类型:" :rules="[{ required: true }]">
            <el-select v-model="infoDate.info" disabled placeholder="请选择">
              <el-option label="输入框" value="0" />
              <el-option label="下拉框" value="1" />
            </el-select>
          </el-form-item>
          <!-- 输入框 -->
          <div v-if="infoDate.info == 0">
            <el-form-item
              label="标题"
              prop="title"
              :rules="[{ required: true, message: '不能为空' }]"
            >
              <el-input
                v-model="colData.title"
                autocomplete="off"
                placeholder="标题，15字内"
                :maxlength="15"
              />
            </el-form-item>
            <el-form-item
              label="输入框提示"
              prop="msgAlert"
              :rules="[{ required: true, message: '不能为空' }]"
            >
              <el-input
                v-model="colData.msgAlert"
                autocomplete="off"
                placeholder="输入框提示文字，15字内"
                :maxlength="15"
              />
            </el-form-item>
            <el-form-item label="输入字数限制" prop="lengthLimit">
              <el-input
                v-model="colData.lengthLimit"
                autocomplete="off"
                placeholder="不限制"
                type="number"
              />
              <br>不填写，则默认不限制
            </el-form-item>
          </div>
          <!-- 下拉框 -->
          <div v-else>
            <el-form-item
              label="标题"
              prop="title"
              :rules="[{ required: true, message: '不能为空' }]"
            >
              <el-input
                v-model="colData.title"
                autocomplete="off"
                placeholder="标题，15字内"
                :maxlength="15"
              />
            </el-form-item>
            <el-form-item
              v-for="(item,index) in colData.selects"
              :key="index"
              :label="`选项${index + 1}`"
              :rules="[{ required: true }]"
            >
              <el-input
                v-model="item.value"
                autocomplete="off"
                placeholder="选项，10字内"
                :maxlength="10"
              />
            </el-form-item>
            <div class="add-option" @click="onOptions">+添加选项</div>
          </div>

          <el-form-item label="是否必填" prop="check">
            <el-radio-group v-model="colData.check">
              <el-radio :label="1">必填</el-radio>
              <el-radio :label="0">选填</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel1">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </div>
      </el-dialog>

      <el-row>
        <el-col style="width: 600px; padding-left: 30px;margin-top:20px;">
          <!-- <el-button type="primary" v-dbClick @click="save">保存</el-button>
          <el-button @click="cancel">取消</el-button> -->
          <el-button @click="activeName = '1'">上一步</el-button>
          <el-button @click="save(0)">保存，暂不发布</el-button>
          <el-button type="primary" @click="save(1)">保存并发布</el-button>
        </el-col>
      </el-row>
      <!-- 新增自定义信息 -->
      <el-dialog
        title="新增自定义信息"
        :visible.sync="iscustom"
        width="25%"
        center
        :close-on-click-modal="false"
        :before-close="onCancelDate"
      >
        <el-form :model="infoDate" label-width="100px">
          <el-form-item label="信息类型:" :rules="[{ required: true }]">
            <el-select v-model="infoDate.info" placeholder="请选择">
              <el-option label="输入框" value="0" />
              <el-option label="下拉框" value="1" />
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="onCancelDate">取 消</el-button>
          <el-button type="primary" @click="onInfoDate">保存</el-button>

        </span>
      </el-dialog>
      <!-- 到场人数提示 -->
      <el-dialog
        title="到场人数设置后，小程序显示"
        :visible.sync="isPresent"
        width="30%"
        center
      >
        <div class="Present-img">
          <img src="https://ysh-cdn.kaidicloud.com/prod/png/info.png" class="pic">
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="isPresent = false">知道了</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script src="./create.js"></script>

<style rel="stylesheet/scss" lang="scss" scoped>

@import "src/styles/common.scss";
</style>

<style lang="scss">
.el-scrollbar {
  // display: block !important;
}

#treeselect {
  .vue-treeselect__placeholder {
    line-height: 40px !important;
  }
}

.mydiv {
  width: 80%;
  // border: 1px solid rgba(0, 0, 0, 0.17);
  // margin-left: 30px;
  // margin-top: 30px;
  padding-top: 30px;
  height: auto;
  min-height: 350px;
  min-width: 700px;
}
.create-container {
  .upload-style {
    .el-form-item__label {
      line-height: 1;
    }
  }

  .uploader-pic-wrap {
    height: 120px;
    width: 300px;
  }

  .uploader-pic-wrap .el-upload {
    width: 298px;
    height: 120px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .uploader-pic-wrap .el-upload:hover {
    border-color: #409eff;
  }

  .uploader-pic-icon {
    font-size: 28px;
    color: #8c939d;
    width: 298px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .pic {
    width: 298px;
    height: 120px;
    display: block;
  }

  .uploader-lpic-wrap {
    width: 117px;
    height: 80px;
  }

  .uploader-lpic-wrap .el-upload {
    width: 117px;
    height: 80px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .uploader-lpic-wrap .el-upload:hover {
    border-color: #409eff;
  }

  .uploader-lpic-icon {
    font-size: 28px;
    color: #8c939d;
    width: 117px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  .lpic {
    width: 117px;
    height: 80px;
    display: block;
  }

  .address-wrap .el-select {
    width: 120px !important;
    margin-right: 10px;
  }

  .address-wrap {
    .address-inp {
      margin-top: 20px;

      .el-input__count {
        background: none;
        position: absolute;
        bottom: -5px;
        right: 10px;
      }
    }
  }

  .date-wrap .el-input__inner {
    width: 385px;
  }

  .date-wrap .el-date-editor .el-range-input {
    width: 45%;
  }

}
.tips {
  font-weight: 400;
  font-style: normal;
  color: #666666;
  font-size: 14px;
}
.active-top{
  margin-top: 10px;
  margin-left:30px;
  .active-title{
    font-size: 23px;
    font-weight: 700;
  }
  .active-con{
    margin-top: 20px;
    font-weight: 700;
    .active-bule{
      color: #02a8f0;
    }
  }
}
.sgin-up{
  margin-top: 20px;
  margin-left: 30px;
  .sgin-way{
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #606266;
    .sgin-left{
      margin-right: 20px;
      .el-icon-question{
        color: #c8b6ae;
      }
    }
  }
  .sgin-surface{
    font-weight: 700;
    font-size: 23px;
    margin: 20px 0;
  }
}
.Present-img{
  width: 326px;
  height: 79px;
  margin: 0 auto;
  .pic{
    width: 100%;
    height: 100%;
  }
}
.address-may{
  display: flex;
  margin-bottom: 20px;
}
.address-Obscuration{
  width: 450px;
  position: relative;
  margin-right:20px;
  z-index: 1000;
  .Obscuration-tier{
    width: 100%;
    position: absolute;
    background: rgba(252, 250, 250, 0.918);
    // border: 1px solid #f1f1f1;
    border-top: none;
    font-size: 13px;
    color: #5a5a5a;
    max-height: 350px;
    overflow-y: auto;
    top: 111%;
    left: 0;
    .Obscuration-map{
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
        border-bottom: 1px solid #f1f1f1;
        padding: 5px 10px;
        margin: 0;
        cursor: pointer;
        &:hover {
          background: #eff6fd;
        }
        .address {
          font-size: 12px;
          color: #b9b9b9;
          margin-left: 20px;
        }
    }
  }
}
.add-option{
  color: #409eff;
  margin-left: 120px;
  font-weight: 700;
  cursor: pointer;
}
.sign{
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  position: relative;
  margin-left: 9px;;
  .sign-star{
    position: absolute;
    top: 4px;
    left: -8px;
    color: #F56C6C;
  }
}
.sign-con{
  display: flex;
  align-items: center;
  .sign-right{
    margin-left: 10px;
    width: 100%;
  }
}
</style>

