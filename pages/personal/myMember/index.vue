<template>
    <div class="myMember">
        <van-nav-bar
            :title="$t('distribution.myMember')"
            left-arrow
            @click-left="onClickLeft"
        />

        <div class="bodybox">
            <div class="searchbox">
                <img src="@/assets/images/store/search.png" alt="" @click="search">
                <input type="text" v-model="memberName" :placeholder="$t('distribution.plaIntMemberName')" @keyup.enter="search"/>
            </div>
            <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished-text="$t('threeClass.finished')" :finished="finished" @load="onLoad">
                <div class="itembox" v-for="(item, index) in memberList" :key="index">
                    <img v-lazy="item.headImage ? baseImageUrl + item.headImage : require('assets/images/distribution/defaultimg.png')" alt="">
                    <div class="rightbox">
                        <div class="topbox">
                            <div class="namebox">
                                <span>
                                    {{item.username}}
                                </span>
                                <span>
                                    ({{$t('distribution.piece').replace('N', (item.distributionOrderNum || 0))}})
                                </span>
                            </div>
                            <div class="integralbox">
                              {{$t('distribution.integral').replace('N', (item.distributionIntegral || 0))}}
                            </div>
                        </div>
                        <div class="footbox">
                            <span>
                                {{item.account}}
                            </span>
                            <span>
                                {{item.createTime}}
                            </span>
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
  name: 'myMember',
  layout: 'content',
  data () {
    return {
      loading: true,
      finished: false,
      searchVal: '',
      memberName: '',
      memberList: [],
      pageNo: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  mounted () {
    this.getList()
  },
  methods: {
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
    search () {
      this.memberList = []
      this.getList()
    },
    getList () {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/distribute/myMembers/' + vm.pageSize + '/' + vm.pageNo + (vm.memberName ? '?username=' + vm.memberName : ''),
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            vm.memberList = vm.memberList.concat(res.data.rows)
            vm.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            vm.memberList = vm.memberList.concat(res.data.rows)
            vm.loading = false
          } else {
            vm.memberList = vm.memberList.concat(res.data.rows)
          }
        }
      })
    },
    onClickLeft () {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.myMember{
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
        padding:0 24px;
        .searchbox{
            display: flex;
            justify-content: flex-start;
            align-items: center;
            width: 100%;
            height: 60px;
            margin-top:20px;
            padding: 0 20px;
            border-radius: 30px;
            background-color: #fff;
            img{
                width: 28px;
                height: 28px;
                margin-right: 20px;
            }
            input{
                width: 100%;
                border: none;
                outline: none;
                font-size: 30px;
                background-color: #fff;
            }
        }
        .itembox{
            display: flex;
            justify-content: flex-start;
            // align-items: center;
            width: 100%;
            padding: 30px;
            margin-top: 20px;
            background-color: #fff;
            border-radius: 16px;
            img{
                width: 100px;
                height: 100px;
                margin-right: 24px;
            }
            .rightbox{
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 8px 0;
                .topbox,.footbox{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .topbox{
                    .namebox{
                        span:nth-of-type(1){
                            font-size: 32px;
                            color: #333333;
                        }
                        span:nth-of-type(2){
                            font-size: 28px;
                            color: #666;
                        }
                    }
                    .integralbox{
                        font-size: 28px;
                        color: #ff5d19;
                    }
                }
                .footbox{
                    font-size: 28px;
                    color: #999999;
                }
            }
        }
    }
}
</style>
