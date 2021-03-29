<!---->
<template>
  <div class="mycoupon-container">
    <van-sticky>
      <van-nav-bar :title="$t('coupon.title')" placeholder @click-left="onClickLeft">
        <template #left>
          <van-icon name="arrow-left" color="#666666" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <van-tabs v-model="active" color="#FF5D19" title-active-color="#FF5D19" line-width="25px" line-height="3px" @change="changeTab">
      <van-tab :title="$t('coupon.use')">
        <NoData v-if="isEmpty" />
        <div v-else class="couponbox">
          <!-- <div v-for="(item,index) in couponList" :key="index">
            <div :class="item.couponType == 0?'coupon_item':'coupon_item coupon_item_type'">
              <div>
                <div class="header">
                  <span class="coupon_item_type_discount">{{ item.couponType == 0?$t('newCoupon.type1'):$t('newCoupon.type2')}}</span>
                  <span>{{$i18n.locale === 'jp' ? item.couponNameJp : item.couponName}}</span>
                </div>
                <div class="miaoshu">{{item.fullbuyType == 0?$t('newCoupon.fullbuyType'):$t('newCoupon.fullbuyType2')+item.fullbuyPrice+$t('newCoupon.fullbuyType3')}}</div>
                <div class="useTime">{{item.effectiveStartTime.split(' ')[0]+'&#45;&#45;'+item.effectiveEndTime.split(' ')[0]}}</div>
                <div class="title">
                  <div class="van-ellipsis">{{item.couponActivityDto.couponDesc}}</div>
                  <van-icon :name="item.showDesc?'arrow-up':'arrow-down'" color="#999" @click="showDicountDesc(item,index)" />
                </div>
              </div>
              <div class="price">
                <div>
                  <span>{{ item.denomination.toString().replace(/\s*/g,"")}}</span>
                  <span>円</span>
                </div>
              </div>
            </div>
            <div v-show="item.showDesc" class="dicountDesc">
              {{$t('newCoupon.desc')}}
              {{item.couponActivityDto.couponDesc}}
            </div>
          </div>-->

          <div v-for="(item,index) in couponList" :key="index" class="coupon-item">
            <div class="coupon-content" :style="`backgroundImage:url(${require('assets/images/coupon/tongyong.png')})`">
              <van-icon v-if="item.showSanjiao" size="10vw" class="active" :name="require(`assets/images/confirmorder/sanjiao.png`)" />
              <div class="coupon-left">
                <div class="header">
                  <span class="coupon_item_type_discount">{{ item.couponType == 0?$t('newCoupon.type1'):$t('newCoupon.type2')}}</span>
                  <span class="van-ellipsis ellipsis">{{$i18n.locale === 'ja-JP' ? item.couponNameJp : item.couponName}}</span>
                </div>
                <div class="miaoshu">{{item.fullbuyType == 0?$t('newCoupon.fullbuyType'):$t('newCoupon.fullbuyType2')+item.fullbuyPrice+$t('newCoupon.fullbuyType3')}}</div>
                <div class="useTime">{{item.effectiveStartTime.split(' ')[0]+'--'+item.effectiveEndTime.split(' ')[0]}}</div>
                <div v-if="item.couponActivityDto.couponDescJp" class="title">
                  <span class="van-ellipsis ellipsis">{{item.couponActivityDto.couponDescJp}}</span>
                  <van-icon :name="iconName" color="#999" @click="showDicountDesc(item,$event)" />
                </div>
                <div v-else class="title"></div>
              </div>
              <div class="price">
                <span>{{ item.denomination.toString().replace(/\s*/g,"")}}</span>
                <span>円</span>
              </div>
            </div>
            <div class="dicountDesc">{{$t('newCoupon.desc')}}{{item.couponActivityDto.couponDescJp}}</div>
          </div>
        </div>
      </van-tab>
      <van-tab :title="$t('coupon.used')">
        <NoData v-if="isEmpty" />
        <div v-else class="couponbox">
          <div v-for="(item,index) in couponList" :key="index" class="coupon-item">
            <div class="coupon-content" :style="`backgroundImage:url(${require('assets/images/coupon/invied.png')})`">
              <van-icon v-if="item.showSanjiao" size="10vw" class="active" :name="require(`assets/images/confirmorder/sanjiao.png`)" />
              <div class="coupon-left">
                <div class="header">
                  <span class="coupon_item_type_discount">{{ item.couponType == 0?$t('newCoupon.type1'):$t('newCoupon.type2')}}</span>
                  <span class="van-ellipsis ellipsis">{{$i18n.locale === 'ja-JP' ? item.couponNameJp : item.couponName}}</span>
                </div>
                <div class="useTime">{{item.effectiveStartTime.split(' ')[0]+'--'+item.effectiveEndTime.split(' ')[0]}}</div>
                <div v-if="item.couponActivityDto.couponDescJp" class="title">
                  <span class="van-ellipsis ellipsis">{{item.couponActivityDto.couponDescJp}}</span>
                  <van-icon :name="iconName" color="#999" @click="showDicountDesc(item,$event)" />
                </div>
                <div v-else class="title"></div>
              </div>
              <div class="priceBox">
                <div class="totalPrice">
                  <span>{{ item.denomination.toString().replace(/\s*/g,"")}}</span>
                  <span>円</span>
                </div>
                <div class="miaoshu">{{item.fullbuyType == 0?$t('newCoupon.fullbuyType'):$t('newCoupon.fullbuyType2')+item.fullbuyPrice+$t('newCoupon.fullbuyType3')}}</div>
              </div>
            </div>
            <div class="dicountDesc">{{$t('newCoupon.desc')}}{{item.couponActivityDto.couponDescJp}}</div>
          </div>
          <!-- <div v-for="(item,index) in couponList" :key="index">
            <div class="coupon_item coupon_item_invalid coupon_item_used">
              <div>
                <div class="header">
                  <span class="coupon_item_type_discount">{{ item.couponType == 0?$t('newCoupon.type1'):$t('newCoupon.type2')}}</span>
                  <span>{{$i18n.locale === 'jp' ? item.couponNameJp : item.couponName}}</span>
                </div>
                <div class="useTime">{{item.effectiveStartTime+'&#45;&#45;'+item.effectiveEndTime}}</div>
                <div class="title">
                  <div class="van-ellipsis">{{item.couponDesc}}</div>
                  <van-icon name="arrow-down" color="#999" @click="showDicountDesc(item)" />
                </div>
              </div>
              <div class="price">
                <div>
                  <span>{{ item.denomination.toString().replace(/\s*/g,"")}}</span>
                  <span class="huobi">円</span>
                </div>
                <div class="invalid_type">{{item.fullbuyType == 0?$t('newCoupon.fullbuyType'):$t('newCoupon.fullbuyType2')+item.fullbuyPrice+$t('newCoupon.fullbuyType3')}}</div>
              </div>
            </div>
            <div v-if="item.showDesc" class="dicountDesc">
              {{$t('newCoupon.desc')}}
              {{item.couponActivityDto.couponDesc}}
            </div>
          </div> -->
        </div>
      </van-tab>
      <van-tab :title="$t('coupon.losed')">
        <NoData v-if="isEmpty" />
        <div v-else class="couponbox">
          <div v-for="(item,index) in couponList" :key="index" class="coupon-item">
            <div class="coupon-content" :style="`backgroundImage:url(${require('assets/images/coupon/yishixiao.png')})`">
              <van-icon v-if="item.showSanjiao" size="10vw" class="active" :name="require(`assets/images/confirmorder/sanjiao.png`)" />
              <div class="coupon-left">
                <div class="header">
                  <span class="coupon_item_type_discount">{{ item.couponType == 0?$t('newCoupon.type1'):$t('newCoupon.type2')}}</span>
                  <span class="van-ellipsis ellipsis">{{$i18n.locale === 'ja-JP' ? item.couponNameJp : item.couponName}}</span>
                </div>
                <div class="useTime">{{item.effectiveStartTime.split(' ')[0]+'--'+item.effectiveEndTime.split(' ')[0]}}</div>
                <div v-if="item.couponActivityDto.couponDescJp" class="title">
                  <span class="van-ellipsis ellipsis">{{item.couponActivityDto.couponDescJp}}</span>
                  <van-icon :name="iconName" color="#999" @click="showDicountDesc(item,$event)" />
                </div>
                <div v-else class="title"></div>
              </div>
              <div class="priceBox">
                <div class="totalPrice">
                  <span>{{ item.denomination.toString().replace(/\s*/g,"")}}</span>
                  <span>円</span>
                </div>
                <div class="miaoshu">{{item.fullbuyType == 0?$t('newCoupon.fullbuyType'):$t('newCoupon.fullbuyType2')+item.fullbuyPrice+$t('newCoupon.fullbuyType3')}}</div>
              </div>
            </div>
            <div class="dicountDesc">{{$t('newCoupon.desc')}}{{item.couponActivityDto.couponDescJp}}</div>
          </div>
          <!-- <div v-for="item in couponList" :key="item.id">
            <div class="coupon_item coupon_item_invalid">
              <div>
                <div class="header">
                  <span class="coupon_item_type_discount">{{ item.couponType == 0?$t('newCoupon.type1'):$t('newCoupon.type2')}}</span>
                  <span>{{$i18n.locale === 'jp' ? item.couponNameJp : item.couponName}}</span>
                </div>
                <div class="useTime">{{item.effectiveStartTime+'&#45;&#45;'+item.effectiveEndTime}}</div>
                <div class="title">
                  <div class="van-ellipsis">{{item.couponDesc}}</div>
                  <van-icon name="arrow-down" color="#999" @click="showDicountDesc(item,index)" />
                </div>
              </div>
              <div class="price">
                <div>
                  <span>{{ item.denomination.toString().replace(/\s*/g,"")}}</span>
                  <span class="huobi">円</span>
                </div>
                <div class="invalid_type">{{item.fullbuyType == 0?$t('newCoupon.fullbuyType'):$t('newCoupon.fullbuyType2')+item.fullbuyPrice+$t('newCoupon.fullbuyType3')}}</div>
              </div>
            </div>
            <div v-show="item.showDesc" class="dicountDesc">
              {{$t('newCoupon.desc')}}
              {{item.couponActivityDto.couponDesc}}
            </div>
          </div> -->
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import api from 'static/api'
import NoData from '~/components/empty/template_one'
export default {
  layout: 'content',
  components: {
    NoData
  },
  data () {
    return {
      active: 0,
      showDesc: false,
      iconName: 'arrow-down',
      couponList: [],
      isEmpty: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    showDicountDesc (item, event) {
      item.showDesc = !item.showDesc
      const dicountDesc = event.target.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('dicountDesc')
      if (item.showDesc) {
        event.target.className = 'van-icon van-icon-arrow-up'
        dicountDesc[0].style.display = 'block'
      } else {
        event.target.className = 'van-icon van-icon-arrow-down'
        dicountDesc[0].style.display = 'none'
      }
    },
    onClickLeft () {
      this.$router.back()
    },
    // showDicountDesc (item, index) {
    //   const _this = this
    //   console.log(item)
    //   item.showDesc = !item.showDesc
    //   const el = document.getElementsByClassName('dicountDesc')[index]
    //   if (item.showDesc) {
    //     _this.iconName = 'arrow-up'
    //     el.style.display = 'block'
    //   } else {
    //     _this.iconName = 'arrow-down'
    //     el.style.display = 'none'
    //   }
    // },
    changeTab (name) {
      console.log(name)
      const _this = this
      const type = name
      _this.$axios.get(api.coupon.mycoupon, { params: { type } }).then((res) => {
        if (res.code === 200) {
          if (res.data && res.data.length > 0) {
            _this.couponList = res.data
            _this.couponList.map((item) => {
              item.showDesc = false
              item.effectiveStartTime = item.effectiveStartTime.split('T')[0]
              item.effectiveEndTime = item.effectiveEndTime.split('T')[0]
            })
            console.log('couponList', this.couponList)
          } else {
            _this.couponList = []
          }
          if (res.data && res.data.length > 0) {
            _this.isEmpty = false
          } else {
            _this.isEmpty = true
          }
        }
      }).catch((err) => {
        console.log(err)
        if (err.data.code === 500) {
          _this.$toast.fail(err.data.message)
        }
      })
    },
    init () {
      const _this = this
      const type = 0
      _this.$axios.get(api.coupon.mycoupon, { params: { type } }).then((res) => {
        if (res.code === 200) {
          if (res.data && res.data.length > 0) {
            _this.couponList = res.data
            _this.couponList.map((item) => {
              item.showDesc = false
              item.effectiveStartTime = item.effectiveStartTime.split('T')[0]
              item.effectiveEndTime = item.effectiveEndTime.split('T')[0]
            })
            _this.isEmpty = false
          } else {
            _this.isEmpty = true
          }
        }
      })
    }
  }
}
</script>

<style lang='less' scoped>
.mycoupon-container {
  width: 100%;
  // height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  /deep/.van-nav-bar__content {
    height: 88px;
    line-height: 88px;
  }
  /deep/.van-nav-bar__title {
    font-size: 32px;
    color: #333333;
  }
  /deep/.van-icon-arrow-left {
    color: #999;
    font-size: 36px;
  }
  /deep/.van-tabs--line .van-tabs__wrap {
    height: 80px;
    position: fixed;
    z-index: 999;
  }
  /deep/.van-tab__text--ellipsis {
    font-size: 30px;
    line-height: 32px;
  }
  /deep/.van-tabs {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .van-tabs__wrap {
      width: 100%;
      height: 76px;
      .van-tabs__nav {
        .van-tab {
          .van-tab__text {
            line-height: 32px;
            font-size: 26px;
          }
        }
      }
    }
    .van-tabs__content {
      margin-top: 80px;
      flex: 1;
      width: 100%;
      .van-tab__pane::-webkit-scrollbar {
        display: none;
      }
      .van-tab__pane {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        .couponbox {
          width: 100%;
          height: 100%;
          .coupon-item {
            width: 100%;
            min-height: 268px;
            .coupon-content {
              width: 100%;
              min-height: 268px;
              padding: 15px 18px 20px 30px;
              position: relative;
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              background-size: 100% 100%;
              background-origin: border-box;
              background-repeat: no-repeat;
              .active {
                position: absolute;
                right: 18px;
                bottom: 20px;
              }
              .coupon-left {
                width: 70%;
              }
              .price {
                width: 30%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 40px;
                font-weight: 800;
                color: #ffffff;
              }
              .coupon-left {
                display: flex;
                flex-flow: column nowrap;
                justify-content: space-between;
                align-items: flex-start;
                padding-top: 15px;
                .header {
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: flex-start;
                  align-items: center;
                  width: 100%;
                  .coupon_item_type_discount {
                    display: inline-block;
                    background: #ff9d18;
                    border-radius: 5px;
                    width: 80px;
                    height: 34px;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 400;
                    color: #ffffff;
                    line-height: 36px;
                  }
                  span:last-child {
                    display: inline-block;
                    font-size: 27px;
                    font-weight: 400;
                    text-align: left;
                    color: #333333;
                    height: 34px;
                    line-height: 36px;
                    margin-left: 15px;
                  }
                }
                .miaoshu {
                  font-size: 22px;
                  font-weight: Normal;
                  text-align: left;
                  color: #333333;
                  line-height: 33px;
                }
                .useTime {
                  font-size: 22px;
                  font-weight: 400;
                  text-align: left;
                  color: #999999;
                  line-height: 30px;
                }
                .title {
                  width: 100%;
                  height: 60px;
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  align-items: center;
                  border-top: 1px solid #eaeaea;
                  padding-right: 20px;
                  font-size: 22px;
                  font-weight: 400;
                  color: #999999;
                  line-height: 30px;
                }
              }
            }
            .dicountDesc {
              display: none;
              padding: 0 20px 20px;
              font-size: 22px;
              font-weight: 400;
              color: #999999;
              line-height: 30px;
            }
          }
          .priceBox {
            width: 30%;
            text-align: center;
            padding: 64px 0;
            color: #fff;
            .miaoshu {
              margin-top: 5px;
              font-size: 16px;
              font-weight: bold;
              display: inline-block;
              color: rgba(255, 255, 255, 1);
            }
            .totalPrice span:first-child {
              font-size: 58px;
              text-align: center;
              color: rgba(255, 255, 255, 1);
            }
          }
        }
      }
    }
  }
}
</style>
