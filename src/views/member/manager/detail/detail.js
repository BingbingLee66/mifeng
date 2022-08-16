import {
  getMemberDetail,
  getMemberAuditDetail,
  updateAudit,
  updateReaudit,
  authorizeMemberAuth,
  cancelAuthorizeMemberAuth
} from "@/api/member/manager";
import Labels from "@/api/labels/labels";
import ysTable from "@/components/ys-table";
import datas from "../../member-tab/data";
/* 会员标签 */
const memberLabelData = [
  {
    label: "标签组",
    prop: "tagGroupName"
  },
  {
    label: "标签",
    prop: "tagName",
    type: "slot",
    slotName: "tagName"
  },
  {
    label: "标记信息",
    prop: "updateInfo",
    type: "operator",
    operatorName: "tagPeople",
    operatorTime: "markTime"
  }
];
/* 供需标签 */
const supplyLabelData = [
  {
    label: "标签",
    prop: "tagGroupName",
    type: "slot",
    slotName: "tagGroupName"
  },
  {
    label: "标记时间",
    prop: "markTime",
    type: "time"
  }
];
export default {
  name: "memebrDetails",
  components: {
    "ys-table": ysTable
  },
  data() {
    return {
      type: "", // 0会员 1提交审核 2修改审核
      memberDetail: {},
      member: {},
      count: 0,
      idCardVisible: false,
      idCardImage: {
        frontOfIdCard: "",
        backOfIdCard: ""
      },
      licenseVisible: false,
      licenseImage: "",
      companyIntroductionVisible: false,
      companyIntroduction: "",
      resumeVisible: false,
      resume: "",
      rejectVisible: false,
      audit: {
        id: [],
        remark: "资料乱填"
      },
      userInfo: {},
      telephones: [],
      contactAddress: [],
      activeName: "1",
      tableColumn: memberLabelData,
      tableColumn1: supplyLabelData,
      labelData: [],
      supplyData: [],
      pageData: {
        currentpage: 1,
        limit: 10,
        pageSizes: [10, 20, 50, 100, 500],
        total: 0
      }
    };
  },
  filters: {
    dateFormat(value) {
      if (value) {
        var myDate = new Date(value.replace("-", "/").replace("-", "/"));
        return (
          myDate.getFullYear() +
          "年" +
          (myDate.getMonth() + 1) +
          "月" +
          (myDate.getDay() + 1) +
          "日"
        );
      }
      return "";
    }
  },
  computed: {
    resumeCp() {
      return function(msg) {
        let result = msg;
        if (!!msg && msg.length > 100) {
          result = msg.substring(0, 100) + "...";
        }
        return result;
      };
    },
    companyInstrodCp() {
      return function(msg) {
        let result = msg;
        if (!!msg && msg.length > 100) {
          result = msg.substring(0, 100) + "...";
        }
        return result;
      };
    },
    ckey() {
      return this.$store.getters.ckey;
    }
  },
  activated() {
    console.log("缓存");
  },
  deactivated() {
    console.log("出去缓存");
  },
  mounted() {
    console.log("this.$route.params", this.$route.params);
    if (this.$route.params.memberDetail) {
      console.log(
        "this.$route.params.memberDetail",
        this.$route.params.memberDetail
      );
      this.memberDetail = this.$route.params.memberDetail;
      console.log("this.memberDetail.id", this.memberDetail.id);
      window.localStorage.setItem(
        "detail-member",
        JSON.stringify(this.memberDetail)
      );
    }
    console.log(
      "this.$route.params.memberDetail",
      this.$route.params.memberDetail
    );
    if (!this.memberDetail.id) {
      this.memberDetail = JSON.parse(
        window.localStorage.getItem("detail-member")
      );
    }
    if (this.$route.params.querytype) {
      this.type = this.$route.params.querytype;
      window.localStorage.setItem("detail-type", this.type);
    } else if (this.$route.params.querytype === 0) {
      this.type = "0";
    }
    if (this.type === "") {
      this.type = window.localStorage.getItem("detail-type");
    }
    this.init();
  },
  methods: {
    handleTabClick(e) {
      if (e.name == "2") {
        // 获取会员标签
        this.getMemberLableList();
      } else if (e.name == "3") {
        // 获取供需标签
        this.getSupplyLabelList();
      }
    },
    async getMemberLableList() {
      const userId = this.$route.query.userId;
      if (!userId) return;
      const { currentpage, limit } = this.pageData;
      const res = await Labels.getUserDetailLabelLst(userId, "1", {
        page: currentpage,
        pageSize: limit
      });
      console.log("---会员标签---", res);
      if (res.state !== 1) return;
      this.labelData = res.data.list;
      this.pageData.total = res.data.totalRows;
    },
    async getSupplyLabelList() {
      const userId = this.$route.query.userId;
      const res = await Labels.getFirstInterestLabel(userId);
      console.log("---供需标签---", res);
      if (res.state !== 1) return;
      if (res.data) {
        this.supplyData = res.data;
      }
    },
    // 执行会员认证或者取消
    async handleAuthMember(isAuth) {
      const content = isAuth
        ? `<div>确定给该用户取消商会认证吗？</div>
          <div style="color:#ccc;">对已认证的用户取消认证，取消后，该用户将不再展示“商会认证”标识</div>
          `
        : `<div>确定给该用户进行商会认证吗？</div>
          <div style="color:red;">商会认证主要是对该用户的个人信息、企业信息进行认证</div>
          <div style="color:#ccc;">1、认证后，该用户显示“商会认证”标识</div>
          <div style="color:#ccc;">2、认证后，可在【商协会成员-详情】页取消认证</div>
          `;
      try {
        await this.$confirm(content, isAuth ? "取消认证" : "商会认证", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true
        });
        const { state, msg } = await (isAuth
          ? cancelAuthorizeMemberAuth
          : authorizeMemberAuth)({
          ckey: this.ckey,
          wxUserId: this.member.wxUserId
        });
        this.$message({
          message: msg,
          type: state === 1 ? "success" : "error"
        });
        if (state === 1) {
          this.member.authenticate = !isAuth;
        }
      } catch (error) {
        /*  */
      }
    },

    closeTab() {
      // 退出当前tab, 打开指定tab
      let openPath = window.localStorage.getItem("memberaudit");
      let tagsViews = this.$store.state.tagsView.visitedViews;
      let selectView = null;
      for (let view of tagsViews) {
        if (view.path === this.$route.path) {
          this.$store.dispatch("tagsView/delView", view).then(() => {
            this.$router.push({ path: openPath });
          });
          break;
        }
      }
    },
    init() {
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      const { id, wxUserId, ckey } = this.memberDetail;
      let params = {
        memberId: id
      };
      // console.log('paramsparams', params)
      if (this.type === "0") {
        if (!params.memberId) params = { wxUserId, ckey };
        getMemberDetail(params).then(response => {
          this.member = response.data.dtl[0];

          this.telephones = response.data.telephones;
          this.contactAddress = response.data.contactAddress;

          if (response.data.userInfo) {
            this.userInfo = response.data.userInfo;
          }
          // console.log('member', this.member)
        });
      } else {
        params["type"] = this.type;
        getMemberAuditDetail(params).then(response => {
          this.member = response.data.dtl[0];
        });
      }
    },
    idCardDetail(row) {
      this.idCardImage.frontOfIdCard = row.frontOfIdCard;
      this.idCardImage.backOfIdCard = row.backOfIdCard;
      this.idCardVisible = true;
    },
    licenseDetail(row) {
      this.licenseImage = row.license;
      this.licenseVisible = true;
    },
    resumeDetail(msg) {
      this.resume = msg;
      this.resumeVisible = true;
    },
    companyIntroductionDetail(msg) {
      this.companyIntroduction = msg;
      this.companyIntroductionVisible = true;
    },
    goEdit() {
      this.$router.push({
        name: "编辑会员",
        params: { memberId: this.memberDetail.id, querytype: this.type }
      });
    },
    approved(row) {
      let arr = [];
      arr.push(row.id);
      let params = {
        memberId: arr,
        auditStatus: 1
      };
      if (this.type === "1") {
        updateAudit(params).then(response => {
          this.$message({
            message: "已通过",
            type: "success"
          });
          this.closeTab();
        });
      } else if (this.type === "2") {
        updateReaudit(params).then(response => {
          this.$message({
            message: "已通过",
            type: "success"
          });
          this.closeTab();
        });
      }
    },
    rejectRemark(row) {
      this.audit.id.push(row.id);
      this.audit.remark = "资料乱填";
      this.rejectVisible = true;
    },
    reject() {
      let params = {
        memberId: this.audit.id,
        auditStatus: 2,
        remark: this.audit.remark
      };
      if (this.type === "1") {
        updateAudit(params).then(response => {
          this.$message({
            message: "已驳回",
            type: "success"
          });
          this.closeTab();
        });
      } else if (this.type === "2") {
        updateReaudit(params).then(response => {
          this.$message({
            message: "已驳回",
            type: "success"
          });
          this.closeTab();
        });
      }
      this.rejectVisible = false;
    }
  }
};
