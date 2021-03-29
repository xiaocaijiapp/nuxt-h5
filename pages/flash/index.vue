<template>
  <div class="flash-container">
    <div class="header-container">
      <div class="nav">
        <div class="left">
          <van-icon size="22px" color="#ffffff" name="arrow-left" @click="toIndex"></van-icon>
        </div>
        <div class="title">{{$t('seckill.name')}}</div>
        <div class="right">
          <van-icon size="9.14285714vw" :name="require(`assets/images/seckill/fenxiang.png`)" @click="share"></van-icon>
        </div>
      </div>
      <div class="flash-list">
        <div class="scroll-box">
          <div v-for="(item, _index) in flashList" :key="_index" ref="pageContainer" class="flash-item-info" :class="active === _index + 1 ? 'active' : ''" @click="changeFlash(_index + 1, _index,$event)">
            <span class="time">{{item.startTime.substring(0,5)}}</span>
            <span v-if="item.timeState === 1" class="desc">{{$t('seckill.processing')}}</span>
            <span v-else-if="item.timeState === 0" class="desc">{{$t('seckill.quickbegin')}}</span>
            <span v-else-if="item.timeState === 3" class="desc">{{$t('seckill.tomorrow')}}</span>
            <span v-else class="desc">{{$t('seckill.over')}}</span>
          </div>
        </div>
      </div>
      <div v-if="flashList.length > 0" class="count-time">
        <span v-if="flashInfo.timeState === 1" class="text-desc">{{$t('seckill.enddis')}}</span>
        <span v-else-if="flashInfo.timeState === 0" class="text-desc">{{$t('seckill.quickbegin')}}</span>
        <span v-else-if="flashInfo.timeState === 2" class="text-desc">{{$t('seckill.over')}}</span>
        <span v-else class="text-desc">{{$t('seckill.tomorrow')}}</span>
        <van-count-down v-if="flashInfo.timeState === 1 || flashInfo.timeState === 0" :time="flashInfo.time" format="HH:mm:ss">
          <template v-slot="timeData">
            <span class="item">{{timeData.hours&lt;10?'0'+timeData.hours:timeData.hours }}</span>
            <span class="colon">:</span>
            <span class="item">{{ timeData.minutes&lt;10?'0'+timeData.minutes:timeData.minutes }}</span>
            <span class="colon">:</span>
            <span class="item">{{ timeData.seconds&lt;10?'0'+timeData.seconds:timeData.seconds }}</span>
          </template>
        </van-count-down>
      </div>
    </div>
    <div class="content-container">
      <div class="goods-list">
        <skill-item v-for="(item) in goodsList" :key="item.id" :item-goods="item"></skill-item>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '~/static/api'
import { timeToSec, timeDiff } from '~/util/tools'
import skillItem from '~/components/skill/skillItem'
export default {
  name: 'Flash',
  layout: 'content',
  watchQuery: ['active'],
  components: {
    skillItem
  },
  async asyncData ({ $axios, query, error }) {
    try {
      const active = query.active * 1 || 1
      let flashList = []
      let goodsList = []
      const flashInfo = {}
      let activityInfo; let request
      await $axios.get(api.activity.secKill).then((res) => {
        if (res.code === 200 && res.data.length) {
          const arr = res.data.filter(item => item.timeState !== 3)
          const todayFlashList = arr.filter(item => item.timeState !== 2)
          const tomorrowSecList = res.data.filter(item => item.timeState === 3) // 明日开始列表
          tomorrowSecList.sort((a, b) => timeToSec(a.startTime) - timeToSec(b.startTime)) // 排序
          todayFlashList.sort((a, b) => timeToSec(a.startTime) - timeToSec(b.startTime)) // 排序
          flashList = [...todayFlashList, ...tomorrowSecList]
          activityInfo = flashList[active - 1]
          request = activityInfo.flashSaleActivitys.map(item => item.goodsId)
        }
      })
      if (request) {
        await $axios.post(api.goods.getGoodsInfo, request).then((res) => {
          if (res.code === 200) {
            activityInfo.flashSaleActivitys.forEach((item) => {
              res.data.forEach((prop) => {
                if (item.goodsId === prop.id) {
                  Object.assign(prop, item)
                }
              })
            })
            goodsList = res.data
          }
        })
        if (activityInfo.timeState === 1) {
          const nowDtae = activityInfo.nowtimes
          const endDate = activityInfo.nowtimes.split(' ')[0] + ' ' + activityInfo.endTime
          flashInfo.time = timeDiff(endDate, nowDtae)
          flashInfo.timeState = 1
        } else if (activityInfo.timeState === 0) {
          const nowDtae = activityInfo.nowtimes
          const endDate = activityInfo.nowtimes.split(' ')[0] + ' ' + activityInfo.startTime
          flashInfo.time = timeDiff(endDate, nowDtae)
          flashInfo.timeState = 0
        } else {
          flashInfo.time = 0
          flashInfo.timeState = activityInfo.timeState
        }
      }
      return {
        flashList,
        goodsList,
        flashInfo,
        active
      }
    } catch (e) {
      error(e)
    }
  },
  computed: {
    ...mapGetters({
      getLoginData: 'userInfo'
    })
  },
  mounted () {
    window.sessionStorage.removeItem('page')
  },
  methods: {
    changeFlash (active, index, event) {
      const spanLeft = event.clientX
      const totalWidths = document.body.clientWidth
      const widths = document.body.clientWidth / 2
      const spanRight = totalWidths - spanLeft
      const scrollBox = document.getElementsByClassName('flash-list')
      const scrollL = scrollBox[0].scrollLeft
      if (spanLeft > widths || spanRight > widths) {
        scrollBox[0].scrollLeft = scrollL + (spanLeft - widths)
      }
      this.$router.push('/flash?active=' + active)
    },
    toIndex () {
      this.$router.push('/')
    },
    share () {
      const vm = this
      let _url = location.origin + location.pathname
      const _str = []
      if (vm.getLoginData.id) {
        if (vm.$route.query) {
          for (const i in vm.$route.query) {
            if (i !== 'shareId' && i !== 'shareSource' && i !== 'shareTime') {
              _str.push(i + '=' + vm.$route.query[i])
            }
          }
        }
        if (_str.length) {
          _url = _url + '?' + _str.join('&') + '&shareId=' + vm.getLoginData.id + '&shareSource=2&shareTime=' + Math.floor(new Date().getTime() / 1000)
        } else {
          _url = _url + '?shareId=' + vm.getLoginData.id + '&shareSource=2&shareTime=' + Math.floor(new Date().getTime() / 1000)
        }
      }
      vm.$copyText(_url).then(function (e) {
        vm.$toast.success(vm.$t('home.copysuccess'))
      }, function (e) {
        vm.$toast.fail(vm.$t('home.copyerror'))
      })
    }
  }
}
</script>

