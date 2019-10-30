import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'


/**
 * options：
 * activityCode //活动code
 * lookingIndex
 * isTaogou //是否套购
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {

    activityCode: null, //活动code
    lookingIndex: null,

    searchVal: '',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      activityCode: options.activityCode ? options.activityCode : null,
      lookingIndex: options.lookingIndex,
      isTaogou: options.isTaogou == 'true' ? true : false,
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //返回上一页
  goBack: function() {
    wx.navigateBack()
  },
  //绑定input
  onInputChange: function(e) {
    let key = e.currentTarget.dataset.key
    let value = e.detail.value
    this.setData({
      [key]: value
    })
  },
  //input完成
  clickSearch: function() {
    this.getData()
  },
  //获取商品列表
  getData: async function() {
    const {
      searchVal
    } = this.data
    //验证
    if (searchVal == '') {
      wx.showToast({
        title: '请输入搜索条件',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    //发送参数
    let postData = {
      goodsNameOrModelLike: searchVal,
      activityCode: this.data.activityCode ? this.data.activityCode : null,
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.getGoodsByQueryApi,
      data: postData,
    })
    wx.hideLoading()

    if (res.data.code !== '0' || !res.data.data) {
      wx.showToast({
        title: '暂无数据',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
      return false
    }

    this.setData({
      list: res.data.data
    })
  },
  //点选结果
  clickresultItem: function(e) {
    let index = e.currentTarget.dataset.index
    let {
      lookingIndex,
      list,
    } = this.data
    let goods = list[index]

    wx.setStorageSync('from_choose2_single_selectedGoods', goods)
    wx.setStorageSync('from_choose2_single_lookingIndex', lookingIndex)
    wx.navigateBack({
      delta: 2
    })
  },
  //点击确定
  clickBtn: function() {
    let {
      list
    } = this.data
    let selectedList = list.filter((obj) => {
      return obj.selected
    })

    if (selectedList.length == 0) {
      this.goBack()
      return false
    }

    wx.setStorageSync('from_choose2_search_selectedList', selectedList)
    this.goBack()
  },
})