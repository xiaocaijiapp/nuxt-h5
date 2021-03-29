<template>
    <div>
        <div class="receivepage" >
            <van-nav-bar title="Starday" left-arrow @click-left="onClickLeft"></van-nav-bar>
            <div v-if="!errorFlag" class="error">
                <img src="~/assets/images/receivecoupon/wushuju.png" alt="">
                <p>リンクが切れている！</p>
            </div>
            <div v-else class="receivecontainer" :style="'height:' + (clientHeight-43) + 'px'">
                <div class="couponbox">
                    <div class="coupontype">
                        <span>{{couponInfo.couponType===0 ? '全商品クーポン' : '商品指定クーポン'}}</span>
<!--                        <span>{{couponInfo.couponType===0 ? '全商品対象' : couponInfo.cateDetalName}}</span>-->
                    </div>
                    <div class="couponname">
                      {{couponInfo.couponNameJp}}
                    </div>
                    <div class="pricebox">
                        <div>{{couponInfo.denomination}}<span>円</span></div>
                        <div>{{couponInfo.fullbuyType===0 ? '条件なし' : `${couponInfo.fullbuyPrice}円以上購入の際ご利用可能`}}</div>
                    </div>
                </div>
                <div class="loginform">
                    <div class="form-item">
                        <van-field
                            v-model="userName"
                            class="username"
                            :left-icon="require(`assets/images/login/emile.png`)"
                            placeholder="メールアドレスを入力してください"
                            :error-message="errormsg"
                        />
                    </div>
                    <div class="form-item">
                        <van-field v-model="code" class="code" :left-icon="require(`assets/images/login/password.png`)" placeholder="認証コードを入力してください">
                            <template #extra>
                                <van-button
                                    class="sendCode"
                                    :disabled="isSendCode"
                                    type="primary"
                                    size="small"
                                    @click="sendCode"
                                >{{loadtext}}</van-button>
                            </template>
                        </van-field>
                    </div>
                    <div class="login_button">
                        <van-button
                            color="linear-gradient(to right, #FFA14B, #FF5D19)"
                            block
                            round
                            :disabled="isCanLogin"
                            @click="onSubmit"
                        >今すぐもらう</van-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { setTimeout } from 'timers'
import api from 'static/api'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      userName: '',
      code: '',
      errormsg: '',
      isSendCode: true,
      loadtext: '認証コードを送信',
      isCanLogin: true,
      // 是否发送验证码
      sendStatus: false,
      time: 300,
      couponInfo: {},
      errorFlag: false,
      clientHeight: ''
    }
  },
  computed: {
    user () {
      const { userName, code } = this
      return { userName, code }
    }
  },
  watch: {
    userName (username) {
      const regmail = /^[A-Za-z0-9.-u4e00-\u9FA5-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (username && !regmail.test(username)) {
        this.errormsg = 'ご利用いただけないメールアドレス！'
        this.isSendCode = true
      } else {
        this.errormsg = ''
        this.isUsername = true
        this.isSendCode = false
      }
    },
    user: {
      handler (val) {
        if (this.isUsername && val.code && this.sendStatus) {
          this.isCanLogin = false
        } else {
          this.isCanLogin = true
        }
      },
      deep: true
    }
  },
  mounted () {
    this.clientHeight = document.documentElement.clientHeight
    this.requestCouponInfo()
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    requestCouponInfo () {
      const couponId = this.$route.query.couponId || ''
      this.$axios.get(api.coupon.couponInfo, { params: { couponId } }).then((res) => {
        if (res.code === 200) {
          this.couponInfo = res.data || {}
          this.errorFlag = true
        }
      })
    },
    sendCode () {
      this.$axios.post(`${api.coupon.receiveSendCode}${this.userName}`).then((res) => {
        if (res.code === 200) {
          this.$toast.success('送信しました!')
          this.sendStatus = true
          this.timer()
        }
      })
    },
    timer () {
      const _this = this
      if (_this.time > 0) {
        _this.time--
        _this.loadtext = _this.time.toString() + 's秒後に再取得します'
        setTimeout(_this.timer, 1000)
      } else {
        _this.time = 300
        _this.loadtext = '認証コードを送信'
        _this.isSendCode = false
      }
    },
    onSubmit () {
      const couponID = this.$route.query.couponId || ''
      this.$axios.post(api.coupon.receiveVerifyCode, { couponId: couponID, email: this.userName, emailCode: this.code }).then((res) => {
        if (res.code === 200) {
          window.location.href = '/receiveCoupon/receiveResult?statusType=1'
        } else {
          window.location.href = '/receiveCoupon/receiveResult?statusType=0'
        }
      }).catch((err) => {
        this.$toast(err.message)
      })
    }
  }
}
</script>

<style scoped lang="less">
  /deep/.van-button--round {
    height: 88px;
    line-height: 88px;
  }
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
  /deep/.van-cell {
    padding: 10px 20px;
  }
  /deep/.van-cell__value {
    line-height: 60px;
  }
  /deep/.van-icon__image {
    width: 40px;
    height: 40px;
    vertical-align: middle;
  }
  /deep/.van-field__error-message {
    font-size: 24px;
  }
@import url('./index');
</style>
