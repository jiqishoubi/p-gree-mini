import {
  formatDate
} from '../../../utils/util.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeTop: 0,

    monthList: [],


    //本人
    curMonth: null,
    list: [{
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }],


    //本月
    curMonth_month: null,
    list_month: [{
      title: 'G017793',
      status: '已付款',
      code: '辽之享74',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享70',
      fee: '50',
      time: '2019-09-29 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '未付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }, {
      title: 'G0177931',
      status: '已付款',
      code: '辽之享72',
      fee: '40',
      time: '2019-09-27 17:39:07',
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initMonthList()
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
      monthList: list2,
      curMonth: list2[list2.length-1],
    },()=>{
      // console.log(this.data.monthList,this.data.curMonth)
    })
  },
  //绑定上面tab
  onChangeTabTop: function(e) {
    let index = e.detail.index
    this.setData({
      activeTop: index
    })
  },
  //切换month tab
  cutMonth:function(e){
    console.log(e)
    let monthStr=e.currentTarget.dataset.param
    this.setData({
      curMonth:monthStr
    })
  }
})