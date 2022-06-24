import { getguideDetail,getsaveLog} from '@/api/guide/guide' 
import videoComponent from '@/components/video/index'
export default {
  components: {
    videoComponent
  },
  data() {
    return {
      detailObj: {},
      detailsId: '',
    }
  },
  mounted () {
    this.detailsId = this.$route.params.detailsId
    this.init()
    this.ongetsaveLog()
  },
  computed: {
  },
  created () {
  },
  methods: {
    // 保存访问操作指引记录
    ongetsaveLog(){
      let params = {
        ogid: this.detailsId
      }
      getsaveLog(params).then(response => {
        console.log(response)
      })
    },
    init () {
      this.fetchData()
    },
    fetchData () {
      let params = {
        id: this.detailsId
      }
      getguideDetail(params).then(response => {
        this.detailObj = response.data || []
        if(response.data.vid)this.$refs['videoRef'].show(response.data.vid)
      })
    }
  }
}
