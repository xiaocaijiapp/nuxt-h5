<!---->
<template>
  <div>
    <van-nav-bar
      :title="$t('supply.orderdetail')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>
    <NoData v-if="isShow" />

    <div v-else>
      <div :style="{backgroundImage: pay_bg}" class="pay_bg">
        <div class="contaniner">
          <div>{{orderStatus(detailData.orderState)}}</div>
          <div
                  v-if="detailData.orderState == 1"
                  class="tips"
          >{{$t('newOrderDetail.surplus')}}{{detailData.closeTime}}{{$t('newOrderDetail.Minutestradingclose')}}</div>
          <div
                  v-if="detailData.orderState == 4"
                  class="tips"
          >{{$t('newOrderDetail.minSurplus')}}{{detailData.goodsInfoList[0].automaticReceiveTime}}{{$t('newOrderDetail.Days')}}</div>
          <div
                  v-if="detailData.orderState == 5||detailData.orderState == 6"
                  class="tips"
          >{{$t('goodsdetail.sendTimeContent2')}}：{{detailData.receiptTime}}</div>
        </div>

      </div>

      <div class="adress_info">
        <div class="adress_info_header">
          <div class="left">
            <van-icon :name="require('assets/images/orderDetail/weizhi.png')" />
            <span>{{detailData.realName}}</span>
            <span>{{detailData.mobile}}</span>
          </div>
          <div>
            <van-icon size="12px" name="arrow" />
          </div>
        </div>
        <div class="adress_desc">{{detailData.address}}</div>
      </div>

      <div class="shop_order refund_item">
        <div
          class="shop_title"
          @click="goShop(detailData.storeId)"
        >{{detailData.storeName}}></div>
        <div v-for="(item,index) in detailData.goodsInfoList" :key="index">
          <div class="content" @click="goDetail(item)">
            <div>
              <van-image
                :src="baseImageUrl + item.goodsSkuImg"
                width="16vw"
                height="16vw"
              />
            </div>
            <div class="content_right">
              <div class="content_right_header">
                <div
                  class="van-multi-ellipsis--l2 goodsTitle"
                >{{item.goodsTitle}}</div>
                <div>{{item.goodsSkuPrice}}<span style="font-size:10px;"> 円</span></div>
              </div>
              <div class="content_right_footer">
                <div>{{item.goodsSkuVal}}</div>
                <div>x{{item.buyNumber}}</div>
              </div>
            </div>
          </div>
          <div class="footer">
            <van-button
              v-if="detailData.orderState == 3 &&item.afterState<1 && detailData.payType != 2"
              round
              type="default"
              @click="refund(item)"
            >{{$t('supply.p6')}}</van-button>
            <van-button
              v-if="(detailData.orderState == 5 || detailData.orderState == 6) && item.afterState<1 && detailData.payType != 2"
              round
              type="default"
              @click="refund(item)"
            >{{$t('supply.p7')}}</van-button>
