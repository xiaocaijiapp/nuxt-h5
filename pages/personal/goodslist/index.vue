<template>
    <div class="goodsContainer">
      <van-sticky>
        <van-nav-bar
          :title="$t('newThreeClass.goodsList')"
          placeholder
          @click-left="onClickLeft"
        >
          <template #left>
            <van-icon name="arrow-left" color="#666666" />
          </template>
        </van-nav-bar>
      </van-sticky>
      <van-tabs
        v-model="activeTab"
        swipeable
        animated
        color="#FF5D19"
        title-active-color="#FF5D19"
        line-width="35px"
        line-height="3px"
        @click="changeTabs"
      >
        <van-tab name="1" :title="$t('newThreeClass.buyGoods')">
          <div v-if="buyGooodsList.length > 0">
              <van-list
                v-model="loading"
                :loading-text="$t('supply.loadding')"
                :finished="finished"
                :finished-text="$t('threeClass.finished')"
                @load="onLoad"
              >
                <div class="content">
                  <div v-for="(item, index) in buyGooodsList" :key="index" class="goods-item" @click="goToGoodsDetail(item.id, 2)">
                    <div class="imgbox">
                      <img v-lazy="baseImageUrl + item.goodsImage" alt="">
                    </div>
                    <div class="title">{{item.goodsTitle}}</div>
                    <div class="price">
                      <span>{{item.marketPrice}}</span>
                      <span>円</span>
                      <!--                <span>25688</span>-->
                    </div>
                    <div class="button" @click.stop="goToShare(item.id, 2, ((item.marketPrice * ratio)/100).toFixed(0))">{{$t('newThreeClass.gainIntegral').replace('N', ((item.marketPrice * ratio)/100).toFixed(0))}}</div>
                  </div>
                </div>
              </van-list>
          </div>
          <div v-else style="text-align:center;height:100vh;padding-top:200px;background-color:#fff;">
            <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
            <p>{{$t('newUserInfo.error_msg1')}}</p>
          </div>
        </van-tab>
        <van-tab name="2" :title="$t('newThreeClass.platformRecom')">
          <div v-if="platformList.length > 0">
            <van-list
              v-model="loading"
              :loading-text="$t('supply.loadding')"
              :finished="finished"
              :finished-text="$t('threeClass.finished')"
              @load="onLoad"
            >
              <div class="content">
                <div v-for="(item, index) in platformList" :key="index" class="goods-item" @click="goToGoodsDetail(item.goodsId, 1)">
                  <div class="imgbox">
                    <img v-lazy="baseImageUrl + item.goodsImage" alt="">
                  </div>
                  <div class="title">{{item.goodsTitle}}</div>
                  <div class="price">
                    <span>{{item.marketPrice}}</span>
                    <span>円</span>
