<!---->
<template>
  <div class="emptybox">
    <van-image
      width="30.5714285vw"
      height="30.5714285vw"
      src="~/assets/images/empty/wushoucang.png"
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
.emptybox {
  width: 268px;
  margin: 0 auto;
  margin-top: 40px;
}
.tip {
  text-align: center;
  font-size: 28px;

  font-weight: 400;

  color: #333333;
  line-height: 80px;
}
</style>
