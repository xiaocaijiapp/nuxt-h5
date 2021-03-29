<template>
  <div class="myCommon">
    <van-nav-bar :title="$t('newUserInfo.myCommonts')" left-arrow @click-left="onClickLeft" />
    <div class="topbox">
      <div class="title">
        <div>
          {{$t('newOrder.Tobeevaluated')}}({{commonList.length}})
        </div>
        <div v-if="commonList.length > 1" class="allbox" @click="goAllpage">
          {{$t('newUserInfo.viewAll')}}
          <img src="@/assets/images/user/right.png" />
        </div>
      </div>
      <div class="fottbox">
        <div v-for="(item,index) in commonList" :key="index" :class="commonList.length > 1 ? 'listMorebox' : 'listbox'">
          <img v-lazy="baseImageUrl + item.goodsSkuImg" />
          <div class="itembox">
            <p class="goodtitle">
              {{item.goodsTitle}}
            </p>
            <span class="btnbox" @click="goCommonPage(item)">
              {{$t('newUserInfo.Immediateevaluation')}}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="footbox">
      <div v-if="!dataList.length" class="noData">
        <img src="@/assets/images/empty/wupingjia.png" />
        <p>暂无评价</p>
      </div>
      <div v-else class="appraiseBox">
        <div class="titlebox">
          全部评价
        </div>
        <div v-for="(item,index) in dataList" :key="index" class="itembox">
          <div class="headBox">
            <div class="leftbox">
              <img v-lazy="baseImageUrl + item.userHeardImg" :onerror="defaultImage" />
              <div>
                <p class="namebox">
                  {{item.userName}}
                </p>
                <p class="timeBox">
                  {{item.createTime}}
                </p>
              </div>
            </div>
            <div class="rightbox">
              <van-icon class="icon" name="ellipsis" color="#999" @click="showBtn(item, index)" />
            </div>
            <div v-show="item.checked" class="hidden_evaluate" @click="deleteRow(item)">
              {{$t('newUserInfo.Hiddenevaluation')}}
            </div>
          </div>
          <div class="starbox">
            <div class="imgHeadBox">
              <img v-lazy="baseImageUrl + item.goodsImg" style="width:65px;height:65px;" />
              <div class="titleRight">
                <div>
                  {{item.goodsName}}
                </div>
                <div>
                  <span>
                    {{item.specValue}}
                  </span>
                  <span style="float:right;">
                    x1
                  </span>
                </div>
                <div>
                  {{item.goodsPrice}}円
                </div>
              </div>
            </div>
            <div class="bodyBox">
              <div>
                <span>{{$t('newUserInfo.select_1')}}</span>
                <van-rate v-model="item.goodsSore" color="#FF5D19" :size="20" readonly />
              </div>
              <div style="margin:14px 0;">
                <span>{{$t('newUserInfo.select_2')}}</span>
                <van-rate v-model="item.expressSore" color="#FF5D19" :size="20" readonly />
              </div>
              <div>
                <span>{{$t('newUserInfo.select_3')}}</span>
                <van-rate v-model="attitudeSore" color="#FF5D19" :size="20" readonly />
              </div>
            </div>
          </div>
          <div class="alearybtn">
            <div @click="Buyagain(item)">
              {{$t('newUserInfo.buyAgain')}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'MyCommon',
  layout: 'content',
  data () {
    return {
      commonList: [],
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      attitudeSore: 3
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl']),
    defaultImage () {
      return `this.src="${require('assets/images/empty/default2.png')}"`
    }
  },
  mounted () {
    this.getWaitList()
    this.getListInfo()
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    // 获取待评价列表
    getWaitList () {
      const vm = this
      const _data = {
        orderState: 5,
        pageNo: vm.pageNo,
        pageSize: vm.pageSize
      }
      vm.$axios({
        url: 'starday-order/myOrder/listOther',
        method: 'post',
        data: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.commonList = res.data.rows
        }
      })
    },
    getListInfo () {
      const vm = this
      vm.$axios({
        url: 'starday-goods/user/goods_comment/list',
        method: 'get'
      }).then((res) => {
        if (res.code === 200) {
          vm.dataList = res.data
          vm.dataList.forEach((item) => {
            item.checked = false
          })
        }
      })
    },
    Buyagain (item) {
      this.$router.push('/product/' + item.spuId)
    },
    goCommonPage (item) {
      this.$router.push('/order/evaluate?spuid=' + item.goodsId + '&skuid=' + item.goodsSkuId + '&orderNo=' + item.orderNumber + '&img=' + item.goodsSkuImg)
    },
    goAllpage () {
      this.$router.push('/order/orderlist?active=4')
    },
    showBtn (item, index) {
      item.checked = !item.checked
      const el = document.getElementsByClassName('hidden_evaluate')[index]
      if (item.checked) {
        el.style.display = 'block'
      } else {
        el.style.display = 'none'
      }
    },
    deleteRow (item) {
      const vm = this
      const _data = {
        commentId: item.id
      }
      vm.$axios({
        url: 'starday-goods/user/goods_comment/delComment',
        method: 'post',
        params: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.getListInfo()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.myCommon {
  height: 100vh;
  .van-nav-bar {
    height: 88px;
  }
  /deep/.van-nav-bar__content {
    height: 100%;
  }
  /deep/.van-nav-bar__title {
    height: 100%;
    line-height: 88px;
    font-size: 36px;
    color: #323233;
    font-weight: 500;
  }

  .topbox {
    width: 100vw;
    margin: 20px 0;
    padding: 28px 24px;
    background-color: #fff;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 30px;
      color: #333333;
      .allbox {
        font-size: 26px;
        color: #666666;
        img {
          width: 24px;
          height: 24px;
          vertical-align: middle;
        }
      }
    }
    .listbox {
      display: flex;
      justify-content: flex-start;
      // align-items: center;
      margin-top: 22px;
      img {
        width: 160px;
        height: 160px;
      }
      .itembox {
        flex: 1;
        // display:flex;
        // flex-direction: column;
        // justify-content: space-between;
        margin-left: 20px;
        .goodtitle {
          height: 80px;
          font-size: 28px;
          color: #666666;
          line-height: 40px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .btnbox {
          float: right;
          margin-top: 26px;
          padding: 16px 16px;
          font-size: 24px;
          color: #ffffff;
          background: linear-gradient(90deg, #ffa14b, #ff5d19);
          border-radius: 26px;
        }
      }
    }
    .fottbox {
      width: 100%;
      overflow-x: auto;
      display: flex;
      margin-top: 22px;
      padding-bottom: 20px;
      .listMorebox {
        width: 410px;
        display: flex;
        justify-content: flex-start;
        flex-shrink: 0;
        // align-items: center;
        margin-right: 20px;
        padding: 20px;
        border-radius: 4px;
        border: 1px solid #dfdfdf;
        img {
          width: 160px;
          height: 160px;
        }
        .itembox {
          flex: 1;
          margin-left: 20px;
          .goodtitle {
            height: 80px;
            font-size: 28px;
            color: #666666;
            line-height: 40px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .btnbox {
            float: right;
            margin-top: 26px;
            padding: 0.5rem 0.2rem;
            font-size: 24px;
            color: #ffffff;
            background: linear-gradient(90deg, #ffa14b, #ff5d19);
            border-radius: 26px;
          }
        }
      }
    }
  }
  .footbox {
    min-height: 868px;
    background-color: #fff;
    .noData {
      margin: 0 auto;
      text-align: center;
      img {
        width: 220px;
        height: 220px;
        margin-top: 120px;
      }
      p {
        margin-top: 20px;
        font-size: 26px;
        color: #333;
      }
    }
    .appraiseBox {
      padding: 0 24px;
      .titlebox {
        height: 90px;
        line-height: 90px;
        font-size: 30px;
        color: #333333;
        border-bottom: 1px solid #d8d8d8;
      }
      .itembox {
        margin-top: 20px;
        padding-bottom: 90px;
        border-bottom: 1px solid #d8d8d8;
        .headBox {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .leftbox {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            img {
              width: 90px;
              height: 90px;
              margin-right: 20px;
            }
            .namebox {
              width: 400px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .timeBox {
              margin-top: 20px;
              font-size: 26px;
              color: #999999;
            }
          }
          .rightbox {
            .icon {
              font-size: 40px;
            }
          }
          .hidden_evaluate {
            height: 100px;
            width: 8rem;
            background: url('../../../assets/images/evalute/hidden.png')
              no-repeat;
            background-size: 100% 100%;
            font-size: 26px;
            line-height: 114px;
            color: #333333;
            text-align: center;
            position: absolute;
            right: -10px;
            top: 40px;
            z-index: 999;
          }
        }
        .starbox {
          margin: 22px 0 0 90px;
          padding: 22px;
          background: #f4f4f4;
          border-radius: 10px;
          .imgHeadBox {
            display: flex;
            justify-content: flex-start;
            .titleRight {
              margin-left: 22px;
              > div:nth-of-type(1) {
                width: 416px;
                font-size: 28px;
                color: #666666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 40px;
              }
              > div:nth-of-type(2) {
                font-size: 28px;
                color: #999;
                line-height: 40px;
              }
              > div:nth-of-type(3) {
                font-size: 28px;
                color: #999;
                line-height: 40px;
              }
            }
          }
          .bodyBox {
            margin-top: 20px;
            font-size: 26px;
            color: #666;
            > div {
              display: flex;
              justify-content: flex-start;
              align-items: center;
              span {
                margin-right: 26px;
              }
            }
          }
        }
        .alearybtn {
          position: relative;
          > div {
            position: absolute;
            right: 0;
            top: 20px;
            padding: 8px 16px;
            font-size: 24px;
            color: #ff5d19;
            border: 1px solid #ff5d18;
            border-radius: 26px;
          }
        }
      }
      .itembox:last-of-type {
        border: none;
      }
    }
  }
}
</style>
