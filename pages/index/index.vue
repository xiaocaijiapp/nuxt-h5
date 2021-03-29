<template>
  <div class="Home-nav-container">
    <div class="swiperBox">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" stop-propagation touchable>
        <van-swipe-item v-for="(item, index) in imgList" :key="index">
          <div class="image-container" @click="clickBanner(item)">
            <img v-lazy="handleBackImage(baseImageUrl+ item.img)" class="cancel-img" />
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!--  金刚区-->
    <Grid :grid-list="gridList" />
    <!--  广告图片位置-->
    <div v-if="activeImgs.length" class="activeImage">
      <div v-for="(item,index) in activeImgs" :key="index" class="image-item" @click="goActivityPage(item)">
        <img
          :src="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'"
          class="image-item-url"
        />
      </div>
    </div>
    <!--  秒杀-->
<!--    <Seckill v-if="seckillRes.show" :seckill-data="seckillRes"/>-->
    <!--  排行榜-->
    <RankList v-if="!rankInfo.rankShow" :rank-data="rankInfo.rankData" :evaluate-data="rankInfo.evaluateData" :rank-id="rankInfo.rankId" />
<!--    品牌馆-->
    <div v-if="brandData.show && brandData.data.length > 0" class="brand-pavilion">
      <div class="title">{{$t('home.brand')}}</div>
      <div class="logo-container">
        <div class="logo-scroll">
          <div v-for="(item, index) in brandData.logoImages" :key="index" class="image-box" :class="brandActive === index ? 'image-box-active' : ''" @click="brandLogoChange(index)">
            <img
              :key="baseImageUrl + item.brandLogo + '?x-oss-process=image/resize,w_1000/format,webp'"
              v-lazy="baseImageUrl + item.brandLogo + '?x-oss-process=image/resize,w_1000/format,webp'"
              class="logo-image"
            />
          </div>
        </div>
        <span class="logo-line" :style="logoScroll"></span>
      </div>
      <div class="production-container">
        <div class="pro-scroll-box">
          <div v-for="(item, _index) in brandData.data" :key="_index" class="pro-item" @click="goDetail(item)">
            <div v-if="item.flashSaleActivityStates == 1" class="seckillIcon">
              <img
                v-lazy="require('~/assets/images/icon/miaoshaicon.png')"
                class="seckillIconimg" />
            </div>
            <a :href="getUrl + 'product/' + item.id" :title="item.goodsTitle" class="image-a" @click.prevent="()=> false">
              <img
                v-lazy="item.goodsSelectImg ? baseImageUrl + item.goodsSelectImg+'?x-oss-process=image/resize,w_1000/format,webp':baseImageUrl + item.goodsSearchImage+'?x-oss-process=image/resize,w_1000/format,webp'" class="proMainImage"/>
            </a>
            <a class="protitle" :href="getUrl + 'product/' + item.id" :title="item.goodsTitle" @click.prevent="()=> false">
              <p class="van-ellipsis">{{ item.goodsTitle }}</p>
            </a>
            <div class="allprice">
              <div class="price">
                <span class="num">{{item.price}}</span>
                <span class="unit"> 円</span>
              </div>
              <div v-if="item.flashSaleActivityStates == 1 || item.discountActivityStates == 1" class="line-price">
                <span class="num">{{item.marketPrice}}</span>
                <span class="unit">円</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs-content">
      <van-sticky z-index="-99" @scroll="stickyScroll">
        <div class="innerNav" :style="{backgroundColor:backgroundColor}">
        <div class="scroll">
          <div class="scroll-box">
            <div v-for="(item, index) in innerNav.typeList" :key="index" class="scroll-nav-item" :class="index + 1 === tabActive ? 'tab-active' : ''" @click="changeNav(index, item.distributionFlag)">
              <a :href="getUrl" :title="item.typeName" @click.prevent="()=> false">
                <span>{{item.typeName}}</span>
              </a>
            </div>
            <div v-if="login" class="scroll-nav-item" :class="tabActive === innerNav.typeList.length ? 'tab-active' : ''" @click="changeNav(innerNav.typeList.length, 0)">
              <a :href="getUrl" :title="locale === 'ja-JP' ? 'おすすめ' : '猜你喜欢'" @click.prevent="()=> false">
                <span>{{ locale === 'ja-JP' ? 'おすすめ' : '猜你喜欢'}}</span>
              </a>
            </div>
            <div class="nav-line" :style="scrollObj"></div>
          </div>
        </div>
      </div>
      </van-sticky>
      <div class="tabs-panel">
        <div v-if="tabActive === innerNav.typeList.length" class="panel-content">
          <GoodList :list="likeGoods"></GoodList>
        </div>
        <div v-else-if="tabActive === 1 && distributionFlag == 1" class="panel-content">