<style lang="less" scoped>
.flash-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  .header-container {
    width: 100%;
    height: 510px;
    background-image: url('https://image.stardaymart.com/h5/lALPDhmOuF1FKXvNAv3NBGU_1125_765.png?x-oss-process=image/resize,w_1000/format,webp');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-origin: border-box;
    .nav {
      width: 100%;
      height: 88px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      background-color: transparent;
      .left,
      .right {
        width: 108px;
        height: 88px;
        display: flex;
        align-items: center;
      }
      .left {
        justify-content: flex-start;
      }
      .right {
        justify-content: flex-end;
      }
      .title {
        flex: 1;
        height: 100%;
        font-size: 36px;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        line-height: 88px;
      }
    }
    .flash-list::-webkit-scrollbar {
      display: none;
    }
    .flash-list {
      width: 100%;
      height: 160px;
      position: relative;
      overflow-x: scroll;
      overflow-y: hidden;
      margin-top: 30px;
      -ms-overflow-style: none;
      scrollbar-width: none;
      .scroll-box {
        padding: 0 20px;
        position: absolute;
        height: 160px;
        left: 0;
        display: flex;
        flex-flow: row nowrap;
        .flash-item-info {
          width: 224px;
          height: 160px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-around;
          align-items: center;
          margin-right: 40px;
          .desc {
            color: #ffbcbc;
            background-color: transparent;
            border-radius: 20px;
            font-size: 22px;
            font-weight: 400;
            line-height: 36px;
            padding: 4px 16px;
          }
          .time {
            font-size: 36px;
            font-weight: 400;
            color: #ffbcbc;
            line-height: 50px;
          }
        }
        .active {
          .time {
            font-size: 36px;
            font-weight: 400;
            color: #ffffff;
            line-height: 50px;
          }
          .desc {
            background-color: #ffffff;
            font-size: 22px;
            font-weight: 400;
            color: #de0f0f;
            line-height: 36px;
            padding: 4px 16px;
          }
        }
      }
    }
    .count-time {
      width: 100%;
      padding: 40px 0px 28px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      .text-desc {
        font-size: 22px;
        font-weight: 400;
        color: #ffffff;
        line-height: 30px;
      }
      /deep/.van-count-down {
        margin-left: 15px;
        .item {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          font-size: 24px;
          line-height: 32px;
          background-color: #333333;
          color: #ffffff;
          padding: 4px 6px;
        }
        .colon {
          display: inline-block;
          font-weight: bolder;
          color: #ee0a24;
        }
      }
    }
  }
  .content-container {
    width: 100%;
    flex: 1;
    position: relative;
    .goods-list::-webkit-scrollbar {
      display: none;
    }
    .goods-list {
      position: absolute;
      top: -125px;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0 20px;
      overflow-y: scroll;
    }
  }
}
</style>
