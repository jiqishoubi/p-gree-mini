import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import {
  formatDate
} from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    monthList: [],
    showMonthList: [],

    activeTop: 0, //0本人 1本店
    curMonthIndex: null,

    //图
    tradeCount: 0, //已下单
    preOrderCount: 0, //待转销售
    sumCount: 0,
    percent: 0, //百分比

    allSaleCount: 0,

    //结果
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    await this.initMonthList()
    this.getStatisticsData()
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //切换tabbar
  onChange_tabbar: function(e) {
    let index = e.detail
    switch (index) {
      case 0:
        wx.redirectTo({
          url: '/pages/index/index',
        })
        break
      case 1:
        wx.redirectTo({
          url: '/pages/statistics/statistics_index/statistics_index',
        })
        break
      case 2:
        wx.redirectTo({
          url: '/pages/order/order_index/order_index',
        })
        break
      case 3:
        wx.redirectTo({
          url: '/pages/wode/wode_index/wode_index',
        })
        break
    }
  },
  //初始化月份
  initMonthList: function() {
    return new Promise((resolve, reject) => {
      let list = []
      for (let i = 0; i < 6; i++) {
        let stamp = new Date().getTime() - 86400000 * 31 * i
        let dateStr = formatDate(new Date(stamp), 'yyyy-M')
        list.unshift(dateStr)
      }
      let list2 = list.map((str) => {
        return str.split('-')[1]
      })
      this.setData({
        monthList: list,
        showMonthList: list2,
        curMonthIndex: list.length - 1,
      }, () => {
        resolve()
      })
    })
  },
  //回到顶部
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
    }
  },
  //绑定上面tab
  cutTab: function(e) {
    let index = e.currentTarget.dataset.index
    const {
      monthList
    } = this.data

    // this.goTop()
    this.setData({
      activeTop: Number(index),
      // curMonthIndex: monthList.length - 1,
    }, () => {
      this.getStatisticsData()
    })
  },
  //切换month tab
  cutMonth: function(e) {
    console.log(e)
    let monthindex = e.currentTarget.dataset.monthindex
    this.setData({
      curMonthIndex: monthindex
    }, () => {
      this.getStatisticsData()
    })
  },
  //获取统计数据
  getStatisticsData: async function() {
    const {
      activeTop,
      monthList,
      curMonthIndex
    } = this.data

    console.log(monthList)
    console.log(curMonthIndex)

    let postData = {
      ifDepart: activeTop, // 1 - 查部门; 其他 - 查个人; 默认: 查个人
      queryMonth: monthList[curMonthIndex].replace('-', ''), //YYYYMM
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.getStatisticsSIndexApi,
      data: postData,
    })
    wx.hideLoading()

    if (res.data.code !== '0' || !res.data.data) {
      return false
    }

    let sumCount = Math.round(Number(res.data.data.tradeCount) + Number(res.data.data.preOrderCount))
    let percent = Math.round((res.data.data.preOrderCount / sumCount) * 100)
    this.setData({
      tradeCount: res.data.data.tradeCount,
      preOrderCount: res.data.data.preOrderCount,
      sumCount,
      percent,

      allSaleCount: res.data.data.allSaleCount,

      list: res.data.data.goodsList,
    })
  },
})