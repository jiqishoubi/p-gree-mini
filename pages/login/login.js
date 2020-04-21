import regeneratorRuntime from '../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../utils/requestw.js'
import allApiStr from '../../utils/allApiStr.js'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //form
    loginName: '',
    loginPassword: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkLogin()
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //绑定input
  onInputChange: function (e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //登录
  submit: async function () {
    const {
      loginName,
      loginPassword
    } = this.data

    //验证
    if (loginName == '' || loginPassword == '') {
      wx.showToast({
        title: '登录信息请填写完整',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    //登录
    let postData = {
      loginName,
      loginPassword,
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.loginApi,
      data: postData,
    })
    wx.hideLoading()
    console.log(res)

    if (res.data.code !== 0) {
      wx.showToast({
        title: res.data.message,
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }

    let userInfo = {
      token: res.data.data.token,
      ...res.data.data.userInfo,
    }
    wx.setStorageSync('gree_userInfo', userInfo)

    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  //检查登录状态token是否失效
  checkLogin: async function () {
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    if (!wx.getStorageSync('gree_userInfo')) {
      wx.hideLoading()
      return false
    }
    let userInfo = wx.getStorageSync('gree_userInfo')
    console.log(userInfo)
    //尝试获取个人信息
    let res = await requestw({
      url: allApiStr.getUserinfoApi,
      data: {
        token: userInfo.token
      },
    })
    console.log(res)
    wx.hideLoading()

    if (
      res.data.code == 9999 ||
      res.data.code !== 0 ||
      !res.data.data
    ) {
      console.log('登录无效')
      return false
    }

    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})