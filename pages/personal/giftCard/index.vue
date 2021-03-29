<template>
  <div class="giftCard">
    <van-nav-bar :title="$t('supply.p11')" left-arrow @click-left="onClickLeft" />
    <div class="bodybox">
      <div class="firstbox">
        <span>{{$t('supply.p15')}}</span>
        <input v-model="cardNo" :placeholder="$t('supply.p18')" />
      </div>
      <div class="firstbox">
        <span>{{$t('supply.p16')}}</span>
        <input v-model="cardPass" :placeholder="$t('supply.p19')" />
      </div>
    </div>

    <div class="title">
      {{$t('newUserInfo.complete')}}
    </div>

    <div class="btnbox" @click="submit">
      {{$t('supply.p17')}}
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'GiftCard',
  layout: 'content',
  data () {
    return {
      cardNo: '',
      cardPass: ''
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  mounted () {
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    submit () {
      const vm = this
      if (!vm.cardNo) {
        this.$toast.fail(vm.$t('supply.p18'))
        return
      }
      if (!vm.cardPass) {
        this.$toast.fail(vm.$t('supply.p19'))
        return
      }
      const _data = {
        cardNo: vm.cardNo,
        cardPass: vm.cardPass
      }
      vm.$axios({
        url: 'starday-system/user/giftCard/bandCard',
        method: 'post',
        data: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.cardNo = ''
          vm.cardPass = ''
          vm.$router.push('/personal')
        }
      }).catch((err) => {
        vm.$toast(err.message)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.giftCard {
  position: relative;
  height: 100vh;
  .van-nav-bar {
    height: 88px;
  }
  /deep/.van-nav-bar__content {
    height: 100%;
  }
  /deep/.van-nav-bar__title {
    height: 100%;
    line-height: 88px;
    font-size: 36px;
    color: #323233;
    font-weight: 500;
  }
  .bodybox {
    margin-top: 20px;
    background-color: #fff;
    .firstbox {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      // height:104px;
      border-bottom: 1px solid #e5e5e5;
      line-height: 5.428571428571429vw;
      span {
        width: 200px;
        padding-left: 30px;
        font-size: 28px;
        color: #333333;
      }
      input {
        flex: 1;
        height: 80px;
        border: none;
        outline: none;
        font-size: 28px;
        color: #333333;
        padding-left: 2.285714285714286vw;
      }
    }
  }
  .title {
    margin: 20px 0 0 30px;
    font-size: 24px;
    color: #999999;
  }
  .btnbox {
    position: absolute;
    bottom: 20px;
    left: 50%;
    width: 700px;
    height: 78px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #ffa14b, #ff5d19);
    border-radius: 40px;
    color: #fff;
    font-size: 30px;
    font-weight: 500;
    text-align: center;
    line-height: 78px;
  }
}
</style>
