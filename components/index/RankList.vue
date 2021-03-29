<!---->
<template>
  <div class="toplist">
    <div class="toplist_box">
      <div class="toplist_box_title">{{$t('newEmpty.rank')}}</div>
      <div class="toplist_box_main">
        <div class="toplist_box_activity" @click="goactivityPage">
          <img src="~/assets/images/index/paihangbang.png" alt="">
        </div>
        <div class="ranklist">
          <div class="ranklistScroll">
            <div v-for="(item,index) in rankData" :key="item.id" class="toplist_box_item" @click="goDetail(item.id)">
              <img class="top" :src="require(`~/assets/images/index/top${index+1}.png`)" />
              <a class="rankBackImage" :href="getUrl + 'product/' + item.id" :title="item.goodsTitle" @click.prevent="()=> false">
                <img class="main-img" v-lazy="item.goodsSelectImg ? baseImageUrl+item.goodsSelectImg+'?x-oss-process=image/resize,w_1000/format,webp':baseImageUrl+item.goodsSearchImage+'?x-oss-process=image/resize,w_1000/format,webp'" alt="">
              </a>
              <div class="price">
                <span class="num">{{item.marketPrice}}</span>
                <span class="icon">円</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="toplist_box_bottom">
        <span class="title">{{$t('newEmpty.hot')}}</span>
        <van-notice-bar color="#333" background="#fff" :scrollable="false">
          <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
            <van-swipe-item v-for="(item, _index) in  evaluateData.evaluateData" :key="_index" @click="toDetail(item.spuId)">{{item.commentContent}}</van-swipe-item>
          </van-swipe>
        </van-notice-bar>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    rankData: {
      type: Array,
      default () {
        return []
      }
    },
    evaluateData: {
      type: Object,
      default () {
        return {}
      }
    },
    rankId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl']),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  mounted () {
  },
  methods: {
    goStop () {},
    goactivityPage () {
      this.$router.push('/promotionpage/promotionrank/' + this.rankId)
    },
    goDetail (id) {
      this.$router.push('/product/' + id)
    },
    toDetail (id) {
      this.$router.push('/product/' + id)
    }
  }
}
</script>

<style lang='less'  scoped>
.toplist {
  background: #f4f4f4;
  padding-top: 22px;
}
.toplist_box {
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  padding: 0 14px;
}
.toplist_box_activity {
  width: 105px;
  img {
    width: 200px;
    height: 268px;
  }
}
.toplist_box_title {
  font-size: 34px;
  font-weight: 700;
  text-align: left;
  color: #333333;
  line-height: 34px;
  padding: 28px 0 32px;
}

.toplist_box_main {
  width: 100%;
  height: 298px;
  border-bottom: 2px solid #e5e5e5;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  .toplist_box_activity {
    width: 200px;
    height: 268px;
    border-radius: 10px;
  }
  .ranklist::-webkit-scrollbar {
    display: none;
  }
  .ranklist {
    flex: 1;
    position: relative;
    overflow-x: scroll;
    margin-left: 10px;
    .ranklistScroll {
      position: absolute;
      left: 0;
      display: flex;
      flex-flow: row nowrap;
      .toplist_box_item:first-child {
        margin-left: 0;
      }
      .toplist_box_item {
        margin-left: 10px;
        position: relative;
        width: 200px;
        height: 268px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        background-color: #f7f7f7;
        border-radius: 10px;
        overflow: hidden;
        .rankBackImage{
          width: 200px;
          height: 200px;
          background-image: url("../../assets/images/loading/default-lg.png");
          background-repeat: no-repeat;
          background-size: 100% 100%;
          display: inline-block;
          text-decoration: none;
          border: 0;
          -webkit-tap-highlight-color:rgba(0,0,0,0);
          outline:none;
          .main-img {
            width: 200px;
            height: 200px;
            object-fit: cover;
          }
        }
        .top {
          position: absolute;
          top: 0;
          left: 10px;
          z-index: 1;
          width: 46px;
          height: 56px;
        }
        .price {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          .num {
            font-size: 34px;
            font-weight: 700;
            text-align: left;
            color: #ff5d19;
            line-height: 40px;
          }
          .icon {
            font-size: 20px;
            font-weight: 600;
            text-align: left;
            color: #ff5d19;
            line-height: 28px;
          }
        }
      }
    }
  }
}
.toplist_box_bottom {
  width: 100%;
  height: 86px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  .title {
    font-size: 28px;
    font-weight: 500;
    text-align: right;
    color: #333333;
    line-height: 42px;
    width: 300px;
  }
  .title::after {
    content: '|';
    width: 2px;
    height: inherit;
    font-size: 28px;
    margin-left: 10px;
    line-height: 42px;
  }
  .van-notice-bar {
    padding-left: 15px;
    padding-top: 0px;
    width: 100%;
  }
}
/deep/.van-notice-bar__content {
  width: 100%;
}
/deep/.van-swipe-item {
  font-size: 22px;
  width: 100%;
}
/deep/.notice-swipe {
  height: 40px;
  width: 100%;
  line-height: 40px;
}
</style>
