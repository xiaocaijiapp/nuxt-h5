<template>
  <div class="box">
    <div class="header">
      <div>{{$t('newCart.invalidGoods')+$t('returnList.all')+list.length+$t('seckill.p6')}}</div>
      <div @click="clearInvalid">{{$t('newCart.clearInvalid')}}</div>
    </div>
    <div class="prolist">
      <div v-for="item in list" :key="item.skuId" :class=" !item.invalid ? 'invalid_item' : 'stock_item invalid_item'">
      <div class="img">
        <img v-lazy="baseImageUrl+ item.skuImage" />
        <div v-if="!item.invalid" class="tip">{{$t('coupon.losed')}}</div>
      </div>
      <div class="right">
        <div class="title">{{item.goodsTitle}}</div>
        <div v-if="!item.skuInventoryState" class="desc">{{$t('newCart.Insufficientstock')}}</div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '~/static/api'
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
    return {}
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  methods: {
    clearInvalid () {
      const that = this
      that.$dialog
        .confirm({
          message: that.$t('newCart.confirm'),
          className: 'dialog',
          confirmButtonColor: '#333333'
        })
        .then(() => {
          that.$axios.delete(api.cart.clearInvalid).then((res) => {
            if (res.code === 200) {
              that.$toast.success(that.$t('newCart.success'))
              // window.location.reload()
              that.$router.go(0)
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 100%;
  background: #fff;
  padding: 0 30px;
  margin-top: 20px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100px;
    div:first-child {
      font-size: 30px;
      font-weight: 400;
      color: #333333;
    }
    div:last-child {
      font-size: 28px;
      font-weight: 400;
      color: #ff5d19;
    }
  }
  .prolist{
    .invalid_item{
      width: 100%;
      height: 206px;
      padding: 15px 0px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      .img{
        width: 176px;
        height: 176px;
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        img{
          width: 176px;
          height: 176px;
          border-radius: 10px;
        }
        .tip{
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 40px;
          font-size: 22px;
          font-weight: 400;
          color: #ffffff;
          line-height: 40px;
          background: rgba(0, 0, 0, 0.5);
          text-align: center;
        }
      }
      .right{
        flex: 1;
        height: 100%;
        margin-left: 20px;
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: space-around;
        .title{
          font-size: 26px;
          font-weight: 400;
          color: #999999;
          line-height: 37px;
        }
        .desc{
          font-size: 26px;
          font-weight: 400;
          color: #333333;
          line-height: 37px;
        }
      }
    }
  }
}
/*.invalid_item {*/
/*  width: 100%;*/
/*  margin-top: 15px;*/
/*  display: flex;*/
/*  justify-content: space-around;*/
/*  align-items: flex-start;*/
/*  .right {*/
/*    font-size: 14px;*/
/*    width: 70%;*/
/*    font-weight: 400;*/

/*    color: #999999;*/
/*    padding-left: 15px;*/
/*  }*/
/*  .img {*/
/*    opacity: 0.65;*/
/*    position: relative;*/
/*    .tip {*/
/*      width: 88px;*/
/*      height: 20px;*/
/*      background: rgba(0, 0, 0, 0.8);*/
/*      border-radius: 0px 0px 5px 5px;*/
/*      font-size: 10px;*/
/*      line-height: 20px;*/
/*      font-weight: 400;*/
/*      text-align: center;*/
/*      color: #ffffff;*/
/*      position: absolute;*/
/*      bottom: 5px;*/
/*    }*/
/*  }*/
/*}*/
/*.stock_item {*/
/*  .img {*/
/*    opacity: 1;*/
/*  }*/
/*  .right {*/
/*    display: flex;*/
/*    flex-direction: column;*/
/*    justify-content: space-between;*/
/*    height: 88px;*/
/*    div:last-child {*/
/*      font-size: 13px;*/

/*      font-weight: 400;*/
/*      text-align: left;*/
/*      color: #333333;*/
/*    }*/
/*  }*/
/*}*/
</style>
