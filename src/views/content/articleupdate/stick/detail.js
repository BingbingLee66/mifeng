import {
  chamberTopList,
  updateChamberTop
} from '@/api/content/article'
import { updateColumnLevel} from '@/api/content/columnsetup'
import
kdDialog
from '@/components/common/kdDialog'
export default {
  components: {
    'kd-dialog': kdDialog
  },
  data() {
    var checkLevel = (rule, value, callback) => {
      if (!/^([0-9]\d*)$/.test(value)) {
        return callback(new Error('权重范围：0-999'))
      } else if (value > 999) {
        return callback(new Error('权重范围：0-999'))
      } else {
        callback()
      }
    }
    return {
      ckey: '',
      //权重rule
      levelRules: {
        level: [{
            required: true,
            message: '权重不能为空',
            trigger: 'blur'
          },
          {
            validator: checkLevel,
            trigger: 'blur'
          }
        ],
      },
      //权重对象
      levelForm: {
        level: ""
      },
      list:[]
    }
  },
  mounted() {

  },
  computed: {},
  created() {
    this.ckey = this.$store.getters.ckey;
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.chamberTopListFunc()
    },
    //拉取置顶列表
    chamberTopListFunc() {
      chamberTopList(this.ckey).then(res => {
        if (res.state === 1) {
          this.list = res.data
        }
      })
    },
     //设置权重
     setLevel(row) {
      this.currentId = row.id;
      this.$refs['levelDialog'].show()
    },
     //保存权重数据
     savePopupData(){
      this.$refs['levelForm'].validate((valid) => {
        if (valid) {
          //发请求
          updateColumnLevel({
            id: this.currentId,
            level: this.levelForm.level
          }).then(res => {
            if (res.state === 1) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              this.fetchData()
            }
          })
          //操作
          this.$refs['levelDialog'].hide();
          this.$refs['levelForm'].resetFields();
        } else {
          return false;
        }
      });
    },
      //update置顶
    updateTop(row) {
      console.log('row', row);
      let params = {
        articleId: row.id,
        ckey: row.ckey,
        //这里统一都是传0
        type: 0
      }
      updateChamberTop(params).then(res => {
        if(res.state===1){
          this.$message({
            message: res.msg,
            type: 'success'
          })
        }else{
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.fetchData()
      })
    }
  }
}
