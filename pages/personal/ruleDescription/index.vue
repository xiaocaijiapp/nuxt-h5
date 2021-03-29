<template>
    <div>
      <van-sticky>
        <van-nav-bar
          :title="$t('newThreeClass.ruleDescription')"
          placeholder
          @click-left="onClickLeft"
        >
          <template #left>
            <van-icon name="arrow-left" color="#666666" />
          </template>
        </van-nav-bar>
      </van-sticky>
      <div class="imgbox">
        <img src="https://image.stardaymart.com/h5/lALPDgfLPwT8C8LNEd_NAu4_750_4575.png" />
      </div>
    </div>
</template>

<script>
export default {
  name: 'Index',
  layout: 'content',
  methods: {
    onClickLeft () {
      this.$router.back()
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
  .imgbox {
    width: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
