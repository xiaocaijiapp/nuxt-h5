<template>
    <div class="orderDetail">
      <van-sticky>
        <van-nav-bar
          :title="$t('newThreeClass.orderDetails')"
          placeholder
          @click-left="onClickLeft"
        >
          <template #left>
            <van-icon name="arrow-left" color="#666666" />
          </template>
        </van-nav-bar>
      </van-sticky>
      <div class="searchbox">
        <van-field
          v-model="params.searchCriteria"
          clearable
          left-icon="search"
          :placeholder="$t('distribution.inputOrderKey')"
          @click-left-icon="searchHandle"
        />
      </div>
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
        <van-tab name="0" :title="$t('newThreeClass.allOrder')">
          <div class="detail-info">
            <div>
              <p>{{salesAmount}}<span>円</span></p>
              <p>
                <img src="~/assets/images/user/money.png" alt="">
                <span>{{$t('newThreeClass.sellPrice')}}</span>
              </p>
            </div>
            <div>
              <p>{{orderQuantity}}</p>
              <p>
                <img src="~/assets/images/user/order.png" alt="">
                <span>{{$t('newThreeClass.orderTotalNum')}}</span>
              </p>
            </div>
            <div>
              <p>{{integral}}<span>{{$t('index.p2')}}</span></p>
              <p>
                <img src="~/assets/images/user/earn.png" alt="">
                <span>{{$t('newThreeClass.shouPrice')}}</span>
              </p>
            </div>
          </div>
          <div v-if="orderList.length > 0">
            <van-list
              v-model="loading"
              :loading-text="$t('supply.loadding')"
              :finished="finished"
              :finished-text="$t('threeClass.finished')"
              @load="onLoad"
            >
              <div class="detail-list" v-for="(item, index) in orderList" :key="index">
                <van-cell>
                  <template #title>
<!--                    <span class="left-title1">分享订单</span>-->
                    <span class="left-title2">{{$t('order.order')}}:{{item.orderNumber}}</span>
                  </template>
                  <template #extra>
                    <span class="right-title">{{orderStatus(item.orderState)}}</span>
                  </template>
                  <template #label style="margin-top: 20px">
                    <div class="content">
                      <div>
                        <img v-lazy="baseImageUrl + item.goodsSkuImg" alt="">
                      </div>
                      <div>
                        <p>{{item.goodsTitle}}</p>
                        <p>
                          <span>{{$t('newThreeClass.paymentAmount')}}：</span>
                          <span>{{item.payAmount}}</span>
                          <span>円</span>
                        </p>
                        <p>{{item.leagueMemberNickname}}</p>
                      </div>
                    </div>
                  </template>
                </van-cell>
                <van-cell>
                  <template #title>
                    <span class="date-title">{{item.createTime}}</span>
                  </template>
                  <template #extra>
                    <span class="extra">{{$t('newThreeClass.canGetMacount').replace('M', item.earnedIntegral)}}</span>
                  </template>
                </van-cell>
              </div>
            </van-list>
          </div>
          <div v-else style="text-align:center;padding-top:20px;">
            <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
            <p style="font-size: 16px">{{$t('newUserInfo.error_msg1')}}</p>
          </div>
        </van-tab>
        <van-tab name="1" :title="$t('order.payd')">
          <div class="detail-info">
            <div>
              <p>{{salesAmount}}<span>円</span></p>
              <p>
                <img src="~/assets/images/user/money.png" alt="">
                <span>{{$t('newThreeClass.sellPrice')}}</span>
              </p>
            </div>
            <div>
              <p>{{orderQuantity}}</p>
              <p>
                <img src="~/assets/images/user/order.png" alt="">
                <span>{{$t('newThreeClass.orderTotalNum')}}</span>
              </p>
            </div>
            <div>
              <p>{{integral}}<span>{{$t('index.p2')}}</span></p>
              <p>
                <img src="~/assets/images/user/earn.png" alt="">
                <span>{{$t('newThreeClass.shouPrice')}}</span>
              </p>
            </div>
          </div>
          <div v-if="orderList.length > 0">
            <van-list
              v-model="loading"
              :loading-text="$t('supply.loadding')"
              :finished="finished"
              :finished-text="$t('threeClass.finished')"
              @load="onLoad"
            >
              <div class="detail-list" v-for="(item, index) in orderList" :key="index">
                <van-cell>
                  <template #title>
