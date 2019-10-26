import regeneratorRuntime from '../../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../../utils/requestw.js'
import allApiStr from '../../../utils/allApiStr.js'

const app = getApp()

/**
 * 选择商品界面  都是操作selectedGoodsList然后renderPage
 * options：
 * activityCode //活动code
 * selectedGoodsList //已选中的goods 带count的
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

    //state
    active_left: 0,
    leftlist: [{
      goodsGroupCode: 'xuanzhongshangpin',
      goodsGroupName: '选中商品',
      goodsGroupDesc: '',
      children: [],
    }],
    //state end
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //1、设置options
    //(1)已选中的商品 把单个的goodsList处理成带count的
    if (options.selectedGoodsList) {
      // let goodsList = JSON.parse(options.selectedGoodsList)
      // let selectedGoodsList = []
      // goodsList.forEach((obj) => {
      //   //处理一下goodsList加上count
      //   obj.count = 1
      //   //selectedGoodsList里是否存在
      //   let index = -1 //不存在
      //   for (let i = 0; i < selectedGoodsList.length; i++) {
      //     if (selectedGoodsList[i].goodsCode == obj.goodsCode) {
      //       index = i
      //       break
      //     }
      //   }
      //   if (index > -1) { //存在
      //     selectedGoodsList[index].count = selectedGoodsList[index].count + 1
      //   } else { //不存在
      //     selectedGoodsList.push(obj)
      //   }
      // })

      // let {
      //   leftlist
      // } = this.data
      // leftlist[0].children = JSON.parse(JSON.stringify(selectedGoodsList))
      // console.log(selectedGoodsList)
      // this.setData({
      //   selectedGoodsList,
      //   leftlist,
      // })

      let selectedGoodsList = JSON.parse(options.selectedGoodsList)
      this.setData({
        selectedGoodsList
      }, () => {
        this.renderPage()
      })
    }
    //(2)活动code
    this.setData({
      activityCode: options.activityCode ? options.activityCode : null,
    })

    //2、获取数据 商品分类
    this.getGoodsGroup(options.activityCode)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //从搜索页回来
    if (wx.getStorageSync('from_choose2_search_selectedList')) {
      let selectedList = wx.getStorageSync('from_choose2_search_selectedList')
      console.log(selectedList)
      wx.removeStorage({
        key: 'from_choose2_search_selectedList'
      })
      let {
        selectedGoodsList
      } = this.data
      selectedList.forEach((obj) => {
        //判断obj是否存在于selectedGoodsList
        let index = -1
        for (let i = 0; i < selectedGoodsList.length; i++) {
          if (obj.goodsCode == selectedGoodsList[i].goodsCode) {
            index = i
            break
          }
        }

        if (index == -1) {
          obj.count = 1
          selectedGoodsList.push(obj)
        }
      })

      this.setData({
        selectedGoodsList
      }, () => {
        this.renderPage()
      })
    }
    //从搜索页回来 end
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方
  //打开搜索页面
  goSearch: function () {
    wx.navigateTo({
      url: `/pages/order/choose2_search/choose2_search?activityCode=${this.data.activityCode}`,
    })
  },
  // 点击左侧
  chooseleft: function (e) {
    let indexleft = e.currentTarget.dataset.param

    this.setData({
      active_left: indexleft
    })

    this.getGoodsList(indexleft)
  },
  //获取商品分类
  getGoodsGroup: async function (activityCode) {
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
      return false
    }
    this.setData({
      leftlist: [...this.data.leftlist, ...res.data.data],
    })
  },
  //根据商品分类获取商品列表
  getGoodsList: async function (indexleft) {
    let {
      leftlist
    } = this.data

    if (leftlist[indexleft].children) {
      return false
    }

    let postData = {
      goodsGroup: leftlist[indexleft].goodsGroupCode, //根据商品分类
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
      //处理一下数据
      res.data.data.forEach((obj) => {
        obj.count = 0
      })

      leftlist[indexleft].children = res.data.data
      this.setData({
        leftlist
      }, () => {
        this.renderPage()
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
  onChangeStep: function (e) {
    let indexright = e.currentTarget.dataset.param //indexright
    let value = e.detail //步进器数量
    console.log(value)
    let {
      selectedGoodsList,
      active_left,
      leftlist,
    } = this.data

    console.log(selectedGoodsList)

    let goodsCode = leftlist[active_left].children[indexright].goodsCode //当前操作的goodsCode

    //看selectedGoodsList里有没有
    let indexInSelected = -1
    for (let i = 0; i < selectedGoodsList.length; i++) {
      if (selectedGoodsList[i].goodsCode == goodsCode) {
        indexInSelected = i
      }
    }

    //处理selectedGoodsList
    if (indexInSelected == -1) { //selected里本来没有
      let goods = JSON.parse(JSON.stringify(leftlist[active_left].children[indexright]))
      if (value > 0) {
        console.log('没有，增加')
        goods.count = value
        selectedGoodsList.push(goods)
      }
    } else {
      if (value == 0) {
        console.log('有，0')
        selectedGoodsList.splice(indexInSelected, 1)
      } else {
        console.log('有，增加')
        selectedGoodsList[indexInSelected].count = value
      }
    }

    console.log(selectedGoodsList)
    this.setData({
      selectedGoodsList
    }, () => {
      this.renderPage()
    })
  },
  //绘制界面
  renderPage: function () {
    let {
      selectedGoodsList,
      leftlist
    } = this.data

    leftlist.forEach((left) => {
      if (left.children) {
        left.children.forEach((obj) => {
          let index = -1
          for (let i = 0; i < selectedGoodsList.length; i++) {
            if (obj.goodsCode == selectedGoodsList[i].goodsCode) {
              index = i
            }
          }
          if (index > -1) {
            obj.count = selectedGoodsList[index].count
          } else {
            obj.count = 0
          }
        })
      }
    })

    leftlist[0].children = JSON.parse(JSON.stringify(selectedGoodsList))
    this.setData({
      leftlist
    })
  },
  //点击下一步
  clickBtn: function () {
    const {
      selectedGoodsList
    } = this.data

    //验证
    if (selectedGoodsList.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none',
        mask: true,
        duration: 1500,
      })
      return false
    }
    //验证 end

    wx.setStorageSync('from_choose2_selectedList', selectedGoodsList)
    wx.navigateBack()
  },
})