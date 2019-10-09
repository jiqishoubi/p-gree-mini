// pages/wode/wode_index/wode_index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法v
  //切换tabbar
  onChange_tabbar: function (e) {
    let index = e.detail
    switch (index) {
      case 0:
        wx.redirectTo({
          url: '/pages/index/index',
        })
        break
      case 1:
        wx.redirectTo({
          url: '/pages/statistics/statistics_index/statistics_index',
        })
        break
      case 2:
        wx.redirectTo({
          url: '/pages/order/order_index/order_index',
        })
        break
      case 3:
        wx.redirectTo({
          url: '/pages/wode/wode_index/wode_index',
        })
        break
    }
  },
  //导航
  goPage: function (e) {
    let url = e.currentTarget.dataset.item
    console.log(url)
    wx.navigateTo({
      url,
    })
  }
})