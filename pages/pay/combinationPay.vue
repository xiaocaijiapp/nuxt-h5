<template>
<div class="com-pay-container">
  <van-nav-bar :title="$t('newPay.paycompose')" placeholder @click-left="onClickLeft">
    <template #left>
      <van-icon size="22px" name="arrow-left" color="#999999" />
    </template>
  </van-nav-bar>
  <div class="content">
    <div class="balance">
      <div class="item">
        <span class="desc">{{$t('newPay.Balancededuction')}}</span>
        <span class="num">{{remark}}</span>
      </div>
      <div class="item">
        <span class="desc">{{$t('newPay.Alsotobepaid')}}</span>
        <span class="num cnum">{{remain}}</span>
      </div>
    </div>
    <div class="tips">{{$t('order.selpaytype')}}</div>

    <van-radio-group v-model="radio" @change="changePay">
      <van-cell-group>
        <van-cell
          v-for="item in payPalMethods"
          :key="item.paytypeCode"
          center
          clickable
          @click="radio = item.paytypeCode"
        >
          <template #right-icon>
            <van-radio icon-size="1.25rem" checked-color="#FF5D19" :name="item.paytypeCode" />
          </template>
          <template #title>
            <div class="title">
              <div class="title-name" >{{item.paytypeName}}</div>
            </div>
          </template>
          <template #label>
            <div v-if="(item.paytypeCode == '02' || item.paytypeCode == '06') && item.imgUrlList.length" class="title-image">
              <img v-for="(img, index) in item.imgUrlList" :key="index" v-lazy="baseImageUrl + img" class="images-item" alt="">
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
  <div class="button_box">
    <van-button
      round
      type="primary"
      color="linear-gradient(to right, #FFA14B, #FF5D19)"
      block
      :disabled="isDisabled"
      @click="pay"
    >{{payText}}{{remain}}</van-button>
  </div>
  <van-dialog
    v-model="showDialog"
    :title="$t('offlinepay.ConvenienceStore')"
    :before-close="modelBeforeClose"
    show-cancel-button
    @confirm="confirmConvenienceStore"
    @cancel="canaelConvenienceStore"
  >
    <van-cell-group>
      <div class="ConvenienceStore">
        <div class="select-box">
          <select v-model="ConvenienceStore.type" class="select">
            <option
              value
              disabled
              selected
              style="display:none;"
            >{{$t('offlinepay.codenone')}}</option>
            <option
              v-for="item in option1"
              :key="item.value"
              :value="item.value"
            >{{item.text}}</option>
          </select>
        </div>

        <van-field
          v-model="ConvenienceStore.userName"
          required
          class="filed"
          border
          maxlength="12"
          :placeholder="$t('offlinepay.writname')"
        />
        <van-field
          v-model="ConvenienceStore.userFalName"
          required
          class="filed"
          border
          maxlength="12"
          :placeholder="$t('offlinepay.writcuscaname')"
        />
        <van-field
          v-model="ConvenienceStore.phone"
          required
          class="filed"
          border
          maxlength="13"
          :placeholder="$t('offlinepay.writphon')"
        />
        <van-field
          v-model="ConvenienceStore.email"
          required
          class="filed"
          border
          :placeholder="$t('offlinepay.writcusemail')"
        />
      </div>
    </van-cell-group>
  </van-dialog>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { mockTransactionNo } from '~/util/tools'
