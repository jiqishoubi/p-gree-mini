import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

const app = getApp()

/**
 * options：
 * activityCode //活动code
 * selectedGoodsList //已选中的goods
 */

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isX: app.globalData.isX,

    // options
    activityCode: null, //活动code
    selectedGoodsList: [], //已选中的商品 //options过来的数据

    //搜索
    searchVal: '',

    active_left: 0,
    leftlist: [{
      goodsGroupCode: 'xuanzhongshangpin',
      goodsGroupName: '选中商品',
      goodsGroupDesc: '',
      children: [],
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    console.log(options)
    //1、设置options
    //(1)已选中的商品
    if (options.selectedGoodsList) {
      let goodsList = JSON.parse(options.selectedGoodsList)
      console.log(goodsList)
      let selectedGoodsList = []
      goodsList.forEach((obj) => {
        //处理一下goodsList加上count
        obj.count = 1
        //selectedGoodsList里是否存在
        let index = -1 //不存在
        for (let i = 0; i < selectedGoodsList.length; i++) {
          if (selectedGoodsList[i].goodsCode == obj.goodsCode) {
            index = i
            break
          }
        }
        if (index > -1) { //存在
          selectedGoodsList[index].count = selectedGoodsList[index].count + 1
        } else { //不存在
          selectedGoodsList.push(obj)
        }
      })

      let {
        leftlist
      } = this.data
      leftlist[0].children = selectedGoodsList
      this.setData({
        selectedGoodsList,
        leftlist,
      })
    }
    //(2)活动code
    this.setData({
      activityCode: options.activityCode ? options.activityCode : null,
    }, async() => {

      //2、获取数据 商品分类
      await this.getGoodsGroup()
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
    //从搜索页回来
    if (wx.getStorageSync('from_choose2_search_selectedList')) {
      let selectedList = wx.getStorageSync('from_choose2_search_selectedList')
      console.log(selectedList)
      wx.removeStorage({
        key:'from_choose2_search_selectedList'
      })
      
    }
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
    wx.navigateTo({
      url: `/pages/order/choose2_search/choose2_search?activityCode=${this.data.activityCode}`,
    })
  },
  // 选择左侧
  chooseleft: function(e) {
    const {
      leftlist
    } = this.data
    let index = e.currentTarget.dataset.param
    this.setData({
      active_left: index
    }, () => {
      this.getGoodsList()
    })

    //点回选中商品
    if (index == 0) {
      this.calcuSelectedGoodsList()
    } else { //点其他
      if (leftlist[index].children) {
        this.calcuOtherGoodsList(index)
      }
    }
  },
  //获取商品分类
  getGoodsGroup: async function() {
    let postData = {
      activityCode: this.data.activityCode ? this.data.activityCode : null, //根据活动
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
      return false
    }
    this.setData({
      leftlist: [...this.data.leftlist, ...res.data.data],
    })
  },
  //根据商品分类获取商品列表
  getGoodsList: async function() {
    let {
      active_left,
      leftlist
    } = this.data
    if (leftlist[active_left].children) { //查过了 //选中商品是第一个，有children了 也不查了
      return false
    }

    let postData = {
      goodsGroupCode: leftlist[active_left].goodsGroupCode, //根据商品分类
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
      //处理一个数据
      res.data.data.forEach((obj) => {
        obj.count = 0
      })

      //查完商品列表 要看selectedGoodsList里是否包含
      res.data.data.forEach((obj) => {
        let index = -1
        const {
          leftlist
        } = this.data
        let selectedGoodsList = leftlist[0].children
        for (let i = 0; i < selectedGoodsList.length; i++) {
          if (obj.goodsCode == selectedGoodsList[i].goodsCode) {
            index = i
            break
          }
        }
        if (index > -1) { //selectedGoodsList里有
          obj.count = selectedGoodsList[index].count
        }
      })


      leftlist[active_left].children = res.data.data
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
  //步进器组件
  onChangeStep: function(e) {
    let index = e.currentTarget.dataset.param
    let value = e.detail
    let {
      active_left,
      leftlist,
    } = this.data
    leftlist[active_left].children[index].count = value

    this.setData({
      leftlist,
    })
  },
  //计算选中商品
  calcuSelectedGoodsList: function() {
    const {
      leftlist
    } = this.data

    let selectedGoodsList = []
    for (let i = 1; i < leftlist.length; i++) {
      if (leftlist[i].children) {
        leftlist[i].children.forEach((obj) => {
          if (obj.count > 0) {
            selectedGoodsList.push(JSON.parse(JSON.stringify(obj)))
          }
        })
      }
    }

    leftlist[0].children = selectedGoodsList
    this.setData({
      leftlist
    })
  },
  //计算其他分类的商品列表 根据selectedGoodsList
  calcuOtherGoodsList: function(indexleft) {
    let {
      leftlist
    } = this.data

    let selectedGoodsList = leftlist[0].children
    let goodsList = leftlist[indexleft].children

    console.log('计算')
    goodsList.forEach((obj) => {
      let index = -1
      for (let i = 0; i < selectedGoodsList.length; i++) {
        if (obj.goodsCode == selectedGoodsList[i].goodsCode) {
          index = i
        }
      }
      console.log(index)
      if (index > -1) {
        obj.count = selectedGoodsList[index].count
      }
    })

    leftlist[indexleft].children = goodsList
    this.setData({
      leftlist
    })
  },
  //点击下一步
  clickBtn: function() {
    const {
      leftlist
    } = this.data
    let arr = []
    leftlist.forEach((left) => {
      if (left.children) {
        left.children.forEach((right) => {
          if (right.count > 0) {
            arr.push(right)
          }
        })
      }
    })
    console.log(arr)
    //验证
    if (arr.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    wx.navigateTo({
      url: `/pages/order/submitOrder/submitOrder?selectedArr=${JSON.stringify(arr)}`,
    })
  },
})