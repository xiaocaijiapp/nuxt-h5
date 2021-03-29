<template>
    <div class="bankCardInfo">
        <van-nav-bar
            :title="$t('newUserInfo.bankinfo')"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="promptbox">
            {{$t('newThreeClass.plaintBankInfo')}}
        </div>
        <div class="content">
            <div class="itembox">
                <span>
                    {{$t('newUserInfo.bankName')}}
                </span>
                <input v-model="bankName" :placeholder="$t('newUserInfo.bankNameTips')"/>
            </div>

            <div class="itembox">
                <span>
                    {{$t('newUserInfo.branchBank')}}
                </span>
                <input v-model="branchName" :placeholder="$t('newUserInfo.branchBankTips')"/>
            </div>

            <div class="itembox">
                <span>
                    {{$t('newUserInfo.Cardholder')}}
                </span>
                <input v-model="cardName" :placeholder="$t('newUserInfo.CardholderTips')"/>
            </div>

            <div class="itembox">
                <span>
                    {{$t('newUserInfo.cardNo')}}
                </span>
                <input v-model="bankNo" :placeholder="$t('newUserInfo.inputCardNo')"/>
            </div>

            <div class="btnbox" @click="goWithPage">
                {{$t('newUserInfo.nextTip')}}
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'bankCardInfo',
  layout: 'content',
  data () {
    return {
      bankName: '',
      branchName: '',
      cardName: '',
      bankNo: ''
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal/accountDetail')
    },
    goWithPage () {
      const vm = this
      const _data = {
        bankName: vm.bankName,
        branchName: vm.branchName,
        cardHolder: vm.cardName,
        cardNumber: vm.bankNo
      }
      if (!vm.bankName) {
        return vm.$toast(vm.$t('newUserInfo.bankNameTips'))
      }
      if (!vm.branchName) {
        return vm.$toast(vm.$t('newUserInfo.branchBankTips'))
      }
      if (!vm.cardName) {
        return vm.$toast(vm.$t('newUserInfo.CardholderTips'))
      }
      if (!vm.bankNo) {
        return vm.$toast(vm.$t('newUserInfo.inputCardNo'))
      }
      vm.$axios({
        url: 'starday-user/user/bankCard/add',
        method: 'post',
        data: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.$router.push('/personal/withdraw')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.bankCardInfo{
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
        margin: 20px 0;
        padding:0 30px;
        font-size: 24px;
        color: #e00d0d;
    }
    .content{
        flex: 1;
        padding:0 30px;
        background-color:#fff;
        .itembox{
            height:94px;
            display:flex;
            justify-content: flex-start;
            align-items: center;
            border-bottom: 1px solid #dbdbdb;
            span{
                width:180px;
                // margin-right:68px;
                font-size: 28px;
                color: #333333;
            }
            input {
                font-size: 28px;
                color:#999;
                border:none;
                outline:none;
            }
        }
        .btnbox{
            margin-top:80px;
            padding: 18px 0;
            text-align:center;
            font-size: 30px;
            font-weight: 700;
            color: #ffffff;
            background: linear-gradient(90deg,#ffa14b, #ff5d19);
            border-radius:40px;
        }
    }
}
</style>
