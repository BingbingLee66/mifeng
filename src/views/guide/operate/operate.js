import {
    getListByRank,getguideSave,getguideDetail
} from '@/api/guide/guide' 
import { getWechatContent,uploadVideo,queryVideo,uploadCoverImg } from '@/api/content/article'
import kdDialog from '@/components/common/kdDialog'
import editorElem from '@/components/wangEditor/index'
import videoComponent from '@/components/video/index'
export default {
    components: {
        kdDialog,
        editorElem,
        videoComponent,
    },
    data() {
      return {
        formObj: {
            title: '',
            menu1Id:'',
            menu2Id:'',
            publishTs:'', // 定时发布时间
            vid:'', // 上传视频Id
            vcover: '',  //视频封面
            sort:'', //权重
            content:'',
            status:1, // 状态,0冻结,1发布,2删除,3平台冻结,4定时发布
        },
        articleUrl:'', // 微信文章链接地址
        detailsId: '', // 编辑id
        rules: {
            title: [
              { required: true, message: '标题不能为空', trigger: 'blur' },
              { min: 2, max: 60, message: '限输入2-60个字的标题', trigger: 'blur' }
            ],
            menu1Id: [
                { required: true, message: '一级菜单不能为空', trigger: 'blur' }
            ],
            menu2Id: [
                { required: true, message: '二级菜单不能为空', trigger: 'blur' }
            ],
            sort: [
                { required: true, message: '请输入权重', trigger: 'blur' }
            ],
        },
        menu1List:[],
        menu2List:[],
        // 上传视频和视频封面
        loading:false,
        //当前预览的图片
        currentImg: '',
        //轮询定时器
        timer:null,
      };
    },
    computed: {

    },
    created() {

    },
    mounted() {
        this.ongetListByRank()
        if (this.$route.params.detailsId) {
            this.detailsId = this.$route.params.detailsId
            this.init()
        }
    },
    methods: {
        // 获取一级菜单 
        ongetListByRank(){
            getListByRank({rank: 1}).then(response => {
                this.menu1List = response.data || []
                this.menu2List = []
            })
        },
        // 选择二级级菜单
        onselectMenu(e){
            this.formObj.menu2Id = ''  
            this.ongetListByTwin(e)
        },
        ongetListByTwin(e){
            getListByRank({rank: 2,menuId:e}).then(response => {
                this.menu2List = response.data || []
            })
        },
        //导入微信文章按钮行为
        importArticle(){
            this.$refs['kdDialog'].show()
        },
        //点击保存导入微信文章行为
        savePopupData(){
            if( this.articleUrl ){
                this.getWechatContentFunc()
            } else {
                this.$message.error('请填写导入微信文章路径');
            }
        },
        //抓取微信文章
        getWechatContentFunc(){
            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255,.5)'
            });
            getWechatContent(this.articleUrl).then(res=>{     
                if( res.state===1 ) {
                    // this.$refs.ckeditor1.init()
                    setTimeout(() => {
                        // this.$refs.ckeditor1.initHtml(res.data.text === null ? '' : res.data.text);
                        this.formObj.content = res.data.text;
                        this.articleUrl = null
                    }, 500)
                    this.$refs['kdDialog'].hide();
                } else {
                    this.$message.error(res.msg);
                    // 请输入微信公众号文章链接
                }
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    loading.close();
                });
            })
        },
        addParentHtml(html){
            this.formObj.content = html
        },
        // 判断是否上传视频
        beforeAvatarUploadVideo(file){
            if (file.type.indexOf('video/') !== -1) { // 视频
            if (file.type !== 'video/mp4') {
                this.$message.error('上传视频只能是 MP4 格式!')
                return false
            }
            // if (file.size > 1024 * 1024 * 30) {
            //   this.$message.error('上传视频大小不能超过 30MB!')
            //   return false
            // }
            } else {
                this.$message.error('不支持的文件格式!');
                return false   
            }
        },
            //上传视频
        uploadVideoFunc(content) {
            this.loading = true;
            let formData = new FormData();
            formData.append('file', content.file);
            uploadVideo(formData, 0).then(res => {
            if (res.code === 200) {
                this.formObj.vid = res.data.videoId;        
                this.timer = setInterval(this.queryVideoFunc, 1000);
            }
            })
        },
        //删除当前视频  图片
        deleteCurrentVideo(index) {
            if(index == 1)  this.formObj.vid = ''
            if(index == 2) this.formObj.vcover = ''
        },
        //查视频动态
        queryVideoFunc(){
            queryVideo(this.formObj.vid).then(res=>{
            if(res.state===1){
                clearInterval(this.timer);
                this.$nextTick(() => {
                this.$refs['videoRef'].show(this.formObj.vid);
                this.loading = false;
                })
            }
            })
        },
        beforeAvatarUpload(file) {
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
        upload(content) {
            let formData = new FormData()
            formData.append('file', content.file)
            uploadCoverImg(formData).then(response => {         
                this.formObj.vcover = response.data.filePath
            })
        },
        //预览
        openPreviewModal(val) {
            this.$refs['look-kdDialog'].show();
            this.currentImg = val;
        },
        // 取消
        closeTab(){
            // 退出当前tab, 打开指定tab
            let openPath = window.localStorage.getItem('operateDetail')
            let tagsViews = this.$store.state.tagsView.visitedViews
            // let selectView = null
            for (let view of tagsViews) {
                if (view.path === this.$route.path) {
                    this.$store.dispatch('tagsView/delView', view).then(() => {
                        this.$router.push({ path: openPath })
                    })
                    break
                }
            }
        },
        // 获取编辑内容
        init(){
            getguideDetail({id:this.detailsId}).then(res =>{
                let data = res.data
                this.formObj = {
                    title: data.title,
                    menu1Id: data.menu1Id,
                    menu2Id: data.menu2Id,
                    publishTs: data.publishTs, 
                    vid: data.vid, 
                    vcover: data.vcover, 
                    sort: data.sort, 
                    content: data.content,
                    status: data.status, 
                } 
                if( data.menu1Id )  this.ongetListByTwin(data.menu1Id)
                if (this.formObj.vid) {
                  this.$nextTick(() => {
                   this.$refs['videoRef'].show(this.formObj.vid)
                 })
               }
            })
        },
        //发布
        saveFunc( ) {
            let formObj = this.formObj
            if(!formObj.vcover) return this.$message.error('请上传视频');
            if(!formObj.vid) return this.$message.error('请上传视频封面');
            if(formObj.status == 4 && !formObj.publishTs) return this.$message.error('请选择定时发布时间');
            // 如果是编辑需要传多个id
            if(this.detailsId) formObj.id = this.detailsId
            if(formObj.status == 1) formObj.publishTs = ''
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    getguideSave(formObj).then(response => {
                    if(response.state===1){
                      this.$message({
                        message: '操作成功',
                        type: 'success'
                      })
                      this.closeTab()
                    }else{
                      this.$message({
                        message: response.msg,
                        type: 'error'
                      })
                    }
                  })
                } else {
                  return false
                }
              })
        },
    },
  };
  