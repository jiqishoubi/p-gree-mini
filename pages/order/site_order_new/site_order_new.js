import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    //商品信息
    orderNo: '', //销售单号
    // 安装信息
    receiver: '', //收货人
    receivePhone: '', //收货电话
    address: '',
    //附加信息
    billNo: '', //提单号
    remark: '', //备注

    //组件
    //活动类型select
    showActivityTypeSelect: false,
    activityTypeList: [
      {
        text:'1'
      },
      {
        text:'2'
      }
    ],

    //选择城市组件
    showCitypicker: false,
    pickerCityVal: [null, null, null], //数组

    //modal
    //结果modal
    showResultModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getActivityType()
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
  //绑定input
  bindInputChange: function(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //获取活动类型
  getActivityType: async function() {
    let res = await requestw({
      url: allApiStr.getActivityTypeApi,
    })
    console.log(res)
  },
  //活动类型select组件
  onOpenActivityTypeSelect: function() {
    this.setData({
      showActivityTypeSelect: true
    })
  },
  onCloseActivityTypeSelect: function() {
    this.setData({
      showActivityTypeSelect: false
    })
  },
  onChangeActivityTypeSelect: function(e) {
    console.log(e)
  },
  //活动类型select组件 end
  //选择城市组件
  openCitypicker: function() {
    this.setData({
      showCitypicker: true
    })
  },
  closeCitypicker: function(e) {
    console.log(e)
    let arr = e.detail
    this.setData({
      showCitypicker: false,
      pickerCityVal: arr,
    })
  },
  //选择城市组件 end
  //点击下单
  clickOrder: function() {
    const self = this
    wx.showLoading({
      title: '请稍候',
      mask: true,
    })
    setTimeout(function() {
      wx.hideLoading()
      //提交成功
      self.setData({
        showResultModal: true
      })
    }, 800)
  },
  //点击modal btn
  clickModalBtn: function() {
    this.setData({
      showResultModal: false,
    })
    setTimeout(function() {
      wx.navigateBack({
        delta: 1
      })
    }, 200)
  },

})