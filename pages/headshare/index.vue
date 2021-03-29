<template>
<div>
  <van-nav-bar placeholder fixed border left-arrow :title="$t('share.LFriend')" @click-left="clickLeft"></van-nav-bar>
  <div class="share-container">
    <div class="share-content">
      <div class="title">
        <p class="main-title">{{$t('share.shareGetGod')}}</p>
        <p class="two-title">{{$t('share.shareDesc')}}</p>
      </div>
<!--      拉新方法1-->
      <div class="fun funOne">
        <div class="otherTitle">
          <span class="titleText">{{$t('share.funOne')}}</span>
        </div>
        <div class="oneFunContent">
          <p class="yqCode">{{$t('share.myCode')}}:</p>
          <div class="codeArea">
            <span class="left">{{ QYCode }}</span>
            <span class="right" @click="copyQYCode">{{$t('share.copyBtn')}}</span>
          </div>
          <p class="codeDesc">{{$t('share.HBtext')}}</p>
        </div>
      </div>
<!--      拉新方法2-->
      <div class="fun funTwo">
        <div class="otherTitle">
          <span class="titleText">{{$t('share.funTwo')}}</span>
        </div>
        <div class="share-btn-box">
          <span class="btn" @click="canvasToImage">{{$t('share.shareHB')}}</span>
        </div>
      </div>
    </div>
  </div>
  <van-overlay id="domOverlay" :show="headShare" @click.self="headShare = false">
    <div class="posters-container" @click.stop>
      <van-loading v-if="createCanvasImage" type="spinner" size="24px" />
      <img v-else class="canvasImg" :src="canvasImage" />
    </div>
  </van-overlay>
  <van-popup v-model="headShare" :style="{ height: '15%' }" :overlay="false" :safe-area-inset-bottom="true" position="bottom" :round="true" get-container="#domOverlay">
    <div class="canvasShare">
      <div class="share-item" @click.stop="downLoadImage">
        <img class="share-img" :src="require('~/assets/images/icon/domnImage.png')" />
        <span class="share-desc">{{$t('share.saveImage')}}</span>
      </div>
    </div>
  </van-popup>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  layout: 'content',
  name: 'HeadShare',
  data () {
    return {
      headShare: false,
      createCanvasImage: false,
      canvasImage: '',
      options: [
        {
          name: this.$t('share.posters'),
          icon: require('~/assets/images/icon/toimage.png'),
          className: 'share-icon-desc'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['QYCode'])
  },
  methods: {
    clickLeft () {
      this.$router.go(-1)
    },
    canvasToImage () {
      this.headShare = true
      this.postersHandle()
    },
    postersHandle () {
      this.createCanvasImage = true
      // 商品主图
      const oneText = this.$t('share.joinStar')
      const twoText = this.$t('share.downAppText')
      const threeText = this.$t('share.langCode')
      const fourText = this.$t('share.downAppCode')
      const QYCode = this.QYCode
      const canvas = document.createElement('canvas')
      const canvasBox = document.getElementsByClassName('posters-container')[0]
      const canvasBoxW = window.getComputedStyle(canvasBox).width.slice(0, -2) * 1
      const canvasBoxH = window.getComputedStyle(canvasBox).height.slice(0, -2) * 1
      const ctx = canvas.getContext('2d')
      // canvas的实际渲染倍率
      const ratio = this.getPixelRatio(ctx)
      canvas.width = canvasBoxW * ratio
      canvas.height = canvasBoxH * ratio
      canvas.style.width = canvasBoxW + 'px' // 300 410
      canvas.style.height = canvasBoxH + 'px'
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#333333'
      ctx.font = `normal normal 600 ${18 * ratio}px 'Microsoft Yahei'`
      ctx.textBaseLine = 'middle'
      const TW = ctx.measureText(oneText).width
      ctx.fillText(oneText, (canvasBoxW * ratio / 2) - (TW / 2), 0.095 * canvasBoxH * ratio)
      ctx.closePath()
      ctx.beginPath()
      ctx.fillStyle = '#ff5d19'
      ctx.font = `normal normal 600 ${18 * ratio}px 'Microsoft Yahei'`
      ctx.textBaseLine = 'middle'
      ctx.fillText(twoText, (canvasBoxW * ratio / 2) - (ctx.measureText(twoText).width / 2), 0.2 * canvasBoxH * ratio)
      ctx.closePath()
      ctx.beginPath()
      ctx.fillStyle = '#333333'
      ctx.font = `normal normal 400 ${13 * ratio}px 'Microsoft Yahei'`
      ctx.textBaseLine = 'middle'
      ctx.fillText(threeText, (canvasBoxW * ratio / 2) - (ctx.measureText(threeText).width / 2), 0.75 * canvasBoxH * ratio)
      ctx.closePath()
      ctx.beginPath()
      ctx.fillStyle = '#333333'
      ctx.font = `normal normal 500 ${16 * ratio}px 'Microsoft Yahei'`
      ctx.textBaseLine = 'middle'
      ctx.fillText(fourText, (canvasBoxW * ratio / 2) - (ctx.measureText(fourText).width / 2), 0.85 * canvasBoxH * ratio)
      ctx.closePath()
      ctx.beginPath()
      ctx.fillStyle = '#333333'
      ctx.font = `normal normal 600 ${18 * ratio}px 'Microsoft Yahei'`
      ctx.textBaseLine = 'middle'
      ctx.fillText(QYCode, (canvasBoxW * ratio / 2) - (ctx.measureText(QYCode).width / 2), 0.93 * canvasBoxH * ratio)
      ctx.closePath()
      const QRimg = new Image()
      QRimg.src = require('assets/images/receivecoupon/QRcode.png')
      console.log(0.5 * canvasBoxW * ratio)
      QRimg.onload = () => {
        this.createCanvasImage = false
        ctx.drawImage(QRimg, (canvasBoxW * ratio / 2) - (0.25 * canvasBoxW * ratio), 0.3 * canvasBoxH * ratio, 0.5 * canvasBoxW * ratio, 0.5 * canvasBoxW * ratio)
        this.canvasImage = canvas.toDataURL('image/png', 1)
      }
      ctx.save()
    },
    getPixelRatio (context) {
      const backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1
      return (window.devicePixelRatio || 1) / backingStore
    },
    downLoadImage () {
      const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      saveLink.href = this.canvasImage
      saveLink.download = new Date().getTime()
      const event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      saveLink.dispatchEvent(event)
      this.headShare = false
    },
    copyQYCode () {
      this.$copyText(this.QYCode).then((res) => {
        this.$toast.success(this.$t('home.copysuccess'))
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-share-sheet__options{
  justify-content: center;
}
.share-container{
  width: 100%;
  height: calc(100vh - 88px);
  background-image: url("https://image.stardaymart.com/h5/lALPDiCptfGXt7zNBarNAvA_752_1450.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  .share-content{
    position: absolute;
    width: 683px;
    height: 766px;
    bottom: 148px;
    left: 35px;
    right: 35px;
    background-color: transparent;
    background-image: url("../../assets/images/icon/sharebg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .title{
      width: 100%;
      padding-top: 37px;
      .main-title{
        font-size: 36px;
        font-weight: 600;
        color: #333333;
        line-height: 50px;
        text-align: center;
        margin-bottom: 22px;
      }
      .two-title{
        font-size: 26px;
        font-weight: 400;
        color: #666666;
        line-height: 37px;
        text-align: center;
      }
    }
    .fun{
      width: 100%;
      margin-top: 65px;
      .otherTitle{
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        .titleText::before{
          content: '';
          display: inline-block;
          width: 14px;
          height: 14px;
          background: #ff5d19;
          border-radius: 50%;
          margin-right: 16px;
        }
        .titleText{
          font-size: 30px;
          font-weight: 600;
          color: #ff5d19;
          line-height: 42px;
        }
      }
      .oneFunContent{
        .yqCode{
          width: 100%;
          font-size: 30px;
          font-weight: 600;
          text-align: left;
          color: #333333;
          line-height: 42px;
          padding-left: 71px;
          margin-top: 30px;
        }
        .codeArea{
          margin-top: 23px;
          padding-left: 71px;
          padding-right: 71px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .left{
            padding: 13px 98px;
            background-color: #f3f4f6;
            border-radius: 8px;
            font-size: 32px;
            font-weight: 500;
            color: #333333;
            /*line-height: 45px;*/
          }
          .right{
            background-color: #ff5d19;
            width: 170px;
            height: 70px;
            border-radius: 35px;
            font-size: 30px;
            font-weight: 400;
            text-align: center;
            color: #ffffff;
            line-height: 76px;
          }
        }
        .codeDesc{
          font-size: 26px;
          font-weight: 400;
          text-align: left;
          color: #999999;
          line-height: 37px;
          padding-left: 71px;
          margin-top: 24px;
        }
      }
      .share-btn-box{
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        .btn{
          font-size: 30px;
          font-weight: 400;
          color: #ffffff;
          line-height: 42px;
          padding: 14px 140px;
          background-color: #ff5d19;
          border-radius: 35px;
          margin-top: 43px;
        }
      }
    }
  }
}
.canvasShare{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .share-item{
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    .share-img{
      width: 100px;
      height: 100px;
      object-fit: cover;
      margin-bottom: 20px;
    }
    .share-desc{
      font-size: 22px;
      font-weight: 400;
      color: #333333;
      line-height: 30px;
    }
  }
}
.posters-container{
  width: 620px;
  height: 766px;
  position: absolute;
  bottom: 430px;
  left: 65px;
  right: 65px;
  border-radius: 20px;
  overflow: hidden;
  .canvasImg{
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
