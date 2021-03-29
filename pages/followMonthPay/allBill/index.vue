<template>
  <div class="bill-container">
    <van-nav-bar
      :title="$t('nextPay.myBill')"
      fixed
      left-arrow
      @click-left="$router.push('/followMonthPay')"
    />
    <div class="BillInfo">
      <div v-if="billInfo.thisMonth" class="info-t">
        <div v-if="billInfo.thisMonth.billState !== 2" class="left">
          <div class="top">
            <span v-if="billInfo.thisMonth.billState === 3" class="title">{{billInfo.thisMonth.billState === 3 ? `${thisMonthBillDay}${$t('nextPay.MonthRepayment')}` : $t('nextPay.thisMonthRepayment')}}</span>
            <span v-if="billInfo.thisMonth.billState === 0" class="title">{{$t('nextPay.nextBillAdd')}}</span>
            <span v-if="billInfo.thisMonth.billState === 1" class="title">{{$t('nextPay.thisMonthRepayment')}}</span>
            <span v-if="billInfo.thisMonth.billState === 0" class="money">{{ billInfo.thisMonth.billAmount }}</span>
            <span v-if="billInfo.thisMonth.billState === 1 || billInfo.thisMonth.billState === 3" class="money">{{ billInfo.thisMonth.waitRepayAmount }}</span>
            <span v-if="billInfo.thisMonth.billState === 3" class="time-limit">{{$t('nextPay.nowError')}}{{ billInfo.thisMonth.overdueDays }}日</span>
          </div>
          <div class="bottom">
            <span v-if="billInfo.thisMonth.billState !== 3" class="title">{{$t('nextPay.reimbursement')}}{{ billInfo.thisMonth.settleDay | handleDate | splitDate}}</span>
            <span v-if="billInfo.thisMonth.billState !== 0" class="btn" @click="toReimbursement(billInfo.thisMonth.billNumber, billInfo.thisMonth.waitRepayAmount)">{{$t('nextPay.ImmediateRepayment')}}</span>
          </div>
        </div>
        <div v-else class="left">
          <p class="overBill">{{ thisMonthBillDay + $t('nextPay.monthBillOver')}}</p>
        </div>
        <div class="right">
          <span class="content" @click="toBillPay(billInfo.thisMonth.billNumber, billInfo.thisMonth.waitRepayAmount, billInfo.thisMonth.settleDay, billInfo.thisMonth.billState, billInfo.thisMonth.billAmount)">{{$t('nextPay.infoDetail')}}</span>
        </div>
      </div>
      <div v-else class="info-t">
        <div class="left">
          <div class="top">
            <span class="title">{{$t('nextPay.thisMonthRepayment')}}</span>
            <span class="money">0</span>
          </div>
        </div>
      </div>
      <div v-if="billInfo.nextMonth" class="info-b" @click="toNextBillPay(billInfo.nextMonth.billNumber, billInfo.nextMonth.waitRepayAmount, billInfo.nextMonth.settleDay, billInfo.nextMonth.billState, billInfo.nextMonth.billAmount)">
        <div class="left" :style="{'justify-content': billInfo.nextMonth.billState === 2 ? 'center' : 'space-between'}">
          <div v-if="billInfo.nextMonth.billState === 3 || billInfo.nextMonth.billState === 1" class="title">{{nextMonthBillDay + $t('nextPay.MonthRepay')}}</div>
          <div v-else-if="billInfo.nextMonth.billState === 0" class="title">{{$t('nextPay.nextBillAdd')}}</div>
          <div v-else-if="billInfo.nextMonth.billState === 2" class="title">{{$t('nextPay.currentMonthAly')}}</div>
          <div v-else class="title">{{$t('nextPay.nextBillAdd')}}</div>
          <p v-if="billInfo.nextMonth.billState === 3" class="sumMoney">{{ billInfo.nextMonth.waitRepayAmount }}円</p>
          <p v-if="billInfo.nextMonth.billState === 1" class="sumMoney">{{ billInfo.nextMonth.waitRepayAmount }}円,{{$t('nextPay.reimbursement')}}{{billInfo.nextMonth.settleDay | handleDate | splitDate}}</p>
          <p v-if="billInfo.nextMonth.billState === 0" class="desc">{{$t('nextPay.addTo')}}{{billInfo.nextMonth.billAmount}}円，{{$t('nextPay.reimbursement')}}{{billInfo.nextMonth.settleDay | handleDate | splitDate}}</p>
        </div>
        <div class="right">
          <p v-if="billInfo.nextMonth.billState === 3" class="desc">{{$t('nextPay.nowError')}}{{ billInfo.nextMonth.overdueDays }}日</p>
          <img class="right-img" :src="require('~/assets/images/icon/black-right.png')"/>
        </div>
      </div>
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
    // 获取我的账单列表
    const billInfo = {}
    let thisMonthBillDay, nextMonthBillDay
    await $axios.post(api.user.myBillList).then((res) => {
      if (res.code === 200) {
        console.log(res.data)
        billInfo.thisMonth = res.data[0]
        billInfo.nextMonth = res.data[1]
        thisMonthBillDay = res.data[0] ? res.data[0].billDay.split('-')[1] : ''
        nextMonthBillDay = res.data[1] ? res.data[1].billDay.split('-')[1] : ''
      }
    })
    return {
      billInfo,
      thisMonthBillDay,
      nextMonthBillDay
    }
  },
  created () {
    console.log(this.billInfo)
    console.log(this.nextMonthBillDay)
    console.log(this.thisMonthBillDay)
  },
  methods: {
    toBillPay (id, money, date, billState, billAmount) {
      // eslint-disable-next-line eqeqeq
      if (billState == 0) {
        // 累计中 跳转下月明细
        this.$router.push({ path: '/nextPayBill/next', query: { id, money, date, billState, billAmount, month: this.nextMonthBillDay } })
        // eslint-disable-next-line eqeqeq
      } else if (billState == 3) {
        this.$router.push({ path: '/nextPayBill/during', query: { id, money, date, billState, billAmount, month: this.thisMonthBillDay } })
      } else {
        this.$router.push({ path: '/nextPayBill/during', query: { id, money, date, billState, billAmount, month: this.thisMonthBillDay } })
      }
    },
    toNextBillPay (id, money, date, billState, billAmount) {
      this.$router.push({ path: '/nextPayBill/next', query: { id, money, date, billState, billAmount, month: this.nextMonthBillDay } })
    },
    toReimbursement (id, money) {
      this.$router.push({ path: '/reimbursement', query: { id, money } })
    }
  }
}
</script>

