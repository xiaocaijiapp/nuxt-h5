<template>
  <div class="storeHistory">
    <van-nav-bar
      :title="$t('distribution.storeHistory')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="bodybox">
      <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished-text="$t('threeClass.finished')" :finished="finished" @load="onLoad">
        <div class="itembox" v-for="(item, index) in storeList" :key="index" @click="goOtherStoreDetail(item)">
          <img v-lazy="item.headImage ? baseImageUrl + item.headImage : require('assets/images/distribution/defaultimg.png')" alt="">
          <div class="rightbox">
            <span class="storName">
              {{item.username}}
            </span>
            <div class="btnbox" v-if="item.myFavoriteStatus !== 0" @click.stop="attention(item.distributionStoreId, 0)">
              +{{$t('distribution.attention')}}
            </div>
            <div class="btnbox1" v-if="item.myFavoriteStatus === 0" @click.stop="attention(item.distributionStoreId, 1)">
              {{$t('distribution.attentioned')}}
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'storeHistory',
  layout: 'content',
  data () {
    return {
      loading: true,
      finished: false,
      pageNo: 1,
      pageSize: 10,
      storeList: []
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  mounted () {
    this.getList()
  },
  methods: {
    attention (id, myFavoriteStatus) {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/distribute/store/favorite/' + id + '/' + myFavoriteStatus,
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          vm.storeList = []
          vm.getList()
        }
      })
    },
    getList () {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/distribute/store/browsing/history/' + vm.pageSize + '/' + vm.pageNo,
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            vm.storeList = vm.storeList.concat(res.data.rows)
            vm.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            vm.storeList = vm.storeList.concat(res.data.rows)
            vm.loading = false
          } else {
            vm.storeList = vm.storeList.concat(res.data.rows)
          }
        }
      })
    },
    onLoad () {
      const that = this
      if (this.loading) {
        setTimeout(() => {
          // 加载状态结束
          that.pageNo++
          that.getList()
        }, 1000)
      }
    },
    onClickLeft () {
      this.$router.push('/personal/distributionCenter')
    },
    // 跳转对应店铺
    goOtherStoreDetail (item) {
      this.$router.push('/personal/shareDistributionCenter?id=' + item.distributionStoreId + '&isHistory=1')
    }
  }
}
</script>
<style lang="less" scoped>
  .storeHistory{
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
            padding: 17px 42px;
            background: linear-gradient(270deg,#ff5e1a, #ffa14b);
            border-radius: 29px;
            font-size: 24px;
            color: #ffffff;
            text-align: center;
          }
          .btnbox1{
            padding: 17px 42px;
            background-color: #ccc;
            border-radius: 29px;
            font-size: 24px;
            color: #ffffff;
            text-align: center;
          }
        }
      }
    }
  }
</style>
