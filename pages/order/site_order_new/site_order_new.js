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

    departCode: '', //店铺编码
    type: '', //d店铺 s导购员
    saler: null, //导购员的时候

    goodsList: [], //全部商品列表
    //活动
    activityList: [], //全部活动列表
    selectedActivityIndex: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.getStorageSync('gree_userInfo')
    console.log(userInfo)

    this.getActivityList()

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
  //绑定活动picker
  onChangeActivitypicker: function (e) {
    const {
      activityList
    } = this.data
    let index = Number(e.detail.value)
    this.setData({
      selectedActivityIndex: index
    })
  },
  //获取全部活动
  getActivityList: function () {
    return new Promise(async (resolve, reject) => {
      let res = await requestw({
        url: allApiStr.getActivityListApi,
      })
      console.log(res)
      if (res.data.code !== '0') {
        wx.showToast({
          title: '获取活动列表失败，' + res.data.message,
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      }
      this.setData({
        activityList: res.data.data,
        selectedActivityIndex: res.data.data.length == 1 ? 0 : null,
      })
      resolve(res)
    })
  },
})