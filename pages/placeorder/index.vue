<template>
  <div class="order-container">
    <van-sticky>
      <van-nav-bar :title="$t('order.Confirmorder')" placeholder @click-left="onClickLeft">
        <template #left>
          <van-icon size="22px" name="arrow-left" color="#999999" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="content">
      <div class="address_info" @click="choiceAdress">
        <div :class="hasDefAddress? 'adress_info_header': 'adress_info_header noAddress'">
          <div v-if="hasDefAddress" class="left">
            <span class="default">{{$t('newConfirmOrder.def')}}</span>
            <span class="name">{{defAddress.realName}}</span>
            <span class="mobile">{{defAddress.mobile}}</span>
          </div>
          <div v-else class="left">{{$t('order.inpadress')}}</div>
          <div class="right-box">
            <div v-if="hasDefAddress" class="text">{{$t('newConfirmOrder.change')}}</div>
            <div v-else class="text">{{$t('newConfirmOrder.addchange')}}</div>
            <van-icon size="5.142857vw" name="arrow" />
          </div>
        </div>
        <div v-if="hasDefAddress" class="adress_desc">{{defAddress.address+defAddress.deliveryAddress}}</div>
        <img class="tiao" src="~/assets/images/confirmorder/tiao.png" />
      </div>
      <div class="order_goodslist">
        <div v-for="(fitem,index) in orderInfo.groups" :key="index" class="list-item">
          <div class="shop_title van-ellipsis">{{fitem.storeName}}</div>
          <div class="goods">
            <van-card v-for="(childItem,k) in fitem.tradeItems" :key="k" :num="childItem.item.number" :desc="childItem.item.goodsSkuVal" :title="childItem.item.goodsTitle" :thumb="childItem.item.skuImg? baseImageUrl + childItem.item.skuImg:require(`assets/images/loading/load.png`)">
              <template #price>
                <div class="goods_price">{{childItem.item.skuMarketPrice}}円</div>
              </template>
            </van-card>
          </div>
          <div class="other-info">
            <van-cell :title="$t('order.deliverprice')" :value="hasDefAddress ? stores_Freight[index].storeFreight + '円': 0 + '円'" value-class="payStyle" />
            <van-field v-model="fitem.message" rows="1" autosize :label="$t('supply.message')" type="textarea" input-align="left" maxlength="40" :placeholder="$t('newConfirmOrder.message')" show-word-limit />
          </div>
          <div class="footer">
            <span class="desc">{{$t('returnList.all')}}{{fitem.tradeItems.length}}{{$t('returnList.goods')}}</span>
            <span class="price">
              <i class="allprice">{{$t('order.allprice')}}</i>
              <i class="num">{{fitem.totalprice + (hasDefAddress?stores_Freight[index].storeFreight:0) }}円</i>
            </span>
          </div>
        </div>
      </div>
      <!--    货到付款在线支付-->
      <div v-if="supportDelivery" class="changepaystyle">
        <van-radio-group v-model="termsPayment" checked-color="#FF5D19">
          <van-cell-group>
            <van-cell :title="$t('order.onlinePay')" clickable @click="termsPayment = '1'">
              <template #right-icon>
                <van-radio icon-size="5.142857vw" name="1" />
              </template>
            </van-cell>
            <van-cell clickable size="large" :label="`${$t('order.deliveryTitle')}${CODFEE}円`" @click="termsPayment = '2'">
              <template #title>
                <div class="termsPaymentimg">
                  <span class="custom-title">{{$t('order.cashDelivery')}}</span>
                  <img class="" src="~/assets/images/confirmorder/hdfk.png" />
                </div>
              </template>
              <template #right-icon>
                <van-radio icon-size="5.142857vw" class="onlinepayRadio" name="2" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>

      <van-cell v-show="termsPayment == '1'" class="cell-item" center :title="$t('newConfirmOrder.discount')" :value="'-' + discountsTotalAmount + '円'" value-class="payStyle">
      </van-cell>
      <van-cell v-show="termsPayment == '1'" class="cell-item" :title="$t('newConfirmOrder.coupon')" center is-link :value="couponText" value-class="couppayStyle" @click="viewCoupon" />
      <!--    -->
      <div v-show="termsPayment == '1'" class="ingetal">
        <van-checkbox-group v-model="result">
          <van-cell-group>
            <van-cell :title="$t('order.ingetral')">
              <template #right-icon>
                <van-checkbox ref="checkboxes" icon-size="5.142857vw" name="1" checked-color="#FF5D19" />
              </template>
            </van-cell>
          </van-cell-group>
          <div v-if="result[0]" class="ingetal_desc">
            <span class="desc">{{$t('newConfirmOrder.userAll')}}</span>
            <span class="num">{{userInfo.integral}}</span>
            <span class="desc">{{$t('index.p2')}},</span>
            <span class="desc">{{$t('newConfirmOrder.use')}}</span>
            <input v-model="ingetalvalue" class="ipt" type="text" @blur="ingetarCalc" />
            <span class="desc">{{$t('newConfirmOrder.rebate1')}}</span>
            <span class="desc" style="color:#ff5d19;">{{ingetalvalue}}円</span>
          </div>
        </van-checkbox-group>
      </div>
    </div>
    <div class="order_submit">
      <div class="desc">
        <span class="order-pay">{{$t('order.pay')}}</span>
        <span class="num">{{toatalPrice}}円</span>
      </div>
      <van-button type="primary" color="linear-gradient(to right, #FFA14B, #FF5D19)" :disabled="disabled" @click="submitOrder">{{$t('order.suborder')}}</van-button>
    </div>
    <van-popup v-model="showCoupon" safe-area-inset-bottom position="bottom" class="popupComp" :style="{ height: '70%' }">
      <van-tabs v-model="couponActive" color="#FF5D19" title-active-color="#FF5D19" line-width="25px" line-height="3px">
        <van-tab :title="$t('newConfirmOrder.useCoupon')+'('+availableCouponsList.length+')'">
          <div v-for="(item,index) in availableCouponsList" :key="index" class="coupon-item" @click="changeCoupon(item,index)">
            <div class="coupon-content" :style="`backgroundImage:url(${ item.couponType == 0 ? require('../../assets/images/coupon/tongyong.png') : require('../../assets/images/coupon/pinlei.png')})`">
              <van-icon v-if="item.showSanjiao" size="10vw" class="active" :name="require(`assets/images/confirmorder/sanjiao.png`)" />
              <div class="coupon-left">
                <div class="header">
                  <span class="coupon_item_type_discount">{{ item.couponType == 0?$t('newCoupon.type1'):$t('newCoupon.type2')}}</span>
                  <span>{{$i18n.locale === 'ja-JP' ? item.couponNameJp : item.couponName}}</span>
                </div>
                <div class="miaoshu">{{item.fullbuyType == 0?$t('newCoupon.fullbuyType'):$t('newCoupon.fullbuyType2')+item.fullbuyPrice+$t('newCoupon.fullbuyType3')}}</div>
                <div class="useTime">{{item.effectiveStartTime.split(' ')[0]+'--'+item.effectiveEndTime.split(' ')[0]}}</div>
                <div v-if="item.couponActivityDto.couponDescJp" class="title">
                  <span class="van-ellipsis ellipsis">{{item.couponActivityDto.couponDescJp}}</span>
                  <van-icon :name="item.showDesc?'arrow-up':'arrow-down'" color="#999" @click.stop="showDicountDesc(item)" />
                </div>
                <div v-else class="title"></div>
              </div>
              <div class="price">
                <span>{{ item.denomination.toString().replace(/\s*/g,"")}}</span>
                <span>円</span>
              </div>
            </div>
            <div v-if="item.showDesc" class="dicountDesc">{{$t('newCoupon.desc')}}{{item.couponActivityDto.couponDescJp}}</div>
          </div>
        </van-tab>
        <van-tab :title="$t('newCoupon.notUse') +'('+disabledCouponList.length+')'">
          <div v-for="item in disabledCouponList" :key="item.id" class="coupon-item">
            <div class="coupon-content" :style="`backgroundImage:url(${ item.couponType == 0 ? require('../../assets/images/coupon/tongyong.png') : require('../../assets/images/coupon/pinlei.png')})`">
              <van-icon v-if="item.showSanjiao" size="10vw" class="active" :name="require(`assets/images/confirmorder/sanjiao.png`)" />
              <div class="coupon-left">
                <div class="header">
                  <span class="coupon_item_type_discount">{{ item.couponType == 0?$t('newCoupon.type1'):$t('newCoupon.type2')}}</span>
                  <span>{{$i18n.locale === 'jp' ? item.couponNameJp : item.couponName}}</span>
                </div>
                <div class="miaoshu">{{item.fullbuyType == 0?$t('newCoupon.fullbuyType'):$t('newCoupon.fullbuyType2')+item.fullbuyPrice+$t('newCoupon.fullbuyType3')}}</div>
                <div class="useTime">{{item.effectiveStartTime.split(' ')[0]+'--'+item.effectiveEndTime.split(' ')[0]}}</div>
                <div v-if="item.couponActivityDto.couponDescJp" class="title">
                  <span class="van-ellipsis ellipsis">{{item.couponActivityDto.couponDescJp}}</span>
                  <van-icon :name="item.showDesc?'arrow-up':'arrow-down'" color="#999" @click.stop="showDicountDesc(item)" />
                </div>
                <div v-else class="title"></div>
              </div>
              <div class="price">
                <span>{{ item.denomination.toString().replace(/\s*/g,"")}}</span>
                <span>円</span>
              </div>
            </div>
            <div v-if="item.showDesc" class="dicountDesc">{{$t('newCoupon.desc')}}{{item.couponActivityDto.couponDescJp}}</div>
          </div>
        </van-tab>
      </van-tabs>
    </van-popup>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { isDuringDate } from '~/util/tools'
