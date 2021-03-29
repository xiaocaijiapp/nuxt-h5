<template>
    <div class="bill-container">
      <van-nav-bar :title="navTitle" fixed left-arrow @click-left="$router.push('/followMonthPay/allBill')"/>
      <div class="bill-content">
        <div class="top">
          <p v-if="billState == 0" class="title">{{$t('nextPay.nextBillAdd')}}</p>
          <p v-if="billState == 3" class="title">{{`${billMonth}${$t('nextPay.MonthRepayment')}`}}</p>
          <p v-if="billState == 1" class="title">{{$t('nextPay.repaymentNum')}}</p>
          <p v-if="billState == 2" class="title">{{$t('nextPay.repaymentNum')}}</p>
          <span v-if="billState == 0" class="money">{{ billAmount }}</span>
          <span v-else class="money">{{ waitRepayAmount }}</span>
          <div class="descDate">{{$t('nextPay.reimbursement')}}{{ settleDay | handleDate | splitDate }}</div>
        </div>
        <div class="center-block">{{ centerTitle }}</div>
        <div class="bottom">
          <div class="b-content">
            <div v-if="orderInfo.length > 0" class="scroll-content">
              <div v-for="(item, index) in orderInfo" :key="index" class="content-item">
                <span class="title">{{item.date | handleDate}}</span>
                <div class="content">
                  <div v-for="(p,i) in item.arr" :key="i" class="item" @click="ToDetail(p.type,p.orderNumber)">
                    <div class="orderNum">{{$t('distribution.orderNo')}}: {{p.orderNumber}}</div>
                    <span class="payNum">{{p.type == 1 ? '-' + p.payAmount : p.payAmount}}円</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="billState == 1 || billState == 3" class="b-content-btn" @click="reimbursementHandle">{{ $t('nextPay.toRepayment') }}</div>
        </div>
      </div>
    </div>
</template>

<script>
import api from 'static/api'
const _uniq = require('lodash/uniq')
export default {
  layout: 'content',
  name: 'Month',
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
  async asyncData ({ $axios, params, query }) {
    const billNumber = query.id
    const waitRepayAmount = query.money
    const settleDay = query.date
    const billState = query.billState
    const billMonth = query.month
    const billAmount = query.billAmount
    const { month } = params
    let myBillFlowResDtoList; let orderId
    const orderInfo = []
    await $axios.post(api.user.BillListDetail, { billNumber }).then((res) => {
      if (res.code === 200) {
        const arr = res.data.myBillFlowResDtoList.map((item) => {
          return item.createTime.split(' ')[0]
        })
        _uniq(arr).forEach((date) => {
          const obj = {}
          obj.date = date
          obj.arr = []
          res.data.myBillFlowResDtoList.forEach((bill) => {
            // eslint-disable-next-line eqeqeq
            if (bill.createTime.indexOf(date) == 0) {
              obj.arr.push(bill)
            }
          })
          orderInfo.push(obj)
        })
        orderId = res.data.orderId
      }
    })
    return {
      month,
      billNumber,
      waitRepayAmount,
      settleDay,
      myBillFlowResDtoList,
      orderId,
      billState,
      billMonth,
      orderInfo,
      billAmount
    }
  },
  data () {
    return {
    }
  },
  computed: {
    navTitle () {
      if (this.month === 'during') {
        return `${this.billMonth}${this.$t('nextPay.monthBillDay')}`
        // // eslint-disable-next-line eqeqeq
        // if (this.billState == 3 || this.billState == 1) {
        //   return `${this.billMonth}${this.$t('nextPay.monthBillDay')}`
        //   // eslint-disable-next-line eqeqeq
        // } else if (this.billState == 0) {
        //   return this.$t('nextPay.nextMonthBill')
        // } else {
        //   return this.$t('nextPay.currentMonthBill')
        // }
      } else {
        return `${this.billMonth}${this.$t('nextPay.monthBillDay')}`
        // // eslint-disable-next-line eqeqeq,no-lonely-if
        // if (this.billState == 3 || this.billState == 1) {
        //   return `${this.billMonth}${this.$t('nextPay.monthBillDay')}`
        //   // eslint-disable-next-line eqeqeq
        // } else if (this.billState == 2) {
        //   return `${this.billMonth}${this.$t('nextPay.monthBillDay')}`
        // } else {
        //   return this.$t('nextPay.nextMonthBill')
        // }
      }
    },
    centerTitle () {
      if (this.month === 'during') {
        return `${this.billMonth}${this.$t('nextPay.monthBillDetail')}`
        // // eslint-disable-next-line eqeqeq
        // if (this.billState == 3) {
        //   return `${this.billMonth}${this.$t('nextPay.monthBillDetail')}`
        // } else {
        //   return this.$t('nextPay.currentMonthDetail')
        // }
      } else {
        return `${this.billMonth}${this.$t('nextPay.monthBillDetail')}`
        // // eslint-disable-next-line eqeqeq,no-lonely-if
        // if (this.billState == 3 || this.billState == 1 || this.billState == 2) {
        //   return `${this.billMonth}${this.$t('nextPay.monthBillDetail')}`
        // } else {
        //   return this.$t('nextPay.nextMonthDetail')
        // }
      }
    }
  },
  created () {
    console.log(this.orderInfo)
  },
  methods: {
    reimbursementHandle () {
      this.$router.push({ path: '/reimbursement', query: { id: this.billNumber, money: this.waitRepayAmount } })
    },
    ToDetail (type, id) {
      if (type === 1) { return }
      this.$router.push(`/order/orderdetail/?orderNumber=${id}&orderState=1`)
    }
  }
}
</script>

