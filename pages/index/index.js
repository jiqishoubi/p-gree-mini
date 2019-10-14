//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //banner
    imgList:[
      'https://cdn.s.bld365.com/getli_index_banner_02.png'
    ]
  },
  onLoad: function () {
    
  },
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //切换tabbar
  onChange_tabbar: function (e) {
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
  goPage:function(e){
    let url=e.currentTarget.dataset.item
    console.log(url)
    wx.navigateTo({
      url,
    })
  }
})
