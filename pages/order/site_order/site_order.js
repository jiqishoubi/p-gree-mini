const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    // 安装信息
    receiver:'',
    receivePhone:'',
    address:'',

    //结果modal
    showResultModal: false,
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //绑定input
  bindInputChange:function(e){
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //点击下单
  clickOrder: function () {
    const self = this
    wx.showLoading({
      title: '请稍候',
      mask: true,
    })
    setTimeout(function () {
      wx.hideLoading()
      //提交成功
      self.setData({
        showResultModal: true
      })
    }, 800) 
  },
  //点击modal btn
  clickModalBtn: function () {
    this.setData({
      showResultModal: false,
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 200)
  }
})