<!---->
<template>
  <div>
    <van-nav-bar
      :title="$t('newOrder.expressInfo')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>

    <div class="logistics_info">
      <div class="header">
        <van-image width="70" height="70" v-lazy="baseImageUrl + imgurl" />
        <div class="desc">
          <div>{{$t('newOrder.logisticscompany')}}{{expressAllInfo.expressName}}</div>
          <div>{{$t('newOrder.couriernumber')}}{{expressAllInfo.expressNumber}}</div>
        </div>
      </div>
      <div class="adress">
        {{$t('newOrder.Shippingaddress')}}{{consignee.address + consignee.deliveryAddress}}
      </div>
    </div>
    <div class="logistics_desc">
      <div class="logistics_left">
        <div
          v-for="(item,index) in expressAllInfo.trackinfo"
          :key="index"
          class="left"
        >
          <span>{{item.date.split(' ')[0]}}</span>
          <span class="hms">{{item.date.split(' ')[1]}}</span>
          <van-icon
            v-if="index>0"
            class="dian"
            size="10"
            :name="require('assets/images/icon/dian.png')"
          />
          <van-icon
            v-else
            class="timedian"
            size="20"
            :name="require('assets/images/icon/timedian.png')"
          />
        </div>
      </div>
      <div class="time_line"></div>
      <div class="desc">
        <div
          v-for="desc in expressAllInfo.trackinfo"
          :key="desc.date"
          class="text"
        >{{desc.statusDescription+' '}}{{desc.details}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'static/api'
import { mapGetters } from 'vuex'
export default {
  layout: 'content',
  components: {},
  data () {
    return {
      expressAllInfo: {},
      imgurl: '',
      consignee: {}
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    })
  },
  mounted () {
    this.queryLogisticsInfo()
  },
  methods: {
    queryLogisticsInfo () {
      const _this = this
      _this.$axios.get(api.order.logisticsInfo + _this.$route.query.orderNumber).then((res) => {
        if (res.code === 200) {
          _this.expressAllInfo = res.data || {}
          _this.consignee = res.data.consignee || {}
          _this.imgurl = _this.$route.query.img
        }
      })
    },
    onClickLeft () {
      window.history.back(-1)
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
  .item {
    width: 100%;
    box-sizing: border-box;
    padding: 30px;
    background: #fff;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
  }
  .right {
    padding: 20px;
  }
  .right div:first-child {
    font-size: 28px;
    font-weight: 400;
    text-align: left;
    color: #333333;
  }
  .right div:nth-child(2) {
    font-size: 24px;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 52px;
  }
  .right div:nth-child(3) {
    font-size: 28px;
    margin-top: 20px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 40px;
  }
  .logistics_info {
    width: 100%;
    box-sizing: border-box;
    padding: 30px;
    min-height: 140px;
    background-color: #fff;
    margin-top: 20px;
    .header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 28px;
      font-weight: 400;
      text-align: left;
      color: #333333;
      .desc {
        height: 140px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin-left: 20px;
      }
      padding-bottom: 16px;
    }
    .adress {
      font-size: 28px;
      font-weight: 400;
      text-align: left;
      color: #333333;
      border-top: 1px solid #E5E5E5;
      padding-top: 20px;
    }
  }
  .logistics_desc {
    width: 100%;
    box-sizing: border-box;
    padding: 30px;
    background: #fff;
    min-height: 400px;
    display: flex;
    justify-content: flex-start;
    .time_line {
      border-left: 1px dashed #e5e5e5;
      margin-left: 20px;
    }
    .desc {
      margin-top: 30px;
      margin-left: 30px;
      font-size: 24px;
      font-weight: 400;
      text-align: left;
      color: #333333;
      line-height: 32px;
      margin-left: 40px;
      .text {
        min-height: 92px;
      }
    }
    .logistics_left {
      width: 30%;
      box-sizing: border-box;
      padding-left: 30px;
    }
    .left {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 30px;
      justify-content: center;
      position: relative;
      .dian {
        position: absolute;
        right: -32px;
        top: 0px;
      }
      .timedian {
        position: absolute;
        right: -40px;
        top: 0px;
      }
      span:first-child {
        font-size: 24px;
        min-width: 100px;
        font-weight: 400;
        text-align: left;
        color: #333333;

      }
      .hms {
        width: 100%;
        font-size: 20px;
        min-width: 100px;
        margin-top: 10px;
        font-weight: 400;
        text-align: left;
        color: #999999;
        line-height: 28px;
        margin-left: 30px;
      }
    }
  }
</style>
