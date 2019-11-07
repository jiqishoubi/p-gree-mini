import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

const app = getApp()

/**
 * 现场下单： 家用下单 商用下单 都跳到这
 * options:
 * type  //home busi  家用 商用
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    type: '', //home busi
    saler: null, //导购员的时候

    //活动
    activityList: [], //全部活动列表
    selectedActivityIndex: null,

    //选中的商品
    selectedList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    //导购员
    //家用商用
    let userInfo = wx.getStorageSync('gree_userInfo')
    console.log(userInfo)

    this.setData({
      type: options.type ? options.type : 'home',
      saler: userInfo,
    })

    this.getActivityList()

    //设置导航标题
    wx.setNavigationBarTitle({
      title: options.type == 'home' ? '家用下单' : '商用下单'
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
    //从选择商品页面回来
    if (wx.getStorageSync('from_choose2_selectedList')) {
      let selectedList = wx.getStorageSync('from_choose2_selectedList')
      wx.removeStorage({
        key: 'from_choose2_selectedList'
      })

      console.log(selectedList)
      this.setData({
        selectedList
      })
    }
    //从选择商品页面回来 end
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
  //绑定活动picker
  onChangeActivitypicker: function(e) {
    const {
      activityList,
      selectedActivityIndex, //old
    } = this.data
    let index = Number(e.detail.value)

    if (selectedActivityIndex == index) {
      return false
    }
    console.log('设置index')
    this.setData({
      selectedActivityIndex: index
    })
  },
  //获取全部活动
  getActivityList: function() {
    return new Promise(async(resolve, reject) => {
      const {
        type
      } = this.data
      let res = await requestw({
        url: type == 'home' ? allApiStr.getActivityListSaleApi : allApiStr.getActivityListApi,
        data: {
          activityType: type == 'home' ? 'HOME_USE' : 'BUSI_USE'
        },
      })
      console.log(res)
      if (res.data.code !== '0' || !res.data.data) {
        wx.showToast({
          title: '当前无活动',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
      }
      this.setData({
        activityList: res.data.data,
        selectedActivityIndex: res.data.data.length == 1 ? 0 : null, //如果只有一个 就选中
      })
      resolve(res)
    })
  },
  //去选择商品界面
  goChooseGoods: function() {
    const {
      activityList,
      selectedActivityIndex,
      selectedList,
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
    let activityCode = activityList[selectedActivityIndex].activityCode
    wx.navigateTo({
      url: `/pages/order/choose2/choose2?activityCode=${activityCode}&selectedGoodsList=${JSON.stringify(selectedList)}`,
    })
  },
  //点击下面的按钮
  clickBtn: function() {
    const {
      type,
      saler,
      activityList,
      selectedActivityIndex,
      selectedList,
    } = this.data

    //验证
    if (selectedActivityIndex == null) {
      wx.showToast({
        title: '请选择活动',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }
    if (selectedList.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    //跳转
    let typeCart = (type == 'home' ? 'HOME_USE' : 'BUSI_USE')
    let activityCode = activityList[selectedActivityIndex].activityCode

    if (typeCart == 'HOME_USE') { //家用下单购物车
      wx.navigateTo({
        url: `/pages/order/cart/cart?type=${typeCart}&activityCode=${activityCode}&selectedGoodsList=${JSON.stringify(selectedList)}`,
      })
    } else { //商用下单购物车
      wx.navigateTo({
        url: `/pages/order/cart_busi/cart_busi?type=${typeCart}&activityCode=${activityCode}&selectedGoodsList=${JSON.stringify(selectedList)}`,
      })
    }
  },
})