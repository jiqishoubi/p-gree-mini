import regeneratorRuntime from '../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../utils/requestw.js'
import allApiStr from '../../utils/allApiStr.js'
import drawQrcode from 'weapp-qrcode' //生成二维码
import wxml2canvas from '../../utils/wxml2canvas.js'
import Dialog from 'vant-weapp/dialog/dialog';

const app = getApp()

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
    couponSms: '', //验证码

    list: [],

    //导购员
    salerList: [],
    selectedSalerIndex: null, //选中的导购员索引

    //二维码modal
    showCodeModal: false,
    orderNo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let userInfo = wx.getStorageSync('gree_userInfo')
    console.log(userInfo)

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    this.init(
      's', userInfo.userCode, //导购员
      async() => {
        wx.hideLoading()
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
      address: '', //详细地址

      //选择城市组件
      showCitypicker: false,
      pickerCityVal: [null, null, null], //数组
      //商品列表
      showGoodsList: false,
      goodsList: goodsList,
      goodsItemZindex: 9, //关闭是9  打开是11  //goodsItem的zindex
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
  init: async function(type, code, callback) {
    this.setData({
      type
    })
    //获取活动、商品 
    let res1 = await this.getActivityList()
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
    console.log(res)
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
  //提交
  submitRc: async function() {
    const {
      type,
      saler,
      list,
      selectedActivityIndex,
      selectedSalerIndex,
      activityList,
      salerList,
    } = this.data

    //验证
    let flag = true //可以的
    list.forEach((obj) => {
      console.log(obj)
      if (list.length > 1) { //list大于1个
        if (obj.selectedGoods) {
          if (
            obj.receiver == '' ||
            obj.receiverPhone == '' ||
            obj.address == '' ||
            !obj.pickerCityVal[0]
          ) {
            flag = false
          }
        }
      } else { //list只有1个
        if (
          obj.receiver == '' ||
          obj.receiverPhone == '' ||
          obj.address == '' ||
          !obj.pickerCityVal[0]
        ) {
          flag = false
        }
      }
    })
    if (
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
    //验证 end

    //发送参数
    //arr
    let goodsListJson = list.filter((obj) => {
      return obj.selectedGoods
    }).map((obj) => {
      return {
        goodsCode: obj.selectedGoods.goodsCode,
        custName: obj.receiver,
        phoneNumber: obj.receiverPhone,
        provinceCode: obj.pickerCityVal[0].areaCode,
        eparchyCode: obj.pickerCityVal[1].areaCode,
        cityCode: obj.pickerCityVal[2].areaCode,
        address: obj.address,
      }
    })
    console.log(goodsListJson)
    let postData = {
      activityCode: activityList[selectedActivityIndex].activityCode, //         活动编码(非空)
      // salerUserCode: type == 'd' ? salerList[selectedSalerIndex].userCode : saler.userCode, //       导购员编码(非空)
      goodsListJsonStr: JSON.stringify(goodsListJson)
    }
    console.log(postData)

    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.submitPreOrderApi,
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

    //认筹成功
    this.setData({
      showCodeModal: true,
      orderNo: res.data.data.orderNo,
    }, () => {
      this.initCode(res.data.data.orderNo)
    })
  },
  //生成二维码
  initCode: function(orderNo) {
    setTimeout(() => {
      console.log('生成')
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: orderNo,
      })
    }, 20)
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
  getDepartInfo: function() {
    return new Promise(async(resolve, reject) => {
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
  getSalerUserList: function() {
    return new Promise(async(resolve, reject) => {
      const {
        departCode
      } = this.data
      let res = await requestw({
        url: allApiStr.getSalerUserListApi,
        data: {
          departCode
        },
      })
      console.log(res)
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
  onChangeSalerpicker: function(e) {
    let index = Number(e.detail.value)
    this.setData({
      selectedSalerIndex: index
    })
  },
  //绑定活动picker
  onChangeActivitypicker: function(e) {
    console.log(e)
    const {
      activityList
    } = this.data
    let index = Number(e.detail.value)
    this.setData({
      selectedActivityIndex: index
    })

    // this.getGoodsList(activityList[index].activityCode)
    this.initRefresh(activityList[index].activityCode)
  },
  //开关商品列表
  toggleGoodsList: function(e) {
    let indexwrap = e.currentTarget.dataset.param
    let {
      list,
      selectedActivityIndex,
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

    list[indexwrap].showGoodsList = !list[indexwrap].showGoodsList
    list[indexwrap].goodsItemZindex = list[indexwrap].goodsItemZindex == 11 ? 9 : 11
    this.setData({
      list
    })
  },
  //获取全部活动
  getActivityList: function() {
    return new Promise(async(resolve, reject) => {
      let res = await requestw({
        url: allApiStr.getActivityListApi,
      })
      console.log(res)
      if (res.data.code !== '0') {
        wx.showToast({
          title: '获取活动列表失败，' + res.data.message,
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      }
      this.setData({
        activityList: res.data.data,
        selectedActivityIndex: res.data.data.length == 1 ? 0 : null,
      })
      resolve(res)
    })
  },
  //获取全部商品
  getGoodsList: function(activityCode) {
    return new Promise(async(resolve, reject) => {
      let res = await requestw({
        url: allApiStr.getGoodsByQueryApi,
        data: {
          activityCode
        },
      })
      console.log(res)
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
    }, () => {
      //如果选择的是最后一个就再增加一个
      if (indexwrap == list.length - 1) {
        this.addOneSelect()
      }
    })
  },
  //点击删除
  deleteItemWrap: function(e) {
    Dialog.confirm({
      title: '提示',
      message: '是否确认删除该认筹商品？'
    }).then(() => {
      // on confirm
      let indexwrap = e.currentTarget.dataset.indexwrap
      let {
        list
      } = this.data
      list.splice(indexwrap, 1)
      this.setData({
        list
      })
    }).catch(() => {
      // on cancel
    })
  },
  //保存在本地
  saveToLocal: function() {
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    // const wrapperId = '#wrapper'
    // const drawClassName = '.draw'
    // const canvasId = 'canvas-map'
    // wxml2canvas(wrapperId, drawClassName, canvasId).then(() => {
    //   // canvas has been drawn
    //   // can save the image with wx.canvasToTempFilePath and wx.saveImageToPhotosAlbum 
    //   wx.canvasToTempFilePath({
    //     canvasId:'canvas-map',
    //     quality:0.8,
    //     success:function(e){
    //       console.log(e)
    //       if(!e.tempFilePath){
    //         wx.hideLoading()
    //       }
    //       wx.saveImageToPhotosAlbum({
    //         filePath: e.tempFilePath,
    //         success:function(e){
    //           wx.hideLoading()
    //           console.log(e)
    //         },
    //         fail:function(){
    //           wx.hideLoading()
    //         }
    //       })
    //     },
    //     fail:function(){
    //       wx.hideLoading()
    //     },
    //   })
    // })
    wx.canvasToTempFilePath({
      canvasId: 'myQrcode',
      quality: 0.8,
      success: function(e) {
        console.log(e)
        if (!e.tempFilePath) {
          wx.hideLoading()
        }
        wx.saveImageToPhotosAlbum({
          filePath: e.tempFilePath,
          success: function(e) {
            console.log(e)
            wx.hideLoading()
            wx.showToast({
              title: '操作成功',
              icon: 'none',
              mask: true,
              duration: 1500,
            })
          },
          fail: function() {
            wx.hideLoading()
          }
        })
      },
      fail: function() {
        wx.hideLoading()
      },
    })
  },
  //使用上方地址
  useUpAddress: function(e) {
    Dialog.confirm({
      title: '提示',
      message: '是否确认使用上方地址信息？'
    }).then(() => {
      // on confirm
      let indexwrap = e.currentTarget.dataset.indexwrap
      let {
        list
      } = this.data
      let upObj = list[indexwrap - 1]
      list[indexwrap] = JSON.parse(JSON.stringify(upObj))
      this.setData({
        list
      })
    }).catch(() => {
      // on cancel
    })
  },
  //搜索商品列表
  inputSeachGoodsVal: function(e) {
    console.log(e)
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
  // //短信验证码
  // getSms:async function(){
  //   let res=await requestw({
  //     url:allApiStr,
  //     data:
  //   })
  //   this.bgTimer()
  // },
  // bgTimer:function(){

  // },
  // endTimer:function(){

  // },
  // //短信验证码 end
})