import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import {
  initQrcodeUrl,
  initQrcodeImgUrl,
  saveImgBaseLocal
} from '../../../utils/util.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},

    qrcodeURL: '',
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
    setTimeout(async() => {
      console.log('生成')
      let url = initQrcodeUrl('d', this.data.userInfo.departCode)

      let imgData = await initQrcodeImgUrl(url)

      this.setData({
        qrcodeURL: imgData
      })
    }, 20)
  },
  //保存在本地
  saveToLocal: function() {
    var imgSrc = this.data.qrcodeURL
    saveImgBaseLocal(imgSrc)
  },
})