<!--                    <span class="left-title1">分享订单</span>-->
                    <span class="left-title2">{{$t('order.order')}}:{{item.orderNumber}}</span>
                  </template>
                  <template #extra>
                    <span class="right-title">{{$t('order.payd')}}</span>
                  </template>
                  <template #label style="margin-top: 20px">
                    <div class="content">
                      <div>
                        <img v-lazy="baseImageUrl + item.goodsSkuImg" alt="">
                      </div>
                      <div>
                        <p>{{item.goodsTitle}}</p>
                        <p>
                          <span>{{$t('newThreeClass.paymentAmount')}}：</span>
                          <span>{{item.payAmount}}</span>
                          <span>円</span>
                        </p>
                        <p>{{item.leagueMemberNickname}}</p>
                      </div>
                    </div>
                  </template>
                </van-cell>
                <van-cell>
                  <template #title>
                    <span class="date-title">{{item.createTime}}</span>
                  </template>
                  <template #extra>
                    <span class="extra">{{$t('newThreeClass.canGetMacount').replace('M', item.earnedIntegral)}}</span>
                  </template>
                </van-cell>
              </div>
            </van-list>
          </div>
          <div v-else style="text-align:center;padding-top:20px;">
            <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
            <p style="font-size: 16px">{{$t('newUserInfo.error_msg1')}}</p>
          </div>
        </van-tab>
        <van-tab name="2" :title="$t('newThreeClass.settleAccount')">
          <div class="detail-info">
            <div>
              <p>{{salesAmount}}<span>円</span></p>
              <p>
                <img src="~/assets/images/user/money.png" alt="">
                <span>{{$t('newThreeClass.sellPrice')}}</span>
              </p>
            </div>
            <div>
              <p>{{orderQuantity}}</p>
              <p>
                <img src="~/assets/images/user/order.png" alt="">
                <span>{{$t('newThreeClass.orderTotalNum')}}</span>
              </p>
            </div>
            <div>
              <p>{{integral}}<span>{{$t('index.p2')}}</span></p>
              <p>
                <img src="~/assets/images/user/earn.png" alt="">
                <span>{{$t('newThreeClass.shouPrice')}}</span>
              </p>
            </div>
          </div>
          <div v-if="orderList.length > 0">
            <van-list
              v-model="loading"
              :loading-text="$t('supply.loadding')"
              :finished="finished"
              :finished-text="$t('threeClass.finished')"
              @load="onLoad"
            >
              <div class="detail-list" v-for="(item, index) in orderList" :key="index">
                <van-cell>
                  <template #title>
<!--                    <span class="left-title1">分享订单</span>-->
                    <span class="left-title2">{{$t('order.order')}}:{{item.orderNumber}}</span>
                  </template>
                  <template #extra>
                    <span class="right-title">{{$t('newThreeClass.settleAccount')}}</span>
                  </template>
                  <template #label style="margin-top: 20px">
                    <div class="content">
                      <div>
                        <img v-lazy="baseImageUrl + item.goodsSkuImg" alt="">
                      </div>
                      <div>
                        <p>{{item.goodsTitle}}</p>
                        <p>
                          <span>{{$t('newThreeClass.paymentAmount')}}：</span>
                          <span>{{item.payAmount}}</span>
                          <span>円</span>
                        </p>
                        <p>{{item.leagueMemberNickname}}</p>
                      </div>
                    </div>
                  </template>
                </van-cell>
                <van-cell>
                  <template #title>
                    <span class="date-title">{{item.createTime}}</span>
                  </template>
                  <template #extra>
                    <span class="extra">{{$t('newThreeClass.canGetMacount').replace('M', item.earnedIntegral)}}</span>
                  </template>
                </van-cell>
              </div>
            </van-list>
          </div>
          <div v-else style="text-align:center;padding-top:20px;">
            <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
            <p style="font-size: 16px">{{$t('newUserInfo.error_msg1')}}</p>
          </div>
        </van-tab>
        <van-tab name="3" :title="$t('coupon.losed')">
          <div class="detail-info">
            <div>
              <p>{{salesAmount}}<span>円</span></p>
              <p>
                <img src="~/assets/images/user/money.png" alt="">
                <span>{{$t('newThreeClass.sellPrice')}}</span>
              </p>
            </div>
            <div>
              <p>{{orderQuantity}}</p>
              <p>
                <img src="~/assets/images/user/order.png" alt="">
                <span>{{$t('newThreeClass.orderTotalNum')}}</span>
              </p>
            </div>
            <div>
              <p>{{integral}}<span>{{$t('index.p2')}}</span></p>
              <p>
                <img src="~/assets/images/user/earn.png" alt="">
                <span>{{$t('newThreeClass.shouPrice')}}</span>
              </p>
            </div>
          </div>
          <div v-if="orderList.length > 0">
            <van-list
              v-model="loading"
              :loading-text="$t('supply.loadding')"
              :finished="finished"
              :finished-text="$t('threeClass.finished')"
              @load="onLoad"
            >
              <div class="detail-list" v-for="(item, index) in orderList" :key="index">
                <van-cell>
                  <template #title>
