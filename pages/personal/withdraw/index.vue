<template>
    <div class="withdraw">
        <van-nav-bar
            :title="$t('newThreeClass.withBtn')"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="content">
            <div class="amountbox">
                <div class="firstbox">
                    6000円
                </div>
                <div class="twobox">
                    可提现金额（1积分=1日元）
                </div>
            </div>
            <div class="withdrawbox">
                <p>
                    提现金额
                </p>
                <div class="inputbox">
                    <input v-model="inpVal"/>
                    <span>全部提现</span>
                </div>
            </div>

            <div class="editbox">
                <div class="cardbox">
                    <div class="leftbox">
                        <span>
                            到账卡号
                        </span>
                        <span>
                            666666666
                        </span>
                    </div>
                    <div class="rightbox">
                        修改
                    </div>
                </div>
                <div class="namebox">
                    <span>
                        真实姓名
                    </span>
                    <span>
                        李栋
                    </span>
                </div>
            </div>

            <div class="btnbox">
                提交申请
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'withdraw',
  layout: 'content',
  data () {
    return {
      inpVal: ''
    }
  },
  mounted () {
    this.getCheckInfo()
  },
  methods: {
    onClickLeft () {
    },
    // 提现检查
    getCheckInfo () {
      const vm = this
      vm.$axios({
        url: 'starday-pay/WithdrawUserApi/check',
        method: 'post',
        data: {}
      })
    }
  }
}
</script>
<style lang="less" scoped>
.withdraw{
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
        flex: 1;
        margin-top:20px;
        padding:0 30px;
        background-color:#fff;
        .amountbox{
            margin-top:60px;
            text-align:center;
            .firstbox{
                font-size: 52px;
                font-weight: 700;
                color: #ff5d19;
            }
            .twobox{
                margin-top:20px;
                font-size: 26px;
                color: #999999;
            }
        }
        .withdrawbox{
            margin-top:80px;
            >p {
                font-size: 32px;
                font-weight: 700;
                color: #333333;
            }
            .inputbox{
                display:flex;
                justify-content: space-between;
                align-items: center;
                margin-top:40px;
                padding-bottom:20px;
                border-bottom: 1px solid #dbdbdb;
                input {
                    font-size: 42px;
                    color:#333;
                    font-weight: 700;
                }
                span{
                    font-size: 28px;
                    color:#999;
                }
            }
        }
        .editbox{
            margin-top:30px;
            .cardbox{
                display:flex;
                justify-content: space-between;
                align-items: center;
                .leftbox{
                    font-size: 28px;
                    color: #333333;
                    span:nth-of-type(1){
                        margin-right:30px;
                    }
                }
                .rightbox{
                    padding:16px 60px;
                    font-size: 28px;
                    color: #ff5d19;
                    border: 1px solid #ff5d19;
                    border-radius: 28px;
                }
            }
            .namebox{
                margin-top:14px;
                font-size: 28px;
                color: #333333;
                span:nth-of-type(1){
                    margin-right:30px;
                }
            }
        }
        .btnbox{
            margin-top:80px;
            padding:18px 0;
            font-size: 30px;
            font-weight: 700;
            text-align:center;
            color: #ffffff;
            background: linear-gradient(90deg,#ffa14b, #ff5d19);
            border-radius: 40px;
        }
    }
}
</style>
