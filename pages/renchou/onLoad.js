const self = this
let userInfo = wx.getStorageSync('gree_userInfo')
console.log(userInfo)

this.init(
  // 'd', 'DPTSALE001', //店铺
  // 's', 'USRSALETEST', //导购员
  's', userInfo.userCode,
  () => {
    self.addOneSelect()
    //获取数据
    self.getActivityList()
    self.getSalerUserList()
  })