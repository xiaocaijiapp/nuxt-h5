<!---->
<template>
  <Layout description="vue server side render" keywords="egg, vue, webpack, server side render">
    <van-nav-bar :title="$t('newUserInfo.changePwd')" placeholder @click-left="onClickLeft">
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>
    <div class="gift_box">
      <van-cell-group>
        <van-field v-model="giftNo" :placeholder="$t('newUserInfo.one')" />
        <van-field v-model="giftPwd" :placeholder="$t('newUserInfo.two')" arrow-direction />
        <van-field v-model="giftPwd2" :placeholder="$t('newUserInfo.three')" />
      </van-cell-group>
    </div>
    <div class="button_box">
      <van-button round type="primary" color="linear-gradient(to right, #FFA14B, #FF5D19)" block :disabled="disabled" @click="submit">{{$t('resetpwd.save')}}</van-button>
    </div>
  </Layout>
</template>

<script>
import api from 'static/api'
import { removeCookie } from '@/assets/js/cookie'
export default {
  layout: 'content',
  components: {},
  data () {
    return {
      giftNo: '',
      giftPwd: '',
      giftPwd2: '',
      disabled: true
    }
  },
  computed: {
    gift () {
      const { giftNo, giftPwd, giftPwd2 } = this
      return { giftNo, giftPwd, giftPwd2 }
    }
  },
  watch: {
    gift: {
      handler (val) {
        if (
          val.giftNo.length > 5 &&
          val.giftPwd.length > 5 &&
          val.giftPwd2.length > 5
        ) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      }
    },
    deep: true
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal/resetPwd')
    },
    submit () {
      const _this = this
      if (_this.giftPwd !== _this.giftPwd2) {
        _this.$toast(_this.$t('newUserInfo.checkPwd'))
        _this.disabled = true
        return
      }
      const data = {
        oldPassword: _this.giftNo,
        newPassword: _this.giftPwd,
        confirmPassword: _this.giftPwd2
      }
      _this.$axios.put(api.user.changePwd, data).then((res) => {
        if (res.code === 200) {
          _this.$toast.success(_this.$t('newUserInfo.checksuccess'))
          removeCookie('token')
          _this.$router.push('/login')
        } else {
          _this.$toast(res.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
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
  height: 80px;
  padding: 16px 30px;
}
/deep/.van-field__body {
  font-size: 28px;
}
/deep/.van-field__value {
  line-height: 48px;
}
.van-button--round {
  height: 82px;
  font-size: 28px;
}
.gift_box {
  margin-top: 10px;
}
.tips {
  font-size: 12px;

  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 40px;
  padding-left: 15px;
}
.button_box {
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;
  margin-top: 40px;
}
</style>