<!--                    <span class="left-title1">分享订单</span>-->
                    <span class="left-title2">{{$t('order.order')}}:{{item.orderNumber}}</span>
                  </template>
                  <template #extra>
                    <span class="right-title" style="color: #999999">{{$t('newThreeClass.loseEfficacy')}}</span>
                  </template>
                  <template #label style="margin-top: 20px">
                    <div class="content">
                      <div>
                        <img v-lazy="baseImageUrl + item.goodsSkuImg" alt="">
                      </div>
                      <div>
                        <p>{{item.goodsTitle}}</p>
                        <p>
                          <span>{{$t('newThreeClass.paymentAmount')}}：</span>
                          <span>{{item.payAmount}}</span>
                          <span>円</span>
                        </p>
                        <p>{{item.leagueMemberNickname}}</p>
                      </div>
                    </div>
                  </template>
                </van-cell>
                <van-cell>
                  <template #title>
                    <span class="date-title">{{item.createTime}}</span>
                  </template>
                  <template #extra>
                    <span class="extra">{{$t('newThreeClass.canGetMacount').replace('M', item.earnedIntegral)}}</span>
                  </template>
                </van-cell>
              </div>
            </van-list>
          </div>
          <div v-else style="text-align:center;padding-top:20px;">
            <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
            <p style="font-size: 16px">{{$t('newUserInfo.error_msg1')}}</p>
          </div>
        </van-tab>
      </van-tabs>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/static/api'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      params: {
        orderState: 0,
        searchCriteria: '',
        ownerOrderFlag: 0,
        pageNo: 1,
        pageSize: 10
      },
      activeTab: '',
      loading: false,
      finished: false,
      orderList: [],
      salesAmount: 0, // 订单金额
      orderQuantity: 0, // 订单数量
      integral: 0 // 收益积分
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    })
  },
  mounted () {
    this.params.ownerOrderFlag = this.$route.query.ownerOrderFlag * 1
    this.getOrderDetailsList()
    this.queryStatisticsInfo()
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    changeTabs () {
      this.params.pageNo = 1
      this.loading = false
      this.finished = false
      this.orderList = []
      this.params.orderState = this.activeTab * 1
      this.queryStatisticsInfo()
      this.getOrderDetailsList()
    },
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        // 加载状态结束
        this.params.pageNo++
        this.getOrderDetailsList()
      }, 1000)
    },
    // 查询
    searchHandle () {
      this.params.pageNo = 1
      this.loading = false
      this.finished = false
      this.orderList = []
      this.queryStatisticsInfo()
      this.getOrderDetailsList()
    },
    // 统计信息
    queryStatisticsInfo () {
      const _this = this
      _this.$axios.post(api.distribution.orderStatistics, { orderState: this.params.orderState, ownerOrderFlag: this.params.ownerOrderFlag }).then((res) => {
        if (res.code === 200) {
          _this.salesAmount = res.data.totalPayAmount || 0
          _this.orderQuantity = res.data.count || 0
          _this.integral = res.data.totalProfit || 0
        }
      })
    },
    // 列表
    getOrderDetailsList () {
      const _this = this
      _this.$axios.post(api.distribution.orderdetail, _this.params).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            this.orderList = this.orderList.concat(res.data.rows) || []
            this.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            this.orderList = this.orderList.concat(res.data.rows) || []
            this.loading = false
          } else {
            this.orderList = this.orderList.concat(res.data.rows) || []
          }
        }
      })
    },
    orderStatus (state) {
      const that = this
      switch (state) {
        case 1:
          return that.$t('newOrder.state_1')
          // eslint-disable-next-line no-unreachable
          break
        case 2:
          return that.$t('newOrder.state_2')
          // eslint-disable-next-line no-unreachable
          break
        case 3:
          return that.$t('newOrder.state_3')
          // eslint-disable-next-line no-unreachable
          break
        case 4:
          return that.$t('order.bedeliver')
          // return that.$t('newOrder.state_4')
          // eslint-disable-next-line no-unreachable
          break
        case 5:
          return that.$t('order.confirmed')
          // eslint-disable-next-line no-unreachable
          break
        case 6:
          return that.$t('order.complete')
          // eslint-disable-next-line no-unreachable
          break
        case 7:
          return that.$t('newOrder.state_6')
          // eslint-disable-next-line no-unreachable
          break
        default:
          return that.$t('newOrder.state_7')
          // eslint-disable-next-line no-unreachable
          break
      }
    }
  }
}
</script>

