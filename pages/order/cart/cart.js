/**
 * 目前用于 认筹转销售和家用下单，商用下单不用这个
 */
/**
 * options:
 * type  //PRE_SALE认筹转销售  HOME_USE家用下单  BUSI_USE商用下单
 * activityCode
 * selectedGoodsList //带不带count都可以
 * 
 * oldOrderNo 可不传
 */
import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import {
  toMoney,
  moneyToNum
} from '../../../utils/util.js'
import patternCreator from '../../../utils/patternCreator.js'

const app = getApp()
const limitSecond = 60

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    type: '',
    activityCode: '',
    activityInfo: null,
    oldOrderNo: '',
    oldSelectedGoodsList: [],

    selectedList: [], //处理过的selectedList

    sumPrice: '', //合计钱数

    //验证码
    couponSms: '',
    smsTimer: null,
    second: limitSecond,

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
  onLoad: function (options) {
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
      activityInfo: options.activityInfo ? JSON.parse(options.activityInfo) : null,
      oldOrderNo: options.oldOrderNo,

      oldSelectedGoodsList,
      selectedList,
    }, () => {
      this.calcSumPrice()
      //是否可以修改价格
      this.checkIfUpdatePrice()
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
  //绑定input
  onInputChange: function (e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value

    this.setData({
      [key]: value
    })
  },
  onInputChange_index: function (e) {
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
  openCitypicker: function (e) {
    let index = e.currentTarget.dataset.index
    let {
      selectedList
    } = this.data
    selectedList[index].showCitypicker = true
    this.setData({
      selectedList
    })
  },
  closeCitypicker: function (e) {
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
  useUpAddress: function (e) {
    const self = this
    wx.showModal({
      title: '提示',
      content: '是否确认使用上方地址信息？',
      success: function (res) {
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
  calcSumPrice: function () {
    const {
      selectedList
    } = this.data
    let sum = 0
    selectedList.forEach((obj) => {
      let yuan = '0'
      if (obj.tradeFeeYuan) {
        yuan = obj.tradeFeeYuan
      } else if (obj.priceFeeActivityYuan) {
        yuan = obj.priceFeeActivityYuan
      } else {
        yuan = obj.priceFeeYuan
      }
      sum = sum + Number(yuan)
    })
    this.setData({
      sumPrice: toMoney(sum)
    })
  },
  //点击提交订单
  submit: async function () {
    const {
      type,
      activityCode,
      activityInfo,
      oldOrderNo,
      oldSelectedGoodsList,
      selectedList,
      couponSms,
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
      let reg_phone = patternCreator.mobilePhone.pattern
      let flag = true
      let flag_phone = true
      for (let i = 0; i < selectedList.length; i++) {
        if (
          selectedList[i].receiver == '' ||
          selectedList[i].receivePhone == '' ||
          selectedList[i].addressTemp == '' ||
          !selectedList[i].pickerCityVal[0]
        ) {
          flag = false
        }

        if (!reg_phone.test(selectedList[i].receivePhone)) {
          flag_phone = false
        }
        if (
          selectedList[i].receivePhoneBak !== '' &&
          !reg_phone.test(selectedList[i].receivePhoneBak)
        ) {
          flag_phone = false
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
      if (!flag_phone) {
        wx.showToast({
          title: '请输入正确格式的手机号',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
    }
    //验证 end

    //家用销售单 下单
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    //一、验证短信验证码
    //如果该活动需要发送短信验证码
    if (activityInfo && activityInfo.ifSmsCaptcha == 1) {
      if (couponSms == '') {
        wx.showToast({
          title: '请输入短信验证码',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }

      if (!(await this.checkSmsCaptcha())) {
        wx.showToast({
          title: '短信验证码校验失败',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
    }
    //二、提交订单
    //发送参数
    let goodsListJson = []
    selectedList.forEach((obj) => {
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
      //价格
      let yuan = '0'
      if (obj.tradeFeeYuan) {
        yuan = obj.tradeFeeYuan
      } else if (obj.priceFeeActivityYuan) {
        yuan = obj.priceFeeActivityYuan
      } else {
        yuan = obj.priceFeeYuan
      }
      let objTemp = {
        goodsCode: obj.goodsCode,
        shoppingCode: obj.billNumber,
        remark: obj.remarkinput,
        tradeFee: yuan * 100,
        ...addressInfo
      }
      goodsListJson.push(objTemp)
    })
    let postData = {
      tradeType: type,
      preOrderNo: oldOrderNo ?
        oldOrderNo : (type == 'PRE_SALE' ? oldSelectedGoodsList[0].orderNo : null), //如果是认筹转销售，要传 认筹单号
      activityCode,
      // ifRepaire:1 0,
      goodsListJsonStr: JSON.stringify(goodsListJson)
    }
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
  openResultModal: function () {
    this.setData({
      showResultModal: true,
    })
  },
  clickModalBtn: function () {
    this.setData({
      showResultModal: false,
    })
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  //修改价格modal
  openEditPriceModal: function (e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      showEditPriceModal: true,
      lookingIndex: index,
    })
  },
  onEditPriceCancel: function () {
    this.setData({
      showEditPriceModal: false,
      lookingIndex: null,
      price1: '',
      price2: '',
    })
  },
  onEditPriceConfirm: function () {
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
  //确认是否可以修改价格
  checkIfUpdatePrice: async function () {
    let {
      activityCode,
      selectedList,
    } = this.data
    console.log(selectedList)

    //先查这个活动的商品
    let postData = {
      activityCode,
    }
    let res = await requestw({
      url: allApiStr.getGoodsByQueryApi,
      data: postData,
    })
    console.log(res)
    if (
      res.data.code !== '0' ||
      !res.data.data ||
      res.data.data.length == 0
    ) {
      return false
    }
    let allActivityGoods = res.data.data

    selectedList.forEach(async (obj) => {
      if (obj.ifUpdatePrice !== 0 && obj.ifUpdatePrice !== 1) {
        let filterArr = allActivityGoods.filter((objall) => {
          return objall.goodsCode == obj.goodsCode && objall.ifUpdatePrice == 1
        })
        if (filterArr.length > 0) {
          obj.ifUpdatePrice = res.data.data[0].ifUpdatePrice
        }
      }
    })

    this.setData({
      selectedList
    })
  },
  //短信验证码
  getSms: async function () {
    const {
      selectedList
    } = this.data
    let couponPhoneNo = selectedList[0].receivePhone

    //验证
    if (couponPhoneNo == '') {
      wx.showToast({
        title: '请输入收货电话',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    let phoneReg = patternCreator.mobilePhone.pattern
    if (!phoneReg.test(couponPhoneNo)) {
      wx.showToast({
        title: '收货电话格式不正确',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    //发送
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let postData = {
      captchaType: 'MP_CAPTCHA_CHECK',
      phoneNumber: couponPhoneNo,
    }
    let res = await requestw({
      url: allApiStr.sendSmsCaptchaApi,
      data: postData,
    })
    wx.hideLoading()
    console.log(res)
    if (res.data.code !== '0' || !res.data.data) {
      wx.showToast({
        title: res.data.message ? res.data.message : '短信验证码发送失败，请稍候再试',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    wx.showToast({
      title: '短信验证码发送成功',
      icon: 'none',
      // mask: true,
      duration: 1000,
    })
    this.bgTimer()
  },
  bgTimer: function () {
    let timer = setInterval(() => {
      let nextSecond = this.data.second - 1
      if (nextSecond < 0) {
        this.endTimer()
        return false
      }
      this.setData({
        second: nextSecond
      })
    }, 1000)
    this.setData({
      smsTimer: timer
    })
  },
  endTimer: function () {
    clearInterval(this.data.smsTimer)
    this.setData({
      smsTimer: null,
      second: limitSecond,
    })
  },
  //验证短信验证码
  checkSmsCaptcha: function () {
    return new Promise(async (resolve) => {
      const {
        selectedList,
        couponSms,
      } = this.data
      let postData = {
        captchaType: 'MP_CAPTCHA_CHECK',
        phoneNumber: selectedList[0].receivePhone,
        captchaCode: couponSms,
      }
      let res = await requestw({
        url: allApiStr.checkSmsCaptchaApi,
        data: postData,
      })
      console.log(res)
      if (res.data.code !== '0' || !res.data.data) {
        resolve(false)
        return false
      }
      resolve(true)
    })
  },
  //短信验证码 end
  //method end
})