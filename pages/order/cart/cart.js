import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import {
  toMoney,
  moneyToNum
} from '../../../utils/util.js'

const app = getApp()

/**
 * 目前用于 认筹转销售和家用下单，商用下单不用这个
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

    selectedList: [], //处理过的selectedList

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
    // wx.setStorageSync('test_cart', options) //测试用
    // options = wx.getStorageSync('test_cart') //测试用
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
    let selectedList = []
    oldSelectedGoodsList.forEach((obj) => {
      if (obj.count) {
        for (let i = 0; i < obj.count; i++) {
          selectedList.push(JSON.parse(JSON.stringify(obj)))
        }
      } else {
        selectedList.push(JSON.parse(JSON.stringify(obj)))
      }
    })
    //处理selectedList
    selectedList.forEach((obj) => {
      obj.receiver = '' //收货人
      obj.receivePhone = '' //收货电话
      obj.receivePhoneBak = '' //收货电话
      obj.addressTemp = '' //详细地址
      obj.billNumber = '' //提单号
      obj.remarkinput = '' //备注
      //选择城市组件
      obj.showCitypicker = false
      obj.pickerCityVal = [null, null, null] //数组
    })
    console.log(selectedList)

    this.setData({
      type: options.type,
      activityCode: options.activityCode,

      oldSelectedGoodsList,
      selectedList,
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
  onInputChange_index: function(e) {
    let key = e.currentTarget.dataset.key
    let index = e.currentTarget.dataset.index
    let value = e.detail.value
    let {
      selectedList
    } = this.data

    selectedList[index][key] = value
    this.setData({
      selectedList
    })
  },
  //选择城市组件
  openCitypicker: function(e) {
    let index = e.currentTarget.dataset.index
    let {
      selectedList
    } = this.data
    selectedList[index].showCitypicker = true
    this.setData({
      selectedList
    })
  },
  closeCitypicker: function(e) {
    let index = e.currentTarget.dataset.index
    let arr = e.detail
    let {
      selectedList
    } = this.data
    selectedList[index].showCitypicker = false
    selectedList[index].pickerCityVal = arr
    this.setData({
      selectedList
    })
  },
  //使用上方地址
  useUpAddress: function(e) {
    const self = this
    wx.showModal({
      title: '提示',
      content: '是否确认使用上方地址信息？',
      success: function(res) {
        if (res.confirm) {
          // on confirm
          let index = e.currentTarget.dataset.index
          let {
            selectedList
          } = self.data
          let upObj = selectedList[index - 1]

          selectedList[index].receiver = upObj.receiver
          selectedList[index].receivePhone = upObj.receivePhone
          selectedList[index].receivePhoneBak = upObj.receivePhoneBak
          selectedList[index].addressTemp = upObj.addressTemp
          selectedList[index].billNumber = upObj.billNumber
          selectedList[index].remarkinput = upObj.remarkinput
          selectedList[index].pickerCityVal = JSON.parse(JSON.stringify(upObj.pickerCityVal))

          self.setData({
            selectedList
          })
        }
      },
    })
  },
  //计算合计钱数
  calcSumPrice: function() {
    const {
      selectedList
    } = this.data
    let sum = 0
    selectedList.forEach((obj) => {
      sum = sum + Number(obj.tradeFeeYuan ? obj.tradeFeeYuan : obj.priceFeeActivityYuan)
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
      selectedList,
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
    if (type == 'HOME_USE') { //不是转销售的，那就是家用下单的，就得校验地址信息
      let flag = true
      for (let i = 0; i < selectedList.length; i++) {
        if (
          selectedList[i].receiver == '' ||
          selectedList[i].receivePhone == '' ||
          selectedList[i].addressTemp == '' ||
          !selectedList[i].pickerCityVal[0]
        ) {
          flag = false
          break
        }
      }
      if (!flag) {
        wx.showToast({
          title: '信息请输入完整',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
    }
    //验证 end

    //家用销售单 下单
    //发送参数
    let goodsListJson = []
    selectedList.forEach((obj) => {
      console.log(obj)
      let addressInfo
      if (type == 'HOME_USE') { //家用
        addressInfo = {
          custName: obj.receiver,
          phoneNumber: obj.receivePhone,
          phoneNumberBak: obj.receivePhoneBak,
          provinceCode: obj.pickerCityVal[0].areaCode,
          eparchyCode: obj.pickerCityVal[1].areaCode,
          cityCode: obj.pickerCityVal[2].areaCode,
          address: obj.addressTemp,
        }
      } else { //转销售
        addressInfo = {
          custName: obj.custName,
          phoneNumber: obj.phoneNumber,
          phoneNumberBak: obj.phoneNumberBak,
          provinceCode: obj.provinceCode,
          eparchyCode: obj.eparchyCode,
          cityCode: obj.cityCode,
          address: obj.address,
        }
      }
      let objTemp = {
        goodsCode: obj.goodsCode,
        shoppingCode: obj.billNumber,
        remark: obj.remarkinput,
        tradeFee: obj.tradeFeeYuan ? obj.tradeFeeYuan * 100 : obj.priceFeeActivityYuan * 100,
        ...addressInfo
      }
      goodsListJson.push(objTemp)
    })
    let postData = {
      tradeType: type,
      preOrderNo: type == 'PRE_SALE' ? oldSelectedGoodsList[0].orderNo : null, //如果是认筹转销售，要传 认筹单号
      activityCode,
      // ifRepaire:1 0,
      goodsListJsonStr: JSON.stringify(goodsListJson)
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.sumbitSaleOrderApi,
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
      selectedList,
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
    if (moneyToNum(price1) !== moneyToNum(price2)) {
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

    selectedList[lookingIndex].tradeFeeYuan = price1
    this.setData({
      selectedList,
    }, () => {
      this.calcSumPrice()
    })

    this.onEditPriceCancel()
  },
  //修改价格modal end
})