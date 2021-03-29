<template>
  <div class="resetPwd-container" @click="hideSelect">
    <div class="close" @click="onClickLeft">
      <van-icon size="22px" color="#999999" name="arrow-left" />
    </div>
    <div class="content">
      <div class="login_main">
        <div class="login_logo">
          <van-icon size="93px" :name="require(`assets/images/login/starday_logo.png`)" />
        </div>
        <!-- <div class="login_desc">{{$t('user_info.resetPaw')}}</div> -->
        <van-tabs v-model="activeTab" @change="changeTab">
          <van-tab :title="$t('register.resetemail')"></van-tab>
          <van-tab :title="$t('register.resetPhone')"></van-tab>
        </van-tabs>
        <div class="login_form">
          <van-cell-group v-if="showConfirmPas">
            <div class="form-item">
              <van-field v-if="activeTab === 0" v-model="username" class="username" clearable :left-icon="require(`assets/images/login/emile.png`)" :placeholder="$t('login.plaintEmail')" :error-message="errormsg" />
              <div v-else class="codebox">
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
            <div class="form-item" v-if="activeTab === 0">
              <van-field v-model="Code" class="code" clearable :left-icon="require(`assets/images/login/password.png`)" :placeholder="$t('resetpwd.code')">
                <template #extra>
                  <van-button v-if="showConfirmPas && activeTab === 0" class="sendCode" :disabled="isSendCode" type="primary" size="small" @click="sendCode">{{loadtext}}</van-button>
                </template>
              </van-field>
            </div>
            <div class="form-item" v-if="activeTab !== 0">
              <van-field v-model="phoneCode" class="code" clearable :left-icon="require(`assets/images/login/password.png`)" :placeholder="$t('resetpwd.code')">
                <template #extra>
                  <van-button v-if="showConfirmPas && activeTab !== 0" class="sendCode" :disabled="isSendCodeCopy" type="primary" size="small" @click="sendPhoneCode">{{loadtextCopy}}</van-button>
                </template>
              </van-field>
            </div>
          </van-cell-group>

          <van-cell-group v-else>
            <div class="form-item">
              <van-field v-model="password1" class="password password1" clearable :left-icon="require(`assets/images/login/password.png`)" :right-icon="tog" :type="ispwd" :placeholder="$t('newUserInfo.setLogin')" @click-right-icon="toggleIcon" />
            </div>
            <div class="form-item">
              <van-field v-model="password2" class="password" clearable :left-icon="require(`assets/images/login/password.png`)" :right-icon="tog" :type="ispwd" :placeholder="$t('newUserInfo.setLogin')" @click-right-icon="toggleIcon" />
            </div>
          </van-cell-group>
          <div v-if="showtips" class="tip">{{$t('newUserInfo.codeSend')}}</div>
          <div v-if="showPasTip" class="tip">{{$t('newUserInfo.pwdReg')}}</div>

          <div class="login_button">
            <van-button v-if="showConfirmPas" color="linear-gradient(to right, #FFA24C, #FF5E1A)" block round :disabled="isCanLogin" @click="verification">{{$t('newUserInfo.nextTip')}}</van-button>
            <van-button v-else color="linear-gradient(to right, #FFA24C, #FF5E1A)" block round :disabled="isCanConfirm" @click="onSubmit">{{$t('user_info.resetPaw')}}</van-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '~/static/api'
