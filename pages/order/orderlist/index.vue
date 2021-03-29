<!---->
<template>
  <div>
    <van-sticky>
      <van-nav-bar :title="$t('order.title')" placeholder @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" color="#666666" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <van-tabs v-model="active" color="#FF5D19" title-active-color="#FF5D19" line-width="25px" line-height="3px" sticky :ellipsis="false" :swipe-threshold="5" @change="changeTabs">
      <van-tab :title="$t('order.all')" name="0">
        <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished="finished" :finished-text="$t('threeClass.finished')" @load="onLoad">
          <div v-for="(item,index) in list" :key="index" class="item">
            <div v-for="(m,k) in item.storeInfoList" :key="k" class="shop van-hairline--bottom">
              <div class="shop_title">
                <div>
                  <span class="van-ellipsis">{{m.storeName}}</span>
                  <van-icon name="arrow" />
                </div>
                <div class="state">{{orderStatus(item.orderState)}}</div>
              </div>
              <div v-if=" m.goodsInfoList.length>2" class="moreGoodsBox">
                <div class="goods_img gobeyond">
                  <img v-for="(child,l) in m.goodsInfoList" :key="l" v-lazy="baseImageUrl + child.goodsSkuImg" alt="">
                </div>
                <div class="more" @click="goOrderDetail_all(item.payState,m,child)">{{$t('seckill.lookmore')}}</div>
              </div>
              <div v-for="(child,l) in m.goodsInfoList" v-else :key="l">
                <div class="main" @click="goOrderDetail_all(item.payState,m,child)">
                  <div class="goods_img">
                    <img v-lazy="baseImageUrl + child.goodsSkuImg" alt="">
                  </div>

                  <div class="goods">
                    <div class="goods_title">
                      <div class="van-multi-ellipsis--l2">{{child.goodsTitle}}</div>
                      <div>{{child.goodsSkuPrice}}円</div>
                    </div>
                    <div class="goods_value">
                      <div>{{child.goodsSkuVal}}</div>
                      <div>x{{child.buyNumber}}</div>
                    </div>
                  </div>
                </div>

                <div v-if="child.afterState>0" class="afterSale">
                  <span v-if="child.afterState == 1">{{$t('returnList.returning')}}</span>
                  <span v-if="child.afterState == 2">{{$t('returnList.returning')}}</span>
                  <span v-if="child.afterState == 3">{{$t('returnList.REFUNDED')}}</span>
                  <span v-if="child.afterState == 4">{{$t('newOrder.Refundclosed')}}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="price">
                <span>{{$t('returnList.all')}}{{item.buyNumber}}{{$t('returnList.goods')}} {{$t('order.allprice')}}</span>
                <span>{{item.amount}}<span style="font-size:10px;"> 円</span></span>
              </div>
              <div class="button_group">
                <button v-if="(item.orderState == 1&&item.storeInfoList.length>1)|| (item.payChannel !== 3&&item.orderState == 2&&item.storeInfoList.length>1)" class="cancelOrder" @click="cancelOrder(item.tradeNumber)">{{$t('order.cancel')}}</button>
                <button v-if="item.orderState == 1" class="goPay" @click="goPay(item)">{{$t('order.gopay')}}</button>
                <button v-if="item.payChannel == 3 && item.orderState != 7 && item.storeInfoList.length>1" class="goPay" @click="StoreStopPay(item.tradeNumber)">{{$t('offlinepay.stoppay')}}</button>
                <button v-if="item.delayFlag == 1" class="cancelOrder" @click="delayReceiving(item.storeInfoList[0].goodsInfoList[0].orderNumber)">{{$t('order.delay')}}</button>
                <button v-if="item.orderState == 4" class="goPay" @click="confirmReceiving(item.storeInfoList[0].goodsInfoList[0].orderNumber)">{{$t('order.p1')}}</button>
                <button v-if="item.orderState>3&&item.orderState<7" class="cancelOrder" @click="viewExprss(item.storeInfoList[0].goodsInfoList[0])">{{$t('newOrder.viewEaxpress')}}</button>
                <button v-if="(item.orderState == 5&& item.orderEvaluateStatus != 1) || (item.orderState == 6 && item.orderEvaluateStatus != 1)" class="goPay" @click="goComment(item.storeInfoList[0].goodsInfoList[0])">{{$t('user_main.comont')}}</button>
                <button v-if="item.payType == 2 && item.orderState <= 3" class="cancelOrder" @click="cannerOrder(index)">
                  {{$t('newOrder.cannelorder')}}
                </button>
              </div>
              <div v-if="item.delayFlag == 1" class="yanqi">{{$t('newOrder.Automatic')}}{{item.automaticReceiveTime}}{{$t('newOrder.day')}},{{$t('newOrder.tips')}}</div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <!-- 待付款 -->
      <van-tab :title="$t('order.nopay')" name="1">
        <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished="finished" :finished-text="$t('threeClass.finished')" @load="onLoad">
          <div v-for="(item,index) in list" :key="index" class="item">
            <div v-for="(m,k) in item.storeInfoList" :key="k" class="shop">
              <div class="shop_title">
                <div>
                  <span class="van-ellipsis">{{m.storeName}}</span>
                  <van-icon name="arrow" />
                </div>
                <div class="state">{{orderStatus(item.orderState)}}</div>
              </div>
              <div v-if=" m.goodsInfoList.length>2" class="moreGoodsBox">
                <div class="goods_img gobeyond">
                  <img v-for="(child,l) in m.goodsInfoList" :key="l" v-lazy="baseImageUrl + child.goodsSkuImg" alt="">
                </div>
                <div class="more" @click="goOrderDetail(item.payState,m)">{{$t('seckill.lookmore')}}</div>
              </div>
              <div v-for="(child,l) in m.goodsInfoList" v-else :key="l" class="main" @click="goOrderDetail(0,m)">
                <div class="goods_img">
                  <img v-lazy="baseImageUrl + child.goodsSkuImg" alt="">
                </div>
                <div class="goods">
                  <div class="goods_title">
                    <div class="van-multi-ellipsis--l2">{{child.goodsTitle}}</div>
                    <div>{{child.goodsSkuPrice + '円'}}</div>
                  </div>
                  <div class="goods_value">
                    <div>{{child.goodsSkuVal}}</div>
                    <div>x{{child.buyNumber}}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="price">
                <span>{{$t('returnList.all')}}{{item.buyNumber}}{{$t('returnList.goods')}} {{$t('order.allprice')}}</span>
                <span>{{item.amount}} <span style="font-size:10px;"> 円</span></span>
              </div>
              <div class="button_group">
                <button v-if="item.orderState == 1&&item.storeInfoList.length>1" class="cancelOrder" @click="cancelOrder(item.tradeNumber)">{{$t('order.cancelorder')}}</button>
                <button v-if="item.orderState == 1" class="goPay" @click="goPay(item)">{{$t('order.goPay')}}</button>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>

      <!-- 待发货 -->
      <van-tab :title="$t('order.nodeLiver')" name="2">
        <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished="finished" :finished-text="$t('threeClass.finished')" @load="onLoad">
          <div v-for="(item,index) in list" :key="index" class="item">
            <div class="shop">
              <div class="shop_title">
                <div>
                  <span class="van-ellipsis">{{item.storeName}}</span>
                  <van-icon name="arrow" />
                </div>
                <div class="state">{{orderStatus(item.orderState)}}</div>
              </div>

              <div class="main" @click="goOrderDetail(1,item)">
                <div class="goods_img">
                  <img v-lazy="baseImageUrl + item.goodsSkuImg" alt="">
                </div>

                <div class="goods">
                  <div class="goods_title">
                    <div class="van-multi-ellipsis--l2">{{item.goodsTitle}}</div>
                    <div>{{item.goodsSkuPrice + '円'}}</div>
                  </div>
                  <div class="goods_value">
                    <div>{{item.goodsSkuVal}}</div>
                    <div>x{{item.buyNumber}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="item.afterState>0" class="afterSale">
              <span v-if="item.afterState == 1">{{$t('returnList.returning')}}</span>
              <span v-if="item.afterState == 2">{{$t('returnList.returning')}}</span>
              <span v-if="item.afterState == 3">{{$t('returnList.REFUNDED')}}</span>
            </div>
            <div class="footer">
              <div class="price">
                <span>{{$t('returnList.all')}}{{item.buyNumber}}{{$t('returnList.goods')}} {{$t('order.allprice')}}</span>
                <span>{{item.payAmount}} <span style="font-size:10px;"> 円</span></span>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
      <van-tab :title="$t('order.bedeliver')" name="3">
        <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished="finished" :finished-text="$t('threeClass.finished')" @load="onLoad">
          <div v-for="(item,index) in list" :key="index" class="item">
            <div class="shop van-hairline--bottom">
              <div class="shop_title">
                <div>
                  <span class="van-ellipsis">{{item.storeName}}</span>
                  <van-icon name="arrow" />
                </div>
                <div class="state">{{orderStatus(item.orderState)}}</div>
              </div>

              <div class="main" @click="goOrderDetail(1,item)">
                <div class="goods_img">
                  <img v-lazy="baseImageUrl + item.goodsSkuImg" alt="">
                </div>
                <div class="goods">
                  <div class="goods_title">
                    <div class="van-multi-ellipsis--l2">{{item.goodsTitle}}</div>
                    <div>{{item.goodsSkuPrice + '円'}}</div>
                  </div>
                  <div class="goods_value">
                    <div>{{item.goodsSkuVal}}</div>
                    <div>x{{item.buyNumber}}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="price">
                <span>{{$t('returnList.all')}}{{item.buyNumber}}{{$t('returnList.goods')}} {{$t('order.allprice')}}</span>
                <span>{{item.payAmount}}<span style="font-size:10px;"> 円</span></span>
              </div>
              <div class="button_group">
                <button v-if="item.delayFlag == 1" class="cancelOrder" @click="delayReceiving(item.orderNumber)">{{$t('order.delay')}}</button>
                <button v-if="item.orderState == 4" class="goPay" @click="confirmReceiving(item.orderNumber)">{{$t('order.p1')}}</button>
              </div>
              <div v-if="item.delayFlag == 1" class="yanqi">{{item.automaticReceiveTime>0?$t('newOrder.Automatic')+item.automaticReceiveTime+$t('newOrder.day'):'系统将在今天自动收货'}}</div>
            </div>
          </div>
        </van-list>
      </van-tab>

      <van-tab :title="$t('newOrder.Tobeevaluated')" name="4">
        <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished="finished" :finished-text="$t('threeClass.finished')" @load="onLoad">
          <div v-for="(item,index) in list" :key="index" class="item">
            <div class="shop">
              <div class="shop_title">
                <div>
                  <span class="van-ellipsis">{{item.storeName}}</span>
                  <van-icon name="arrow" />
                </div>
                <div class="state">{{orderStatus(item.orderState)}}</div>
              </div>

              <div class="main" @click="goOrderDetail(1,item)">
                <div class="goods_img">
                  <img v-lazy="baseImageUrl + item.goodsSkuImg" alt="">
                </div>

                <div class="goods">
                  <div class="goods_title">
                    <div class="van-multi-ellipsis--l2">{{item.goodsTitle}}</div>
                    <div>{{item.goodsSkuPrice + '円'}}</div>
                  </div>
                  <div class="goods_value">
                    <div>{{item.goodsSkuVal}}</div>
                    <div>x{{item.buyNumber}}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="footer">
              <div class="price">
                <span>{{$t('returnList.all')}}{{item.buyNumber}}{{$t('returnList.goods')}} {{$t('order.allprice')}} {{$t('order.allprice')}}</span>
                <span>{{item.payAmount}}<span style="font-size:10px;"> 円</span></span>
              </div>
              <div class="button_group">
                <button v-if="(item.orderState == 5&& item.orderEvaluateStatus != 1) || (item.orderState == 6 && item.orderEvaluateStatus != 1)" class="goPay" @click="goComment(item)">{{$t('user_main.comont')}}</button>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Dialog } from 'vant'