<!--                    <span>25688</span>-->
                  </div>
                  <div class="button" @click.stop="goToShare(item.goodsId, 1, ((item.marketPrice * ratio)/100).toFixed(0))">{{$t('newThreeClass.gainIntegral').replace('N', ((item.marketPrice * ratio)/100).toFixed(0))}}</div>
                </div>
              </div>
            </van-list>
          </div>
          <div v-else style="text-align:center;height:100vh;padding-top:200px;background-color:#fff;">
            <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
            <p>{{$t('newUserInfo.error_msg1')}}</p>
          </div>
        </van-tab>
      </van-tabs>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      activeTab: '',
      buyGooodsList: [],
      platformList: [],
      pageNo: 1,
      pageSize: 10,
      loading: true,
      finished: false,
      ratio: 0
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl',
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.activeTab = this.$route.query.active || '1'
    if (this.activeTab === '1') {
      this.getBuyGoods()
    } else {
      this.getPlatformRecom()
    }
    this.queryDictionaries()
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    changeTabs (name) {
      this.buyGooodsList = []
      this.platformList = []
      if (name === '1') {
        this.getBuyGoods()
      } else {
        this.getPlatformRecom()
      }
    },
    goToGoodsDetail (goodsId, fromFlag) {
      this.$axios.get('starday-goods/user/share/edit/' + goodsId).then((res) => {
        if (res.code === 200) {
          this.$router.push('/product/' + goodsId + '?fromFlag=' + fromFlag + '&shareIntegralId=' + res.data.id)
          window.sessionStorage.setItem('goodsList', 'goodsListPage')
        }
      })
    },
    goToShare (goodsId, fromFlag, integral) {
      this.$router.push('/personal/sharegoods?goodsId=' + goodsId + '&fromFlag=' + fromFlag + '&integral=' + integral)
    },
    onLoad () {
      // 异步更新数据
      const _this = this
      setTimeout(() => {
        // 加载状态结束
        _this.pageNo++
        if (_this.activeTab === '1') {
          _this.getBuyGoods()
        } else {
          _this.getPlatformRecom()
        }
      }, 1000)
    },
    // 已购商品
    getBuyGoods () {
      const _this = this
      _this.$axios.post('starday-order/myOrder/listOrderGoods', { pageNo: this.pageNo, pageSize: this.pageSize }).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            _this.buyGooodsList = _this.buyGooodsList.concat(res.data.rows || [])
            _this.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            _this.buyGooodsList = _this.buyGooodsList.concat(res.data.rows || [])
            _this.loading = false
          } else {
            _this.buyGooodsList = _this.buyGooodsList.concat(res.data.rows || [])
          }
        }
      })
    },
    // 平台推荐商品
    getPlatformRecom () {
      const _this = this
      _this.$axios.post('starday-elasticsearch/search/recommend', { pageNo: this.pageNo, pageSize: this.pageSize }).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            _this.platformList = _this.platformList.concat(res.data.rows || [])
            _this.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            _this.platformList = _this.platformList.concat(res.data.rows || [])
            _this.loading = false
          } else {
            _this.platformList = _this.platformList.concat(res.data.rows || [])
          }
        }
      })
    },
    // 字典查询-分享商品返积分:订单积分比例
    queryDictionaries () {
      const code = 'SHARE_GOODS_RECEIVE_INTEGRAL'
      const groupCode = 'INTEGRAL_SETTING'
      this.$axios.get('starday-system/dict/getValue', { params: { code, groupCode } }).then((res) => {
        if (res.code === 200) {
          this.ratio = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  /deep/.van-nav-bar__content {
    height: 88px;
    line-height: 88px;
  }
  /deep/.van-nav-bar__title {
    font-size: 32px;
    color: #333333;
  }
  /deep/.van-icon-arrow-left {
    color: #999;
    font-size: 36px;
  }
  /deep/.van-tab__text {
    font-size: 34px;
    line-height: 40px;
  }
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
  .goodsContainer {
    /deep/.van-tabs{
      .van-tabs__wrap{
        height: 88px;
      }
    }
    .content {
      display: flex;
      flex-flow: row;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 20px;
      .goods-item {
        width: 345px;
        height: 570px;
        margin-top: 28px;
        border-radius: 10px;
        background: #fff;
        .imgbox {
          width: 345px;
          height: 345px;
          border-top-right-radius: 8px;
          border-top-left-radius: 8px;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .title {
          width: 309px;
          font-size: 28px;
          color: #333333;
          padding: 25px 0;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          margin: 0 auto;
        }
        .price {
          width: 309px;
          padding-bottom: 25px;
          margin: 0 auto;
          span:nth-of-type(1) {
            font-size: 40px;
            color: #FF5D19;
            font-weight: 700;
          }
          span:nth-of-type(2) {
            font-size: 22px;
            color: #FF5D19;
          }
          span:nth-of-type(3) {
            font-size: 22px;
            color: #999999;
            text-decoration: line-through;
            margin-left: 10px;
          }
        }
        .button {
          width: 258px;
          height: 52px;
          border-radius: 26px;
          text-align: center;
          line-height: 52px;
          color: #ffffff;
          font-size: 22px;
          background: linear-gradient(to right, #FFA14B, #FF5E1A);
          margin: 0 auto;
        }
      }
      .goods-item:nth-of-type(1),.goods-item:nth-of-type(2) {
        margin-top: 0;
      }
    }
  }
</style>
