import SlsTracker from '@aliyun-sls/web-track-browser'

const opts = {
  host: process.env.VUE_APP_SLS_HOST,
  project: process.env.VUE_APP_SLS_PROJECT,
  logstore: process.env.VUE_APP_SLS_LOGSTORE,
  time: 10,
  count: 10,
  topic: 'CHAMBER_STATS',
  source: 'YSH-ADMIN',
}
const tracker = new SlsTracker(opts)

export default tracker
