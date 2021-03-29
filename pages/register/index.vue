<template>
  <div class="register-container" @click="hideSelect">
    <div class="close" @click="goBack">
      <van-icon size="22px" :name="require(`assets/images/login/close.png`)" />
    </div>
    <div class="content">
      <div class="login_main">
        <van-icon size="93px" class="main-icon" :name="require(`assets/images/login/starday_logo.png`)" />
        <!-- <div v-if="isSetPassword" class="login_desc">{{$t('newRegister.emile')}}</div> -->
        <van-tabs v-model="activeTab">
          <van-tab :title="$t('newRegister.emile')"></van-tab>
          <van-tab :title="$t('register.phoneRes')"></van-tab>
        </van-tabs>
        <div v-if="activeTab === 0" class="login_form">
          <van-cell-group>
            <div class="form-item">
              <van-field v-model="username" class="username" clearable :left-icon="require(`assets/images/login/emile.png`)" :placeholder="$t('login.plaintEmail')" :error-message="errorMsg" />
            </div>
            <div class="form-item">
              <van-field v-model="newLoginPassword" class="password" clearable :left-icon="require(`assets/images/login/password.png`)" :right-icon="tog" :type="isPwd" :placeholder="$t('newUserInfo.setLogin')" @click-right-icon="toggleIcon" />
            </div>
            <!--          验证码区域-->
            <div class="form-item verification-code">
              <van-field v-model="verificationCode" clearable :placeholder="$t('resetpwd.code')" />
              <img v-lazy="codeImage" @click="getVerCode" />
            </div>
          </van-cell-group>
        </div>
        <div v-else class="login_form">
          <van-cell-group>
            <div class="form-item">
              <!-- <van-field v-if="activeTab === 0" v-model="mobile" class="username" clearable :left-icon="require(`assets/images/login/emile.png`)" :placeholder="$t('login.emile')" :error-message="errorMsg" /> -->
              <div class="phonebox">
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
                <input v-model="phoneVal" maxlength="11" :placeholder="$t('register.plaIntPhone')"/>
              </div>
            </div>
            <div class="codebox">
              <img src="@/assets/images/login/password.png" />
              <input v-model="mobileCode" :placeholder="$t('resetpwd.code')"/>
              <span v-if="sendFlag" @click="getCode">{{ $t('register.sendCode') }}</span>
              <span v-if="!sendFlag">{{ $t('register.argenSend').replace('M', countdown) }}</span>
            </div>
            <div class="form-item">
              <van-field v-model="mobilePWD" class="password" clearable :left-icon="require(`assets/images/login/password.png`)" :right-icon="tog" :type="isPwd" :placeholder="$t('newUserInfo.setLogin')" @click-right-icon="toggleIcon" />
            </div>
          </van-cell-group>
        </div>
        <div class="login_button" style="width:100%;padding:0 20px;">
          <van-button v-if="activeTab === 0" color="linear-gradient(to right, #FFA24C, #FF5E1A)" block round :disabled="isCanSetPassword" @click="onSubmit">{{$t('resetpwd.save')}}</van-button>
          <van-button v-else color="linear-gradient(to right, #FFA24C, #FF5E1A)" block round :disabled="!checked || !phoneVal || !mobilePWD || !mobileCode" @click="onSubmit">{{$t('resetpwd.save')}}</van-button>
        </div>
        <div class="agreement">
          <van-checkbox v-model="checked" icon-size="16px" checked-color="#FF5D19" @change="changeChecked">{{$t('register.agree')}}</van-checkbox>
        </div>
        <div class="hasAccount">
          <span  @click="goLogin">
            {{$t('newRegister.haveAccount')}}
          </span>
        </div>
      </div>
    </div>
    <van-popup v-model="showAgreement" :style="{ height: '80%' ,width:'80%',padding:'15px'}" closeable>
      <Agreement />
    </van-popup>
  </div>
</template>

