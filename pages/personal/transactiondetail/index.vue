<template>
  <div>
    <van-nav-bar
      :title="$t('supply.p20')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>
    <NoData v-if="isShowEmpty" />
    <div v-else class="box">
      <van-list
        v-model="loading"
        :loading-text="$t('supply.loadding')"
        :finished="finished"
        :finished-text="$t('threeClass.finished')"
        @load="onLoad"
      >
        <div v-for=" (item,index) in list" :key="index" class="history_item">
          <div class="header">
            <div
              class="left"
            >{{item.type == 2?$t('order.moneyPay'):item.type == 1?$t('newUserInfo.Recharge'):item.type == 3?$t('newUserInfo.Balancerefund'):$t('newUserInfo.Balanceexchange')}}</div>
            <div
              class="right"
            >{{item.type == 2?('-'+item.price):('+'+item.price)}}</div>
          </div>
          <div class="date">{{item.createTime}}</div>
          <div class="ordernumber">
            {{item.cardOrderNo?$t('newOrder.number'):''}}{{item.cardOrderNo}}
            <span
              v-if="item.cardOrderNo.indexOf('T')>-1"
              @click="viewSmallOrder(item.cardOrderNo)"
            >
              <van-icon name="arrow-down" />
            </span>
          </div>
        </div>
      </van-list>
    </div>
    <van-popup v-model="show" :style="{width:'80%'}">
      <div class="main">
        <div
          v-for="item in smallOrder"
          :key="item.orderNumber"
          class="smallOrder"
        >
          <div>
            <span>{{$t('newOrder.number')}}{{item.orderNumber}}</span>
          </div>
          <div>
            <span>{{$t('newOrder.price')}}{{item.totalPayPrice}}円</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import api from 'static/api'
import { mapGetters } from 'vuex'
import NoData from '~/components/empty/template_four'
export default {
  layout: 'content',
  components: {
    NoData
  },
  data () {
    return {
      list: [],
      isShowEmpty: false,
      loading: false,
      finished: false,
      pageNo: 0,
      show: false,
      smallOrder: []
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'userInfo'
    })
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    viewSmallOrder (number) {
      const tradeNumber = number
      const _this = this
      _this.$axios.get(api.order.viewlittle, {
        params: { tradeNumber }
      }).then((res) => {
        if (res.code === 200) {
          _this.show = true
          _this.smallOrder = res.data
        }
      })
    },
    mounted () {
      this.init()
    },
    init () {
      const _this = this
      const email = JSON.parse(JSON.stringify(_this.userInfo)).email
      _this.$axios.post(`${api.user.balance}${10}/${_this.pageNo}`, { email }).then((res) => {
        if (res.code === 200) {
          _this.list = _this.list.concat(res.data.rows)
          if (_this.list.length <= 0) {
            this.isShowEmpty = true
            _this.loading = false
          }
          if (res.data.totalPage === res.data.page) {
            _this.finished = true
          } else {
            _this.loading = false
          }
        }
      })
    },
    onLoad () {
      // 异步更新数据
      const that = this
      setTimeout(() => {
        // 加载状态结束
        that.pageNo++
        that.init()
      }, 1000)
    }
  }
}
</script>
<style lang='less' scoped>
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
  .box {
    width: 96%;
    background-color: #fff;
    margin: 0 auto;
    margin-top: 20px;
    box-sizing: border-box;
    padding: 30px;
  }
  .history_item {
    font-size: 24px;
    margin-top: 20px;
    font-weight: 400;
    text-align : left;
    color: #999999;
    line-height: 32px;
    border-bottom : 1px dashed #e5e5e5;
    padding-bottom: 20px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .left {
        font-size: 28px;
        font-weight: 400;
        text-align : left;
        color: #333333;
        line-height: 40px;
      }
      .right {
        font-size: 28px;
        font-weight: 600;
        text-align : left;
        color: #ff5d19;
        line-height: 40px;
      }
    }
  }
  .main {
    width: 100%;
    box-sizing: border-box;
    padding: 20px;
  }
  .smallOrder {
    margin-top: 30px;
    font-size: 32px;
    border-bottom: 1px dashed #999;
    padding-bottom: 20px;
  }
  .defaultValue {
    text-align: left;
  }
</style>
