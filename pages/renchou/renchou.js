import regeneratorRuntime from '../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../utils/requestw.js'
import allApiStr from '../../utils/allApiStr.js'
import patternCreator from '../../utils/patternCreator.js'
import {
  initQrcodeUrl,
  initQrcodeImgUrl,
  saveImgBaseLocal
} from '../../utils/util.js'

const app = getApp()
const limitSecond = 60

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,
    departCode: '', //店铺编码
    type: '', //d店铺 s导购员
    saler: null, //导购员的时候

    goodsList: [], //全部商品列表
    //活动
    activityList: [], //全部活动列表
    selectedActivityIndex: null,


    //上面的form
    couponNo: '', //认筹券号
    couponPhoneNo: '', //认筹手机号

    //验证码
    couponSms: '', //根据活动 是否显示
    smsTimer: null,
    second: limitSecond,

    list: [],

    //导购员
    salerList: [],
    selectedSalerIndex: null, //选中的导购员索引

    //二维码modal
    showCodeModal: false,
    orderNo: '',
    qrcodeURL: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let userInfo = wx.getStorageSync('gree_userInfo')

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    this.init(
      's', userInfo.userCode, //导购员
      async () => {
        wx.hideLoading()
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法法方法方法方法方法方法方法
  //加一个选项
  addOneSelect: function () {
    const {
      list,
      goodsList
    } = this.data
    let obj = {
      receiver: '', //收货人
      receiverPhone: '', //收货电话
      receiverPhoneBak: '', //备用电话
      address: '', //详细地址

      //选择城市组件
      showCitypicker: false,
      pickerCityVal: [null, null, null], //数组
      //商品列表
      showGoodsList: false,
      goodsList: goodsList,
      goodsItemZindex: 9, //关闭是9  打开是11  //goodsItem的zindex
      goodsListHeight: 0,
      selectedGoods: null, //选中的商品
      searchGoodsVal: '',
    }
    list.push(obj)
    this.setData({
      list
    })
  },
  //绑定input
  onInputChange: function (e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //绑定input
  onInputChange_index: function (e) {
    let key = e.currentTarget.dataset.key
    let indexwrap = e.currentTarget.dataset.indexwrap
    let value = e.detail.value
    let {
      list
    } = this.data
    list[indexwrap][key] = value
    this.setData({
      list
    })
  },
  //初始化
  init: async function (type, code, callback) {
    this.setData({
      type
    })
    //获取活动、商品 
    let res1 = await this.getActivityList()


    console.log(this.data.selectedActivityIndex)


    if (res1.data.data && res1.data.data[0]) {
      await this.getGoodsList(res1.data.data[0].activityCode)
      setTimeout(() => {
        this.addOneSelect()
      }, 20)
    }

    //获取导购员info
    let res = await requestw({
      url: allApiStr.getSalerInfoApi,
      data: {
        userCode: code
      },
    })
    if (res.data.code !== '0') {
      wx.showToast({
        title: res.message,
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    this.setData({
      departCode: res.data.data.departCode,
      saler: res.data.data,
    }, () => {
      callback()
    })
  },
  //重新初始化
  initRefresh: async function (activityCode) {
    await this.getGoodsList(activityCode)
    let {
      list
    } = this.data
    list = JSON.parse(JSON.stringify([]))
    this.setData({
      list
    }, () => {
      setTimeout(() => {
        this.addOneSelect()
      }, 20)
    })
  },
  //生成二维码
  initCode: function (orderNo) {
    setTimeout(async () => {
      let imgData = await initQrcodeImgUrl(orderNo)

      this.setData({
        qrcodeURL: imgData
      })
    }, 20)
  },
  //选择城市组件
  openCitypicker: function (e) {
    let indexwrap = e.currentTarget.dataset.indexwrap
    let {
      list
    } = this.data
    list[indexwrap].showCitypicker = true
    this.setData({
      list
    })
  },
  closeCitypicker: function (e) {
    let indexwrap = e.currentTarget.dataset.indexwrap
    let arr = e.detail
    let {
      list
    } = this.data
    list[indexwrap].showCitypicker = false
    list[indexwrap].pickerCityVal = arr
    this.setData({
      list
    })
  },
  //选择城市组件 end
  //查询店铺信息
  getDepartInfo: function () {
    return new Promise(async (resolve, reject) => {
      const {
        departCode
      } = this.data
      let res = await requestw({
        url: allApiStr.getSaleDepartInfoApi,
        data: {
          departCode
        },
      })
      resolve(res)
    })
  },
  //查询店铺下的导购员信息
  getSalerUserList: function () {
    return new Promise(async (resolve, reject) => {
      const {
        departCode
      } = this.data
      let res = await requestw({
        url: allApiStr.getSalerUserListApi,
        data: {
          departCode
        },
      })
      if (res.data.code !== '0') {
        wx.showToast({
          title: '获取导购员列表失败，' + res.data.message,
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      }
      this.setData({
        salerList: res.data.data
      })
      resolve(res)
    })
  },
  //绑定salerpicker 
  onChangeSalerpicker: function (e) {
    let index = Number(e.detail.value)
    this.setData({
      selectedSalerIndex: index
    })
  },
  //绑定活动picker
  onChangeActivitypicker: function (e) {
    const {
      activityList,
      selectedActivityIndex,
    } = this.data
    let index = Number(e.detail.value)

    if (selectedActivityIndex == index) {
      return false
    }

    this.setData({
      selectedActivityIndex: index
    })

    // this.getGoodsList(activityList[index].activityCode)
    this.initRefresh(activityList[index].activityCode)
  },
  //开关商品列表
  toggleGoodsList: async function (e) {
    let indexwrap = e.currentTarget.dataset.param
    let {
      list,
      selectedActivityIndex,
      goodsList, //全部商品
    } = this.data

    if (selectedActivityIndex == null) {
      wx.showToast({
        title: '请选择活动',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }

    list[indexwrap].goodsListHeight = 500
    list[indexwrap].showGoodsList = !list[indexwrap].showGoodsList
    list[indexwrap].goodsItemZindex = list[indexwrap].goodsItemZindex == 11 ? 9 : 11
    if (list[indexwrap].showGoodsList) { //原来关闭 现在打开 //打开的时候
      if (list.length > 1) { //大于1的话 只能显示套购的
        let oldGoodsList = JSON.parse(JSON.stringify(goodsList))
        list[indexwrap].goodsList = oldGoodsList.filter((obj) => {
          return obj.ifMix == 1
        })
      } else { //只有一个的时候，显示全部商品
        list[indexwrap].goodsList = JSON.parse(JSON.stringify(goodsList))
      }
    }

    this.setData({
      list
    })
  },
  //获取全部活动
  getActivityList: function () {
    return new Promise(async (resolve, reject) => {
      let res = await requestw({
        url: allApiStr.getActivityListApi,
        data: {
          activityType: 'PRE_SALE'
        },
      })
      if (res.data.code !== '0' || !res.data.data) {
        wx.showToast({
          title: '当前无活动',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
      this.setData({
        activityList: res.data.data,
        selectedActivityIndex: res.data.data.length == 1 ? 0 : null,
      }, () => {
        resolve(res)
      })
    })
  },
  //获取全部商品
  getGoodsList: function (activityCode) {
    return new Promise(async (resolve, reject) => {
      let res = await requestw({
        url: allApiStr.getGoodsByQueryApi,
        data: {
          activityCode
        },
      })
      if (res.data.code !== '0') {
        wx.showToast({
          title: '获取商品列表失败，' + res.data.message,
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      }
      this.setData({
        goodsList: res.data.data
      })
      resolve(res)
    })
  },
  //选择机型
  selectGoods: function (e) {
    let item = e.currentTarget.dataset.item
    let indexwrap = e.currentTarget.dataset.indexwrap
    let {
      list
    } = this.data

    list[indexwrap].selectedGoods = item
    list[indexwrap].showGoodsList = false
    list[indexwrap].goodsItemZindex = 9 //关闭
    this.setData({
      list
    })
  },
  //点击删除
  deleteItemWrap: function (e) {
    const self = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除该认筹商品？',
      success: function (res) {
        if (res.confirm) {
          // on confirm
          let indexwrap = e.currentTarget.dataset.indexwrap
          let {
            list
          } = self.data
          list.splice(indexwrap, 1)
          self.setData({
            list
          })
        }
      },
    })
  },
  //保存在本地
  saveToLocal: function () {
    var imgSrc = this.data.qrcodeURL
    saveImgBaseLocal(imgSrc)
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
          let indexwrap = e.currentTarget.dataset.indexwrap
          let {
            list
          } = self.data

          let upObj = list[indexwrap - 1]
          let upObjTemp = JSON.parse(JSON.stringify(upObj))
          list[indexwrap].receiver = upObjTemp.receiver
          list[indexwrap].receiverPhone = upObjTemp.receiverPhone
          list[indexwrap].receiverPhoneBak = upObjTemp.receiverPhoneBak
          list[indexwrap].address = upObjTemp.address
          list[indexwrap].pickerCityVal = upObjTemp.pickerCityVal

          self.setData({
            list
          })
        }
      },
    })
  },
  //搜索商品列表
  inputSeachGoodsVal: function (e) {
    let value = e.detail.value
    let indexwrap = e.currentTarget.dataset.indexwrap
    let {
      list,
      goodsList,
    } = this.data

    if (value !== '') {
      let showGoodsListTemp = goodsList.filter((obj) => {
        let valueTemp = value.toLowerCase()
        let strTemp1 = obj.goodsName.toLowerCase()
        let strTemp2 = obj.goodsModel.toLowerCase()
        return strTemp1.indexOf(valueTemp) > -1 || strTemp2.indexOf(valueTemp) > -1
      })
      list[indexwrap].goodsList = showGoodsListTemp
    } else {
      list[indexwrap].goodsList = goodsList
    }

    list[indexwrap].searchGoodsVal = value
    this.setData({
      list
    })
  },
  //提交
  submitRc: async function () {
    const {
      type,
      saler,
      list,
      selectedActivityIndex,
      selectedSalerIndex,
      activityList,
      salerList,
      couponNo,
      couponPhoneNo,
      couponSms,
    } = this.data

    console.log(list)

    //验证
    let reg_phone = patternCreator.mobilePhone.pattern
    let flag = true //可以的
    let flag_phone = true
    list.forEach((obj) => {
      if (
        obj.receiver == '' ||
        obj.receiverPhone == '' ||
        obj.address == '' ||
        !obj.pickerCityVal[0]
      ) {
        flag = false
      }

      if (!reg_phone.test(obj.receiverPhone)) {
        flag_phone = false
      }
      if (obj.receiverPhoneBak !== '' && !reg_phone.test(obj.receiverPhoneBak)) {
        flag_phone = false
      }
    })
    if (
      couponNo == '' ||
      couponPhoneNo == '' ||
      (selectedActivityIndex == null) ||
      (!flag)
    ) {
      wx.showToast({
        title: '信息请填写完整',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    if (!reg_phone.test(couponPhoneNo)) {
      flag_phone = false
    }
    if (type == 'd') {
      if (selectedSalerIndex == null) {
        wx.showToast({
          title: '信息请填写完整',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
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
    //如果是套购就必须2个
    if (
      list[0] &&
      list[0].selectedGoods &&
      list[0].selectedGoods.ifMix &&
      list[0].selectedGoods.ifMix == 1
    ) {
      if (list.length < 2) {
        wx.showToast({
          title: '套购机型必须选择2个以上',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
    }
    //不能选择相同机型
    if (list.length) {
      let flag = true
      list.forEach((obj) => {
        let goodsCode = (obj.selectGoods && obj.selectGoods.goodsCode) || ''
        let filterArr = list.filter((itm) => itm.selectGoods && itm.selectGoods.goodsCode == goodsCode)
        if (filterArr.length > 1) {
          flag = false
        }
      })
      if (!flag) {
        wx.showToast({
          title: '不能选择相同机型',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
    }
    //验证 end

    //发送参数
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    //一、验证短信验证码
    //如果该活动需要发送短信验证码
    if (activityList[selectedActivityIndex] && activityList[selectedActivityIndex].ifSmsCaptcha == 1) {
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
    //二、提交认筹单
    //arr
    let goodsListJson = list.filter((obj) => {
      return obj.selectedGoods
    }).map((obj) => {
      return {
        goodsCode: obj.selectedGoods.goodsCode,
        custName: obj.receiver,
        phoneNumber: obj.receiverPhone,
        phoneNumberBak: obj.receiverPhoneBak,
        provinceCode: obj.pickerCityVal[0].areaCode,
        eparchyCode: obj.pickerCityVal[1].areaCode,
        cityCode: obj.pickerCityVal[2].areaCode,
        address: obj.address,
      }
    })
    let postData = {
      activityCode: activityList[selectedActivityIndex].activityCode, //         活动编码(非空)
      // salerUserCode: type == 'd' ? salerList[selectedSalerIndex].userCode : saler.userCode, //       导购员编码(非空)
      orderType: 'HOME_USE',
      ticketCode: couponNo, //认筹券号
      phoneNumber: couponPhoneNo, //认筹手机号
      goodsListJsonStr: JSON.stringify(goodsListJson)
    }
    let res = await requestw({
      url: allApiStr.submitPreOrderApi,
      data: postData,
    })
    wx.hideLoading()

    if (res.data.code !== '0') {
      wx.showToast({
        title: res.data.message,
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }

    //认筹成功
    wx.showToast({
      title: '操作成功',
      icon: 'none',
      // mask: true,
      duration: 1000,
    })
    this.setData({
      showCodeModal: true,
      orderNo: res.data.data.orderNo,
    }, () => {
      this.initCode(res.data.data.orderNo)
    })
  },
  //短信验证码
  getSms: async function () {
    const {
      couponPhoneNo
    } = this.data

    //验证
    if (couponPhoneNo == '') {
      wx.showToast({
        title: '请输入认筹手机号',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    let phoneReg = patternCreator.mobilePhone.pattern
    if (!phoneReg.test(couponPhoneNo)) {
      wx.showToast({
        title: '认筹手机号格式不正确',
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
        couponPhoneNo,
        couponSms
      } = this.data
      let postData = {
        captchaType: 'MP_CAPTCHA_CHECK',
        phoneNumber: couponPhoneNo,
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
  //点击添加商品
  clickAddbtn: function () {
    this.addOneSelect()
  },
  //获取dom位置
  getDomPosition: function (id) {
    return new Promise((resolve) => {
      let query = wx.createSelectorQuery().in(this)
      query.select('#' + id).boundingClientRect(function (res) {
        resolve(res)
      }).exec()
    })
  },
})