import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import patternCreator from '../../../utils/patternCreator.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchVal: '',
    resultList: [],

    //modal
    //退单modal
    showCancelModal: false,
    lookingOrder: null, //当前操作的order
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //绑定input
  onInputChange: function (e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //搜索
  search: async function () {
    const {
      searchVal
    } = this.data

    console.log(searchVal)

    //验证
    if (searchVal.trim() == '') {
      wx.showToast({
        title: '请输入搜索条件',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end


    //ajax
    let postData1, postData2
    let arr1, arr2
    let phoneReg = patternCreator.mobilePhone.pattern
    if (phoneReg.test(searchVal)) { //是手机号
      postData1 = {
        notOrderStatus:'90',
        phoneNumber: searchVal,
      }
      postData2 = {
        phoneNumber: searchVal,
      }
    } else { //不是手机号 //单号
      postData1 = {
        notOrderStatus:'90',
        orderNo: searchVal,
      }
      postData2 = {
        tradeNo: searchVal,
      }
    }

    //1、认筹单
    let p1 = new Promise(async (resolve) => {
      let res1 = await requestw({
        url: allApiStr.getPreOrderListApi,
        data: {
          // ifMine: 1,
          page: 1,
          rows: 999,
          ...postData1,
        },
      })
      console.log(res1)
      if (
        res1.data.code !== '0' ||
        !res1.data.data ||
        !res1.data.data.data
      ) {
        arr1 = []
      } else {
        arr1 = res1.data.data.data
      }
      resolve()
    })


    //2、销售单
    let p2 = new Promise(async (resolve) => {
      let res2 = await requestw({
        url: allApiStr.getTradeListApi,
        data: {
          // ifMine: 1,
          page: 1,
          rows: 999,
          ...postData2,
        },
      })
      console.log(res2)
      if (
        res2.data.code !== '0' ||
        !res2.data.data ||
        !res2.data.data.data
      ) {
        arr2 = []
      } else {
        arr2 = res2.data.data.data
      }
      resolve()
    })

    //一起执行
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    Promise.all([p1, p2]).then((result) => {
      wx.hideLoading()
      let list = [...arr1, ...arr2]
      console.log(list)
      this.setData({
        resultList: list
      })
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
  //退单modal
  openCancelModal: function (e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      showCancelModal: true,
      lookingOrder: item,
    })
  },
  closeCancelModal: function () {
    this.setData({
      showCancelModal: false,
      lookingOrder: null,
    })
  },
  confirmCancelModal: async function (e) {
    const {
      lookingOrder
    } = this.data
    let value = e.detail
    let postData = {
      tradeNo: lookingOrder.tradeNo,
      resultNote: value,
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.cancelTradeOrderApi,
      data: postData,
    })
    wx.hideLoading()

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
      title: '操作成功',
      icon: 'none',
      // mask: true,
      duration: 1500,
    })

    this.selectComponent('#cancelordermodal').resetVal()
    this.closeCancelModal()
    this.getData(false)
  },
  //去订单详情
  goDetail: function (e) {
    let item = e.currentTarget.dataset.item

    console.log(item)
    if (item.orderDateStr && item.orderType == 'HOME_USE') { //认筹家用
      wx.navigateTo({
        url: `/pages/order/doing_search_detail/doing_search_detail?order=${JSON.stringify(item)}`,
      })
    } else if (item.orderDateStr && item.orderType == 'BUSI_USE') { //认筹商用（已登录）
      wx.navigateTo({
        url: `/pages/order/order_detail_yidenglu/order_detail_yidenglu?order=${JSON.stringify(item)}`,
      })
    } else if (item.tradeDateStr) { //销售单
      let code = item.tradeNo
      if (item.tradeType == 'BUSI_USE') { //商用
        wx.navigateTo({
          url: `/pages/order/order_detail_busi/order_detail_busi?type=trade&code=${code}`,
        })
      } else {
        wx.navigateTo({
          url: `/pages/order/order_detail/order_detail?type=trade&code=${code}`,
        })
      }
    }
  },
  //method end
})