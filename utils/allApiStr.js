const allApiStr = {
  //公共
  //citypicker组件 省市区
  getProvinceListApi: '/mp/getProvinceList',
  getCityListApi: '/mp/getEparchyListByProvince',
  getAreaListApi: '/mp/getCityListByEparchy',

  //登录页
  loginApi: '/mp/doLogin', //登录
  getUserinfoApi: '/mp/getUserInfo', //获取个人信息 


  getAllGoodsGroupApi: '/mp/cust/goodsGroup/queryAll', //获取所有商品分类
  getGoodsListByGroupApi: '/mp/cust/goods/queryByGroup', //根据商品分类获取商品列表
  getActivityTypeApi: '', //获取活动类型

  getSalerInfoApi: '/mp/cust/user/getSaleUserInfo', //获取导购员详情
  getSaleDepartInfoApi: '/mp/cust/depart/getSaleDepartInfo', //获取门店信息
  getSalerUserListApi: '/mp/cust/depart/getSalerUserByDepartCode', //获取门店下的导购员列表

  //认筹下单
  getActivityListApi: '/mp/preorder/getActivityList', //查认筹的活动 token activityType  PRE_SALE-家用认筹; BUSI_USE-商用认筹
  submitPreOrderApi: '/mp/preorder/submitPreOrder', //提交认筹单
  getPreOrderListApi: '/mp/preorder/getPreOrderList', //获取认筹订单列表
  getPreOrderInfoApi: '/mp/preorder/getPreOrderInfo', //获取认筹订单详情

  //转销售
  getRenchouListApi: '/mp/preorder/getPreOrderList', //搜索认筹单列表
  getTradeListApi: '/mp/trade/getTradeList', //查询销售单列表
  getTradeOrderInfoApi: '/mp/trade/getTradeInfo', //获取销售单详情
  reserveTimeApi: '/mp/installorder/updateInstallOrderInfo', //预约安装时间 修改售后单信息
  

  //选择商品choose2
  getGoodsGroupByQueryApi: '/mp/cust/goodsGroup/queryByGoods', //根据条件获取商品分类
  getGoodsByQueryApi: '/mp/cust/goods/query', //根据条件获取商品

  //销售单
  getActivityListSaleApi: '/mp/trade/getActivityList', //查销售单的活动 token activityType  HOME_USE-家用; BUSI_USE-商用
  sumbitSaleOrderApi: '/mp/trade/submitTrade', //提交销售单

}

export default allApiStr