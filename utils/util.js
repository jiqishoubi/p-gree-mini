const QR = require('./weapp-qrcode-base64.js') //生成二维码

const isTest = false

const hostObj = {
  dev: {
    host: 'https://greet.bld365.com',
  },
  prod: {
    host: 'https://greeweb.bld365.com'
  },
}

//二维码
export const initQrcodeUrl = (type, code) => {
  return `https://gree.bld365.com?type=${type}&code=${code}`
}






//获取host
export const globalHost = () => {
  if (isTest) {
    return hostObj.dev.host
  } else {
    return hostObj.prod.host
  }
}

/**
 * 格式化日期
 */
// 对Date的扩展，将 Date 转化为指定格式的String   
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
// 例子：   
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18  
export const formatDate = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1, //月份   
    "d+": date.getDate(), //日   
    "h+": date.getHours(), //小时   
    "m+": date.getMinutes(), //分   
    "s+": date.getSeconds(), //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds() //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

//格式化金钱
export const toMoney = (val) => { //数字
  var str = (val / 100 * 100).toFixed(2) + '';
  var intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); //取到整数部分
  var dot = str.substring(str.length, str.indexOf(".")) //取到小数部分搜索
  var ret = intSum + dot;
  return ret;
}

//金钱变回数字number
export const moneyToNum = (str) => { //数字
  if (str) {
    let strTemp = str.replace(",", "")
    return Number(strTemp)
  } else {
    return str
  }
}

//生成base64的二维码url
export const initQrcodeImgUrl = (text) => {
  return new Promise((resolve) => {
    let imgData = QR.drawImg(text, {
      typeNumber: 4,
      errorCorrectLevel: 'M',
      size: 500
    })
    resolve(imgData)
  })
}

//把base64保存在本地
export const saveImgBaseLocal = (imgSrc) => {
  var mng = wx.getFileSystemManager();
  var number = Math.random();
  mng.writeFile({
    filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
    data: imgSrc.slice(22),
    encoding: 'base64',
    success: res => {
      wx.saveImageToPhotosAlbum({
        filePath: wx.env.USER_DATA_PATH + '/pic' + number + '.png',
        success: function (res) {
          wx.showToast({
            title: '保存成功',
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
      console.log(res)
    },
    fail: err => {
      console.log(err)
    }
  })
}