<script>
import Reg from 'static/reg'
import api from 'static/api'
import { mapGetters, mapActions } from 'vuex'
import Agreement from '~/components/agreement/index'
export default {
  name: 'Register',
  layout: 'content',
  components: {
    Agreement
  },
  data () {
    return {
      isSendCode: true, // 发送验证码是否禁用
      loadText: '送信',
      username: '', // 账号
      password1: '',
      password2: '', // 密码
      newLoginPassword: '', // 新版登陆密码
      language: false, //
      onOff: true, // 密码显示
      isPwd: 'password', // 密码输入框类型
      tog: 'closed-eye',
      errorMsg: '',
      isUsername: false, // 账号是否符合格式
      isCanSetPassword: true, // 信息校验能否登陆
      isEmailLogin: false,
      code: '',
      checked: false,
      isSetPassword: true, // 是否显示设置密码的页面
      isComplete: true, // 是否完成设置
      time: 300,
      showAgreement: false,
      setTime: null,
      codeImage: '',
      verificationCode: '',
      cartList: [],
      activeTab: 0,
      // mobile: '',
      mobileCode: '',
      mobilePWD: '',
      sendFlag: true,
      countdown: 60,
      timerId: null,
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
      showDown: false
    }
  },
  computed: {
    ...mapGetters(['locale']),
    user () {
      const { username, newLoginPassword, code, verificationCode, checked } = this
      return { username, newLoginPassword, code, verificationCode, checked }
    },
    password () {
      const { password1, password2 } = this
      return { password1, password2 }
    }
  },
  watch: {
    username: {
      handler (username) {
        const that = this
        const RegMail = new RegExp(Reg.mailBox)
        if (username) {
          if (!RegMail.test(username)) {
            that.errorMsg = that.$t('register.err')
            that.isSendCode = true
          } else {
            that.errorMsg = ''
            that.isUsername = true
            that.isSendCode = false
          }
        } else {
          that.errorMsg = ''
          that.isSendCode = true
        }
      },
      deep: true
    },
    user: {
      handler (val) {
        const that = this
        if (val.username && val.newLoginPassword && val.checked && val.verificationCode) {
          that.isCanSetPassword = false
        } else {
          that.isCanSetPassword = true
        }
        // if (val.username && val.code && val.checked) {
        //   that.isCanSetPassword = false
        // } else {
        //   that.isCanSetPassword = true
        // }
      },
      deep: true
    },
    password: {
      handler (val) {
        const that = this

        if (val.password2 && val.password1) {
          if (
            val.password2.includes(' ') ||
            val.password1.includes(' ')
          ) {
            that.$toast(that.$t('newRegister.pwdHaveSpace'))
            that.isComplete = true
          } else {
            that.isComplete = false
          }
        } else {
          that.isComplete = true
        }
      },
      deep: true
    }
  },
  created () {
    this.locale === 'zh-CN' ? this.loadText = '发送验证码' : this.loadText = '認証コードを送信する'
  },
  mounted () {
    this.cartList = JSON.parse(window.sessionStorage.getItem('touristCartData')) || []
    this.getVerCode()
  },
  methods: {
    ...mapActions(['newUserRegister']),
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
    getCode () {
      const vm = this
      const reg = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/
      if (!vm.phoneVal) {
        return vm.$toast(vm.$t('register.plaIntPhone'))
      }
      if (vm.areacode.value === '+86') {
        if (!reg.test(vm.phoneVal)) {
          return vm.$toast(vm.$t('register.phoneTypeNo'))
        }
      } else if (vm.phoneVal.length !== 11) {
        return vm.$toast(vm.$t('register.phoneTypeNo'))
      }
      vm.$axios({
        url: 'starday-auth/register/user/mobile/send/' + vm.phoneVal + '/' + vm.areacode.value,
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          vm.timerId = setInterval(function () {
            if (vm.countdown <= 0) {
              clearInterval(vm.timerId)
              vm.countdown = 60
              vm.sendFlag = true
              return
            }
            vm.sendFlag = false
            vm.countdown--
          }, 1000)
        }
      }).catch((err) => {
        vm.$toast(err.message)
      })
    },
    getVerCode () {
      this.$axios.get(api.register.captcha + 2, {
        responseType: 'blob'
      }).then((res) => {
        this.codeImage = window.URL.createObjectURL(res)
      })
    },
    goBack () {
      this.$router.push('/login')
    },
    changeChecked (checked) {
      console.log(checked)
      this.showAgreement = checked
    },
    sendCode () {
      const that = this
      if (that.username) {
        that.$axios.post(api.register.sendCode + that.username).then((res) => {
          if (res.code === 200) {
            that.$toast.success(that.$t('register.sendSuccess'))
            that.timer()
          } else {
            that.$toast(that.$t('mail.sendFailed'))
          }
        }).catch((err) => {
          that.$toast(err.message)
        })
      } else {
        that.$toast(that.$t('login.emile'))
      }
    },
    timer () {
      const that = this
      that.setTime = setInterval(() => {
        if (that.time > 0) {
          that.time -= 1
          that.loadText = that.time.toString() + that.$t('register.changed')
        } else {
          that.time = 300
          clearInterval(that.setTime)
          that.loadText = that.$t('register.getCode')
          that.isSendCode = false
        }
      }, 1000)
    },
    // 设置密码
    setPassword () {
      const that = this
      that.$axios.post(`${api.register.codeCheck}${that.username}/${that.code}`)
        .then((res) => {
          if (res.code === 200) {
            that.isSetPassword = false
          } else {
            that.$toast(that.$t('newRegister.errCode'))
          }
        }).catch((err) => {
          that.$toast(err.message)
        })
    },
    // 登陆
    onSubmit () {
      const that = this
      let userInfo = {}
      if (that.activeTab === 0) {
        userInfo = {
          confirmPassword: that.newLoginPassword,
          email: that.username,
          emailCode: that.verificationCode,
          password: that.newLoginPassword,
          source: 2
        }
      } else {
        userInfo = {
          confirmPassword: that.mobilePWD,
          password: that.mobilePWD,
          emailCode: that.mobileCode,
          mobile: that.phoneVal,
          mobileAreaCode: that.areacode.value,
          source: 2
        }
      }
      that.newUserRegister(userInfo).then((res) => {
        that.$toast(that.$t('register.success'))
        const fullPath = window.sessionStorage.getItem('page') ? window.sessionStorage.getItem('page') === '/setup' ? '/personal' : window.sessionStorage.getItem('page') : ''
        that.$router.push(fullPath)
        if (that.cartList && that.cartList.length) {
          that.queryAddVisitorCart()
        }
      }).catch((err) => {
        that.$toast(err.message)
        this.getVerCode()
      })
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
    // 去登陆
    goLogin () {
      this.$router.push('/login')
    },
    // 邮箱登陆
    goEmileLogin () {
      const that = this
      that.isEmailLogin = !that.isEmailLogin
      that.username = ''
      that.password = ''
    },
    emileLogin () { },
    toggleIcon () {
      this.onoff = !this.onoff
      if (!this.onoff) {
        this.tog = 'closed-eye'
        this.isPwd = 'password'
      } else {
        this.tog = 'eye'
        this.isPwd = 'text'
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-cell {
    padding: 10px 20px;
  }
  /deep/.van-cell__value {
    line-height: 60px;
  }
  // /deep/.van-icon__image {
  //   width: 40px;
  //   height: 40px;
  //   vertical-align: middle;
  // }
  /deep/.van-field__error-message {
    font-size: 24px;
  }
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
.register-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  .close {
    width: 100%;
    height: 88px;
    display: flex;
    align-items: center;
    padding-left: 24px;
  }
  .content {
    width: 100%;
    flex: 1;
    position: relative;
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
      .agreement {
        width: 100%;
        height: 88px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        /deep/.van-checkbox {
          font-size: 26px;
          .van-checkbox__label {
            display: inline-block;
            height: 32px;
            line-height: 32px;
          }
        }
      }
      .hasAccount {
        margin-top: 60px;
        width: 100%;
        height: 88px;
        text-align: center;
        font-size: 24px;
        text-decoration: underline;
        color: #333333;
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
        // flex: 1;
        padding: 0 40px;
        .van-hairline--top-bottom::after,
        .van-hairline-unset--top-bottom::after {
          border-width: 0 0;
        }
        .van-cell-group {
          margin-top: 10px;
          .form-item {
            width: 100%;
            height: 112px;
            display: flex;
            align-items: center;
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
          .phonebox{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width:100%;
            height:80px;
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
          .codebox{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width:100%;
            height:80px;
            padding:10px 20px;
            border-radius:40px;
            border:1px solid #F8F8F8;
            box-shadow: 0px 0px 8px #eee;
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
              font-size:26px;
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
            span{
              flex:1;
              font-size:26px;
              color:#FF5D19;
              text-align:right;
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
        .verification-code{
          width: 100%;
          height: 88px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .van-cell::after{
            display: none;
          }
          /deep/.van-field{
            height: 80px;
            .van-field__value{
              display: flex;
              align-items: center;
              .van-field__body{
                height: 80px;
              }
            }
          }
        }
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
