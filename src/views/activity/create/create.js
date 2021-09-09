import {
  getAllGoodsList,
  getExplodeGoodsList,
  addExplodeGoods,
  deleteExplodeGoods,
  updateWeights
} from '@/api/mall/mall'
import { getChamberOptions } from '@/api/finance/finance'
import { save, uploadCoverImg } from "@/api/content/article";
import { uploadGoodsImg } from "@/api/goods/goodsSku";

export default {
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!/^([0-9]{0,3})$/.test(value)) {
        return callback(new Error('必须是0-999的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      formObj: {
        name: '', // 活动名称
        pic: '', // 活动头图
        lpic: '', // 活动列表图
        date: '', // 活动时间
        address: 0, // 活动地点
        type: 0, // 报名对象
        num: [], // 参加人数
        intro: '', // 活动介绍
      },
      type: '1',
      previewImgVisible: false,
      previewUrl: '',
      query: {
        ckey: '',
        goodsName: '',
        status: '',
        date: ''
      },
      pageSizes: [10, 20, 50, 100, 500],
      total: 0,
      list: [],
      currentpage: 1,
      limit: 10,
      listLoading: false,
      selectionDatas: [],
      chamberOptions: [],
      showWeightDialog: false,
      showAddDialog: false,
      numberValidateForm: {
        weight: 0
      },
      queryAll: {
        ckey: '', // 商品来源
        goodsName: '', // 商品名称
        goodsId: '', // 商品ID
        status: '', // 商品状态
      },
      allPage: {
        currentpage: 1,
        page: 1,
        pageSize: 100,
        allTotal: 0
      },
      allGoodsIdList: [],
      allList: [],
      weightsForm: {
        weights: null,
        goodsId: null
      },
      weightsFormRules: {
        weights: [
          { required: true, message: '权重不能为空', trigger: 'blur' },
          { validator: checkNumber, trigger: 'blur' }
        ]
      },
      rules: {
        name: [
          { required: true, message: '活动名称不能为空', trigger: 'blur' }
        ],
        pic: [
          { required: true, message: '请上传活动头图', trigger: 'blur' }
        ],
        lpic: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '封面图片必须上传', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // ...mapGetters(['has'])
    chamberName() {
      return function(ckey) {
        let chamberName = ''
        for (let chamber of this.chamberOptions) {
          if (ckey === chamber.value) {
            chamberName = chamber.label
            break
          }
        }
        return chamberName
      }
    }
  },
  created() {
    // this.getChamberOptions()
    // this.fetchData()
  },
  methods: {
    handleClick(tab) {
      this.type = tab.name
      this.fetchData()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.limit = val
      this.currentpage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentpage = val
      this.fetchData()
    },
    has(tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId(tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    getChamberOptions() {
      getChamberOptions().then(response => {
        this.chamberOptions = response.data.data
      })
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'pageSize': this.limit,
        'page': this.currentpage,
        'goodsName': this.query.goodsName,
        'status': this.query.status,
        'ckey': this.query.ckey,
        'type': this.type
      }
      if (this.query.date) {
        params['startTime'] = this.query.date[0]
        params['endTime'] = this.query.date[1]
      }
      getExplodeGoodsList(params).then(res => {
        this.list = res.data.list
        this.total = res.data.totalRows
        this.listLoading = false
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },

    // 获取全部商品列表
    addExplodeGoods() {
      this.queryAll.goodsNam = ''
      this.queryAll.goodsId = ''
      this.queryAll.status = ''
      this.queryAll.ckey = ''
      this.showAddDialog = true
      this.getAllGoodsLists()
    },
    getAllGoodsLists() {
      this.listLoading = true
      let params = {
        'page': this.allPage.page,
        'pageSize': this.allPage.pageSize,
        'goodsName': this.queryAll.goodsName,
        'goodsId': this.queryAll.goodsId,
        'status': this.queryAll.status,
        'ckey': this.queryAll.ckey
      }
      getAllGoodsList(params).then(res => {
        console.log('全部商品列表', res)
        this.allList = res.data.list
        this.allPage.allTotal = res.data.totalRows
        this.listLoading = false
      })
    },
    handleAllSizeChange(val) {
      this.allPage.currentpage = 1
      this.allPage.page = 1
      this.allPage.pageSize = val
      this.getAllGoodsLists()
    },
    handleAllCurrentChange(val) {
      this.allPage.currentpage = val
      this.getAllGoodsLists()
    },
    // 添加爆品
    handleAllSelectionChange(value) {
      let datas = value
      this.allGoodsIdList = []
      for (let data of datas) {
        this.allGoodsIdList.push(data.id)
      }
    },
    addExplode() {
      if (this.allGoodsIdList.length === 0) {
        return this.$message.error('请先选择商品')
      }
      addExplodeGoods(this.allGoodsIdList).then(res => {
        if (res.state === 1) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.getAllGoodsLists()
          this.fetchData()
          this.showAddDialog = false
        }
      })
    },
    // 移除爆品
    delExplode(row) {
      console.log(row)
      let delGoodsId = []
      delGoodsId.push(row.id)
      this.$confirm('', '确定移除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        let params = {
          'id': row.id
        }
        deleteExplodeGoods(delGoodsId).then(res => {
          if (res.state === 1) {
            this.$message({
              message: '移除成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '移除删除'
        })
      })
    },
    // 批量移除
    handleSelectionChange(value) {
      let datas = value
      this.selectionDatas = []
      for (let data of datas) {
        this.selectionDatas.push(data.id)
      }
    },
    delMulExplode() {
      if (this.selectionDatas.length === 0) {
        return this.$message.error('请先选择商品')
      }
      deleteExplodeGoods(this.selectionDatas).then(res => {
        if (res.state === 1) {
          this.fetchData()
        }
      })
    },
    // 修改权重
    openUpdateWeightDialog(row) {
      this.weightsForm.goodsId = row.id
      this.weightsForm.weights = row.weights
      this.showWeightDialog = true
    },
    updateWeight(weightsForm) {
      this.$refs[weightsForm].validate((valid) => {
        if (valid) {
          updateWeights(this.weightsForm).then(response => {
            if (response.state === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.fetchData()
              this.showWeightDialog = false
            }
          })
        } else {
          return false
        }
      })
    },

    // 上传图片校验
    beforeUpload(file) {
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
    },
    // 上传活动头图
    uploadPic(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      console.log(content.file)
      /* uploadGoodsImg(formData).then(response => {
        this.formObj.pic = response.data.filePath
        this.descriptValid = true
      }) */
    },
    // 上传活动头图
    uploadLpic(content) {
      let formData = new FormData()
      formData.append('file', content.file)
      console.log(content.file)
      /* uploadGoodsImg(formData).then(response => {
        this.formObj.pic = response.data.filePath
        this.descriptValid = true
      }) */
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          alert('提交')
        } else {
          return false
        }
      })
    },
  }
}
