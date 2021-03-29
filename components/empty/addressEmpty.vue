<template>
  <div class="emptybox">
    <img src="~/assets/images/empty/dizhi.png" />
    <div class="tip">{{$t('newUserInfo.error_msg1')}}</div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>

<style lang="less" scoped>
  .emptybox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: flex-start;
    img{
      width: 214px;
      height: 214px;
    }
    .tip {
      text-align: center;
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 80px;
    }
  }
</style>
