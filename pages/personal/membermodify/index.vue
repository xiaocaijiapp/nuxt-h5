<!---->
<template>
  <div>
    <van-nav-bar
      :title="$t('user_info.userinfo')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>
    <van-cell-group class="cellgroup">
      <van-cell class="cell" :title="$t('user_info.head_img')" is-link @click="Name = true">
        <template #default>
          <img v-lazy="userInfo.headImage? baseImageUrl + userInfo.headImage:require('assets/images/loading/load.png')" alt="" class="headimg">
        </template>
      </van-cell>
      <van-cell
        class="cell"
        :title="$t('register.mininame')"
        :value="userInfo.username"
        is-link
        @click="Name = true"
      />
      <van-cell
        class="cell"
        :title="$t('register.name')"
        :value="userInfo.trueSur+userInfo.trueName"
        is-link
        @click="Name = true"
      />

      <van-cell
        class="cell"
        :title="$t('register.six')"
        :value="userInfo.sex == 1?$t('register.man'):$t('register.men')"
        is-link
        @click="Name = true"
      />
      <van-cell
        class="cell"
        :title="$t('register.birthday')"
        :value="userInfo.birthday"
        is-link
        @click="Name = true"
      />
      <van-cell
        class="cell"
        :title="$t('register.emile')"
        :value="userInfo.email"
        @click="Name = true"
      />
    </van-cell-group>
    <van-popup
      v-model="Name"
      closeable
      lazy-render
      safe-area-inset-bottom
      position="bottom"
      :style="{ height: '100%' }"
    >
      <div class="popup_title">{{$t('user_info.changeinfo')}}</div>
      <div>
        <div class="head_img">
          <div class="img">
            <van-uploader :after-read="afterRead" :max-count="1">
              <img v-lazy="userInfo.headImage ? baseImageUrl + userInfo.headImage:require('assets/images/loading/load.png')" alt="" class="uploadimg">
            </van-uploader>
          </div>
        </div>
        <div class="namefield">
          <div class="xingming">{{$t('register.mininame')}}</div>
          <div class="filedgroup">
            <van-field
              v-model="userInfo.username"
              class="popup_filed"
              maxlength="12"
            />
          </div>
          <div class="xingming">{{$t('register.name')}}</div>
          <div class="filedgroup">
            <van-field
              v-model="userInfo.trueSur"
              class="popup_filed"
              maxlength="12"
              :placeholder="$t('supply.xing')"
            />
            <van-field
              v-model="userInfo.trueName"
              class="popup_filed"
              maxlength="12"
              :placeholder="$t('supply.ming')"
            />
          </div>
          <div class="xingming">{{$t('register.name2')}}</div>
          <div class="filedgroup">
            <van-field
              v-model="userInfo.falSur"
              class="popup_filed"
              maxlength="12"
              :placeholder="$t('supply.xing')"
            />
            <van-field
              v-model="userInfo.falName"
              class="popup_filed"
              maxlength="12"
              :placeholder="$t('supply.ming')"
            />
          </div>
          <div class="xingming">{{$t('user_info.six')}}</div>
          <div class="userSex">
            <van-radio-group v-model="userInfo.sex">
              <van-radio
                checked-color="#FF5D19"
                :name="1"
              >{{$t('register.man')}}</van-radio>
              <van-radio
                checked-color="#FF5D19"
                :name="2"
              >{{$t('register.men')}}</van-radio>
            </van-radio-group>
          </div>

          <div class="xingming">{{$t('register.birthday')}}</div>
          <div class="filedgroup">
            <van-field
              v-model="userInfo.birthday"
              class="popup_filed"
              :placeholder="$t('register.birthday')"
              readonly
              @click="showDatePicker = true"
            />
          </div>
        </div>
      </div>
      <div class="button_box">
        <van-button
          round
          type="primary"
          color="linear-gradient(to right, #FFA14B, #FF5D19)"
          block
          :disabled="disabled"
          @click="submit"
        >{{$t('supply.save')}}</van-button>
      </div>
    </van-popup>

    <van-popup v-model="showDatePicker" :style="{ height: '32%',width:'70%' }">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :title="$t('newUserInfo.Selectdate')"
        :min-date="minDate"
        :max-date="maxDate"
        :confirm-button-text="$t('supply.save')"
        :cancel-button-text="$t('returnGoods.cancel')"
        @confirm="pickerDate"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script>
