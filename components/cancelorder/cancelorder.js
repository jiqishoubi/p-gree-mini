// components/cancelorder/cancelorder.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    resultVal: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //************回调函数************
    _onCancel: function() {
      this.setData({
        resultVal: ''
      })
      console.log('关闭')
      this.triggerEvent("onCancel")
    },
    _onConfirm: function() {
      const {
        resultVal
      } = this.data
      console.log('确定')
      //验证
      if (resultVal == '') {
        wx.showToast({
          title: '请输入取消原因',
          icon: 'none',
          mask: true,
          duration: 1500,
        })
        return false
      }
      //验证 end

      this.triggerEvent("onConfirm", resultVal)
    },
    //************回调函数 end************
    //方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法方法
    //绑定input
    onInputChange: function(e) {
      let key = e.currentTarget.dataset.key
      let value = e.detail.value
      this.setData({
        [key]: value
      })
    },
    resetVal: function() {
      console.log('清空')
      this.setData({
        resultVal: ''
      })
    },
  }
})