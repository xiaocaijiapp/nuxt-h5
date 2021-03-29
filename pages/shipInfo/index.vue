<template>
  <div class="add-container">
    <van-sticky>
      <van-nav-bar :title="$t('newOrder.Shippingaddress')" placeholder @click-left="onClickLeft">
        <template #left>
          <van-icon size="22px" name="arrow-left" color="#999999" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="user-form">
      <van-field
        v-model="name"
        maxlength="20"
        class="reg_emile L0"
        :placeholder="$t('address.name')"
        :error-message="errorName"
        :label="$t('address.name2')"
      />
      <van-field
        v-model="number"
        class="reg_emile L0"
        type="number"
        maxlength="7"
        readonly
        :placeholder="$t('address.postalCode')"
        :error-message="postalCode"
        :label="$t('address.postalCode2')"
        @click="numberkey_postcode = true"
      />
      <van-field
        v-model="str"
        class="emile"
        :placeholder="str"
        right-icon="arrow-down"
        readonly
        :error-message="erroradress"
        @click="toggle"
      >
        <template #label>
          <span class="label">{{$t('address.local')}}</span>
        </template>
      </van-field>
      <van-field
        v-model="detailadress"
        maxlength="50"
        class="reg_emile L0"
        :placeholder="$t('address.detail')"
        :error-message="errorDetailadress"
        :label="$t('address.detail2')"
      />
      <van-field
        v-model="phone"
        class="reg_emile L0"
        :placeholder="$t('address.phonenum')"
        type="number"
        :maxlength="11"
        :label="$t('address.phone')"
        readonly
        clickable
        :error-message="errorPhone"
        @touchstart.native.stop="numberkey_phone = true"
      />
      <van-field
        v-model="email"
        class="reg_emile L0"
        :placeholder="$t('login.plaintEmail')"
        :error-message="errorEmail"
        :label="$t('user_info.emile')"
      />
      <van-field
        v-model="emailCode"
        class="reg_emile L0"
        :placeholder="$t('resetpwd.code')"
        :label="$t('register.lintcode')"
      >
        <template #button>
          <van-button size="small" type="primary" :disabled="isSendCode" @click="sendCode">{{loadtext}}</van-button>
        </template>
      </van-field>
      <van-number-keyboard
        v-model="phone"
        transition
        close-button-text="完成"
        delete-button-text="削除"
        safe-area-inset-bottom
        :show="numberkey_phone"
        :maxlength="11"
        :title="$t('user_info.phone')"
        :z-index="999"
        hide-on-click-outside
        @blur="numberkey_phone = false"
      />
      <van-number-keyboard
        v-model="number"
        transition
        delete-button-text="削除"
        safe-area-inset-bottom
        :show="numberkey_postcode"
        :title="$t('address.postalCode2')"
        :z-index="1000"
        hide-on-click-outside
        @blur="numberkey_postcode = false"
      />
    </div>
    <van-action-sheet v-model="show" :title="$t('address.change')">
      <van-area
        :area-list="areaAllList"
        :confirm-button-text="$t('returnGoods.submit')"
        :cancel-button-text="$t('returnGoods.cancel')"
        @confirm="tap"
        @cancel="show = false"
      />
    </van-action-sheet>
    <div class="button_box">
      <van-button
        round
        type="primary"
        color="linear-gradient(to right, #FFA14B, #FF5D19)"
        block
        :disabled="disabled"
        @click="submit"
      >{{$t('newThreeClass.submit')}}</van-button>
    </div>
  </div>
</template>

