<template>
<div class="Empty">
  <img src="~/assets/images/cart/nodata.png" />
  <div class="tips">{{$t('newCart.tips')}}</div>
  <div class="button" @click="goHome">
    {{$t('newCart.goShopping')}}
  </div>
</div>
</template>

<script>
export default {
  name: 'Empty',
  methods: {
    goHome () {
      this.$router.push('/')
      // window.location.href = '/'
    }
  }
}
</script>

<style lang="less" scoped>
.Empty {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 60px 0px 60px;
  img{
    width: 192px;
    height: 192px;
  }
  .tips {
    font-size: 26px;
    font-weight: 400;
    text-align: center;
    color: #333333;
    line-height: 20px;
    margin-top: 30px;
  }
  .button{
    margin-top: 30px;
    border: 1px solid #ff5d19;
    border-radius: 20px;
    color: #ff5d19;
    font-size: 28px;
    line-height: 28px;
    text-align: center;
    padding: 10px 20px;
  }
}
</style>
