import {
  getGlobalContentList,
  save,
  updateStatusPlatform,
  dynamicPagedList,
  checkFile,
  uploadFile,
  editDynamic,
  getChamberList,
  getDynamicDetail,
  uploadVideo,
  queryVideo
} from '@/api/content/article'
import {
  getPromulgator
} from "@/api/user";
import router from '../../../router';
import officialComponent from '../../wxuser/officialManager/components/index'
import editorElem from '@/components/wangEditor/index'
import kdDialog from '@/components/common/kdDialog'
import videoComponent from '@/components/video/index'
import videoUpLoad from '@/components/video/upLoad'
export default {
  components: {
    officialComponent,
    editorElem,
    kdDialog,
    videoComponent,videoUpLoad
  },
  data() {
    return {
      //动态类型 1 图文 2 视频
      type: 1,
      //新增 or 编辑 add update
      mode: 'add',
      //当前动态id
      id: null,
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
        id: null
      },
      //分享上传图片类型 1.微信好友图 2.分享海报图 3.视频封面
      // type: 1,
      //商会list
      chamberList: [],
      //已选商会
      selectChamberList: [],
      //不同步的商会
      noChamberList: [],
      //动态内容
      contentHtml: '',
      //企业id
      companyId: '',
      //当前预览的图片
      currentImg: '',
      //上传视频id
      vid: '',
      //视频封面
      videoDetail: '',
      //文章id
      articleId: '',
      loading: false,
      //轮询定时器
      timer:null,
      //富文本字数
      contentHtmlNumber:0,
      //规划动态字数 视频100  图文2000
      contentNumber:100
    }

  },
  async mounted() {
    console.log('this.$route.params', this.$route.params)
    if (Object.keys(this.$route.params).length > 0) {
      let params = this.$route.params
      this.type = params.type;
      this.mode = params.mode;
      this.id = params.id;
    }
    //如果有id并且mode为update 则为编辑模式
    if (this.id && this.mode === 'update') {
      await this.getDynamicDetailFunc()
    }
    this.contentNumber=this.type===1 ? 2000 :100
    this.getChamberListFunc()
  },
  computed: {},
  created() {
    
  },
  methods: {
    /**行为操作类 */
    async showOfficialComponent() {
      if (this.mode === 'update') {
        return
      }
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

        });
        return;
      }
      this.$refs['OfficialComponent'].show().then(res => {
        this.tableData = res;
        this.getChamberListFunc()
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
          if (file.size > 1024 * 1024 * 30) {
            this.$message.error('上传视频大小不能超过 30MB!')
            return false
          }
        } else {
          this.$message.error('不支持的文件格式!');
          return false   
        }
      }
      //图片才需要校验
      if (file.type.indexOf('image/') !== -1) {
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
      }


    },
    beforeAvatarUploadVideo(file) {
      console.log('content', file)
        if (file.type.indexOf('video/') !== -1) { // 视频
          if (file.type !== 'video/mp4') {
            this.$message.error('上传视频只能是 MP4 格式!')
            return false
          }
          if (file.size > 1024 * 1024 * 30) {
            this.$message.error('上传视频大小不能超过 30MB!')
            return false
          }
        } else {
          this.$message.error('不支持的文件格式!');
          return false   
        }
      },
 
    //点击上次动态图片行为
    clickUpload(content, index, folder, type = 1) {
      let formData = new FormData();
      formData.append('file', content.file);
      this.uploadFileFunc(formData, folder, index, type)
    },
    //预览
    openPreviewModal(val) {
      console.log('val', val)
      this.$refs['kdDialog'].show();
      this.currentImg = val;
    },
    //删除当前上传图片
    deleteCurrentImg(index, folder, type) {
      //splice 试图能更新
      if (folder === 'articleCoverImg') {
        this.gallery.splice(index, 1);
        this.gallery.push('')
      } else if(folder==='share'){
        if (type === 1) {
          this.dynamicExtendDTO.shareFriendPicture = ''
        } else if (type === 2) {
          this.dynamicExtendDTO.sharePoster = ''
        }
      }else if(folder==='video-cover'){
        this.videoDetail=''
      }
       
      
    },
    //删除当前视频
    deleteCurrentVideo() {
      this.vid = ''

    },
    //上传视频
    uploadVideoFunc(content) {
      // 前端上传视频阿里云组件  
      this.loading = true;
      this.$refs.VideoUpLoad.setUploadInfo(content.file)

      // 旧版 通过后端接口上传视频
      // this.loading = true;
      // console.log('content', content)
      // let formData = new FormData();
      // formData.append('file', content.file);
      // const self = this;
      // uploadVideo(formData, this.mode === 'add' ? 0 : this.articleId).then(res => {
      //   if (res.code === 200) {

      //     // this.vid='4fa4d6d08c0a41a6b6168428326cae8e'
      //     this.vid = res.data.videoId;        
      //     this.timer = setInterval(this.queryVideoFunc, 1000);
      //     // setTimeout(() => {
      //     //   this.$nextTick(() => {

      //     //     this.$refs['videoRef'].show(this.vid);
      //     //     this.loading = false;
      //     //   })
      //     // }, 6000);
      //   }
      // })
    },
    // 上传成功 回调
    onSucceed(vid){
      this.vid = vid
      // 上传成功轮询接口 查看是否转码成功
      this.timer = setInterval(this.queryVideoFunc, 1000);
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
          } else if (folder === 'video-cover') {
            this.videoDetail = res.data;
          }

        }
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
    handleClose(tag, index) {
      //从已选商会删除
      this.selectChamberList.splice(index, 1);
      //从不同步商会新增
      this.noChamberList.splice(-1, 0, tag)
    },
    //添加已选商会
    addSelectChamber(tag, index) {
      this.selectChamberList.splice(-1, 0, tag);
      this.noChamberList.splice(index, 1);
    },
    //提交表单
    submitForm() {
      //两种规则：新增 编辑，两种类型 ：图文 
      let result = this.verifyForm()
      if (!result) {
        return;
      };
      let chamberIds = [];
      this.selectChamberList.forEach(item => {
        chamberIds.push(item.id)
      })
      let arr= this.handleNullDelete()
      let params = {
        dynamicExtendDTO: this.dynamicExtendDTO,
        dynamicReq: {
          chamberIds: chamberIds,
          companyId: this.type === 1 ? null : this.companyId,
          contentHtml: this.contentHtml,
          contentType: this.type,
          type: chamberIds.length > 0 ? 7 : 6,
          urlArr: arr,
          vid: this.vid,
          id:this.articleId
        }
      }
      params.dynamicExtendDTO.wxUserId = this.tableData[0].wxUserId;
      console.log('params', params)
      editDynamic(params).then(res => {
        if (res.state === 1) {
          this.$message.success('提交成功');
          this.resetForm()
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //点击取消表单按钮
    resetForm() {
      router.push({
        name: '编辑台',
        params: {
          activeName:'2',
        }
      })
    },
    /**工具类 */
    //去除表单空元素
    handleNullDelete() {
      let arr=this.type === 1 ? this.gallery : [this.videoDetail];
      if (arr.length < 1) {
        return []
      };
      let r = arr.filter(function (s) {
        return s && s.trim();
      });
      return r
    },
    //校验表单
    verifyForm() {
      let tableData = this.tableData;
      if (tableData.length < 1) {
        this.$message.error('请填写发布者!');
        return false;
      }
      if(this.contentHtmlNumber>this.contentNumber){
        this.$message.error(`内容超出${this.contentNumber}字!`);
        return false;
       }
      if (this.type === 1) {
       let arr= this.handleNullDelete();
      
        if(this.contentHtml ||arr.length>0){
          return true;
        }else{
          this.$message.error('图片或者内容不能为空!');
          return false;
        }
        
      } else {
        if (!this.vid) {
          this.$message.error('请上传视频!');
          return false;
        }
      }
      return true;
    },
    //剔除已同步的商会
    handleNoChamberListFunc() {
      let chamberList = this.chamberList;
      let _selectChamberList = this.selectChamberList;

      chamberList.forEach((item, index) => {
        _selectChamberList.forEach((item2, index2) => {
          if (item.id === item2.id) {
            this.chamberList.splice(index, 1);
          }
        })
      })
      this.noChamberList = JSON.parse(JSON.stringify(this.chamberList));
    },
    //编辑是给图片数组赋空值
    handleGallery() {
      let gallery = this.gallery;
      for (let i = 0; i < 9; i++) {
        if (gallery[i]) {} else {
          gallery.splice(i, 1, '')
        }
      }
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
    //flag 是否需要剔除功能 false 不需要 true需要
    async getChamberListFunc(flag = false) {
      let wxUserId = null
      if (this.tableData.length > 0) {
        wxUserId = this.tableData[0].wxUserId
      }
      await getChamberList(wxUserId).then(res => {
        if (res.state === 1) {
          this.chamberList = res.data;
          this.noChamberList = res.data;
          if (flag) {
            this.handleNoChamberListFunc()
          }
        }
      })
    },
    //拉取动态详情
    async getDynamicDetailFunc() {
      await getDynamicDetail(this.id).then(res => {
        if (res.state === 1) {
          let data = res.data;
          //已选商会
          this.selectChamberList = data.chamberVOList;
          //已选发布者
          this.tableData = [data.dynamicWxUserVO];
          this.dynamicExtendDTO = data.dynamicExtendVO;
          this.contentHtml = data.articleDetailResp.contentHtml;
          this.gallery = data.articleDetailResp.urlArr;
          this.articleId = data.articleDetailResp.id;
          this.vid = data.articleDetailResp.vid;
          if (data.articleDetailResp.urlArr) {
            this.videoDetail = this.mode === 'update' ? data.articleDetailResp.urlArr[0] : ''
          }
          if(this.type===2 && this.mode==='update'){
              this.$nextTick(() => {

              this.$refs['videoRef'].show(this.vid);
              this.loading = false;
            })
          }
          this.getChamberListFunc(true);
          this.handleGallery()
          // this.handleNoChamberListFunc()

        }
      })
    },
    //查视频动态
    queryVideoFunc(){
      queryVideo(this.vid).then(res=>{
        if(res.state===1){
          clearInterval(this.timer);
          this.$nextTick(() => {
            this.$refs['videoRef'].show(this.vid);
            this.loading = false;
          })
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
      this.contentHtml = event
    },
    //字数
    textNumber(val){
      this.contentHtmlNumber=val.length
    }
  }
}
