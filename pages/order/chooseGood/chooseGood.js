import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //vant tree select组件
    treeSelectItems: [],
    mainActiveIndex: 0,
    activeId: [],
    max: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getGoodsGroup()
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
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
  //vant tree select组件
  onClickNav(e) {
    let mainIndex = e.detail.index
    this.setData({
      mainActiveIndex: mainIndex || 0
    })
    this.getGoodsList(mainIndex)
  },

  onClickItem({
    detail = {}
  }) {
    const {
      activeId
    } = this.data;

    const index = activeId.indexOf(detail.id);
    if (index > -1) {
      activeId.splice(index, 1);
    } else {
      activeId.push(detail.id);
    }

    this.setData({
      activeId
    });
  },
  //vant tree select组件 end
  //获取商品分类
  getGoodsGroup: async function() {
    let res = await requestw({
      url: allApiStr.getAllGoodsGroupApi,
    })
    console.log(res)
    if (res.data.code !== '0') {
      wx.showToast({
        title: '查询商品失败',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //处理一下数据
    res.data.data.forEach((obj) => {
      obj.text = obj.goodsGroupName
    })
    this.setData({
      treeSelectItems: res.data.data
    })
  },
  //根据商品分类获取商品列表
  getGoodsList: async function(mainIndex) {
    let {
      treeSelectItems
    } = this.data
    if (treeSelectItems[mainIndex].children) { //查过了
      return false
    }
    wx.showLoading({
      title: '请稍候...',
      mask: true,
    })
    let res = await requestw({
      url: allApiStr.getGoodsListByGroupApi,
      data: {
        goodsGroupCode: treeSelectItems[mainIndex].goodsGroupCode
      },
    })
    wx.hideLoading()
    console.log(res)
    if (
      res.data.code &&
      res.data.data &&
      res.data.data.length > 0
    ) { //查到了
      //处理一下数据
      res.data.data.forEach((obj) => {
        obj.id = obj.goodsCode
        obj.text = obj.goodsName
      })
      treeSelectItems[mainIndex].children = res.data.data
      this.setData({
        treeSelectItems
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