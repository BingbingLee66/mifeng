<template>
  <div>
    <el-dialog title="详情" :visible.sync="detailVisible" width="50%">
      <div slot="title" class="header-title">
                    <span class="title-name">添加栏目 </span>
               
      </div>    
    <el-form ref="form" :model="formObj" :rules="rules" label-position="right" label-width="100px">
        <el-row>
          <el-col :offset="2" :span="20">
            <el-form-item label="栏目名称：" prop="columnName">
              <el-input v-model="formObj.columnName" maxLength="100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :offset="2" :span="20">
            <el-form-item label="排序：" prop="level">
              <el-input v-model="formObj.level"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-col :offset="4" :span="16">
            <el-button type="primary" v-dbClick @click="save">保存</el-button>
            <el-button @click.native="visible = false">取消</el-button>
          </el-col>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { save } from '@/api/content/columnsetup'
export default {
  props: ["title"],
  data() {
    var checkNumber = (rule, value, callback) => {
      if (!/^([1-9]\d*)$/.test(value)) {
        return callback(new Error('必须是大于0的整数'))
      } else {
        callback() // 必须加上这个，不然一直塞在验证状态
      }
    }
    return {
      //状态
      reject: null,
      reslove: null,
      detailVisible: false,
     formObj:{
       columnName:null,
       level:null, 
     },
      activeName: '3',
     rules:{
        columnName: [
            { required: true, message: '请输入栏目名称', trigger: 'blur' },
          
          ],
          level: [
            { required: true, message: '请选择排序', trigger: 'blur' },
             { validator: checkNumber, trigger: 'change' }
          ],
     },
    };
  },
  methods: {
    //打开
    open(item) {
      const self = this;
      return new Promise((reslove, reject) => {
        this.reslove = reslove;
        this.reject = reject;
        this.activeName=item
        this.show();
      });
    },
    save(){
      let self=this;
this.$refs['form'].validate((valid=>{
    if (valid) {
      this.formObj['ckey'] = this.$store.getters.ckey;
      this.formObj['contentModuleId'] = this.activeName
             save(this.formObj).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            self.reslove();
            self.close()
            // this.fetchData()
            // this.visible = false
          })
          } else {
            console.log('error submit!!');
            return false;
          }
}))
    },
    //展示
    show() {
      this.detailVisible = true;
    },
    //关闭
    close() {
      this.detailVisible = false;
      this.reject = null;
      this.reslove = null;
    },
    //通过
    approved() {
      this.$emit("monitorPassFunc");
      //异步请求添加
    },
    //驳回
    rejectRemark() {
      this.$emit("monitorRefusal");
    },
  },
};
</script>
<style lang="scss" scoped>
.audit-result-view {
  margin-left: 50px;

  .linemargin {
    margin-bottom: 5px;
  }
}

.th_title {
  width: 100px;
}

table {
  th,
  td {
    height: 45px;
    line-height: 45px;
    border: 1px solid #ccc;
    text-align: center;
    min-width: 100px;
  }

  th {
    background: #ccc;
  }

  width: 90%;
  margin: 10px auto;
  border-collapse: collapse; /*合并内外边距*/
}

/deep/ .el-dialog__header {
  border-bottom: 1px solid #e6e6e6;
  margin: 0 30px;
  padding: 20px 0 !important;
}

.header-title {
  .title-name {
    color: #4d82f3;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
  }
}

.updateImg {
  width: 50px;
  height: 50px;
  vertical-align: middle;
}
</style>
