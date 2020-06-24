import regeneratorRuntime from '../utils/runtime' //让小程序支持asyc await
import requestw from '../utils/requestw.js'
import allApiStr from '../utils/allApiStr.js'

//获取最早可预约时间
export const getEarlyestScheduleDateAjax = async () => {
  let res = await requestw({
    url: allApiStr.getEarlyestScheduleDateApi,
  })
  if (res.data && res.data.code == '0' && res.data.data) {
    getApp().globalData.earlyestScheduleDate = res.data.data
  }
}