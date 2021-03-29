<template>
<div class="add-container">
  <van-sticky>
    <van-nav-bar :title="$t('address.add')" placeholder @click-left="onClickLeft">
      <template #left>
        <van-icon size="22px" name="arrow-left" color="#999999" />
      </template>
    </van-nav-bar>
  </van-sticky>
  <div class="user-form">
    <van-field
      v-model="name"
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
    <van-checkbox
      v-model="checked"
      class="check"
      icon-size="5.714285714vw"
      checked-color="#EC5820"
    >{{$t('address.defalut')}}</van-checkbox>
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
    >{{$t('addemile.add')}}</van-button>
  </div>
</div>
</template>

<script>
import api from '~/static/api'
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
      radio: 1,
      errorName: '',
      postalCode: '',
      str: this.$t('address.change'),
      erroradress: '',
      errorDetailadress: '',
      errorPhone: '',
      numberkey_phone: false,
      numberkey_postcode: false,
      show: false,
      checked: false,
      disabled: true,
      areaId: '',
      cityId: '',
      provinceId: '',
      areaAllList: {
        province_list: {},
        city_list: {},
        county_list: {}
      }
    }
  },
  computed: {
    inputInfo () {
      const { name, number, str, detailadress, phone } = this
      return { name, number, str, detailadress, phone }
    }
  },
  watch: {
    inputInfo: {
      handler (val) {
        console.log(val)
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
    this.getAreaAllJson()
  },
  methods: {
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
    submit () {
      const _this = this
      const data = {
        address: _this.str,
        alias: null,
        areaId: _this.areaId,
        cityId: _this.cityId,
        country: 'jp',
        def: _this.checked ? 0 : 1,
        deliveryAddress: _this.detailadress,
        mobile: _this.phone,
        postcode: _this.number,
        provinceId: _this.provinceId,
        realName: _this.name
      }
      _this.$axios.post(api.adress.add, data).then((res) => {
        if (res.code === 200) {
          _this.$toast(_this.$t('like.add'))
          setTimeout(() => {
            const pageName = window.sessionStorage.getItem('page')
            pageName === 'personal' ? _this.$router.push('/personal') : _this.$router.push('/placeorder')
          }, 500)
        }
      }).catch(() => {
        _this.$toast('失败')
      })
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
