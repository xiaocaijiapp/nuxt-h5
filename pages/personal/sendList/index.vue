<template>
    <div class="sendList">
        <van-nav-bar
            :title="$t('mail.hasbeensent')"
            left-arrow
            @click-left="onClickLeft"
        />
        <van-empty
            v-if="msgList.length == 0"
            class="custom-image"
            image-size="150"
            :image="require('assets/images/empty/wupingjia.png')"
            :description="$t('newMsg.no')"
        />
        <div v-else class="messgeBox">
            <van-list v-model="loading" :loading-text="$t('supply.loadding')" :finished-text="$t('threeClass.finished')" :finished="finished" @load="onLoad">
                <div v-for="(item) in msgList" :key="item.id" class="itemMes">
                    <div class="timebox">
                        {{item.sendTime}}
                    </div>
                    <van-swipe-cell>
                        <div class="itembox" @click="goDetail(item.id)">
                            <img v-if="item.receiveImage" v-lazy="baseImageUrl + item.receiveImage"/>
                            <img v-else src="@/assets/images/icon/avev.png"/>
                            <div class="titlebox">
                                <div class="firstTitle">
                                    <span style="font-weight:700;">{{item.receiveUserName}}</span>
                                    <!-- <span :class="item.checkStatus === 1 ? 'color' : 'color1'">{{item.checkStatus === 1? $t('newMsg.Unread') : $t('newMsg.Read')}}</span> -->
                                </div>
                                <div class="twoTitle">
                                    {{item.title}}
                                </div>
                                <div class="threeTitle">
                                    {{item.detail}}
                                </div>
                            </div>
                        </div>
                        <template #right>
                            <van-button
                                square
                                class="delete-button"
                                :icon="require('assets/images/msgcenter/delete.png')"
                                @click="delMsg(item.id)"
                            />
                        </template>
                    </van-swipe-cell>
                </div>
            </van-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SendList',
  layout: 'default',
  data () {
    return {
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
    this.getSendList()
  },
  methods: {
    onLoad () {
      const that = this
      if (this.loading) {
        setTimeout(() => {
          // 加载状态结束
          that.pageNo++
          that.getSendList()
        }, 1000)
      }
    },
    onClickLeft () {
      window.history.go(-1)
    },
    // 获取发送的邮件列表
    getSendList () {
      const vm = this
      const _data = {
        pageNo: vm.pageNo,
        pageSize: vm.pageSize
      }
      vm.$axios({
        url: 'starday-mail/mail/findMySendMailPage',
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
          vm.getSendList()
        }
      })
    },
    goDetail (id) {
      this.$router.push('/personal/emailListDetial?sendType=1&id=' + id)
    }
  }
}
</script>
<style lang="less" scoped>
    .sendList{
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
        // height:100vh;
        .titleHead{
            height:88px;
            background-color:#fff;
            font-size:36px;
            line-height:88px;
            text-align:center;
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
        /deep/.van-empty__image{
            margin-top: -600px;
        }
        .messgeBox{
            .itemMes{
                margin: 20px 24px 0;
                .timebox{
                    width: 300px;
                    height: 40px;
                    margin: 0 auto;
                    padding:0 10px;
                    text-align: center;
                    background: #e2e2e2;
                    border-radius: 10px;
                    font-size:28px;
                    color: #fff;
                    line-height: 40px;
                }
                .itembox{
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    margin-top: 20px;
                    padding: 20px;
                    border-radius: 10px;
                    background-color: #fff;
                    img{
                        width: 112px;
                        height: 112px;
                    }
                    .titlebox{
                        // flex: 1;
                        margin-left: 10px;
                        width:100%;
                        .firstTitle{
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            height: 42px;
                            width:100%;
                            font-size: 30px;
                            font-weight: 500;
                            color: rgba(0,0,0,0.85);
                            line-height: 42px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            span:nth-of-type(1){
                                width:86%;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            }
                            span:nth-of-type(2){
                                font-size: 24px;
                            }
                        }
                        .twoTitle{
                            width:540px;
                            height: 40px;
                            font-size: 28px;
                            color: #333;
                            line-height: 40px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        .threeTitle{
                            width:540px;
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
        .active {
            position: relative;
            color: #ff5d19!important;
        }
        .active::before{
            content: '';
            position: absolute;
            bottom: -24px;
            left: 50%;
            transform: translateX(-50%);
            width:40px;
            height: 6px;
            background-color: #FF5D19;
            border-radius: 4px;
        }
        .color {
            color: #FF5D19;
        }
        .color1 {
            color: #c2c2c2;
        }
    }
</style>
