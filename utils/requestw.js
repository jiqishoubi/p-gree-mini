import {
  globalHost
} from './util.js'

const requestw = ({
  url, //api
  data,
  method = 'post',
  header,
}) => {
  //token
  let dataTemp = data
  console.log()
  if (wx.getStorageSync('gree_userInfo')) {
    let userInfo = wx.getStorageSync('gree_userInfo')
    dataTemp = {
      ...dataTemp,
      token: userInfo.token,
    }
  }
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
      data: dataTemp,
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