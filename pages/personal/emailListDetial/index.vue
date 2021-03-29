<template>
    <div class="viewMsg">
        <van-nav-bar
            :title="mesDetialInfo.sendUserName"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="bodybox">
          <div class="titlebox">
            <p>{{mesDetialInfo.title}}</p>
            <div class="namebox">
              {{mesDetialInfo.receiveUserName}}
              <img v-lazy="emailFlag ? require('assets/images/msgcenter/zhankai.png'): require('assets/images/msgcenter/shouqi.png')" @click="showEmail"/>
            </div>
            <div v-if="emailFlag" class="emailbox">
              {{mesDetialInfo.receiveMail}}
            </div>
            <div v-if="emailFlag" class="emailbox">
              {{mesDetialInfo.sendTime}}
            </div>
          </div>
          <div class="contentbox">
            <div class="detialText">
              {{mesDetialInfo.detail}}
            </div>
            <div style="margin:20px 0;" v-if="mesDetialInfo.shareInfoList && mesDetialInfo.shareInfoList.length > 0">
              <div class="goodsItem" v-for="(item, index) in mesDetialInfo.shareInfoList" :key="index" @click="routerToLink(item)">
                <span v-if="item.type !== 3">
                  {{item.name}}
                </span>
                <span v-if="item.type === 3">
                  {{locale === 'zh-CN' ? item.name.split('|')[0] : item.name.split('|')[1]}}
                </span>
              </div>
            </div>
            <div class="imgbox">
              <img v-for="(item, index) in imgList" :key="index" v-lazy="baseImageUrl + item" />
            </div>
          </div>
        </div>

        <div v-if="sendType === 0" class="button" @click="reply">
          <img src="@/assets/images/icon/huifu.png"/>
          <span>{{$t('mail.reply')}}</span>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ViewMsg',
  layout: 'content',
  data () {
    return {
      emailFlag: true,
      showbutton: true,
      imgList: [],
      mesDetialInfo: {},
      sendType: 0
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl', 'locale'])
  },
  mounted () {
    if (this.$route.query.sendType) {
      this.sendType = this.$route.query.sendType
    }
    this.getMsgDetial(this.$route.query.id)
  },
  methods: {
    ...mapActions({
      actionsReplyEmail: 'actionsReplyEmail'
    }),
    routerToLink (item) {
      const vm = this
      switch (item.type * 1) {
        case 1:
          window.open(process.env.NODE_ENV === 'pro' ? 'https://m.starday.jp' : 'http://192.168.0.242:7900/', '_blank')
          break
        case 2:
          window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/store/' + item.linkId) : ('http://192.168.0.242:7900/store/' + item.linkId), '_blank')
          break
        case 3:
          // if (item.template === 2) {
          //   window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/promotionpage/promotionpicture/' + item.linkId) : ('http://192.168.0.242:7900/promotionpage/promotionpicture/' + item.linkId), '_blank')
          // } else {
          //   window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/promotionpage/promotiongoods/' + item.linkId) : ('http://192.168.0.242:7900/promotionpage/promotiongoods/' + item.linkId), '_blank')
          // }
          if (item.template === 0) {
            window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/promotionpage/promotiongoods/' + item.linkId) : ('http://192.168.0.242:7900/promotionpage/promotiongoods/' + item.linkId), '_blank')
          } else if (item.template === 1) {
            window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/promotionpage/promotiondiscount/' + item.linkId) : ('http://192.168.0.242:7900/promotionpage/promotiondiscount/' + item.linkId), '_blank')
          } else if (item.template === 2) {
            window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/promotionpage/promotionpicture/' + item.linkId) : ('http://192.168.0.242:7900/promotionpage/promotionpicture/' + item.linkId), '_blank')
          } else if (item.template === 6) {
            vm.openApp()
          } else if (item.template === 7) {
            window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/personal/giftCard') : ('http://192.168.0.242:7900/personal/giftCard'), '_blank')
          } else if (item.template === 8) {
            window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/flash') : ('http://192.168.0.242:7900/flash'), '_blank')
          }
          break
        case 4:
          window.open(process.env.NODE_ENV === 'pro' ? ('https://m.starday.jp/product/' + item.linkId) : ('http://192.168.0.242:7900/product/' + item.linkId), '_blank')
          break
      }
    },
    // 打开APP
    openApp () {
      const u = navigator.userAgent
      const isAndroid = u.includes('Android') > -1 || u.includes('Linux') > -1 // android终端
      const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      if (isAndroid) {
        window.location.href = 'android://com.saneki.stardays/open'
        setTimeout(function () {
          const hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden === false) {
            window.location.href = 'http://download.starday.jp/target.html'
          }
        }, 2000)
      }
      if (isIOS) {
        window.location.href = 'stardaymarket://couponCenter'
        setTimeout(function () {
          const hidden = window.document.hidden || window.document.mozHidden || window.document.msHidden || window.document.webkitHidden
          if (typeof hidden === 'undefined' || hidden === false) {
            window.location.href = 'http://download.starday.jp/target.html'
          }
        }, 2000)
      }
    },
    // 获取站内信详情
    getMsgDetial (id) {
      const vm = this
      const _data = {
        id
      }
      vm.$axios({
        url: 'starday-mail/mail/getMailInfo',
        method: 'get',
        params: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.mesDetialInfo = res.data || {}
          if (res.data.attachments) {
            vm.imgList = res.data.attachments.split(',') || []
          }
        }
      })
    },
    showEmail () {
      this.emailFlag = !this.emailFlag
    },
    onClickLeft () {
      window.history.go(-1)
    },
    reply () {
      this.actionsReplyEmail(this.mesDetialInfo)
      this.$router.push('/personal/replyMsg')
    }
  }
}
</script>
<style lang="less" scoped>
  .viewMsg{
    height:100vh;
    background-color: #fff;
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
    .bodybox{
      margin: 0 30px;
      .titlebox{
        padding: 27px 0 30px;
        border-bottom:1px solid #e5e5e5;
        p{
          font-size:32px;
          font-weight:600;
          color:#333;
        }
        .namebox{
          margin-top:20px;
          font-size: 28px;
          color: #3897e0;
          line-height:40px;
          img{
            width: 24px;
            height:24px;
            vertical-align: middle;
          }
        }
        .emailbox{
          margin-top:8px;
          font-size: 24px;
          color: #999;
          line-height:33px;
        }
      }
      .contentbox{
        margin-top:32px;
        .detialText{
          font-size:28px;
          color: #333;
          line-height:40px;
        }
        .goodsItem{
          display: inline-block;
          span{
            margin:0 20px 20px 0;
            line-height: 30px;
            color: #1890ff;
          }
        }
        .imgbox{
          margin-top:20px;
          img {
            width:200px;
            height: 200px;
            margin:0 20px 20px 0;
          }
        }
      }
    }
    .button{
      width: 100%;
      height: 80px;
      background-color: #fff;
      position: fixed;
      bottom: 0;
      text-align: center;
      line-height: 80px;
      box-shadow: 0px -1px 0px 0px #dcdcdc;
      border-top: 1px solid #e5e5e5;
      img {
        width: 36px;
        height: 28px;
        vertical-align: middle;
      }
      span{
        font-size: 24px;
        color: #333;
      }
    }
  }
</style>
