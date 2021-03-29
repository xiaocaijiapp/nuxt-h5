<template>
  <div class="memberLike">
    <van-nav-bar
      :title="$t('distribution.attention')"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-tabs
      v-model="activeTab"
      swipeable
      animated
      color="#FF5D19"
      title-active-color="#FF5D19"
      line-width="20px"
      line-height="3px"
      @click="changeTabs"
    >
      <van-tab :title="$t('distribution.IfocusOn')">
        <div class="bodybox">
          <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished-text="$t('threeClass.finished')" :finished="finished" @load="onLoad">
            <div class="itembox" v-for="(item, index) in myLikeList" :key="index" @click="goOtherStoreDetail(item)">
              <img v-lazy="item.headImage ? baseImageUrl + item.headImage : require('assets/images/distribution/defaultimg.png')" alt="">
              <div class="rightbox">
                <span class="storName">
                  {{item.username}}
                </span>
                <div class="btnbox" @click.stop="celcerLike(item.distributionStoreId)">
                  {{$t('distribution.cancel')}}
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
      <van-tab :title="$t('distribution.attentionToMy')">
        <div class="bodybox">
          <van-list v-model="loading1" :loading-text="$t('supply.loadding')" :finished-text="$t('threeClass.finished')" :finished="finished1" @load="onLoad1">
            <div class="itembox" v-for="(item, index) in likeMeList" :key="index" @click="goOtherStoreDetail(item)">
              <img v-lazy="item.headImage ? baseImageUrl + item.headImage : require('assets/images/distribution/defaultimg.png')" alt="">
              <div class="rightbox">
                <span class="storName">
                  {{item.username}}
                </span>
                <div class="btnbox" v-if="item.myFavoriteStatus !== 0" @click.stop="attention(item.distributionStoreId)">
                  +{{$t('distribution.attention')}}
                </div>
                <div class="btnbox1" v-if="item.myFavoriteStatus === 0" @click.stop="celcerLike(item.distributionStoreId)">
                  {{$t('distribution.attentioned')}}
                </div>
              </div>
            </div>
          </van-list>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'memberLike',
  layout: 'content',
  data () {
    return {
      activeTab: '',
      myLikeList: [],
      likeMeList: [],
      pageSize: 10,
      pageNo1: 1,
      pageNo2: 1,
      loading: true,
      finished: false,
      loading1: true,
      finished1: false
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  mounted () {
    this.getMyLikeList()
    this.getLikeMeList()
  },
  methods: {
    onLoad () {
      const that = this
      if (this.loading) {
        setTimeout(() => {
          // 加载状态结束
          that.pageNo1++
          that.getMyLikeList()
        }, 1000)
      }
    },
    onLoad1 () {
      const that = this
      if (this.loading1) {
        setTimeout(() => {
          // 加载状态结束
          that.pageNo2++
          that.getLikeMeList()
        }, 1000)
      }
    },
    attention (id) {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/distribute/store/favorite/' + id + '/0',
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          vm.likeMeList = []
          vm.getMyLikeList()
          vm.getLikeMeList()
        }
      })
    },
    celcerLike (id) {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/distribute/store/favorite/' + id + '/1',
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          vm.myLikeList = []
          vm.likeMeList = []
          vm.getMyLikeList()
          vm.getLikeMeList()
        }
      })
    },
    getLikeMeList () {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/distribute/store/favorite/me/' + vm.pageSize + '/' + vm.pageNo2,
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            vm.likeMeList = vm.likeMeList.concat(res.data.rows)
            vm.finished1 = true
          } else if (res.data.rows.length === res.data.pageSize) {
            vm.likeMeList = vm.likeMeList.concat(res.data.rows)
            vm.loading1 = false
          } else {
            vm.likeMeList = vm.likeMeList.concat(res.data.rows)
          }
        }
      })
    },
    getMyLikeList () {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/distribute/store/my/favorite/' + vm.pageSize + '/' + vm.pageNo1,
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            vm.myLikeList = vm.myLikeList.concat(res.data.rows)
            vm.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            vm.myLikeList = vm.myLikeList.concat(res.data.rows)
            vm.loading = false
          } else {
            vm.myLikeList = vm.myLikeList.concat(res.data.rows)
          }
        }
      })
    },
    onClickLeft () {
      this.$router.back()
    },
    changeTabs () {
    },
    // 跳转对应店铺
    goOtherStoreDetail (item) {
      this.$router.push('/personal/shareDistributionCenter?id=' + item.distributionStoreId)
    }
  }
}
</script>
<style lang="less" scoped>
  .memberLike {
    .van-nav-bar{
      height:88px;
    }
    /deep/.van-nav-bar__content{
      height:100%;
    }
    /deep/.van-nav-bar__title{
      height:100%;
      line-height:88px;
      font-size:36px;
      color: #323233;
      font-weight: 500;
    }
    /deep/.van-tabs__wrap {
      height: 80px;
    }
    /deep/.van-tab__text {
      font-size: 34px;
      line-height: 48px;
    }
    .bodybox{
      padding: 0 24px;
      .itembox{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        margin-top: 20px;
        padding: 30px;
        background: #ffffff;
        border-radius: 16px;
        img{
          width: 100px;
          height: 100px;
          margin-right: 24px;
        }
        .rightbox{
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .storName{
            width: 360px;
            line-height: 44px;
            font-size: 32px;
            color: #333333;
          }
          .btnbox{
            height: 52px;
            padding: 0 40px;
            background: linear-gradient(270deg,#ff5e1a, #ffa14b);
            border-radius: 26px;
            font-size: 24px;
            color: #ffffff;
            text-align: center;
            line-height: 52px;
          }
          .btnbox1{
            height: 52px;
            padding: 0 40px;
            background-color: #d8d8d8;
            border-radius: 26px;
            font-size: 24px;
            color: #ffffff;
            text-align: center;
            line-height: 52px;
          }
        }
      }
    }
  }
</style>
