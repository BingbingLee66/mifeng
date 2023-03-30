import axios from "axios";
import { message } from "antd";
import { APP_CODE } from "../config";
import { permission } from "../permission/helpers";
import user from "../user/store.js";

let NODE_ENV = "production";
export const setNodeEnv = (value) => {
  NODE_ENV = value;
};

// 创建 axios 实例
const request = axios.create({
  timeout: 60000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
  const { response, config } = error;
  if (response) {
    if (response.status === 403) {
      message.error("该账号暂无此权限");
    }
    if (response.status === 401) {
      // 401无权限
      user.actions.logout();
    }
    if (config.method !== "get" && /^5/.test(response.status)) {
      message.error("服务正在升级维护，请稍后再试");
    }
  }
  return Promise.reject(error);
};

// 请求拦截器
request.interceptors.request.use((config) => {
  if (NODE_ENV === "development" && /^\/mock/.test(config.url)) {
    config.url = window.origin + config.url;
  }
  // 添加token
  const { token } = user.state;
  if (token) {
    Object.assign(config.headers, {
      "access-token": token,
      // 添加权限标记
      "menu-id": permission.menuId || "",
      "action-id": permission.actionId || "",
    });
    // 请求头添加完置空
    permission.actionId = "";
  }
  // 添加appcode
  Object.assign(config.headers, { appcode: APP_CODE });

  return config;
}, errorHandler);

// 响应拦截器
request.interceptors.response.use((response) => {
  const { data, config } = response;
  if (!config.hiddenError && data.state !== 1) {
    message.error(data.msg);
    return Promise.reject(data);
  } else if (config.method !== "get" && !config.hiddenSuccess) {
    message.success(data.msg);
  }
  return response.data;
}, errorHandler);

export default request;
