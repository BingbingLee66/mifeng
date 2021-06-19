import { getGoods } from '@/api/goods/goods'
// import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      previewImgVisible: false,
      previewUrl: '',
      detailObj: {},
      goodsId: ''
    }
  },
  computed: {
    // ...mapGetters(['has'])
  },
  created() {
    if (this.$route.params.goodsId) {
      this.goodsId = this.$route.params.goodsId
      this.init()
    }
  },
  methods: {
    has (tabName, actionName) {
      return this.$store.getters.has({ tabName, actionName })
    },
    getId (tabName, actionName) {
      return this.$store.getters.getId({ tabName, actionName })
    },
    init() {
      this.fetchData()
    },
    fetchData() {
      this.listLoading = true
      let params = {
        'id': this.goodsId
      }
      getGoods(params).then(response => {
        this.detailObj = response.data.good
      })
    },
    openPreviewModal (url) {
      this.previewImgVisible = true
      this.previewUrl = url
    }
  }
}
