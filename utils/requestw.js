import {
  globalHost
} from './util.js'

const requestw = ({
  url, //api
  data,
  method = 'post',
  header,
}) => {
  //请求地址
  let urlTemp = ''
  if (url.indexOf(`http:/`) > -1 || url.indexOf(`https:/`) > -1) {
    urlTemp = url
  } else {
    urlTemp = globalHost() + url
  }
  return new Promise((resolve, reject) => {
    console.log(data)
    wx.request({
      method,
      url: urlTemp,
      data,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 需要设置 默认值是application/json
        ...header
      },
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

export default requestw