<style lang="less" scoped>
.BillInfo {
  width: 702px;
  margin: 108px auto 0px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  overflow: hidden;
  .info-t {
    width: 702px;
    height: 320px;
    background-image: url('../../../assets/images/icon/nextPay.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 42px 30px 30px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: flex-start;
    .left {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: flex-start;
      height: 100%;
      .overBill {
        font-size: 40px;
        font-weight: 600;
        text-align: left;
        color: #333333;
        line-height: 56px;
        margin-top: 88px;
      }
      .top,
      .bottom {
        /*height: 50%;*/
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        span {
          display: block;
        }
        .title {
          margin-bottom: 10px;
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 40px;
        }
      }
      .top {
        .money {
          font-size: 60px;
          font-weight: 600;
          text-align: left;
          color: #ff5d19;
          line-height: 84px;
        }
        .time-limit {
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #ff5d19;
          line-height: 40px;
        }
      }
      .bottom {
        .title {
          color: #999999;
        }
        .btn {
          /*width: 160px;*/
          height: 60px;
          background: linear-gradient(270deg, #ff5e1a, #ffa14b);
          border-radius: 29px;
          font-size: 28px;
          padding: 0 20px;
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          line-height: 60px;
        }
      }
    }
    .right {
      .content {
        font-size: 28px;
        font-weight: 400;
        text-align: left;
        color: #1491ff;
        line-height: 40px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      }
      .content::after {
        content: '';
        display: inline-block;
        width: 24px;
        height: 24px;
        background-image: url('../../../assets/images/icon/black-right.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin-left: 8px;
      }
    }
  }
  .info-b {
    width: 702px;
    height: 150px;
    background-image: url('../../../assets/images/icon/info-b.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    padding: 30px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    .left {
      height: 100%;
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: flex-start;
      .title {
        font-size: 30px;
        font-weight: 500;
        text-align: left;
        color: #333333;
        line-height: 42px;
      }
      .desc {
        font-size: 28px;
        font-weight: 400;
        text-align: left;
        color: #999999;
        line-height: 40px;
      }
      .sumMoney {
        font-size: 28px;
        font-weight: 500;
        text-align: left;
        color: #ff5d19;
        line-height: 40px;
      }
    }
    .right {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      .desc {
        font-size: 28px;
        font-weight: 500;
        text-align: left;
        color: #ff5d19;
        line-height: 40px;
        margin-right: 10px;
      }
      .right-img {
        width: 28px;
        height: 28px;
        object-fit: contain;
      }
    }
  }
}
</style>
