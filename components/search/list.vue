<!---->
<template>
  <div class="recommend-goodslist">
    <div v-for="(single,index) in list" :key="index" class="recommend-goods" @click="goDetail(single)">
      <div v-if="single.flashSaleActivityStates == 1" class="seckillIcon">
        <img
          class="seckillIconimg"
          v-lazy="require(`assets/images/icon/miaoshaicon.png`)"
          :onerror="defaultImage"
          :alt="single.goodsTitle"
        />
      </div>
      <a  class="proMainImage-bkimage" :href="getUrl + 'product/' + single.id" :title="single.goodsTitle" @click.prevent="()=> false">
        <img
          class="proMainImage"
          v-lazy="single.goodsSelectImg ? baseImageUrl + single.goodsSelectImg+'?x-oss-process=image/resize,w_1000/format,webp' :baseImageUrl + single.goodsSearchImage+'?x-oss-process=image/resize,w_1000/format,webp'"
          :alt="single.goodsTitle"
        />
      </a>
      <a class="protitle" :href="getUrl + 'product/' + single.id" :title="single.goodsTitle" @click.prevent="()=> false">
        <p class="van-ellipsis">{{ single.goodsTitle }}</p>
      </a>
      <div class="allprice">
        <div class="price">
          <span class="num">{{single.price}}</span>
          <span class="unit"> 円</span>
        </div>
        <div v-if="single.flashSaleActivityStates == 1 || single.discountActivityStates == 1" class="line-price">
          <span class="num">{{single.marketPrice}}</span>
          <span class="unit">円</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      item: ''
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl', 'locale']),
    getUrl () {
      return process.env.proxyUrl
    },
    defaultImage () {
      return `this.src=${require('assets/images/empty/default2.png')}`
    }
  },
  watch: {
    list: {
      immediate: true,
      handler (val) {
        val.forEach((item) => {
          if (item.flashSaleActivityStates === 1) {
            item.price = item.activityPrice
          } else if (item.discountActivityStates === 1) {
            item.price = item.activityPrice
          } else {
            item.price = item.marketPrice
          }
        })
        this.goodsList = val
      }
    }
  },
  methods: {
    goDetail (item) {
      this.$router.push(`/product/${item.id}`)
      window.sessionStorage.setItem('prefixPage1', 'outNav1')
      window.sessionStorage.setItem('prePage1', location.pathname + location.search)
    },
    goStop () {

    }
  }
}
</script>

<style lang="less" scoped>
.recommend-goodslist {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.recommend-goods:nth-child(1) {
  margin-top: 0;
}
.recommend-goods:nth-child(2) {
  margin-top: 0;
}
.recommend-goods {
  width: 345px;
  height: 494px;
  background: #fff;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  font-size: 0;
  margin-top: 20px;
  .seckillIcon {
    position: absolute;
    left: -3px;
    z-index: 1;
    top: -5px;
    .seckillIconimg {
      width: 151px;
      height: 48px;
    }
  }
  .proMainImage-bkimage{
    width: 345px;
    height: 345px;
    display: inline-block;
    background-image: url('../../assets/images/loading/default-lg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .proMainImage {
      width: 345px;
      height: 345px;
      object-fit: cover;
    }
  }
  .protitle {
    width: 100%;
    height: 80px;
    font-size: 28px;
    font-weight: 400;
    text-align: left;
    padding: 0 16px 0 20px;
    color: #333333;
    line-height: 80px;
  }
  .allprice {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: baseline;
    flex: 1;
    .price {
      padding-left: 20px;
      .num {
        font-size: 40px;
        font-weight: 700;
        text-align: left;
        color: #ff5d19;
        line-height: 47px;
      }
      .unit {
        font-size: 22px;
        font-weight: 600;
        text-align: left;
        color: #ff5d19;
        line-height: 30px;
      }
    }
    .line-price {
      margin-left: 10px;
      text-decoration: line-through;
      .num,
      .unit {
        font-size: 22px;
        font-weight: 700;
        text-decoration: line-through;
        text-align: left;
        color: #999999;
        line-height: 26px;
      }
    }
  }
}
</style>
