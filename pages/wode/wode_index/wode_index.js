import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('gree_userInfo')
    console.log(userInfo)
    this.setData({
      userInfo
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法v
  //切换tabbar
  onChange_tabbar: function(e) {
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
  goPage: function(e) {
    let url = e.currentTarget.dataset.item

    if (!url) {
      wx.showToast({
        title: '敬请期待',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }

    wx.navigateTo({
      url,
    })
  },
  //退出登录
  logout: function() {
    const self = this
    wx.showModal({
      title: '提示',
      content: '确定要退出登录？',
      success: async function(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍候...',
            mask: true,
          })
          //ajax登出
          let userInfo = wx.getStorageSync('gree_userInfo')
          requestw({
            url: allApiStr.logoutApi,
            data: {
              token: userInfo.token,
            },
          })
          //本地登出
          wx.removeStorage({
            key: 'gree_userInfo'
          })
          setTimeout(() => {
            wx.hideLoading()
            //跳转到登录页
            wx.reLaunch({
              url: `/pages/login/login`,
            })
          }, 300)
        }
      }
    })
  },
})