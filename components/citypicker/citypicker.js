import regeneratorRuntime from '../../utils/runtime.js' //让小程序支持asyc await
import requestw from '../../utils/requestw.js'
import allApiStr from '../../utils/allApiStr.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    activeColor:{
      type: String,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //tab
    active: 0,

    provinceList: [], //省份
    cityList: [], //城市
    areaList: [], //区县

    selectedProvince: null,
    selectedCity: null,
    selectedArea: null,

    title1: '',
    title2: '',
    title3: '',
  },

  /**
   * 周期
   */
  lifetimes: {
    attached: function() {
      this.initCitypicker()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //************回调函数************
    _onClose: function() {
      const {
        cityList,
        areaList,
        selectedProvince,
        selectedCity,
        selectedArea,
      } = this.data

      let arr
      if (
        (!selectedProvince) ||
        (cityList.length > 0 && !selectedCity) ||
        (areaList.length > 0 && !selectedArea)
      ) {
        //选择无效 还有没选的
        arr = [null, null, null]
      } else {
        //选择有效
        arr = [selectedProvince, selectedCity, selectedArea]
      }

      this.triggerEvent("onClose", arr)
    },
    //************回调函数 end************
    //初始化
    initCitypicker: function() {
      this.getProvinceList()
    },
    //绑定tab
    onChangeTab: function(e) {
      this.setData({
        active: e.detail.index
      }, () => {
        this.renderTitle()
      })
    },
    //获取省份
    getProvinceList: async function() {
      let result = await requestw({
        url: allApiStr.getProvinceListApi,
      })
      if (result.data.code !== '0') {
        return false
      }
      this.setData({
        active: 0,
        provinceList: result.data.data,
      }, () => {
        this.renderTitle()
      })
    },
    //获取城市
    getCityList: async function() {
      const {
        selectedProvince
      } = this.data
      let code = selectedProvince.areaCode
      let result = await requestw({
        url: allApiStr.getCityListApi,
        data: {
          areaCode: code
        },
      })
      if (result.data.code !== '0') {
        return false
      }
      this.setData({
        active: 1,
        cityList: result.data.data,
      }, () => {
        this.renderTitle()
      })
    },
    //获取区县
    getAreaList: async function() {
      const {
        selectedCity
      } = this.data
      let code = selectedCity.areaCode
      let result = await requestw({
        url: allApiStr.getAreaListApi,
        data: {
          areaCode: code
        },
      })
      if (result.data.code !== '0') {
        return false
      }
      this.setData({
        active: 2,
        areaList: result.data.data,
      }, () => {
        this.renderTitle()
      })
    },
    //点击省
    clickProvince: function(e) {
      let selectedProvince = e.currentTarget.dataset.param
      this.setData({
        selectedProvince,

        cityList: [],
        areaList: [],
        selectedCity: null,
        selectedArea: null,
      }, () => {
        this.getCityList()
      })
    },
    //点击城市
    clickCity: function(e) {
      let selectedCity = e.currentTarget.dataset.param
      this.setData({
        selectedCity,

        areaList: [],
        selectedArea: null,
      }, () => {
        this.getAreaList()
      })
    },
    //点击区县
    clickArea: function(e) {
      let selectedArea = e.currentTarget.dataset.param
      this.setData({
        selectedArea
      }, () => {
        this.renderTitle()
        this._onClose()
      })
    },
    //渲染title
    renderTitle: function() {
      const {
        active,
        selectedProvince,
        selectedCity,
        selectedArea
      } = this.data

      let title1 = selectedProvince ? selectedProvince.areaName : '请选择'
      let title2 = ''
      if (selectedCity) {
        title2 = selectedCity.areaName
      } else {
        if (active == 1) {
          title2 = '请选择'
        }
      }
      let title3 = ''
      if (selectedArea) {
        title3 = selectedArea.areaName
      } else {
        if (active == 2) {
          title3 = '请选择'
        }
      }

      this.setData({
        title1,
        title2,
        title3,
      })
    },
  }
})