export function jumpOldYSH(path) {
  const { VUE_APP_BASE_URL, VUE_APP_BUILD_ENV } = process.env
  const isProd = VUE_APP_BUILD_ENV === 'production'
  window.location.href = `${isProd ? `https://scrm.kaidicloud.com/#${path}` : `${VUE_APP_BASE_URL}/ecadmin/#${path}`}`
}
