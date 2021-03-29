<!---->
<template>
  <div class="shop_recommend">
    <div class="shop">
      {{$t('activity.recommendGoods')}}
    </div>

    <div class="goods_list">
      <div v-for="item in goodsList" :key="item.id" class="goods_list_item" @click="goDetail(item)">
        <div v-if="item.flashSaleActivityStates === 1" class="seckillIcon">
          <img class="seckillIconimg" src="~/assets/images/icon/miaoshaicon.png" :onerror="defaultImage" :alt="item.goodsTitle">
        </div>
        <img class="proimg" v-lazy="baseImageUrl + item.goodsSearchImage+'?x-oss-process=image/resize,w_1000/format,webp'" :alt="item.goodsTitle">
        <h3 class="van-ellipsis goods_list_item_title" @click="$router.push('/product/' + item.id)">
          <a :href="getUrl + 'product/' + item.id" :title="item.goodsTitle" @click.prevent="()=> false">{{item.goodsTitle}}</a>
        </h3>
        <div class="goods_list_item_price">
          <span>{{item.price}}</span><span>円</span>
          <img class="shuishou" src="~/assets/images/goodsdetail/shuiru.png" :onerror="defaultImage" alt="">
        </div>
        <div
          v-if="(item.flashSaleActivityStates == 1 || item.discountActivityStates == 1) && (item.activityPrice < item.marketPrice)"
          class="goods_list_item_lineprice"
        >
          <span>{{item.marketPrice}}</span><span>円</span>
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
    },
    storeId: {
      type: String || Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      goodsList: []
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl']),
    getUrl () {
      return process.env.proxyUrl
    },
    defaultImage () {
      return `this.src='${require('assets/images/empty/default2.png')}'`
    }
  },
  watch: {
    list: {
      immediate: true,
      handler (val) {
        val.forEach((item) => {
          if (item.flashSaleActivityStates === 1) {
            item.price = Math.round(
              item.marketPrice -
                (item.marketPrice * item.flashSaleActivitys[0].discount) / 100
            )
          } else if (item.discountActivityStates === 1) {
            item.price = Math.round(
              item.marketPrice -
                (item.marketPrice * item.discountActivitys[0].rate) / 100
            )
          } else {
            item.price = item.marketPrice
          }
        })
        this.goodsList = val
      }
    }
  },
  methods: {
    goStore () {
      this.$router.push('/store/' + this.storeId)
      // window.location.href = `/store/${this.storeId}`
    },
    goDetail (item) {
      this.$router.push('/product/' + item.id)
      // window.location.href = `/product/${item.id}`
    }
  }
}
</script>

<style lang="less"  scoped>
.shop_recommend {
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background: #fff;
  margin-top: 10px;
}

.shop_recommend .shop {
  font-size: 32px;
  color: #333333;
  font-weight: 500;
  padding: 0 30px;
  width: 100%;
  text-align: left;
  height: 110px;
  line-height: 110px;
}

.goods_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  width: 100%;
  font-size: 0;
  padding: 0 20px;
}

.goods_list_item {
  width: 345px;
  height: 494px;
  position: relative;
  margin-bottom: 20px;
  .proimg{
    width: 345px;
    height: 345px;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    object-fit: cover;
  }
  .seckillIcon {
    position: absolute;
    top: -6px;
    left: -6px;
    z-index: 1;
    .seckillIconimg{
      width: 150px;
      height: 50px;
    }
  }
}

.goods_list_item_title {
  font-size: 28px;
  font-weight: 400;
  color: #333333;
  line-height: 40px;
  padding-top: 20px;
}

.goods_list_item_price {
  font-size: 18px;
  color: #ff5d19;
  line-height: 22px;
  font-weight: bold;
  vertical-align: middle;
  letter-spacing: -1px;
  span:nth-child(1){
    font-size: 40px;
    font-weight: 700;
    text-align: left;
    color: #ff5d19;
    line-height: 47px;
  }
  span:nth-child(2){
    font-size: 22px;
    font-weight: 600;
    text-align: left;
    color: #ff5d19;
    line-height: 30px;
  }
  .shuishou{
    width: 64px;
    height: 24px;
  }
}

.goods_list_item_lineprice {
  font-size: 28px;
  font-weight: bold;
  color: rgba(153, 153, 153, 1);
  line-height: 32px;
  text-decoration: line-through;
}
</style>
