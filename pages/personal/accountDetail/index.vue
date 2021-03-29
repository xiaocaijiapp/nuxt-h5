<template>
    <div class="accountDetail">
        <van-nav-bar left-arrow @click-left="onClickLeft">
            <template #right>
                <span @click="goHistory" class="right-title" style="color: #333333;font-size: 13px;">{{$t('newThreeClass.withDrawRecording')}}</span>
            </template>
            <template #title>
                <div class="msg">{{$t('newThreeClass.acountDet')}}</div>
            </template>
        </van-nav-bar>
        <div class="promptbox">
            <span v-if="difference > 0">
                <!-- 还差{{difference}}积分就可以提现啦，快去分享赚积分 -->
                {{$t('newThreeClass.lessM').replace('M', difference)}}
            </span>
            <span v-else>
                {{$t('newThreeClass.canWithdraw')}}
            </span>
            <van-icon name="question-o" class="icon" @click="goRules"/>
        </div>

        <div class="withbox">
            <div class="firstbox">
                <div class="itembox">
                    <div class="headbox">
                        {{accountInfo.integral || 0}}
                    </div>
                    <div class="bodybox">
                        <img src="@/assets/images/default/account.png"/>
                        <span>{{$t('newThreeClass.totalAcount')}}</span>
                    </div>
                </div>
                <div class="itembox">
                    <div class="headbox">
                        {{accountInfo.availableCashIntegral || 0}}
                    </div>
                    <div class="bodybox">
                        <img src="@/assets/images/default/account.png"/>
                        <span>{{$t('newThreeClass.canWithAcount')}}</span>
                    </div>
                </div>
                <div class="itembox">
                    <div class="headbox">
                        {{accountInfo.freezeIntegral || 0}}
                    </div>
                    <div class="bodybox">
                        <img src="@/assets/images/default/account.png"/>
                        <span>{{$t('newThreeClass.freezeAcount')}}</span>
                    </div>
                </div>
            </div>
            <div class="twobox">
                <div v-if="!difference" class="activebtn" @click="goWithPage">
                    {{$t('newThreeClass.withBtn')}}
                </div>
                <div v-else class="activebtn1">
                    {{$t('newThreeClass.withBtn')}}
                </div>
            </div>
        </div>
        <div class="content">
            <p>
                {{$t('newThreeClass.acountList')}}
            </p>
            <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished-text="$t('threeClass.finished')" :finished="finished" @load="onLoad">
                <div v-for="(item, index) in detailList" :key="index" class="listbox">
                    <div class="titlebox">
                        <span>
                            {{locale === 'zh-CN' ? item.des.split('|')[0] : item.des.split('|')[1]}}
                        </span>
                        <span>
                            {{(item.preIntegral - item.curIntegral) > 0 ? '-' + item.integralNum : '+' + item.integralNum}}
                        </span>
                    </div>
                    <div class="timebox">
                        {{item.createTime}}
                    </div>

                    <div class="footbox">
                        <div>
                          <span v-if="item.detailType === 3 || item.detailType === 4">
                            {{$t('newOrder.number')}}{{item.businessNo}}
                          </span>
                        </div>
                        <div>
                          <span v-if="item.freezeStatus === 1">
                            {{$t('newThreeClass.freezeIng')}}
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
  name: 'accountDetail',
  layout: 'content',
  data () {
    return {
      detailList: [],
      accountInfo: {},
      difference: 0,
      pageNo: 0,
      pageSize: 10,
      loading: false,
      finished: false,
      timer: null,
      bankList: []
    }
  },
  mounted () {
    this.getAccount()
    // this.getBankList()
  },
  computed: {
    ...mapGetters({
      locale: 'locale'
    })
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal')
    },
    // getBankList () {
    //   const vm = this
    //   vm.$axios({
    //     url: 'starday-user/user/bankCard/listAll',
    //     method: 'get'
    //   }).then((res) => {
    //     if (res.code === 200) {
    //     //   console.log('res-===', res)
    //       vm.bankList = res.data
    //     }
    //   })
    // },
    goHistory () {
      this.$router.push('/personal/withdrawHistory')
    },
    goWithPage () {
      // if (this.bankList.length > 0) {
      //   this.$router.push('/personal/withdraw')
      // } else {
      //   this.$router.push('/personal/bankCardInfo')
      // }
      this.$router.push('/couponcenter')
    },
    onLoad () {
      const that = this
      if (this.loading) {
        this.timer = setTimeout(() => {
          // 加载状态结束
          that.pageNo++
          that.getListInfo()
        }, 1000)
      }
    },
    goRules () {
      this.$router.push('/personal/pointsRules')
    },
    getListInfo () {
      const vm = this
      vm.$axios({
        url: 'starday-integral/integral/detail/userId/list/' + vm.pageSize + '/' + vm.pageNo,
        method: 'post',
        data: {}
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            vm.detailList = vm.detailList.concat(res.data.rows)
            vm.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            vm.detailList = vm.detailList.concat(res.data.rows)
            vm.loading = false
          } else {
            vm.detailList = vm.detailList.concat(res.data.rows)
          }
        }
      })
    },
    // 系统字典获取还差多少积分可提现
    getLess () {
      const vm = this
      const _data = {
        code: 'INTEGRAL_WITHDRAWAL_LOWEST_LIMIT',
        groupCode: 'INTEGRAL_SETTING'
      }
      vm.$axios({
        url: 'starday-system/dict/getValue',
        method: 'get',
        params: _data
      }).then((res) => {
        if (res.code === 200) {
          console.log('res.data---', res.data)
          vm.getDifference(res.data, vm.accountInfo.availableCashIntegral)
        }
      })
    },
    // 计算差值
    getDifference (num1, num2) {
      if (num2 >= num1) {
        this.difference = 0
      } else {
        this.difference = -(num2 - num1)
        console.log('this.difference---', this.difference)
      }
    },
    // 获取积分
    getAccount () {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/myInfo',
        method: 'get'
      }).then((res) => {
        if (res.code === 200) {
          vm.accountInfo = res.data
          this.getLess()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.accountDetail{
    height: 100vh;
    display:flex;
    flex-flow: column nowrap;
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
    /deep/.van-nav-bar .van-icon{
        font-size:36px;
    }
    .promptbox{
        display: flex;
        justify-content: space-between;
        align-items: center;
        // margin:20px 0;
        padding:30px;
        span{
            font-size: 24px;
            color: #e00d0d;
            line-height: 30px;
        }
        .icon{
            font-size: 28px;
            color: #999;
        }
    }
    .withbox{
        padding:50px 30px;
        background-color:#fff;
        .firstbox{
            display: flex;
            justify-content: space-around;
            align-items: center;
            .itembox{
                text-align:center;
                .headbox{
                    font-size: 36px;
                    font-weight: 700;
                    color: #333333;
                }
                .bodybox{
                    margin-top:10px;
                    img{
                        width:24px;
                        height:24px;
                        vertical-align: middle;
                    }
                    span{
                        font-size: 24px;
                        color: #999999;
                    }
                }
            }
        }
        .twobox{
            text-align:center;
            .activebtn{
                display:inline-block;
                margin-top:50px;
                // margin: 0 auto;
                padding:16px 108px;
                background: linear-gradient(90deg,#ffa14b, #ff5d19);
                border-radius: 34px;
                font-size: 26px;
                font-weight: 700;
                color: #ffffff;
            }
            .activebtn1{
                display:inline-block;
                margin-top:50px;
                // margin: 0 auto;
                padding:16px 108px;
                background-color: #ccc;
                border-radius: 34px;
                font-size: 26px;
                font-weight: 700;
                color: #ffffff;
            }
        }
    }
    .content{
        flex:1;
        margin-top:20px;
        padding: 0 30px;
        background-color:#fff;
        p{
            margin:50px 0 20px;
            font-size: 32px;
            font-weight: 700;
            color: #333333;
        }
        .listbox{
            padding:30px 0 20px;
            border-bottom: 1px solid #dcdcdc;
            .titlebox{
                display: flex;
                justify-content: space-between;
                align-items: center;
                span:nth-of-type(1){
                    font-size: 26px;
                    font-weight: 700;
                    color: #333333;
                }
                span:nth-of-type(2){
                    font-size: 26px;
                    font-weight: 700;
                    color: #ff5d19;
                }
            }
            .timebox{
                margin:20px 0;
                font-size: 24px;
                color: #999999;
            }
        }
        .footbox{
            display: flex;
            justify-content: space-between;
            align-items: center;
            span:nth-of-type(1){
              font-size: 24px;
              color: #999999;
            }
            div:nth-of-type(2){
              font-size: 24px;
              color: #666666;
            }
        }
    }
}
</style>
