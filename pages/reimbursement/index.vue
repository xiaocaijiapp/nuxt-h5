<template>
    <div class="reimbursement-container">
      <van-nav-bar :title="$t('nextPay.remPayList')" left-arrow @click-left="$router.go(-1)" />
      <div class="content">
        <van-radio-group v-model="radio" checked-color="#ff5d19" @change="changeRadio">
          <van-cell-group>
            <van-cell v-for="item in payMethods" :key="item.id" center :border="true" :title="$i18n.locale == 'zh-CN' ? item.paytypeName.split('|')[0] : item.paytypeName.split('|')[1]">
              <template #icon>
                <img v-if="item.paytypeCode === '03'" class="pay-list-icon" :src="require('assets/images/icon/gmo.png')" />
                <img v-else-if="item.paytypeCode === '04'" class="pay-list-icon" :src="require('assets/images/icon/paypal.png')" />
                <img v-else-if="item.paytypeCode === '01'" class="pay-list-icon" :src="require('assets/images/icon/yue.png')" />
                <img v-else-if="item.paytypeCode === '07'" class="pay-list-icon" :src="require('assets/images/icon/bld.png')" />
              </template>
              <template #right-icon>
                <van-radio icon-size="5.333333vw" :name="item.paytypeCode" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="btn">
        <van-button round type="primary" color="linear-gradient(to right, #FFA14B, #FF5D19)" block :disabled="disabled" @click="pay">{{$t('supply.surePay')}}</van-button>
      </div>
    </div>
</template>

<script>
import api from 'static/api'
import { mockTransactionNo } from '~/util/tools'
export default {
  name: 'Index',
  layout: 'content',
  async asyncData ({ $axios, query }) {
    const tradeNumber = query.id
    const money = query.money
    let payMethods
    await $axios.get(api.pay.reimbursementList, {
      params: {
        pageNo: 1,
        pageSize: 5,
        sort: 'desc',
        terminalType: '2'
      }
    }).then((res) => {
      if (res.code === 200) {
        payMethods = res.data.rows
      }
    })
    return {
      payMethods,
      tradeNumber,
      money
    }
  },
  data () {
    return {
      radio: '',
      disabled: true,
      payData: {}
    }
  },
  watch: {
    'radio' (val) {
      if (!val) {
        this.disabled = true
      } else {
        this.disabled = false
      }
    }
  },
  methods: {
    changeRadio (e) {
      console.log(e)
      switch (e) {
        case '05':
          console.log(location)
          this.payData = {
            payBalanceFlag: '',
            payChannelFlag: '1',
            terminalType: '2',
            transFlow: mockTransactionNo(12),
            // 支付渠道号，2=信用卡，3=便利店，4=paypal
            channelCode: '5',
            tradeNumber: this.tradeNumber,
            payBackMoney: this.money + '.00',
            payBackType: '1',
            stopReturnUrl: location.href,
            url: location.origin + '/pay/reimbursementResult'
          }
          break
        case '04':
          this.payData = {
            payBalanceFlag: '',
            payChannelFlag: '1',
            terminalType: '2',
            transFlow: mockTransactionNo(12),
            // 支付渠道号，2=信用卡，3=便利店，4=paypal
            channelCode: '4',
            tradeNumber: this.tradeNumber,
            payBackMoney: this.money + '.00',
            payBackType: '1',
            stopReturnUrl: location.href
          }
          break
        default:
          break
      }
    },
    pay () {
      const toast = this.$toast.loading({
        message: this.$t('newAdd.paying'),
        forbidClick: true,
        duration: 0,
        overlay: true
      })
      this.$axios.post(api.pay.reimbursement, this.payData).then((res) => {
        if (res.code === 200) {
          window.location.href = res.data.url
          toast.clear()
        } else {
          this.$toast.fail(res.message)
        }
      }).catch((err) => {
        toast.clear()
        this.$toast.fail(err.message)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.reimbursement-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  .content {
    width: 100%;
    flex: 1;
    .pay-list-icon{
      width: 90px;
      height: 90px;
    }
  }
  .btn{
    width: 100%;
    padding: 30px 40px;
    .text {
      display: block;
      background: linear-gradient(90deg,#ffa14b, #ff5d19);
      border-radius: 39px;
      width: inherit;
      height: 78px;
      font-size: 28px;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      line-height: 78px;
    }
  }
}
</style>
