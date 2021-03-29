<template>
    <div class="withdrawHistory">
        <van-nav-bar
            :title="$t('newThreeClass.withDrawRecording')"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="content">
            <div v-for="(item, index) in accontList" :key="index" class="itembox">
                <div class="firstbox">
                    <span>
                        {{$t('newThreeClass.acountWith')}}
                    </span>
                    <span>
                        {{item.amount}}
                    </span>
                </div>
                <div class="threebox">
                    {{item.remark}}
                </div>
                <div class="twobox">
                    <span>
                        {{item.createTime}}
                    </span>
                    <span v-if="item.status === 0">
                        {{$t('newThreeClass.withdrawing')}}
                    </span>
                    <span v-if="item.status === 1">
                        {{$t('newThreeClass.withdrawSuccess')}}
                    </span>
                    <span v-if="item.status === 2">
                        {{$t('newThreeClass.withdrawError')}}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'withdrawHistory',
  layout: 'content',
  data () {
    return {
      accontList: []
    }
  },
  mounted () {
    this.getHistoryInfo()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal/accountDetail')
    },
    // 获取提现记录
    getHistoryInfo () {
      const vm = this
      vm.$axios({
        url: 'starday-pay/WithdrawUserApi/queryWithdrawRecord',
        method: 'post',
        data: {}
      }).then((res) => {
        if (res.code === 200) {
        //   console.log('res111111', res)
          vm.accontList = res.data.data || []
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.withdrawHistory{
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
    .content{
        flex:1;
        margin-top:20px;
        padding: 0 30px;
        background-color:#fff;
        .itembox{
            padding:30px 0;
            border-bottom: 1px solid #dcdcdc;
            .firstbox, .twobox{
                display:flex;
                justify-content: space-between;
                align-items: center;
            }
            .firstbox {
                font-size: 26px;
                color: #333333;
                span{
                    font-weight: 700;
                }
            }
            .twobox{
                margin-top:30px;
                span:nth-of-type(1){
                    font-size: 24px;
                    color: #999999;
                }
                span:nth-of-type(2){
                    font-size: 24px;
                    color: #333333;
                }
            }
            .threebox{
                margin-top:30px;
                text-align: right;
                font-size: 24px;
                color: #e00d0d;
            }
        }
    }
}
</style>
