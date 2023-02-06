import { getSts } from '@/api/vod/vod'
import { decrypt } from '@/utils/cryptoUtils'
import loadScript from '@/utils/load-script'
export const renderVideo = async (vid, autoplay, vHeight, cover, targetId) => {
  // 引入阿里云播放组件
  if (!window.Aliplayer) {
    await loadScript('https://ysh-cdn.kaidicloud.com/prod/bee/lib/js/aliplayer-min.js')
    await loadScript('https://ysh-cdn.kaidicloud.com/prod/bee/lib/js/aliplayercomponents-1.0.5.min.js')
  }
  const { data } = await getSts()
  const videoPlayer = createPlayer(
    targetId,
    data.accessKeyId,
    data.accessKeySecret,
    data.securityToken,
    data.region,
    vid,
    vHeight,
    cover,
    autoplay
  )
  // videoPlayer.on('ended', e => {})
  return videoPlayer
}
const createPlayer = (
  id,
  accessKeyId,
  accessKeySecret,
  securityToken,
  region,
  vid,
  height = '300px',
  cover,
  autoplay
) => {
  accessKeyId = decrypt(accessKeyId)
  accessKeySecret = decrypt(accessKeySecret)
  securityToken = decrypt(securityToken)
  region = decrypt(region)
  return new Aliplayer({
    id,
    // autoplay: false,  //是否自动播放
    autoplay, // 是否自动播放
    width: '100%',
    height,
    // 支持播放地址播放,此播放优先级最高
    // source,
    // 播放方式四：使用STS方式播放
    vid,
    cover,
    region,
    // vid: '10c0875db475494b891a8fc7f9b259d2',
    accessKeyId,
    accessKeySecret,
    securityToken,
    isLive: false,
    defaultDefinition: 'LD',
    // cover: picUrl,
    controlBarVisibility: 'always',
    components: [
      {
        name: 'RateComponent',
        type: AliPlayerComponent.RateComponent
      }
    ],
    // https://help.aliyun.com/document_detail/62948.html#-
    skinLayout: [
      {
        name: 'bigPlayButton',
        align: 'blabs',
        x: 'calc(50% - 32px)',
        y: '50%'
      },
      {
        name: 'H5Loading',
        align: 'cc'
      },
      {
        name: 'errorDisplay',
        align: 'tlabs',
        x: 0,
        y: 0
      },
      {
        name: 'infoDisplay'
      },
      {
        name: 'tooltip',
        align: 'blabs',
        x: 0,
        y: 56
      }, // 悬浮在按钮上的提示
      {
        name: 'thumbnail'
      },
      {
        name: 'controlBar',
        align: 'blabs',
        x: 0,
        y: 0, // 控制视频的控件
        children: [
          {
            name: 'progress',
            align: 'blabs',
            x: 0,
            y: 44
          }, // 进度
          {
            name: 'playButton',
            align: 'tl',
            x: 15,
            y: 12
          }, // 播放按钮
          {
            name: 'timeDisplay',
            align: 'tl',
            x: 10,
            y: 7
          }, // 时间线
          {
            name: 'fullScreenButton',
            align: 'tr',
            x: 10,
            y: 12
          }, //  全屏按钮按钮
          //  {name:"subtitle", align:"tr",x:5, y:12},                // 字幕
          //  {name:"setting", align:"tr",x:15, y:12},                // 设置
          {
            name: 'volume',
            align: 'tr',
            x: 5,
            y: 10
          }
        ]
      }
    ]
    // components: [{
    //   name: 'ProgressComponent',
    //   type: ProgressComponent
    // }, ]
  })
}