import api from 'static/api'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  layout: 'content',
  components: {},
  data () {
    return {
      Name: false,
      showSex: false,
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      disabled: false,
      showDatePicker: false,
      headImg: '',
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      currentDate: '',
      userInfo: ''
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    })
  },
  watch: {
    userInfo: {
      handler (val) {
        for (const key in val) {
          if (val[key]) {
            this.disabled = false
          } else {
            this.disabled = true
          }
        }
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal')
    },
    init () {
      const _this = this
      _this.$axios.get(api.user.userInfo).then((res) => {
        if (res.code === 200) {
          _this.userInfo = res.data
          _this.currentDate = new Date(_this.userInfo.birthday.split('-')[0], _this.userInfo.birthday.split('-')[1], _this.userInfo.birthday.split('-')[2])
          for (const key in _this.userInfo) {
            if (_this.userInfo[key] == null) {
              _this.userInfo[key] = ''
            }
          }
        } else {
          _this.$toast('获取信息失败，请刷新当前页面')
        }
      })
    },
    pickerDate (value) {
      const birthday = moment(value).format('YYYY-MM-DD')
      this.userInfo.birthday = birthday
      this.showDatePicker = false
      // this.submit()
    },
    afterRead (imgfile) {
      const formData = new FormData()
      const _this = this
      formData.append('file', imgfile.file)
      this.$axios.post(api.upload.img, formData, { isFromData: true }).then((res) => {
        console.log(res)
        if (res.code === 200) {
          _this.$toast.success(_this.$t('newUserInfo.headImgSuccess'))
          _this.userInfo.headImage = res.data
          _this.submit()
        }
      })
    },
    submit () {
      const _this = this
      _this.$axios.put(api.user.changeUserInfo, _this.userInfo).then((res) => {
        if (res.code === 200) {
          _this.$toast.success(_this.$t('user_info.success'))
        } else {
          _this.$toast('修改失败，请刷新当前页面')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
  .van-cell__right-icon {
    font-size: 30px;
  }
  .van-cell {
    padding: 10px 30px;
  }
  .van-cell__title, .van-cell__value {
    line-height: 40px;
    font-size: 28px;
  }
  /deep/.van-popup__close-icon {
    line-height: 44px;
    font-size: 40px;
  }
  /deep/.van-field__value {
    line-height: 56px;
    font-size: 28px;
  }
  .van-button--round {
    height: 82px;
    font-size: 28px;
  }
  .cellgroup {
    margin-top: 10px;
    .headimg {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }
  .cell {
    height: 104px;
    display: flex;
    align-items: center;
  }
  .van-cell__value {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .popup_title {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
    text-align: center;
    font-size: 32px;
    border-bottom: 1px solid #e5e5e5;
    font-weight: 400;
    color: #333333;
    line-height: 44px;
  }
  .namefield {
    width: 100%;
    box-sizing: border-box;
    padding: 30px;
    .xingming {
      font-size: 28px;
      padding-top: 15px;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
    }
  }
  .filedgroup {
    padding-top: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .popup_filed {
    width: 314px;
    height: 80px;
    background: #f2f2f2;
    border: 1px solid #e2e2e2;
    border-radius: 10px;
  }
  .button_box {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
  }
  .userSex {
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
    font-size: 32px;
    .van-radio {
      height: 100px;
    }
  }
  .changgeInfo {
    width: 100%;
    box-sizing: border-box;
    padding: 15px;
  }
  .head_img {
    margin-top: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
    .img {
      border: 1px solid #e5e5e5;
      .uploadimg {
        width: 200px;
        height: 200px;
        border-radius: 50%;
      }
    }
  }
</style>