import api from 'static/api'
import { mapGetters, mapMutations } from 'vuex'
export default {
  layout: 'content',
  components: {},
  data () {
    return {
      active: '0',
      radio: 1,
      list: [],
      loading: true,
      finished: false,
      pageNum: 1
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    })
  },
  mounted () {
    if (window.location.href.includes('?')) {
      this.active = window.location.href.split('?')[1].split('=')[1]
      if (this.active * 1 > 1) {
        this.getOtherData(this.active)
      } else if (this.active * 1 === 1) {
        this.init(0)
      } else {
        this.init(+this.active + 1)
      }
    } else {
      this.init('')
    }
  },
  methods: {
    ...mapMutations(['setSubOrderInfo']),
    // 货到付款商品 取消订单
    cannerOrder (index) {
      Dialog.confirm({
        message: this.$t('newOrder.cannelordertitle'),
        confirmButtonText: this.$t('supply.save'),
        cancelButtonText: this.$t('cart.closebuy'),
        confirmButtonColor: '#ff5d19',
        theme: 'round'
      }).then((result) => {
        const ordernumber = this.list[index].storeInfoList[0].goodsInfoList[0].orderNumber
        this.$axios.post(api.order.codcancel + ordernumber).then((res) => {
          console.log(res)
          if (res.code === 200) {
            this.$toast.success(this.$t('newOrder.cannelorder'))
            this.$router.go(0)
            // window.location.reload()
          }
        })
      }).catch(() => {
        console.log('取消')
      })
    },
    // 去评价
    goComment (item) {
      // window.location.href = `/order/evaluate?spuid=${item.goodsId}&skuid=${item.goodsSkuId}&orderNo=${item.orderNumber}&img=${item.goodsSkuImg}`
      this.$router.push({
        path: '/order/evaluate',
        query: {
          spuid: item.goodsId,
          skuid: item.goodsSkuId,
          orderNo: item.orderNumber,
          img: item.goodsSkuImg
        }
      })
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
          return that.$t('order.bedeliver')
          // return that.$t('newOrder.state_4')
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
    onClickLeft () {
      this.$router.push('/personal')
    },
    viewExprss (item) {
      this.$router.push('/order/logistics?orderNumber=' + item.orderNumber + '&img=' + item.goodsSkuImg)
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
    // 便利店停止支付
    StoreStopPay (orderNumber) {
      const _this = this
      const con = _this.$dialog.confirm({
        message: _this.$t('offlinepay.isStopPay')
      })
      if (con === 'confirm') {
        _this.$axios.post(`${api.order.stopPay_}${orderNumber}`).then((res) => {
          if (res.code === 200) {
            _this.$toast.success(_this.$t('like.cancel'))
            // window.location.reload()
            this.$router.go(0)
          } else {
            _this.$toast('似乎遇见了一点问题，请重试')
          }
        })
      }
    },
    changeTabs (name, title) {
      const _this = this
      _this.pageNum = 1
      _this.list = []
      _this.loading = false
      _this.finished = false
      if (name * 1 === 0) {
        _this.init('')
      } else if (name * 1 === 1) {
        _this.init(0)
      } else {
        _this.getOtherData(name)
      }
    },
    goOrderDetail (state, item) {
      let orderNumber
      if (state === 0) {
        orderNumber = item.pOrderNumber
      } else {
        state = 1
        orderNumber = item.orderNumber
      }
      this.$router.push('/order/orderdetail/?orderNumber=' + orderNumber + '&orderState=' + state)
      // window.location.href = `/order/orderdetail/${state}/${orderNumber}`
    },
    goOrderDetail_all (paystate, store, goods) {
      let orderNumber
      if (paystate === 0) {
        orderNumber = store.pOrderNumber
      } else if (paystate === 2) {
        paystate = 2
        orderNumber = goods.orderNumber
      } else {
        paystate = 1
        orderNumber = goods.orderNumber
      }
      this.$router.push('/order/orderdetail/?orderNumber=' + orderNumber + '&orderState=' + paystate)
      // window.location.href = `/order/orderdetail/${paystate}/${orderNumber}`
    },
    cancelOrder (tradeNumber) {
      const _this = this
      _this.$dialog
        .confirm({
          message: _this.$t('newAdd.confirm'),
          confirmButtonColor: '#333'
        })
        .then(() => {
          _this.$axios.post(`${api.order.cancel}${tradeNumber}`).then((res) => {
            if (res.code === 200) {
              // window.location.reload()
              this.$router.go(0)
            }
          })
        })
        .catch(() => {
        })
    },
    // 延迟收货
    async delayReceiving (orderNumber) {
      const _this = this
      const isConfirm = await _this.$dialog.confirm({
        message: _this.$t('order.isdelay')
      })
      if (isConfirm === 'confirm') {
        _this.$axios.put(api.order.delayReceiving, { orderNumber }).then((res) => {
          if (res.code === 200) {
            _this.$toast.success(_this.$t('newOrder.delaySuccess'))
            // window.location.reload()
            this.$router.go(0)
          } else {
            _this.$toast('好像遇到了一点问题，请重试')
          }
        })
      }
    },

    async confirmReceiving (orderNumber) {
      const _this = this
      const isConfirm = await _this.$dialog.confirm({
        message: _this.$t('newOrder.isConfirm'),
        confirmButtonText: this.$t('supply.save'),
        cancelButtonText: this.$t('cart.closebuy')
      })
      if (isConfirm === 'confirm') {
        _this.$axios.put(api.order.confirmReceiving, { orderNumber }).then((res) => {
          if (res.code === 200) {
            _this.$toast.success(_this.$t('newOrder.confirmSuccess'))
            // window.location.reload()
            this.$router.go(0)
          } else {
            _this.$toast('好像遇到了一点问题，请重试')
          }
        })
      }
    },
    init (state) {
      const _this = this
      const data = {
        orderByField: '',
        orderState: '',
        pageNo: _this.pageNum,
        pageSize: 10,
        payState: state,
        sort: ''
      }
      _this.$axios.post(api.order.list, data).then((res) => {
        if (res.code === 200) {
          res.data.rows.map((farther, index) => {
            farther.storeInfoList.map((item, i) => {
              item.goodsInfoList.map((childItem) => {
                farther.orderState = childItem.orderState
              })
            })
          })
          console.log(res.data.rows)
          _this.list = _this.list.concat(res.data.rows)
          if (res.data.rows.length === 0) {
            _this.finished = true
          } else {
            _this.loading = false
          }
        }
      })
    },
    getOtherData (state) {
      const _this = this
      const data = {
        orderByField: '',
        orderState: +state + 1,
        pageNo: _this.pageNum,
        pageSize: 10,
        payState: '',
        sort: ''
      }
      _this.$axios.post(api.order.otherList, data).then((res) => {
        if (res.code === 200) {
          console.log(res.data.rows)
          _this.list = _this.list.concat(res.data.rows)
          if (res.data.totalPage <= res.data.page) {
            _this.finished = true
          } else {
            _this.loading = false
          }
        }
      })
    },
    onLoad () {
      // 异步更新数据
      const _this = this
      setTimeout(() => {
        // 加载状态结束
        _this.pageNum++
        if (_this.active * 1 >= 2) {
          _this.getOtherData(_this.active * 1)
        } else {
          _this.init(_this.active * 1 === 1 ? 0 : '')
        }
      }, 1000)
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
/deep/.van-tabs--line .van-tabs__wrap {
  height: 80px;
}
/deep/.van-tab__text {
  font-size: 28px;
  line-height: 32px;
}
/deep/.van-loading__text {
  color: #969799;
  font-size: 24px !important;
  line-height: 80px !important;
  text-align: center;
}
/deep/.van-list__finished-text {
  color: #969799;
  font-size: 24px !important;
  line-height: 80px !important;
  text-align: center;
}
/deep/.van-ellipsis {
  font-size: 28px;
}
.item {
  width: 100%;
  box-sizing: border-box;
  padding: 30px;
  background: #fff;
  margin-top: 20px;
  .shop {
    width: 100%;
    padding-bottom: 20px;
    .shop_title {
      width: 100%;
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div:first-child {
        font-size: 15px;
        max-width: 500px;
        font-weight: 400;
        text-align: left;
        color: #333333;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .state {
        font-size: 30px;
        font-weight: 400;
        text-align: right;
        color: #ffaa45;
      }
    }
    .main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      height: 150px;
      .goods_img {
        width: 140px;
        height: 140px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .goods_title {
        font-size: 28px;
        font-weight: 400;
        text-align: left;
        color: #333333;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        div:first-child {
          width: 400px;
        }
        div:last-child {
          font-size: 26px;
        }
      }
      .goods {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-basis: 78%;
        height: 100%;
      }
      .goods_value {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        font-size: 22px;

        font-weight: 400;
        text-align: left;
        color: #999999;
      }
    }
  }
  .footer {
    width: 100%;
    .price {
      font-size: 24px;
      height: 100px;
      font-weight: 400;
      line-height: 100px;
      text-align: right;
      color: #333333;
      span:last-child {
        font-size: 32px;
        font-weight: 600;
        text-align: left;
        color: #ff5d19;
      }
    }
    .button_group {
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .cancelOrder {
        min-width: 200px;
        height: 56px;
        border: 1px solid #979797;
        border-radius: 28px;
        font-size: 28px;
        text-align: center;
        line-height: 52px;

        background: #fff;
        margin-right: 30px;
      }
      .goPay {
        min-width: 176px;
        height: 56px;
        border: 1px solid #ff5d19;
        border-radius: 28px;
        font-size: 32px;
        color: #ff5d19;
        text-align: center;
        line-height: 32px;
        background: #fff;
        margin-right: 20px;
      }
    }
  }
  .afterSale {
    span {
      display: inline-block;
      width: 100%;
      font-size: 24px;
      text-align: right;
      font-weight: 400;
      text-align: right;
      color: #ffaa45;
    }
  }
  .yanqi {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    font-size: 24px;
    font-weight: 400;
    text-align: left;
    color: #ff9000;
    line-height: 32px;
  }
  .gobeyond {
    div {
      margin-left: 10px;
    }
  }
  .moreGoodsBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .more {
      min-width: 52px;
      height: 74px;
      font-size: 28px;
      line-height: 74px;
      font-weight: 400;
      text-align: left;
      color: #333333;
    }
    .gobeyond {
      flex-basis: 89%;
      overflow: hidden;
    }
  }
}
</style>
