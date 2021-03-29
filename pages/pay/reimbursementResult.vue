<template>
  <div class="result">
    <van-nav-bar :title="$t('nextPay.result')" left-arrow @click-left="$router.push('/personal')" />
    <div class="result-content">
      <img v-if="state == 'true'" class="stateImg" :src="require('~/assets/images/pay/success.png')" />
      <img v-else class="stateImg" :src="require('~/assets/images/pay/failed.png')" />
      <p v-if="state == 'true'" class="text">{{$t('nextPay.successResult')}}</p>
      <p v-else class="text">{{$t('nextPay.failedResult')}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReimbursementResult',
  layout: 'content',
  asyncData ({ query }) {
    const state = query.state
    return {
      state
    }
  },
  created () {
    console.log(this.state)
  }
}
</script>

<style lang="less" scoped>
.result {
  .result-content {
    width: 100%;
    height: calc(100vh - 88px);
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
    padding-top: 60px;
    .stateImg {
      width: 124px;
      height: 124px;
    }
    .text {
      font-size: 32px;
      font-weight: 500;
      text-align: left;
      color: #333333;
      line-height: 45px;
      margin-top: 28px;
    }
  }
}
</style>