<style scoped lang="less">
  .orderDetail {
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
    /deep/.van-tabs__wrap {
      height: 80px;
    }
    /deep/.van-tab__text {
      font-size: 28px;
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
      margin-top: 40px;
    }
    /deep/.van-cell__label {
      margin-top: 30px;
    }
    /deep/.van-cell {
      padding: 33px 36px;
    }
    /deep/.van-list__loading {
      margin-top: 35px;
    }
    .searchbox {
      width: 702px;
      margin: 0 auto;
      padding: 20px 0;
      position: relative;
      /deep/.van-field {
        display: flex;
        align-items: center;
        height: 60px;
        border-radius: 30px;
      }
      /deep/.van-icon-search {
        font-size: 35px;
      }
      /deep/.van-field__clear {
        font-size: 30px;
      }
    }
    .detail-info {
      height: 186px;
      display: flex;
      justify-content: space-around;
      background: #fff;
      margin-top: 20px;
      >div {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        p:nth-of-type(1) {
          font-size: 38px;
          color: #333333;
          font-weight: 700;
          span {
            font-size: 26px;
            color: #333333;
            font-weight: 600;
            margin-left: 5px;
          }
        }
        p:nth-of-type(2) {
          margin-top: 15px;
          img {
            width: 26px;
            height: 24px;
            vertical-align: middle;
          }
          span {
            font-size: 26px;
            color: #333;
            vertical-align: middle;
          }
        }
      }
    }
    .detail-list:not(:first-child) {
      margin-top: 65px;
    }
    .detail-list {
      height: 357px;
      background: #ffffff;
      margin-top: 20px;
      .extra {
        font-size: 26px;
        color: #FF5D19;
      }
      .left-title1 {
        display: inline-block;
        width: 100px;
        height: 36px;
        color: #EC602B;
        font-size: 22px;
        text-align: center;
        line-height: 36px;
        background: #FDF1ED;
        margin-right: 26px;
      }
      .left-title2, .right-title {
        font-size: 24px;
        color: #999999;
      }
      .right-title {
        color: #FF5D19;
        font-size: 24px;
      }
      .content {
        display: flex;
        /*justify-content: space-between;*/
        div:nth-of-type(1) {
          margin-right: 30px;
          img {
            width: 168px;
            height: 168px;
          }
        }
        div:nth-of-type(2) {
          display: flex;
          flex-flow: column;
          justify-content: space-around;
          p:nth-of-type(1) {
            font-size: 26px;
            color: #333333;
            font-weight: 600;
            line-height: 40px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }
          p:nth-of-type(2) {
            span:nth-of-type(1) {
              font-size: 24px;
              color: #333333;
            }
            span:nth-of-type(2) {
              font-size: 36px;
              color: #FF5D19;
              font-weight: 600;
            }
            span:nth-of-type(3) {
              font-size: 24px;
              color: #FF5D19;
            }
          }
          p:nth-of-type(3) {
            width: 408px;
            text-align: right;
            color: #333;
            font-size: 26px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
      .date-title {
        font-size: 24px;
        color: #999999;
      }
      .integrals {
        font-size: 24px;
        color: #333333;
      }
    }
  }
</style>
