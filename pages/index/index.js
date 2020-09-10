import regeneratorRuntime from '../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../utils/requestw.js'
import allApiStr from '../../utils/allApiStr.js'

const app = getApp()

Page({
  data: {
    //banner
    imgList: [
      // 'https://cdn.s.bld365.com/getli_index_banner_02.png'
      'https://cdn.s.bld365.com/getli_index_banner_02_new.png'
    ],

    userInfo: {},

    //统计数据
    countData: {},
  },
  onLoad: function() {
    let userInfo = wx.getStorageSync('gree_userInfo')
    console.log(userInfo)
    this.setData({
      userInfo
    })

    //统计数据
    this.getData()
  },
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //切换tabbar
  onChange_tabbar: function(e) {
    let index = e.detail
    switch (index) {
      case 0:
        wx.redirectTo({
          url: '/pages/index/index',
        })
        break
      case 1:
        wx.redirectTo({
          url: '/pages/statistics/statistics_index/statistics_index',
        })
        break
      case 2:
        wx.redirectTo({
          url: '/pages/order/order_index/order_index',
        })
        break
      case 3:
        wx.redirectTo({
          url: '/pages/wode/wode_index/wode_index',
        })
        break
    }
  },
  goPage: function(e) {
    let url = e.currentTarget.dataset.item
    console.log(url)
    wx.navigateTo({
      url,
    })
  },
  //统计数据
  getData: async function() {
    let res = await requestw({
      url: allApiStr.getStatisticsIndexApi,
    })
    console.log(res)
    if (res.data.code !== '0') {
      return false
    }
    this.setData({
      countData: res.data.data
    })
  },
})