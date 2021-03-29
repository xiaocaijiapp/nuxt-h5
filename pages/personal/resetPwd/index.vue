<!---->
<template>
  <div>
    <van-nav-bar
      :title="$t('newUserInfo.safe')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>
    <div class="reset_main">
      <van-cell class="cell" value is-link url="/personal/changepassword">
        <template #title>
          <span class="reset-title">{{$t('user_info.resetPaw')}}</span>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'content',
  components: {},
  data () {
    return {
      active: 0,
      radio: 1
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/setup')
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
  .cell {
    height: 104px;
    display: flex;
    align-items: center;
  }
  .van-cell__right-icon {
    font-size: 30px;
  }
  .van-cell {
    padding: 16px 30px;
  }
  .van-cell__title, .van-cell__value {
    line-height: 40px;
    font-size: 28px;
  }
.reset_main {
  margin-top: 15px;
}
</style>
