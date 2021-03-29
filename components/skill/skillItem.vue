<template>
  <div class="goods-item" @click="toDetail">
    <div class="images-url">
      <img v-lazy="itemGoods.goodsSelectImg ? baseImageUrl + itemGoods.goodsSelectImg + '?x-oss-process=image/resize,w_1000/format,webp' : baseImageUrl + itemGoods.goodsSearchImage + '?x-oss-process=image/resize,w_120'" class="url" />
      <img v-if="itemGoods.timeState === 1 && percent >= 100" v-lazy="locale === 'zh-CN' ? require('assets/images/seckill/saleoverzh.png') : require('assets/images/seckill/saleoverjp.png')" class="postImg" />
    </div>
    <div class="goods-info">
      <div class="goods-title">{{itemGoods.goodsTitle}}</div>
      <div class="sale-progress">
        <van-progress v-if="itemGoods.timeState === 1" stroke-width="1.066666666666667vw" track-color="#ebedf0" color="#de0f0f" :show-pivot="false" :percentage="percent" class="progress" />
        <span v-if="itemGoods.timeState == 1 && percent < 100" class="sale">{{`${$t('seckill.alreadySale')}${sale}%`}}</span>
        <span v-if="itemGoods.timeState == 1 && percent >= 100" class="sale">{{$t('seckill.saleOver') }}</span>
      </div>
      <div class="price">
        <div class="price-num">
          <span class="top-num">{{ itemGoods.marketPrice - Math.round(itemGoods.marketPrice * itemGoods.discount / 100) }}円</span>
          <span v-if="itemGoods.marketPrice !== (itemGoods.marketPrice - Math.round(itemGoods.marketPrice * (itemGoods.discount / 100)))" class="bottom-num">{{itemGoods.marketPrice}}円</span>
        </div>
        <div class="button">
          <div v-if="itemGoods.timeState === 0" class="quickBegin">{{$t('seckill.quickbegin')}}</div>
          <div v-if="itemGoods.timeState === 1 && percent < 100" class="nowBuy">{{$t('seckill.buynow')}}</div>
          <div v-if="itemGoods.timeState === 1 && percent >= 100" class="saleOver">{{$t('seckill.saleOver')}}</div>
          <div v-if="itemGoods.timeState === 3" class="tomorrow">{{$t('seckill.tomorrow')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SkillItem',
  props: {
    itemGoods: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl', 'locale']),
    percent () {
      if (this.itemGoods.buyNum > this.itemGoods.leverNum) {
        return this.itemGoods.buyNum / this.itemGoods.stockNum * 100
      } else {
        return this.itemGoods.leverNum / this.itemGoods.stockNum * 100
      }
    },
    sale () {
      if (this.itemGoods.leverNum < this.itemGoods.buyNum) {
        return Math.floor(this.itemGoods.buyNum / this.itemGoods.stockNum * 100)
      } else {
        return Math.floor(this.itemGoods.leverNum / this.itemGoods.stockNum * 100)
      }
    }
  },
  methods: {
    toDetail () {
      window.sessionStorage.setItem('page', 'flash')
      this.$router.push(`/product/${this.itemGoods.goodsId}`)
    }
  }
}
</script>

<style lang="less" scoped>
.goods-item {
  margin-bottom: 20px;
  background-color: #ffffff;
  width: 100%;
  height: 278px;
  padding: 10px;
  border-radius: 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  .images-url {
    position: relative;
    .url {
      width: 258px;
      height: 258px;
    }
    .postImg {
      position: absolute;
      width: 150px;
      height: 150px;
      left: calc(50% - 75px);
      top: calc(50% - 75px);
    }
  }
  .goods-info {
    flex: 1;
    height: 100%;
    padding-left: 20px;
    padding-top: 20px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .goods-title {
      font-size: 28px;
      font-weight: 400;
      color: #333333;
      line-height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .sale-progress {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      margin: 20px 0px;
      .progress {
        width: 215px;
      }
      .sale {
        flex: 5;
        font-size: 22px;
        font-weight: 400;
        color: #796969;
        padding-left: 20px;
      }
    }
    .price {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      width: 100%;
      height: 80px;
      padding-right: 10px;
      .price-num {
        width: 120px;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: flex-start;
        .top-num {
          font-size: 34px;
          color: #ff5d19;
          line-height: 40px;
        }
        .bottom-num {
          font-size: 26px;
          text-decoration: line-through;
          color: #999999;
          margin-top: 5px;
        }
      }
      .button {
        .nowBuy {
          background-color: #e00404;
          color: #ffffff;
          padding: 13px 26px;
          font-size: 24px;
          font-weight: 400;
          border-radius: 30px;
        }
        .quickBegin,
        .tomorrow {
          color: #1cb935;
          font-size: 24px;
          font-weight: 400;
        }
        .saleOver {
          background-color: #bbbbbb;
          color: #ffffff;
          padding: 13px 26px;
          font-size: 24px;
          font-weight: 400;
          border-radius: 30px;
        }
      }
    }
  }
}
</style>
