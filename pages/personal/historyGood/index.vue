<template>
    <div class="historyGood">
        <van-nav-bar
            :title="$t('newUserInfo.viewRecode')"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="bodybox">
            <p>{{$t('newUserInfo.viewTips')}}</p>
            <div class="listbox">
                <div v-for="(item,index) in ListData" :key="index" class="itembox" @click="goGoodDetial(item)">
                    <img v-lazy="baseImageUrl + item.goodsSearchImage" />
                    <p>{{item.goodsTitle}}</p>
                    <div class="pricebox">
                        <span>
                            {{item.marketPrice}}
                        </span>
                        <span>
                            円
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'HistoryGood',
  layout: 'content',
  data () {
    return {
      ListData: [],
      pageNo: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  mounted () {
    this.getHistoryInfo()
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    getHistoryInfo () {
      const vm = this
      const _data = {
        pageNo: vm.pageNo,
        pageSize: vm.pageSize
      }
      vm.$axios({
        url: 'starday-goods/user/goods/history',
        method: 'get',
        params: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.ListData = res.data.rows
        }
      })
    },
    goGoodDetial (item) {
      // console.log('item---', item)
      this.$router.push('/product/' + item.goodsId)
    }
  }
}
</script>
<style lang="less" scoped>
    .historyGood{
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
            padding-left:24px;
            p{
              margin:30px 0;
              font-size:24px;
              color:#666;
            }
            .listbox{
                .itembox{
                    display:inline-block;
                    padding-bottom:30px;
                    margin:0 16px 20px 0;
                    background-color:#fff;
                    border-radius: 10px;
                    overflow: hidden;
                    img{
                        width:223px;
                        height:223px;
                    }
                    p{
                        width:202px;
                        margin:20px auto 10px;
                        color: #333333;
                        font-size:28px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .pricebox{
                        span:nth-of-type(1){
                            margin-left:12px;
                            color:#FF5D19;
                            font-size:40px;
                            font-weight:700;
                        }
                        span:nth-of-type(2){
                            color:#FF5D19;
                            font-size:22px;
                            font-weight:700;
                        }
                    }
                }
            }
        }
    }
</style>