<style lang="less" scoped>
.bill-content{
  width: 702px;
  margin: 108px auto 0px;
  box-sizing: border-box;
  height: calc(100vh - 108px);
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  .top{
    width: 702px;
    height: 260px;
    background-image: url("../../assets/images/icon/bill-t.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    padding: 42px 30px 45px;
    .title{
      font-size: 28px;
      font-weight: 400;
      text-align: left;
      color: #333333;
      line-height: 40px;
    }
    .money {
      font-size: 60px;
      font-weight: 600;
      text-align: center;
      color: #ff5d19;
      line-height: 84px;
    }
    .descDate{
      font-size: 28px;
      font-weight: 400;
      text-align: right;
      color: #999999;
      line-height: 40px;
    }
  }
  .center-block{
    font-size: 32px;
    font-weight: 400;
    color: #333333;
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: left;
  }
  .bottom{
    width: 100%;
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .b-content::-webkit-scrollbar{
      display: none;
    }
    .b-content{
      flex: 1;
      overflow-x: hidden;
      overflow-y: scroll;
      width: 100%;
      .scroll-content{
        padding: 40px 30px;
        border-radius: 16px;
        background-color: #ffffff;
        .content-item{
          width: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-between;
          align-items: flex-start;
          padding: 10px 0px;
          .title{
            font-size: 28px;
            font-weight: 400;
            text-align: left;
            color: #666666;
            line-height: 40px;
          }
          .content{
            width: 100%;
            margin-top: 15px;
            .item:last-child{
              padding: 0;
            }
            .item {
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              align-items: center;
              width: 100%;
              padding-bottom: 20px;
              .orderNum, .payNum{
                font-size: 30px;
                font-weight: 400;
                text-align: left;
                color: #333333;
                line-height: 42px;
              }
            }
          }
        }
      }
    }
    .b-content-btn{
      width: 690px;
      height: 78px;
      background: linear-gradient(90deg,#ffa14b, #ff5d19);
      border-radius: 39px;
      font-size: 28px;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      line-height: 78px;
      margin-bottom: 30px;
      margin-top: 20px;
    }
  }
}
</style>
