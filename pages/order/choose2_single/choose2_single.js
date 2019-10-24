import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

/**
 * 选择商品界面 (单选)
 * options：
 * activityCode //活动code
 * selectedGoods  //obj
 * lookingIndex  //上一页的商品index
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // options
    activityCode: null, //活动code
    selectedGoods: [], //已选中的商品 //options过来的数据
    lookingIndex: null, //上一页的商品index

    //搜索
    searchVal: '',

    //state
    active_left: 0,
    leftlist: [],
    //state end
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    //1、设置options
    //(1)已选中的商品
    if (options.selectedGoodsList) {
      let selectedGoods = JSON.parse(options.selectedGoods)
      this.setData({
        selectedGoods
      })
    }
    //(2)活动code lookingIndex
    this.setData({
      activityCode: options.activityCode ? options.activityCode : null,
      lookingIndex: options.lookingIndex,
    })

    //2、获取数据 商品分类
    await this.getGoodsGroup(options.activityCode)
    this.getGoodsList(0)
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方
  //打开搜索页面
  goSearch: function() {
    const {lookingIndex}=this.data
    wx.navigateTo({
      url: `/pages/order/choose2_search_single/choose2_search_single?activityCode=${this.data.activityCode}&lookingIndex=${lookingIndex}`,
    })
  },
  // 点击左侧
  chooseleft: function(e) {
    let indexleft = e.currentTarget.dataset.param

    this.setData({
      active_left: indexleft
    })

    this.getGoodsList(indexleft)
  },
  //点击右侧
  chooseRight: function(e) {
    let index = e.currentTarget.dataset.index
    const {
      active_left,
      leftlist,
      lookingIndex,
    } = this.data

    let goods = leftlist[active_left].children[index]
    console.log(goods)

    wx.setStorageSync('from_choose2_single_selectedGoods', goods)
    wx.setStorageSync('from_choose2_single_lookingIndex', lookingIndex)
    wx.navigateBack()
  },
  //获取商品分类
  getGoodsGroup: async function(activityCode) {
    return new Promise(async(resolve, reject) => {
      let postData = {
        activityCode: activityCode ? activityCode : null, //根据活动
      }
      let res = await requestw({
        url: allApiStr.getGoodsGroupByQueryApi,
        data: postData,
      })
      console.log(res)
      if (res.data.code !== '0') {
        wx.showToast({
          title: '查询商品失败',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        resolve()
        return false
      }
      this.setData({
        leftlist: [...this.data.leftlist, ...res.data.data],
      }, () => {
        resolve()
      })
    })
  },
  //根据商品分类获取商品列表
  getGoodsList: async function(indexleft) {
    let {
      leftlist
    } = this.data

    if (leftlist[indexleft].children) {
      return false
    }

    let postData = {
      goodsGroupCode: leftlist[indexleft].goodsGroupCode, //根据商品分类
      activityCode: this.data.activityCode ? this.data.activityCode : null, //根据活动
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
    console.log(res)

    if (
      res.data.code &&
      res.data.data &&
      res.data.data.length > 0
    ) { //查到了
      leftlist[indexleft].children = res.data.data
      this.setData({
        leftlist
      })
    } else { //没有
      wx.showToast({
        title: '该分类暂无商品',
        icon: 'none',
        // mask: true,
        duration: 1500,
      })
    }
  },
})