import Reg from '~/static/reg'
export default {
  name: 'RetrievePwd',
  layout: 'content',
  data () {
    return {
      username: '', // 账号
      password: '', // 密码
      language: false, //
      loadtext: '送信',
      loadtextCopy: '送信',
      time: 300,
      timeCopy: 300,
      setTimeCopy: null,
      onoff: true, // 密码显示
      ispwd: 'password', // 密码输入框类型
      tog: 'closed-eye',
      errormsg: '',
      isUsername: false, // 账号是否符合格式
      isCanLogin: true, // 信息校验能否登陆
      isEmailLogin: false,
      Code: '',
      showtips: false,
      showPasTip: false,
      showConfirmPas: true,
      password1: '',
      password2: '',
      isSendCode: false,
      submitText: '次へ',
      isCanConfirm: true,
      setTime: null,
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
      phoneCode: '',
      isSendCodeCopy: true
    }
  },
  computed: {
    ...mapGetters(['locale']),
    user () {
      const { username, Code, phoneVal, phoneCode } = this
      return { username, Code, phoneVal, phoneCode }
    },
    doubilPassword () {
      const { password1, password2 } = this
      return { password1, password2 }
    }
  },
  watch: {
    username (username) {
      const regMail = new RegExp(Reg.mailBox)
      if (!regMail.test(username) && username) {
        this.errormsg = this.$t('login.err')
        this.isSendCode = true
      } else {
        this.errormsg = ''
        this.isUsername = true
        this.isSendCode = false
      }
    },
    phoneVal (val) {
      const vm = this
      const reg = /^134[0-8]\d{7}$|^13[^4]\d{8}$|^14[5-9]\d{8}$|^15[^4]\d{8}$|^16[6]\d{8}$|^17[0-8]\d{8}$|^18[\d]{9}$|^19[8,9]\d{8}$/
      if (vm.areacode.value === '+86') {
        if (vm.phoneVal) {
          if (reg.test(vm.phoneVal)) {
            vm.isSendCodeCopy = false
          }
        } else {
          vm.isSendCodeCopy = true
        }
      } else if (vm.phoneVal.length !== 11) {
        vm.isSendCodeCopy = true
      } else {
        vm.isSendCodeCopy = false
      }
    },
    user: {
      handler (val) {
        // console.log(val)
        if ((this.isUsername && val.Code.length === 6) || (val.phoneCode && val.phoneVal)) {
          this.isCanLogin = false
        } else {
          this.isCanLogin = true
        }
      },
      deep: true
    },
    doubilPassword: {
      handler (val) {
        if (val.password1.length >= 6 && val.password2.length >= 6) {
          this.isCanConfirm = false
        } else {
          this.isCanConfirm = true
        }
      },
      deep: true
    }
  },
  mounted () {
    const _this = this
    _this.loadtext = _this.locale === 'ja-JP' ? '認証コードを送信する' : '发送验证码'
    _this.loadtextCopy = _this.locale === 'ja-JP' ? '認証コードを送信する' : '发送验证码'
    _this.submitText = _this.locale === 'ja-JP' ? '次へ' : '下一步'
  },
  methods: {
    changeTab () {
      this.username = ''
      this.Code = ''
      this.phoneVal = ''
      this.phoneCode = ''
      this.showtips = false
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
    verification () {
      const that = this
      if (that.activeTab === 0) {
        that.$axios.post(`${api.retrieve.verification}${that.username}/${that.Code}`)
          .then((res) => {
            if (res.code === 200) {
              that.showConfirmPas = false
              that.showtips = false
              that.showPasTip = true
            } else {
              that.$toast(this.$t('newUserInfo.errCode'))
            }
          })
      } else {
        that.$axios({
          url: 'starday-user/forget/password/verify/' + that.phoneVal + '/' + that.areacode.value + '/' + that.phoneCode,
          method: 'post'
        }).then((res) => {
          if (res.code === 200) {
            that.showConfirmPas = false
          } else {
            that.$toast(this.$t('newUserInfo.errCode'))
          }
        }).catch((err) => {
          that.$toast(err.message)
        })
      }
    },
    // 登陆
    onSubmit () {
      const that = this
      if (that.password2 === that.password1) {
        if (that.activeTab === 0) {
          const data = {
            confirmPassword: that.password2,
            email: that.username,
            emailCode: that.Code,
            password: that.password1
          }
          that.$axios.post(api.retrieve.changePas, data).then((res) => {
            if (res.code === 200) {
              that.$toast.success(that.$t('user_info.success'))
              // window.location.href = '/login'
              that.$router.push('/login')
            } else {
              that.$toast('修改失败，请稍后再试')
            }
          })
        } else {
          const _data = {
            confirmPassword: that.password2,
            country: that.areacode.value,
            mobile: that.phoneVal,
            mobileCode: that.phoneCode,
            password: that.password1
          }
          that.$axios({
            url: 'starday-user/forget/password/mobile/reset/password',
            method: 'POST',
            data: _data
          }).then((res) => {
            if (res.code === 200) {
              that.$toast.success(that.$t('user_info.success'))
              that.$router.push('/login')
            }
          }).catch((err) => {
            that.$toast(err.message)
          })
        }
      } else {
        that.$toast(that.$t('newUserInfo.checkPwd'))
      }
    },
    timerCopy () {
      const that = this
      that.setTimeCopy = setInterval(() => {
        if (that.timeCopy > 0) {
          that.timeCopy -= 1
          that.loadtextCopy = that.timeCopy.toString() + that.$t('register.changed')
        } else {
          that.timeCopy = 300
          clearInterval(that.setTimeCopy)
          that.loadtextCopy = that.$t('register.getCode')
          that.isSendCodeCopy = false
        }
      }, 1000)
    },
    timer () {
      const that = this
      that.setTime = setInterval(() => {
        if (that.time > 0) {
          that.time -= 1
          that.loadtext = that.time.toString() + that.$t('register.changed')
        } else {
          that.time = 300
          clearInterval(that.setTime)
          that.loadtext = that.$t('register.getCode')
          that.isSendCode = false
        }
      }, 1000)
    },
    sendPhoneCode () {
      const vm = this
      vm.$axios({
        url: 'starday-user/forget/password/mobile/send/' + vm.phoneVal + '/' + vm.areacode.value,
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
    sendCode () {
      const that = this
      if (!that.username) {
        that.$toast('请输入邮箱')
        return
      }
      that.$axios.post(api.retrieve.Code + that.username).then((res) => {
        if (res.code === 200) {
          that.$toast.success(that.$t('register.sendSuccess'))
          that.showtips = true
          that.timer()
        }
      }).catch((err) => {
        that.$toast(err.message)
      })
    },
    // 邮箱登陆
    onClickLeft () {
      window.history.go(-1)
    },
    toggleIcon () {
      this.onoff = !this.onoff
      if (!this.onoff) {
        this.tog = 'closed-eye'
        this.ispwd = 'password'
      } else {
        this.tog = 'eye'
        this.ispwd = 'text'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.resetPwd-container {
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
      }
    }
  }
}
</style>
