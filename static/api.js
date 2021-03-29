export default {
  login: {
    login: '/starday-auth/login/user/account/login.do',
    Code: '/starday-auth/login/user/email/send/',
    emileLogin: '/starday-auth/login/user/',
    out: '/starday-auth/login/login/out',
    linelogin: '/starday-auth/login/user/third/oauth/login.do',
    // 游客登录发送邮箱验证码
    guestSendCode: '/starday-auth/login/guest/email/send/',
    // 游客邮箱验证码登录
    guestLogin: '/starday-auth/login/guest/email/login.do'
  },
  register: {
    sendCode: '/starday-auth/register/user/email/send/',
    register: '/starday-auth/register/user/register.do',
    // 会员注册验证码校验
    codeCheck: '/starday-auth/register/user/verify/',
    captcha: '/starday-auth/register/easy/captcha/'
  },
  home: {
    CouponPopup: '/starday-activity/user/coupon/systemSend',
    secKillList: '/starday-activity/flash_sale/list',
    indexData: '/starday-system/user/app/getDefFirstPage'
  },
  coupon: {
    receive: '/starday-activity/user/coupon/receive',
    // 我的优惠券
    mycoupon: '/starday-activity/user/user_coupon/list',
    // 用户查询优惠券详情
    couponInfo: '/starday-activity/coupon/getDetail',
    // 会员领取优惠券邮箱验证码发送
    receiveSendCode: '/starday-user/user/coupon/send/',
    // 会员领取优惠券邮箱验证码验证
    receiveVerifyCode: '/starday-user/user/coupon/verify/email/code'
  },
  cart: {
    changeNum: '/starday-order/shopCart/number',
    // 勾选计算价格
    shopCartCheckCalc: '/starday-order/order/shopCartCheckCalc',
    // 勾选购物项
    checked: '/starday-order/shopCart/checked',
    // 购物车商品移入收藏夹
    moveToFavorites: '/starday-order/shopCart/moveToFavorites',
    // 删除购物车指定商品
    deleteGoods: '/starday-order/shopCart/delete',
    // 购物车提交
    submitOrder: '/starday-order/order/shopCartPurchase',
    // 清空失效商品
    clearInvalid: '/starday-order/shopCart/clearInvalidItem',
    // 购物车初始化数据
    initCart: 'starday-order/shopCart/list',
    // 游客登陆后加入购物车
    addVisitorCart: '/starday-order/shopCart/addVisitorCart',
    // 用户登陆后合并购物车
    loginVisitorCart: '/starday-order/shopCart/mergeShopCart'
  },
  order: {
    list: '/starday-order/myOrder/listAll',
    // 未付款订单详情
    toPay: '/starday-order/myOrder/info/toPay/',
    // 已付款订单详情
    paid: '/starday-order/myOrder/info/paid/',
    // 确认订单 提交订单
    commitOrder: '/starday-order/order/commit',
    // 获取用户的默认收货地址
    defAddress: '/starday-user/user/address/def/address',
    // 获取用户的积分
    ingetal: '/starday-integral/integral/user/integralNum',
    // 确认订单计算金额
    detailsCalculate: '/starday-order/order/detailsCalculate',
    // 取消订单
    cancel: '/starday-order/myOrder/cancelOrder/',
    // cod支付取消订单
    codcancel: '/starday-order/myOrder/cancelCodOrder/',
    otherList: '/starday-order/myOrder/listOther',
    // 添加评价
    comment: '/starday-order/myOrder/evaluate',
    // 详情页评价列表展示数据
    detailsComment: '/starday-goods/goods_comment/list',
    // 延迟收货
    delayReceiving: '/starday-order/myOrder/delayReceiving',
    // 确认收货
    confirmReceiving: '/starday-order/myOrder/confirmReceiving',
    // 计算退款金额
    calculateRefundAmount: '/starday-order/myOrder/calculateRefundAmount',
    // 申请退款
    applyRefund: '/starday-order/myOrder/applyRefund',
    // 用户取消用户申请
    cancelRefund: '/starday-order/myOrder/cancelRefund/',
    // 申请平台介入
    Intervention: '/starday-order/myOrder/applyPlatformIntervention',
    // 便利店停止支付
    stopPay_: '/starday-order/myOrder/stopPaying/',
    // 删除评价
    delcomment: '/starday-goods/user/goods_comment/delComment',
    viewlittle: '/starday-order/myOrder/getTradeItemResDTO',
    // 三方登录绑定邮箱发送验证码
    sendCode: '/starday-user/user/add/email/send/',
    // 三方登录绑定youxiang
    bindEmile: '/starday-user/user/add/email/',
    // 查询物流信息
    logisticsInfo: '/starday-order/myOrder/getLogisticsMsg/'
  },
  goods: {
    addCart: '/starday-order/shopCart/add',
    // 是否关注
    isFollow: '/starday-goods/user/goods_collection/isFollow',
    // 关注或取关
    follow: '/starday-goods/user/goods_collection/follow',
    // 立即购买
    buyNow: '/starday-order/order/buyImmediately',
    // 是否参加折扣
    getDiscount: '/starday-activity/user/discount/getDiscount',
    // 活动页获取多个商品信息
    getGoodsInfo: '/starday-elasticsearch/search/goodsId',
    // 根据spuid获取商品评论信息
    evaluate: '/starday-goods/goods_comment/list',
    // 用户参加秒杀
    joinSeckill: '/starday-activity/user/flash_sale/seckill',
    // 商品详情
    goodsDetail: 'starday-goods/user/goods/details/',
    // 已购商品
    buyGoods: 'starday-order/myOrder/listOrderGoods',
    // 平台推荐
    platform: 'starday-elasticsearch/search/recommend',
    // 获取购买商品所属1级分类
    buyBeLongCate: 'starday-goods/user/goods_category/buyBeLongCate',
    // 获取分享商品所属1级分类
    shareBeLongCate: 'starday-goods/user/goods_category/shareBeLongCate',
    // 获取分享二维码
    getQr: '/starday-goods/user/share/qr'
  },
  refund: {
    list: '/starday-order/myOrder/listAfterSale',
    returnExpress: '/starday-order/myOrder/returnAndWriteExpress',
    confirm: '/starday-order/myOrder/confirmMakeUpDeliver/',
    redundDetail: '/starday-order/myOrder/confirmMakeUpDeliver/'
  },
  category: {
    list: '/starday-goods/user/goods_category/list'
  },
  collection: {
    // 获取店铺收藏列表
    store: '/starday-goods/user/store_collection/list',
    goods: '/starday-goods/user/goods_collection/list'
  },
  adress: {
    del: '/starday-user/user/address/',
    add: '/starday-user/user/address/add',
    def: '/starday-user/user/address/def/',
    edit: '/starday-user/user/address/',
    areaData: '/starday-system/areacode/all/0',
    list: 'starday-user/user/address/list'
  },
  user: {
    giftCard: '/starday-system/user/giftCard/bandCard',
    userInfo: '/starday-user/user/customer',
    changeUserInfo: '/starday-user/user/customer',
    balance: '/starday-user/user/cardBalance/pageList/',
    changePwd: '/starday-user/user/update/password',
    integer: '/starday-integral/integral/detail/integralId/list',
    myInfo: 'starday-user/user/myInfo',
    nextMonthPay: '/starday-user/user/monthly/pay/info',
    creditInfo: '/starday-user/user/monthly/pay/credit/info',
    phoneCode: '/starday-user/user/monthly/pay/mobile/send/',
    billAddress: '/starday-user/sys/postcode/',
    payInfoUpdate: '/starday-user/user/monthly/pay/update',
    myBillList: '/starday-pay/payNextMonth/myBillList',
    reimbursement: '/starday-pay/payNextMonth/mySettleDay',
    BillListDetail: '/starday-pay/payNextMonth/myBillFlowList'
  },
  upload: {
    // 修改会员信息图片上传
    img: '/starday-user/file/uploadImage',
    // 站内信图片上传
    msgImg: '/starday-mail/file/uploadImage',
    // 订单图片上传
    refundOrderImg: '/starday-order/file/uploadImage',
    uploadGoodsImgs: '/starday-goods/file/uploadImages'
  },
  retrieve: {
    Code: '/starday-user/forget/password/email/send/',
    changePas: '/starday-user/forget/password/email/reset/password',
    verification: '/starday-user/forget/password/verify/'
  },
  activity: {
    activePage: '/starday-system/user/app/activePage/',
    secKill: '/starday-activity/flash_sale/list',
    // 查询商品活动信息
    info: '/starday-activity/user/activity/goods'
  },
  store: {
    follow: '/starday-goods/user/store_collection/follow',
    goods: '/starday-elasticsearch/search/goods',
    category: '/starday-goods/user/store_category/list',
    storeInfo: 'starday-supplier/supplier/getStoreAppInfo'
  },
  system: {
    dictionaries: '/starday-system/dict/getValue'
  },
  pay: {
    // 支付
    ment: '/starday-pay/PayUser/pay',
    // 查询支付方式
    methods: '/starday-pay/CasherdeskPaytype/getValidPaytypePage',
    // 查询还款支付方式
    reimbursementList: '/starday-pay/CasherdeskPaytype/getValidPayBackPage',
    // 还款
    reimbursement: '/starday-pay/PayBackUser/payBack'
  },
  search: {
    storeResault: '/starday-elasticsearch/search/store',
    goodsResault: '/starday-elasticsearch/search/goods'
  },
  msg: {
    // 已发送
    sent: '/starday-mail/mail/findMySendMailPage',
    // 收到的站内信
    receive: '/starday-mail/mail/findMyReceiveMailPage',
    // 发送站内信
    sendMail: '/starday-mail/mail/sendMail',
    // 查询未读消息数量
    count: '/starday-mail/mail/getMailCount',
    // 删除站内信
    del: '/starday-mail/mail/delMail'
  },
  Card: {
    add: '/starday-user/user/bankCard/add',
    list: '/starday-user/user/bankCard/listAll',
    del: '/starday-user/user/bankCard/',
    getCode: '/starday-user/user/bankCard/detail/email/send',
    bankinfo: '/starday-user/user/bankCard/detail/bank/card'
  },
  bigdata: {
    pv: '/starday-info/user/dataCollection'
  },
  // 字典
  dictionary: {
    // 分享商品返积分:订单积分比例
    integralPro: 'starday-system/dict/getValue'
  },
  // 分销中心
  distribution: {
    // 我的分销中心
    myDistributionCenter: '/starday-user/user/distribute/myDistributionCenter',
    // 分享订单列表明细统计信息
    orderStatistics: '/starday-order/myOrder/shareOrder/v2/stat',
    // 分享订单明细
    orderdetail: '/starday-order/myOrder/shareOrder/v2/list',
    // 选品库-添加自选推荐商品
    chooseGoods: '/starday-goods/user/share/choose',
    // 产品库-删除自选推荐商品
    deleteGoods: '/starday-goods/user/share/cancel',
    // 他人的分销店铺 登录未登录均可查看
    otherDistribution: '/starday-user/user/distribute/otherDistributionStore/',
    // 分销店铺关注/取消关注
    favorite: '/starday-user/user/distribute/store/favorite/',
    // 我的团长
    myLeader: '/starday-user/user/distribute/myLeader',
    // 分销店铺浏览历史新增
    browsing: '/starday-user/user/distribute/store/browsing/',
    // 会员通过邀请码成为团员
    becomeMember: '/starday-user/user/distribute/member/add/',
    // 分销赠送积分比例 会员和白名单
    ratio: '/starday-user/user/distribute/integral/proportion'
  }
}
