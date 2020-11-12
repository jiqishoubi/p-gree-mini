/**
 * localStorage:
 * gree_userInfo
 */
import { getEarlyestScheduleDateAjax } from './services/common';
import { formatDate } from './utils/util'

App({
  globalData: {
    isX: false,
    earlyestScheduleDate: formatDate(new Date(), 'yyyy-MM-dd'), //最早可预约时间
    //2020.11.12
    toTransferArr: [], //待转销售池 //每个都带着一个 my_postData 属性
  },
  onLaunch: function () {
    //isX
    let system = wx.getSystemInfoSync();
    if (
      system.model.indexOf("iPhone X") > -1 ||
      system.model.indexOf("iPhone XS") > -1 ||
      system.model.indexOf("iPhone XR") > -1
    ) {
      this.globalData.isX = true
    }
    //isX end

    //检查小程序版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            updateManager.applyUpdate()
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线，请您删除当前小程序，重新搜索打开'
            })
          })
        }
      })
    }
    //检查小程序版本更新 end
  },
  onShow() {
    getEarlyestScheduleDateAjax()
  }
})