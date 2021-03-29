<!---->
<template>
  <div class="no-box">
    <van-image
      width="30.57142857142857vw"
      height="30.57142857142857vw"
      src="~/assets/images/empty/wushuju.png"
    />
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
.no-box {
  width: 268px;
  margin: 0 auto;
  text-align: center;
}
.tip {
  text-align: center;
  font-size: 28px;

  font-weight: 400;

  color: #333333;
  line-height: 80px;
}
</style>
