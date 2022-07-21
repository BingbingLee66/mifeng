
<template>
  <div class="video-wrap">
       
  </div>
</template>
<script>
import { getSts } from '@/api/vod/vod'
import { decrypt } from '@/utils/cryptoUtils'
export default {
  name: 'videoUpLoad',
  data() {
    return {
        file:{}, // 存放视频对象
        videoUploader:null, // 实例化视频上传对象
        sts:{
            accessKeyId:'', //
            accessKeySecret:'',
            region:'', // 上传到视频点播的地域
            secretToken:'',
            cateId:'', // 分类id
            templateGroupId:'', // 指定转码模板组
            userId:'', // 账号ID
            callbackUrl:'', // 回调信息
        }, //配置信息
    }
  }, // 接收父组件的内容

  mounted() {
   
  },
  methods: {
    /**
        * 阿里云上传视频
    */
    async setUploadInfo(file){
        this.file = {}
        this.file = file
        this.onGetSts()
        
    },
    // 获取配置信息
    onGetSts(){
        getSts().then((response) => {
            let data = response.data
            // 解密
            this.sts = {
                accessKeyId: decrypt(data.accessKeyId),
                accessKeySecret: decrypt(data.accessKeySecret),
                secretToken: decrypt(data.securityToken),
                region:decrypt(data.region), // 上传到视频点播的地域
                callbackUrl: decrypt(data.callbackUrl), // 回调接口设置
                cateId: decrypt(data.cateId),  //分类id
                templateGroupId: decrypt(data.templateGroupId), // 指定转码模板组
                userId:decrypt(data.userId), //  账号ID
            }
            this.createUplader()
        })
    },
    createUplader(){
        // 初始化上传对象
        this.initAliyunUpload()
        // 参数文档：https://help.aliyun.com/document_detail/55407.htm?spm=a2c4g.11186623.2.5.ef4eb227Xtdm2R#doc-api-vod-CreateUploadVideo
        var paramsData = {
            Vod: {
                Title: this.file.name, // 视频名字
                CateId: this.sts.cateId, // 分类id
                TemplateGroupId: this.sts.templateGroupId, // 指定转码模板组
                UserData: {
                    MessageCallback: {
                        // 回调接口设置
                        CallbackURL: this.sts.callbackUrl,
                    },
                    Extend :{
                        id: 0,
                        source: 1,
                    },
                 
                },
            },
        }
        // 添加文件和配置
        this.videoUploader.addFile(this.file, '', '', '', JSON.stringify(paramsData))
        // 开始上传
        this.videoUploader.startUpload()
    },
    // 初始化上传
    initAliyunUpload(){
        var self = this
        this.videoUploader = new AliyunUpload.Vod({
            userId:self.sts.userId, // 账号ID
            region:self.sts.region, //上传到视频点播的地域
            partSize: 1048576, //分片大小默认1 MB，不能小于100 KB（100*1024）
            parallel: 5, //并行上传分片个数，默认5
            retryCount: 3, //网络原因失败时，重新上传次数，默认为3
            retryDuration: 2, //网络原因失败时，重新上传间隔时间，默认为2秒
            enableUploadProgress: true, //是否上报上传日志到点播，默认为true
            //开始上传
            'onUploadstarted': function (uploadInfo) {
                // 上传凭证  STS方式
                self.videoUploader.setSTSToken(uploadInfo, self.sts.accessKeyId, self.sts.accessKeySecret, self.sts.secretToken)
            },
            //文件上传成功
            'onUploadSucceed': function (uploadInfo) {
                self.$emit('Succeed',uploadInfo.videoId)
                // console.log('上传成功',uploadInfo)
            },
            //文件上传失败
            'onUploadFailed': function (uploadInfo, code, message) {
                self.$emit('error')
                self.$message.error('上传失败请重试');
                console.log('上传失败',uploadInfo,code,message)
            },
            //文件上传进度，单位：字节
            'onUploadProgress': function (uploadInfo, totalSize, loadedPercent) {
            },
            //上传凭证或STS token超时
            'onUploadTokenExpired': function (uploadInfo) {
                console.log('上传凭证或STS token超时',uploadInfo)           
                // 重新获取STS token，恢复上传  STS方式
                self.videoUploader.resumeUploadWithSTSToken(self.sts.accessKeyId, self.sts.accessKeySecret, self.sts.secretToken)
            },
            //全部文件上传结束
            'onUploadEnd':function(uploadInfo){
                console.log('全部文件上传结束',uploadInfo)
            }
        })
    },

  },
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>

</style>
