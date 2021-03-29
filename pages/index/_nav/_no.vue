<template>
<div class="other-nav-container">
  <!--  金刚区-->
  <div class="grid">
    <div v-for="(item,index) in gridList.childType" :key="index" class="grid-item" @click.stop="goThreeClass(item)">
      <a class="image-a" :href="getUrl + 'cate/' + item.typeId + '?cateType=secCategoryId&name=' + item.name.split('|')[1]" :title="item.name.split('|')[1]" @click.prevent="()=> false"><img v-lazy="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'" class="item-img" :alt="item.name.split('|')[1]" /></a>
      <a class="text-a" :href="getUrl + 'cate/' + item.typeId + '?cateType=secCategoryId&name=' + item.name.split('|')[1]" :title="item.name.split('|')[1]" @click.prevent="()=> false"><span class="item-title">{{item.name.split('|')[1]}}</span></a>
    </div>
    <div class="grid-item" @click="goCategoryDetail">
      <a :href="getUrl + 'category'" @click.prevent="()=> false">
        <img class="item-img" style="width: 27px;height: 27px;margin-top: 13.5px" src="~/assets/images/index/indexMore.png" :alt="$t('index.viewmore')">
      </a>
      <a :href="getUrl + 'category'" @click.prevent="()=> false">
        <span class="item-title">{{$t('index.viewmore')}}</span>
      </a>
    </div>
  </div>
  <div class="advertising">
    <div v-for="(item,index) in gridList.activeData" :key="index" class="advert-content" @click="goActivityPage(item)">
      <img v-lazy="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'" class="content-img" :alt="item.img">
    </div>
  </div>
  <div class="gooods-list-content">
    <GoodsList :list="otherNavGoodsList.rows"></GoodsList>
  </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '~/static/api'
import GoodsList from '~/components/search/list'
export default {
  name: 'HomePageNo',
  components: {
    GoodsList
  },
  async asyncData ({ $axios, params, error }) {
    try {
      const nav = params.nav || 1
      const pageNo = params.no || 1
      let otherNavGoodsList
      let gridList
      let typeId
      let navData
      // 首页基础数据
      await $axios.get(api.home.indexData).then((res) => {
        if (res.code === 200) {
          navData = res.data.navData
          gridList = res.data.navData[nav - 1]
          typeId = res.data.navData[nav - 1].typeId || ''
        }
      })
      await $axios.post(api.store.goods, {
        pageNo: 1,
        pageSize: pageNo * 20,
        firstCategoryId: typeId
      }).then((res) => {
        if (res.code === 200) {
          otherNavGoodsList = res.data
        }
      })
      return {
        navData,
        gridList,
        nav,
        pageNo,
        typeId,
        otherNavGoodsList
      }
    } catch (e) {
      error(e)
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl']),
    getUrl () {
      return process.env.proxyUrl
    }
  },
  methods: {
    goThreeClass (item) {
      this.$router.push(`/cate/${item.typeId}?cateType=secCategoryId&name=${item.name.split('|')[1]}`)
      window.sessionStorage.setItem('prefixPage', 'outNav')
      window.sessionStorage.setItem('prePage', '/' + location.search)
    },
    goCategoryDetail () {
      this.$router.push('/category')
    }
  }
}
</script>

<style lang="less" scoped>
.other-nav-container{
  width: 100%;
  height: auto;
  background-color: #f4f4f4;
  padding-top: 20px;
  .grid {
    width: 702px;
    height: 400px;
    margin: 0px auto;
    background-color: #ffffff;
    border-radius: 10px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    .grid-item {
      flex-basis: 25%;
      height: 180px;
      font-size: 0;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      .image-a{
        display: inline-block;
        margin-top: 10px;
        .item-img {
          width: 108px;
          height: 108px;
        }
      }
      .text-a{
        display: inline-block;
        text-align: center;
        margin-top: 10px;
        .item-title {
          font-size: 24px;
          font-weight: 400;
          color: #333333;
          line-height: 33px;
          text-align: center;
        }
      }
    }
  }
  .advertising {
    width: 100%;
    padding: 22px 24px;
    .advert-content {
      width: 100%;
      height: 170px;
      border-radius: 10px;
      overflow: hidden;
      font-size: 0;
      .content-img {
        width: 100%;
        height: 170px;
        object-fit: cover;
      }
    }
  }
  .gooods-list-content{
    padding: 0 24px;
  }
}
</style>
