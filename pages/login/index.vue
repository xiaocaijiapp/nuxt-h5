<template>
  <div class="login-container" @click="hideSelect">
    <div class="headers">
      <van-icon size="22px" :name="require(`assets/images/login/close.png`)" @click="goHome" />
      <div class="language" @click="showModel = true">{{langType ? $t('newUserInfo.Chinese') : $t('newUserInfo.janpanse')}}</div>
    </div>
    <div class="content">
      <div class="login_main">
        <van-icon size="93px" class="main-icon" :name="require(`assets/images/login/starday_logo.png`)" />
        <div v-if="!isEmailLogin" class="login_desc">{{$t('login.emilesub')}}</div>
        <!-- <div v-else class="login_desc">{{$t('login.emileCode')}}</div> -->
        <van-tabs v-else v-model="activeTab">
          <van-tab :title="$t('register.emailLogin')"></van-tab>
          <van-tab :title="$t('register.phoneLogin')"></van-tab>
        </van-tabs>
        <div class="login_form">
          <van-cell-group>
            <div class="form-item">
              <van-field v-if="activeTab === 0 || !isEmailLogin" v-model="username" class="username" clearable :left-icon="require(`assets/images/login/emile.png`)" :placeholder="isEmailLogin ? $t('login.plaintEmail') : $t('login.emile')" :error-message="errormsg" />
              <!-- <van-field v-else v-model="phoneVal" class="username" clearable :left-icon="require(`assets/images/login/phone.png`)" placeholder="请输入手机号" :error-message="errormsg" /> -->
              <div v-if="activeTab !== 0" class="codebox">
                <img src="@/assets/images/login/phone.png" />
                <div class="selectbox">
                  <span @click.stop="selectArea">
                    {{areacode.label}}
                  </span>
                  <img src="@/assets/images/login/selectdown.png"  @click.stop="selectArea"/>
                  <div class="downbox" v-if="showDown">
                    <div class="itembox" v-for="(item, index) in opctions" :key="index" @click="checkValue(item)">
                      {{item.label}}
                    </div>
                  </div>
                </div>
                <input v-model="phoneVal" :placeholder="$t('register.plaIntPhone')"/>
              </div>
            </div>
            <div v-if="isEmailLogin" class="form-item">
              <van-field v-if="activeTab === 0 && isEmailLogin" v-model="code" class="code" clearable :left-icon="require(`assets/images/login/password.png`)" :placeholder="$t('resetpwd.code')">
                <template #extra>
                  <van-button v-if="isEmailLogin && activeTab === 0" class="sendCode" :disabled="isSendCode" type="primary" size="small" @click="sendCode">{{loadText}}</van-button>
                </template>
              </van-field>

              <van-field v-if="activeTab !== 0 && isEmailLogin" v-model="phoneCode" class="code" clearable :left-icon="require(`assets/images/login/password.png`)" :placeholder="$t('resetpwd.code')">
                <template #extra>
                  <van-button v-if="activeTab !== 0 && isEmailLogin" class="sendCode" :disabled="!phoneVal" type="primary" size="small" @click="sendCodeCopy">{{loadTextCopy}}</van-button>
                </template>
              </van-field>
            </div>
            <div v-else class="form-item">
              <van-field v-model="password" class="password" clearable :left-icon="require(`assets/images/login/password.png`)" :right-icon="tog" :type="isPwd" :placeholder="$t('login.passworld')" @click-right-icon="toggleIcon" />
            </div>
          </van-cell-group>
          <div class="tip">
            <span @click="goRegister">{{$t('login.newperson')}}</span>
            <span @click="goRefundPwd">{{$t('login.forgotpwd')}}</span>
          </div>
          <div class="login_button">
            <van-button color="linear-gradient(to right, #FFA24C, #FF5E1A)" block round :disabled="isCanLogin" @click="handleLogin">{{$t('login.loginnow')}}</van-button>
          </div>
          <div v-if="isEmailLogin" class="tip2" @click="goEmileLogin">{{$t('login.emilesub')}}</div>
          <div v-else class="tip2" @click="goEmileLogin">{{$t('login.emileCode')}}</div>
          <div class="lineLog">
            <van-divider :style="{ color: '#d1d1d1', borderColor: '#efefef' }">or</van-divider>
            <div class="thirdlogin">
              <van-icon size="35px" :name="require(`assets/images/login/line.png`)" @click="goLineLogin" />
              <van-icon size="35px" :name="require(`assets/images/login/google.png`)" @click="goGoogleLogin" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <van-dialog v-model="showModel" close-on-click-overlay :title="$t('newUserInfo.setLanguage')" confirm-button-color="rgba(102,102,102,1)" @confirm="changeLanguage">
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell size="large" :title="$t('newUserInfo.janpanse')" clickable @click="radio = '1'">
            <template #right-icon>
              <van-radio name="1" checked-color="#FF5D19" />
            </template>
          </van-cell>
          <van-cell size="large" :title="$t('newUserInfo.Chinese')" clickable @click="radio = '2'">
            <template #right-icon>
              <van-radio name="2" checked-color="#FF5D19" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import Reg from 'static/reg'
