/** 
 * 转销售 搜索
 */
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

    searchVal: '',

    //结果列表
    resultList: [],
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
    // //重置
    // this.setData({
    //   searchVal: '',
    //   result: null,
    // })
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //绑定input
  inputChange: function (e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //开启扫码
  openCode: function () {
    const self = this
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        console.log(res)
        if (res.errMsg.indexOf(':ok') > -1) {
          let orderNo = res.result
          self.getRenchouList(orderNo)
        }
      },
      fail: function () {
        wx.showToast({
          title: '扫描失败',
          icon: 'none',
          // mask: true,
          duration: 1500,
        })
      },
    })
  },
  //点击搜索
  clickSearch: function () {
    this.getRenchouList(this.data.searchVal)
  },
  //获取认筹单列表
  getRenchouList: async function (searchVal) {
    //验证
    if (searchVal == '') {
      wx.showToast({
        title: '请输入搜索条件',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    //清空下面
    this.setData({
      resultList:[]
    })

    //发送参数
    let postData = {
      page: 1,
      rows: 999,
      // orderStatus: '0',
      orderStatus: '50',
      orderNoOrPhoneNumber: searchVal,
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.getRenchouListApi,
      data: postData,
    })
    wx.hideLoading()
    console.log(res)
    if (res.data.code !== '0' || !res.data.data.data) {
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }
    this.setData({
      resultList: res.data.data.data
    })
  },
  //去订单详情
  goOrderDetail: function (e) {
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/order/doing_search_detail/doing_search_detail?order=${JSON.stringify(item)}`,
    })
  },
})