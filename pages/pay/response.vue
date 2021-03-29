<template>
  <div class="pay-response-container">
    <van-sticky>
      <van-nav-bar :title="$t('pay.response')" placeholder @click-left="toIndex">
        <template #left>
          <van-icon size="22px" name="arrow-left" color="#999999" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="payResponse">
      <div class="stateImage">
        <img v-if="res == 'success' || state == 'true'" class="resp-img" :src="require('~/assets/images/pay/success.png')" />
        <img v-else class="resp-img" :src="require('~/assets/images/pay/failed.png')" />
      </div>
      <div class="deliver">
        <div v-if="res == 'success' || state == 'true'" class="success">{{$t('supply.paysuc')}}</div>
        <div v-else class="success">{{$t('offlinepay.payerror')}}</div>
        <div v-if="cash" class="fatherbox">
          <span class="desc">{{$t('supply.copoWith')}}</span>
          <span class="num">{{`${total}円`}}</span>
          <div class="kdfkimgs">{{$t('order.cashDelivery')}}</div>
        </div>
        <div v-if="cash" class="poundage">
          <span>{{$t('supply.copoWithtitle')}}</span>
          <span class="dshknum">{{CODFEE}}円</span>
        </div>
      </div>
      <div class="button-container">
        <van-button v-if="res == 'success' || state == 'true'" url="/" size="large" round class="bottom-button" color="#979797" plain>{{$t('newPay.goHome')}}</van-button>
        <van-button v-if="res == 'success' || state == 'true'" url="/order/orderlist" size="large" round color="#ff5d19" plain class="bottom-button">{{$t('newPay.viewOrder')}}</van-button>
        <van-button v-else round url="/order/orderlist" size="large" color="#ff5d19" plain class="bottom-button">{{$t('newPay.viewOrder')}}</van-button>
      </div>
    </div>
    <Recommend />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Recommend from '~/components/recommend/recommend'
export default {
  name: 'Response',
  layout: 'content',
  components: {
    Recommend
  },
  asyncData ({ query }) {
    // cash 货到付款
    const { res, state, cash = false, allin } = query
    return {
      res,
      state,
      cash,
      allin
    }
  },
  computed: {
    ...mapGetters(['subOrderInfo', 'CODFEE']),
    total () {
      return this.subOrderInfo.totalPayAmount
    }
  },
  mounted () {
    if (this.allin) {
      this.cash = false
    }
  },
  methods: {
    toIndex () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
.pay-response-container {
  /deep/ .van-button {
    font-size: 26px;
  }
  /deep/.van-nav-bar__content {
    height: 88px;
    .van-nav-bar__title {
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 88px;
    }
  }
  .payResponse {
    padding: 15px 0;
    width: 100%;
    height: 400px;
    background-color: transparent;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    .stateImage{
      width: 124px;
      height: 124px;
      margin-bottom: 20px;
      .resp-img{
        width: 124px;
        height: 124px;
      }
    }
    .deliver {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      .fatherbox,
      .poundage {
        position: relative;
        font-size: 26px;
        font-weight: 400;
        color: #666666;
        line-height: 33px;
        margin: 10px 0px;
        .num,
        .dshknum {
          color: #ff5d19;
        }
        .kdfkimgs {
          position: absolute;
          right: -128px;
          top: 0;
          text-align: center;
          width: 126px;
          font-size: 24px;
          font-weight: 400;
          color: #ffffff;
          line-height: 33px;
          padding-left: 10px;
          background-image: url('../../assets/images/pay/hdfk1.png');
          background-origin: border-box;
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }
      .success {
        font-size: 32px;
        font-weight: 600;
        text-align: left;
        color: #333333;
        line-height: 45px;
      }
    }
    .button-container {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      .bottom-button {
        margin: 0 15px;
        background-color: transparent;
        .van-button__content {
          padding: 10px 20px;
        }
      }
    }
  }
}
</style>
