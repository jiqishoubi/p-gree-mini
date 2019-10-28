import drawQrcode from 'weapp-qrcode' //生成二维码
import {
  initQrcodeUrl
} from '../../../utils/util.js'

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
    }, () => {
      this.initCode()
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //生成二维码
  initCode: function() {
    setTimeout(() => {
      console.log('生成')
      let url = initQrcodeUrl('s', this.data.userInfo.userCode)
      drawQrcode({
        width: 250,
        height: 250,
        canvasId: 'myQrcode',
        text: url,
      })
    }, 20)
  },
  //保存在本地
  saveToLocal: function () {
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    wx.canvasToTempFilePath({
      canvasId: 'myQrcode',
      quality: 0.8,
      success: function (e) {
        console.log(e)
        if (!e.tempFilePath) {
          wx.hideLoading()
        }
        wx.saveImageToPhotosAlbum({
          filePath: e.tempFilePath,
          success: function (e) {
            console.log(e)
            wx.hideLoading()
            wx.showToast({
              title: '操作成功',
              icon: 'none',
              mask: true,
              duration: 1500,
            })
          },
          fail: function () {
            wx.hideLoading()
          }
        })
      },
      fail: function () {
        wx.hideLoading()
      },
    })
  },
})