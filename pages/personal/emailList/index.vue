<template>
  <div class="msgCenter">
    <van-sticky>
      <van-nav-bar>
        <template #right>
          <span class="right-title" @click="goSent">{{$t('mail.hasbeensent')}}</span>
        </template>
        <template #title>
          <div class="msg">{{$t('newMsg.center')}}</div>
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="tabbox">
      <div :class="activeTab === '1' ? 'leftTab active' : 'leftTab'" @click="changeTab('1')">
        {{$t('mail.stardayMsg')}}
      </div>
      <div :class="activeTab === '2' ? 'rightTab active' : 'rightTab'" @click="changeTab('2')">
        {{$t('mail.shopMsg')}}
      </div>
    </div>
    <van-empty v-if="msgList.length == 0" class="custom-image" image-size="150px" :image="require('assets/images/empty/wupingjia.png')" :description="$t('newMsg.no')" />
    <div v-else class="messgeBox">
      <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished-text="$t('threeClass.finished')" :finished="finished" @load="onLoad">
        <div v-for="(item) in msgList" :key="item.id" class="itemMes">
          <div class="timebox">
            {{item.receiveTime}}
          </div>
          <van-swipe-cell>
            <div class="itembox" @click="goDetail(item.id)">
              <img v-if="activeTab === '2' && item.sendImage" v-lazy="baseImageUrl + item.sendImage" />
              <img v-if="activeTab === '2' && !item.sendImage" src="@/assets/images/empty/default2.png" />
              <div class="titlebox">
                <div class="firstTitle">
                  <span style="font-weight:700;">{{ activeTab === '2' ? item.sendUserName : $t('newThreeClass.stardayTitle')}}</span>
                  <span :class="item.checkStatus === 1 ? 'color' : 'color1'">{{item.checkStatus === 1? $t('newMsg.Unread') : $t('newMsg.Read')}}</span>
                </div>
                <div :class="activeTab === '2'? 'twoTitle' : 'twoTitle1'">
                  {{item.title}}
                </div>
                <div :class="activeTab === '2'? 'threeTitle' : 'threeTitle1'">
                  {{item.detail}}
                </div>
              </div>
            </div>
            <template #right>
              <van-button square class="delete-button" :icon="require('assets/images/msgcenter/delete.png')" @click="delMsg(item.id)" />
            </template>
          </van-swipe-cell>
        </div>
      </van-list>
    </div>
    <img v-if="activeTab === '1'" class="imgbox" src="@/assets/images/msgcenter/kefu.png" @click="goSendPage" />
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'MsgCenter',
  layout: 'default',
  data () {
    return {
      activeTab: '1',
      msgList: [],
      loading: false,
      finished: false,
      pageNo: 1,
      pageSize: 10
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  mounted () {
    this.getMsgList()
    this.setTabBarActive(2)
  },
  methods: {
    ...mapMutations(['setTabBarActive']),
    onLoad () {
      const that = this
      if (this.loading) {
        setTimeout(() => {
          // 加载状态结束
          that.pageNo++
          that.getMsgList()
        }, 1000)
      }
    },
    // 获取消息列表
    getMsgList () {
      const vm = this
      let type = 0
      if (vm.activeTab === '2') {
        type = 1
      }
      const _data = {
        pageNo: vm.pageNo,
        pageSize: vm.pageSize,
        type
      }
      vm.$axios({
        url: 'starday-mail/mail/findMyReceiveMailPage',
        method: 'get',
        params: _data
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            vm.msgList = vm.msgList.concat(res.data.rows)
            vm.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            vm.msgList = vm.msgList.concat(res.data.rows)
            vm.loading = false
          } else {
            vm.msgList = vm.msgList.concat(res.data.rows)
          }
        }
      })
    },
    goSent () {
      this.$router.push('/personal/sendList')
    },
    goSendPage () {
      this.$router.push('/personal/contactPla')
    },
    changeTab (str) {
      this.msgList = []
      this.activeTab = str
      this.getMsgList()
    },
    delMsg (id) {
      const vm = this
      const _data = {
        id
      }
      vm.$axios({
        url: 'starday-mail/mail/delMail',
        method: 'get',
        params: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.getMsgList()
        }
      })
    },
    goDetail (id) {
      this.$router.push('/personal/emailListDetial?id=' + id)
    }
  }
}
</script>
<style lang="less" scoped>
.msgCenter {
  position: relative;
  //   height: 100vh;
  .van-nav-bar {
    height: 88px;
  }
  /deep/.van-nav-bar__content {
    height: 100%;
  }
  .right-title {
    font-size: 30px;
    color: #ff5d19;
    line-height: 42px;
  }
  .msg {
    font-size: 36px;
    color: #333333;
    line-height: 50px;
  }
  .tabbox {
    position: fixed;
    width: 100%;
    z-index: 999;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 80px;
    background-color: #fff;
    .leftTab,
    .rightTab {
      font-size: 32px;
      color: #333;
    }
  }
  .custom-image{
    width: 100%;
    height: calc(100vh - 186px);
  }
  .messgeBox {
    padding: 96px 0 32px 0;
    .itemMes {
      margin: 20px 24px 0;
      .timebox {
        width: 300px;
        height: 40px;
        margin: 0 auto;
        padding: 0 10px;
        text-align: center;
        background: #e2e2e2;
        border-radius: 10px;
        font-size: 28px;
        color: #fff;
        line-height: 40px;
      }
      .itembox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-top: 20px;
        padding: 20px;
        border-radius: 10px;
        background-color: #fff;
        img {
          width: 112px;
          height: 112px;
        }
        .titlebox {
          flex: 1;
          width: 80%;
          margin-left: 10px;
          .firstTitle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 42px;
            font-size: 30px;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.85);
            line-height: 42px;
            span:nth-of-type(1) {
              width: 88%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            span:nth-of-type(2) {
              // flex:1;
              font-size: 24px;
              text-align: right;
            }
          }
          .twoTitle {
            width: 540px;
            height: 40px;
            font-size: 28px;
            color: #333;
            line-height: 40px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .twoTitle1 {
            width: 640px;
            height: 40px;
            font-size: 28px;
            color: #333;
            line-height: 40px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .threeTitle {
            width: 540px;
            height: 33px;
            font-size: 24px;
            color: #666;
            line-height: 33px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .threeTitle1 {
            width: 640px;
            height: 33px;
            font-size: 24px;
            color: #666;
            line-height: 33px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .delete-button {
        height: 100%;
        background: rgb(244, 244, 244);
        border: 0;
        font-size: 80px;
      }
    }
  }
  .imgbox {
    position: fixed;
    bottom: 140px;
    right: 24px;
    width: 94px;
    height: 94px;
  }
  .active {
    position: relative;
    color: #ff5d19 !important;
  }
  .active::before {
    content: '';
    position: absolute;
    bottom: -24px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 6px;
    background-color: #ff5d19;
    border-radius: 4px;
  }
  .color {
    color: #ff5d19;
  }
  .color1 {
    color: #c2c2c2;
  }
}
</style>
