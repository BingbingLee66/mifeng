/**
 * 遍历Map对象，转成下拉框的options对象数组
 * @param mapArray
 * @returns {{label: *, value: *}[]}
 */
export function getMapDict(mapArray) {
  return [...mapArray].map(([value, label]) => ({ label, value }));
}
// 下载方法
export function downloadByBlob(url, name) {
  const image = new Image();
  image.setAttribute("crossOrigin", "anonymous");
  image.src = url;
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      download(url, name);
      // 用完释放URL对象
      URL.revokeObjectURL(url);
    });
  };
}
/** 下载文件
 * @param {object} config {url:资源路径 title:资源名称(注意携带文件拓展名) 如: 活动报名模板.xlsx}
 */
export async function downloadFile({ url, title }) {
  let a = document.createElement("a");
  a.download = title;
  a.href = url;
  // 做跨域处理
  if (/^http/.test(url)) {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      a.href = URL.createObjectURL(blob);
    } catch (error) {
      message.error(`${title}下载失败`);
      message.error(error);
    }
  }
  a.click();
  a = null;
}

/** 文件预览
 * @param {object} row {url:资源路径 }
 */
export function perviewFile(row) {
  const filetype = ["docx", "doc", "xls", "xlsx", "pdf", "PPT", "ppt", "pptx"];
  const arr = row.url.split(".");
  const type = arr[arr.length - 1];
  let url = "";
  if (filetype.indexOf(type) !== -1) {
    // 使用微软的office online
    url = "http://view.xdocin.com/xdoc?_xdoc=" + row.url;
  } else {
    url = row.url;
  }
  // window.open()居中打开
  const width = 800;
  const height = 600;
  const top = (window.screen.availHeight - height) / 2;
  const left = (window.screen.availWidth - width) / 2;
  window.open(
    url,
    "",
    "width=" + width + ",height=" + height + ",top=" + top + ",left=" + left
  );
}

/**
 * url转化成object拼接样式
 * eg: /api/text/paramParse?id=1&name=张三&age=18  =>  { id: 1, name: '张三', age: 18 }
 * eg: id=1&name=张三&age=18  =>  { id: 1, name: '张三', age: 18 }
 * @param url 需要转化的参数
 */
export function parseUrl(url) {
  if (!url) return {};
  if (url.indexOf("?") !== -1) {
    const params = url.split("?");
    if (params.length <= 1) return {};
    url = params[1];
  }
  const string = url.split("&");
  const res = {};
  for (let i = 0; i < string.length; i++) {
    const str = string[i].split("=");
    if (str[0] !== "") {
      // eslint-disable-next-line prefer-destructuring
      res[str[0]] = str[1];
    }
  }
  return res;
}
