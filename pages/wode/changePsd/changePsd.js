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

    //form
    oldPassword: '',
    password1: '',
    password2: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //绑定input
  onInputChange: function(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  // 提交
  submit: async function() {
    const self = this
    const {
      oldPassword,
      password1,
      password2,
    } = this.data

    //验证
    if (
      oldPassword == '' ||
      password1 == '' ||
      password2 == ''
    ) {
      wx.showToast({
        title: '账户信息请填写完整',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    if (password1 !== password2) {
      wx.showToast({
        title: '两次输入密码不一致',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    if (oldPassword == password1) {
      wx.showToast({
        title: '新密码与旧密码相同',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    wx.showModal({
      title: '提示',
      content: '是否确认修改密码？',
      success: async function(res) {
        if (res.confirm) {
          // on confirm
          //发送参数
          let postData = {
            oldPassword: oldPassword, //     原密码(非空)
            newPassword: password1, //    新密码(非空)
            newPasswordRetry: password2, //  新密码确认(非空)
          }
          wx.showLoading({
            title: '请稍候...',
            mask: true,
          })
          let res = await requestw({
            url: allApiStr.changePasswordApi,
            data: postData,
          })
          wx.hideLoading()
          console.log(res)

          if (res.data.code !== 0) {
            wx.showToast({
              title: '两次输入密码不一致',
              icon: 'none',
              mask: true,
              duration: 1500,
            })
            return false
          }

          wx.showToast({
            title: '修改密码成功',
            icon: 'none',
            mask: true,
            duration: 1500,
          })
          wx.removeStorage({
            key: 'gree_userInfo'
          })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/login/login'
            })
          }, 1400)
        }
      },
    })
  },
})