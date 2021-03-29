<template>
    <div class="pointsRules">
        <van-nav-bar
            :title="$t('supply.p25')"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="content">
            <p class="title">{{$t('newThreeClass.rulesA')}}</p>
            <p class="itembox">
                1、{{$t('newThreeClass.rulesB')}}
            </p>
            <p class="itembox">
                2、{{$t('newThreeClass.rulesC')}}
            </p>
            <p class="itembox">
                3、{{$t('newThreeClass.rulesD')}}
            </p>
            <p class="itembox">
                4、{{$t('newThreeClass.rulesE')}}
            </p>

            <p class="title" style="margin-top:20px;">{{$t('newThreeClass.rulesF')}}</p>
            <p class="itembox">
                1、{{$t('newThreeClass.rulesG')}}
            </p>
            <p class="itembox">
                2、{{$t('newThreeClass.rulesH')}}
            </p>

            <p class="title" style="margin-top:20px;">{{$t('newThreeClass.rulesI')}}</p>
            <p class="itembox">
                1、{{$t('newThreeClass.rulesJ')}}
            </p>

            <p class="itembox">
                2、{{$t('newThreeClass.rulesK')}}
            </p>
            <p class="itembox">
                3、{{$t('newThreeClass.rulesM').replace('M', difference)}}
            </p>
        </div>
    </div>
</template>
<script>
export default {
  name: 'pointsRules',
  layout: 'content',
  data () {
    return {
      difference: 0
    }
  },
  mounted () {
    this.getLess()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal/accountDetail')
    },
    // 获取积分
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
          vm.difference = res.data
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.pointsRules{
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
        padding: 40px 30px 0;
        background-color:#fff;
        .title{
            font-size: 30px;
            font-weight: 700;
            color: #333333;
            line-height: 48px;
        }
        .itembox{
            font-size: 26px;
            color: #333333;
            line-height: 48px;
        }
    }
}
</style>
