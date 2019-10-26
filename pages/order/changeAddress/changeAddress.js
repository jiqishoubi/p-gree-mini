import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

/**
 * 导购端 订单 修改安装地址
 * options:
 * orderNo  //售后单号
 * oldAddress1 //省份 城市
 * oldAddress2 //详细地址
 */

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    //options
    orderNo: '',
    oldAddress1: '',
    oldAddress2: '',

    address: '',

    //cityPicker
    pickerCityVal: [null, null, null],
    showCitypicker: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderNo: options.orderNo ? options.orderNo : '',
      oldAddress1: options.oldAddress1 ? options.oldAddress1 : '',
      oldAddress2: options.oldAddress2 ? options.oldAddress2 : '',

      address: options.oldAddress2 ? options.oldAddress2 : '',
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
  //绑定input
  onInputChange: function(e) {
    console.log(e)
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //选择城市组件
  openCitypicker: function(e) {
    console.log(e)
    this.setData({
      showCitypicker: true
    })
  },
  closeCitypicker: function(e) {
    let arr = e.detail
    console.log(arr)
    this.setData({
      pickerCityVal: arr,
      showCitypicker: false,
    })
  },
  //点击确认修改
  clickBtn: function() {
    const self = this
    const {
      orderNo,
      oldAddress1,
      oldAddress2,
      pickerCityVal,
      address
    } = this.data

    //验证
    //没修改
    if (!pickerCityVal[0] &&
      address == oldAddress2
    ) {
      wx.showToast({
        title: '您未修改地址信息',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //修改了
    if (address == '') {
      wx.showToast({
        title: '地址请输入完整',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    wx.showModal({
      title: '提示',
      content: '是否确认修改安装地址？',
      success: async function(res) {
        if (res.confirm) {
          // on confirm
          //发送参数
          let postData = {
            orderNo: orderNo, //售后单号
            address,
          }
          if (pickerCityVal[0]) { //修改了城市
            postData.provinceCode = pickerCityVal[0].areaCode
            postData.eparchyCode = pickerCityVal[1].areaCode
            postData.cityCode = pickerCityVal[2].areaCode
          }
          wx.showLoading({
            title: '请稍候...',
            mask: true,
          })
          let res = await requestw({
            url: allApiStr.reserveTimeApi,
            data: postData,
          })
          wx.hideLoading()
          console.log(res)

          if (res.data.code !== '0') {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              mask: true,
              duration: 1500,
            })
            return false
          }

          wx.showToast({
            title: '修改成功',
            icon: 'none',
            mask: true,
            duration: 1500,
          })

          setTimeout(() => {
            wx.navigateBack()
          }, 1400)
        }
      },
    })
  },
})