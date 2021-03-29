<template>
  <div class="goods-detail-container" @click="IconMenu = false">
    <downapp v-if="DownAppShow" @changeDownApp="handleDownApp"></downapp>
    <van-sticky>
      <div class="nav">
        <div class="arrow-left">
          <img src="~/assets/images/goodsdetail/arrow-left.png" @click="toIndex" />
          <a :href="getUrl + 'category'" class="a-link" @click.prevent="()=> false">
            <van-icon name="wap-nav" size="18px" color="#999999" @click="$router.push('/category')" />
          </a>
        </div>
        <div class="center" @click="navtopagetop">
          <span data-index="0" :class="active == 0 ? 'active' : ''">{{ $t('newUserInfo.goods')}}</span>
          <span data-index="1" :class="active == 1 ? 'active' : ''">{{ $t('user_main.comont')}}</span>
          <span data-index="2" :class="active == 2 ? 'active' : ''">{{$t('newUserInfo.store')}}</span>
        </div>
        <div class="right-icon">
          <span><img src="~/assets/images/goodsdetail/home.png" @click="goHome" /></span>
          <span><img src="~/assets/images/goodsdetail/genduo.png" @click.stop="showIconMenu" /></span>
        </div>
        <transition name="van-fade">
          <div v-if="IconMenu" class="messageBox">
            <div class="item" @click="goMsgCenter">
              <van-icon size="4.714285vw" name="comment-o" />
              <span class="title">{{ $t('menu.message') }}</span>
            </div>
            <div class="item" @click="goCollection">
              <van-icon size="4.714285vw" name="like-o" />
              <span class="title">{{ $t('goodsDetail.myCollection') }}</span>
            </div>
          </div>
        </transition>
      </div>
    </van-sticky>
    <van-swipe class="my-swipe" :autoplay="3000" loop indicator-color="white">
      <van-swipe-item v-for="(item, index) in goodsDetailsData.imageList" :key="index">
        <img v-if="item.indexOf('mp4') === -1" v-lazy="baseImageUrl + item + '?x-oss-process=image/resize,w_1000/format,webp'" class="swiper-img" />
        <video v-else autoplay :src="baseImageUrl + item" type="video/mp4" width="100%" height="100%"></video>
      </van-swipe-item>
    </van-swipe>
    <!--  秒杀展示-->
    <!--  商品评分 关注 分享-->
    <div class="score">
      <div class="start-box">
        <div class="start">
          <van-rate v-model="starRating" readonly size="16px" color="#FAB647" allow-half void-icon="star" void-color="#eee" />
        </div>
        <div class="rate">{{ starRating }}</div>
        <div class="eval-count">
          {{ evealuteAllNum }}{{ $t('store.guige') }}
        </div>
      </div>
      <div class="share">
        <span v-if="fromFlag1 !== 3" class="share-left" @click="shareHandle">
          <img src="~assets/images/goodsdetail/likepro.png" />
        </span>
        <span v-if="fromFlag1 !== 3" class="line"></span>
        <span class="share-right" @click="handlerFollow(isFollow)">
          <img v-if="isFollow" src="~assets/images/goodsdetail/xihuan2.png" />
          <img v-else src="~assets/images/goodsdetail/love.png" />
        </span>
      </div>
      <div v-if="activityInfo.starting && activityInfo.active" class="skill">
        <div class="left">
          <van-icon size="5.14285vw" :name="require(`assets/images/goodsdetail/djs.png`)" />
          <span class="goods-sec-box-a1">{{ $t('seckill.name') }}</span>
        </div>
        <div class="right">
          <van-count-down :time="activityInfo.time" format="HH:mm:ss">
            <template v-slot="timeData">
              <span class="skill-title">セール終了まであと</span>
              <span class="item">{{timeData.hours&lt;10?'0'+timeData.hours:timeData.hours }}</span>
              <span class="item">{{ timeData.minutes&lt;10?'0'+timeData.minutes:timeData.minutes }}</span>
              <span class="item">{{ timeData.seconds&lt;10?'0'+timeData.seconds:timeData.seconds }}</span>
            </template>
          </van-count-down>
        </div>
      </div>
    </div>
    <!--  商品标题价格-->
    <div class="goods-title">
      <div class="goods_title_desc">
        <h1>{{ details.goodsInfo.goodsTitle }}</h1>
      </div>
      <!-- 价格显示 -->
      <div class="price_info">
        <div class="price-left-box">
          <div v-if="maxPrice > minPrice" class="market_price">
            <div class="price-l">
              <span class="price-num">{{minPrice/100}}</span>
              <i class="center-line">-</i>
              <span class="price-num">{{maxPrice/100}}</span>
            </div>
            <div v-if="activityInfo.rate > 0" class="price-r">
              <span style="text-decoration: line-through">{{lineMinPrice}}円-{{lineMaxPrice}}円</span>
            </div>
          </div>

          <div v-else class="market_price">
            <div class="price-l">
              <span class="price-num">{{minPrice/100}}</span>
            </div>
            <div v-if="(activityInfo.rate > 0) && (lineMinPrice !== minPrice/100)" class="price-r">
              <span class="throwprice price-num">{{lineMinPrice}}</span>
            </div>
          </div>

          <div v-if="!activityInfo.starting && activityInfo.type === 1" class="seckill_price_view_two">
            <span class="title">{{$t('goodsDetail.seckillPrice')}}</span>
            <div class="price-hz">
              <div v-if="maxPrice > minPrice">
                <span class="price-num">{{ Math.round(minPrice/100 -(minPrice/100 * activityInfo.noStartRate) /100)}}</span>
                <i class="center-line">-</i>
                <span class="price-num">{{ Math.round(maxPrice/100 -(maxPrice/100 * activityInfo.noStartRate) /100)}}</span>
              </div>
              <div v-else>
                <span class="price-num">{{minPrice/100 - Math.round((minPrice/100 * activityInfo.noStartRate) /100)}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--        是否免运费-->
      <div class="freightshow">
        <div v-if="
            goodsDetailsData.freightTemplate &&
            goodsDetailsData.freightTemplate.freightFreeFlag === 0
          " class="content">
          <img src="~assets/images/goodsdetail/youyunfei.png" alt="" />
          <span>{{ $t('goodsDetail.Freightisrequired') }}</span>
        </div>
        <div v-else class="content">
          <img src="~assets/images/goodsdetail/yunfei.png" alt="" />
          <span>{{ $t('goodsDetail.Freeshipping') }}</span>
        </div>
      </div>
      <!--        是否显示有积分可抵扣区域-->
      <div class="deduction">
        <div v-if="login">
          <span class="title">{{ $t('goodsDetail.pointsDeduction') }}</span>
          <span class="price-num">{{ minPrice / 100 > activityInfo.deductionIntegral ? activityInfo.deductionIntegral : minPrice / 100 }}</span>
        </div>
        <div v-else class="deduction">
          <nuxt-link :to='"/login?shareIntegralId=" + shareIntegralId'>登录后获取更多优惠</nuxt-link>
        </div>
      </div>
      <!--        满减活动展示-->
      <div v-if="activityInfo.fullReduction.length > 0 && activityInfo.type == 3" class="fullReduactive">
        <span v-for="item in activityInfo.fullReduction" :key="item.id" class="item">
          {{
            $t('newCoupon.fullbuyType2') +
            item.ruleRequirement +
            $t('goodsDetail.reduce') +
            item.ruleDiscount
          }}
        </span>
      </div>
    </div>
    <div class="cell_Group">
      <div class="deliveryLoc">
        <span class="title">{{$t('goodsDetail.shipAddress')}}</span>
        <!-- <span v-if="goodsDetailsData.goodsInventoryLocation === 1 || goodsDetailsData.goodsInventoryLocation === 3" class="content">{{$t('goodsDetail.China')}}</span> -->
        <!-- <span v-else class="content">{{$t('goodsDetail.Japan')}}</span> -->
        <span v-if="goodsDetailsData.goodsInventoryLocation === 1" class="content">{{$t('goodsDetail.stardayZh')}}</span>
        <span v-if="goodsDetailsData.goodsInventoryLocation === 2" class="content">{{$t('goodsDetail.stardayJpC')}}</span>
        <span v-if="goodsDetailsData.goodsInventoryLocation === 3" class="content">{{$t('goodsDetail.stardayCn')}}</span>
        <span v-if="goodsDetailsData.goodsInventoryLocation === 4" class="content">{{$t('goodsDetail.stardayJp')}}</span>
<!--        <span v-if="!DisplayTime" class="content">-->
<!--          {{ $t('goodsDetail.estimate') }}-->
<!--          {{-->
<!--            DisplayTimeStart == DisplayTimeEnd-->
<!--              ? DisplayTimeEnd-->
<!--              : DisplayTimeStart + '-' + DisplayTimeEnd-->
<!--          }}-->
<!--          {{ $t('goodsdetail.sendTimeContent2') }}-->
<!--        </span>-->
<!--        <span v-else class="content">{{ DisplayTime }}</span>-->
      </div>
<!--      <div v-if="isPresale" class="delivery">-->
<!--        <span class="title">{{ $t('goodsDetail.Presale') }}</span>-->
<!--        <span v-if="!DisplayTime" class="content">-->
<!--          {{-->
<!--            $t('goodsDetail.preSaleTime') +-->
<!--            (DisplayTimeStart == DisplayTimeEnd-->
<!--              ? DisplayTimeEnd-->
<!--              : DisplayTimeStart + '-' + DisplayTimeEnd)-->
<!--          }}-->
<!--        </span>-->
<!--        <span v-else class="content">{{ DisplayTime }}</span>-->
<!--      </div>-->
      <div class="delivery" @click="choseGoods">
        <span class="title">{{ $t('goodsdetail.select') }}</span>
        <span class="content">{{ $t('goodsDetail.attributes') }}</span>
        <van-icon name="arrow" size="14px" color="#999" />
      </div>
    </div>
    <div v-if="imageListcopy.length === 0 && descTextcopy === '' && fromFlag1 === 1" class="addTibox" @click="goTiPage">{{$t('newThreeClass.addExperiencetext')}}</div>
    <!--      商品详情new-->
    <div class="goods-details-box">
      <div class="title">{{ $t('supply.goodsdetail') }}</div>
      <div v-if="(imageListcopy.length > 0 || descTextcopy)" class="experiencebox">
        <div class="firstbox">
          <div class="leftbox">
            <img v-if="headImage" v-lazy="baseImageUrl + headImage + '?x-oss-process=image/resize,w_1000/format,webp'" alt="">
            <img v-else src="@/assets/images/index/defaultimg.png" alt="">
            <span>{{userName}}</span>
          </div>
          <div v-if="fromFlag1 === 1" class="rightbox" @click="goTiPage">
            {{$t('address.edit')}}
          </div>
        </div>
        <div class="twobox">
          {{descTextcopy}}
        </div>
        <div class="threebox">
          <img v-for="(item, index) in imageListcopy" :key="index" v-lazy="baseImageUrl + item + '?x-oss-process=image/resize,w_1000/format,webp'" @click="showBigCard(index)">
        </div>
      </div>
      <div class="ql-container ql-snow">
        <p class="description ql-editor" style="margin-block-start: 0; margin-block-end: 0" v-html="goodsDetailsData.textDescription"></p>
      </div>
      <!-- <div class="description">{{goodsDetailsData.textDescription}}</div> -->
      <div class="content" :class="!detailsmore ? 'more' : ''">
        <img v-for="(item, index) in goodsDetailsData.descriptionList" :key="index" v-lazy="baseImageUrl + item + '?x-oss-process=image/resize,w_1000/format,webp'" :alt="baseImageUrl + item" />
      </div>
      <div class="moredetails-button" @click="detailsBtn">
        <div v-if="!detailsmore" class="btn-item">
          <span>{{ $t('user_main.lowup') }}</span>
          <img src="~assets/images/goodsdetail/shouqi.png" alt="" />
        </div>
        <div v-else class="btn-item">
          <span>{{ $t('goodsdetail.lookmore') }}</span>
          <img src="~assets/images/goodsdetail/jinru.png" alt="" />
        </div>
      </div>
    </div>
    <!-- 商品评价new -->
    <div v-show="goodsEvaluateData.comment.length > 0" class="goods-eval">
      <div class="title">
        <div class="title-l">
          {{ $t('goodsdetail.goodsrate') }}{{ '(' + evealuteAllNum + ')' }}
        </div>
        <div class="title-r" @click="goEvaluate">
          <span>{{ $t('newUserInfo.viewAll') }}</span>
          <img src="~assets/images/goodsdetail/arrow-r.png" alt="" />
        </div>
      </div>
      <div class="commentlist">
        <div v-for="(item, index) in goodsEvaluateData.comment.slice(0, 2)" :key="index" class="list-item">
          <div class="titles">
            <div class="titles-l">
              <img v-if="item.userHeardImg" v-lazy="baseImageUrl + item.userHeardImg" class="userimg" alt="" />
              <img v-else class="userimg" src="@/assets/images/goodsdetail/default_header.png" alt="" />
              <span class="username">{{
                item.userName | anonymous(item.userName, item.anonymousFlag)
              }}</span>
            </div>
            <van-rate v-model="item.goodsSore" class="titles-r" size="4.5714285vw" readonly color="#FAB647" allow-half void-icon="star" void-color="#eee" />
          </div>
          <div class="evaltime">
            <span>{{ item.createTime.substring(0, 10) }}</span>
            <span class="spec">{{ item.specValue | specValuestr }}</span>
          </div>
          <div class="content">{{ item.commentContent }}</div>
          <div v-if="item.commentImgs.length > 0" class="commentimg">
            <img v-for="(prop, j) in item.commentImgs" :key="j" v-lazy="baseImageUrl + prop.imgUrl" @click="imagepreview(index, j)" />
          </div>
        </div>
      </div>
    </div>
    <!--      店铺 new-->
    <div class="store-new">
      <div class="store-t">
        <img v-lazy="
            details.storeInfo.logo
              ? baseImageUrl + details.storeInfo.logo
              : require('assets/images/empty/default2.png')
          " class="store-img" />
        <div class="store-info">
          <span class="name">{{ details.storeInfo.storeName }}</span>
          <div class="rate">
            <van-rate v-model="details.storeInfo.evaluate" size="12px" class="titles-r" readonly color="#FAB647" allow-half void-icon="star" void-color="#eee" />
            <span>{{ details.storeInfo.evaluate }}</span>
          </div>
          <div class="pro-num">
            <p class="pro-xl">
              <span>{{ $t('goodsdetail.Sales') }}</span>
              <span class="count">{{
                details.storeInfo.salesCount + $t('store.saleUnit')
              }}</span>
            </p>
            <p class="pro-eval">
              <span>{{ $t('goodsdetail.rate') }}</span>
              <span class="count">{{
                details.storeInfo.commentCount + $t('store.evalUnit')
              }}</span>
            </p>
          </div>
        </div>
        <div class="focuson" :class="details.storeInfo.follow === 0 ? '' : 'follow'" @click="follow">
          {{
            details.storeInfo.follow === 0
              ? $t('newAdd.focus')
              : $t('newAdd.noFocus')
          }}
        </div>
      </div>
      <div class="store-b">
        <div class="call-store" @click="contactStore">
          <img src="~assets/images/goodsdetail/email.png" alt="" />
          <span>{{ $t('goodsdetail.callstore') }}</span>
        </div>
        <div class="look-store" @click="goStore">
          <img src="~assets/images/goodsdetail/dianpu.png" alt="" />
          <span>{{ $t('goodsdetail.lookshop') }}</span>
        </div>
      </div>
    </div>
    <!-- 面包屑 -->
    <div v-if="details.goodsInfo" class="breadbox">
      <span @click="goCategoryPage">
        {{ details.goodsInfo.breadCrumbs.firstCateName }}
      </span>
      >
      <span @click="goCatePage">
        {{ details.goodsInfo.breadCrumbs.secCateName }}
      </span>
      >
      <span @click="goCatePage">
        {{ details.goodsInfo.breadCrumbs.thirdCateName }}
      </span>
      >
      <span>
        {{ details.goodsInfo.goodsTitle }}
      </span>
    </div>
    <shopRecommend v-if="storeCommonList.rows.length > 0" :list="storeCommonList.rows" :store-id="goodsDetailsData.storeId" />
    <div class="hotword">
      <p class="hote-header">{{$t('search.hotsearch')}}</p>
      <div class="hot-content">
        <div class="hot-scroll">
          <a v-for="(item, index) in hotwordData" :key="index" :href="getUrl + 'search/product/'+item+'/1'" @click.prevent="()=> false">
            <span class="hot-item" @click.stop="$router.push(`/search/product/${item}/1`)">{{item}}</span>
          </a>
        </div>
      </div>
    </div>
    <!--    sku-->
    <van-sku ref="sku" v-model="showSku" :sku="sku" :goods="goods" :goods-id="goodsid" :quota="quota" stepper-title="購入数" reset-stepper-on-hide reset-selected-sku-on-hide :quota-used="quotaUsed" :hide-stock="sku.hide_stock" hide-quota-text :custom-stepper-config="customStepperConfig" @sku-selected="sku_selected" @buy-clicked="onBuyClicked">
      <!-- 自定义 sku-header-price -->
      <template #sku-header-price="props">
        <div class="van-sku__goods-price">
          <span class="van-sku__price-num sku_price" style="font-size: 20px" v-text="handleprice(props.price.toString())">{{
              props.price.toString().indexOf('.') != -1
                ? props.price.replace('.00', '') + '円'
                : props.price.toString().indexOf('-') > -1
                ? props.price + '円'
                : props.price + '円'
            }}</span>
        </div>
      </template>

      <template #sku-actions="props">
        <div v-if="isClickButton" class="van-sku-actions">
          <van-button square size="large" color="#403B3B" :disabled="goodsDetailsData.isSelling!==1" @click="sureAddCart">{{ $t('goodsdetail.addcart') }}</van-button>
          <van-button square size="large" color="linear-gradient(to right, #ffa14b, #ff5d19)" :disabled="goodsDetailsData.isSelling!==1" @click="props.skuEventBus.$emit('sku:buy')">{{ $t('goodsdetail.nowpay') }}</van-button>
        </div>
        <div v-else class="van-sku-actions">
          <van-button square size="large" :class="isAdd_isBuyNow?'addcard':''" color="linear-gradient(to right, #ffa14b, #ff5d19)" :disabled="goodsDetailsData.isSelling!==1" @click="clickSure">{{ $t('supply.save') }}</van-button>
        </div>
      </template>
    </van-sku>
    <van-goods-action>
      <van-goods-action-icon icon-class="action_icon" :icon="require(`assets/images/goodsdetail/kefu1.png`)" @click="viewService" />
      <van-goods-action-icon v-if="fromFlag1 === 2" icon-class="action_icon" :icon="require(`assets/images/goodsdetail/shoopcar.png`)" @click="goToShoppingcart"/>
      <van-goods-action-button v-if="isSellOut && fromFlag1 === 2" color="#403B3B" type="warning" :text="$t('goodsdetail.addcart')" :disabled="goodsDetailsData.isSelling!==1" @click="addCart"/>
      <van-goods-action-button v-if="isSellOut && fromFlag1 === 2 || fromFlag1 === 3" color="linear-gradient(to right, #FFA14B, #FF5D19)" type="danger" :disabled="goodsDetailsData.isSelling!==1" :text="$t('goodsdetail.nowpay')" @click="buyNow" />
      <!--  立即购买    -->
      <div v-if="fromFlag1 === 1 && goodsDetailsData.isSelling=== 1" class="btnbox" @click="buyNow">
        <p>{{$t('goodsdetail.nowpay')}}</p>
        <p v-if="ratio1!=='0'">{{$t('newThreeClass.fanMacount').replace('M', (maxPrice * ratio1 / 100 / 100).toFixed(0))}}</p>
      </div>
      <!--  立即购买(商品下架、未通过、店铺禁用显示) -->
      <div v-if="fromFlag1 === 1 && goodsDetailsData.isSelling!==1" class="btnbox" style="opacity: 0.5">
        <p>{{$t('goodsdetail.nowpay')}}</p>
        <p v-if="ratio1!=='0'">{{$t('newThreeClass.fanMacount').replace('M', (maxPrice * ratio1 / 100 / 100).toFixed(0))}}</p>
      </div>
      <!--  立即分享 -->
      <div v-if="fromFlag1 === 1 && goodsDetailsData.isSelling === 1" class="btnbox1" @click="shareHandle">
        <p>{{$t('newThreeClass.shareNow')}}</p>
        <p v-if="ratio2!=='0'">
          {{$t('newThreeClass.canGetMacount').replace('M', (maxPrice * ratio2 / 100 / 100).toFixed(0))}}
        </p>
      </div>
      <!--  立即分享(商品下架、未通过、店铺禁用显示) -->
      <div v-if="fromFlag1 === 1 && goodsDetailsData.isSelling!==1" class="btnbox1" style="opacity: 0.5">
        <p>{{$t('newThreeClass.shareNow')}}</p>
        <p v-if="ratio2!=='0'">
          {{$t('newThreeClass.canGetMacount').replace('M', (maxPrice * ratio2 / 100 / 100).toFixed(0))}}
        </p>
      </div>
      <van-goods-action-button v-if="!isSellOut" color="#BBBBBB" type="danger" disabled :text="$t('seckill.saleOver')" />
    </van-goods-action>
    <van-dialog v-model="showService" :title="$t('goodsDetail.customerService')" :show-confirm-button="false" :show-cancel-button="false" close-on-click-overlay>
      <div class="serviceBox">
        <van-cell v-for="(item, index) in details.storeInfo.mails" :key="index" :title="$t('goodsdetail.msg') + (index + 1)" :icon="require('assets/images/goodsdetail/kefu2.png')" @click="goMsg(item)" />
      </div>
    </van-dialog>
<!--    分享-->
    <van-share-sheet v-model="showShare" :description="$t('share.shareDescription')" :options="shareOptions" @select="handleShareOption">
      <span slot="title">{{$t('share.friends')}}</span>
    </van-share-sheet>
    <van-overlay id="domOverlay" :show="overlayShow" @click.self="overlayShow = false">
      <div class="posters-container" @click.stop>
<!--        <canvas id="myCanvas" style="border-radius: 10px"></canvas>-->
        <van-loading v-if="createCanvasImage" type="spinner" size="24px" />
        <img v-else class="canvasImg" :src="canvasToImage" />
      </div>
    </van-overlay>
    <van-popup v-model="canvasShare" :style="{ height: '15%' }" :overlay="false" :safe-area-inset-bottom="true" :close-on-click-overlay="false" position="bottom" :round="true" get-container="#domOverlay">
      <div class="canvasShare">
        <div class="share-item" @click="downLoadImage">
          <img class="share-img" :src="require('~/assets/images/icon/domnImage.png')" />
          <span class="share-desc">{{$t('share.saveImage')}}</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { timeToSec, getDateXHL, timeDiff } from '@/util/tools'
import { ImagePreview } from 'vant'
import api from '@/static/api'
import { mapGetters, mapMutations } from 'vuex'
import shopRecommend from '~/components/goodsDetail/shopRecommend'
import downapp from '~/components/index/downapp'
export default {
  name: 'GoodsDetail',
  layout: 'content',
  scrollToTop: true,
  components: {
    shopRecommend,
    downapp
  },
  filters: {
    anonymous (name, flag) {
      // flag 0 否  1是
      return flag === 1 ? '****' : name
    },
    specValuestr (val) {
      return val ? val.replace(/\[|\]/g, '') : ''
    }
  },
  async asyncData ({ $axios, params, store, query, error }) {
    try {
      let imageListcopy = ''
      let descTextcopy = ''
      // let shareId = ''
      let headImage = ''
      let userName = ''
      let shareId = ''
      // const ISHARE = query.isShare || false
      if (query.fromFlag === '3' && query.storeUserId) {
        await $axios({
          url: '/starday-goods/user/goods/share/' + query.storeUserId + '/' + params.goodsid,
          method: 'get'
        }).then((res) => {
          console.log(res.data)
          if (res.code === 200) {
            imageListcopy = res.data.imageList || []
            descTextcopy = res.data.descText || ''
            headImage = res.data.headImage || ''
            userName = res.data.userName || ''
          }
        })
      } else if (query.shareIntegralId && query.shareIntegralId !== 'null' && query.shareIntegralId !== 'undefined') {
        shareId = query.shareIntegralId
        await $axios({
          url: '/starday-goods/user/goods/share/' + query.shareIntegralId,
          method: 'get'
        }).then((res) => {
          if (res.code === 200) {
            imageListcopy = res.data.goodsShareDTO.imageList || []
            descTextcopy = res.data.goodsShareDTO.descText || ''
            headImage = res.data.goodsShareDTO.headImage || ''
            userName = res.data.goodsShareDTO.userName || ''
          }
        })
      } else if (store.getters.login) {
        await $axios({
          url: '/starday-goods/user/share/edit/' + params.goodsid,
          method: 'get'
        }).then((res) => {
          if (res.code === 200) {
            imageListcopy = res.data.imageList || []
            descTextcopy = res.data.descText || ''
            headImage = res.data.headImage || ''
            userName = res.data.userName || ''
          }
        })
      }
      const { goodsid } = params
      const { baseImageUrl } = store.getters
      let goodsDetailsData = {}
      let goodsEvaluateData = {}
      const details = {}
      let storeCommonList = []
      let flashlist
      let starting
      let noStart
      let isPresale = false
      let DisplayTimeStart
      let DisplayTimeEnd
      let isShowDisPlay
      let DisplayTime = ''
      let isSellOut = true
      let quotaUsed = 0
      let quota = 0
      const goods = {
        // 默认商品 sku 缩略图
        picture: ''
      }
      const activityInfo = {
        fullReduction: [],
        time: '',
        rate: 0,
        noStartRate: 0,
        starting: false,
        isReduction: false,
        deductionIntegral: 0,
        active: false,
        type: 0
      }
      const sku = {
        tree: [],
        list: [],
        hide_stock: false,
        none_sku: false,
        collection_id: 2261,
        stock_num: 0,
        price: '0'
      }
      const originalPriceList = []
      // 现价的数组
      let priceList = []
      // let lineMinPrice, lineMaxPrice, minPrice, maxPrice, price
      await $axios.get(api.goods.goodsDetail + goodsid).then((res) => {
        if (res.code === 200) {
          goodsDetailsData = res.data
        }
      })
      await $axios.post(api.activity.info + '/' + goodsid).then((res) => {
        if (res.code === 200) {
          details.activityInfo = res.data
        }
      })
      await $axios.get(api.store.storeInfo, {
        params: {
          storeId: goodsDetailsData.storeId
        }
      }).then((res) => {
        if (res.code === 200) {
          res.data.evaluate = Number(res.data.evaluate)
          details.storeInfo = res.data
        }
      })
      // 获取店铺推荐商品
      await $axios.post(api.store.goods, {
        pageNo: 1,
        pageSize: 6,
        storeId: goodsDetailsData.storeId,
        sorted: 0,
        sortOrder: 'desc',
        listType: 4
      }).then((res) => {
        if (res.code === 200) {
          storeCommonList = res.data
        }
      })
      await $axios.get(api.goods.evaluate, {
        params: {
          goodsId: goodsid,
          pageNo: 1,
          pageSize: 5
        }
      })
        .then((res) => {
          if (res.code === 200) {
            goodsEvaluateData = res.data
          }
        })
      details.goodsInfo = goodsDetailsData
      // 判断商品是否参加活动
      if (details.activityInfo.activityId) {
        switch (details.activityInfo.activityType) {
          case 1:
            activityInfo.type = 1
            // 闪购活动 秒杀
            flashlist = details.activityInfo.flashList
            starting = flashlist.filter(item => item.timeState === 1)
            noStart = flashlist.filter(item => item.timeState === 0)
            if (starting.length > 0) {
              // 秒杀已经开始
              activityInfo.starting = true
              const activity = starting[0]
              const nowDate = activity.nowtimes
              const endDate = activity.nowtimes.split(' ')[0] + ' ' + activity.endTime
              activityInfo.time = timeDiff(endDate, nowDate)
              activityInfo.rate = activity.discount // 折扣比例
              quotaUsed = activity.buyNum
              quota = activity.limitNum
              // 商品总库存
              sku.stock_num = activity.stockNum - activity.buyNum
              if (Math.floor((activity.buyNum / activity.stockNum) * 100) === 100 || Math.floor((activity.leverNum / activity.stockNum) * 100) === 100) {
                isSellOut = false
              } else {
                isSellOut = true
              }
            } else if (noStart.length > 0) {
              // 秒杀未开始
              activityInfo.starting = false
              noStart = noStart.sort((a, b) => {
                return (timeToSec(a.startTimeString) - timeToSec(b.startTimeString))
              })
              const activity = noStart[0]
              const nowDate = activity.nowtimes
              const SatrtTime = activity.nowtimes.split(' ')[0] + ' ' + activity.startTimeString
              activityInfo.time = timeDiff(SatrtTime, nowDate)
              // 商品总库存
              sku.stock_num = goodsDetailsData.totalInventory
              activityInfo.noStartRate = activity.discount // 折扣比例
            }
            break
          case 2:
            // 商品参加折扣
            activityInfo.type = 2
            activityInfo.rate = details.activityInfo.discount.rate
            quotaUsed = details.activityInfo.discount.discountActivityGoodsDto.num
            quota = details.activityInfo.discount.discountActivityGoodsDto.limitNum
            sku.stock_num = details.activityInfo.discount.discountActivityGoodsDto.stock - details.activityInfo.discount.discountActivityGoodsDto.buyNum
            break
          case 3:
            // 商品参加满减
            activityInfo.type = 3
            activityInfo.fullReduction = details.activityInfo.reduction.ruleList
            activityInfo.rate = 0
            quotaUsed = details.activityInfo.reduction.goodsInventory - details.activityInfo.reduction.purchaseLimit
            quota = details.activityInfo.reduction.goodsBuyLimit
            sku.stock_num = details.activityInfo.reduction.goodsInventory
            activityInfo.isReduction = true
            break
          default:
            activityInfo.type = 0
            activityInfo.rate = 0
            sku.stock_num = goodsDetailsData.totalInventory || 0
        }
      } else {
        activityInfo.rate = 0
        // 商品总库存
        sku.stock_num = goodsDetailsData.totalInventory
      }
      // 处理sku
      goodsDetailsData.specList.forEach((item, index) => {
        const obj = { k: '', v: [], k_s: '' }
        obj.k = item.specName
        obj.k_s = 's' + (index + 1)
        item.specValueList.forEach((spec) => {
          const specItem = {}
          specItem.id = spec.id
          specItem.name = spec.specValueName
          if (spec.valueImage) {
            specItem.imgUrl = baseImageUrl + spec.valueImage + '?x-oss-process=image/resize,w_1000/format,webp' || ''
          }
          obj.v.push(specItem)
        })
        sku.tree.push(obj)
      })
      const goodsSkuDetailsList = goodsDetailsData.goodsSkuDetailsList
      goodsSkuDetailsList.forEach((item) => {
        const obj = {
          id: '', // skuId，下单时后端需要
          price: '', // 价格（单位分）
          s1: '', // 规格类目 k_s 为 s1 的对应规格值 id
          s2: '', // 规格类目 k_s 为 s2 的对应规格值 id
          s3: '', // 最多包含3个规格值，为0表示不存在该规格
          stock_num: 0 // 当前 sku 组合对应的库存
        }
        const slength = item.valueKey.split(',')
        obj.id = item.skuInfo.id
        // 判断是否有参加折扣活动
        if (activityInfo.rate !== 0 || activityInfo.isReduction) {
          obj.price = (item.skuInfo.skuMarketPrice - Math.round((item.skuInfo.skuMarketPrice * activityInfo.rate) / 100)) * 100
          originalPriceList.push(item.skuInfo.skuMarketPrice)
          obj.stock_num = sku.stock_num
        } else if (activityInfo.rate === 0) {
          obj.price = item.skuInfo.skuMarketPrice * 100
          obj.stock_num = item.skuInfo.skuInventory
        }
        for (let index = 0; index < slength.length; index++) {
          obj['s' + (index + 1)] = slength[index]
        }
        sku.list.push(obj)
      })
      priceList = sku.list.map(item => item.price)
      const lineMinPrice = Math.min(...originalPriceList)
      const lineMaxPrice = Math.max(...originalPriceList)
      const minPrice = Math.min(...priceList)
      const maxPrice = Math.max(...priceList)
      let price
      if (minPrice === maxPrice) {
        sku.price = minPrice / 100
        price = minPrice / 100
      } else {
        sku.price = `${minPrice / 100}-${maxPrice / 100} <span style="font-size:10px;"> 円</span>`
        price = `${minPrice / 100}-${maxPrice / 100} <span style="font-size:10px;"> 円</span>`
      }
      if (
        goodsDetailsData.goodsDisplayTimeType === 2 &&
        goodsDetailsData.goodsPreSaleTimeStart !== null
      ) {
        isPresale = true
        DisplayTimeStart = goodsDetailsData.goodsPreSaleTimeStart.split(' ')[0]
        DisplayTimeEnd = goodsDetailsData.goodsPreSaleTimeEnd.split(' ')[0]
      } else if (
        goodsDetailsData.goodsDisplayTimeType === 2 &&
        goodsDetailsData.goodsPreSaleTimeStart == null
      ) {
        isPresale = false
      } else if (
        goodsDetailsData.goodsDisplayTimeType === 1 &&
        goodsDetailsData.goodsDisplayTimeStart == null
      ) {
        isShowDisPlay = false
      } else if (
        goodsDetailsData.goodsDisplayTimeType === 1 &&
        goodsDetailsData.goodsDisplayTimeStart === 0
      ) {
        DisplayTime = '当日达'
        isShowDisPlay = true
      } else if (
        goodsDetailsData.goodsDisplayTimeType === 1 &&
        goodsDetailsData.goodsDisplayTimeStart !== null
      ) {
        isShowDisPlay = true
        DisplayTimeStart = getDateXHL(goodsDetailsData.goodsDisplayTimeStart)
        DisplayTimeEnd = getDateXHL(goodsDetailsData.goodsDisplayTimeEnd)
      }
      goods.picture = sku.tree[0].v[0].imgUrl ? sku.tree[0].v[0].imgUrl : ''

      const seoData = await $axios.get('starday-system/user/seo/info/' + params.goodsid + '/0/2')
      if (!seoData.data || !seoData.data.title) {
        seoData.data = {
          title: details.goodsInfo.goodsTitle + '｜Starday市場',
          keyWords:
            details.goodsInfo.goodsTitle +
            ',' +
            details.goodsInfo.goodsTitle +
            '通贩,starday,starday市場,starday mart,通販,インターネットショッピング,オンラインショッピング',
          des:
            details.goodsInfo.goodsTitle +
            '通販のページ、人気の' +
            (details.goodsInfo
              ? details.goodsInfo.breadCrumbs.thirdCateNameJp
              : '') +
            'がお得な価格で登場！' +
            details.goodsInfo.goodsTitle +
            'の商品詳細ページです。商品の概要や素材、 カラーバリエーションなどをご覧いただけます。',
          id: params.goodsid
        }
      }
      const hotwordData = await $axios.post('/starday-elasticsearch/search/random/tags', { keywords: '', sortOrder: (new Date().getTime() / 1000) - [1, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000][Math.floor(Math.random() * 10)] })
      return {
        starRating: goodsEvaluateData.averageScore * 1,
        details,
        goodsEvaluateData,
        storeCommonList,
        activityInfo,
        goodsDetailsData,
        lineMinPrice,
        lineMaxPrice,
        minPrice,
        maxPrice,
        price,
        sku,
        isPresale,
        DisplayTimeStart,
        DisplayTimeEnd,
        isShowDisPlay,
        DisplayTime,
        goods,
        goodsid,
        quotaUsed,
        quota,
        isSellOut,
        seoData: seoData.data,
        imageListcopy,
        descTextcopy,
        shareId,
        fromFlag1: query.fromFlag * 1 || 2,
        headImage,
        userName,
        // shareId,
        shareIntegralId: query.shareIntegralId || '',
        hotwordData: hotwordData.data
      }
    } catch (e) {
      error(e)
    }
  },
  data () {
    return {
      createCanvasImage: true,
      canvasShare: false,
      canvasToImage: '',
      overlayShow: false,
      showShare: false,
      DownAppShow: false,
      IconMenu: false,
      active: 0,
      detailsmore: false, // 查看商品详情更多
      showSku: false,
      isClickButton: false,
      isFollow: true, // 商品是否关注
      showService: false,
      ratio1: '0',
      ratio2: '0',
      isAdd_isBuyNow: false,
      touristCartList: [], // 购物车数据(未登录)
      storeInfoObj: {
        shopItems: [] // 店铺下具体商品信息
      }, // 店铺信息对象
      storeName: '', // 店铺名称
      storeType: '', // 店铺类型(0 自营，1 第三方)
      touristCartData: [],
      shareOptions: [
        {
          name: 'line',
          icon: require('~/assets/images/icon/share-line.png'),
          className: 'share-icon-desc'
        },
        {
          name: this.$t('share.link'),
          icon: require('~/assets/images/icon/share-lianjie.png'),
          className: 'share-icon-desc'
        },
        {
          name: this.$t('share.posters'),
          icon: require('~/assets/images/icon/toimage.png'),
          className: 'share-icon-desc'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl',
      login: 'login',
      getLoginData: 'userInfo',
      downApp: 'downApp'
    }),
    getUrl () {
      return process.env.proxyUrl
    },
    evealuteAllNum () {
      return this.goodsEvaluateData.totalNum
    },
    customStepperConfig () {
      return {
        // 自定义限购文案
        quotaText: '一回あたりの注文上限は' + this.quota + 'つ',
        // 自定义步进器超过限制时的回调
        handleOverLimit: (data) => {
          const { action, limitType, quota, quotaUsed, startSaleNum } = data
          if (action === 'minus') {
            this.$toast(startSaleNum > 1 ? `最小注文量は${startSaleNum}つ` : '少なくとも一つを選んでください')
          } else if (action === 'plus') {
            if (limitType === 0) {
              // this.$toast(this.$t('goodsdetail.limitation') + `${quota}` + this.$t('goodsdetail.unit'))
              let msg = `一回あたりの注文上限は${quota}つ`
              if (quotaUsed > 0) { msg += `，個をご購入しました${quotaUsed}` }
              this.$toast(msg)
            } else {
              this.$toast('在庫不足')
            }
          }
        }
      }
    }
  },
  created () {
    if (!this.details.goodsInfo) {
      this.$toast('此商品暂时不可用')
    }
  },
  mounted () {
    this.DownAppShow = this.downApp
    this.getGoodsTipInfo()
    window.sessionStorage.setItem('activityInfo', JSON.stringify(this.activityInfo))
    window.sessionStorage.setItem('details', JSON.stringify(this.details))
    this.touristCartData = JSON.parse(window.sessionStorage.getItem('touristCartData')) || []
    document.getElementsByClassName('content-box')[0].addEventListener('scroll', this.scrollEvent)
    if (this.login) {
      this.goodsIsFollow()
      this.activityInfo.deductionIntegral = this.getLoginData.integral
    }
    this.queryIntegralRatio()
    this.getStoreInfo()
  },
  destroyed () {
    document.getElementsByClassName('content-box')[0].removeEventListener('scroll', this.scrollEvent)
  },
  methods: {
    ...mapMutations(['SET_ORDERINFO', 'setGoodsId', 'setTouristBuyInfo']),
    handleShareOption (option, index) {
      const url = encodeURIComponent('https:m.starday.jp')
      switch (index) {
        case 0:
          location.href = `https://social-plugins.line.me/lineit/share?url=${url}`
          break
        case 1:
          this.copyLink()
          this.showShare = false
          break
        case 2:
          this.showShare = false
          this.overlayShow = true
          this.postersHandle()
          break
      }
    },
    // 生成海报
    async postersHandle () {
      const vm = this
      let _url = location.origin + location.pathname
      const _str = []
      // eslint-disable-next-line eqeqeq
      if (this.fromFlag1 == 1) {
        // 获取分享ID
        const params = {
          goodsId: vm.$route.params.goodsid,
          fromFlag: vm.$route.query.isFrom * 1 || 1,
          descText: vm.descTextcopy,
          imageList: vm.imageListcopy
        }
        await vm.$axios.post('starday-goods/user/share/add', params).then((res) => {
          if (res.code === 200) {
            vm.shareIntegralId = res.data
          }
        })
      }
      if (vm.getLoginData.id) {
        if (vm.$route.query) {
          for (const i in vm.$route.query) {
            if (i !== 'shareId' && i !== 'shareSource' && i !== 'shareTime' && i !== 'fromFlag') {
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
      _url += '&fromFlag=2&shareIntegralId=' + this.shareIntegralId
      this.$axios.get(api.goods.getQr, {
        params: {
          imageUrl: '',
          text: _url
        }
      }
      ).then((response) => {
        // 商品主图
        const mainImage = this.baseImageUrl + (this.goodsDetailsData.imageList[0].includes('mp4') ? this.goodsDetailsData.imageList[1] : this.goodsDetailsData.imageList[0])
        const mainTitle = this.details.goodsInfo.goodsTitle
        const canvas = document.createElement('canvas')
        const canvasBox = document.getElementsByClassName('posters-container')[0]
        const canvasBoxW = window.getComputedStyle(canvasBox).width.slice(0, -2) * 1
        const canvasBoxH = window.getComputedStyle(canvasBox).height.slice(0, -2) * 1
        const ctx = canvas.getContext('2d')
        const QRtext = this.$t('share.QRdesc')
        // canvas的实际渲染倍率
        const ratio = this.getPixelRatio(ctx)
        canvas.width = canvasBoxW * ratio
        canvas.height = canvasBoxH * ratio
        canvas.style.width = canvasBoxW + 'px' // 300 410
        canvas.style.height = canvasBoxH + 'px'
        ctx.beginPath()
        ctx.fillStyle = 'rgba(255, 255, 255, 1)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        let drawTxt = '' // 当前绘制的内容
        let drawLine = 1 // 第几行开始绘制
        let drawIndex = 0 // 当前绘制内容的索引
        const drawX = 15 * ratio; let drawY = (canvasBoxW + 20) * ratio
        ctx.fillStyle = '#333333'
        ctx.font = `normal normal 500 ${15 * ratio}px 'Microsoft Yahei'`
        ctx.textBaseLine = 'middle'
        if (ctx.measureText(mainTitle).width <= canvasBoxW * 0.6 * ratio) {
          ctx.fillText(mainTitle.substring(drawIndex), drawX, drawY)
        } else {
          for (let i = 0; i < mainTitle.length; i++) {
            drawTxt += mainTitle[i]
            if (ctx.measureText(drawTxt).width >= canvasBoxW * 0.6 * ratio) {
              if (drawLine >= 2) {
                ctx.fillText(mainTitle.substring(drawIndex, i) + '...', drawX, drawY)
                break
              } else {
                ctx.fillText(mainTitle.substring(drawIndex, i + 1), drawX, drawY)
                drawIndex = i + 1
                drawLine += 1
                drawY += 20 * ratio
                drawTxt = ''
              }
            } else if (i === mainTitle.length - 1) {
              ctx.fillText(mainTitle.substring(drawIndex), drawX, drawY)
            }
          }
        }
        let sharePrice, shareLinePrice
        // 处理价格
        if (this.maxPrice > this.minPrice) {
          sharePrice = `${this.minPrice / 100}円-${this.maxPrice / 100}円`
          ctx.fillStyle = '#ff5d19'
          ctx.font = `normal normal 700 ${18 * ratio}px 'Microsoft Yahei'`
          ctx.fillText(sharePrice, drawX, (canvasBoxH - (canvasBoxW * 0.1)) * ratio)
          if (this.activityInfo.rate > 0) {
            shareLinePrice = `${this.lineMinPrice}円-${this.lineMaxPrice}円`
            ctx.fillStyle = '#999999'
            ctx.font = `normal normal 700 ${18 * ratio}px 'Microsoft Yahei'`
            const W = ctx.measureText(sharePrice).width
            ctx.font = `normal normal 700 ${12 * ratio}px 'Microsoft Yahei'`
            ctx.fillText(shareLinePrice, drawX + W, (canvasBoxH - (canvasBoxW * 0.1)) * ratio)
            ctx.beginPath()
            ctx.lineWidth = 1 * ratio
            ctx.strokeStyle = '#999999'
            ctx.moveTo(drawX + W, (canvasBoxH - (canvasBoxW * 0.1) - 4.5) * ratio)
            ctx.lineTo(drawX + W + ctx.measureText(sharePrice).width, (canvasBoxH - (canvasBoxW * 0.1) - 4.5) * ratio)
            ctx.stroke()
            ctx.closePath()
          }
        } else {
          sharePrice = `${this.minPrice / 100}円`
          ctx.fillStyle = '#ff5d19'
          ctx.font = `normal normal 700 ${18 * ratio}px 'Microsoft Yahei'`
          ctx.fillText(sharePrice, drawX, (canvasBoxH - (canvasBoxW * 0.1)) * ratio)
          if (this.activityInfo.rate > 0 && this.lineMinPrice !== this.minPrice / 100) {
            shareLinePrice = this.lineMinPrice + '円'
            ctx.fillStyle = '#999999'
            ctx.font = `normal normal 700 ${18 * ratio}px 'Microsoft Yahei'`
            const W = ctx.measureText(sharePrice).width
            ctx.font = `normal normal 700 ${12 * ratio}px 'Microsoft Yahei'`
            ctx.fillText(shareLinePrice, drawX + W, (canvasBoxH - (canvasBoxW * 0.1)) * ratio)
            ctx.beginPath()
            ctx.lineWidth = 1 * ratio
            ctx.strokeStyle = '#999999'
            ctx.moveTo(drawX + W, (canvasBoxH - (canvasBoxW * 0.1) - 4.5) * ratio)
            ctx.lineTo(drawX + W + ctx.measureText(sharePrice).width, (canvasBoxH - (canvasBoxW * 0.1) - 4.5) * ratio)
            ctx.stroke()
            ctx.closePath()
          }
        }
        // 长按识别二维码
        ctx.fillStyle = '#333333'
        ctx.font = `normal normal 500 ${12 * ratio}px 'Microsoft Yahei'`
        ctx.textBaseLine = 'middle'
        ctx.fillText(QRtext, canvasBoxW * ratio - ctx.measureText(QRtext).width - 20, canvasBoxH * 0.96 * ratio)
        // 商品主图
        const topImage = new Image()
        const QRimage = new Image()
        // QRimage.crossOrigin = 'anonymous'
        QRimage.src = response.data
        QRimage.onload = () => {
          ctx.drawImage(QRimage, canvasBoxW * 0.7 * ratio + 20, canvasBoxW * ratio + 20, canvasBoxW * 0.22 * ratio, canvasBoxW * 0.22 * ratio)
        }
        topImage.crossOrigin = 'anonymous'
        topImage.src = mainImage + '?' + (+new Date())
        topImage.onload = () => {
          ctx.drawImage(topImage, 0, 0, canvasBoxW * ratio, canvasBoxW * ratio)
          this.canvasToImage = canvas.toDataURL('image/png', 1)
          this.canvasShare = true
          this.createCanvasImage = false
        }
        ctx.save()
      })
    },
    downLoadImage () {
      const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      saveLink.href = this.canvasToImage
      saveLink.download = new Date().getTime()
      const event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      saveLink.dispatchEvent(event)
      this.overlayShow = false
      this.canvasShare = false
    },
    getPixelRatio (context) {
      const backingStore = context.backingStorePixelRatio || context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1
      return (window.devicePixelRatio || 1) / backingStore
    },
    handleDownApp (e) {
      this.DownAppShow = e
    },
    goToShoppingcart () {
      if (this.login) {
        this.$router.push('/shoppingcart')
      } else {
        this.$router.push('/touristCart')
      }
    },
    // 商品下架、审核未通过、店铺禁用提示信息
    getGoodsTipInfo () {
      if (this.goodsDetailsData.isSelling !== 1) {
        this.$toast.fail(this.$t('goodsdetail.goodsSaleCondition'))
      }
    },
    queryIntegralRatio () {
      this.$axios.get(api.distribution.ratio).then((res) => {
        if (res.code === 200) {
          this.ratio1 = res.data.oneselfProportion
          this.ratio2 = res.data.shareProportion
        }
      })
    },
    // 字典查询-分享商品返积分:订单积分比例（立即购买） ----> 此方法作废
    querydictionariesBuy () {
      const code = 'SHARE_GOODS_RECEIVE_INTEGRAL_ONESELF'
      const groupCode = 'INTEGRAL_SETTING'
      this.$axios.get('starday-system/dict/getValue', { params: { code, groupCode } }).then((res) => {
        if (res.code === 200) {
          this.ratio1 = res.data
        }
      })
    },
    // 字典查询-分享商品返积分:订单积分比例（立即分享） ----> 此方法作废
    querydictionariesShare () {
      const code = 'SHARE_GOODS_RECEIVE_INTEGRAL'
      const groupCode = 'INTEGRAL_SETTING'
      this.$axios.get('starday-system/dict/getValue', { params: { code, groupCode } }).then((res) => {
        if (res.code === 200) {
          this.ratio2 = res.data
        }
      })
    },
    goStop () {
      return false
    },
    goFenxiang () {
      this.$router.push('/personal/sharegoods?goodsId=' + this.details.goodsInfo.id + '&fromFlag=' + this.fromFlag1 + '&integral=' + (this.maxPrice * this.ratio2 / 100 / 100).toFixed(0))
    },
    goTiPage () {
      this.$router.push('/personal/userexperience?goodsId=' + this.details.goodsInfo.id + '&fromFlag=' + this.fromFlag1)
      window.sessionStorage.setItem('prefixPage', 'product')
      window.sessionStorage.setItem('prePage', location.pathname)
    },
    toIndex () {
      const path = window.sessionStorage.getItem('page')
      const prefixPageName = window.sessionStorage.getItem('prefixPage')
      const prePageName = window.sessionStorage.getItem('prePage')
      const prefixPageName1 = window.sessionStorage.getItem('prefixPage1')
      const prePageName1 = window.sessionStorage.getItem('prePage1')
      if (path === 'flash') {
        this.$router.push('/flash')
        window.sessionStorage.removeItem('page')
      } else if (path === 'shoppingcart') {
        this.$router.push('/shoppingcart')
        window.sessionStorage.removeItem('page')
      } else if (path === 'touristCart') {
        this.$router.push('/touristCart')
        window.sessionStorage.removeItem('page')
      } else if (path === 'distributionCenter') {
        this.$router.push('/personal/distributionCenter')
        window.sessionStorage.removeItem('page')
      } else if (path === 'chooseProductLibrary') {
        this.$router.push('/personal/chooseProductLibrary')
        window.sessionStorage.removeItem('page')
      } else if (path === 'productLibrary') {
        this.$router.push('/personal/productLibrary')
        window.sessionStorage.removeItem('page')
      } else if (path === 'shareDistributionCenter') {
        this.$router.push('/personal/shareDistributionCenter?id=' + this.$route.query.id)
        window.sessionStorage.removeItem('page')
      } else if (path === 'myCommander') {
        this.$router.push('/personal/myCommander')
        window.sessionStorage.removeItem('page')
      } else if (prefixPageName === 'promotiondiscount' || prefixPageName === 'promotiongoods' || prefixPageName === 'promotionrank') {
        this.$router.push(prePageName)
        window.sessionStorage.removeItem('prefixPage')
        window.sessionStorage.removeItem('prePage')
      } else if (prefixPageName1 === 'outNav1') {
        this.$router.push(prePageName1)
        window.sessionStorage.removeItem('prefixPage1')
        window.sessionStorage.removeItem('prePage1')
      } else {
        this.$router.push('/')
        window.sessionStorage.removeItem('page')
      }
    },
    async copyLink () {
      this.IconMenu = false
      const _this = this
      // eslint-disable-next-line eqeqeq
      if (this.fromFlag1 == 1) {
        // 获取分享ID
        const params = {
          goodsId: _this.$route.params.goodsid,
          fromFlag: _this.$route.query.isFrom * 1 || 1,
          descText: _this.descTextcopy,
          imageList: _this.imageListcopy
        }
        await _this.$axios.post('starday-goods/user/share/add', params).then((res) => {
          if (res.code === 200) {
            _this.shareIntegralId = res.data
          }
        })
      }
      let _url = location.origin + location.pathname
      const _str = []
      if (_this.getLoginData.id) {
        if (_this.$route.query) {
          for (const i in _this.$route.query) {
            if (i !== 'shareId' && i !== 'shareSource' && i !== 'shareTime' && i !== 'fromFlag') {
              _str.push(i + '=' + _this.$route.query[i])
            }
          }
        }
        if (_str.length) {
          _url = _url + '?' + _str.join('&') + '&shareId=' + _this.getLoginData.id + '&shareSource=2&shareTime=' + Math.floor(new Date().getTime() / 1000)
        } else {
          _url = _url + '?shareId=' + _this.getLoginData.id + '&shareSource=2&shareTime=' + Math.floor(new Date().getTime() / 1000)
        }
      }
      _url += '&fromFlag=2&shareIntegralId=' + this.shareIntegralId
      _this.$copyText(_url).then(
        function (e) {
          _this.$toast.success(_this.$t('home.copysuccess'))
        },
        function (e) {
          _this.$toast.fail(_this.$t('home.copyerror'))
        }
      )
    },
    shareHandle () {
      if (!this.login) { this.$router.push('/login') }
      this.showShare = true
    },
    goCategoryPage () {
      this.$router.push(
        '/category?id=' + this.details.goodsInfo.breadCrumbs.firstCateId
      )
    },
    goCatePage () {
      window.sessionStorage.setItem('page', 'product-goodsid')
      this.$router.push(
        '/cate/' +
        this.details.goodsInfo.breadCrumbs.thirdCateId +
        '/categoryId?name=' +
        this.details.goodsInfo.breadCrumbs.thirdCateName
      )
    },
    goMsg (item) {
      if (this.login) {
        const that = this
        const obj = {
          sendMail: item,
          sendUserName: that.details.storeInfo.storeName
        }
        sessionStorage.setItem('msgInfo', JSON.stringify(obj))
        this.$router.push(
          '/personal/contactPla?type=2&goodsId=' + this.$route.params.goodsid
        )
      } else {
        this.$router.push('/login?shareIntegralId=' + this.shareIntegralId)
      }
    },
    goodsIsFollow () {
      const _this = this
      const data = {
        spuId: _this.goodsid
      }
      _this.$axios.post(api.goods.isFollow, data).then((res) => {
        if (res.code === 200) {
          _this.isFollow = !res.data[0].isFollow
        } else {
          _this.$toast('失败')
        }
      })
    },
    navtopagetop (ev) {
      this.IconMenu = false
      const dom = document.getElementsByClassName('content-box')[0]
      const H = document.getElementsByClassName('van-sticky')[0].clientHeight
      switch (ev.target.dataset.index) {
        case '0':
          dom.scrollTo(0, 0)
          this.active = 0
          break
        case '1':
          this.active = 1
          dom.scrollTo(0, document.getElementsByClassName('goods-eval')[0].offsetTop - H)
          break
        case '2':
          this.active = 2
          dom.scrollTo(0, document.getElementsByClassName('store-new')[0].offsetTop - H)
          break
        default:
          this.active = 0
          dom.scrollTo(0, 0)
      }
    },
    scrollEvent (e) {
      const H = document.getElementsByClassName('van-sticky')[0].clientHeight
      const goodeval = document.getElementsByClassName('goods-eval')[0].offsetTop - H
      const store = document.getElementsByClassName('store-new')[0].offsetTop - H
      this.scroll = e.target.scrollTop
      if (this.scroll >= goodeval && this.scroll < store) {
        this.active = 1
      } else if (this.scroll >= store) {
        this.active = 2
      } else {
        this.active = 0
      }
    },
    handleprice (p) {
      const _i = p.includes('<')
      if (_i) {
        return p.slice(0, p.indexOf('<')) + '円'
      } else if (p.includes('.')) {
        return p.replace('.00', '') + '円'
      } else if (p.includes('-')) {
        return p + '円'
      } else {
        return p + '円'
      }
    },
    onClickLeft () {
      this.$router.back()
    },
    goHome () {
      this.$router.push('/')
    },
    showIconMenu () {
      this.IconMenu = !this.IconMenu
    },
    goMsgCenter () {
      this.IconMenu = false
      if (this.login) {
        this.$router.push('/personal/emailList')
      } else {
        this.$router.push('/login?shareIntegralId=' + this.shareIntegralId)
      }
    },
    goCollection () {
      if (this.login) {
        this.$router.push('/personal/attentiongoods')
      } else {
        this.$router.push('/login?shareIntegralId=' + this.shareIntegralId)
      }
    },
    detailsBtn () {
      if (!this.detailsmore) {
        const dom = document.getElementsByClassName('content-box')[0]
        const H = document.getElementsByClassName('van-sticky')[0].clientHeight
        dom.scrollTo(
          0,
          document.getElementsByClassName('goods-details-box')[0].offsetTop - H
        )
      }
      this.IconMenu = false
      this.detailsmore = !this.detailsmore
    },
    showBigCard (index) {
      const vm = this
      const imgs = JSON.parse(JSON.stringify(this.imageListcopy))
      const imgarr = []
      imgs.forEach((item) => {
        imgarr.push(vm.baseImageUrl + item)
      })
      ImagePreview({
        images: imgarr,
        startPosition: index,
        closeable: true
      })
    },
    // 评论图片预览
    imagepreview (a, b) {
      const p = this.goodsEvaluateData.comment[a]
      const imgs = []
      p.commentImgs.forEach((item) => {
        imgs.push(this.baseImageUrl + item.imgUrl)
      })
      ImagePreview({
        images: imgs,
        startPosition: b,
        closeable: true
      })
    },
    goEvaluate () {
      this.$router.push('/product/goodsEvaluate?id=' + this.goodsDetailsData.id)
    },
    goStore () {
      this.setGoodsId(this.goodsid)
      this.$router.push('/store/' + this.goodsDetailsData.storeId)
    },
    follow () {
      this.IconMenu = false
      const _this = this
      const data = {
        state: !_this.details.storeInfo.follow,
        storeId: _this.goodsDetailsData.storeId
      }
      _this.$axios.post(api.store.follow, data).then((res) => {
        if (res.code === 200) {
          _this.details.storeInfo.follow = res.data
        }
      })
    },
    // 加入购物车
    addCart () {
      const _this = this
      _this.isClickButton = false
      _this.showSku = true
      _this.isAdd_isBuyNow = true
      let str = ''
      // 处理剩余数量 日文
      setTimeout(() => {
        const remain = document.getElementsByClassName('van-sku__stock')
        const choseEl = document.getElementsByClassName('van-sku-header-item')[1]
        remain[0].innerHTML = _this.$t('newConfirmOrder.candian') + _this.sku.stock_num + _this.$t('newConfirmOrder.danweijian')
        _this.goodsDetailsData.specList.forEach((item) => {
          str += ' ' + item.specName
        })
        choseEl.innerHTML = _this.$t('newConfirmOrder.alreadySelect') + str
      }, 300)
    },
    // 立即购买
    buyNow () {
      const _this = this
      _this.isClickButton = false
      _this.showSku = true
      _this.isAdd_isBuyNow = false
      let str = ''
      // 处理剩余数量 日文
      setTimeout(() => {
        const remain = document.getElementsByClassName('van-sku__stock')
        const choseEl = document.getElementsByClassName('van-sku-header-item')[1]
        const chooseActive = document.getElementsByClassName('van-sku-row__item van-sku-row__item--active')
        if (chooseActive.length > 0) {
          chooseActive.forEach((item) => {
            str += ' ' + item.textContent
          })
          choseEl.innerHTML = _this.$t('newConfirmOrder.alreadySelect') + str
        } else {
          remain[0].innerHTML = _this.$t('newConfirmOrder.candian') + _this.sku.stock_num + _this.$t('newConfirmOrder.danweijian')
          _this.goodsDetailsData.specList.forEach((item) => {
            str += ' ' + item.specName
          })
          choseEl.innerHTML = _this.$t('goodsdetail.p1') + str
        }
      }, 300)
    },
    contactStore () {
      this.IconMenu = false
      const vm = this
      if (vm.login) {
        if (vm.details.storeInfo.mails.length > 1) {
          vm.showService = true
        } else {
          vm.goMsg(...vm.details.storeInfo.mails)
        }
      } else {
        this.$router.push('/login?shareIntegralId=' + this.shareIntegralId)
      }
    },
    viewService () {
      this.IconMenu = false
      const that = this
      if (this.login) {
        if (that.details.storeInfo.mails.length > 1) {
          that.showService = true
        } else {
          that.goMsg(...that.details.storeInfo.mails)
        }
      } else {
        this.$router.push('/login?shareIntegralId=' + this.shareIntegralId)
      }
    },
    sku_selected (e) {
      const _this = this
      let str = ''
      if (process.client) {
        this.$nextTick(() => {
          const remain = document.getElementsByClassName('van-sku__stock')[0]
          const choseEl = document.getElementsByClassName('van-sku-header-item')[1]
          const chooseActive = document.getElementsByClassName('van-sku-row__item van-sku-row__item--active')
          if (choseEl) { choseEl.innerHTML = _this.$t('newConfirmOrder.alreadySelect') }
          if (remain && e.selectedSkuComb) {
            remain.innerHTML = _this.$t('newConfirmOrder.candian') + e.selectedSkuComb.stock_num + _this.$t('newConfirmOrder.danweijian')
          } else if (remain) {
            remain.innerHTML = _this.$t('newConfirmOrder.candian') + _this.sku.stock_num + _this.$t('newConfirmOrder.danweijian')
          }
          if (chooseActive && chooseActive.length > 0) {
            chooseActive.forEach((item) => {
              str += ' ' + item.textContent
            })
            choseEl.innerHTML = _this.$t('newConfirmOrder.alreadySelect') + str
          } else if (choseEl) {
            _this.goodsDetailsData.specList.forEach((item) => {
              str += ' ' + item.specName
            })
            choseEl.innerHTML = _this.$t('goodsdetail.p1') + str
          }
        })
      }
    },
    beSort (arr) {
      const len = arr.length
      for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {
          if (arr[j] > arr[j + 1]) {
            const temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    },
    async joinSeckill (num, id) {
      const _this = this
      if (_this.activityInfo.starting && _this.activityInfo.active) {
        const data = {
          activityId: _this.details.activityInfo.activityId,
          buyNum: num,
          spuId: _this.goodsid,
          skuId: id
        }
        await _this.$axios.get(api.goods.joinSeckill, { params: data })
      }
    },
    // sku-确认
    clickSure () {
      const _this = this
      const storeUserId = _this.$route.query.storeUserId || ''
      const info = _this.$refs.sku.getSkuData()
      const shareIntegralId = this.shareIntegralId
      if (_this.login) {
        if (info.selectedSkuComb) {
          if (_this.isAdd_isBuyNow) {
            _this.sureAddCart()
          } else {
            _this.onBuyClicked(info)
          }
        } else {
          _this.$toast(_this.$t('newAdd.cartSubmit'))
        }
      } else if (info.selectedSkuComb) { // 未登录
        if (_this.isAdd_isBuyNow) { // 加入购物车
          _this.getTouristCartData(info)
        } else { // 立即购买
          _this.setTouristBuyInfo(info)
          _this.$router.push('/shipInfo?isAdd_isBuy=2&shareIntegralId=' + shareIntegralId + '&fromFlag=' + _this.fromFlag1 + '&storeUserId=' + storeUserId + '&fromPage=' + this.$route.query.fromPage)
        }
      } else {
        _this.$toast(_this.$t('newAdd.cartSubmit'))
      }
    },
    // 未登录购物车数据组装
    getTouristCartData (info) {
      const _this = this
      _this.touristCartData = JSON.parse(window.sessionStorage.getItem('touristCartData')) || []
      const goodsObj = {}
      goodsObj.amount = (info.selectedSkuComb.price / 100) * info.selectedNum // 总价
      goodsObj.price = info.selectedSkuComb.price / 100 // 单价
      goodsObj.checked = true // 是否选择
      goodsObj.goodsCashOnDelivery = _this.goodsDetailsData.goodsCashOnDelivery // 是否支持货到付款
      goodsObj.goodsTitle = _this.goodsDetailsData.goodsTitle // 商品标题
      goodsObj.num = info.selectedNum // 商品数量
      goodsObj.shareId = _this.shareIntegralId ? ((_this.shareIntegralId !== 'null' && _this.shareIntegralId !== 'undefined') ? _this.shareIntegralId : '') : '' // 分享id
      goodsObj.skuId = info.selectedSkuComb.id // skuId
      goodsObj.skuImage = '' // 规格图片
      goodsObj.skuInventory = info.selectedSkuComb.stock_num // 库存
      goodsObj.skuValue = '' // 规格值
      goodsObj.spuId = info.goodsId // 商品ID
      if (this.goodsDetailsData.goodsSkuDetailsList && this.goodsDetailsData.goodsSkuDetailsList.length) {
        const _index = this.goodsDetailsData.goodsSkuDetailsList.findIndex((item) => {
          return item.skuInfo.id === info.selectedSkuComb.id
        })
        if (_index > -1) {
          goodsObj.skuImage = this.goodsDetailsData.goodsSkuDetailsList[_index].skuInfo.skuImage
          const specValueList = this.goodsDetailsData.goodsSkuDetailsList[_index].skuInfo.specValueList || []
          specValueList.forEach((item) => {
            goodsObj.skuValue += item.specValueName + ';'
          })
        }
      }
      if (_this.touristCartData && _this.touristCartData.length === 0) {
        _this.storeInfoObj.shopItems.push(goodsObj)
        _this.storeInfoObj.storeId = _this.goodsDetailsData.storeId
        _this.storeInfoObj.storeName = _this.storeName
        _this.storeInfoObj.storeType = _this.storeType
        _this.touristCartList.push(_this.storeInfoObj)
        window.sessionStorage.setItem('touristCartData', JSON.stringify(_this.touristCartList))
      } else {
        // 判斷是否同一店鋪
        const storeIndex = _this.touristCartData.findIndex((item) => {
          return item.storeId === _this.goodsDetailsData.storeId
        })
        if (storeIndex > -1) {
          // 判斷是否同一商品
          const goodsIndex = _this.touristCartData[storeIndex].shopItems.findIndex((shopItem) => {
            return shopItem.spuId === info.goodsId
          })
          if (goodsIndex > -1) {
            // 判斷是否同一規格
            const skuIndex = _this.touristCartData[storeIndex].shopItems.findIndex((shopItem) => {
              return shopItem.skuId === info.selectedSkuComb.id
            })
            if (skuIndex > -1) {
              _this.touristCartData[storeIndex].shopItems[skuIndex].num += info.selectedNum
            } else {
              _this.touristCartData[storeIndex].shopItems.push(goodsObj)
            }
          } else {
            _this.touristCartData[storeIndex].shopItems.push(goodsObj)
          }
        } else {
          const objItem = {
            shopItems: []
          }
          objItem.shopItems.push(goodsObj)
          objItem.storeId = _this.goodsDetailsData.storeId
          objItem.storeName = _this.storeName
          objItem.storeType = _this.storeType
          _this.touristCartData.push(objItem)
        }
        window.sessionStorage.setItem('touristCartData', JSON.stringify(_this.touristCartData))
      }
      _this.showSku = false
      _this.$toast(_this.$t('goodsDetail.addCartTip'))
    },
    // 获取店铺信息
    getStoreInfo () {
      const _this = this
      const storeId = _this.goodsDetailsData.storeId
      _this.$axios.get(api.store.storeInfo, { params: { storeId } }).then((res) => {
        if (res.code === 200) {
          _this.storeName = res.data.storeName
          _this.storeType = res.data.storeType
        }
      })
    },
    choseGoods () {
      this.IconMenu = false
      const _this = this
      if (_this.isSellOut) {
        _this.isClickButton = true
        _this.showSku = true
      }
    },
    // 加入购物车
    sureAddCart () {
      const _this = this
      const info = _this.$refs.sku.getSkuData()
      if (_this.login) {
        if (info.selectedSkuComb) {
          const data = {
            num: info.selectedNum,
            skuId: info.selectedSkuComb.id,
            skuValue: '',
            spuId: info.goodsId,
            storeId: _this.goodsDetailsData.storeId,
            shareId: this.shareIntegralId ? ((this.shareIntegralId !== 'null' && this.shareIntegralId !== 'undefined') ? this.shareIntegralId : '') : ''
          }
          _this.$axios.post(api.goods.addCart, data).then((res) => {
            if (res.code === 200) {
              _this.$toast(_this.$t('like.add'))
              _this.showSku = false
            }
          }).catch((err) => {
            _this.$toast(err.message)
          })
        } else {
          _this.$toast(_this.$t('newAdd.cartSubmit'))
        }
      } else if (info.selectedSkuComb) { // 未登录
        _this.getTouristCartData(info)
      } else {
        _this.$toast(_this.$t('newAdd.cartSubmit'))
      }
    },
    // 立即购买
    async onBuyClicked (info) {
      const _this = this
      const storeUserId = _this.$route.query.storeUserId || ''
      if (_this.login) {
        await _this.joinSeckill(info.selectedNum, info.selectedSkuComb.id)
        const data = {
          buyCount: info.selectedNum,
          skuId: info.selectedSkuComb.id,
          shareId: this.shareIntegralId ? ((this.shareIntegralId !== 'null' && this.shareIntegralId !== 'undefined') ? this.shareIntegralId : '') : ''
        }
        await _this.$axios.post(api.goods.buyNow, data).then((res) => {
          if (res.code === 200) {
            const orderInfo = {
              shopType: 2,
              data: res.data
            }
            _this.SET_ORDERINFO(
              Object.assign(orderInfo, { goodsId: _this.goodsid })
            )
            this.$router.push('/placeorder?fromFlag=' + this.fromFlag1 + '&storeUserId=' + storeUserId)
          }
        }).catch((err) => {
          _this.$toast(err.message)
        })
      } else {
        _this.setTouristBuyInfo(info)
        _this.$router.push('/shipInfo?isAdd_isBuy=2&shareIntegralId=' + this.shareIntegralId + '&fromFlag=' + _this.fromFlag1 + '&storeUserId=' + storeUserId + '&fromPage=' + this.$route.query.fromPage)
      }
    },
    handlerFollow (bool) {
      // 商品关注
      this.IconMenu = false
      const _this = this
      const data = {
        spuId: _this.goodsid,
        state: bool
      }
      if (_this.login) {
        _this.$axios.post(api.goods.follow, data).then((res) => {
          if (res.code === 200) {
            _this.isFollow = !bool
          } else {
            _this.$toast('失败')
          }
        })
      } else {
        _this.$router.push('/login?shareIntegralId=' + this.shareIntegralId)
      }
    }
  },
  head () {
    const vm = this
    return {
      title: vm.seoData.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: vm.seoData.des
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: vm.seoData.keyWords
        },
        {
          property: 'og:url',
          content: vm.getUrl + 'product/' + this.details.goodsInfo.id + '?fromFlag=' + this.fromFlag1 + '&shareIntegralId=' + this.shareId
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:title',
          content: 'Starday - ネット通販公式サイト｜Starday市場'
        },
        {
          property: 'og:description',
          content: vm.descTextcopy || vm.details.goodsInfo.goodsTitle
        },
        {
          property: 'og:image',
          content: vm.baseImageUrl + (vm.imageListcopy[0] || vm.details.goodsInfo.goodsImage)
        },
        {
          property: 'fb:app_id',
          content: '2743034795911788'
        },
        {
          name: 'title',
          content: 'Starday - ネット通販公式サイト｜Starday市場'
        },
        {
          name: 'twitter:site',
          content: 'website'
        },
        {
          name: 'twitter:url',
          content: vm.getUrl + 'product/' + this.details.goodsInfo.id + '?fromFlag=' + this.fromFlag1 + '&shareIntegralId=' + this.shareId
        },
        {
          name: 'twitter:description',
          content: vm.descTextcopy || vm.details.goodsInfo.goodsTitle
        },
        {
          name: 'twitter:image',
          content: vm.baseImageUrl + (vm.imageListcopy[0] || vm.details.goodsInfo.goodsImage)
        },
        {
          name: 'twitter:card',
          content: 'summary'
        }
      ],
      link: [
        {
          hid: 'canonical',
          ref: 'canonical',
          href: 'https://www.starday.jp/product/' + this.$route.params.goodsid
        },
        {
          hid: 'alternate',
          ref: 'alternate',
          media: 'only screen and (max-width: 640px)',
          href: 'https://m.starday.jp/product/' + this.$route.params.goodsid
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-sku-row__item-name {
  font-size: 24px;
  line-height: 32px;
}
/deep/.van-button__text {
  font-size: 24px;
}
/deep/.van-stepper__input {
  font-size: 24px;
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
  width: 600px;
  height: 820px;
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -30%);
  .canvasImg{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
  .poster-content{
    width: 600px;
    height: 820px;
    overflow: hidden;
    border-radius: 20px;
    font-size: 0px;
    .proMainImage{
      width: 600px;
      height: 600px;
      object-fit: cover;
    }
    .share-desc{
      width: 600px;
      height: 220px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 30px 22px 18px 30px;
      background-color: #ffffff;
      .desc-right{
        flex: 4;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        width: 160px;
        height: 100%;
        .qrcode{
          width: 130px;
          height: 130px;
          object-fit: cover;
        }
        .text{
          font-size: 22px;
          font-weight: 400;
          color: #333333;
          line-height: 30px;
        }
      }
      .desc-left{
        flex: 8;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 17px;
        .title{
          font-size: 30px;
          font-weight: 400;
          color: #333333;
          line-height: 42px;
        }
        .prics{
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: center;
          .share-price{
            font-size: 40px;
            font-weight: 700;
            color: #ff5d19;
            line-height: 47px;
          }
        }
      }
    }
  }
}
.van-loading{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.my-swipe {
  width: 750px;
  height: 750px;
  .swiper-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.goods-detail-container {
  padding-bottom: 88px;
  .nav {
    width: 100%;
    height: 88px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    box-sizing: border-box;
    box-shadow: 0 1px 5px #cccccc;
    position: relative;
    .arrow-left {
      width: 150px;
      height: 33px;
      padding-left: 33px;
      img {
        width: 19px;
        height: 33px;
        vertical-align: middle;
      }
      .a-link{
        margin-left: 20px;
        .van-icon{
          vertical-align: middle;
        }
      }
    }
    .right-icon {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      font-size: 0;
      padding-right: 30px;
      span img {
        width: 62px;
        height: 62px;
      }
      span:nth-child(2) {
        margin-left: 10px;
      }
    }
    .center {
      flex: 1;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      a {
        display: inline-block;
        height: inherit;
      }
      span {
        flex-shrink: 0;
        white-space: nowrap;
        font-size: 32px;
        font-weight: 500;
        text-align: left;
        color: #666666;
        line-height: 45px;
        padding: 20px;
      }
      & .active {
        font-weight: 600;
        color: #ff5d19;
      }
    }
    .messageBox {
      position: absolute;
      right: 30px;
      top: 95px;
      z-index: 9999;
      background-image: url('../../assets/images/goodsdetail/beijingtankuang.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      padding: 20px 40px;
      .item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        padding: 10px 0;
        .title {
          margin-left: 32px;
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
.score {
  width: 100%;
  padding: 0 30px;
  height: 102px;
  box-sizing: border-box;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  position: relative;
  .skill {
    position: absolute;
    width: 100%;
    height: 92px;
    left: 0;
    right: 0;
    bottom: 100%;
    background-image: url('../../assets/images/goodsdetail/seckill.png');
    background-size: 100% 100%;
    background-origin: border-box;
    background-repeat: no-repeat;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    .left,
    .right {
      height: 100%;
      display: flex;
      align-items: center;
      .goods-sec-box-a1 {
        font-size: 28px;
        font-weight: 600;
        text-align: center;
        color: #ffffff;
        line-height: 40px;
        margin-left: 10px;
      }
      .van-count-down {
        font-size: 24px;
        font-weight: 600;
        color: #ffffff;
        line-height: 33px;
        .item {
          background: #ffffff;
          color: #c91c1c;
          border-radius: 6px;
          padding: 4px;
        }
      }
    }
  }
  .start-box {
    display: flex;
    justify-content: space-between;
    flex-flow: row nowrap;
    align-items: center;
    line-height: 56px;
    .start {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .eval-count {
      margin-left: 20px;
    }
    .rate {
      margin-left: 10px;
    }
    .rate,
    .eval-count {
      font-size: 24px;
      color: #666666;
      letter-spacing: 4px;
      font-weight: 600;
    }
  }
  .share {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    .line {
      width: 1px;
      height: 40px;
      background: #d8d8d8;
    }
    .share-left {
      margin-right: 20px;
    }
    .share-right {
      margin-left: 20px;
    }
    .share-left,
    .share-right {
      img {
        width: 46px;
        height: 46px;
      }
    }
  }
}
.price-num:after {
  content: '円';
  font-size: 30px;
  color: #ff5d19;
  font-weight: 500;
}
.goods-title {
  background: #ffffff;
  width: 100%;
  padding: 32px 30px;
  box-sizing: border-box;
  .goods_title_desc {
    font-size: 34px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 48px;
  }
  .price_info {
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    .price-left-box {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      .market_price {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        .price-r {
          margin-left: 10px;
          color: #999999;
          font-size: 28px;
          font-weight: 700;
          margin-top: 10px;
          .throwprice {
            font-size: 24px;
            color: #999999;
            text-decoration: line-through;
          }
          .throwprice:after {
            content: '円';
            font-size: 24px;
            color: #999999;
            font-weight: 700;
          }
        }
        .price-num {
          font-size: 48px;
          font-weight: 700;
          text-align: left;
          color: #ff5d19;
          line-height: 66px;
        }
        .center-line {
          color: #ff5d19;
          font-size: 17px;
        }
      }
      .seckill_price_view_two {
        height: 28px;
        background: #f2382e;
        font-weight: 400;
        text-align: center;
        border-radius: 20px;
        margin-left: 10px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: center;
        align-items: center;
        padding: 20px 10px;
        font-size: 24px;
        color: #ffffff;
        letter-spacing: 1px;
        .price-hz {
          .price-num {
            font-size: 28px;
          }
          .price-num:after {
            content: '円';
            color: #ffffff;
            font-weight: 700;
          }
        }
      }
    }
    .accountbox {
      font-size: 26px;
      font-weight: 500;
      color: #ff5d19;
    }
  }
  .deduction {
    color: #333333;
    font-size: 26px;
    .title {
      font-weight: 400;
      text-align: left;
      line-height: 18.5px;
    }
    .price-num {
      font-size: 26px;
      color: #ff5d19;
      font-weight: 700;
    }
    .price-num:after {
      font-size: 26px;
    }
  }
  .freightshow {
    padding: 10px 0;
    .content {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        margin-right: 9px;
      }
      span {
        font-size: 26px;
        color: #333333;
        font-weight: 400;
      }
    }
  }
  .fullReduactive {
    line-height: 37px;
    padding-top: 10px;
    .item {
      font-size: 26px;
      color: #df2a31;
      font-weight: 400;
      margin-left: 32px;
    }
    .item:nth-child(1) {
      margin-left: 0px;
    }
  }
}
.cell_Group {
  margin-top: 20px;
  .delivery, .deliveryLoc {
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    .title {
      font-size: 26px;
      color: #999999;
    }
    .content {
      font-size: 26px;
      color: #333333;
      font-weight: 400;
      margin-left: 40px;
      flex: 1;
      text-align: left;
    }
  }
  .deliveryLoc {
    justify-content: flex-start;
  }
}
.goods-details-box {
  background: #ffffff;
  margin-top: 20px;
  .title {
    font-size: 32px;
    color: #333333;
    font-weight: 600;
    width: 750px;
    height: 110px;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    text-align: center;
    line-height: 110px;
  }
  .experiencebox {
    margin: 20px 15px;
    padding: 20px;
    background-color: #fafafa;
    border: 1px solid #e2e2e2;
    border-radius: 10px;
    .firstbox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .leftbox {
        img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          vertical-align: middle;
        }
        span {
          font-size: 26px;
          font-weight: 500;
          color: #333333;
        }
      }
      .rightbox {
        font-size: 24px;
        color: #ff5d19;
      }
    }
    .twobox {
      margin: 20px 0;
      font-size: 26px;
      color: #333333;
      line-height: 36px;
    }
    .threebox {
      img {
        width: 150px;
        height: 150px;
        margin: 0 10px 10px 0;
      }
    }
  }
  .description {
    padding: 20px 30px;
    font-size: 36px;
    color: #333333;
    word-break: break-all;
  }
  & .more {
    height: auto !important;
    overflow: hidden;
  }
  .content {
    padding: 0 15px;
    font-size: 0;
    height: 600px;
    overflow: hidden;
    img {
      width: 100%;
      object-fit: cover;
    }
  }
  .moredetails-button {
    width: 100%;
    background: #ffffff;
    padding: 32px 30px;
    box-sizing: border-box;
    .btn-item {
      width: 100%;
      height: 80px;
      border: 1px solid #333333;
      border-radius: 16px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      span {
        font-size: 28px;
        font-weight: 500;
      }
      img {
        margin-left: 10px;
        width: 32px;
        height: 32px;
      }
    }
  }
}
.goods-eval {
  & .title {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    background: #ffffff;
    margin-top: 20px;
    height: 110px;
    padding: 0 30px;
    .title-l {
      font-size: 32px;
      color: #333333;
      font-weight: 600;
    }
    .title-r {
      font-size: 0;
      span {
        font-size: 26px;
        color: #666666;
        font-weight: 400;
        line-height: 37px;
      }
      img {
        margin-left: 12px;
        width: 24px;
        height: 24px;
      }
    }
  }
  & .commentlist {
    background: #ffffff;
    display: flex;
    justify-content: flex-start;
    flex-flow: column nowrap;
    .list-item:last-child {
      border: none;
    }
    .list-item {
      padding: 0 30px 14px;
      border-bottom: 1px solid #e5e5e5;
      .titles {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0px 16px;
        .titles-l {
          font-size: 0;
          display: flex;
          align-items: center;
          .userimg {
            width: 66px;
            height: 66px;
            border-radius: 50%;
          }
          .username {
            padding-left: 16px;
            font-size: 28px;
            color: #333333;
            font-weight: 400;
          }
        }
      }
      .evaltime {
        font-size: 24px;
        color: #999999;
        .spec {
          margin-left: 10px;
        }
      }
      .content {
        box-sizing: border-box;
        font-size: 28px;
        color: #333333;
        font-weight: 400;
        width: 100%;
        line-height: 40px;
        margin: 10px 0px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        word-break: break-all;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .commentimg {
        font-size: 0;
        padding: 3px 25px 3px 0px;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        img {
          width: 112px;
          height: 112px;
          margin: 0 6px 6px 0;
        }
      }
    }
  }
}
.store-new {
  padding: 32px 30px;
  background: #ffffff;
  box-sizing: border-box;
  width: 100%;
  height: 300px;
  margin-top: 20px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  .store-t {
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-start;
    justify-content: space-between;
    height: 130px;
    .store-img {
      width: 130px;
      height: 130px;
      object-fit: cover;
    }
    .store-info {
      display: flex;
      flex-flow: column nowrap;
      justify-content: space-between;
      align-items: flex-start;
      flex: 1;
      height: inherit;
      padding-left: 20px;
      .name {
        font-size: 30px;
        color: #333333;
        line-height: 40px;
        font-weight: 500;
      }
      .rate {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        margin: 0;
        span {
          font-size: 24px;
          margin-left: 10px;
          color: #666666;
        }
      }
      .pro-num {
        font-size: 24px;
        font-weight: 400;
        color: #666666;
        display: flex;
        flex-flow: row nowrap;
        p {
          margin: 0;
        }
        .pro-eval {
          margin-left: 30px;
        }
      }
    }
    .focuson {
      background-image: linear-gradient(to right, #ffa14b, #ff5d19);
      border-radius: 40px;
      font-size: 24px;
      color: #ffffff;
      text-align: center;
      line-height: 32px;
      padding: 5px 20px;
    }
    .follow {
      background: transparent;
      border: 1px solid #666666;
      line-height: 32px;
      color: #666666;
      padding: 5px 10px;
    }
  }
  .store-b {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    .call-store {
      margin-right: 8px;
    }
    .look-store {
      margin-left: 8px;
    }
    .call-store,
    .look-store {
      flex: 1;
      height: 66px;
      border: 1px solid #666666;
      border-radius: 20px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      font-size: 0;
      img {
        width: 36px;
        height: 36px;
      }
      span {
        font-size: 22px;
        color: #666666;
        font-weight: 400;
        margin-left: 10px;
      }
    }
  }
}
/deep/.van-goods-action {
  height: 88px;
  width: 750px;
  .van-goods-action-button {
    height: 60px;
  }
  .van-goods-action-icon {
    width: 100px;
  }
  .van-goods-action-icon__icon {
    margin: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 42px;
      height: 42px;
    }
  }
}
/deep/.van-sku-header {
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  height: inherit;
  .van-image {
    width: 180px;
    height: 180px;
    margin: 0;
  }
  .van-sku-header__goods-info {
    flex: 1;
    height: 180px;
    padding: 0 0 0 20px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: flex-start;
    .van-sku__goods-price {
      width: 100%;
      height: 48px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      letter-spacing: 2px;
      .price {
        font-size: 40px;
        font-weight: 600;
        text-align: left;
        color: #ff5d19;
        line-height: 56px;
      }
      .price::after {
        content: '円';
        font-size: 24px;
        font-weight: 600;
      }
    }
    .van-sku-header-item,
    .van-sku-header-item .van-sku__stock {
      margin: 0;
      font-size: 28px;
      font-weight: 400;
      color: #999999;
      line-height: 32px;
    }
  }
}
/deep/.van-sku-body {
  .van-sku-group-container {
    .van-sku-row__title {
      font-size: 28px;
      color: #999999;
      line-height: 40px;
    }
    .van-sku-row__item,
    .van-sku-row__image-item {
      border: 1px solid rgba(255, 255, 255, 0);
      border-radius: 8px;
      background: #fff;
      .van-image {
        width: 46px;
        height: 46px;
        .van-image__img {
          width: 46px;
          height: 46px;
        }
      }
      .van-sku-row__item-name {
        padding: 15px;
      }
    }
    .van-sku-row__image-item--active,
    .van-sku-row__item--active {
      border-radius: 8px;
      color: #ff5d19;
      border: 1px solid #ff5d19 !important;
      background: #fff;
    }
  }
}
/deep/.van-sku-stepper-stock {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  .van-sku__stepper-title {
    font-size: 28px;
  }
  .van-sku__stepper {
    .van-stepper__minus,
    .van-stepper__plus,
    .van-stepper__input {
      width: 53px;
      height: 53px;
    }
  }
}
/deep/.van-sku-actions .van-button {
  height: 64px;
}
.van-sku-actions .van-button:first-of-type {
  border-top-left-radius: 32px;
  border-bottom-left-radius: 32px;
}
.van-sku-actions .van-button:last-of-type {
  border-top-right-radius: 32px;
  border-bottom-right-radius: 32px;
}
/deep/.ql-container.ql-snow {
  border: none;
}
.serviceBox {
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  /deep/.van-cell {
    font-size: 30px;
    line-height: 30px;
    /deep/.van-cell__left-icon {
      margin-right: 20px;
      width: 40px;
      height: 40px;
      .van-icon__image {
        width: 40px;
        height: 40px;
      }
    }
    .van-cell__title {
      font-size: 32px;
      line-height: 40px;
    }
  }
}
.breadbox {
  margin: 20px 0 20px 20px;
  font-size: 20px;
  color: #666;
  span {
    line-height: 40px;
  }
  span:hover {
    color: #1155cc;
    text-decoration: underline;
  }
}
.btnbox,
.btnbox1 {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #ffffff;
  p:nth-of-type(1) {
    font-size: 28px;
    font-weight: 500;
    line-height: 40px;
  }
  p:nth-of-type(2) {
    font-size: 20px;
    line-height: 28px;
  }
}
.btnbox {
  width: 310px;
  height: 78px;
  background: #403b3b;
  border-radius: 90px 0px 0px 90px;
}
.btnbox1 {
  width: 310px;
  height: 78px;
  background: linear-gradient(90deg, #ffa14b, #ff5d19);
  border-radius: 0px 90px 90px 0px;
}
.btnbox2 {
  background: #ffa14b;
}
.addTibox {
  margin: 20px 30px 0;
  padding: 32px 0;
  font-size: 26px;
  font-weight: 500;
  color: #333333;
  text-align: center;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.02);
}
.hotword{
  width: 100%;
  .hote-header{
    font-size: 32px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 45px;
    padding: 36px 24px;
  }
  .hot-content::-webkit-scrollbar{
    display: none;
  }
  .hot-content{
    width: 100%;
    height: auto;
    overflow: scroll;
    padding: 0 24px;
    .hot-scroll{
      width: 300vw;
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;
      a{
        margin-bottom: 15px;
        margin-right: 20px;
        .hot-item{
          font-size: 28px;
          font-weight: 400;
          color: #666666;
          line-height: 40px;
          padding: 15px 30px;
          border-radius: 35px;
          background-color: #ffffff;
          flex-shrink: 0;
        }
      }
    }
  }
  a{
    display: block;
    padding: 10px 0;
    font-size: 26px;
    color: #999999;
  }
}
</style>
