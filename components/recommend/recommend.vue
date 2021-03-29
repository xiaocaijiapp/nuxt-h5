<!---->
<template>
  <div v-if="isShow">
    <div v-if="list.length > 0" class="recommend">
      <van-icon :name="require('assets/images/user/zhuangshi.png')" />
      <span>{{$t('newEmpty.recomond')}}</span>
      <van-icon :name="require('assets/images/user/zhuangshi.png')" />
    </div>

    <div>
      <van-list
        v-model="loading"
        :loading-text="$t('supply.loadding')"
        :finished="finished"
        :finished-text="$t('threeClass.finished')"
        @load="onLoad"
      >
        <div class="recommend-goodslist">
          <div
            v-for="(item,index) in list"
            :key="index"
            class="recommend-goods"
            @click="goDetail(item)"
          >
            <div v-if="item.flashSaleActivityStates == 1" class="seckillIcon">
              <van-image
                lazy-load
                width="45%"
                height="24px"
                :src="require('~/assets/images/icon/miaoshaicon.png')"
              />
            </div>
            <van-image
              width="100%"
              height="162"
              lazy-load
              :loading-icon="require('~/assets/images/loading/default-lg.png')"
              :error-icon="require('~/assets/images/loading/default-lg.png')"
              :src="baseImageUrl + item.goodsSearchImage+'?x-oss-process=image/resize,w_1000/format,webp'"
              :alt="item.goodsTitle"
            />
            <h3 class="van-ellipsis" style="padding: 6px 10px 0px;">
              <a @click.stop="goStop" :href="getUrl + 'product/' + item.id" :title="item.goodsTitle">
                <span>{{ item.goodsTitle }}</span>
              </a>
            </h3>
            <div class="price">
              {{item.price}}
              <span>円</span>
            </div>

            <div
              v-if="item.flashSaleActivityStates == 1 || item.discountActivityStates == 1"
              class="line-price"
            >
              {{item.marketPrice}}
              <span>円</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import api from 'static/api'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      pageNum: 0,
      isShow: true
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    }),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  methods: {
    init () {
      const _this = this
      const data = {
        pageNo: _this.pageNum,
        pageSize: 8,
        sorted: 0,
        sortOrder: 'desc',
        listType: 3
      }
      _this.$axios.post(api.store.goods, data).then((res) => {
        if (res.code === 200) {
          _this.isShow = true
          res.data.rows.forEach((item) => {
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
          _this.list = _this.list.concat(res.data.rows)
          if (res.data.totalPage <= res.data.pageNo) {
            _this.finished = true
          } else {
            _this.loading = false
          }
        } else {
          _this.isShow = false
          _this.finished = true
        }
      })
    },
    goDetail (item) {
      this.$router.push('/product/' + item.id)
      // window.location.href = `/product/${item.id}`
    },
    onLoad () {
      // 异步更新数据
      const _this = this
      setTimeout(() => {
        // 加载状态结束
        _this.pageNum++
        _this.init()
      }, 1000)
    },
    goStop () {}
  }
}
</script>

<style lang='less' scoped>
  /deep/.van-loading__text {
    color: #969799;
    font-size: 24px!important;
    line-height: 80px!important;
    text-align: center;
  }
  /deep/.van-list__finished-text {
    color: #969799;
    font-size: 24px!important;
    line-height: 80px!important;
    text-align: center;
  }
.recommend {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  font-size: 32px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}
.recommend span {
  padding: 0 14px;
  font-weight: 600;
}
.recommend-goodslist {
  width: 100%;
  box-sizing: border-box;
  padding: 0px 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 60px;
  .recommend-goods:nth-child(2n) {
    margin-left: 44px;
  }
}
.recommend-goods {
  width: 334px;
  height: 494px;
  background: #fff;
  margin-top: 30px;
  position: relative;
  .seckillIcon {
    position: absolute;
    top: -10px;
    left: -12px;
    z-index: 1;
  }
}
.recommend-goods p {
  margin: 0;
  font-size: 28px;
  padding: 0 20px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
}
.recommend-goods .price {
  padding-top: 20px;
  line-height: 60px;
  padding-left: 20px;
  font-size: 40px;
  font-weight: bold;
  color: rgba(255, 93, 25, 1);
}
.recommend-goods .price span {
  font-size: 24px;
}
.recommend-goods .line-price {
  padding-left: 20px;
  font-size: 24px;
  font-weight: bold;
  color: rgba(153, 153, 153, 1);
  text-decoration: line-through;
}
</style>
