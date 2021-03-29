<!---->
<template>
  <div class="seckillbox">
    <div class="seckillbox_head">
      <div class="seckillbox_head_left">
        <div class="header-title">{{$t('seckill.name')}}</div>
        <van-count-down :time="seckillData.times" format="HH:mm:ss" @finish="seckillFinish">
          <template v-slot="timeData">
            <span class="item">{{timeData.hours&lt;10?'0'+timeData.hours:timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="item">{{ timeData.minutes&lt;10?'0'+timeData.minutes:timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="item">{{ timeData.seconds&lt;10?'0'+timeData.seconds:timeData.seconds }}</span>
          </template>
        </van-count-down>
        <div v-if="seckillData.seckilltimestate == 0" class="tips">{{$t('seckill.timebegin')}}</div>
      </div>
      <div class="seckillbox_head_right" @click="goSeckill">
        <span>{{$t('seckill.lookmore')}}</span>
        <van-icon size="3.428571428571429vw" name="arrow" />
      </div>
    </div>
    <div class="seckillbox_body">
      <div class="body-scroll">
        <ul class="scrollBox">
          <li v-for="(item,index) in seckillData.data" :key="index" class="scroll-item" @click="goDetail(item.id)">
            <a class="image-placeholder" :href="getUrl + 'product/' + item.id" :title="item.goodsTitle" @click.prevent="()=> false">
              <img class="image-url" :src="baseImageUrl + item.goodsSearchImage + '?x-oss-process=image/resize,w_1000/format,webp'"  />
            </a>
            <a :href="getUrl + 'product/' + item.id" :title="item.goodsTitle" @click.prevent="()=> false">
              <p class="seckill_goods_title van-ellipsis">{{item.goodsTitle}}</p>
            </a>
            <p class="seckill_goods_price">
              <span class="markPrice">
                <i class="price">{{item.marketPrice - Math.round(item.marketPrice*item.discount/100)}}</i>
                <span class="fuhao">円</span>
              </span>
              <span v-if="item.marketPrice !== (item.marketPrice - Math.round(item.marketPrice * (item.discount / 100)))" class="linePrice">
                <i class="linePriceNum">{{item.marketPrice}}</i>
                <span class="fuhao">円</span>
              </span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    seckillData: {
      type: Object,
      default () {
        return {
          show: false,
          times: '',
          data: []
        }
      }
    }
  },
  data () {
    return {
      time: 0,
      seckillallGoodsList: [],
      seckilltimestate: 0,
      isShow: false
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl']),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  methods: {
    seckillFinish () {
      this.$router.go(0)
    },
    goSeckill () {
      this.$router.push('/flash')
    },
    goDetail (id) {
      this.$router.push('/product/' + id)
    }
  }
}
</script>

<style lang='less'  scoped>
.seckillbox {
  width: 100%;
  height: 465px;
  background-image: url('https://image.stardaymart.com/h5/lALPDhmOuJJulAHNAdDNAr4_702_464.png?x-oss-process=image/resize,w_1000/format,webp');
  background-repeat:  no-repeat;
  background-size: 100% 100%;
  background-origin: border-box;
  /*padding: 0 24px;*/
  padding-bottom: 18px;
  /*border-radius: 10px;*/
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  background-color: #f4f4f4;
}
.seckillbox_head {
  width: 100%;
  height: 88px;
  padding-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-flow: row nowrap;
  .seckillbox_head_left {
    padding-left: 20px;
    flex: 9;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .header-title,
    .tips {
      font-size: 34px;
      font-weight: 700;
      text-align: left;
      color: #ffffff;
      line-height: 51px;
    }
    .item {
      background-color: #00533d;
      font-size: 24px;
      font-weight: 500;
      color: #ffffff;
      line-height: 33px;
      text-align: center;
      padding: 2px 4px;
      border-radius: 6px;
    }
    .colon {
      color: #ffffff;
    }
  }
  .seckillbox_head_right {
    flex: 3;
    padding-right: 18px;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #fff;
    line-height: 40px;
    font-weight: 400;
    text-align: left;
  }
}
.van-count-down {
  color: #323233;
  font-size: 16px;
  line-height: 51px;
  margin: 0 5px;
}
.seckillbox_body {
  height: 357px;
  padding: 0 20px;
  .body-scroll::-webkit-scrollbar {
    display: none;
  }
  .body-scroll {
    height: 357px;
    min-width: inherit;
    position: relative;
    overflow-x: scroll;
    .scrollBox {
      position: absolute;
      height: inherit;
      overflow: hidden;
      min-width: inherit;
      left: 0;
      display: flex;
      flex-flow: row nowrap;
      .scroll-item:first-child {
        margin-left: 0;
      }
      .scroll-item {
        margin-left: 10px;
        display: inline-block;
        width: 234px;
        height: inherit;
        background-color: #ffffff;
        border-radius: 10px;
        font-size: 0;
        .image-placeholder{
          width: 234px;
          height: 234px;
          background-image: url("../../assets/images/loading/default-lg.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: inline-block;
          text-decoration: none;
          .image-url {
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            width: 234px;
            height: 234px;
            object-fit: cover;
          }
        }
        .seckill_goods_title {
          font-size: 28px;
          text-align: left;
          color: #333333;
          line-height: 42px;
          padding: 20px 5px 0px 10px;
        }
        .seckill_goods_price {
          padding: 0 10px;
          display: flex;
          flex-flow: row nowrap;
          align-items: flex-end;
          justify-content: flex-start;
          .markPrice {
            display: flex;
            align-items: flex-end;
            .price {
              font-size: 38px;
              font-weight: 700;
              text-align: left;
              color: #ff5d19;
            }
            .fuhao {
              font-size: 22px;
              font-weight: 600;
              text-align: left;
              color: #ff5d19;
              line-height: 30px;
            }
          }
          .linePrice {
            text-decoration: line-through;
            margin-left: 8px;
            .linePriceNum {
              font-size: 22px;
              font-family: DINAlternate, DINAlternate-Bold;
              font-weight: 700;
              text-decoration: line-through;
              text-align: left;
              color: #999999;
              line-height: 26px;
            }
            .fuhao {
              font-size: 18px;
              font-family: PingFangSC, PingFangSC-Semibold;
              font-weight: 600;
              text-decoration: line-through;
              text-align: left;
              color: #999999;
              line-height: 25px;
            }
          }
        }
      }
    }
  }
}
</style>
