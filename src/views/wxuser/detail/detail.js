import { getUserDetail } from "@/api/member/manager";
import Labels from "@/api/labels/labels";
import ysTable from "@/components/ys-table";
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
  components: {
    "ys-table": ysTable
  },
  data() {
    return {
      userDetail: {},
      memberList: {},
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
      userInfo: {},
      telephones: [],
      contactAddress: [],
      activeName: "1",
      activeName2: "0",
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
    }
  },
  mounted() {
    console.log("this.$route.params", this.$route.params);
    if (this.$route.params.userDetail) {
      this.userDetail = this.$route.params.userDetail;
      window.localStorage.setItem("detail-user", this.userDetail);
      this.init();
    }
    if (!this.userDetail) {
      this.userDetail = window.localStorage.getItem("detail-user");
    }
  },
  created() {},
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
    handleTab2Click(e) {
      this.getMemberLableList(e.name);
    },
    async getMemberLableList(type = "0") {
      const userId = this.$route.query.userId;
      if (!userId) return;
      const { currentpage, limit } = this.pageData;
      const res = await Labels.getUserDetailLabelLst(userId, type, {
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
        this.supplyData = [res.data];
      }
    },
    handleSizeChange(val) {
      this.pageData.limit = val;
      this.pageData.page = 1;
      this.getMemberLableList(this.activeName2);
    },
    handleCurrentChange(val) {
      this.pageData.currentpage = val;
      this.getMemberLableList(this.activeName2);
    },
    init() {
      this.fetchData();
    },
    fetchData() {
      this.listLoading = true;
      let params = {
        phone: this.userDetail.phone
      };
      getUserDetail(params).then(response => {
        this.memberList = response.data.dtl;
        this.count = this.memberList.length;
        this.userInfo = response.data.userInfo;
        console.log("userInfo", this.userInfo);

        this.telephones = response.data.telephones;
        this.contactAddress = response.data.contactAddress;
      });
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
    }
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
  }
};
