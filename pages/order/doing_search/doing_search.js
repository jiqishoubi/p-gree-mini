const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    searchVal: '',
    result:null,
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
    //重置
    this.setData({
      searchVal: '',
      result: null,
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
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        console.log(res)
      }
    })
  },
  //点击搜索
  clickSearch:function(){
    const self=this
    wx.showLoading({
      title: '请稍候',
      mask:true,
    })
    setTimeout(function(){

      wx.hideLoading()

      let res = {
        code: 'GL4958103843',
        type: '家用认筹',
        mtype: '72辽之缘',
        price: '5380',
        name: '姓名',
        phone: '13051832424',
        address: '辽宁省 沈阳市 浑南区',
        address_detail: '金辉街德宝大厦',
      }
      self.setData({
        result: res
      })

    },900)
  },
  //点击下单
  clickOrder:function(){
    const {result}=this.data
    //验证
    if(!result){
      wx.showToast({
        title: '请选择商品',
        icon:'none',
        mask:true,
      })
      return false
    }
    //验证 end
    wx.navigateTo({
      url: '/pages/order/cart/cart',
    })
  }
})