import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import patternCreator from '../../../utils/patternCreator.js'

const app = getApp()

/**
 * options:
 * oldOrder
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,
    //options
    oldOrder: null,

    goodsList: [], //全部商品列表

    list: [],

    //模态框
    lookingIndex: 0,
    addressSelectList: [], //原地址list
    defaultIndex: 0, //可控
    failIndex: 0,
    showAddressSelect: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    if (!options.oldOrder) {
      wx.showToast({
        title: '参数缺失，请重新访问',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }

    let oldOrder = JSON.parse(options.oldOrder)
    console.log(oldOrder)
    let addressSelectList = oldOrder.goodsList.map((obj) => {
      return {
        text: obj.provinceName + obj.eparchyName + obj.cityName + obj.address + obj.custName
      }
    })
    console.log(addressSelectList)

    this.setData({
      oldOrder,
      addressSelectList,
    }, () => {
      this.init()
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法法方法方法方法方法方法方法
  //加一个选项
  addOneSelect: function() {
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
  onInputChange: function(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //绑定input
  onInputChange_index: function(e) {
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
  init: async function(callback) {
    const {
      oldOrder
    } = this.data

    await this.getGoodsList(oldOrder.activityCode)
    setTimeout(() => {
      this.addOneSelect()
      if (callback) {
        callback()
      }
    }, 20)
  },
  //重新初始化
  initRefresh: async function(activityCode) {
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
  //选择城市组件
  openCitypicker: function(e) {
    let indexwrap = e.currentTarget.dataset.indexwrap
    let {
      list
    } = this.data
    list[indexwrap].showCitypicker = true
    this.setData({
      list
    })
  },
  closeCitypicker: function(e) {
    let indexwrap = e.currentTarget.dataset.indexwrap
    let arr = e.detail
    console.log(arr)
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
  //开关商品列表
  toggleGoodsList: async function(e) {
    let indexwrap = e.currentTarget.dataset.param
    let {
      list,
      selectedActivityIndex,
      goodsList, //全部商品
    } = this.data

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
  //获取全部商品
  getGoodsList: function(activityCode) {
    return new Promise(async(resolve, reject) => {
      wx.showLoading({
        title: '请稍候...',
        mask: true,
      })
      let res = await requestw({
        url: allApiStr.getGoodsByQueryApi,
        data: {
          activityCode
        },
      })
      wx.hideLoading()
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
  selectGoods: function(e) {
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
  deleteItemWrap: function(e) {
    const self = this
    wx.showModal({
      title: '提示',
      content: '是否确认删除该认筹商品？',
      success: function(res) {
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
  //搜索商品列表
  inputSeachGoodsVal: function(e) {
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
  //点击添加商品
  clickAddbtn: function() {
    this.addOneSelect()
  },
  //使用原地址 非套购
  useOldAddress_fei: function(e) {
    let indexwrap = e.currentTarget.dataset.indexwrap
    let {
      oldOrder,
      list,
    } = this.data

    let goods = oldOrder.goodsList[0]
    console.log(goods)

    list[indexwrap].receiver = goods.custName
    list[indexwrap].receiverPhone = goods.phoneNumber
    list[indexwrap].receiverPhoneBak = goods.phoneNumberBak
    list[indexwrap].address = goods.address
    list[indexwrap].pickerCityVal = [{
      areaCode: goods.provinceCode,
      areaLevel: 'PROVINCE',
      areaName: goods.provinceName,
    }, {
      areaCode: goods.eparchyCode,
      areaLevel: 'EPARCHY',
      areaName: goods.eparchyName,
    }, {
      areaCode: goods.cityCode,
      areaLevel: 'CITY',
      areaName: goods.cityName,
    }]

    this.setData({
      list
    })
  },
  //原来是套购的要选择地址
  openAddressSelect: function(e) {
    console.log(e)
    let indexwrap = e.currentTarget.dataset.indexwrap
    this.setData({
      showAddressSelect: true,
      defaultIndex: this.data.failIndex,
      lookingIndex: indexwrap,
    })
  },
  closeAddressSelect: function() {
    this.setData({
      showAddressSelect: false
    })
  },
  addressSelectChange: function(e) {
    console.log(e)
    let index = e.detail.index
    this.setData({
      defaultIndex: index
    })
  },
  confirmAddressSelect: function() {
    this.setData({
      showAddressSelect: false,
      failIndex: this.data.defaultIndex,
    })

    //显示地址
    const {
      oldOrder,
      list,
      lookingIndex,
    } = this.data

    let goods = oldOrder.goodsList[this.data.defaultIndex]
    console.log(goods)

    list[lookingIndex].receiver = goods.custName
    list[lookingIndex].receiverPhone = goods.phoneNumber
    list[lookingIndex].receiverPhoneBak = goods.phoneNumberBak
    list[lookingIndex].address = goods.address
    list[lookingIndex].pickerCityVal = [{
      areaCode: goods.provinceCode,
      areaLevel: 'PROVINCE',
      areaName: goods.provinceName,
    }, {
      areaCode: goods.eparchyCode,
      areaLevel: 'EPARCHY',
      areaName: goods.eparchyName,
    }, {
      areaCode: goods.cityCode,
      areaLevel: 'CITY',
      areaName: goods.cityName,
    }]

    this.setData({
      list
    })
    //显示地址 end
  },
  //最后确定
  submitRc: function() {
    const {
      oldOrder,
      list,
    } = this.data

    console.log(list)

    //验证
    //非空
    let flagEmpty = true //可以的
    list.forEach((obj) => {
      if (!obj.selectedGoods ||
        obj.receiver == '' ||
        obj.receiverPhone == '' ||
        obj.address == '' ||
        !obj.pickerCityVal[0]
      ) {
        flagEmpty = false
      }
    })
    if (!flagEmpty) {
      wx.showToast({
        title: '信息请填写完整',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }

    if (oldOrder.goodsList.length == 1) { //原来是非套购 //必须有一个使用原来的地址
      let goods = oldOrder.goodsList[0]
      let flag = false
      list.forEach((obj) => {
        if (
          obj.receiver == goods.custName &&
          obj.receiverPhone == goods.phoneNumber &&
          obj.receiverPhoneBak == goods.phoneNumberBak &&
          obj.address == goods.address &&
          //地址
          obj.pickerCityVal[0] &&
          obj.pickerCityVal[1] &&
          obj.pickerCityVal[2] &&
          obj.pickerCityVal[0].areaCode == goods.provinceCode &&
          obj.pickerCityVal[1].areaCode == goods.eparchyCode &&
          obj.pickerCityVal[2].areaCode == goods.cityCode
        ) {
          flag = true
        }
      })
      if (!flag) {
        wx.showToast({
          title: '必须有一个商品使用原地址',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
    }
    //选择了套购的
    if (list[0].selectedGoods.ifMix && list[0].selectedGoods.ifMix == 1) {
      if (list.length < 2) {
        wx.showToast({
          title: '套购机型必须选择2个',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
    }
    //验证 end


    //修改成功返回
    console.log(list)
    console.log(oldOrder)
    let oldOrder_new = JSON.parse(JSON.stringify(oldOrder))
    oldOrder_new.goodsList = list.map((obj) => {
      let a = {
        ...obj.selectedGoods,
        goodsCount: 1,
        provinceCode: obj.pickerCityVal[0].areaCode,
        provinceName: obj.pickerCityVal[0].areaName,
        eparchyCode: obj.pickerCityVal[1].areaCode,
        eparchyName: obj.pickerCityVal[1].areaName,
        cityCode: obj.pickerCityVal[2].areaCode,
        cityName: obj.pickerCityVal[2].areaName,
        address: obj.address,
        custName: obj.receiver,
        phoneNumber: obj.receiverPhone,
        phoneNumberBak: obj.receiverPhoneBak,
      }
      return a
    })

    console.log(oldOrder_new)
    wx.setStorageSync('toTrade_changeGoods_oldOrder_new', oldOrder_new)
    wx.navigateBack()
  },
})