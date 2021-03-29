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
          <template #right>
            <img src="@/assets/images/distribution/share.png" class="img" @click="showShare = true"/>
            <img src="@/assets/images/distribution/doubt.png" class="img" @click="$router.push('/personal/memberRule')">
          </template>
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
            <!--团长-->
            <span class="span1" v-if="distributionRole===2">
              <img src="@/assets/images/distribution/jiangz1.png" alt="">
              <span>{{$t('distribution.leader')}}</span>
            </span>
            <!--团员-->
            <span class="span2" v-if="distributionRole===1">
              <img src="@/assets/images/distribution/jiangz2.png" alt="">
              <span>{{$t('distribution.member')}}</span>
            </span>
            <!--会员-->
            <span class="span3" v-if="distributionRole===0">
              <img src="@/assets/images/distribution/jiangz3.png" alt="">
              <span>{{$t('distribution.commonMember')}}</span>
            </span>
          </p>
          <!--团长-->
          <p v-if="distributionRole===2">
            <span>{{$t('distribution.YQCode')}}：{{ QYCode }}</span>
            <span @click="copyQYCode">{{$t('distribution.copy')}}</span>
          </p>
          <!--团员-->
          <p v-if="distributionRole===0 || distributionRole===1">
            <span>{{$t('distribution.applyLeader')}}</span>
            <span @click="$router.push('/personal/applyLeader')">{{$t('distribution.toApply')}}</span>
          </p>
        </div>
      </div>
      <div class="itemsnum">
        <div @click="$router.push('/personal/orderdetails?ownerOrderFlag=0')">
          <p>{{ myselfCount }}</p>
          <p>{{$t('distribution.ownOrder')}}</p>
        </div>
        <div @click="$router.push('/personal/orderdetails?ownerOrderFlag=1')">
          <p>{{ shareCount }}</p>
          <p>{{$t('distribution.shareOrder')}}</p>
        </div>
        <div @click="$router.push('/personal/myMember')" v-if="distributionRole===2">
          <p>{{ memberNum }}</p>
          <p>{{$t('distribution.myMember')}}</p>
        </div>
        <div @click="$router.push('/personal/memberLike')">
          <p>{{ favoriteNum }}</p>
          <p>{{$t('distribution.attention')}}</p>
        </div>
      </div>
      <div class="itemscontent">
        <div @click="$router.push('/personal/chooseProductLibrary')">
          <p>
            <img src="@/assets/images/distribution/xuanpin.png" alt="">
          </p>
          <p>{{$t('distribution.chooseProLibrary')}}</p>
        </div>
        <div @click="$router.push('/personal/productLibrary')">
          <p>
            <img src="@/assets/images/distribution/chanpin.png" alt="">
          </p>
          <p>{{$t('distribution.productLibrary')}}</p>
        </div>
        <div @click="$router.push('/headshare')" v-if="distributionRole===2">
          <p>
            <img src="@/assets/images/distribution/yaoqing.png" alt="">
          </p>
          <p>{{$t('distribution.YQFriend')}}</p>
        </div>
        <!-- 团员展示 -->
        <div @click="$router.push('/personal/myCommander')" v-if="distributionRole===1">
          <p>
            <img src="@/assets/images/distribution/teammember.png" alt="">
          </p>
          <p>{{$t('distribution.myLeader')}}</p>
        </div>
        <!-- 会员展示 -->
        <div @click="$router.push('/personal/becomeMember')" v-if="distributionRole===0">
          <p>
            <img src="@/assets/images/distribution/tomemeber.png" alt="">
          </p>
          <p>{{$t('distribution.becomeMember')}}</p>
        </div>
        <div @click="$router.push('/personal/storeHistory')">
          <p>
            <img src="@/assets/images/distribution/history.png" alt="">
          </p>
          <p>{{$t('distribution.history')}}</p>
        </div>
      </div>
      </div>
    <!--  店铺推荐-->
    <div class="store-recommend">
      <div class="recommend-header">
        <van-icon :name="require(`assets/images/user/zhuangshi.png`)" />
        <span>{{$t('distribution.guessLike')}}</span>
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
            <div v-for="(item,index) in reCommandList" :key="index" class="recommend-goods" @click="goDetail(item, 1)">
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
    <!--    分享-->
    <van-share-sheet v-model="showShare" :description="$t('share.shareDescription')" :options="shareOptions" @select="handleShareOption">
      <span slot="title">{{$t('share.friends')}}</span>
    </van-share-sheet>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '@/static/api'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      params: {
        pageNo: 1,
        pageSize: 10,
        leader: '',
        type: 0,
        sortOrder: 'desc',
        sorted: 7
      },
      loading: true,
      finished: false,
      showShare: false,
      distributionRole: 0, // 会员分销角色 0:会员 1:团员 2:团长 默认0
      favoriteNum: 0, // 关注小店数目
      headImage: 0, // 头像
      QYCode: '', // 团长邀请码 团长专属字段
      leaderId: '', // 团长id 团员专属字段
      memberNum: '', // 团员数目 团长专属字段
      username: '', // 会员用户名称
      myselfCount: 0, // 自购订单数量
      shareCount: 0, // 分享订单数量
      shareOptions: [
        {
          name: 'line',
          icon: require('~/assets/images/icon/share-line.png'),
          className: 'share-icon-desc'
        },
        {
          name: this.$t('share.link'),
          icon: require('~/assets/images/icon/share-lianjie.png'),
          className: 'share-icon-desc'
        }
      ],
      reCommandList: []
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl',
      locale: 'locale',
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.queryDistributionCenter()
    this.queryRecommendGoods()
    this.queryMyselfCount()
    this.queryShareCount()
  },
  methods: {
    ...mapMutations(['setLeaderId', 'setQYCode']),
    onClickLeft () {
      this.$router.push('/personal')
    },
    // 基本信息
    queryDistributionCenter () {
      const _this = this
      _this.$axios.post(api.distribution.myDistributionCenter).then((res) => {
        if (res.code === 200) {
          _this.distributionRole = res.data.distributionRole
          _this.favoriteNum = res.data.favoriteNum || 0
          _this.headImage = res.data.headImage
          _this.QYCode = res.data.invitationCode
          _this.leaderId = res.data.leaderId
          _this.memberNum = res.data.memberNum || 0
          _this.username = res.data.username
          _this.setLeaderId(_this.leaderId)
          _this.setQYCode(_this.QYCode)
        }
      })
    },
    // 自购订单统计信息
    queryMyselfCount () {
      const _this = this
      _this.$axios.post(api.distribution.orderStatistics, { orderState: 0, ownerOrderFlag: 0 }).then((res) => {
        if (res.code === 200) {
          this.myselfCount = res.data.count
        }
      })
    },
    // 分享订单统计信息
    queryShareCount () {
      const _this = this
      _this.$axios.post(api.distribution.orderStatistics, { orderState: 0, ownerOrderFlag: 1 }).then((res) => {
        if (res.code === 200) {
          _this.shareCount = res.data.count
        }
      })
    },
    handleShareOption (option, index) {
      const url = encodeURIComponent('https:m.starday.jp')
      switch (index) {
        case 0:
          location.href = `https://social-plugins.line.me/lineit/share?url=${url}`
          this.showShare = false
          break
        case 1:
          this.copyLink()
          this.showShare = false
          break
      }
    },
    // 复制邀请码
    copyQYCode () {
      this.$copyText(this.QYCode).then((res) => {
        this.$toast.success(this.$t('home.copysuccess'))
      })
    },
    // 复制链接
    copyLink () {
      const _this = this
      const _url = location.origin + '/personal/shareDistributionCenter?id=' + _this.userInfo.id + '&isCopy=1'
      _this.$copyText(_url).then(
        function (e) {
          _this.$toast.success(_this.$t('home.copysuccess'))
        },
        function (e) {
          _this.$toast.fail(_this.$t('home.copyerror'))
        }
      )
    },
    onLoad () {
      // 异步更新数据
      const _this = this
      setTimeout(() => {
        // 加载状态结束
        _this.params.pageNo++
        _this.queryRecommendGoods()
      }, 1000)
    },
    // 平台推荐商品
    queryRecommendGoods () {
      const _this = this
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
      this.$router.push('/product/' + item.goodsId + '?fromFlag=' + fromFlag + '&storeUserId=' + this.userInfo.id + '&isFrom=1')
      window.sessionStorage.setItem('page', 'distributionCenter')
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
      height: 536px;
      background: url("../../../assets/images/distribution/beijing.png") no-repeat;
      background-size: 100% 100%;
      position: relative;
      margin-bottom: 70px;
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
    .itemsnum, .itemscontent {
      display: flex;
      justify-content: space-around;
    }
    .itemsnum{
      margin-top: 210px;
      margin-bottom: 50px;
      >div {
        p {
          text-align: center;
          color: #fff;
        }
        p:nth-of-type(1) {
          font-size: 42px;
          font-weight: bold;
        }
        p:nth-of-type(2) {
          font-size: 24px;
          margin-top: 10px;
        }
      }
    }
    .itemscontent {
      width: 690px;
      height: 180px;
      align-items: center;
      border-radius: 10px;
      background: #fff;
      margin: 0 auto;
      >div {
        text-align: center;
        p:nth-of-type(1) {
          img {
            width: 54px;
            height: 54px;
          }
        }
        p:nth-of-type(2) {
          text-align: center;
          color: #333;
          font-size: 24px;
          margin-top: 10px;
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
