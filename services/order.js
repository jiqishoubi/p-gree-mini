import regeneratorRuntime from '../utils/runtime' //让小程序支持asyc await
import requestw from '../utils/requestw.js'
import allApiStr from '../utils/allApiStr.js'

//申请退单
export const applyCancelOrderAjax = (params) => {
  return new Promise(async (resolve) => {
    requestw({
      url: allApiStr.applyCancelOrderApi,
      data: params
    }).then((res) => {
      if (res.data.code !== '0') {
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        resolve(false)
        return false
      }
      //成功
      resolve(true)
    })
  })
}