/** 
 * 转销售 搜索
 */
import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import { getGlobalData, setGlobalData } from '../../../utils/util.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    toTransferArr: [],
    //成功modal
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
    let toTransferArr = getGlobalData('toTransferArr')
    console.log(toTransferArr)
    this.setData({
      toTransferArr,
    })
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
    setGlobalData('toTransferArr', [])
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //去订单详情
  goOrderDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/order/doing_search_detail/doing_search_detail?order=${JSON.stringify(item)}&isForConfirm=1`,
    })
  },
  goDoSearch() {
    wx.navigateTo({
      url: `/pages/order/doing_search/doing_search`,
    })
  },
  deleteOrder: function (e) {
    let item = e.currentTarget.dataset.item
    let toTransferArr = getGlobalData('toTransferArr')
    for (let i = 0; i < toTransferArr.length; i++) {
      if (toTransferArr[i].orderNo == item.orderNo) {
        toTransferArr.splice(i, 1)
        break
      }
    }
    setGlobalData('toTransferArr', toTransferArr)
    this.setData({
      toTransferArr: getGlobalData('toTransferArr')
    })
  },
  submit: function () {
    const self = this
    //验证
    let toTransferArr = getGlobalData('toTransferArr')
    console.log(toTransferArr)
    //是否添加
    if (toTransferArr.length == 0) {
      wx.showToast({
        title: '请添加订单',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    //是否转销售
    let flag = true
    for (let i = 0; i < toTransferArr.length; i++) {
      if (!toTransferArr[i].my_postData) {
        flag = false
        break
      }
    }
    if (!flag) {
      wx.showToast({
        title: '请确认以上订单信息已经全部确认完毕,才能提交',
        icon: 'none',
        duration: 1500,
      })
      return
    }
    //验证 end

    wx.showModal({
      title: '提示',
      content: '确认提交？',
      success: async function (e) {
        if (e.confirm) {
          let tradeJsonArr = toTransferArr.map((item) => item.my_postData)
          let postData = {
            tradeJsonStr: JSON.stringify(tradeJsonArr)
          }
          wx.showLoading({
            title: '请稍候...',
            mask: true,
          })
          let result = await requestw({
            url: allApiStr.sumbitSaleOrderBatchApi,
            data: postData,
          })
          wx.hideLoading()
          const res = result.data
          console.log(res)
          if (!res || res.code !== '0') {
            wx.showModal({
              title: '提示',
              content: (res && res.message) || '网络异常',
              showCancel: false,
            })
            return
          }
          //成功
          self.openResultModal()
        }
      }
    })
  },
  //成功modal组件
  openResultModal: function () {
    this.setData({
      showResultModal: true,
    })
  },
  clickModalBtn: function () {
    this.setData({
      showResultModal: false,
    })
    // wx.reLaunch({
    //   url: '/pages/index/index',
    // })
    setGlobalData('toTransferArr', [])
    this.setData({
      toTransferArr: []
    })
  },
  //methods end
})