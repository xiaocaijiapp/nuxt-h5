<template>
  <div class="add-container">
    <van-sticky>
      <van-nav-bar :title="$t('address.adressmanger')" placeholder @click-left="onClickLeft">
        <template #left>
          <van-icon size="22px" name="arrow-left" color="#999999" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="user-form">
      <van-form validate-first>
        <van-field
          v-model="info.realName"
          class="reg_emile L0"
          :placeholder="$t('address.name')"
          :label="$t('address.name2')"
          :rules="[{ validator:(val)=>{
              if (val == '') {
                      return false
                    } else {
                      return true
                    }
            },trigger :'onChange' }]"
        />
        <van-field
          v-model="info.postcode"
          class="reg_emile L0"
          type="number"
          maxlength="7"
          :placeholder="$t('address.postalCode')"
          :label="$t('address.postalCode2')"
          :rules="[{ validator:(val)=>{
          if (val.length < 7) {
                  return false
                } else {
                  return true
                }
          },trigger :'onChange',message:'请输入7位邮政编码' }]"
          @click="numberkey_postcode = true,numberkey_phone = false"
        />
        <van-field
          v-model="info.address"
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
          v-model="info.deliveryAddress"
          class="reg_emile L0"
          :placeholder="$t('address.detail')"
          :error-message="errorDetailadress"
          :label="$t('address.detail2')"
          :rules="[{ validator:(val)=>{
            if (val == '') {
                    return false
                  } else {
                    return true
                  }
          },trigger :'onChange' }]"
        />
        <van-field
        v-model="info.mobile"
        class="reg_emile L0"
        :placeholder="$t('address.phonenum')"
        type="number"
        :maxlength="11"
        :label="$t('address.phone')"
        readonly
        :error-message="errorPhone"
        :rules="[{ validator:(val)=>{
          if(val.length < 6 || val.length >11){
            return false
          }else{
            return true
          }
        },trigger :'onChange',message:'请输入正确的电话号码' }]"
        @touchstart.native.stop="numberkey_phone = true,numberkey_postcode = false"
      />
      </van-form>
      <van-number-keyboard
        v-model="info.mobile"
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
        v-model="info.postcode"
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
        @click="submit"
      >{{$t('user_info.saveChange')}}</van-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
    ...mapGetters(['editAddress']),
    inputInfo () {
      const { name, number, str, detailadress, phone } = this
      return { name, number, str, detailadress, phone }
    },
    info () {
      return this.editAddress
    }
  },
  mounted () {
    this.info.def ? this.checked = false : this.checked = true
    this.getAreaAllJson()
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    toggle () {
      this.show = true
    },
    tap (msc) {
      const that = this
      that.str = ''
      that.info.address = ''
      msc.map((item) => {
        that.info.address += item.name + ' '
      })
      console.log(msc, that.str)
      that.show = false
      that.info.provinceId = msc[0].code
      that.info.cityId = msc[1].code
      that.info.areaId = msc[2].code
    },
    getAreaAllJson () {
      const that = this
      that.$axios.get(api.adress.areaData).then((res) => {
        res.data.forEach((item) => {
          if (item.level === 0) {
            that.areaAllList.province_list[item.code] = item.name
          } else if (item.level === 1) {
            that.areaAllList.city_list[item.code] = item.name
          } else {
            that.areaAllList.county_list[item.code] = item.name
          }
        })
      })
    },
    submit () {
      const that = this
      const id = that.info.id
      const data = {
        address: that.info.address,
        alias: null,
        areaId: that.info.areaId,
        cityId: that.info.cityId,
        country: 'jp',
        def: that.checked ? 0 : 1,
        deliveryAddress: that.info.deliveryAddress,
        mobile: that.info.mobile,
        postcode: that.info.postcode,
        provinceId: that.info.provinceId,
        realName: that.info.realName
      }
      that.$axios.put(api.adress.edit + id, data).then((res) => {
        if (res.code === 200) {
          that.$toast(that.$t('user_info.success'))
          if (window.location.href.includes('?')) {
            that.$router.push('/placeorder')
            // window.location.replace('/order/confirmOrder')
          } else {
            that.$router.push('/address')
            // window.location.href = '/address'
          }
        } else {
          that.$toast('失败')
        }
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
    .van-button--round {
      height: 82px;
      font-size: 28px;
    }
    /deep/.van-icon-arrow-down {
      font-size: 28px;
    }
    /deep/.van-ellipsis {
      font-size: 28px;
    }
  }
</style>
