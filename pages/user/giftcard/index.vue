<template>
  <div class="giftcard">
    <div class="nav">
      <van-nav-bar :title="$t('supply.p11')" @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" color="#666666" />
        </template>
      </van-nav-bar>
    </div>
    <div class="gift_box">
      <van-cell-group>
        <van-field v-model="giftNo" :label="$t('supply.p15')" :placeholder="$t('supply.p18')" />
        <van-field v-model="giftPwd" :label="$t('supply.p16')" :placeholder="$t('supply.p19')" />
      </van-cell-group>
    </div>
    <div class="tips">{{$t('newUserInfo.complete')}}</div>

    <div class="button_box">
      <van-button round type="primary" color="linear-gradient(to right, #FFA14B, #FF5D19)" :disabled="disabled" block @click="submit">{{$t('supply.p17')}}</van-button>
    </div>
  </div>
</template>

<script>
import api from '~/static/api'

export default {
  name: 'Giftcard',
  layout: 'content',
  data () {
    return {
      giftNo: '',
      giftPwd: '',
      disabled: true
    }
  },
  computed: {
    gift () {
      const { giftNo, giftPwd } = this
      return { giftNo, giftPwd }
    }
  },
  watch: {
    gift: {
      handler (val) {
        if (val.giftNo.length > 8 && val.giftPwd.length > 3) {
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
      this.$router.push('/')
      // window.location.href = '/'
    },
    Share () {
      this.$router.push('/')
      // window.location.href = '/'
    },
    submit () {
      // this.$toast('成功')
      const that = this
      const data = {
        cardNo: that.giftNo,
        cardPass: that.giftPwd
      }
      that.$axios.post(api.user.giftCard, data).then((res) => {
        console.log(res)
        // if (res.code === 200) {
        //   that.$toast.success(that.$t('like.add'))
        //   window.location.href = '/'
        // } else {
        //   that.$toast('失败')
        // }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  width: 100%;
  height: 88px;
  line-height: 88px;
  background: #ffffff;
  box-shadow: 0 1px 5px #cccccc;
  .van-nav-bar {
    height: 100%;
    line-height: 88px;
    /deep/ .van-nav-bar__content {
      height: 100%;
      /deep/ .van-nav-bar__title {
        text-align: center;
        color: #323233;
        font-weight: 500;
        font-size: 26px;
      }
    }
  }
  /deep/ .van-nav-bar__left {
    font-size: 22px;
    .van-icon-arrow-left {
      color: #999;
    }
  }
}
.gift_box {
  margin-top: 16px;
  /deep/ .van-cell {
    padding: 26px;
    /deep/ .van-field__label {
      width: 144px;
      span {
        font-size: 22px;
      }
    }
  }
}
.tips {
  font-size: 20px;
  font-weight: 400;
  color: #999;
  line-height: 64px;
  padding-left: 24px;
}
.button_box {
  position: fixed;
  width: 100%;
  bottom: 24px;
  padding: 0 24px;
  /deep/ .van-button--round {
    border-radius: 100px;
  }
  /deep/ .van-button {
    height: 70px;
  }
  /deep/ .van-button--normal {
    padding: 0 24px;
    font-size: 22px;
  }
}
</style>
