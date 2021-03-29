<!---->
<template>
  <van-popup v-model="show" :style="{width:'85%'}" closeable>
    <div class="box">
      <div class="header">
        <van-icon :name="require('assets/images/index/coupon3.png')" />
        <span>{{$t('newCoupon.Reductionofsecurities')}}</span>
        <van-icon :name="require('assets/images/index/coupon3.png')" />
      </div>
      <div class="main">
        <div v-for="item in list" :key="item.id" class="item">
          <div class="item_left">
            <div>{{item.denomination}}円</div>
            <div v-if="item.fullbuyType">{{$t('newThreeClass.fullPriceCanUse').replace('N',item.fullbuyPrice||0)}}</div>
            <div v-else>{{$t('newCoupon.fullbuyType')}}</div>
          </div>
          <div class="item_right">
            <div>{{item.couponNameJp}}</div>
            <div>{{$t('newCoupon.termofvalidity')}}{{item.effectiveStartTime.split(' ')[0]}}-{{item.effectiveEndTime.split(' ')[0]}}</div>
          </div>
        </div>
      </div>
      <div class="bottom" @click="closepup">
        <div class="button">{{$t('newCoupon.Useitnow')}}</div>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  components: {},
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    goSearch () {
      this.$router.push('/search')
    },
    changeData () {
      this.$emit('changeShareData', true)
    },
    closepup () {
      this.show = false
    }
  }
}
</script>

<style lang='less'  scoped>
.box {
  width: 100%;
  height: 100%;
  background: url('https://image.stardaymart.com/h5/lALPDiCptabZpKDNBGrNA8k_969_1130.png?x-oss-process=image/resize,w_1000/format,webp') no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  .bottom {
    width: 100%;
    height: 250px;
    background: url('../../assets/images/index/coupon2.png') no-repeat;
    background-size: 100% 100%;
    .button {
      width: 100%;
      height: 80px;
      text-align: center;
      line-height: 80px;
      margin-top: 120px;
      font-size: 32px;
      font-weight: 600;
      color: #c61f0a;
    }
  }
  .header {
    font-size: 32px;
    height: 60px;
    font-weight: 600;
    text-align: center;
    color: #a76e2e;
    line-height: 60px;
  }
  .main {
    min-height: 520px;
    width: 100%;
    box-sizing: border-box;
    padding: 8px 15px;
    overflow-x: auto;
    .item {
      margin-top: 7px;
      width: 100%;
      height: 160px;
      background: url('../../assets/images/index/coupon4.png') no-repeat;
      background-size: 100% 100%;
      display: flex;
      justify-content: space-between;
      .item_left {
        width: 40%;
        height: 100%;
        padding: 0 10px;
        text-align: center;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        div:first-child {
          font-size: 50px;
          text-align: left;
          color: #ffffff;
          line-height: 56px;
        }
        div:last-child {
          font-size: 20px;
          font-weight: 400;
          text-align: center;
          color: #ffffff;
          line-height: 28px;
        }
      }
      .item_right {
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        div:first-child {
          font-size: 28px;
          text-align: center;
          color: #ffffff;
          line-height: 40px;
        }
        div:last-child {
          font-size: 20px;
          margin-top:20px;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          line-height: 28px;
        }
      }
    }
  }
}
.van-popup {
  background-color: rgba(255, 255, 255, 0);
}
/deep/.van-popup__close-icon--top-right{
  top:10px;
  right:30px;
}
/deep/.van-icon__image{
  vertical-align:middle;
}
</style>
