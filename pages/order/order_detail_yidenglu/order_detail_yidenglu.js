import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

const app = getApp()

/**
 * 从列表进入的订单详情  已登录
 * options:
 * order
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    oldOrder: null, //传过来的order数据
    order: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // wx.setStorageSync('test_cart', options) //测试用
    // options = wx.getStorageSync('test_cart') //测试用
    if (!options.order) {
      wx.showToast({
        title: '参数缺失，请重新进入',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }

    console.log(JSON.parse(options.order))
    this.setData({
      oldOrder: JSON.parse(options.order),
      order: JSON.parse(options.order),
    })
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
    //从选择商品页面回来
    if (wx.getStorageSync('from_choose2_selectedList')) {
      let selectedList = wx.getStorageSync('from_choose2_selectedList')
      wx.removeStorage({
        key: 'from_choose2_selectedList'
      })

      //处理一下selecedList  count=>goodsCount
      selectedList.forEach((obj) => {
        obj.goodsCount = obj.count
      })

      let {
        order
      } = this.data
      order.goodsList = selectedList
      console.log(order)
      this.setData({
        order
      })
    }
    //从选择商品页面回来 end
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
  //点击商品名称 去选择商品
  goChooseGoods: function (e) {
    const {
      order
    } = this.data

    //处理一下数据
    let selectedGoodsList = order.goodsList.map((obj) => {
      let objTemp = {
        ...obj,
        count: obj.goodsCount,
      }
      return objTemp
    })
    console.log(selectedGoodsList)

    wx.navigateTo({
      url: `/pages/order/choose2/choose2?activityCode=${order.activityCode}&selectedGoodsList=${JSON.stringify(selectedGoodsList)}`,
    })
  },
  //点击下单
  clickOrder: function () {
    const {
      order
    } = this.data

    //验证
    if (order.goodsList.legnth == 0) {
      wx.showToast({
        title: '您未选择商品',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    //跳转
    let typeCart = 'BUSI_USE'
    let activityCode = order.activityCode
    let selectedGoodsList = order.goodsList.map((obj) => {
      let objTemp = {
        ...obj,
        count: obj.goodsCount,
      }
      return objTemp
    })
    let orderObj = order

    //商用下单购物车
    wx.navigateTo({
      url: `/pages/order/cart_busi/cart_busi?type=${typeCart}&activityCode=${activityCode}&selectedGoodsList=${JSON.stringify(selectedGoodsList)}&&orderObj=${JSON.stringify(orderObj)}`,
    })
  },
  //拨打电话
  callPhone: function (e) {
    let phone = e.currentTarget.dataset.phone
    if (!phone) {
      return false
    }
    wx.showModal({
      title: '提示',
      content: `确认拨打电话${phone}？`,
      success: function (res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: phone
          })
        }
      },
    })
  },
})