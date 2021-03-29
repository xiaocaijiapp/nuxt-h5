<template>
    <div class="nextMonPay-container">
      <van-nav-bar :title="$t('nextPay.name')" fixed left-arrow @click-left="$router.push('/personal')"/>
      <div v-if="monthlyPayStatus == 0" class="content-card">
        <div class="left">
          <div class="top">
            <span class="title">{{$t('nextPay.canUseNum')}}</span>
            <span class="money">{{availableCredit}}</span>
          </div>
          <div class="bottom">
            <span class="title" @click="$router.push('/followMonthPay/allBill')">{{$t('nextPay.myBill')}}</span>
            <span v-if="reimbursement" class="callbackDate">{{$t('nextPay.reimbursement')}}{{reimbursement}}</span>
          </div>
        </div>
        <div class="right">
          <span class="content" @click="$router.push('/nextPayValidation/update')">{{$t('nextPay.AuthenticationInformation')}}</span>
        </div>
      </div>
<!--      账户逾期-->
      <div v-else-if="monthlyPayStatus == 1" class="abnormalUnState">
        <div class="left">
          <div class="top">
            <span class="title">{{$t('nextPay.noCanUseNextPay')}}</span>
            <p class="desc">{{$t('nextPay.timeLimitInfo')}}</p>
            <span class="btn" @click="$router.push('/followMonthPay/allBill')">{{$t('nextPay.ImmediateRepayment')}}</span>
          </div>
          <div class="bottom">
            <span class="title" @click="$router.push('/followMonthPay/allBill')">{{$t('nextPay.myBill')}}</span>
            <span v-if="reimbursement" class="callbackDate">{{$t('nextPay.reimbursement')}}{{reimbursement | handleDate | splitDate}}</span>
          </div>
        </div>
        <div class="right">
          <span class="content" @click="$router.push('/nextPayValidation/update')">{{$t('nextPay.AuthenticationInformation')}}</span>
        </div>
      </div>
      <div v-else class="accountShielding">
        <div class="top">{{$t('nextPay.noCanUseNextPay')}}</div>
        <div class="bottom">{{$t('nextPay.errorRepayment')}}</div>
      </div>
    </div>
</template>

<script>
import api from 'static/api'
export default {
  layout: 'content',
  name: 'Index',
  filters: {
    handleDate (e) {
      const str = e.replace('-', '年')
      const s = str.replace('-', '月')
      return s + '日'
    },
    splitDate (val) {
      return val.substring(5)
    }
  },
  async asyncData ({ $axios }) {
    const { data } = await $axios.get(api.user.creditInfo)
    // 查询还款日
    let reimbursement
    await $axios.post(api.user.reimbursement).then((res) => {
      if (res.code === 200) { reimbursement = res.data }
    })
    return {
      availableCredit: data.availableCredit,
      monthlyPayOpen: data.monthlyPayOpen,
      monthlyPayStatus: data.monthlyPayStatus,
      reimbursement
    }
  },
  data () {
    return {
    }
  },
  created () {
    console.log(this.availableCredit)
    console.log(this.monthlyPayOpen)
    console.log(this.monthlyPayStatus)
    // console.log(this.reimbursement)
  }
}
</script>

<style lang="less" scoped>
.nextMonPay-container{
  .content-card{
    width: 702px;
    height: 320px;
    margin: 108px auto 0px;
    background-image: url("../../assets/images/icon/nextPay.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 42px 30px 30px;
    border-radius: 15px;
    overflow: hidden;
    .left{
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: flex-start;
      .top, .bottom {
        span{
          display: block;
        }
        .title{
          font-size: 28px;
          font-weight: 400;
          color: #333333;
          line-height: 40px;
        }
      }
      .top{
        .money{
          font-size: 60px;
          font-weight: 600;
          text-align: left;
          color: #ff5d19;
          line-height: 84px;
        }
      }
      .bottom{
        .title{
          color: #1491ff;
        }
        .callbackDate{
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #999999;
          line-height: 40px;
        }
      }
    }
    .right{
      .content{
        font-size: 28px;
        font-weight: 400;
        text-align: left;
        color: #1491ff;
        line-height: 40px;
      }
    }
  }
  .abnormalUnState{
    width: 702px;
    height: 410px;
    margin: 108px auto 0px;
    background-image: url("../../assets/images/icon/unstate.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: 50px 30px 40px;
    .left{
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: flex-start;
      .top, .bottom {
        span{
          display: block;
        }
      }
      .top{
        .title{
          font-size: 36px;
          font-weight: 600;
          color: #333333;
          line-height: 50px;
        }
        .desc {
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #999999;
          line-height: 40px;
          margin-top: 10px;
        }
        .btn{
          width: 200px;
          height: 60px;
          background: linear-gradient(270deg,#ff5e1a, #ffa14b);
          border-radius: 29px;
          font-size: 28px;
          font-weight: 400;
          color: #ffffff;
          line-height: 60px;
          text-align: center;
          margin-top: 10px;
        }
      }
      .bottom{
        /*flex: 1;*/
        /*margin-top: 50px;*/
        .title{
          font-size: 28px;
          font-weight: 400;
          color: #1491ff;
          line-height: 40px;
        }
        .callbackDate{
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #999999;
          line-height: 40px;
        }
      }
    }
    .right{
      .content{
        font-size: 28px;
        font-weight: 400;
        text-align: left;
        color: #1491ff;
        line-height: 40px;
      }
    }
  }
  .accountShielding{
    width: 702px;
    height: 320px;
    margin: 108px auto 0px;
    background-image: url("../../assets/images/icon/unstate.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    padding: 50px 30px 0px;
    .top{
      font-size: 36px;
      font-weight: 600;
      text-align: left;
      color: #333333;
      line-height: 50px;
    }
    .bottom{
      margin-top: 36px;
      width: 350px;
      word-break: break-all;
      font-size: 32px;
      font-weight: 500;
      text-align: left;
      color: #ff5d19;
      line-height: 45px;
    }
  }
}
</style>
