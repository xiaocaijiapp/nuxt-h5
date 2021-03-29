<template>
  <div class="three-cate-container">
    <van-sticky>
      <van-nav-bar placeholder>
        <template #left>
          <van-icon size="22px" name="arrow-left" color="#999999" @click.stop="onClickLeft" />
          <a :href="getUrl + 'category'" class="a-link" @click.prevent="()=> false">
            <van-icon name="wap-nav" size="22px" color="#999999" @click="$router.push('/category')" />
          </a>
        </template>
        <template #title>
          <h1>{{keyword}}</h1>
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="content">
      <div class="branbox">
        <a :href="getUrl" @click.prevent="()=> false">
          <span>Starday</span>
        </a>
        >
        <a :href="getUrl + 'category'" @click.prevent="()=> false">
          <span @click="$router.push('/category')">全てのカテゴリー</span>
        </a>
        >
        <span>
          <h4 style="display:inline-block;">{{keyword}}通販</h4>
        </span>
      </div>
      <GoodList v-if="list.length > 0" :list="list"></GoodList>
    </div>
    <div v-if="tagData && tagData.keywordsRelList && tagData.keywordsRelList.length" class="releasesearchbox">
      <h2>{{ keyword }}に関連する検索キーワード</h2>
      <a v-for="(item,index) in tagData.keywordsRelList" :key="index" :href="getUrl + 'search/product/' + item.introduceKeywords +'/1'" @click.prevent="()=> false">
        <span @click="$router.push(`search/product/${item.introduceKeywords}/1`)">{{ item.introduceKeywords }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '~/static/api'
import GoodList from '~/components/search/cateList'
export default {
  name: 'ThreeCate',
  layout: 'content',
  scrollToTop: true,
  middleware: ['i18n', 'auth'],
  components: {
    GoodList
  },
  async asyncData ({ $axios, params, query, error }) {
    try {
      let cateId = params.id
      const cateName = query.cateType || 'categoryId'
      // 置顶商品
      let topProducts = []
      if (query.spuIds && query.spuIds.split(',').length) {
        const topData = await $axios.post(api.goods.getGoodsInfo, query.spuIds.split(','))
        if (topData.data && topData.data.length) {
          topProducts = topData.data
        }
      }
      const { data } = await $axios.post(api.search.goodsResault, {
        [cateName]: cateId,
        pageNo: 1,
        pageSize: 20,
        listType: 5
      })
      // 获取分类树结构数据
      const resData = await $axios.get('/starday-goods/user/goods_category/getList/' + cateId)
      const treeData = []
      const obj = {}
      obj.expand = true
      if (resData.data) {
        obj.title = resData.data.categoryJp
        obj.titlezh = resData.data.category
        obj.id = resData.data.id
      } else {
        obj.title = ''
        obj.id = ''
      }
      const arr = []
      if (resData.data) {
        resData.data.goodsCategoryDtoList.forEach((item) => {
          const obj = {}
          obj.title = item.categoryJp
          obj.titlezh = item.category
          obj.children = []
          obj.id = item.id
          if (query.cateType && query.cateType === 'secCategoryId') {
            cateId = item.goodsCategoryDtoList[0].id
          }
          item.goodsCategoryDtoList.forEach((prop) => {
            const obj2 = {}
            if (prop.id === cateId) {
              obj2.title = prop.categoryJp
              obj2.id = prop.id
              obj2.titlezh = prop.category
            }
            obj.children.push(obj2)
          })
          arr.push(obj)
        })
      }
      obj.children = arr
      treeData.push(obj)
      // 关键词tag
      const tagData = await $axios.get('starday-goods/user/seo/goods_category/keywords?id=' + cateId)
      if (tagData.data && tagData.data.categoryHtmlDescription) {
        tagData.data.categoryHtmlDescription = tagData.data.categoryHtmlDescription.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<p/g, '<p style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"').replace(/<span/g, '<span style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"').replace(/<strong/g, '<strong style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"').replace(/<h2/g, '<h2 style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"').replace(/<b/g, '<b style="font-size: 12px;color: #666666;font-weight: 400 !important;word-break: break-all;white-space: pre-wrap;"')
      }
      let keyword = ''
      // const seoData = await $axios.get('/starday-system/user/seo/info/' + id + '/1/5')
      if (!tagData.data || !tagData.data.categoryTitle) {
        tagData.data = {}
        if (treeData && treeData[0] && treeData[0].children && treeData[0].children.length) {
          const _onetitle = treeData[0] ? treeData[0].title : ''
          const _twotitle = treeData[0] ? (treeData[0].children[0] ? treeData[0].children[0].title : '') : ''
          let _title = ''
          const _index = treeData[0].children[0].children.findIndex(function (item) {
            return item.id === cateId
          })
          if (_index > -1) {
            _title = treeData[0].children[0].children[_index].title
          }
          keyword = _title
          tagData.data.categoryTitle = _title + 'の通販「人気' + _title + '」商品おすすめ｜Starday市場'
          tagData.data.categoryDescription = _title + '通販のページ、人気の' + _title + 'がお得な価格で登場！全品最安値99円から！' + _onetitle + 'から' + _twotitle + 'まで品質豊富に取り揃え。セール商品・送料無料商品も多数！stardayは総合オンラインショッピングサイトです。'
          tagData.data.categoryKeywords = _title + ',' + _title + '通贩,' + _title + ' 安い,' + _title + ' 人気,' + _title + ' おすすめ,starday,starday市場'
        } else {
          tagData.data = {
            categoryTitle: '',
            categoryKeywords: '',
            categoryDescription: ''
          }
        }
      } else if (treeData && treeData[0] && treeData[0].children && treeData[0].children.length) {
        let _title = ''
        const _index = treeData[0].children[0].children.findIndex(function (item) {
          return item.id === cateId
        })
        if (_index > -1) {
          _title = treeData[0].children[0].children[_index].title
        }
        keyword = _title
      }
      return {
        cateId,
        treeData,
        keyword,
        tagData: tagData.data,
        name: query.keyName || query.name,
        list: [...topProducts, ...data.rows]
      }
    } catch (e) {
      error(e)
    }
  },
  computed: {
    ...mapGetters({
      locale: 'locale'
    }),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  methods: {
    onClickLeft () {
      const path = window.sessionStorage.getItem('page')
      const prefixPageName = window.sessionStorage.getItem('prefixPage')
      const prePageName = window.sessionStorage.getItem('prePage')
      if (path === 'category') {
        this.$router.push('/category')
      } else if (path === '/') {
        this.$router.push('/')
      } else if (path === 'product-goodsid') {
        this.$router.go(-1)
      } else if (prefixPageName === 'outNav') {
        this.$router.push(prePageName)
      } else {
        this.$router.push('/')
      }
      window.sessionStorage.removeItem('prePage')
      window.sessionStorage.removeItem('prefixPage')
      window.sessionStorage.removeItem('page')
    }
  },
  head () {
    const vm = this
    return {
      title: vm.tagData.categoryTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: vm.tagData.categoryDescription
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: vm.tagData.categoryKeywords
        }
      ],
      link: [
        {
          hid: 'canonical',
          ref: 'canonical',
          href: 'https://www.starday.jp/cate/' + this.$route.params.id
        },
        {
          hid: 'alternate',
          ref: 'alternate',
          media: 'only screen and (max-width: 640px)',
          href: 'https://m.starday.jp/cate/' + this.$route.params.id
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.three-cate-container {
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  /deep/.van-nav-bar__content {
    height: 88px;
    width: 100%;
    .van-nav-bar__left {
      width: 125px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      .a-link{
        display: flex;
        align-items: center;
        margin-left: 10px;
      }
    }
    .van-nav-bar__title {
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 88px;
    }
  }
  .content {
    width: 100%;
    flex: 1;
    padding: 10px 20px 0px;
    .branbox {
      margin: 20px 0;
      font-size: 24px;
      color: #666;
    }
  }
}
.releasesearchbox {
  h2 {
    font-size: 14px;
    height: 40px;
    line-height: 40px;
    font-weight: normal;
    margin-bottom: 15px;
  }

  a {
    display: inline-block;
    color: #666666;
    font-size: 10px;
    /*width: 280px;*/
    margin-right: 20px;
  }
}
</style>