import api from 'static/api'
export default {
  name: 'Login',
  layout: 'content',
  data () {
    return {
      showModel: false,
      radio: '1',
      isEmailLogin: false,
      username: '', // 账号
      password: '', // 密码
      errormsg: '',
      isSendCode: true,
      isSendCodeCopy: true,
      loadText: '送信',
      loadTextCopy: '送信',
      tog: 'closed-eye',
      isPwd: 'password', // 密码输入框类型
      isCanLogin: false,
      code: '',
      onOff: true,
      // 是否发送验证码
      sendStatus: false,
      time: 300,
      timeCopy: 300,
      setTime: null,
      setTimeCopy: null,
      cartList: [],
      activeTab: 0,
      phoneVal: '',
      areacode: {
        label: '+81',
        value: '+81'
      },
      opctions: [
        {
          label: '+86',
          value: '+86'
        },
        {
          label: '+81',
          value: '+81'
        }
      ],
      showDown: false,
      phoneCode: ''
    }
  },
  computed: {
    ...mapGetters(['locale']),
    langType () {
      return this.locale === 'zh-CN'
    },
    user () {
      const { username, password, code, phoneVal, phoneCode } = this
      return { username, password, code, phoneVal, phoneCode }
    }
  },
  watch: {
    isEmailLogin (bool) {
      console.log(bool)
    },
    username (username) {
      const vm = this
      const mailReg = new RegExp(Reg.mailBox)
      if (!vm.isEmailLogin) {
        const reg = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/
        if ((mailReg.test(username) && username) || reg.test(username) || username.length === 11) {
          vm.errormsg = ''
          vm.isUsername = true
          vm.isSendCode = false
        } else {
          this.errormsg = vm.$t('register.emailPhoneTypeErr')
          this.isSendCode = true
        }
      } else if (!mailReg.test(username) && username) {
        this.errormsg = vm.$t('register.err')
        this.isSendCode = true
      } else {
        this.errormsg = ''
        this.isUsername = true
        this.isSendCode = false
      }
    },
    user: {
      immediate: true,
      handler (val) {
        if ((this.isUsername && val.password) || (this.isUsername && val.code && (this.sendStatus || val.code.length === 6)) || (val.phoneVal && val.phoneCode)) {
          this.isCanLogin = false
        } else {
          this.isCanLogin = true
        }
      }
    }
  },
  created () {
    this.locale === 'zh-CN' ? this.radio = '2' : this.radio = '1'
    this.locale === 'zh-CN' ? this.loadText = '发送验证码' : this.loadText = '認証コードを送信する'
    this.locale === 'zh-CN' ? this.loadTextCopy = '发送验证码' : this.loadTextCopy = '認証コードを送信する'
  },
  mounted () {
    this.cartList = JSON.parse(window.sessionStorage.getItem('touristCartData')) || []
  },
  methods: {
    ...mapMutations(['SET_LANG']),
    ...mapActions(['passwordLogin', 'emailLogin', 'phoneLogin']),
    sendCodeCopy () {
      // console.log('111112222')
      const vm = this
      vm.$axios({
        url: 'starday-auth/login/user/mobile/send/' + vm.phoneVal + '/' + vm.areacode.value,
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          vm.$toast(res.message)
          vm.timerCopy()
        }
      }).catch((err) => {
        vm.$toast(err.message)
      })
    },
    selectArea () {
      this.showDown = true
    },
    hideSelect () {
      this.showDown = false
    },
    checkValue (item) {
      this.areacode = item
      this.showDown = false
    },
    goHome () {
      this.$router.push({ path: '/' })
    },
    changeLanguage () {
      const that = this
      switch (that.radio) {
        case '1':
          that.$i18n.locale = 'ja-JP'
          that.SET_LANG('ja-JP')
          this.$Locale('ja-JP')
          break
        case '2':
          that.$i18n.locale = 'zh-CN'
          that.SET_LANG('zh-CN')
          this.$Locale('zh-CN')
          break
        default:
          that.$i18n.locale = 'ja-JP'
          that.SET_LANG('ja-JP')
          this.$Locale('ja-JP')
      }
    },
    handleLogin () {
      const that = this
      // const reg = new RegExp(Reg.mailBox)
      const fullPath = window.sessionStorage.getItem('page') ? window.sessionStorage.getItem('page') === '/setup' ? '/personal' : window.sessionStorage.getItem('page') : ''
      // if (!reg.test(that.username)) {
      //   return that.$toast(that.$t('login.emailFormaterr'))
      // }
      if (that.isEmailLogin) {
        if (that.activeTab === 0) {
          const loginData = { username: that.username, code: that.code }
          that.emailLogin(loginData).then((res) => {
            that.$toast.success(that.$t('login.success'))
            that.$router.push(fullPath)
            if (that.cartList && that.cartList.length) {
              that.queryAddVisitorCart()
            }
          }).catch((err) => {
            that.$toast(err.message)
          })
        } else {
          const loginData = {
            code: that.phoneCode,
            country: that.areacode.value,
            mobile: that.phoneVal
          }
          that.phoneLogin(loginData).then((res) => {
            that.$toast.success(that.$t('login.success'))
            that.$router.push(fullPath)
            if (that.cartList && that.cartList.length) {
              that.queryAddVisitorCart()
            }
          }).catch((err) => {
            that.$toast(err.message)
          })
        }
      } else {
        // 执行邮箱密码登录
        const loginData = { userName: that.username, password: that.password }
        that.passwordLogin(loginData).then((res) => {
          that.$toast.success(that.$t('login.success'))
          that.$router.push(fullPath)
          if (that.cartList && that.cartList.length) {
            that.queryAddVisitorCart()
          }
        }).catch((err) => {
          that.$toast(err.message)
        })
      }
    },
    // 游客登录加入购物车
    queryAddVisitorCart () {
      const _this = this
      const fullPath = window.sessionStorage.getItem('page')
      const dataList = []
      _this.cartList.forEach((item) => {
        item.shopItems.forEach((goodsItem) => {
          const checkObj = {}
          checkObj.num = goodsItem.num
          checkObj.shareId = goodsItem.shareId
          checkObj.skuId = goodsItem.skuId
          checkObj.skuValue = goodsItem.skuValue
          checkObj.spuId = goodsItem.spuId
          checkObj.storeId = item.storeId
          dataList.push(checkObj)
        })
      })
      _this.$axios.post(api.cart.loginVisitorCart, dataList).then((res) => {
        if (res.code === 200) {
          _this.$router.push(fullPath)
          window.sessionStorage.removeItem('touristCartData')
          window.sessionStorage.removeItem('checkTouristCartData')
        }
      })
    },
    sendCode () {
      const that = this
      if (that.username) {
        that.$axios.post(api.login.Code + that.username).then((res) => {
          if (res.code === 200) {
            that.$toast.success(that.$t('register.sendSuccess'))
            that.sendStatus = true
            that.timer()
          } else {
            that.$toast.fail(that.$t('mail.sendFailed'))
          }
        })
      } else {
        that.$toast('请输入邮箱')
      }
    },
    timerCopy () {
      const that = this
      that.setTimeCopy = setInterval(() => {
        if (that.timeCopy > 0) {
          that.timeCopy -= 1
          that.loadTextCopy = that.timeCopy.toString() + that.$t('register.changed')
        } else {
          that.timeCopy = 300
          that.loadTextCopy = that.$t('register.getCode')
          clearInterval(that.setTimeCopy)
          that.isSendCodeCopy = false
        }
      }, 1000)
    },
    timer () {
      const that = this
      that.setTime = setInterval(() => {
        if (that.time > 0) {
          that.time -= 1
          that.loadText = that.time.toString() + that.$t('register.changed')
        } else {
          that.time = 300
          that.loadText = that.$t('register.getCode')
          clearInterval(that.setTime)
          that.isSendCode = false
        }
      }, 1000)
    },
    goRefundPwd () {
      this.$router.push('/retrievePwd')
      // window.location.href = '/retrievePwd'
    },
    goRegister () {
      this.$router.push('/register')
      // window.location.href = '/register'
    },
    goEmileLogin () {
      const that = this
      that.isEmailLogin = !that.isEmailLogin
      that.username = ''
      that.password = ''
      that.phoneVal = ''
      that.activeTab = 0
    },
    toggleIcon () {
      // 密码是否显示
      this.onOff = !this.onOff
      if (!this.onOff) {
        this.tog = 'closed-eye'
        this.isPwd = 'password'
      } else {
        this.tog = 'eye'
        this.isPwd = 'text'
      }
    },
    goLineLogin () {
      this.$router.push('/lineLogin')
    },
    goGoogleLogin () {
      const _url = location.origin + '/login/thirdparty'
      location.href = 'https://accounts.google.com/o/oauth2/v2/auth?&response_type=code&client_id=137570187799-516jsj1d29gmcch00ekrkq7mm0i2qcmj.apps.googleusercontent.com&redirect_uri=' + _url + '&state=state&access_type=offline&scope=openid+email+profile&prompt=select_account'
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  /deep/.van-field__error-message {
    font-size: 18px;
  }
  .headers {
    width: 100%;
    height: 88px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    .language {
      font-size: 28px;
      font-weight: 400;
      text-decoration: underline;
      text-align: left;
      color: #666666;
      line-height: 40px;
    }
  }
  .content {
    width: 100%;
    flex: 1;
    position: relative;
  }
}
.login_main {
  background-image: url('../../assets/images/login/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: absolute;
  top: 60px;
  bottom: 100px;
  left: 26px;
  right: 26px;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: center;
  padding: 30px 32px 0px 32px;
  /deep/.van-tabs__wrap {
    height: 80px!important;
    width: 520px;
  }
  /deep/.van-tab__text {
    font-size: 32px;
    line-height: 40px;
  }
  /deep/.van-loading__text {
    color: #969799;
    font-size: 24px!important;
    line-height: 80px!important;
    text-align: center;
  }
  /deep/.van-list__finished-text {
    color: #969799;
    font-size: 24px!important;
    line-height: 80px!important;
    text-align: center;
  }
  /deep/.van-tabs__line {
    bottom: 0px;
    width: 46px;
    height: 20px;
    background-color: #ff5d19;
  }
  /deep/.van-tab--active {
    color: #ff5d19;
  }
  .main-icon{
    margin-left: 5px;
  }
  .login_desc {
    font-size: 32px;
    font-weight: 500;
    text-align: left;
    color: #ff5d19;
    line-height: 45px;
  }
  .login_form {
    width: 100%;
    flex: 1;
    padding: 0 40px;
    .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
      border-width: 0 0;
    }
    .van-cell{
      padding:10px 20px;
    }
    .van-cell-group {
      margin-top: 10px;
      .form-item {
        width: 100%;
        height: 112px;
        display: flex;
        align-items: center;
        .codebox{
          display: flex;
          justify-content: flex-start;
          align-items: center;
          width:100%;
          height:68px;
          padding:10px 20px;
          border-radius:40px;
          border:1px solid #F8F8F8;
          box-shadow: 0px 0px 8px #eee;
          .selectbox{
            position:relative;
            margin-left:20px;
            span{
              font-size: 26px;
              color: #333333;
            }
            img{
              width:20px;
              height:20px;
              vertical-align: middle;
            }
            .downbox{
              position:absolute;
              left:-56px;
              top:56px;
              width:174px;
              // height:240px;
              background-color:#fff;
              z-index:999;
              box-shadow: 0px 2px 4px 3px rgba(0,0,0,0.07);
              .itembox{
                width:100%;
                height:98px;
                font-size: 30px;
                color: #333333;
                text-align:center;
                line-height:98px;
                border-bottom:1px solid #e0e0e0;
              }
              .itembox:last-of-type{
                border:none;
              }
            }
            .downbox::after{
                content:'';
                position:absolute;
                left:50%;
                top:-20px;
                width:0;
                height:0;
                transform: translateX(-50%);
                border-right:20px solid transparent;
                border-left:20px solid transparent;
                border-bottom:20px solid #fff;
              }
          }
          img{
            width:48px;
            height:48px;
            vertical-align: middle;
          }
          input {
            width:200px;
            height:60px;
            margin:0 20px;
            border:none;
            outline:none;
            font-size: 28px;
          }
          input::-webkit-input-placeholder{
            color:#ccc;
          }
          input::-moz-placeholder{   /* Mozilla Firefox 19+ */
            color:#ccc;
          }
          input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
            color:#ccc;
          }
          input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
            color:#ccc;
          }
        }
        .username {
          align-items: flex-start !important;
        }
        .username,
        .password,
        .code {
          width: 100%;
          line-height: 48px;
          box-shadow: 0px 0px 8px #eee;
          border-radius: 150px;
          display: flex;
          align-items: center;
          .van-button--primary {
            border: none;
            font-size: 18px;
            color: #ff5d19;
            background-color: transparent;
          }
          /deep/.van-field__left-icon {
            .van-icon {
              display: flex;
              align-items: center;
              .van-icon__image {
                width: 48px;
                height: 48px;
              }
            }
          }
          /deep/.van-field__right-icon {
            .van-icon {
              font-size: 32px;
            }
          }
          /deep/.van-cell__value {
            padding-left: 10px;
            font-size: 28px;
          }
        }
      }
    }
    .tip {
      font-size: 24px;
      font-weight: 400;
      text-align: left;
      color: #333333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 60px;
    }
    .tip2 {
      width: 100%;
      height: 80px;
      font-size: 28px;
      line-height: 80px;
      color: #333333;
      text-align: center;
    }
    .lineLog {
      fieldset {
        color: #6c7c92;
        border-left: none;
        border-bottom: none;
        border-right: none;
        border-top: 1px solid #efefef;
        border-top-color: #efefef;
        height: 40px;
      }
      legend {
        text-align: center;
        padding: 0 10px;
        font-size: 30px;
        font-weight: 400;
        line-height: 42px;
      }
      fieldset {
        margin-bottom: 60px;
      }
      .thirdlogin {
        width: 300px;
        margin: 0 auto;
        /*margin-top: 60px;*/
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
    }
  }
}
/deep/.van-dialog {
  width: 560px;
  .van-dialog__header {
    font-size: 32px;
    padding: 30px 0;
  }
  .van-dialog__content {
    .van-cell--large {
      padding-top: 20px;
      padding-bottom: 20px;
      .van-cell__title {
        font-size: 28px;
      }
      .van-radio {
        width: 32px;
        height: 32px;
        .van-radio__icon {
          width: 100%;
          height: 100%;
          font-size: 32px;
        }
      }
    }
  }
  .van-dialog__footer {
    height: 80px;
    .van-dialog__confirm {
      height: 100%;
      font-size: 28px;
    }
  }
}
</style>
