const allApiStr = {
  //公共
  //citypicker组件 省市区
  getProvinceListApi: '/mp/getProvinceList',
  getCityListApi: '/mp/getEparchyListByProvince',
  getAreaListApi: '/mp/getCityListByEparchy',

  //登录页
  loginApi: '/mp/doLogin', //登录
  
  getAllGoodsGroupApi:'/mp/cust/goodsGroup/queryAll', //获取所有商品分类
  getGoodsListByGroupApi:'/mp/cust/goods/queryByGroup', //根据商品分类获取商品列表
  getActivityTypeApi:'', //获取活动类型

  submitOrderApi:'', //提交订单

  //认筹
  getSalerInfoApi: '/mp/cust/user/getSaleUserInfo', //获取导购员详情
  getSaleDepartInfoApi: '/mp/cust/depart/getSaleDepartInfo', //获取门店信息
  getSalerUserListApi: '/mp/cust/depart/getSalerUserByDepartCode', //获取门店下的导购员列表

  getActivityListApi: '/mp/preorder/getActivityList', //查活动 

  submitPreOrderApi: '/mp/preorder/submitPreOrder', //提交认筹单
  getPreOrderListApi: '/mp/cust/preorder/getPreOrderList', //获取认筹订单列表

  //转销售
  getRenchouListApi:'/mp/preorder/getPreOrderList', //搜索认筹单列表
  getTradeListApi:'/mp/trade/getTradeList', //查询销售单列表

  //选择商品choose2
  getGoodsGroupByQueryApi:'/mp/cust/goodsGroup/queryByGoods', //根据条件获取商品分类
  getGoodsByQueryApi:'/mp/cust/goods/query', //根据条件获取商品
}

export default allApiStr