<!---->
<template>
  <Layout
    description="vue server side render"
    keywords="egg, vue, webpack, server side render"
  >
    <van-nav-bar
      :title="$t('user_main.return')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>

    <van-list
      v-model="loading"
      :loading-text="$t('supply.loadding')"
      :finished="finished"
      :finished-text="$t('threeClass.finished')"
      @load="onLoad"
    >
      <div
        v-for="item in list"
        :key="item.returnOrderNumber"
        class="refund_item"
      >
        <van-cell :border="false">
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <div class="title">
              <div class="custom-title van-ellipsis">{{item.storeName}}</div>

              <van-icon name="arrow" />
            </div>
          </template>
          <template #default>
            <div class="status">{{orderStatus(item.refundType)}}</div>
          </template>
        </van-cell>
        <div class="content">
          <div>
            <van-image
              width="70"
              height="70"
              :loading-icon="require('assets/images/loading/load.png')"
              :error-icon="require('assets/images/loading/load.png')"
              lazy-load
              :src="baseImageUrl + item.goodsSkuImg"
            />
          </div>
          <div class="content_right">
            <div class="content_right_header">
              <div class="van-multi-ellipsis--l2 title">{{item.goodsTitle}}</div>
              <div>¥{{item.goodsSkuPrice}}</div>
            </div>
            <div class="content_right_footer">
              <div>{{item.goodsSkuVal}}</div>
              <div>x{{item.buyNumber}}</div>
            </div>
          </div>
        </div>
        <div class="refund_info">{{refundTips(item.returnOrderState,item)}}</div>
        <div class="price_box">
          <div>
            {{$t('returnList.returnPice')}}
            <span>¥{{item.refundAmount}}</span>
          </div>
          <div class="button">
            <button
              @click="goDetail(item.returnOrderNumber)"
            >{{$t('returnList.detail')}}</button>
          </div>
        </div>
      </div>
    </van-list>
  </Layout>
</template>