<!--            <van-button-->
<!--              v-if="item.afterState==1 || item.afterState==2"-->
<!--              round-->
<!--              type="default"-->
<!--              @click="goRefundDetail(item)"-->
<!--            >{{$t('returnList.returning')}}</van-button>-->
            <span v-if="item.afterState==1 || item.afterState==2" style="font-size: 4.5714285vw;margin: 2.285714vw">{{$t('returnList.returning')}}</span>
            <van-button
              v-if="item.afterState==3"
              round
              type="default"
              @click="goRefundDetail(item)"
            >{{$t('newOrderDetail.returnSuccess')}}</van-button>
          </div>
        </div>

        <!-- <div class="footer">
          <div>共2件商品</div>
          <div>
            总金额
            <span>￥{{data.amount}}</span>
          </div>
        </div>-->
      </div>

      <div class="total_merchandise">
        <!-- <div class="title">商品合计</div> -->
        <van-cell>
          <template #title>
            <span class="cell_title">{{$t('newOrderDetail.allPrice')}}</span>
          </template>
          <template #default>
            <span class="cell_default">{{detailData.amount}}円</span>
          </template>
        </van-cell>
        <van-cell v-if="detailData.freight">
          <template #title>
            <span class="cell_title">{{$t('order.deliverprice')}}</span>
          </template>
          <template #default>
            <span class="cell_default">{{detailData.freight}}円</span>
          </template>
        </van-cell>

        <van-cell v-if="detailData.couponAmount">
          <template #title>
            <span class="cell_title">{{$t('newConfirmOrder.coupon')}}</span>
          </template>
          <template #default>
            <span
              class="cell_default"
            >-{{detailData.couponAmount?detailData.couponAmount:0}}円</span>
          </template>
        </van-cell>

        <van-cell v-if="detailData.discountAmount">
          <template #title>
            <span class="cell_title">{{$t('newConfirmOrder.discount')}}</span>
          </template>
          <template #default>
            <span
              class="cell_default"
            >-{{detailData.discountAmount?detailData.discountAmount:0}}円</span>
          </template>
        </van-cell>

        <van-cell v-if="detailData.integral">
          <template #title>
            <span class="cell_title">{{$t('index.p2')}}</span>
          </template>
          <template #default>
            <span class="cell_default">-{{detailData.integral?detailData.integral:0}}円</span>
          </template>
        </van-cell>

        <van-cell value-class="default_value">
          <template #default>
            <span class="cell_title">{{$t('order.paynumber')}}:</span>
            <span class="cell_default">{{detailData.payAmount}}<span style="font-size:10px;"> 円</span></span>
          </template>
        </van-cell>
      </div>

      <div class="total_merchandise order_info">
        <div class="title">{{$t('order.orderinfo')}}</div>
        <van-cell>
          <template #default>
            <div class="Ordernotes">
              <span class="cell_title">{{$t('newOrder.remarks')}}</span>
              <span class="order_info_default">{{detailData.userRemark}}</span>
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template #default>
            <span class="cell_title">{{$t('newOrder.date')}}</span>
            <span class="order_info_default">{{detailData.createTime}}</span>
          </template>
        </van-cell>
        <van-cell>
          <template #default>
            <span class="cell_title">{{$t('newOrder.number')}}</span>
            <span class="order_info_default">{{detailData.orderNumber}}</span>
          </template>
        </van-cell>

        <van-cell>
          <template #default>
            <span class="cell_title">{{$t('newOrder.price')}}</span>
            <span class="order_info_default">{{detailData.payAmount}} <span style="font-size:10px;"> 円</span></span>
          </template>
        </van-cell>
      </div>

      <div class="button_group">
        <button
          v-if="detailData.orderState == 2"
          class="cancel"
          @click="StoreStopPay(detailData.tradeNumber)"
        >{{$t('offlinepay.stoppay')}}</button>
        <button
          v-if="detailData.orderState == 1"
          class="cancel"
          @click="cancelOrder(detailData.tradeNumber)"
        >{{$t('order.cancel')}}</button>
        <button
          v-if="detailData.orderState == 1"
          class="gopay"
          @click="goPay(detailData)"
        >{{$t('order.gopay')}}</button>
        <button
          v-if="detailData.orderState>3&&detailData.orderState<7"
          class="cancel"
          @click="viewExprss"
        >{{$t('newOrder.viewEaxpress')}}</button>
        <button
          v-if="showButn"
          class="cancel"
          @click="delayReceiving(detailData.orderNumber)"
        >{{$t('order.delay')}}</button>
        <button
          v-if="detailData.orderState == 4"
          class="gopay"
          @click="confirmReceiving(detailData.orderNumber)"
        >{{$t('order.p1')}}</button>
        <button
          v-if="showEvaluateBtn"
          class="gopay"
          @click="goEvalute(detailData)"
        >{{$t('goodsdetail.rate')}}</button>
        <button v-if="detailData.payType == 2 && detailData.orderState < 4" class="cancel" @click="cannerOrder">
          {{$t('newOrder.cannelorder')}}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { Dialog } from 'vant'