import api from '~/static/api'
import Reg from '~/static/reg'
const _difference = require('lodash/difference')
export default {
  name: 'ConfirmOrder',
  layout: 'content',
  async asyncData ({ $axios }) {
    let addressInfo; let ingetalInfo; let ratio = 0
    const COD_FEE = await $axios.get(api.system.dictionaries, { params: { groupCode: 'PAY_SETTING', code: 'COD_FEE' } })
    const COD_STORE = await $axios.get(api.system.dictionaries, { params: { groupCode: 'PAY_SETTING', code: 'COD_STORE' } })
    await $axios.get(api.order.defAddress).then((res) => {
      if (res.code === 200) {
        addressInfo = res.data
      }
    })
    await $axios.get(api.order.ingetal).then((res) => {
      if (res.code === 200) { ingetalInfo = res.data }
    })
    await $axios.get(api.system.dictionaries, { params: { groupCode: 'INTEGRAL_RULE', code: 'INTEGER_PERCENT' } }).then((res) => {
      if (res.code === 200) { ratio = res.data }
    })
    return {
      addressInfo,
      ingetalInfo,
      ratio,
      CODFEE: COD_FEE.data,
      CODSTORE: COD_STORE.data
    }
  },
  data () {
    return {
      supportDelivery: false, // 所有商品且店铺是否支持货到付款
      toatalPrice: 0,
      disabled: true,
      defAddress: {},
      termsPayment: '1',
      message: '',
      ingetalvalue: '',
      showCoupon: false,
      couponActive: 0,
      iconName: 'arrow-down',
      showDesc: false,
      totalNum: 0,
      hasDefAddress: false,
      deduction: '',
      // 运费
      freightTotalAmount: 0,
      // 优惠
      discountsTotalAmount: 0,
      // 优惠券优惠
      couponTotalAmount: 0,
      // 可用优惠券列表
      availableCouponsList: [],
      // 不可用优惠券
      disabledCouponList: [],
      useCoupon: {
        couponId: '',
        id: '',
        isUse: false
      },
      stores_Freight: '',
      FreightNum: 0,
      showModel: false,
      useremile: '',
      errormsg: '',
      Code: '',
      isSendCode: false,
      loadtext: '送信',
      setTime: null,
      result: [],
      userInfo: [],
      orderInfo: {},
      integralRatio: 0,
      shopType: 1,
      fromFlag: ''
    }
  },
  computed: {
    ...mapGetters(['order', 'baseImageUrl']),
    couponText () {
      if (this.useCoupon.isUse) {
        return `-${this.couponTotalAmount || 0}円`
      } else {
        return this.availableCouponsList.length > 0 ? this.$i18n.locale === 'zh-CN' ? `${this.availableCouponsList.length + this.$t('newConfirmOrder.couponCount')}` : `${this.availableCouponsList.length + this.$t('newConfirmOrder.couponCount')}` : `${this.availableCouponsList.length + this.$t('newConfirmOrder.couponCount')}`
      }
    }
  },
  watch: {
    useremile (val) {
      const regMail = new RegExp(Reg.mailBox)
      if (!regMail.test(val) && val) {
        this.errormsg = this.$t('login.err')
        this.isSendCode = true
      } else {
        this.errormsg = ''

        this.isSendCode = false
      }
    },
    'termsPayment' (val) {
      this.termsPayment = val
      if (val === '2') {
        this.ingetalvalue = ''
        this.result = []
      }
      this.computePrice()
    }
  },
  created () {
    this.setCodStore(this.CODSTORE)
    this.setCodFee(this.CODFEE)
  },
  async mounted () {
    const _this = this
    _this.orderInfo = _this.order.data
    _this.shopType = _this.order.shopType
    _this.fromFlag = _this.$route.query.fromFlag || ''
    const { groups } = _this.orderInfo
    const arr = []
    if (this.CODSTORE === '2') {
      // 所有店铺都支持货到付款  判断商品中是否含有货到付款
      groups.forEach((product) => {
        product.tradeItems.forEach((trade) => {
          if (trade.item.goodsCashOnDelivery === 1) {
            arr.push(true)
          } else {
            arr.push(false)
          }
        })
      })
    } else {
      groups.forEach((product) => {
        if (product.storeType === this.CODSTORE * 1) {
          product.tradeItems.forEach((trade) => {
            if (trade.item.goodsCashOnDelivery === 1) {
              arr.push(true)
            } else {
              arr.push(false)
            }
          })
        } else {
          arr.push(false)
        }
      })
    }
    _this.supportDelivery = arr.every(item => item)
    _this.toatalPrice = _this.orderInfo.totalAmount
    _this.orderInfo.groups.forEach((el) => {
      el.totalprice = 0
      el.tradeItems.forEach((item) => {
        el.totalprice += +item.item.skuTotalPrice
      })
    })
    // 处理地址
    if (_this.addressInfo) {
      _this.disabled = false
      _this.defAddress = _this.addressInfo
      await _this.computePrice()
      _this.hasDefAddress = true
      await _this.getCouponInfo()
      _this.defAddress.mobile = _this.defAddress.mobile.replace(_this.defAddress.mobile.substring(3, 7), '****')
    } else {
      _this.hasDefAddress = false
    }
    _this.userInfo.integral = _this.ingetalInfo
    _this.integralRatio = _this.ratio
  },
  methods: {
    ...mapMutations(['setSubOrderInfo', 'setCodStore', 'setCodFee']),
    onClickLeft () {
      const { shopType, goodsId } = this.order
      if (shopType === 2) {
        this.$router.push(`/product/${goodsId}`)
      } else {
        this.$router.push('/shoppingcart')
      }
    },
    async computePrice () {
      const _this = this
      const data = {
        consigneeId: _this.defAddress.id,
        buyReqList: [],
        commonCodeId: _this.useCoupon.couponId,
        couponPaymentId: _this.useCoupon.id,
        storeCommitInfoList: [],
        payType: _this.termsPayment,
        shopType: _this.shopType,
        source: 1,
        integral: _this.ingetalvalue === '' ? 0 : _this.ingetalvalue
      }
      _this.orderInfo.groups.forEach((fitem) => {
        const storeobj = {
          storeId: '',
          buyerRemark: ''
        }
        storeobj.storeId = fitem.storeId
        storeobj.buyerRemark = fitem.message ? fitem.message : ''
        data.storeCommitInfoList.push(storeobj)
        fitem.tradeItems.forEach((k) => {
          const goodsobj = { skuId: '', buyCount: 0 }
          goodsobj.skuId = k.item.skuId
          goodsobj.buyCount = k.item.number
          data.buyReqList.push(goodsobj)
        })
      })
      await _this.$axios.post(api.order.detailsCalculate, data).then((res) => {
        if (res.code === 200) {
          _this.toatalPrice = res.data.payTotalAmount
          _this.freightTotalAmount = res.data.freightTotalAmount
          _this.discountsTotalAmount = res.data.discountsTotalAmount
          _this.couponTotalAmount = res.data.couponTotalAmount
          _this.stores_Freight = res.data.storesFreight
          // 计算一下 所有店铺的运费总和
          console.log('stores_Freight', _this.stores_Freight)
          const arr = _this.stores_Freight.map(item => item.storeFreight)
          this.FreightNum = arr.reduce((total, num) => total + num)
          console.log(this.FreightNum)
        }
      }).catch((err) => {
        this.$toast(err.message)
      })
    },
    // 获取优惠券信息
    getCouponInfo () {
      const _this = this
      const sameCategory = []
      let moneyNum = 0
      const sameCoupon = []
      _this.$axios.get(api.coupon.mycoupon, { params: { type: 0 } }).then((res) => {
        if (res.code === 200) {
          res.data.forEach((item) => {
            item.showSanjiao = false
            item.showDesc = false
            if (item.couponType === 0) {
              // 通用型 优惠券
              if (item.fullbuyType === 0 && isDuringDate(item.effectiveStartTime, item.effectiveEndTime) === 1) {
                // 无门槛优惠券
                _this.availableCouponsList.push(item)
              } else if (_this.orderInfo.totalAmount - _this.discountsTotalAmount - _this.freightTotalAmount >= item.fullbuyPrice && isDuringDate(item.effectiveStartTime, item.effectiveEndTime) === 1) {
                _this.availableCouponsList.push(item)
              } else {
                _this.disabledCouponList.push(item)
              }
            } else if (_this.orderInfo.totalAmount < item.fullbuyPrice && isDuringDate(item.effectiveStartTime, item.effectiveEndTime) === 1) {
              _this.disabledCouponList.push(item)
            } else {
              _this.orderInfo.groups.forEach((goodsItem) => {
                goodsItem.tradeItems.forEach((child) => {
                  if (item.cateDetail === child.item.categoryId) {
                    const _index = sameCoupon.findIndex(prop => prop.id === item.id)
                    if (_index <= -1) {
                      sameCoupon.push(item)
                      sameCategory.push(child.item)
                    }
                  } else {
                    const _index = _this.disabledCouponList.findIndex((prop) => {
                      return prop.id === item.id
                    })
                    if (_index <= -1) {
                      _this.disabledCouponList.push(item)
                    }
                  }
                })
              })
            }
          })
          sameCategory.forEach((k) => {
            moneyNum += k.skuTotalPrice
          })
          sameCoupon.forEach((m) => {
            if (m.fullbuyType === 0 && isDuringDate(m.effectiveStartTime, m.effectiveEndTime) === 1) {
              _this.availableCouponsList.push(m)
            } else if (moneyNum >= m.fullbuyPrice && isDuringDate(m.effectiveStartTime, m.effectiveEndTime) === 1) {
              _this.availableCouponsList.push(m)
            } else {
              _this.disabledCouponList.push(m)
            }
          })
          console.log('********availableCouponsList**********', _this.availableCouponsList)
          console.log('********disabledCouponList**********', _this.disabledCouponList)
        }
      }, (err) => {
        if (err.data.code === 500) {
          _this.$toast.fail(err.data.message)
        }
      })
    },
    choiceAdress () {
      this.$router.push('/address')
      window.sessionStorage.setItem('page', 'placeorder')
    },
    changeCoupon (item, index) {
      const _this = this
      if (item.showSanjiao) {
        item.showSanjiao = false
        _this.useCoupon.couponId = ''
        _this.useCoupon.id = ''
        _this.useCoupon.isUse = false
      } else {
        const list = _difference(_this.availableCouponsList, item)
        list.map((item) => {
          item.showSanjiao = false
        })
        item.showSanjiao = !item.showSanjiao
        _this.useCoupon.couponId = item.couponId
        _this.useCoupon.id = item.id
        _this.useCoupon.isUse = true
      }

      _this.computePrice()
      _this.showCoupon = false
    },
    ingetarCalc () {
      const _this = this
      const total = _this.toatalPrice
      console.log(Math.floor(total * (_this.integralRatio / 100)))
      console.log(_this.userInfo.integral)
      if (_this.ingetalvalue > Math.floor(total * (_this.integralRatio / 100)) - _this.FreightNum) {
        _this.ingetalvalue = Math.floor(total * (_this.integralRatio / 100)) - _this.FreightNum
        _this.$toast(_this.$t('newConfirmOrder.maxIngetal') + _this.integralRatio + '%')
        _this.computePrice()
      } else if (_this.ingetalvalue > _this.userInfo.integral) {
        _this.$toast(_this.$t('newConfirmOrder.noIngetal'))
        _this.ingetalvalue = _this.userInfo.integral
      } else {
        _this.computePrice()
      }
    },
    viewCoupon () {
      this.showCoupon = true
    },
    timer () {
      const _this = this
      _this.setTime = setInterval(() => {
        if (_this.time > 0) {
          _this.time -= 1
          _this.loadText = _this.time.toString() + _this.$t('register.changed')
        } else {
          _this.time = 300
          _this.loadText = _this.$t('register.getCode')
          clearInterval(_this.setTime)
          _this.isSendCode = false
        }
      }, 1000)
    },
    showDicountDesc (item) {
      item.showDesc = !item.showDesc
    },
    submitOrder () {
      const _this = this
      const _storeUserId = _this.$route.query.storeUserId ? ((_this.$route.query.storeUserId !== 'null' && _this.$route.query.storeUserId !== 'undefined') ? _this.$route.query.storeUserId : '') : ''
      const data = {
        consigneeId: _this.defAddress.id,
        storeCommitInfoList: [],
        buyReqList: [],
        integral: _this.ingetalvalue ? _this.ingetalvalue : 0,
        shopType: _this.shopType,
        payType: _this.termsPayment, // 新增支付类型
        commonCodeId: _this.useCoupon.couponId,
        couponPaymentId: _this.useCoupon.id,
        source: 1,
        shareFlag: false,
        storeUserId: _storeUserId
      }
      _this.orderInfo.groups.forEach((item) => {
        const storeobj = {
          storeId: '',
          buyerRemark: ''
        }
        storeobj.storeId = item.tradeItems[0].item.storeId
        storeobj.buyerRemark = item.message ? item.message : ''
        data.storeCommitInfoList.push(storeobj)
        item.tradeItems.map((k) => {
          const goodsobj = {
            skuId: '',
            buyCount: 0
          }
          goodsobj.skuId = k.item.skuId
          goodsobj.buyCount = k.item.number
          goodsobj.shareId = k.item.shareId || ''
          data.buyReqList.push(goodsobj)
        })
      })
      if (_this.fromFlag === '1' || _this.fromFlag === '3') {
        data.shareFlag = true
      } else {
        data.shareFlag = false
        data.storeUserId = ''
      }
      _this.$axios.post(api.order.commitOrder, data).then((res) => {
        if (res.code === 200) {
          if (this.termsPayment === '2') {
            // 货到付款跳转成功页
            _this.setSubOrderInfo(res.data)
            _this.$router.push('/pay/response?state=true&cash=true&CODFEE=' + this.CODFEE)
          } else {
            _this.setSubOrderInfo(res.data)
            _this.$router.push('/pay/payList')
          }
        }
      }).catch((err) => {
        this.$toast(err.message)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.order-container {
  width: 100%;
  height: 100vh;
  position: relative;
  /deep/.van-nav-bar__content {
    height: 88px;
    .van-nav-bar__title {
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 88px;
    }
  }
  /deep/.van-icon {
    font-size: 30px;
  }
  /deep/.van-radio__icon {
    height: auto;
  }
  .content {
    padding-bottom: 150px;
    .address_info {
      width: 100%;
      margin-top: 20px;
      background: #fff;
      display: flex;
      flex-flow: column nowrap;
      .noAddress {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        padding: 30px 30px 10px 30px;
        .left {
          font-size: 34px;
          font-weight: 400;
          color: #333333;
        }
      }
      .adress_info_header {
        width: 100%;
        padding: 30px 30px 10px 30px;
        height: 85px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        height: auto;
        .left {
          line-height: 85px;
          display: flex;
          align-items: center;
          .default {
            text-align: center;
            background-color: #d9011b;
            font-size: 22px;
            font-weight: 400;
            color: #ffffff;
            line-height: 30px;
            border-radius: 30px;
            padding: 8px 20px;
          }
          .name,
          .mobile {
            font-size: 30px;
            font-weight: 400;
            color: #333333;
            line-height: 30px;
            margin-left: 20px;
          }
          .name {
            display: inline-block;
            width: 260px;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .mobile {
            margin-left: 14px;
          }
        }
        .right-box{
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .text{
            font-size: 30px;
            color: #333333;
            flex-shrink: 0;
          }
        }
      }
      .adress_desc {
        padding: 0 30px 30px;
        font-size: 26px;
        font-weight: 400;
        color: #333333;
        line-height: 37px;
      }
      .tiao {
        width: 100%;
        height: 6px;
      }
    }
    .order_goodslist {
      padding: 0 30px;
      background-color: #ffffff;
      .list-item {
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        padding: 32px 0px;
        .shop_title {
          font-size: 30px;
          font-weight: 400;
          color: #333333;
          line-height: 42px;
          padding-bottom: 25px;
        }
        .goods {
          /deep/.van-card {
            padding: 10px 15px;
            margin-bottom: 30px;
            .van-card__header {
              .van-card__thumb {
                width: inherit;
                height: inherit;
                margin: 0;
                .van-image {
                  img {
                    width: 138px;
                    height: 138px;
                  }
                }
              }
              .van-card__content {
                margin-left: 20px;
                .van-card__title {
                  max-height: inherit;
                  line-height: 32px;
                  font-size: 26px;
                }
                .van-card__desc {
                  line-height: 32px;
                  font-size: 26px;
                  height: 32px;
                  max-height: inherit;
                  margin-top: 15px;
                }
                .van-card__bottom {
                  line-height: 45px;
                  .van-card__price {
                    color: #ff5d19;
                    .goods-price {
                      max-height: 45px;
                      font-size: 32px;
                      font-weight: 600;
                      line-height: 45px;
                    }
                  }
                  .van-card__num {
                    font-size: 26px;
                  }
                }
              }
            }
          }
        }
        .other-info {
          .van-cell {
            width: 100%;
            align-items: center;
            .van-cell__title {
              font-size: 26px;
              color: #333333;
              line-height: 37px;
            }
            .payStyle {
              font-size: 24px;
              font-weight: 400;
              color: #333333;
              line-height: 37px;
            }
          }
          /deep/.van-field {
            width: 100%;
            align-items: center;
            .van-cell__title,
            .van-field__label {
              font-size: 26px;
              width: auto;
              line-height: 37px;
            }
            .van-field__value,
            .van-cell__value {
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              align-items: center;
              .van-field__body {
                flex: 1;
                .van-field__control {
                  height: inherit;
                  font-size: 26px;
                  font-weight: 400;
                  color: #999999;
                  line-height: 37px;
                }
              }
              .van-field__word-limit {
                width: 80px;
              }
            }
          }
        }
        .footer {
          height: 60px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-top: 10px;
          .desc {
            font-size: 24px;
            font-weight: 400;
            color: #333333;
            line-height: 33px;
            margin-right: 40px;
          }
          .price {
            .allprice {
              font-size: 24px;
              font-weight: 400;
              color: #333333;
              line-height: 33px;
            }
            .num {
              font-size: 28px;
              font-weight: 600;
              color: #ff5d19;
              line-height: 33px;
            }
          }
        }
      }
    }
    .changepaystyle {
      margin-top: 20px;
      /deep/.van-cell-group {
        .van-cell {
          height: 110px;
          box-sizing: border-box;
          padding: 10px 30px;
          display: flex;
          align-items: center;
          .van-cell__title {
            font-size: 28px;
            font-weight: 400;
            color: #333333;
            line-height: 40px;
            .termsPaymentimg {
              display: flex;
              justify-content: flex-start;
              flex-flow: row nowrap;
              align-items: center;
              img {
                width: 152px;
                height: 39px;
                margin-left: 10px;
              }
            }
            .van-cell__label {
              margin-top: 20px;
            }
          }
        }
      }
    }
    .cell-item {
      padding: 10px 30px;
      height: 104px;
      width: 100%;
      margin-top: 20px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      /deep/.van-cell__title {
        font-size: 28px;
        font-weight: 400;
        color: #333333;
        line-height: 40px;
        flex: 7;
      }
      .payStyle {
        flex: 5;
        font-size: 28px;
        font-weight: 400;
        color: #333333;
        line-height: 40px;
      }
      .couppayStyle {
        font-size: 28px;
        font-weight: 400;
        color: #ff5d19;
        line-height: 40px;
        flex: 5;
      }
      .van-cell__right-icon {
        font-size: 32px;
      }
    }
    .ingetal {
      /deep/.van-checkbox-group {
        .van-cell {
          padding: 10px 30px;
          height: 104px;
          width: 100%;
          .van-cell__title {
            font-size: 26px;
            color: #333333;
            line-height: 37px;
            display: flex;
            align-items: center;
          }
        }
      }
      .ingetal_desc {
        width: 100%;
        height: 60px;
        background-color: #ffffff;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        padding-left: 30px;
        .desc {
          font-size: 24px;
          font-weight: 400;
          color: #666666;
          line-height: 33px;
        }
        .num {
          font-size: 24px;
          font-weight: 400;
          color: #e00d0d;
          line-height: 33px;
        }
        .ipt {
          line-height: 33px;
          border: 1px solid #666666;
          width: 60px;
          height: 32px;
          font-size: 16px;
        }
      }
    }
  }
  .order_submit {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 98px;
    background-color: #ffffff;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding-left: 30px;
    .desc {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      width: 80%;
      height: 100%;
      .order-pay {
        font-size: 30px;
        font-weight: 500;
        color: #333333;
        line-height: 53px;
      }
      .num {
        font-size: 38px;
        font-weight: 600;
        color: #ff5d19;
        line-height: 53px;
      }
    }
    /deep/.van-button {
      width: 352px;
      height: 98px;
    }
  }
  /deep/.van-popup {
    .couponBox {
      .van-tabs {
        .van-tabs__wrap {
          width: 100%;
          height: 80px;
          .van-tabs__nav {
            .van-tab {
              .van-tab__text {
                line-height: 37px;
                font-size: 28px;
              }
            }
          }
        }
      }
    }
  }
  .popupComp {
    /deep/.van-tabs {
      width: 100%;
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      .van-tabs__wrap {
        width: 100%;
        height: 76px;
        .van-tabs__nav {
          .van-tab {
            .van-tab__text {
              line-height: 32px;
              font-size: 26px;
            }
          }
        }
      }
      .van-tabs__content::-webkit-scrollbar {
        display: none;
      }
      .van-tabs__content {
        flex: 1;
        width: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        .van-tab__pane {
          width: 100%;
          height: 100%;
          .coupon-item {
            width: 100%;
            min-height: 268px;
            .coupon-content {
              width: 100%;
              min-height: 268px;
              padding: 15px 18px 20px 30px;
              position: relative;
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              background-size: 100% 100%;
              background-origin: border-box;
              background-repeat: no-repeat;
              .active {
                position: absolute;
                right: 18px;
                bottom: 20px;
              }
              .coupon-left {
                width: 70%;
              }
              .price {
                width: 30%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 40px;
                font-weight: 800;
                color: #ffffff;
              }
              .coupon-left {
                display: flex;
                flex-flow: column nowrap;
                justify-content: space-between;
                align-items: flex-start;
                padding-top: 15px;
                .header {
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: center;
                  align-items: center;
                  .coupon_item_type_discount {
                    display: inline-block;
                    background: #ff9d18;
                    border-radius: 5px;
                    width: 80px;
                    height: 34px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 36px;
                  }
                  span:last-child {
                    display: inline-block;
                    font-size: 27px;
                    font-weight: 400;
                    text-align: left;
                    color: #333333;
                    height: 34px;
                    line-height: 36px;
                    margin-left: 15px;
                  }
                }
                .miaoshu {
                  font-size: 22px;
                  font-weight: Normal;
                  text-align: left;
                  color: #333333;
                  line-height: 33px;
                }
                .useTime {
                  font-size: 22px;
                  font-weight: 400;
                  text-align: left;
                  color: #999999;
                  line-height: 30px;
                }
                .title {
                  width: 100%;
                  height: 60px;
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  align-items: center;
                  border-top: 1px solid #eaeaea;
                  padding-right: 20px;
                  font-size: 22px;
                  font-weight: 400;
                  color: #999999;
                  line-height: 30px;
                }
              }
            }
            .dicountDesc {
              padding-right: 18px;
              padding-left: 30px;
              font-size: 22px;
              font-weight: 400;
              color: #999999;
              line-height: 30px;
            }
          }
        }
      }
    }
  }
}
</style>