<script>
import api from 'static/api'
import { formatDuring } from '@/util/tools'
import { mapGetters } from 'vuex'
export default {
  layout: 'content',
  components: {},
  data () {
    return {
      list: [],
      loading: true,
      finished: false,
      pageNum: 1
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    })
  },
  mounted () {
    this.init()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal')
      // window.location.href = '/personal'
    },
    goDetail (returnOrderNumber) {
      // window.location.href = '/refund/refundDetail?returnOrderNumber=' + returnOrderNumber
    },
    orderStatus (state) {
      switch (state) {
        case 1:
          return this.$t('supply.p6')
          // eslint-disable-next-line no-unreachable
          break
        case 2:
          return this.$t('user_main.return')
          // eslint-disable-next-line no-unreachable
          break
        case 3:
          return this.$t('supply.p6')
          // eslint-disable-next-line no-unreachable
          break
      }
    },
    refundTips (type, item) {
      const that = this
      switch (type) {
        case 0:
          if (item.refundType === 2) {
            return that.$t('newRefund.state_1')
          } else {
            return `${that.$t('newRefund.state_2')}${formatDuring(item.toDealTime)}${that.$t('newRefund.state_2_1')}`
          }
          // eslint-disable-next-line no-unreachable
          break
        case 1:
          if (item.refundType === 2) {
            return that.$t('newRefund.state_1')
          } else {
            return `${that.$t('newRefund.state_2')}${formatDuring(item.toDealTime)}${that.$t('newRefund.state_2_1')}`
          }
          // eslint-disable-next-line no-unreachable
          break
        case 2:
          return that.$t('newRefund.state_3')
          // eslint-disable-next-line no-unreachable
          break
        case 3:
          return that.$t('newRefund.state_4')
          // eslint-disable-next-line no-unreachable
          break
        case 4:
          return `${that.$t('newRefund.state_5')}${formatDuring(item.toDealTime)}`
        case 5:
          return that.$t('newRefund.state_6')
        case 6:
          return `${that.$t('newRefund.state_7')}${item.refundAmount}`
        case 7:
          return that.$t('newRefund.state_8')
        case 8:
          return that.$t('newRefund.state_9')
        case 9:
          return that.$t('newRefund.state_10')
        case 10:
          return that.$t('newRefund.state_11')
        case 11:
          return that.$t('newRefund.state_12')
          // eslint-disable-next-line no-unreachable
          break
        case 12:
          return that.$t('newRefund.state_13')
          // eslint-disable-next-line no-unreachable
          break
        case 13:
          return that.$t('newRefund.state_14')
          // eslint-disable-next-line no-unreachable
          break
        case 14:
          return that.$t('newRefund.state_15')
          // eslint-disable-next-line no-unreachable
          break
        case 15:
          return that.$t('newRefund.state_16')
          // eslint-disable-next-line no-unreachable
          break
        case 16:
          return that.$t('newRefund.state_17')
          // eslint-disable-next-line no-unreachable
          break
        case 17:
          return that.$t('newRefund.state_18')
          // eslint-disable-next-line no-unreachable
          break
        case 18:
          return that.$t('newRefund.state_19')
          // eslint-disable-next-line no-unreachable
          break
        case 19:
          return that.$t('newRefund.state_20')
          // eslint-disable-next-line no-unreachable
          break
        default:
          return '正在获取退单状态'
          // eslint-disable-next-line no-unreachable
          break
      }
    },
    onLoad () {
      const that = this
      setTimeout(() => {
        that.pageNum++
        that.init()
      }, 1000)
    },
    init () {
      const that = this
      const data = {
        orderByField: '',
        pageNo: that.pageNum,
        pageSize: 20,
        sort: ''
      }
      that.$axios.post(api.refund.list, data).then((res) => {
        if (res.code === 200) {
          that.list = that.list.concat(res.data.rows)
          if (res.data.totalPage <= res.data.page) {
            that.finished = true
          } else {
            that.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
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
  /deep/.van-cell {
    line-height: 32px;
    /*padding: 20px 30px;*/
  }
  .custom-title {
    vertical-align: middle;
    font-size: 32px;
    max-width: 560px;
    font-weight: 600;
    text-align: left;
    color: #333333;
    line-height: 42px;
  }
  .title {
    display: flex;
    align-items: center;
  }
  .status {
    font-size: 32px;
    font-weight: 400;
    color: #ffaa45;
  }
  .van-cell {
    border-bottom: 0;
  }
  .refund_item {
    padding-top: 10px;
    padding-bottom: 10px;
    min-height: 530px;
    background: #fff;
    margin-top: 20px;
  }
  .content {
    padding: 0px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .content_right {
    height: 140px;
    display: flex;
    width: 78%;
    flex-direction : column;
    justify-content: space-between;
  }
  .content_right_header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 28px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 38px;
  }
  .content_right_footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    font-size: 22px;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 30px;
    margin-bottom: 10px;
  }
  .refund_info {
    margin: 40px auto 0px;
    padding: 10px 20px;
    font-size: 24px;
    background: #f4f7fe;
    width: 650px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 36px;
    min-height: 50px;
    vertical-align: middle;
    display: -webkit-box;
    -webkit-box-orient: horizontal;
    -webkit-box-align: center;
    -moz-box-orient: horizontal;
    -moz-box-align: center;
    -o-box-orient: horizontal;
    -o-box-align: center;
    -ms-box-orient: horizontal;
    -ms-box-align: center;
  }

  .price_box {
    margin-top: 32px;
    float: right;
    margin-right: 30px;
    font-size: 24px;

    font-weight: 400;
    text-align : right;
    color: #333333;
    line-height: 34px;
  }
  .price_box span {
    font-size: 32px;
    font-weight: 600;
    text-align: left;
    color: #ff5d19;
    line-height: 46px;
  }
  .button {
    margin-top: 40px;
    float: right;
  }
  .button button {
    width: 176px;
    height: 56px;
    border: 1px solid #979797;
    border-radius: 28px;
    background: #fff;
    line-height: 52px;
  }
</style>
