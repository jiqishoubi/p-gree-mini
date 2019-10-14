// pages/order/choose/choose.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active_left:0,
    leftlist:[
      '11', '22', '11', '22', '11', '22', '11', '22',
      '11', '22', '11', '22', '11', '22', '11', '22'
    ],
    rightlist:[
      {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
    ],
    rightheight:'', //right高度
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
      //设置right高度
      this.setRightheight()
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方
  //设置右侧高度
  setRightheight:function(){
    let leftheight=this.data.leftlist.length*97+'rpx'
    this.setData({
      rightheight:leftheight
    })
  },
  // 选择左侧
  chooseleft:function(e){
    let index=e.currentTarget.dataset.param
    this.setData({
      active_left:index
    })
  },

})