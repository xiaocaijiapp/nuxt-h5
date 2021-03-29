<template>
  <div class="next-pay-val">
    <van-nav-bar :title="$t('nextPay.title')" fixed left-arrow @click-left="$router.go(-1)"/>
    <div class="form-container">
      <van-form @submit="formSubmit">
        <van-field
          v-model="payInfo.userPhone"
          :label="`${$t('nextPay.phone')}+81`"
          name="mobile"
          :placeholder="$t('nextPay.plePhone')"
          :show-error="false"
          :clearable="true"
          :error-message="phoneErrorMessage"
          :rules="[{ validator: valPhone, required: true }]"
        />
        <van-field
          v-if="checkCodeBool"
          v-model="payInfo.valCode"
          :label="$t('nextPay.phoneCode')"
          name="mobileCode"
          :placeholder="$t('nextPay.intoCode')"
          :clearable="true"
          :error-message="codeErrorMessage"
          :rules="[{ validator: checkCode }]"
        >
          <template #button>
            <span v-if="phoneCodeShow" class="getCode" @click="getPhoneCode">{{$t('nextPay.getCode')}}</span>
            <span v-else class="getCode">{{ dateDown }}</span>
          </template>
        </van-field>
        <van-field
          v-model="payInfo.userName"
          :label="$t('nextPay.Username')"
          name="name"
          :placeholder="$t('nextPay.pintoUsername')"
          :rules="[{ required: true }]"
        />
        <van-field
          v-model="payInfo.userEmail"
          :label="$t('nextPay.userEmail')"
          name="email"
          :placeholder="$t('nextPay.pUsernameEmail')"
          :show-error="false"
          :clearable="true"
          :error-message="emailErrorMessage"
          :rules="[{ validator: emailVal, required: true }]"
        />
        <van-field
          v-model="payInfo.zipCode"
          :label="$t('nextPay.postcode')"
          name="postcode"
          :placeholder="$t('nextPay.plCode')"
          :error-message="zipErrorMessage"
          :rules="[{ validator: valZipCode, required: true}]"
          @input="getBillAddress"
        />
        <van-field
          v-model="payInfo.address"
          class="emile"
          :label="$t('nextPay.billAddress')"
          name="address"
          :placeholder="$t('nextPay.plAddress')"
          right-icon="arrow"
          readonly
          validate-trigger="onSubmit"
          :rules="[{ required: true }]"
          @click="areaShow = true"
        />
        <van-field
          v-model="payInfo.addressDetail"
          :label="$t('nextPay.detailAddress')"
          name="deliveryAddress"
          :placeholder="$t('nextPay.plaDetailAddress')"
          :rules="[{ required: true }]"
        />
        <van-field
          v-model="informWay"
          :label="$t('nextPay.callMethods')"
          name="notifyType"
          :placeholder="$t('nextPay.plaCallMethods')"
          readonly
          right-icon="arrow"
          validate-trigger="onSubmit"
          :rules="[{ required: true }]"
          @click="inWayFun = true"
        />
        <div class="formBtn">
          <van-button round block color="linear-gradient(90deg,#ffa14b, #ff5d19)" native-type="submit">{{ btnText }}</van-button>
        </div>
      </van-form>
    </div>
    <van-action-sheet v-model="areaShow" :title="$t('address.change')">
      <van-area
        :area-list="areaAllList"
        :confirm-button-text="$t('returnGoods.submit')"
        :cancel-button-text="$t('returnGoods.cancel')"
        @confirm="checkAreaObj"
        @cancel="areaShow = false"
      />
    </van-action-sheet>
    <van-action-sheet v-model="inWayFun" :actions="actions" @select="informChange" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Reg from '~/static/reg'
