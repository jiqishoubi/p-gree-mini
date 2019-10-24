/**
 * localStorage:
 * gree_userInfo
 */
App({
  globalData: {
    isX: false,
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
  },
}) 