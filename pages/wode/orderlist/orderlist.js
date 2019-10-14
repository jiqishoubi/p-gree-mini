// pages/wode/orderlist/orderlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      name: '13082223333',
      status: '已付款',
      img: '',
      mname: '72辽之缘',
      desc: 'KFR-23GW(23592)NhA3(清爽白)',
      tag: [
        '变频', '3匹', '1级能效'
      ],
      price: '5380',
    }, {
      name: '13082223333',
      status: '未付款',
      img: '',
      mname: '72辽之缘',
      desc: 'KFR-23GW(23592)NhA3(清爽白)',
      tag: [
        '变频', '3匹', '1级能效'
      ],
      price: '5380',
    }, {
      name: '13082223333',
      status: '未付款',
      img: '',
      mname: '72辽之缘',
      desc: 'KFR-23GW(23592)NhA3(清爽白)',
      tag: [
        '变频', '3匹', '1级能效'
      ],
      price: '5380',
    }, {
      name: '13082223333',
      status: '未付款',
      img: '',
      mname: '72辽之缘',
      desc: 'KFR-23GW(23592)NhA3(清爽白)',
      tag: [
        '变频', '3匹', '1级能效'
      ],
      price: '5380',
    }],

    // datepicker组件
    showDatepicker: false,
    bindDateVal: new Date().getTime(), //绑定的value
    confirmDateVal: '', //最后确定的date
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //datepicker组件
  onInputDate: function(e) {
    this.setData({
      bindDateVal: e.detail,
    })
  },
  onConfirmDate: function(e) {
    this.setData({
      showDatepicker: false,
      confirmDateVal: e.detail,
    })
  },
  onCancelDate: function() {
    this.setData({
      showDatepicker: false,
    })
  },
  //datepicker组件 end
  //点击预约安装时间
  openDatepicker: function() {
    this.setData({
      showDatepicker: true,
    })
  }
})