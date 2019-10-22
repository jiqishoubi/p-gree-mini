import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import {
  formatDate
} from '../../../utils/util.js'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    selectedArr: [],
    lookingIndex: '', //正在操作的index
    sumPrice:0,

    //时间组件
    showPopup: false,
    currentDatetime: new Date().getTime(), //用于显示

    //结果pop
    showPopup_result:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //选中的arr
    if (options.selectedArr) {
      let selectedArr = JSON.parse(options.selectedArr)
      let sum = 0
      selectedArr.forEach((obj) => {
        //1、处理一下数据
        obj.shijian = ''
        obj.tidanhao = ''
        obj.beizhu = ''
        //2、合计
        let price = Number(obj.priceFeeYuan) * obj.count
        sum = sum + price
      })
      console.log(sum)
      this.setData({
        selectedArr,
        sumPrice:sum,
      })
    }
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //打开datetimepicker
  onOpenPopup: function(e) {
    let {
      selectedArr
    } = this.data
    let index = e.currentTarget.dataset.param
    this.setData({
      showPopup: true,

      lookingIndex: index,
      currentDatetime: selectedArr[index].shijian ? selectedArr[index].shijian : new Date().getTime()
    })
  },
  onClosePopup: function(e) {
    this.setData({
      showPopup: false
    })
  },
  //picker组件
  onInputPicker: function(e) {
    console.log(e)
    let value = e.detail
    this.setData({
      currentDatetime: value
    })
  },
  onConfirmPicker: function(e) {
    let {
      selectedArr,
      lookingIndex
    } = this.data
    let value = e.detail
    selectedArr[lookingIndex].shijian = value
    selectedArr[lookingIndex].shijian_format = formatDate(new Date(value), 'yyyy-MM-dd hh:mm')
    this.setData({
      selectedArr
    })
    this.onClosePopup()
  },
  //picker组件 end
  //submit
  submit: async function() {
    const {
      selectedArr
    } = this.data
    //验证

    //验证 end
    let postData = {

    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.submitOrderApi,
      data: postData,
    })
    wx.hideLoading()
    console.log(res)

    this.setData({
      showPopup_result:true
    })
  },
  //点击 下单成功的 知道了
  clickKnow:function(){
    this.setData({
      showPopup_result:false,
    })
  },
})