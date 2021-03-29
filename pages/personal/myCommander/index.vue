<template>
  <div class="distribution-contanier">
    <div class="header">
      <van-sticky>
        <van-nav-bar
          title=""
          placeholder
          left-arrow
          fixed
          border
          @click-left="onClickLeft"
        >
        </van-nav-bar>
      </van-sticky>
      <div class="info-content">
        <div class="headerimg">
          <img v-lazy="baseImageUrl + headImage" alt="" v-if="headImage">
          <img src="@/assets/images/distribution/defaultimg.png" alt="" v-else>
        </div>
        <div class="right">
          <p>
            <span>{{ username }}</span>
            <span class="span1">
              <img src="@/assets/images/distribution/jiangz1.png" alt="">
              <span>{{$t('distribution.leader')}}</span>
            </span>
          </p>
          <p>
            <span>{{$t('distribution.YQCode')}}：{{ QYCode }}</span>
            <span @click="copyQYCode">{{$t('distribution.copy')}}</span>
          </p>
        </div>
      </div>
    </div>
    <!--  店铺推荐-->
    <div class="store-recommend">
      <div class="recommend-header">
        <van-icon :name="require(`assets/images/user/zhuangshi.png`)" />
        <span>{{$t('distribution.recommendPro')}}</span>
        <van-icon :name="require(`assets/images/user/zhuangshi.png`)" />
      </div>
      <div v-if="reCommandList.length > 0">
        <van-list
          v-model="loading"
          :loading-text="$t('supply.loadding')"
          :finished="finished"
          :finished-text="$t('threeClass.finished')"
          @load="onLoad"
        >
          <div class="recommend-goodslist">
            <div v-for="(item,index) in reCommandList" :key="index" class="recommend-goods" @click="goDetail(item, 3)">
              <img v-lazy="baseImageUrl + item.goodsImage + '?x-oss-process=image/resize,w_1000/format,webp'" class="goods-img" />
              <p class="van-ellipsis goods-title">{{item.goodsTitle}}</p>
              <div class="price">
                <span class="price-origin">{{item.marketPrice}}</span>
              </div>
            </div>
          </div>
        </van-list>
      </div>
      <div v-else style="text-align:center;padding-top:100px;">
        <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
        <p style="font-size: 16px">{{$t('newUserInfo.error_msg1')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '~/static/api'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      params: {
        pageNo: 1,
        pageSize: 10,
        leader: '',
        type: ''
      },
      loading: true,
      finished: false,
      showShare: false,
      headImage: 0, // 头像
      QYCode: '', // 团长邀请码 团长专属字段
      username: '', // 用户名称
      reCommandList: []
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl',
      locale: 'locale',
      leaderId: 'leaderId'
    })
  },
  mounted () {
    this.queryMyCommander()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal/distributionCenter')
    },
    queryMyCommander () {
      const _this = this
      _this.$axios.post(api.distribution.myLeader).then((res) => {
        if (res.code === 200) {
          _this.headImage = res.data.headImage
          _this.QYCode = res.data.invitationCode
          _this.username = res.data.username
          this.params.leader = res.data.leaderId
          this.getPlatformRecom()
        }
      })
    },
    // 复制邀请码
    copyQYCode () {
      this.$copyText(this.QYCode).then((res) => {
        this.$toast.success(this.$t('home.copysuccess'))
      })
    },
    onLoad () {
      // 异步更新数据
      const _this = this
      setTimeout(() => {
        // 加载状态结束
        _this.params.pageNo++
        _this.getPlatformRecom()
      }, 1000)
    },
    // 平台推荐商品
    getPlatformRecom () {
      const _this = this
      _this.params.leader = this.leaderId
      _this.$axios.post(api.goods.platform, _this.params).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            _this.reCommandList = _this.reCommandList.concat(res.data.rows || [])
            _this.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            _this.reCommandList = _this.reCommandList.concat(res.data.rows || [])
            _this.loading = false
          } else {
            _this.reCommandList = _this.reCommandList.concat(res.data.rows || [])
          }
        }
      })
    },
    goDetail (item, fromFlag) {
      this.$router.push('/product/' + item.goodsId + '?fromFlag=' + fromFlag + '&storeUserId=' + this.leaderId + '&isFrom=1')
      window.sessionStorage.setItem('page', 'myCommander')
    }
  }
}
</script>

