import {
  globalHost
} from './util.js'

const requestw = ({
  url, //api
  data,
  method = 'post',
  header,
}) => {
  //data token
  for (let key in data) {
    if (
      data[key] === undefined ||
      data[key] === null
    ) {
      delete data[key]
    }
  }
  let dataTemp = data
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
    wx.request({
      method,
      url: urlTemp,
      data: dataTemp,
      header: {
        'content-type': 'application/x-www-form-urlencoded', // 需要设置 默认值是application/json
        ...header
      },
      success: function(res) {
        // //登录失效
        // if (res.data.code == 9999 && res.data.message.indexOf('无效') > -1) {
        //   wx.showToast({
        //     title: '登录失效，请重新登录',
        //     icon: 'none',
        //     mask: true,
        //     duration: 1500,
        //   })
        //   wx.redirectTo({
        //     url: '/pages/login/login',
        //   })
        // }
        // //登录失效 end
        resolve(res)
      },
      fail: function(err) {
        reject(err)
      }
    })
  })
}

export default requestw