<script>
import { setTimeout } from 'timers'
import { mapGetters, mapMutations } from 'vuex'
import api from '~/static/api'
import { setCookie } from '~/assets/js/cookie'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      name: '',
      number: '',
      adress: '',
      detailadress: '',
      phone: '',
      showModel: '',
      errorName: '',
      postalCode: '',
      str: this.$t('address.change'),
      email: '',
      emailCode: '',
      erroradress: '',
      errorDetailadress: '',
      errorPhone: '',
      errorEmail: '',
      numberkey_phone: false,
      numberkey_postcode: false,
      show: false,
      disabled: true,
      areaId: '',
      cityId: '',
      provinceId: '',
      areaAllList: {
        province_list: {},
        city_list: {},
        county_list: {}
      },
      isSendCode: true,
      loadtext: '',
      // 是否发送验证码
      sendStatus: false,
      time: 300,
      isAddBuyFlag: '',
      shareIntegralId: '',
      fromFlag: '',
      activityInfo: '',
      details: '',
      checkTouristCartData: []
    }
  },
  computed: {
    ...mapGetters({
      touristBuyInfo: 'touristBuyInfo',
      userInfo: 'userInfo'
    }),
    inputInfo () {
      const { name, number, str, detailadress, phone, email } = this
      return { name, number, str, detailadress, phone, email }
    }
  },
  watch: {
    email (val) {
      const regmail = /^[A-Za-z0-9.-u4e00-\u9FA5-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (val && !regmail.test(val)) {
        this.errorEmail = this.$i18n.locale === 'zh-CN' ? '邮箱格式不正确' : 'ご利用いただけないメールアドレス'
        this.isSendCode = true
      } else {
        this.errorEmail = ''
        this.isSendCode = false
      }
    },
    inputInfo: {
      handler (val) {
        const _this = this
        if (val.name.length <= 1 && val.name.length > 0) {
          this.errorName = _this.$t('newArea.name')
        } else {
          this.errorName = ''
        }
        if (val.number.length < 7 && val.number.length >= 1) {
          this.postalCode = '请输入7位邮政编码'
          this.disabled = true
        } else {
          this.postalCode = ''
        }
        if (val.str.length < 1 && val.detailadress.length > 0) {
          this.erroradress = _this.$t('address.change')
        } else {
          this.erroradress = ''
        }
        if (val.detailadress.length <= 1 && val.detailadress.length > 0) {
          this.errorDetailadress = _this.$t('address.detail')
        } else {
          this.errorDetailadress = ''
        }
        if (val.phone.length >= 1 && val.phone.length < 5) {
          this.errorPhone = _this.$t('address.phonenum')
        } else {
          this.errorPhone = ''
        }
        if (!Object.values(val).some(v => v === '')) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      }
    }
  },
  mounted () {
    this.checkTouristCartData = JSON.parse(window.sessionStorage.getItem('checkTouristCartData')) || []
    this.loadtext = this.$i18n.locale === 'zh-CN' ? '获取验证码' : '確認コードを取得する'
    this.isAddBuyFlag = this.$route.query.isAdd_isBuy || ''
    this.shareIntegralId = this.$route.query.shareIntegralId || ''
    this.fromFlag = this.$route.query.fromFlag || ''
    this.activityInfo = JSON.parse(window.sessionStorage.getItem('activityInfo'))
    this.details = JSON.parse(window.sessionStorage.getItem('details'))
    this.getAreaAllJson()
  },
  methods: {
    ...mapMutations(['SET_ORDERINFO', 'setAccessToken', 'setLoginState', 'setUserInfo']),
    onClickLeft () {
      window.history.go(-1)
    },
    toggle () {
      this.show = true
    },
    tap (info) {
      console.log(info)
      const _this = this
      _this.str = ''
      info.map((item) => {
        _this.str += item.name + ' '
      })
      _this.show = false
      _this.provinceId = info[0].code
      _this.cityId = info[1].code
      _this.areaId = info[2].code
    },
    getAreaAllJson () {
      const _this = this
      _this.$axios.get(api.adress.areaData).then((res) => {
        console.log(res)
        res.data.forEach((item) => {
          if (item.level === 0) {
            _this.areaAllList.province_list[item.code] = item.name
          } else if (item.level === 1) {
            _this.areaAllList.city_list[item.code] = item.name
          } else {
            _this.areaAllList.county_list[item.code] = item.name
          }
        })
      })
    },
    // 获取验证码
    sendCode () {
      const _this = this
      _this.$axios.post(`${api.login.guestSendCode}${_this.email}`).then((res) => {
        if (res.code === 200) {
          _this.$toast.success(this.$t('mail.sendSuc'))
          _this.timer()
        }
      }).catch((err) => {
        _this.$toast(err.message)
      })
    },
    timer () {
      const _this = this
      if (_this.time > 0) {
        _this.time--
        _this.loadtext = this.$i18n.locale === 'zh-CN' ? (_this.time.toString() + 's后重新获取') : (_this.time.toString() + 's秒後に再取得します')
        setTimeout(_this.timer, 1000)
      } else {
        _this.time = 300
        _this.loadtext = this.$i18n.locale === 'zh-CN' ? '获取验证码' : '確認コードを取得する'
        _this.isSendCode = false
      }
    },
    submit () {
      const _this = this
      const userAddressDto = {
        address: _this.str,
        alias: null,
        areaId: _this.areaId,
        cityId: _this.cityId,
        country: 'jp',
        def: 1,
        deliveryAddress: _this.detailadress,
        mobile: _this.phone,
        postcode: _this.number,
        provinceId: _this.provinceId,
        realName: _this.name
      }
      _this.$axios.post(api.login.guestLogin, { email: _this.email, emailCode: _this.emailCode, userAddressDto }).then((res) => {
        if (res.code === 200) {
          _this.setAccessToken(res.data.token)
          _this.setLoginState(true)
          _this.setUserInfo(res.data)
          setCookie('token', res.data.token)
          if (_this.isAddBuyFlag === '1') {
            if (_this.checkTouristCartData && _this.checkTouristCartData.length) {
              _this.queryAddVisitorCart()
            }
          }
          if (_this.isAddBuyFlag === '2') {
            _this.onBuyClicked(this.touristBuyInfo)
          }
        }
      }).catch((err) => {
        this.$toast(err.message)
      })
    },
    // 游客登录加入购物车
    queryAddVisitorCart () {
      const _this = this
      _this.$axios.post(api.cart.addVisitorCart, _this.checkTouristCartData).then((res) => {
        if (res.code === 200) {
          _this.$router.push('/shoppingcart')
          window.sessionStorage.removeItem('touristCartData')
          window.sessionStorage.removeItem('checkTouristCartData')
        }
      })
    },
    // 立即购买
    async onBuyClicked (info) {
      const _this = this
      const storeUserId = _this.$route.query.fromPage === '1' ? _this.userInfo.id : (_this.$route.query.storeUserId || '')
      await _this.joinSeckill(info.selectedNum, info.selectedSkuComb.id)
      const data = {
        buyCount: info.selectedNum,
        skuId: info.selectedSkuComb.id,
        shareId: this.shareIntegralId ? ((this.shareIntegralId !== 'null' && this.shareIntegralId !== 'undefined') ? this.shareIntegralId : '') : ''
      }
      await _this.$axios.post(api.goods.buyNow, data).then((res) => {
        if (res.code === 200) {
          const orderInfo = {
            shopType: 2,
            data: res.data
          }
          _this.SET_ORDERINFO(
            Object.assign(orderInfo, { goodsId: info.goodsId })
          )
          this.$router.push('/placeorder?fromFlag=' + this.fromFlag + '&storeUserId=' + storeUserId)
        }
      }).catch((err) => {
        _this.$toast(err.message)
      })
    },
    async joinSeckill (num, id) {
      const _this = this
      if (_this.activityInfo.starting && _this.activityInfo.active) {
        const data = {
          activityId: _this.details.activityInfo.activityId,
          buyNum: num,
          spuId: _this.touristBuyInfo.goodsid,
          skuId: id
        }
        console.log(data)
        await _this.$axios.get(api.goods.joinSeckill, { params: data })
        window.sessionStorage.removeItem('activityInfo')
        window.sessionStorage.removeItem('details')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .add-container{
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
    .user-form{
      flex: 1;
      /deep/.van-field{
        height: 104px;
        padding: 10px 30px;
        .van-cell__title{
          width: 150px;
          display: flex;
          align-items: center;
          font-size: 28px;
          font-weight: 400;
          color: #333333;
          line-height: 40px;
        }
        .van-cell__value{
          display: flex;
          flex-flow: column nowrap;
          justify-content: center;
          align-items: flex-start;
          .van-field__body{
            width: 100%;
            .van-field__control{
              height: 60px;
              font-size: 28px;
              color: #999999;
            }
          }
        }
        /deep/.van-button--primary {
          background-color: transparent;
          border: 0;
          color: #FF5D19;
          font-size: 28px;
        }
        /deep/.van-field__error-message {
          font-size: 20px;
        }
      }
      /deep/.van-checkbox{
        width: 100%;
        height: 104px;
        background-color: #ffffff;
        padding: 10px 30px;
        .van-checkbox__label{
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 40px;
          padding-left: 10px;
        }
      }
      /deep/.van-number-keyboard{
        .van-number-keyboard__header{
          h2{
            height: 30px;
            font-size: 32px;
          }
        }
        .van-number-keyboard__body{
          .van-number-keyboard__keys{
            .van-key__wrapper{
              .van-key{
                height: 80px;
              }
            }
          }
        }
      }
    }
    .button_box{
      width: 100%;
      padding: 10px 30px;
      margin-bottom: 50px;
      .van-button{
        width: 100%;
        height: 80px;
      }
    }
    .van-button--round {
      font-size: 28px;
    }
    /deep/.van-popup{
      .van-action-sheet__header{
        height: 60px;
        font-size: 28px;
        line-height: 60px;
        .van-icon{
          font-size: 32px;
        }
      }
      .van-action-sheet__content{
        .van-picker__toolbar{
          button{
            font-size: 28px;
          }
        }
      }
    }
    /deep/.van-icon-arrow-down {
      font-size: 28px;
    }
    /deep/.van-ellipsis {
      font-size: 28px;
    }
  }
</style>
