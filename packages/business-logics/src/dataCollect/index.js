import qianxing from "@qianxing/sdk-js";
import diting from "@diting/sdk-js";

// 模块配置
const Setting = {
  Config: {
    close: false,
  },
  Content: {
    close: false,
  },
  Activity: {
    close: false,
  },
  FestivalPoster: {
    close: false,
  },
};

const Config = {
  close: Setting.Config.close,
  // 初始化
  init() {
    try {
      if (this.close) return;
      qianxing.init(qianxing.Terminals.BROWSER);
      diting.init({
        project_id: "ysh",
        server_url: `${process.env.VUE_APP_DITING_URL}/v2/sa.gif?project=ysh&platform=web`,
        send_type: "image",
        expose_track: false,
        is_track_single_page: false,
        auto_track: false,
        page_leave: false,
      });
    } catch (error) {
      console.log(error);
    }
  },
};

const Content = {
  close: Setting.Content.close,
  // 内容创建
  create({ store }) {
    if (this.close) return;
    track("content_create", store, {
      $project_id: "ysh",
      $page_id: "content_manager",
      $widget_id: "content_create",
    });
  },

  // 内容发布
  publish({ store, content }) {
    if (this.close || !content) return;
    // content: { id, title }
    track("content_publish", store, {
      $project_id: "ysh",
      $page_id: "content_edit",
      $widget_id: "content_publish",
      content_id: content.id,
      content_title: content.title,
    });
  },
};

const Activity = {
  close: Setting.Activity.close,
  // 活动创建
  create({ store }) {
    if (this.close) return;
    track("activity_create", store, {
      $project_id: "ysh",
      $page_id: "activity_edit",
      $widget_id: "activity_create",
    });
  },

  // 活动发布
  publish({ store, activity }) {
    if (this.close || !activity) return;
    // activity: { id, title }
    track("activity_publish", store, {
      $project_id: "ysh",
      $page_id: "activity_edit",
      $widget_id: "activity_publish",
      activity_id: activity.id,
      activity_title: activity.title,
    });
  },

  // 活动存草稿
  saveDraft({ store, activity }) {
    if (this.close || !activity) return;
    // activity: { id, title }
    track("activity_save_draft", store, {
      $project_id: "ysh",
      $page_id: "activity_edit",
      $widget_id: "activity_save_draft",
      activity_id: activity.id,
      activity_title: activity.title,
    });
  },
};

const FestivalPoster = {
  close: Setting.FestivalPoster.close,
  // 节日海报创建
  create({ store }) {
    if (this.close) return;
    track("poster_create", store, {
      $project_id: "ysh",
      $page_id: "poster_manager",
      $widget_id: "poster_create",
    });
  },

  // 节日海报发布
  publish({ store, poster }) {
    if (this.close || !poster) return;
    // poster: { id, title }
    track("poster_publish", store, {
      $project_id: "ysh",
      $page_id: "poster_create",
      $widget_id: "poster_share",
      poster_id: poster.id,
      poster_title: poster.title,
    });
  },
};

// 上报事件
function track(event, store, properties) {
  try {
    diting.track(event, Object.assign(commonProperties(store), properties));
  } catch (error) {
    console.log(error);
  }
}

// 公共属性
function commonProperties(store) {
  return {
    chamber_id: store.state.user.ckey,
    chamber_name: store.state.user.chambername,
    userid: store.state.user.id,
    mobile_number: store.state.user.mobilenumber,
  };
}

// 数据采集
export const DataCollect = {
  Config,
  Content,
  Activity,
  FestivalPoster,
};
