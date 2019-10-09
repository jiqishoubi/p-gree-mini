const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    result:null, 
    count:1,
    totalPrice:0,

    //form
    time:'',
    code:'',
    remark:'',

    //结果modal
    showResultModal:false,
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.setData({
      result:res
    },()=>{
      this.computeTotalPrice()
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
  //改变总金额
  computeTotalPrice:function(){
    console.log('计算')
    const {result,count}=this.data
    if(!result){
      return false
    }
    let price=Number(result.price)
    let totalPrice = price*count
    this.setData({
      totalPrice
    })
  },
  //加减数量
  minusHandle:function(){
    const {count}=this.data
    if(count<=1){
      return false
    }
    this.setData({
      count:count-1
    },()=>{
      this.computeTotalPrice()
    })
  },
  plusHandle:function(){
    const { count } = this.data
    this.setData({
      count: count +1
    },()=>{
      this.computeTotalPrice()
    })
  },
  //绑定input
  inputChange: function (e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //点击提交订单
  clickSubmitOrder:function(){
    const self=this
    wx.showLoading({
      title: '请稍候',
      mask: true,
    })
    setTimeout(function(){
      wx.hideLoading()
      //提交成功
      self.setData({
        showResultModal:true
      })
    },800)  
  },
  //点击modal btn
  clickModalBtn:function(){
    this.setData({
      showResultModal:false,
    })
    setTimeout(function(){
      wx.navigateBack({
        delta:1
      })
    },200)
  }
})