import api from '~/static/api'
const _debounce = require('lodash/debounce')
export default {
  layout: 'content',
  name: 'Index',
  async asyncData ({ $axios, params }) {
    const type = params.type
    let userPhone = ''
    const valCode = ''
    let userName = ''
    let userEmail = ''
    let zipCode = ''
    let address = ''
    let addressDetail = ''
    let informWay = ''
    // 修改信息
    if (type === 'update') {
      await $axios.get(api.user.nextMonthPay).then((res) => {
        if (res.code === 200 && res.data) {
          userPhone = res.data.mobile
          userName = res.data.name
          userEmail = res.data.email
          zipCode = res.data.postcode
          address = res.data.address
          addressDetail = res.data.deliveryAddress
          informWay = res.data.notifyType * 1
        }
      })
    } else {
      informWay = 2
    }
    return {
      payInfo: {
        userPhone,
        valCode,
        userName,
        userEmail,
        zipCode,
        address,
        addressDetail,
        informWay
      },
      userPhone,
      type
    }
  },
  data () {
    return {
      provinceId: '',
      cityId: '',
      areaId: '',
      billAddress: '',
      phoneErrorMessage: '',
      codeErrorMessage: '',
      emailErrorMessage: '',
      zipErrorMessage: '',
      areaShow: false,
      inWayFun: false,
      phoneCodeShow: true,
      timer: null,
      down: 60,
      dateDown: '60S',
      comparePhone: false, // 更新信息时  手机号未变化
      areaAllList: {
        province_list: {},
        city_list: {},
        county_list: {}
      }
    }
  },
  watch: {
    'payInfo.userPhone' (val) {
      if (this.userPhone === val) {
        this.comparePhone = false
      } else {
        this.comparePhone = true
      }
    }
  },
  computed: {
    ...mapGetters(['locale']),
    btnText () {
      if (this.type === 'check') {
        return this.$t('nextPay.btnText')
      } else {
        return this.$t('nextPay.btnUpdate')
      }
    },
    actions () {
      return [{ name: this.$t('nextPay.message'), code: 1 }, { name: this.$t('nextPay.checkEmail'), code: 2 }]
    },
    informWay: {
      get () {
        return this.actions[this.payInfo.informWay - 1] ? this.actions[this.payInfo.informWay - 1].name : this.$t('nextPay.checkEmail')
      },
      set () {}
    },
    checkCodeBool () {
      if (this.type === 'check') {
        return true
      } else if (this.type === 'update' && !this.comparePhone) {
        return false
      } else {
        return true
      }
    }
  },
  created () {
    console.log(this.payInfo)
  },
  mounted () {
    this.$axios.get(api.adress.areaData).then((res) => {
      res.data.forEach((item) => {
        if (item.level === 0) {
          this.areaAllList.province_list[item.code] = item.name
        } else if (item.level === 1) {
          this.areaAllList.city_list[item.code] = item.name
        } else {
          this.areaAllList.county_list[item.code] = item.name
        }
      })
    })
  },
  methods: {
    valPhone (val) {
      const phoneReg = new RegExp(Reg.phoneOut)
      if (!val) {
        this.phoneErrorMessage = this.$t('nextPay.errPhone')
        return false
      } else if (!phoneReg.test(val)) {
        this.phoneErrorMessage = this.$t('nextPay.valPhone')
        return phoneReg.test(val)
      } else {
        this.phoneErrorMessage = ''
        return true
      }
    },
    valZipCode (val) {
      const zipReg = new RegExp(Reg.postalCode)
      if (!val) {
        this.zipErrorMessage = this.$t('nextPay.plCode')
        return false
      } else if (!zipReg.test(val)) {
        this.zipErrorMessage = this.$t('nextPay.errPostCode')
        return zipReg.test(val)
      } else {
        this.zipErrorMessage = ''
        return true
      }
    },
    checkCode (val) {
      if (val.length === 0) {
        this.codeErrorMessage = ''
        return false
      } else if (val.length < 6) {
        this.codeErrorMessage = this.$t('nextPay.errCode')
        return false
      } else {
        this.codeErrorMessage = ''
        return true
      }
    },
    emailVal (val) {
      const emailReg = new RegExp(Reg.mailBox)
      if (!emailReg.test(val)) {
        this.emailErrorMessage = this.$t('nextPay.errEmail')
        return emailReg.test(val)
      } else {
        this.emailErrorMessage = ''
        return emailReg.test(val)
      }
    },
    checkAreaObj (e) {
      let addressInfoStr = ''
      e.forEach((item) => {
        addressInfoStr += item.name
      })
      this.provinceId = e[0].code
      this.cityId = e[1].code
      this.areaId = e[2].code
      this.payInfo.address = addressInfoStr
      this.areaShow = false
    },
    informChange (e) {
      this.informWay = e.name
      this.payInfo.informWay = e.code
      this.inWayFun = false
    },
    getPhoneCode () {
      if (!this.valPhone(this.payInfo.userPhone)) {
        this.$toast(this.phoneErrorMessage)
      } else {
        // 获取验证码
        this.$axios.post(api.user.phoneCode + this.payInfo.userPhone + '/+81').then((res) => {
          if (res.code === 200) {
            this.$toast.success(res.message)
            this.phoneCodeShow = false
            this.timer = setInterval(() => {
              if (this.down <= 1) {
                clearInterval(this.timer)
                this.phoneCodeShow = true
                this.down = 60
                this.dateDown = '60S'
              } else {
                this.dateDown = --this.down + 'S'
              }
            }, 1000)
          } else {
            this.$toast.fail(res.message)
          }
        }).catch((err) => {
          this.$toast.fail(err.message)
        })
      }
    },
    getBillAddress: _debounce(function (val) {
      const zipReg = new RegExp(Reg.postalCode)
      if (zipReg.test(val)) {
        // 获取地址
        this.$axios.get(api.user.billAddress + val).then((res) => {
          console.log(res)
          if (res.code === 200 && res.data) {
            this.payInfo.address = res.data.province + res.data.district
            this.payInfo.addressDetail = res.data.detail
          }
        })
      }
    }, 500),
    formSubmit (values) {
      values.notifyType = this.payInfo.informWay
      const payInfo = Object.assign(values, { provinceId: this.provinceId, cityId: this.cityId, areaId: this.areaId, mobileAreaCode: '+81' })
      this.$axios.post(api.user.payInfoUpdate, payInfo).then((res) => {
        if (res.code === 200) {
          this.$toast.success('验证成功')
          this.$router.go(-1)
        } else {
          this.$toast.fail(res.message)
        }
      }).catch((err) => {
        this.$toast.fail(err.message)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.next-pay-val{
  width: 100%;
  height: calc(100vh - 118px);
  .form-container{
    margin: 118px auto 0px;
    height: 100%;
    .getCode{
      font-size: 26px;
      font-weight: 400;
      text-align: left;
      color: #ff5d19;
      line-height: 37px;
    }
    .van-form{
      height: 100%;
      position: relative;
      .formBtn{
        position: absolute;
        left: 30px;
        right: 30px;
        bottom: 30px;
      }
    }
  }
  /deep/.van-cell::after{
    right: 0;
    left: 0;
  }
}
</style>
