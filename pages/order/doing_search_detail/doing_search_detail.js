import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

const app = getApp()

/**
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
  onLoad: async function(options) {
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
    }, async() => {

      //获取详情
      let res = await requestw({
        url: allApiStr.getPreOrderInfoApi,
        data: {
          orderNo: this.data.order.orderNo
        },
      })
      console.log(res)
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
    //从选择商品页（单选）回来
    if (wx.getStorageSync('from_choose2_single_selectedGoods')) {
      let selectedGoods = wx.getStorageSync('from_choose2_single_selectedGoods')
      let lookingIndex = wx.getStorageSync('from_choose2_single_lookingIndex')

      console.log(selectedGoods, lookingIndex)

      wx.removeStorage({
        key: 'from_choose2_single_selectedGoods'
      })
      wx.removeStorage({
        key: 'from_choose2_single_lookingIndex'
      })

      let {
        order
      } = this.data

      order.goodsList[lookingIndex] = {
        ...order.goodsList[lookingIndex],
        ...selectedGoods,
      }

      this.setData({
        order
      }, () => {
        console.log(this.data.order)
      })
    }
    //从选择商品页（单选）回来 end
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
  //删除商品
  deleteGoods: function(e) {
    const self = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除该商品？',
      success: function(res) {
        if (res.confirm) {
          // on confirm
          let index = e.currentTarget.dataset.index
          let {
            order
          } = self.data
          let goodsList = order.goodsList
          goodsList.splice(index, 1)

          self.setData({
            order: {
              ...order,
              goodsList,
            }
          })
        }
      },
    })
  },
  //点击商品名称 去选择商品
  goChooseGoods: function(e) {
    const {
      order
    } = this.data
    let goods = e.currentTarget.dataset.goods
    let index = e.currentTarget.dataset.index

    console.log(index)

    wx.navigateTo({
      url: `/pages/order/choose2_single/choose2_single?activityCode=${order.activityCode}&selectedGoods=${JSON.stringify(goods)}&lookingIndex=${index}`,
    })
  },
  //点击下单
  clickOrder: function() {
    const {
      order
    } = this.data

    let type = 'PRE_SALE'
    let activityCode = order.activityCode
    let selectedGoodsList = order.goodsList

    wx.navigateTo({
      url: `/pages/order/cart/cart?type=${type}&activityCode=${activityCode}&selectedGoodsList=${JSON.stringify(selectedGoodsList)}`,
    })
  },
})