import Reg from '~/static/reg'
import api from '~/static/api'
export default {
  name: 'CombinationPay',
  layout: 'content',
  data () {
    return {
      activeNames: '0',
      radio: '04',
      currentCard: '0',
      toggle: true,
      payText: this.$i18n.locale === 'zh-CN' ? 'paypal支付¥' : 'paypalで支払う¥',
      payPalMethods: [],
      payType: '4',
      remain: 0,
      payData: {},
      isDisabled: false,
      showDialog: false,
      isClose: false,
      ConvenienceStore: {
        type: '',
        userName: '',
        userFalName: '',
        phone: '',
        email: ''
      },
      option1: [
        { text: 'デイリーヤマザキ', value: '00006' },
        { text: 'ローソンローソン・スリーエフ', value: '10001' },
        { text: 'ファミリーマート', value: '10002' },
        { text: 'サンクス', value: '10003' },
        { text: 'サークルＫ', value: '10004' },
        { text: 'ミニストップ', value: '10005' },
        { text: 'セイコーマート', value: '10008' }
      ]
    }
  },
  computed: {
    ...mapGetters(['subOrderInfo', 'remark', 'payMethods', 'baseImageUrl', 'total', 'locale'])
  },
  watch: {
    radio (val) {
      const _this = this
      switch (val) {
        case '05':
          _this.payText = _this.$t('order.paypal') + '¥'
          _this.payType = '5'
          break
        case '04':
          _this.payText = _this.$t('order.paypal') + '¥'
          _this.payType = '4'
          break
        case '03':
          _this.payText = _this.$t('offlinepay.ConvenienceStore') + '¥'
          _this.payType = '3'
          _this.showDialog = true
          break
        case '02':
          _this.payText = _this.$t('newPay.CreditCardsAccepted') + '¥'
          _this.payType = '2'
          break
        case '06':
          _this.payText = _this.$t('newPay.tonglianPay') + '¥'
          _this.payType = '6'
          break
        default:
          _this.payType = '4'
          _this.payText = _this.$t('order.paypal') + '¥'
          break
      }
    }
  },
  mounted () {
    console.log('subOrderInfo', this.subOrderInfo)
    this.payData = {
      payBalanceFlag: '1',
      payChannelFlag: '1',
      terminalType: '2',
      transFlow: mockTransactionNo(12),
      // 支付渠道号，2=信用卡，3=便利店，4=paypal
      channelCode: '4',
      tradeNumber: this.subOrderInfo.tradeNumber
    }
    this.remain = this.total - this.remark
    this.payMethods.forEach((item) => {
      this.locale === 'zh-CN' ? item.paytypeName = item.paytypeName.split('|')[0] : item.paytypeName = item.paytypeName.split('|')[0]
      if (item.paytypeCode !== '01' && item.paytypeCode !== '07') { this.payPalMethods.push(item) }
    })
  },
  methods: {
    ...mapMutations(['setPayMethods', 'setPaymentForm', 'setAllinPayForm', 'setRemark', 'setTotal']),
    toggleCard () {
      const _this = this
      _this.toggle = !_this.toggle
    },
    onClickLeft () {
      this.$router.push('/placeorder')
    },
    changePay (name) {
      console.log(name)
      const _this = this
      switch (name) {
        case '02':
          console.log('--------选择了信用卡------')
          _this.payData = {
            payBalanceFlag: '1',
            payChannelFlag: '1',
            transFlow: mockTransactionNo(12),
            terminalType: '2',
            // 支付渠道号，2=信用卡，3=便利店，4=paypal
            channelCode: '2',
            tradeNumber: _this.subOrderInfo.tradeNumber
          }
          this.payType = '2'
          this.isDisabled = false
          break
        case '04':
          console.log('--------选择了paypal------')
          _this.payData = {
            payBalanceFlag: '1',
            payChannelFlag: '1',
            terminalType: '2',
            transFlow: mockTransactionNo(12),
            // 支付渠道号，2=信用卡，3=便利店，4=paypal
            channelCode: '4',
            tradeNumber: _this.subOrderInfo.tradeNumber
          }
          this.payType = '4'
          this.isDisabled = false
          console.log(_this.payData)
          break
        case '05':
          console.log('--------选择了paygent------')
          _this.payData = {
            payBalanceFlag: '1',
            payChannelFlag: '1',
            terminalType: '2',
            transFlow: mockTransactionNo(12),
            // 支付渠道号，2=信用卡，3=便利店，4=paypal
            channelCode: '5',
            tradeNumber: _this.subOrderInfo.tradeNumber,
            stopReturnUrl: 'http://m.starday.jp/',
            url: 'http://m.starday.jp/order/confirmOrder/pay/response'
          }
          this.payType = '5'
          this.isDisabled = false
          break
        case '06':
          _this.payData = {
            payBalanceFlag: '1',
            payChannelFlag: '1',
            transFlow: mockTransactionNo(12),
            terminalType: '2',
            channelCode: '6',
            tradeNumber: _this.subOrderInfo.tradeNumber
          }
          this.payType = '6'
          this.isDisabled = false
          break
        default:
          break
      }
    },
    canaelConvenienceStore () {
      const _this = this
      _this.isClose = true
      this.isDisabled = false
      _this.radio = '04'
    },
    modelBeforeClose (action, done) {
      const _this = this
      done(_this.isClose)
    },
    confirmConvenienceStore () {
      const _this = this
      const regMail = new RegExp(Reg.mailBox)
      for (const key in _this.ConvenienceStore) {
        if (_this.ConvenienceStore[key]) {
          _this.isClose = true
        } else {
          _this.$toast(_this.$t('address.postcode'))
          _this.isClose = false
        }
      }
      if (!regMail.test(_this.ConvenienceStore.email)) {
        _this.$toast(_this.$t('register.err'))
        _this.isClose = false
        return
      } else if (_this.ConvenienceStore.type === '') {
        _this.$toast(_this.$t('offlinepay.codenone'))
        _this.isClose = false
        return
      }

      _this.payData = {
        // 空字符，未用第三方支付，1=用第个人余额支付
        payBalanceFlag: '1',
        // 渠道支付金额，空字符，未用第三方支付，1=用第三方支付
        payChannelFlag: '1',
        terminalType: '2',
        //
        transFlow: mockTransactionNo(12),
        // 支付渠道号，2=信用卡，3=便利店，4=paypal
        channelCode: '3',
        // 支付时便利店代码，便利店支付时必传
        convenience: _this.ConvenienceStore.type,
        // 用户ID
        customerId: '',
        // 名
        customerKana: _this.ConvenienceStore.userName,
        // 姓氏
        customerName: _this.ConvenienceStore.userFalName,
        // 电子邮箱，便利店支付时必传
        mailAddress: _this.ConvenienceStore.email,
        // 电话号码，便利店支付时必传
        telNo: _this.ConvenienceStore.phone,
        // 订单号
        tradeNumber: _this.subOrderInfo.tradeNumber
      }
      this.pay()
    },
    // 支付
    async pay () {
      const _this = this
      _this.isDisabled = true
      const data = _this.payData
      const toast = _this.$toast.loading({
        message: _this.$t('newAdd.paying'),
        forbidClick: true,
        overlay: true
      })
      await _this.$axios.post(api.pay.ment, data).then((res) => {
        console.log(res)
        console.log(res.data)
        toast.clear()
        // eslint-disable-next-line eqeqeq
        if ((_this.payType == '4' || _this.payType == '5') && res.code == 200) {
          if (res.code === 200 && res.data.resultFlag) {
            window.location.href = res.data.url
            _this.isDisabled = false
          } else {
            _this.$router.push('/pay/response?res=failed')
            // window.location.href = '/pay/response?res=failed'
            _this.isDisabled = false
          }
          // eslint-disable-next-line eqeqeq
        } else if (_this.payType == '2' && res.code === 200) {
          _this.isDisabled = false
          _this.setPaymentForm(res.data)
          _this.$router.push('/pay/payMent')
        } else if (_this.payType === 6 && res.code === 200) {
          _this.isDisabled = false
          _this.setAllinPayForm(res.data.allinPayMap)
          _this.$router.push('/pay/allinPay')
          // window.location.href = '/pay/allinPay'
        } else if (res.code === 200) {
          this.$router.push({ path: '/pay/response', query: { state: 'true' } })
          // _this.$router.push('/pay/response?res=success')
          // window.location.href = '/pay/response?res=success'
          _this.isDisabled = false
        } else {
          this.$router.push({ path: '/pay/response', query: { state: 'false' } })
          // _this.$router.push('/pay/response?res=failed')
          // window.location.href = '/pay/response?res=failed'
          _this.isDisabled = false
        }
      }, (err) => {
        toast.clear()
        this.$toast(err.message)
        _this.isDisabled = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.com-pay-container{
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  /deep/.van-nav-bar__content{
    height: 88px;
    .van-nav-bar__title{
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 88px;
    }
  }
  /deep/.van-button__text {
    font-size: 24px;
  }
  /deep/.van-icon {
    font-size: 30px;
  }
  /deep/.van-radio__icon {
    height: auto;
  }
  .content{
    flex: 1;
    .balance{
      width: 100%;
      padding: 12px 30px;
      background-color: #ffffff;
      margin-top: 20px;
      .item{
        padding: 20px 0px;
        .desc{
          font-size: 28px;
          font-weight: 400;
          color: #333333;
        }
        .num{
          font-size: 32px;
          font-weight: 700;
          color: #333333;
        }
        .cnum{
          font-size: 32px;
          font-weight: 700;
          color: #ff5d19;
        }
        .num::after{
          content: '円';
          font-size: 28px;
        }
      }
    }
    .tips{
      width: 100%;
      height: 96px;
      padding: 0 30px;
      font-size: 28px;
      font-weight: 400;
      color: #999999;
      line-height: 96px;
    }
    .van-radio-group{
      margin-top: 20px;
      .van-cell-group{
        .van-cell{
          width: 100%;
          align-items: center;
          min-height: 104px;
          padding: 10px 30px;
          .van-cell__title{
            font-size: 28px;
            font-weight: 400;
            color: #333333;
            line-height: 40px;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            .title{
              display: flex;
              flex-flow: row nowrap;
              justify-content: flex-start;
              align-items: center;
            }
            .van-cell__label{
              .ingle{
                line-height: 50px;
                .balance{
                  color: #58a4ef;
                }
              }
              .title-image{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                .images-item{
                  width: 70px;
                  height: 60px;
                  margin-right: 15px;
                }
              }
            }
          }
          .payStyle{
            font-size: 24px;
            font-weight: 400;
            color: #333333;
            line-height: 37px;
          }
        }
      }
    }
  }
  .button_box{
    width: 100%;
    padding: 10px 30px;
    .van-button{
      width: 100%;
      height: 80px;
    }
  }
  /deep/.van-dialog{
    width: 630px;
    .van-dialog__content{
      .van-cell-group{
        .ConvenienceStore{
          width: 100%;
          padding: 20px 30px;
          .select-box,.van-cell{
            width: 100%;
            height: 88px;
            padding: 10px 20px;
            border: 1px solid #c9c9c9;
            border-radius: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            .select{
              border: none;
              width: 100%;
              height: 70px;
              background-color: transparent;
            }
            .van-field__body{
              height: inherit;
              .van-field__control{
                font-size: 26px;
                padding-left: 15px;
              }
            }
          }
          .van-cell--required::before{
            top: 36px;
          }
        }
      }
    }
  }
}
</style>