<!--          分销商品展示区域-->
          <div class="distribution-container">
            <div v-for="(item, index) in otherNavData" :key="index" class="dis-item" @click="goToDetail(item.id)">
              <img v-lazy="item.goodsSelectImg ? baseImageUrl + item.goodsSelectImg+'?x-oss-process=image/resize,w_1000/format,webp' :baseImageUrl + item.goodsSearchImage+'?x-oss-process=image/resize,w_1000/format,webp'" class="pro-main-image" />
              <div class="dis-pro-desc">
                <div class="title">{{item.goodsTitle}}</div>
                <div class="allprice">
                  <div class="price">
                    <span class="num">{{item.price}}</span>
                    <span class="unit"> 円</span>
                  </div>
                  <div v-if="item.flashSaleActivityStates == 1 || item.discountActivityStates == 1" class="line-price">
                    <span class="num">{{item.marketPrice}}</span>
                    <span class="unit">円</span>
                  </div>
                </div>
                <div class="integral-btn">
                  <span class="btn-text"> {{ locale === 'zh-CN' ? `赚${((item.marketPrice * ratio)/100).toFixed(0)}积分` : `${((item.marketPrice * ratio)/100).toFixed(0)}ポイント貯まる`}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="panel-content" >
            <GoodList :list="otherNavData"></GoodList>
        </div>
      </div>
    </div>
    <div class="fixNav" :style="{display: offset0 ? 'block' : 'none'}">
      <div class="scroll">
        <div class="scroll-box">
          <div v-for="(item, index) in innerNav.typeList" :key="index" class="scroll-nav-item" :class="index + 1  === tabActive ? 'tab-active' : ''" @click="changeNav(index, item.distributionFlag)">
            <a :href="getUrl" :title="item.typeName" @click.prevent="()=> false">
              <span>{{item.typeName}}</span>
            </a>
          </div>
          <div v-if="login" class="scroll-nav-item" :class="tabActive === innerNav.typeList.length ? 'tab-active' : ''" @click="changeNav(innerNav.typeList.length, 0)">
            <a :href="getUrl" :title="locale === 'ja-JP' ? 'おすすめ' : '猜你喜欢'" @click.prevent="()=> false">
              <span>{{ locale === 'ja-JP' ? 'おすすめ' : '猜你喜欢'}}</span>
            </a>
          </div>
          <div class="nav-line" :style="scrollObj"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Grid from '~/components/index/Grid'
// import Seckill from '~/components/index/Seckill'
import GoodList from '~/components/search/list'
import api from '~/static/api'
// import { timeToSec, timeDiff } from '~/util/tools'
import cachePage from '~/static/globalCache'
export default {
  name: 'Index',
  components: {
    Grid,
    GoodList
  },
  async asyncData ({ $axios, store, error }) {
    try {
    // 首页基础数据
      let otherNavData
      let bannerData
      let kingKongData
      let activeImgs
      let typeData
      let smallNavId
      let innerNav
      let productList
      // 猜你喜欢数据展示
      let likeGoods
      // 获取排行榜数据
      const rankInfo = {
        rankShow: false,
        rankData: {},
        evaluateData: {},
        rankId: '',
        evaluateId: '',
        ids: []
      }
      // 品牌数据
      const brandData = {
        show: false,
        data: [],
        logoImages: []
      }
      let BrandPage
      if (cachePage.has('indexData')) {
        // 存在缓存，使用缓存数据
        const { indexData, brand, activity, likes } = JSON.parse(cachePage.get('indexData'))
        likeGoods = likes
        bannerData = indexData.bannerData.sort((a, b) => a.sort - b.sort) // 轮播图
        kingKongData = indexData.kingKongData.sort((a, b) => a.sort - b.sort) // 分类区域
        activeImgs = indexData.activeData // 活动图片
        rankInfo.rankId = indexData.rankData.rankId || ''
        rankInfo.evaluateId = indexData.evaluateData.evaluateId || ''
        smallNavId = indexData.smallNavData.smallNavId
        brandData.show = indexData.pcBrandPageId ? indexData.pcBrandPageId.list.length > 0 : false
        innerNav = activity
        // 请求小导航第一个类目下商品
        const ids = activity.typeList[0].goodsList.map((prop) => {
          return prop.id
        })
        await $axios.post(api.goods.getGoodsInfo, ids).then((res) => {
          if (res.code === 200) {
            activity.typeList[0].goodsList.forEach((prop) => {
              res.data.forEach((item) => {
                if (item.flashSaleActivityStates === 1) {
                  item.price = item.activityPrice
                } else if (item.discountActivityStates === 1) {
                  item.price = item.activityPrice
                } else {
                  item.price = item.marketPrice
                }
                if (prop.id === item.id) {
                  item.goodsSelectImg = prop.goodsSelectImg
                } else {
                  item.goodsSelectImg = ''
                }
              })
            })
            otherNavData = res.data
          }
        })
        if (brandData.show) {
          BrandPage = indexData.pcBrandPageId.list.filter((item) => {
            if (item) {
              return item
            }
          })
          if (BrandPage.length <= 0) { brandData.show = false }
        }
        if (brandData.show) {
          brandData.logoImages = BrandPage.map((item) => {
            return {
              brandLogo: item.brandLogo,
              id: item.id
            }
          })
          brand.forEach((p) => {
            if (p.flashSaleActivityStates === 1) {
              p.price = p.activityPrice
            } else if (p.discountActivityStates === 1) {
              p.price = p.activityPrice
            } else {
              p.price = p.marketPrice
            }
          })
          brandData.data = brand
        }
      } else {
        const cacheData = {}
        await $axios.get(api.home.indexData, { useCache: true }).then((res) => {
          if (res.code === 200) {
            cacheData.indexData = res.data
            bannerData = res.data.bannerData.sort((a, b) => a.sort - b.sort) // 轮播图
            kingKongData = res.data.kingKongData.sort((a, b) => a.sort - b.sort) // 分类区域
            activeImgs = res.data.activeData // 活动图片
            rankInfo.rankId = res.data.rankData.rankId || ''
            rankInfo.evaluateId = res.data.evaluateData.evaluateId || ''
            smallNavId = res.data.smallNavData.smallNavId
            brandData.show = res.data.pcBrandPageId ? res.data.pcBrandPageId.list.length > 0 : false
            if (brandData.show) {
              BrandPage = res.data.pcBrandPageId.list.filter((item) => {
                if (item) {
                  return item
                }
              })
              if (BrandPage.length <= 0) { brandData.show = false }
            }
          }
        })
        if (brandData.show) {
          brandData.logoImages = BrandPage.map((item) => {
            return {
              brandLogo: item.brandLogo,
              id: item.id
            }
          })
          const arr = BrandPage[0].list.map((listId) => {
            return listId.spuId
          })
          await $axios.post(api.goods.getGoodsInfo, arr).then((res) => {
            if (res.code === 200) {
              cacheData.brand = res.data
              res.data.forEach((p) => {
                if (p.flashSaleActivityStates === 1) {
                  p.price = p.activityPrice
                } else if (p.discountActivityStates === 1) {
                  p.price = p.activityPrice
                } else {
                  p.price = p.marketPrice
                }
              })
              brandData.data = res.data
            }
          })
        }
        await $axios.get(api.activity.activePage + smallNavId, { useCache: true }).then((res) => {
          if (res.code === 200) {
            res.data.typeList.forEach((item) => {
              item.typeName = store.state.common.locale === 'ja-JP' ? item.typeName.split('|')[1] : item.typeName.split('|')[0]
            })
            cacheData.activity = res.data
            innerNav = res.data
          }
        })
        const ids = innerNav.typeList[0].goodsList.map((prop) => {
          return prop.id
        })
        await $axios.post(api.goods.getGoodsInfo, ids).then((res) => {
          if (res.code === 200) {
            innerNav.typeList[0].goodsList.forEach((prop) => {
              res.data.forEach((item) => {
                if (item.flashSaleActivityStates === 1) {
                  item.price = item.activityPrice
                } else if (item.discountActivityStates === 1) {
                  item.price = item.activityPrice
                } else {
                  item.price = item.marketPrice
                }
                if (prop.id === item.id) {
                  item.goodsSelectImg = prop.goodsSelectImg
                } else {
                  item.goodsSelectImg = ''
                }
              })
            })
            cacheData.otherNavData = res.data
            otherNavData = res.data
          }
        })
        // 猜你喜欢数据  同购物车推荐商品数据同步
        await $axios.post(api.store.goods, {
          categoryId: '',
          exclude: [],
          firstCategoryId: '',
          firstStoreCategoryId: '',
          keyword: '',
          pageNo: 1,
          pageSize: 30,
          secCategoryId: '',
          sortOrder: (new Date().getTime() / 1000) - [1, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000][Math.floor(Math.random() * 10)],
          sorted: 6,
          specValueList: [],
          storeCateId: '',
          storeId: '',
          showFavorite: 1
        }).then((res) => {
          if (res.code === 200) {
            likeGoods = res.data.rows.map((item) => {
              if (item.flashSaleActivityStates === 1) {
                item.price = Math.round(item.marketPrice - (item.marketPrice * item.flashSaleActivitys[0].discount) / 100)
              } else if (item.discountActivityStates === 1) {
                item.price = Math.round(item.marketPrice - (item.marketPrice * item.discountActivitys[0].rate) / 100)
              } else {
                item.price = item.marketPrice
              }
              return item
            })
            cacheData.likes = likeGoods
          }
        })
        cachePage.set('indexData', JSON.stringify(cacheData))
      }
      // 获取秒杀数据
      // const secKillData = await $axios.get(api.activity.secKill)
      // const secKillinfo = secKillData.data
      // const starting = secKillinfo.filter(item => item.timeState === 1)
      // const nostart = secKillinfo.filter(item => item.timeState === 0)
      // const flashData = {
      //   show: false,
      //   times: '',
      //   data: [],
      //   secKillTimeState: 0
      // }
      // if (starting.length > 0) {
      // // 正在进行中秒杀活动
      //   const activity = starting[0]
      //   const nowDtae = activity.nowtimes
      //   const endDate = activity.nowtimes.split(' ')[0] + ' ' + activity.endTime
      //   flashData.times = timeDiff(endDate, nowDtae)
      //   flashData.secKillTimeState = 1
      //   const requestdata = activity.flashSaleActivitys.map(item => item.goodsId)
      //   // 请求正在参与秒杀活动商品数据
      //   const activitypros = await $axios.post(api.goods.getGoodsInfo, requestdata)
      //   if (activitypros.data && activitypros.data.length) {
      //     activitypros.data.forEach((item) => {
      //       activity.flashSaleActivitys.forEach((prop) => {
      //         if (item.id === prop.goodsId) {
      //           item.discount = prop.discount
      //           item.leverNum = prop.leverNum
      //           item.buyNum = prop.buyNum
      //           item.stockNum = prop.stockNum
      //           item.timeState = activity.timeState
      //         }
      //       })
      //     })
      //   }
      //   flashData.show = true
      //   flashData.timestate = activity.timeState
      //   flashData.data = activitypros.data
      // } else if (starting.length === 0 && nostart.length > 0) {
      //   nostart.sort((a, b) => {
      //     return timeToSec(a.startTime) - timeToSec(b.startTime)
      //   })
      //   flashData.secKillTimeState = 0
      //   const activity = nostart[0]
      //   const nowDtae = activity.nowtimes
      //   const endDate = activity.nowtimes.split(' ')[0] + ' ' + activity.startTime
      //   flashData.times = timeDiff(endDate, nowDtae)
      //   const requestdata = activity.flashSaleActivitys.map(item => item.goodsId)
      //   // 请求正在参与秒杀活动商品数据
      //   const activitypros = await $axios.post('/starday-elasticsearch/search/goodsId', requestdata)
      //   if (activitypros.data && activitypros.data.length) {
      //     activitypros.data.forEach((item) => {
      //       activity.flashSaleActivitys.forEach((prop) => {
      //         if (item.id === prop.goodsId) {
      //           item.discount = prop.discount
      //           item.leverNum = prop.leverNum
      //           item.buyNum = prop.buyNum
      //           item.stockNum = prop.stockNum
      //           item.timeState = activity.timeState
      //         }
      //       })
      //     })
      //   }
      //   flashData.show = true
      //   flashData.data = activitypros.data
      //   flashData.timestate = activity.timeState
      // }
      // 获取排行榜数据
      if (rankInfo.rankId) {
        await $axios.get(api.activity.activePage + rankInfo.rankId).then((res) => {
          rankInfo.rankShow = true
          if (res.code === 200) {
            typeData = res.data
            if (typeData.typeList.length > 0) {
              res.data.typeList.forEach((element) => {
                element.goodsList.forEach((item) => {
                  rankInfo.ids.push(item.id)
                })
              })
            } else {
              typeData.noTypeGoods.forEach((item) => {
                rankInfo.ids.push(item.id)
              })
            }
          }
        })
        await $axios.post(api.goods.getGoodsInfo, rankInfo.ids).then((res) => {
          if (res.code === 200) { rankInfo.rankData = res.data.splice(0, 5) }
          if (typeData.typeList.length > 0) {
            typeData.typeList[0].goodsList.forEach((item) => {
              rankInfo.rankData.forEach((prop) => {
                if (prop.id === item.id) {
                  prop.goodsSelectImg = item.goodsSelectImg
                }
              })
            })
          } else {
            typeData.noTypeGoods.forEach((item) => {
              rankInfo.rankData.forEach((prop) => {
                if (prop.id === item.id) {
                  prop.goodsSelectImg = item.goodsSelectImg
                }
              })
            })
          }
        })
        await $axios.get(api.activity.activePage + rankInfo.evaluateId).then((res) => {
          rankInfo.rankShow = true
          if (res.code === 200) { rankInfo.evaluateData = res.data }
        })
      }
      return {
        imgList: bannerData,
        gridList: kingKongData,
        // seckillRes: flashData,
        activeImgs,
        rankInfo,
        innerNav,
        productList,
        otherNavData,
        likeGoods,
        brandData,
        BrandPage
      }
    } catch (e) {
      error(e)
    }
  },
  data () {
    return {
      distributionFlag: 0,
      active: 1,
      mainActive: 0,
      tabActive: 0,
      brandActive: 0,
      loading: false,
      finished: true,
      offset0: false,
      ratio: 1,
      backgroundColor: 'transparent',
      scrollObj: {
        transform: 'translateX(40px) translateX(-50%)'
      },
      logoScroll: {
        transform: 'translateX(35px) translateX(-50%)'
      }
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl', 'locale', 'userInfo', 'login']),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  mounted () {
    this.lineStyle(0)
  },
  methods: {
    handleBackImage (url) {
      return {
        src: url,
        error: url,
        loading: url
      }
    },
    brandLogoChange (index) {
      this.brandActive = index
      const ml = document.getElementsByClassName('image-box')[index].offsetLeft
      const mw = document.getElementsByClassName('image-box')[index].clientWidth / 2
      const logoDom = document.getElementsByClassName('logo-container')[0]
      const cw = logoDom.clientWidth
      logoDom.scrollTo(ml - (cw / 2) + mw, 0)
      this.logoScroll.transform = `translateX(${ml + 35}px) translateX(-50%)`
      document.getElementsByClassName('production-container')[0].scrollTo(0, 0)
      this.getBrandData(index)
    },
    getBrandData (index) {
      const arr = this.BrandPage[index].list.map((listId) => {
        return listId.spuId
      })
      this.$axios.post(api.goods.getGoodsInfo, arr).then((res) => {
        if (res.code === 200) {
          res.data.forEach((p) => {
            if (p.flashSaleActivityStates === 1) {
              p.price = p.activityPrice
            } else if (p.discountActivityStates === 1) {
              p.price = p.activityPrice
            } else {
              p.price = p.marketPrice
            }
          })
          this.brandData.data = res.data
        }
      })
    },
    goActivityPage (active) {
      /**
       * 分销改版跳转活动页
       */
      // const vm = this
      // switch (active.tem) {
      //   case '0':
      //     vm.$router.push('/promotionpage/promotiongoods/' + active.activeId)
      //     break
      //   case '1':
      //     vm.$router.push('/promotionpage/promotiondiscount/' + active.activeId)
      //     break
      //   case '2':
      //     vm.$router.push('/promotionpage/promotionpicture/' + active.activeId)
      //     break
      //   default:
      //     break
      // }
      this.$router.push('/personal/distributionCenter')
    },
    goDetail (item) {
      this.$router.push(`/product/${item.id}`)
      window.sessionStorage.setItem('prefixPage1', 'outNav1')
      window.sessionStorage.setItem('prePage1', location.pathname + location.search)
    },
    stickyScroll (e) {
      this.offset0 = e.isFixed
    },
    lineStyle (active) {
      this.tabActive = active
      const el = document.getElementsByClassName('scroll-nav-item')[active]
      const elOffsetLeft = el.offsetLeft
      this.scrollObj.transform = `translateX(${(elOffsetLeft + el.clientWidth / 2)}px) translateX(-50%)`
    },
    async changeNav (index, flag) {
      this.distributionFlag = flag
      this.lineStyle(index)
      // eslint-disable-next-line eqeqeq
      if (index !== this.innerNav.typeList.length && flag == 0) {
        this.getOtherData(index)
        // eslint-disable-next-line eqeqeq
      } else if (flag == 1) {
        const code = 'SHARE_GOODS_RECEIVE_INTEGRAL'
        const groupCode = 'INTEGRAL_SETTING'
        const { data } = await this.$axios.get('starday-system/dict/getValue', { params: { code, groupCode } })
        this.ratio = data
        this.getOtherData(index)
      }
    },
    getOtherData (index) {
      const ids = this.innerNav.typeList[index].goodsList.map((prop) => {
        return prop.id
      })
      this.$axios.post(api.goods.getGoodsInfo, ids).then((res) => {
        if (res.code === 200) {
          this.innerNav.typeList[index].goodsList.forEach((prop) => {
            res.data.forEach((item) => {
              if (item.flashSaleActivityStates === 1) {
                item.price = item.activityPrice
              } else if (item.discountActivityStates === 1) {
                item.price = item.activityPrice
              } else {
                item.price = item.marketPrice
              }
              if (prop.id === item.id) {
                item.goodsSelectImg = prop.goodsSelectImg
              } else {
                item.goodsSelectImg = ''
              }
            })
          })
          this.otherNavData = res.data
        }
      })
    },
    goToDetail (goodsId) {
      this.$router.push('/product/' + goodsId + '?fromFlag=1' + '&storeUserId=' + this.userInfo.id + '&isFrom=1' + '&fromPage=1')
    },
    clickBanner (item) {
      const vm = this
      switch (item.tem) {
        case '0':
          vm.$router.push('/promotionpage/promotiongoods/' + item.bannerId)
          break
        case '1':
          vm.$router.push('/promotionpage/promotiondiscount/' + item.bannerId)
          break
        case '2':
          vm.$router.push('/promotionpage/promotionpicture/' + item.bannerId)
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.Home-nav-container{
  width: 100%;
  padding-top: 12px;
  padding-left: 12px;
  padding-right: 12px;
  height: auto;
  .swiperBox{
    width: 100%;
    height: 316px;
    font-size: 0;
    background-image: url('../../assets/images/loading/default.png');
    background-size: 100% 100%;
    border-radius: 20px;
    overflow: hidden;
    .default-cancel-img{
      width: 100%;
      height: 316px;
    }
    .van-swipe-item {
      width: 100%;
      border-radius: 15px;
      overflow: hidden;
      height: 316px;
      font-size: 0;
      .cancel-img {
        width: 100%;
        height: 316px;
      }
    }
  }
  .activeImage {
    width: 100%;
    padding: 30px 0px;
    background-color: transparent;
    .image-item {
      .image-item-url {
        width: 100%;
        height: 200px;
      }
    }
  }
  .innerNav::-webkit-scrollbar{
    display: none;
  }
  .innerNav{
    width: 100%;
    height: 110px;
    padding-top: 33px;
    padding-bottom: 29px;
    .scroll{
      width: 100%;
      height: 48px;
      overflow: hidden;
      display: flex;
      align-items: center;
      .scroll-box::-webkit-scrollbar{
        display: none;
      }
      .scroll-box{
        overflow-x: auto;
        overflow-y: hidden;
        display: flex;
        justify-content: space-between;
        position: relative;
        height: 48px;
        width: 100%;
        .scroll-nav-item{
          font-size: 34px;
          /*flex-basis: 25%;*/
          font-weight: 400;
          color: #333333;
          flex-shrink: 0;
          white-space: nowrap;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            padding: 0 38px;
            border-right: 1px solid #cecece;
          }
          span:last-child{
            border-right: none;
          }
        }
        .tab-active{
          font-size: 34px;
          color: #ff5d19;
        }
        .nav-line{
          position: absolute;
          transition: all .3s;
          width: 60px;
          height: 6px;
          background-color: #ff5d19;
          border-radius: 20px;
          left: 0;
          bottom: 0;
          z-index: 1;
        }
      }
    }
  }
  .tabs-content{
    width: 100%;
    height: auto;
    .tabs-panel{
      width: 100%;
      height: auto;
    }
  }
  .fixNav{
    width: 100%;
    height: 110px;
    padding: 33px 24px 29px 24px;
    position: fixed;
    top: 88px;
    left: 0px;
    right: 0px;
    z-index: 999;
    background-color: #ffffff;
    .scroll{
      width: 100%;
      height: 48px;
      overflow: hidden;
      display: flex;
      align-items: center;
      .scroll-box::-webkit-scrollbar{
        display: none;
      }
      .scroll-box{
        overflow-x: auto;
        overflow-y: hidden;
        display: flex;
        justify-content: space-between;
        position: relative;
        height: 48px;
        width: 100%;
        .scroll-nav-item{
          font-size: 34px;
          font-weight: 400;
          color: #333333;
          flex-shrink: 0;
          white-space: nowrap;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            padding: 0 38px;
            border-right: 1px solid #cecece;
          }
          span:last-child{
            border-right: none;
          }
        }
        .tab-active{
          font-size: 34px;
          color: #ff5d19;
        }
        .nav-line{
          position: absolute;
          transition: all .3s;
          width: 60px;
          height: 6px;
          background-color: #ff5d19;
          border-radius: 20px;
          left: 0;
          bottom: 0;
          z-index: 1;
        }
      }
    }
  }
  .brand-pavilion{
    margin-top: 20px;
    background-color: #ffffff;
    border-radius: 10px;
    padding: 0 21px;
    .title{
      width: 100%;
      height: 110px;
      line-height: 110px;
      font-size: 34px;
      font-weight: 500;
      color: #333333;
      text-align: center;
    }
    .logo-container::-webkit-scrollbar{
      display: none;
    }
    .logo-container{
      scroll-behavior:smooth;
      height: 196px;
      overflow-x: scroll;
      position: relative;
      .logo-scroll{
        position: absolute;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding-top: 8px;
        padding-left: 8px;
        padding-right: 8px;
        .image-box:last-child{
          margin-right: 0px;
        }
        .image-box{
          flex-shrink: 0;
          white-space: nowrap;
          width: 140px;
          height: 140px;
          margin-right: 30px;
          border-radius: 14px;
          overflow: hidden;
          background-color: #ffffff;
          box-shadow: 0px 6px 8px 0px rgba(0,0,0,0.1),  0px -6px 8px 0px rgba(0,0,0,0.1), 6px 0px 8px 0px rgba(0,0,0,0.1), -6px 0px 8px 0px rgba(0,0,0,0.1);
          /*background-image: url('../../assets/images/loading/default-lg.png');*/
          background-size: 100% 100%;
          background-repeat: no-repeat;
          .logo-image{
            width: 140px;
            height: 140px;
            object-fit: contain;
          }
        }
        .image-box-active{
          box-shadow: 0px 6px 8px 0px rgba(255,93,25,0.2),  0px -6px 8px 0px rgba(255,93,25,0.2), 6px 0px 8px 0px rgba(255,93,25,0.2), -6px 0px 8px 0px rgba(255,93,25,0.2);
        }
      }
      .logo-line{
        position: absolute;
        transition: all .3s;
        width: 50px;
        height: 10px;
        background-color: #ff5d19;
        border-radius: 5px;
        bottom: 15px;
      }
    }
    .production-container::-webkit-scrollbar{
      display: none;
    }
    .production-container{
      width: 100%;
      height: 407px;
      overflow: auto;
      .pro-scroll-box{
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        .check-more{
          width: 260px;
          height: 377px;
          flex-shrink: 0;
          background-color: #ffffff;
          box-shadow: 0px 2px 6px 2px rgba(0,0,0,0.06);
          border-radius: 8px;
          margin-right: 10px;
          display: flex;
          align-items: center;
          .content{
            width: 100%;
            height: 40px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            span{
              font-size: 28px;
              font-weight: 400;
              text-align: left;
              color: #333333;
              line-height: 40px;
            }
            /deep/.van-icon{
              border: 1px solid #979797;
              border-radius: 16px;
            }
          }
        }
        .pro-item{
          position: relative;
          flex-shrink: 0;
          white-space: nowrap;
          width: 260px;
          height: 377px;
          display: flex;
          flex-flow: column nowrap;
          justify-content: flex-start;
          align-items: flex-start;
          margin-right: 20px;
          border-radius: 8px;
          background-color: #ffffff;
          box-shadow: 0px 2px 6px 2px rgba(0,0,0,0.06);
          .seckillIcon {
            position: absolute;
            left: -3px;
            z-index: 1;
            top: -5px;
            .seckillIconimg {
              width: 151px;
              height: 48px;
            }
          }
          .protitle {
            width: 100%;
            /*height: 80px;*/
            font-size: 21px;
            font-weight: 400;
            text-align: left;
            padding-left: 15px;
            color: #333333;
            line-height: 54px;
          }
          .image-a{
            width: 260px;
            height: 260px;
            display: inline-block;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            overflow: hidden;
            background-image: url('../../assets/images/loading/default-lg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            font-size: 0;
            .proMainImage{
              width: 260px;
              height: 260px;
              object-fit: cover;
            }
          }
          .allprice {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: baseline;
            flex: 1;
            .price {
              padding-left: 15px;
              .num {
                font-size: 30px;
                font-weight: 700;
                text-align: left;
                color: #ff5d19;
                line-height: 35px;
              }
              .unit {
                font-size: 17px;
                font-weight: 600;
                text-align: left;
                color: #ff5d19;
                line-height: 23px;
              }
            }
            .line-price {
              margin-left: 10px;
              text-decoration: line-through;
              .num,
              .unit {
                font-size: 17px;
                font-weight: 700;
                text-decoration: line-through;
                text-align: left;
                color: #999999;
                line-height: 19px;
              }
            }
          }
        }
      }
    }
  }
  .distribution-container{
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    .dis-item{
      width: 100%;
      height: 260px;
      background-color: #ffffff;
      border-radius: 10px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      margin-bottom: 20px;
      .pro-main-image{
        width: 220px;
        height: 220px;
        border-radius: 10px;
      }
      .dis-pro-desc{
        width: 422px;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: flex-start;
        .title{
          width: inherit;
          font-size: 28px;
          font-weight: 400;
          color: #333333;
          line-height: 40px;
          display: -webkit-box !important;
          overflow: hidden;
          text-overflow: ellipsis;
          work-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2; //指定行数
        }
        .allprice {
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          align-items: baseline;
          margin-top: 20px;
          flex: 1;
          .price {
            .num {
              font-size: 40px;
              font-weight: 700;
              text-align: left;
              color: #ff5d19;
              line-height: 47px;
            }
            .unit {
              font-size: 22px;
              font-weight: 600;
              text-align: left;
              color: #ff5d19;
              line-height: 30px;
            }
          }
          .line-price {
            margin-left: 10px;
            text-decoration: line-through;
            .num,
            .unit {
              font-size: 22px;
              font-weight: 700;
              text-decoration: line-through;
              text-align: left;
              color: #999999;
              line-height: 26px;
            }
          }
        }
        .integral-btn{
          width: 100%;
          height: 48px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-end;
          .btn-text{
            height: 46px;
            border: 2px solid #ff5d19;
            border-radius: 29px;
            line-height: 46px;
            padding: 0 40px;
            font-size: 22px;
            font-weight: 400;
            color: #ff5d19;
          }
        }
      }
    }
  }
}
</style>
