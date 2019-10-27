import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navIndex: 0,
    navList: ['已认筹', '已登录', '已下单', '已退单'],
    showList: [],

    page: 1, //请求的page
    pageSize: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getData(false)
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
    this.getData(false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getData(true)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法法方法方法方法
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
  //回到顶部
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0,
      })
    }
  },
  //点击上面的状态
  clickNav: function(e) {
    let index = e.currentTarget.dataset.index
    const {
      navIndex
    } = this.data
    if (navIndex == index) {
      return false
    }

    this.setData({
      navIndex: index,
      page: 1,
    }, () => {
      this.getData(false)
    })
    this.goTop()
  },
  //获取列表
  getData: async function(isScroll) {
    const {
      navIndex,
      page,
      pageSize,
      showList,
    } = this.data

    //page
    let getPage
    if (isScroll) {
      getPage = page
    } else {
      getPage = 1
    }

    //url
    let url
    if (navIndex == 0 || navIndex == 1) { //认筹单接口
      url = allApiStr.getPreOrderListApi
    } else { //销售单接口
      url = allApiStr.getTradeListApi
    }
    //postData
    let postData
    switch (navIndex) {
      case 0:
        postData = {
          orderType: 'HOME_USE',
          orderStatus: '50',
        }
        break
      case 1:
        postData = {
          orderType: 'BUSI_USE',
          orderStatus: '20,50,93',
        }
        break
      case 2:
        postData = {
          notTradeStatus: '93',
        }
        break
      case 3:
        postData = {
          tradeStatus: '93',
        }
        break
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url,
      data: {
        page: getPage,
        rows: pageSize,
        ...postData,
      },
    })
    wx.hideLoading()
    wx.stopPullDownRefresh()
    //没查到
    if (
      res.data.code !== '0' ||
      !res.data.data ||
      !res.data.data.data
    ) {
      if (isScroll) {

      } else {
        this.setData({
          showList: []
        })
      }
      return false
    }

    //查到了
    //list
    let list
    if (isScroll) {
      list = [...showList, ...res.data.data.data]
    } else {
      list = res.data.data.data
    }

    this.setData({
      page: page + 1,
      showList: list,
    })
  },
  //去订单详情
  goDetail: function(e) {
    let item = e.currentTarget.dataset.item
    const {
      navIndex
    } = this.data

    console.log(item)

    let code, typeUse
    switch (navIndex) {
      case 0: //已认筹 外面的转销售的 另一个入口
        wx.navigateTo({
          url: `/pages/order/doing_search_detail/doing_search_detail?order=${JSON.stringify(item)}`,
        })
        break
      case 1: //已登录 已认筹的商用 去下单
        wx.navigateTo({
          url: `/pages/order/order_detail_yidenglu/order_detail_yidenglu?order=${JSON.stringify(item)}`,
        })
        break
      default: //2、3 //已下单 销售单 可能是家用或商用  //已退单
        code = item.tradeNo

        typeUse = item.tradeType == 'BUSI_USE' ? 'busi' : 'home'
        if (typeUse == 'busi') {
          wx.navigateTo({
            url: `/pages/order/order_detail_busi/order_detail_busi?type=trade&code=${code}`,
          })
        } else {
          wx.navigateTo({
            url: `/pages/order/order_detail/order_detail?type=trade&code=${code}`,
          })
        }
        break
    }
  },
})