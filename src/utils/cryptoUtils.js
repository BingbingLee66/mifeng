import CryptoJS from 'crypto-js'

// 加密
var encrypt = function(word, keyStr) {
  keyStr = keyStr ? keyStr : '98kaidivideo2453'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var srcs = CryptoJS.enc.Utf8.parse(word)
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

// 解密
var decrypt = function(word, keyStr) {
  keyStr = keyStr ? keyStr : '98kaidivideo2453'
  var key = CryptoJS.enc.Utf8.parse(keyStr)
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}
export {
  encrypt,
  decrypt
}
