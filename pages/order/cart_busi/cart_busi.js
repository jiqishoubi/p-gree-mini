import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import {
  toMoney
} from '../../../utils/util.js'

const app = getApp()

/**
 * 目前用于 商用下单
 */
/**
 * options:
 * type  //PRE_SALE认筹转销售  HOME_USE家用下单  BUSI_USE商用下单
 * activityCode
 * selectedGoodsList //带不带count都可以
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    type: '',
    activityCode: '',
    oldSelectedGoodsList: [],

    //form
    receiver: '', //收货人
    receivePhone: '',
    receivePhoneBak: '', //备用电话
    address: '',
    billNumber: '', //提单号
    remarkinput: '',

    //选择城市组件
    showCitypicker: false,
    pickerCityVal: [null, null, null],

    sumPrice: '', //合计钱数

    //modal
    //修改价格modal
    showEditPriceModal: false,
    lookingIndex: null, //当前操作的index
    oldPrice: '',
    price1: '',
    price2: '',
    //成功modal
    showResultModal: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    options = wx.getStorageSync('test_cart') //测试用
    console.log(options)
    if (!options.type) {
      wx.showToast({
        title: '订单参数缺失，请重新访问',
        icon: 'none',
        mask: true,
        duration: 2000,
      })
      return false
    }

    //处理selectedGoodsList
    let oldSelectedGoodsList = JSON.parse(options.selectedGoodsList)

    this.setData({
      type: options.type,
      activityCode: options.activityCode,

      oldSelectedGoodsList,
    }, () => {
      this.calcSumPrice()
    })
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //绑定input
  onInputChange: function(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value

    this.setData({
      [key]: value
    })
  },
  //选择城市组件
  openCitypicker: function(e) {
    this.setData({
      showCitypicker: true
    })
  },
  closeCitypicker: function(e) {
    let arr = e.detail
    this.setData({
      showCitypicker: false,
      pickerCityVal: arr,
    })
  },
  //计算合计钱数
  calcSumPrice: function() {
    const {
      oldSelectedGoodsList
    } = this.data
    let sum = 0
    oldSelectedGoodsList.forEach((obj) => {
      sum = sum + (Number(obj.priceFeeYuan) * obj.count)
    })
    this.setData({
      sumPrice: toMoney(sum)
    })
  },
  //点击提交订单
  submit: async function() {
    const {
      type,
      activityCode,
      oldSelectedGoodsList,
      //form
      receiver,
      receivePhone,
      receivePhoneBak,
      address,
      billNumber,
      remarkinput,
      pickerCityVal,
    } = this.data

    //验证
    if (type == '' || activityCode == '') {
      wx.showToast({
        title: '参数缺失，请重新访问',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //form
    if (
      receiver == '' ||
      receivePhone == '' ||
      receivePhoneBak == '' ||
      address == '' ||
      !pickerCityVal[0]
    ) {
      wx.showToast({
        title: '信息请输入完整',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    //商用销售单 下单
    //发送参数
    let goodsListJson = []
    oldSelectedGoodsList.forEach((obj) => {
      let objTemp = {
        goodsCode: obj.goodsCode,
        goodsCount: obj.count,
      }
      goodsListJson.push(objTemp)
    })
    let postData = {
      orderType: 'BUSI_USE',
      activityCode,
      //form
      custName: receiver,
      phoneNumber: receivePhone,
      phoneNumberBak: receivePhoneBak,
      provinceCode: pickerCityVal[0].areaCode,
      eparchyCode: pickerCityVal[1].areaCode,
      cityCode: pickerCityVal[2].areaCode,
      address: address,
      remark: remarkinput,

      goodsListJsonStr: JSON.stringify(goodsListJson),
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.submitPreOrderApi, //商用下单 要先认筹一下 要走认筹的口
      data: postData,
    })
    wx.hideLoading()
    console.log(res)

    if (res.data.code !== '0') {
      wx.showToast({
        title: res.data.message,
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }

    this.openResultModal()
  },
  //成功modal组件
  openResultModal: function() {
    this.setData({
      showResultModal: true,
    })
  },
  clickModalBtn: function() {
    this.setData({
      showResultModal: false,
    })
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  //修改价格modal
  openEditPriceModal: function(e) {
    console.log(e)
    let index = e.currentTarget.dataset.index
    this.setData({
      showEditPriceModal: true,
      lookingIndex: index,
    })
  },
  onEditPriceCancel: function() {
    this.setData({
      showEditPriceModal: false,
      lookingIndex: null,
      price1: '',
      price2: '',
    })
  },
  onEditPriceConfirm: function() {
    const {
      oldSelectedGoodsList,
      price1,
      price2,
      lookingIndex,
    } = this.data

    //验证
    if (price1 == '' || price2 == '') {
      wx.showToast({
        title: '价格请输入完整',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      this.setData({
        showEditPriceModal: true
      })
      return false
    }
    if (price1 !== price2) {
      wx.showToast({
        title: '两次输入价格不一致',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      this.setData({
        showEditPriceModal: true
      })
      return false
    }
    //验证 end

    oldSelectedGoodsList[lookingIndex].priceFeeYuan = price1
    this.setData({
      oldSelectedGoodsList,
    }, () => {
      this.calcSumPrice()
    })

    this.onEditPriceCancel()
  },
  //修改价格modal end
})