<style scoped lang="less">
  .distribution-contanier {
    /deep/.van-hairline--bottom::after {
      border-bottom-width: 0px;
    }
    height: 100vh;
    .header {
      width: 100%;
      height: 345px;
      background: url("../../../assets/images/distribution/beijing2.png") no-repeat;
      background-size: 100% 100%;
      position: relative;
      margin-bottom: 20px;
      /deep/.van-icon {
        color: #fff;
      }
      /deep/.van-nav-bar {
        height: 88px;
        background: #00A4FE;
      }
      /deep/.van-nav-bar__content {
        height: 88px;
        line-height: 88px;
      }
      .img:nth-of-type(1) {
        margin-right: 26px;
      }
      .img {
        width: 38px;
        height: 38px;
      }
      .info-content {
        display: flex;
        width: 100%;
        height: 96px;
        position: absolute;
        top: 150px;
        padding-left: 31px;
        .headerimg {
          width: 96px;
          height: 96px;
          background: #eeeeee;
          border-radius: 50%;
          margin-right: 21px;
          >img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
        .right {
          display: flex;
          flex-flow: column;
          justify-content: space-between;
          p {
            display: flex;
            align-items: center;
            span:nth-of-type(1) {
              color: #fff;
              margin-right: 20px;
            }
            span:nth-of-type(2) {
              display: inline-block;
            }
          }
          p:nth-of-type(1) {
            >span:nth-of-type(1) {
              font-size: 42px;
            }
            .span1 {
              background: linear-gradient(to bottom, #E94B57, #D42D29);
            }
            .span2 {
              background: linear-gradient(to bottom, #F3A06B, #EA5415);
            }
            .span3 {
              background: linear-gradient(to bottom, #CF37E8, #9809B1);
            }
            >span:nth-of-type(2) {
              height: 41px;
              border-radius: 20px;
              img {
                width: 41px;
                height: 41px;
                vertical-align: middle;
              }
              >span {
                font-size: 22px;
                vertical-align: middle;
              }
            }
          }
          p:nth-of-type(2) {
            margin-top: 15px;
            line-height: 16px;
            span:nth-of-type(1) {
              font-size: 26px;
            }
            span:nth-of-type(2) {
              height: 32px;
              color: #fff;
              font-size: 20px;
              text-align: center;
              line-height: 32px;
              padding-left: 15px;
              padding-right: 15px;
              border: 1px solid #fff;
              border-radius: 16px;
            }
          }
        }
      }
    }
    .store-recommend {
      width: 100%;
      padding-bottom: 98px;
      .recommend-header {
        width: 100%;
        height: 110px;
        display: flex;
        align-items: center;
        justify-content: center;
        /deep/.van-icon {
          font-size: 30px;
        }
        span {
          font-size: 32px;
          font-weight: 600;
          color: #333333;
          line-height: 45px;
          padding: 0 20px;
        }
      }
      .recommend-goodslist {
        width: 100%;
        padding: 0 20px;
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        .recommend-goods {
          width: 345px;
          height: 494px;
          display: flex;
          flex-flow: column nowrap;
          align-items: flex-start;
          justify-content: flex-start;
          background-color: #ffffff;
          margin-bottom: 20px;
          border-radius: 10px;
          position: relative;
          .seckillIcon {
            position: absolute;
            left: -10px;
            top: -6px;
            width: 150px;
            height: 50px;
            img {
              width: 150px;
              height: 50px;
            }
          }
          .goods-img {
            width: 345px;
            height: 345px;
            border-top-right-radius: 10px;
            border-top-left-radius: 10px;
          }
          .goods-title {
            font-size: 28px;
            font-weight: 400;
            text-align: left;
            color: #333333;
            line-height: 40px;
            padding: 20px;
            width: 100%;
          }
          .price {
            padding-left: 20px;
            .price-origin {
              font-size: 40px;
              font-weight: 700;
              color: #ff5d19;
              line-height: 47px;
            }
            .price-origin::after {
              content: '円';
              color: #ff5d19;
              font-size: 26px;
            }
          }
          .line-price {
            padding-left: 20px;
            text-decoration: line-through;
            color: #999999;
            .price-line {
              font-size: 22px;
              font-weight: 700;
              line-height: 47px;
            }
            .price-line::after {
              content: '円';
              font-size: 22px;
            }
          }
        }
      }
    }
  }
</style>