import api from '@/static/api'
import Moment from 'moment'
import NoData from '~/components/empty/template_one'
const _get = require('lodash/get')
export default {
  layout: 'content',
  components: {
    NoData
  },
  data () {
    return {
      pay_bg: 'url(' + require('assets/images/orderstate/orderdaifukuan.png') + ')',
      isShow: false,
      detailData: {},
      orderState: '',
      orderNumber: '',
      showButn: false,
      showEvaluateBtn: false
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    })
  },
  mounted () {
    this.orderNumber = this.$route.query.orderNumber
    this.requestOrderDeatils()
  },
  methods: {
    ...mapMutations(['setSubOrderInfo']),
    requestOrderDeatils () {
      const _this = this
      if ((this.$route.query.orderState * 1) === 0) {
        _this.$axios.get(`${api.order.toPay}${this.orderNumber}`).then((res) => {
          this.getData(res)
        })
      } else {
        _this.$axios.get(`${api.order.paid}${this.orderNumber}`).then((res) => {
          console.log(res.data)
          this.getData(res)
        })
      }
    },
    getData (res) {
      const _this = this
      if (res.code === 200) {
        _this.isShow = false
        _this.detailData = res.data
        _this.orderState = res.data.orderState
        _this.showButn = _this.detailData.goodsInfoList[0].delayFlag === 1 ? 1 : 0
        _this.showEvaluateBtn = _this.detailData.goodsInfoList[0].orderEvaluateStatus === 1 ? 1 : 0
        _this.detailData.closeTime = Moment(_this.detailData.closeTime).format('mm')
        _this.detailData.address = _get(_this.detailData.addressMap, 'address') + _get(_this.detailData.addressMap, 'deliveryAddress')
        _this.detailData.realName = _get(_this.detailData.addressMap, 'realName')
        _this.detailData.mobile = _get(_this.detailData.addressMap, 'mobile')
        _this.stateCompute(_this.detailData.orderState)
      } else {
        _this.isShow = true
      }
    },
    // COD支付取消订单
    cannerOrder () {
      const _this = this
      Dialog.confirm({
        message: _this.$t('newOrder.cannelordertitle'),
        confirmButtonText: _this.$t('supply.save'),
        cancelButtonText: _this.$t('cart.closebuy'),
        confirmButtonColor: '#ff5d19',
        theme: 'round'
      }).then((result) => {
        _this.$axios.post(api.order.codcancel + this.orderNumber).then((res) => {
          if (res.code === 200) {
            _this.$toast.success(this.$t('newOrder.cannelorder'))
            // window.location.reload()
            _this.$router.go(0)
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    onClickLeft () {
      window.history.go(-1)
    },
    goEvalute (data) {
      const item = data.goodsInfoList[0]
      this.$router.push('/order/evaluate?spuid=' + item.goodsId + '&skuid=' + item.goodsSkuId + '&orderNo=' + item.orderNumber + '&img=' + item.goodsSkuImg)
      // window.location.href = `/order/evaluate?spuid=${item.goodsId}&skuid=${item.goodsSkuId}&orderNo=${item.orderNumber}&img=${item.goodsSkuImg}`
    },
    goDetail (item) {
      this.$router.push('/product/' + item.goodsId)
      // window.location.href = `/product/${item.goodsId}`
    },
    async StoreStopPay (orderNumber) {
      const _this = this
      const con = await _this.$dialog.confirm({ message: _this.$t('offlinepay.isStopPay') })
      if (con === 'confirm') {
        const res = await _this.$axios.post(`${api.order.stopPay_}${orderNumber}`)
        if (res.code === 200) {
          _this.$toast.success(_this.$t('like.cancel'))
          // window.location.reload()
          _this.$router.go(0)
        } else {
          _this.$toast('似乎遇见了一点问题，请重试')
        }
      }
    },
    goRefundDetail (item) {
      // window.location.href = '/refund/refundDetail?returnOrderNumber=' + item.returnOrderNumber
    },
    // 去支付
    goPay (item) {
      const data = {
        totalPayAmount: item.amount,
        tradeNumber: item.tradeNumber
      }
      this.setSubOrderInfo(data)
      this.$router.push('/pay/payList')
    },
    cancelOrder (tradeNumber) {
      const that = this
      that.$dialog
        .confirm({
          message: that.$t('newAdd.confirm'),
          confirmButtonColor: '#333'
        })
        .then(() => {
          that.$axios.post(`${api.order.cancel}${tradeNumber}`).then((res) => {
            if (res.code === 200) {
              // window.location.reload()
              this.$router.go(0)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    // 延迟收货
    async delayReceiving (orderNumber) {
      const that = this
      const isConfirm = await that.$dialog.confirm({
        message: that.$t('order.isdelay')
      })
      if (isConfirm === 'confirm') {
        const res = await that.$axios.put(api.order.delayReceiving, {
          orderNumber
        })
        if (res.code === 200) {
          that.$toast.success(that.$t('newOrder.delaySuccess'))
          // window.location.reload()
          this.$router.go(0)
        } else {
          that.$toast('好像遇到了一点问题，请重试')
        }
      }
    },

    async confirmReceiving (orderNumber) {
      const _this = this
      const isConfirm = await _this.$dialog.confirm({
        message: _this.$t('newOrder.isConfirm')
      })
      if (isConfirm === 'confirm') {
        const res = await _this.$axios.put(api.order.confirmReceiving, {
          orderNumber
        })
        if (res.code === 200) {
          _this.$toast.success(_this.$t('newOrder.confirmSuccess'))
          // window.location.reload()
          this.$router.go(0)
        } else {
          _this.$toast('好像遇到了一点问题，请重试')
        }
      }
    },
    stateCompute (state) {
      const that = this
      switch (state) {
        case 1:
          that.pay_bg = 'url(' + require('assets/images/orderstate/orderdaifukuan.png') + ')'
          break
        case 2:
          that.pay_bg = 'url(' + require('assets/images/orderstate/orderdaifukuan.png') + ')'
          break
        case 3:
          that.pay_bg = 'url(' + require('assets/images/orderstate/orderdaifahuo.png') + ')'
          break
        case 4:
          that.pay_bg = 'url(' + require('assets/images/orderstate/orderfahuo.png') + ')'
          break
        case 5:
          that.pay_bg = 'url(' + require('assets/images/orderstate/orderjiaoyiwancheng.png') + ')'
          break
        case 6:
          that.pay_bg = 'url(' + require('assets/images/orderstate/orderjiaoyiwancheng.png') + ')'
          break
        case 7:
          that.pay_bg = 'url(' + require('assets/images/orderstate/orderjiaoyiguanbi.png') + ')'
          break
        default:
          that.pay_bg = 'url(' + require('assets/images/orderstate/orderjiaoyiguanbi.png') + ')'
          break
      }
    },
    orderStatus (state) {
      const that = this
      switch (state) {
        case 1:
          return that.$t('newOrder.state_1')
          // eslint-disable-next-line no-unreachable
          break
        case 2:
          return that.$t('newOrder.state_2')
          // eslint-disable-next-line no-unreachable
          break
        case 3:
          return that.$t('newOrder.state_3')
          // eslint-disable-next-line no-unreachable
          break
        case 4:
          return that.$t('newOrder.state_4')
          // eslint-disable-next-line no-unreachable
          break
        case 5:
          return that.$t('newOrder.state_5')
          // eslint-disable-next-line no-unreachable
          break
        case 6:
          return that.$t('newOrder.state_5')
          // eslint-disable-next-line no-unreachable
          break
        case 7:
          return that.$t('newOrder.state_6')
          // eslint-disable-next-line no-unreachable
          break
        default:
          return that.$t('newOrder.state_7')
          // eslint-disable-next-line no-unreachable
          break
      }
    },
    refund (item) {
      const _this = this
      sessionStorage.setItem('refundInfo', JSON.stringify(_this.detailData))
      // const type = _this.detailData.originalRoadRefundFlag === 1 ? 0 : 1
      // window.location.href = `/refund/applyRefund?type=${type}`
      _this.$router.push('/couponcenter?showTip=1')
    },
    goShop (id) {
      console.log(id)
      this.$router.push('/store/' + id)
      // window.location.href = `/store/${id}`
    },
    viewExprss () {
      this.$router.push('/order/logistics?orderNumber=' + this.detailData.goodsInfoList[0].orderNumber + '&img=' + this.detailData.goodsInfoList[0].goodsSkuImg)
      // window.location.href = `/order/logistics?orderNumber=${this.detailData.goodsInfoList[0].orderNumber}&img=${this.detailData.goodsInfoList[0].goodsSkuImg}`
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.van-nav-bar__content {
    height: 88px;
    line-height: 88px;
  }
  /deep/.van-nav-bar__title {
    font-size: 32px;
    color: #333333;
  }
  /deep/.van-icon-arrow-left {
    color: #999;
    font-size: 36px;
  }
  /deep/.van-button__text {
    font-size: 28px;
  }
  /deep/.van-cell {
    line-height: 30px;
    padding: 20px 40px;
  }
  /deep/.van-dialog .van-dialog__message {
    font-size: 32px!important;
  }
  .pay_bg {
    width: 100%;
    height: 200px;
    box-sizing: border-box;
    padding: 30px;
    background-size: 100% 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .contaniner {
    font-size: 32px;
    font-weight: 500;
    text-align: left;
    color: #ffffff;
    line-height: 42px;
  }
  .pay_bg .tips {
    font-size: 24px;
    font-weight: 400;
    text-align: left;
    color: #ffffff;
    line-height: 36px;
  }
  .adress_info {
    width: 100%;
    padding: 0px;
    box-sizing: border-box;
    height: 160px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }
  .adress_info_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
  }
  .left {
    display: flex;
    align-items: center;
  }
  .left span:nth-child(2) {
    font-size: 32px;
    font-weight: 400;
    text-align: center;
    color: #333333;
  }
  .left span:last-child {
    font-size: 24px;
    font-weight: 400;
    text-align: center;
    color: #999999;
    line-height: 38px;
    padding-top: 10px;
    padding-left: 20px;
  }
  .adress_desc {
    font-size: 26px;
    padding: 20px 30px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 38px;
    padding-left: 72px;
  }
  .refund_item {
    padding-top: 10px;
    min-height: 284px;
    background: #fff;
    margin-top: 20px;
  }
  .shop_title {
    font-size: 32px;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    /* Firefox */
    -webkit-box-sizing: border-box;
    /* Safari */
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 80px;
    padding: 0 30px;
  }
  .content {
    padding: 0px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content_right {
    height: 140px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-basis: 79%;
  }
  .content_right_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 28px;
    font-weight: 400;
    text-align: left;
    color: #333333;
  }
  .content_right_footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 22px;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .footer {
    background: #fff;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 24px;
    box-sizing: border-box;
    padding: 30px;
    font-weight: 400;
    text-align: right;
    color: #333333;
    button {
      min-width: 172px;
      height: 56px;
      border: 1px solid #979797;
      border-radius: 28px;
    }
  }
  .total_merchandise {
    margin-top: 20px;
    width: 100%;
    background: #fff;
  }
  .title {
    width: 100%;
    box-sizing: border-box;
    padding: 30px;
    font-size: 28px;
    font-weight: 400;
    text-align: left;
    color: #333333;
  }
  .cell_title {
    font-size: 24px;
    font-weight: 400;
    text-align: left;
    color: #666666;
  }
  .cell_default {
    font-size: 24px;
    font-weight: 400;
    color: #333333;
  }
  .order_info_default {
    font-size: 24px;
    font-weight: 400;
    text-align: left;
    color: #666666;
  }
  .button_group {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
    padding: 22px;
    height: 98px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    font-size: 32px;
    position: fixed;
    bottom: 0;
  }
  .button_group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .cancel {
      min-width: 100px;
      height: 56px;
      border: 1px solid #979797;
      border-radius: 28px;
      font-size: 32px;
      text-align: center;
      line-height: 52px;
      background: #fff;
      margin-right: 30px;
    }
    .gopay {
      min-width: 176px;
      height: 56px;
      border: 1px solid #ff5d19;
      border-radius: 28px;
      font-size: 32px;
      color: #ff5d19;
      text-align: center;
      line-height: 52px;
      background: #fff;
    }
  }
  .Ordernotes {
    span {
      display: inline-block;
    }
    display: flex;
    span:first-child {
      flex-basis: 23%;
    }
  }
  .order_info {
    margin-bottom: 160px;
  }
  .default_value {
    text-align: right;
    .cell_default {
      font-size: 32px;
      font-weight: 600;
      text-align: left;
      color: #ff5d19;
      line-height: 44px;
    }
    .cell_title {
      font-size: 28px;
      font-weight: 400;
      text-align: right;
      color: #333333;

    }
  }
</style>
