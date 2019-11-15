import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'
import {
  formatDate,
  initQrcodeUrl,
  initQrcodeImgUrl,
  saveImgBaseLocal
} from '../../../utils/util.js'

/**
 * 消费者 订单 详情  //销售单
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
    qrcodeURL: '',
    //时间picker
    showTimePicker: false,
    currentDate: new Date().getTime(),
    minDate: '',
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
    this.setMinDate()
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
  //设定最小时间
  setMinDate: function() {
    let nowStr = formatDate(new Date(), 'yyyy-MM-dd hh')
    let nowHour = Number(nowStr.substring(11, 13))
    let minDate
    if (nowHour < 15) { //下午3点之前
      minDate = new Date(nowStr.substring(0, 10) + ' 00:00:00').getTime()
    } else { //下午3点之后
      minDate = new Date(nowStr.substring(0, 10) + ' 00:00:00').getTime() + 86400000
    }
    this.setData({
      minDate: minDate
    })
  },
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

    //处理安装时间
    res.data.data.goodsList.forEach((obj) => {
      if (obj.installOrderDTO && obj.installOrderDTO.reserveDateStr) {
        obj.installOrderDTO.reserveDateStr = obj.installOrderDTO.reserveDateStr.substring(0, 10)
      }
    })
    //处理安装时间 end

    console.log(this.data.type, res.data.data)

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
    setTimeout(async() => {
      const {
        type,
        info
      } = this.data

      let orderNo = type == 'preorder' ? info.orderNo : info.preOrderNo

      let imgData = await initQrcodeImgUrl(orderNo)

      this.setData({
        qrcodeURL: imgData
      })
    }, 20)
  },
  //保存在本地
  saveToLocal: function() {
    var imgSrc = this.data.qrcodeURL
    saveImgBaseLocal(imgSrc)
  },
  //时间picker
  onOpenTimePicker: function(e) {
    let index = e.currentTarget.dataset.index
    const {
      info,
      lookingGoodsIndex,
    } = this.data

    this.setData({
      showTimePicker: true,
      lookingGoodsIndex: index,
    })

    if (info.goodsList[index].reserveDateStr) {
      this.setData({
        currentDate: new Date(info.goodsList[index].reserveDateStr).getTime()
      })
    }
  },
  onCloseTimePicker: function() {
    this.setData({
      showTimePicker: false,
      // lookingGoodsIndex:null,
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
            lookingGoodsIndex,
          } = self.data

          console.log(info)
          console.log(lookingGoodsIndex)

          //发送参数
          let installOrderNo = info.goodsList[lookingGoodsIndex].installOrderNo
          let postData = {
            orderNo: installOrderNo, //售后单号
            reserveDate: formatDate(new Date(currentDate), 'yyyy-MM-dd'),
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
            title: '预约成功',
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
    let item = e.currentTarget.dataset.item
    console.log(item)
    wx.makePhoneCall({
      phoneNumber: item.installOrderDTO.installUserLoginName
    })
  },
  //修改安装地址modal
  onOpenAddressModal: function(e) {
    let index = e.currentTarget.dataset.index
    let {
      info
    } = this.data

    console.log(info)
    let installOrderDTO = info.goodsList[index].installOrderDTO

    //跳转
    let orderNo = info.goodsList[index].installOrderNo
    let oldAddress1 = installOrderDTO.provinceName + installOrderDTO.eparchyName + installOrderDTO.cityName
    let oldAddress2 = installOrderDTO.address
    wx.navigateTo({
      url: `/pages/order/changeAddress/changeAddress?orderNo=${orderNo}&oldAddress1=${oldAddress1}&oldAddress2=${oldAddress2}`,
    })
  },
})