import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import drawQrcode from 'weapp-qrcode' //生成二维码
import {
  formatDate
} from '../../../utils/util.js'

/**
 * 消费者 订单 详情  //销售单 商用订单详情
 * options:
 * type  //preorder  trade
 * code //订单号
 * 
 * 注：tradeStatus==93 已退单
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //options
    type: '',
    code: '',

    info: {},

    // 安装进度
    steps: [{
        text: '已预约',
      },
      {
        text: '正在安装',
      },
      {
        text: '已完成',
      }
    ],

    //modal
    //二维码modal
    showCodeModal: false,
    //时间picker
    showTimePicker: false,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    lookingGoodsIndex: null,
    formatterPicker: (type, value) => {
      let str = ''
      switch (type) {
        case 'year':
          str = '年'
          break
        case 'month':
          str = '月'
          break
        case 'day':
          str = '日'
          break
        case 'hour':
          str = '时'
          break
        case 'minute':
          str = '分'
          break
      }
      return value + str
    },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (!options.type) {
      wx.showToast({
        title: '参数缺失，请重新访问',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    this.setData({
      type: options.type,
      code: options.code,
    }, () => {
      this.getInfo()
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
    this.getInfo()
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //获取订单详情
  getInfo: async function() {
    const {
      type,
      code
    } = this.data

    //发送参数
    let url, postData
    if (type == 'preorder') {
      url = allApiStr.getPreOrderInfoApi
      postData = {
        orderNo: code,
      }
    } else {
      url = allApiStr.getTradeOrderInfoApi
      postData = {
        tradeNo: code,
      }
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: url,
      data: postData,
    })
    wx.hideLoading()
    console.log(res)

    if (
      res.data.code !== '0' ||
      !res.data.data
    ) {
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }

    this.setData({
      info: res.data.data
    })
  },
  //二维码modal
  //打开认筹单号二维码
  openCodeModal: function() {
    this.setData({
      showCodeModal: true,
    }, () => {
      this.initCode()
    })
  },
  closeCodeModal: function() {
    this.setData({
      showCodeModal: false,
    })
  },
  //生成二维码
  initCode: function() {
    setTimeout(() => {
      const {
        type,
        info
      } = this.data

      let orderNo = type == 'preorder' ? info.orderNo : info.preOrderNo
      console.log('生成')
      drawQrcode({
        width: 200,
        height: 200,
        canvasId: 'myQrcode',
        text: orderNo,
      })
    }, 20)
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
  //时间picker
  onOpenTimePicker: function(e) {
    const {
      info,
    } = this.data

    this.setData({
      showTimePicker: true,
    })

    if (info.installOrderDTO.reserveDateStr) {
      this.setData({
        currentDate: new Date(info.installOrderDTO.reserveDateStr).getTime()
      })
    }
  },
  onCloseTimePicker: function() {
    this.setData({
      showTimePicker: false,
    })
  },
  onInputTimePicker: function(e) {
    this.setData({
      currentDate: e.detail,
    })
  },
  onConfirmTimePicker: function(e) {
    this.setData({
      currentDate: e.detail,
    }, () => {
      this.reserveTime()
    })
  },
  //时间picker end
  //预约安装时间
  reserveTime: function() {
    const self = this

    wx.showModal({
      title: '提示',
      content: '是否确认预约安装时间？',
      success: async function(res) {
        if (res.confirm) {
          // on confirm
          self.onCloseTimePicker()
          const {
            info,
            currentDate,
          } = self.data

          console.log(info)

          //发送参数
          let postData = {
            orderNo: info.installOrderNo, //售后单号
            reserveDate: formatDate(new Date(currentDate), 'yyyy-MM-dd hh:mm:ss'),
          }
          wx.showLoading({
            title: '请稍候...',
            mask: true,
          })
          let res = await requestw({
            url: allApiStr.reserveTimeApi,
            data: postData,
          })
          wx.hideLoading()

          console.log(res)
          if (
            res.data.code !== '0'
          ) {
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              // mask: true,
              duration: 1500,
            })
            return false
          }

          wx.showToast({
            title: '操作成功',
            icon: 'none',
            // mask: true,
            duration: 1500,
          })
          //刷新页面
          self.getInfo()
        }
      },
    })
  },
  //给安装师傅打电话
  callInstaller: function(e) {
    const {
      info
    } = this.data
    wx.makePhoneCall({
      phoneNumber: info.installOrderDTO.installUserLoginName
    })
  },
  //修改安装地址modal
  onOpenAddressModal: function(e) {
    let {
      info
    } = this.data

    console.log(info)
    let installOrderDTO = info.installOrderDTO

    //跳转
    let orderNo = info.installOrderNo
    let oldAddress1 = installOrderDTO.provinceName + installOrderDTO.eparchyName + installOrderDTO.cityName
    let oldAddress2 = installOrderDTO.address
    wx.navigateTo({
      url: `/pages/order/changeAddress/changeAddress?orderNo=${orderNo}&oldAddress1=${oldAddress1}&oldAddress2=${oldAddress2}`,
    })
  },
})