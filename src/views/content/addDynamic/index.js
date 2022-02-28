import {
  getGlobalContentList,
  save,
  updateStatusPlatform,
  dynamicPagedList,
  checkFile,
  uploadFile,
  editDynamic,
  getChamberList
} from '@/api/content/article'
import {
  getPromulgator
} from "@/api/user";
import router from '../../../router';
import officialComponent from '../../wxuser/officialManager/components/index'
import editorElem from '@/components/wangEditor/index'
import kdDialog from '@/components/common/kdDialog'
export default {
  components: {
    officialComponent,
    editorElem,
    kdDialog
  },
  data() {
    return {
      //动态类型 1 图文 2 视频
      type: 1,
      //新增 or 编辑 add update
      mode: 'add',
      //已选发布者
      tableData: [],
      //动态列表图
      gallery: ['', '', '', '', '', '', '', '', ''],
      //最大限制
      galleryLimit: 9,
      showPost: false,
      //预览列表
      previewList: [],
      //动态分享信息
      dynamicExtendDTO: {
        shareTitle: '',
        //分享微信好友图
        shareFriendPicture: '',
        //分享海报图
        sharePoster: '',
        //分享扩展字段id(新增传null，修改传返回的id)
        id:null
      },
      //分享上传图片类型 1.微信好友图 2.分享海报图
      type: 1,
      //商会list
      chamberList:[{name:'1',ckey:'111',id:'1'}],
      //已选商会
      selectChamberList:[{name:'1',ckey:'111',id:'1'}],
      //不同步的商会
      noChamberList:[{name:'1',ckey:'111',id:'1'}],
    }

  },
  mounted() {},
  computed: {},
  created() {
this.getChamberListFunc()
  },
  methods: {
    /**行为操作类 */
    async showOfficialComponent() {
      let re = await this.getPromulgatorFunc();
      if (re < 1) {
        this.$confirm(
          `无符合条件的用户`,
          "添加发布者", {
            confirmButtonText: "去添加",
            // cancelButtonText: "取消",
            showCancelButton: false,
            center: true
          }
        ).then(() => {
          router.push({
            name: '官方号管理'
          })
          console.log("then");

        });
        return;
      }
      this.$refs['OfficialComponent'].show().then(res => {
        this.tableData = res;
        this.getChamberListFunc()
        console.log('res', res)
      })
    },
    beforeAvatarUpload(file) {
      console.log('content', file)
      // let result = await this.checkFileFunc(content);
      // console.log('result',result)
      // if (!result) {
      //   this.$message.error('上传图片不合规');
      //   return false
      // }
      const reg = new RegExp('^/.jpg|.jpeg|.gif|.png/$')
      if (reg.test(file.name)) {
        this.$message.error('不支持的文件格式!');
        return false
      } else {
        if (file.type.indexOf('image/') !== -1) { // 图片
          if (file.type !== 'image/jpeg' &&
            file.type !== 'image/jpg' &&
            file.type !== 'image/gif' &&
            file.type !== 'image/png') {
            this.$message.error('上传图片只能是 JPG 或 PNG或gif 格式!')
            return false
          }
          if (file.size > 1024 * 1024 * 2) {
            this.$message.error('上传图片大小不能超过 2MB!')
            return false
          }
        } else if (file.type.indexOf('video/') !== -1) { // 视频
          if (file.type !== 'video/mp4') {
            this.$message.error('上传视频只能是 MP4 格式!')
            return false
          }
          if (file.size > 1024 * 1024 * 200) {
            this.$message.error('上传视频大小不能超过 200MB!')
            return false
          }
        } else {
          this.$message.error('不支持的文件格式!');
          return false
        }
      }
      return new Promise((resolve, reject) => {
        // console.log('file',file);
        let formData = new FormData();
        // console.log('formData',formData)
        formData.append('file', file);
        checkFile(formData).then(res => {
          //校验合规
          // console.log('res',res)
          if (res.state === 1) {
            resolve()
          } else {
            this.$message.error('上传图片不合规')

            reject()
          }
        })
      })

    },
    //点击上次动态图片行为
    clickUpload(content, index, folder, type = 1) {
      // console.log('content',content);
      let formData = new FormData();
      formData.append('file', content.file);
      // console.log('formData',formData)
      this.uploadFileFunc(formData, folder, index, type)
    },
    //预览
    openPreviewModal(val) {
      // this.previewList[val];
      this.$refs['kdDialog'].show()
    },
    //删除当前上传图片
    deleteCurrentImg(index, folder, type) {
      //splice 试图能更新
      if (folder === 'articleCoverImg') {
        this.gallery.splice(index, 1);
        this.gallery.push('')
      } else {
        if (type === 1) {
          this.dynamicExtendDTO.shareFriendPicture = ''
        } else if (type === 2) {
          this.dynamicExtendDTO.sharePoster = ''
        }
      }

    },
    uploadFileFunc(formData, folder, index, type = 1) {
      // console.log('formData',formData)
      console.log('index', index);
      console.log('folder', folder)
      uploadFile(formData, folder).then(res => {
        if (res.state === 1) {
          if (folder === 'articleCoverImg') {
            this.gallery.splice(index, 1, res.data);
          } else if (folder === 'share') {
            if (type === 1) {
              //分享微信好友图
              this.dynamicExtendDTO.shareFriendPicture = res.data
            } else if (type === 2) {
              //分享海报图
              this.dynamicExtendDTO.sharePoster = res.data
            }
          }

        }

        // if (this.gallery.length === this.galleryLimit) {
        //   // 上传达到限制不添加
        // }
        //  else {
        //   this.gallery.push('')
        // }

      })

    },
    //移除发布者
    deleteUser() {
      console.log('delete')
      this.$confirm(
        `确认移除所选发布者吗？`,
        "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        }
      ).then(() => {
        this.tableData = []
      });
    },
    //移除已选商会
    handleClose(tag,index){
      //从已选商会删除
      this.selectChamberList.splice(index,1);
      //从不同步商会新增
      this.noChamberList.splice(-1,0,tag)
      console.log('tag',tag)
    },
    //提交表单
    submitForm(){
      //两种规则：新增 编辑，两种类型 ：图文 
      let result =this.verifyForm()
      if(!result){return;}
      let params={
        dynamicExtendDTO:this.dynamicExtendDTO
      }
      dynamicExtendDTO.wxUserId=this.tableData[0].id
      editDynamic().then(res=>{
        if(res.state===1){
          this.$message.success('提交成功');
        }else{
          this.$message.error(res.msg);
        }
      })
      // if(mode==='add'){

      // }else{

      // }

    },
    /**工具类 */
    verifyForm(){
      let tableData=this.tableData;
      if(tableData.length<1){
        this.$message.error('请填写发布者!');
        return false;
      }
      return true;
    },
    /**
     * 请求类
     */
    getPromulgatorFunc() {
      return new Promise((resolve, reject) => {
        getPromulgator({
          chamberId: "",
          page: 1,
          pageSize: 10,
          phone: "",
          uName: "",
          wxUserId: "",
        }).then(res => {
          if (res.state === 1) {
            resolve(res.data.totalRows)
          }
          resolve(0)
        })
      })

    },
    getChamberListFunc(){
      let wxUserId=null
      if(this.tableData.length>0){
        wxUserId=this.tableData[0].id
      }
      getChamberList(wxUserId).then(res=>{
        if(res.state===1){

        }

      })
    },
    //校验图片是否合规
    checkFileFunc(file) {
      return;
      let formData = new FormData();
      console.log('formData', formData)
      formData.append('file', file);
      return new Promise((resolve, reject) => {
        checkFile(formData).then(res => {
          //校验合规
          if (res.state === 1) {
            resolve(1)
          } else {
            resolve(0)
          }
        }).catch(err => {
          resolve(0)
        })
      })

    },
    /**监听类
     * 
     */
    //富文本变化
    addParentHtml(event) {
      console.log('event', event)
    }
  }
}
