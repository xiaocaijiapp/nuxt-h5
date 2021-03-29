<template>
    <div class="attentiongoods">
        <div class="backicon" @click="onClickLeft">
            <van-icon name="arrow-left" size="22px" color="#666666" />
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
            <van-tab :title="$t('newUserInfo.goods')">
                <div class="content" v-if="goodsList.length > 0">
                    <div v-for="(item, index) in goodsList" :key="index" class="itembox">
                        <div class="firstBox">
                            <img v-lazy="baseImageUrl + item.goodsSearchImage"/>
                        </div>
                        <div class="twoBox">
                            <p>
                                {{item.goodsTitle}}
                            </p>
                            <div class="footbox">
                                <div class="leftbox">
                                    <span>
                                        {{item.marketPrice}}
                                    </span>
                                    <span>
                                        円
                                    </span>
                                </div>
                                <div class="rightbox" @click="goGoodDetial(item.id)">
                                    {{$t('goodsdetail.nowpay')}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else style="text-align:center;height:100vh;padding-top:200px;background-color:#fff;">
                    <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
                    <p>{{$t('newUserInfo.error_msg1')}}</p>
                </div>
            </van-tab>
            <van-tab :title="$t('newUserInfo.store')">
                <div class="storeBox" v-if="storeList.length > 0">
                    <div v-for="(item,index) in storeList" :key="index" class="itemStore">
                        <div class="firstItem">
                            <img v-if="item.logo" v-lazy="baseImageUrl + item.logo" />
                            <img v-else src="@/assets/images/icon/starday.png" />
                            <span>{{item.storeName}}</span>
                        </div>
                        <div class="twoItem" @click="goStore(item.id)">
                            {{$t('search.searchStore')}}
                        </div>
                    </div>
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
  name: 'Attentiongoods',
  layout: 'content',
  data () {
    return {
      activeTab: 0,
      goodsList: [],
      storeList: [],
      pageNo: 1,
      pageSize: 10,
      userId: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'baseImageUrl'])
  },
  mounted () {
    this.userId = this.userInfo.id
    this.getLikeGoodList()
    this.getLikeStoreList()
  },
  methods: {
    // 获取关注的商品
    getLikeGoodList () {
      const vm = this
      const _data = {
        pageNo: vm.pageNo,
        pageSize: vm.pageSize,
        userId: vm.userId
      }
      vm.$axios({
        url: 'starday-goods/user/goods_collection/list/v1',
        method: 'post',
        data: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.goodsList = res.data.rows
        }
      })
    },
    getLikeStoreList () {
      const vm = this
      const _data = {
        pageNo: vm.pageNo,
        pageSize: vm.pageSize,
        userId: vm.userId
      }
      vm.$axios({
        url: 'starday-goods/user/store_collection/list/v1',
        method: 'post',
        data: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.storeList = res.data.rows
        }
      })
    },
    onClickLeft () {
      window.history.go(-1)
    },
    changeTabs (name) {
    },
    goGoodDetial (id) {
      this.$router.push('/product/' + id)
    },
    goStore (id) {
      this.$router.push('/store/' + id)
    }
  }
}
</script>
<style lang="less" scoped>
.attentiongoods{
  position: relative;
    .van-icon-arrow-left {
        color: #999;
    }
    .backicon {
        position: absolute;
        top: 22px;
        left: 15px;
        z-index: 9999;
    }
    /deep/.van-tabs__wrap{
        height:88px;
    }
    /deep/.van-tab__text--ellipsis{
        line-height: 88px;
    }
    .content{
        height:100%;
        padding:0 24px;
        background-color:#fff;
        .itembox{
            display:flex;
            justify-content: flex-start;
            padding:20px 0;
            border-bottom:1px solid #e5e5e5;
            .firstBox{
                img{
                    width:219px;
                    height:219px;
                }
            }
            .twoBox{
                flex:1;
                display:flex;
                flex-direction: column;
                justify-content: space-between;
                margin-left:20px;
                >p{
                    font-size:28px;
                    color:#333;
                    // height:60px;
                    // white-space: nowrap;
                    // overflow: hidden;
                    // text-overflow: ellipsis;
                }
                .footbox{
                    display:flex;
                    justify-content: space-between;
                    align-items:center;
                    .leftbox{
                        span:nth-of-type(1){
                            font-size:40px;
                            font-weight:700;
                            color:#FF5D19;
                        }
                        span:nth-of-type(2){
                            font-size:22px;
                            font-weight:700;
                            color:#FF5D19;
                        }
                    }
                    .rightbox{
                        padding:12px 32px;
                        color:#FF5D19;
                        font-size:22px;
                        border: 2px solid #ff5d19;
                        border-radius: 30px;
                    }
                }
            }
        }
    }
    .storeBox{
        height:100vh;
        padding:0 24px;
        background-color:#fff;
        .itemStore{
            display:flex;
            justify-content: space-between;
            align-items:center;
            padding:20px 0;
            border-bottom:1px solid #e5e5e5;
            .firstItem{
                img{
                    width:96px;
                    height:96px;
                    vertical-align: middle;
                    margin-right:20px;
                }
                span{
                    display:inline-block;
                    width:400px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
            .twoItem{
                padding:10px 32px;
                border: 2px solid #ff5d19;
                border-radius: 30px;
                color: #ff5d19;
                font-size:24px;
            }
        }
    }
}
</style>
