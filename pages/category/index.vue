<template>
  <div>
    <van-sticky>
      <van-search v-model="value" shape="round" class="search" :placeholder="$t('home.search')" background="#fff" disabled>
        <template #left-icon>
          <img class="search-icon" src="~/assets/images/index/sousuo.png" alt="">
        </template>
      </van-search>
    </van-sticky>
    <div class="category-container" :style="heitghtStyle">
      <div class="category-tem">
        <div class="scroll-container">
          <div v-for="(item,index) in categoryList" :key="index" class="item" :class="activeKey == index ? 'active' : ''" @click="changeCategory(index)">
            <span class="title">{{ locale == 'zh-CN' ? item.category : item.categoryJp}}</span>
          </div>
        </div>
      </div>
      <div class="category-content cont-r">
        <div v-for="(elem, k) in categoryList" v-show="activeKey == k" :key="k" class="scroll-container">
          <img v-if="elem.categoryImg" v-lazy="baseImageUrl + elem.categoryImg" class="cateImage" :alt="baseImageUrl + elem.categoryImg">
          <div v-for="(prop, index) in elem.goodsCategoryDtoList" :key="index" class="category-item">
            <div class="item-title">{{ locale == 'zh-CN' ? prop.category : prop.categoryJp }}</div>
            <div class="item-production">
              <div v-for="(item,j) in prop.goodsCategoryDtoList" :key="j" class="pro-content" @click="toThreeCate(item)">
                <a class="pro-link" :href="getUrl + 'cate/' + item.id + '?name=' + item.category" :title="item.category" @click.prevent="()=> false">
                  <img v-lazy="baseImageUrl + item.categoryImg" class="pro-image" :alt="locale == 'zh-CN' ? item.category : item.categoryJp">
                </a>
                <a class="pro-title-box" :href="getUrl + 'cate/' + item.id + '?name=' + item.category" :title="item.category" @click.prevent="()=> false">
                  <span class="pro-title">{{ locale == 'zh-CN' ? item.category : item.categoryJp }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '~/static/api'
export default {
  name: 'Category',
  layout: 'default',
  middleware: ['i18n', 'auth'],
  async asyncData ({ $axios, query, error }) {
    try {
      let categoryList
      let activeIndex
      await $axios.post(api.category.list).then((res) => {
        if (res.code === 200) {
          categoryList = res.data
          // console.log('categoryList---', categoryList)
          const _index = categoryList.findIndex((item) => {
            return item.id === query.id
          })
          if (_index > -1) {
            activeIndex = _index
          }
        }
      })
      return {
        categoryList,
        activeIndex
      }
    } catch (e) {
      error(e)
    }
  },
  data () {
    return {
      value: '',
      activeKey: 0,
      heitghtStyle: {
        height: 0
      }
    }
  },
  computed: {
    ...mapGetters(['locale', 'baseImageUrl']),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  mounted () {
    if (this.$route.query.id) {
      this.activeKey = this.activeIndex
    }
    if (process.browser) {
      this.heitghtStyle.height = (document.documentElement.clientHeight - document.getElementsByClassName('van-sticky')[0].offsetHeight - document.getElementsByClassName('van-tabbar')[0].offsetHeight) + 'px'
    }
    this.setTabBarActive(1)
  },
  methods: {
    ...mapMutations(['setTabBarActive']),
    changeCategory (i) {
      this.activeKey = i
    },
    toThreeCate (item) {
      window.sessionStorage.setItem('page', 'category')
      this.$router.push(`/cate/${item.id}?name=${this.locale === 'zh-CN' ? item.category : item.categoryJp}`)
    },
    goStop () { }
  },
  head () {
    return {
      title: 'Starday - ネット通販公式サイト｜全てのカテゴリー',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'stardayにあるジャンルトップ一覧です。豊富な品揃え、ジャンル毎に日々更新される旬のイベントやお得情報、キャンペーンなどが満載のジャンルトップで欲しい商品を見つけよう！'
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: '全てのカテゴリー,starday,starday市場,starday mart,通販,インターネットショッピング'
        }
      ],
      link: [
        {
          hid: 'canonical',
          ref: 'canonical',
          href: 'https://www.starday.jp/category'
        },
        {
          hid: 'alternate',
          ref: 'alternate',
          media: 'only screen and (max-width: 640px)',
          href: 'https://m.starday.jp/category'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  width: 750px;
  height: 88px;
  padding: 12px 20px;
  .van-search__content {
    width: 100%;
    height: 60px;
    .van-cell {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
      padding-left: 20px;
      /deep/.van-field__left-icon {
        margin-right: 20px;
      }
      .van-cell__value {
        .van-field__body {
          /deep/.van-field__control {
            font-size: 26px;
            font-weight: 400;
            text-align: left;
            color: #999999;
            line-height: 37px;
          }
        }
      }
    }
  }
  .search-icon {
    width: 28px;
    height: 28px;
  }
}
.cont-r {
  background-color: #ffffff;
}
.category-container {
  width: 750px;
  height: 1vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  background-color: #f4f4f4;
  padding-right: 24px;
  padding-top: 20px;
  .category-tem::-webkit-scrollbar {
    display: none;
  }
  .category-tem {
    width: 200px;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    .scroll-container {
      position: absolute;
      width: inherit;
      .item {
        width: 100%;
        height: 100%;
        padding: 26px 26px 26px 20px;
        display: flex;
        align-items: center;
        border-left: 6px solid #f4f4f4;
        justify-content: center;
        .title {
          font-size: 26px;
          font-weight: 400;
          text-align: left;
          color: #666666;
          line-height: 40px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          -moz-box-orient: vertical;
          word-break: break-all;
        }
      }
      & .active {
        background-color: #ffffff;
        border-left: 6px solid #ff5d19;
      }
    }
  }
  .category-content::-webkit-scrollbar {
    display: none;
  }
  .category-content {
    flex: 1;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    position: relative;
    border-top-right-radius: 15px;
    .scroll-container {
      width: 100%;
      height: auto;
      position: absolute;
      background-color: #ffffff;
      padding: 28px 28px 0;
      font-size: 0;
      .cateImage {
        width: 470px;
        height: 200px;
        border-radius: 8px;
      }
      .category-item {
        .item-title {
          font-size: 28px;
          font-weight: 600;
          text-align: left;
          color: #333333;
          line-height: 40px;
          margin: 40px 0;
        }
        .item-production {
          display: flex;
          width: 100%;
          flex-flow: row wrap;
          justify-content: flex-start;
          align-items: center;
          .pro-content:nth-child(1),
          .pro-content:nth-child(2),
          .pro-content:nth-child(3) {
            margin-top: 0;
          }
          .pro-content {
            flex-basis: 33%;
            font-size: 0;
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            margin-top: 40px;
            height: 220px;
            padding: 0 10px;
            .pro-link{
              .pro-image {
                width: 118px;
                height: 118px;
                object-fit: cover;
              }
            }
            .pro-title-box{
              margin-top: 10px;
              .pro-title {
                font-size: 24px;
                font-weight: 400;
                text-align: left;
                color: #333333;
                line-height: 33px;
                margin-top: 10px;
                overflow:hidden;
                text-overflow:ellipsis;
                display:-webkit-box;
                -webkit-box-orient:vertical;
                -webkit-line-clamp:2;
              }
            }
          }
        }
      }
    }
  }
}
</style>
