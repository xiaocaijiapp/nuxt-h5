<template>
<div class="seo-container">
  <van-nav-bar
    title="Searches"
    left-arrow
    fixed
    border
    placeholder
    @click-left="$router.go(-1)"
  />
  <div class="list">
    <a v-for="(item, index) in rows" :key="index" class="a-link" :href="item.categoryId ? baseUrl + 'cate/' + item.categoryId : baseUrl + 'search/product/' + item.word + '/1'" @click.prevent="()=> false">
      <span class="link-text" @click="toNextPage(item)">{{ item.word }}</span>
    </a>
  </div>
  <div class="paging">
    <Pagination :total="totalRows" :current-page="page" :display="200" @pageChange="pageChange" />
  </div>
</div>
</template>

<script>
import Pagination from '@/components/pagination/Pagination'
export default {
  name: 'PageNo',
  layout: 'content',
  components: {
    Pagination
  },
  async asyncData ({ $axios, params }) {
    const page = params.pageNo * 1
    const { data: { rows, totalPage, totalRows } } = await $axios.post('/starday-elasticsearch/seo/search/aggregation', { pageNo: page, pageSize: 200 })
    return {
      page,
      rows,
      totalPage,
      totalRows
    }
  },
  computed: {
    baseUrl () {
      return process.env.proxyUrl
    }
  },
  methods: {
    pageChange (e) {
      this.$router.push('/sitemap/searches/' + e)
    },
    toNextPage ({ categoryId, word }) {
      if (categoryId) {
        this.$router.push('/cate/' + categoryId + '?name=' + word)
      } else {
        this.$router.push('/search/product/' + word + '/1')
      }
    }
  },
  head () {
    return {
      title: 'Starday All Searches'
    }
  }
}
</script>

<style lang="less" scoped>
  .seo-container {
    width: 100%;
    height: auto;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: flex-start;
    .list {
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      padding: 0px 30px;
      .a-link {
        text-decoration: none;
        font-size: 32px;
        color: #2D8cF0;
        padding: 6px 0px;
      }
    }
    .paging {
      display: flex;
      align-items: center;
      .a-link-active {
        border-color: #2d8cf0!important;
        color: #2d8cf0!important;
      }
      .a-link{
        text-decoration: none;
        font-size: 16px;
        margin: 0 8px;
        width: 30px;
        height: 30px;
        border: 1px solid #dcdee2;
        text-align: center;
        line-height: 30px;
        border-radius: 6px;
        color: #515a6e;
        background: #ffffff;
        display: inline-block;
      }
      .a-link:hover{
        border-color: #2d8cf0;
        color: #2d8cf0;
      }
      .a-link:first-child{
        margin-left: 0;
      }
      .a-link:last-child{
        margin-right: 0;
      }
      .arrow-l,.arrow-r{
        /*cursor: not-allowed;*/
        width: 30px;
        height: 30px;
        background: #ffffff;
        color: #2A9A2E;
        text-decoration: none;
        display: inline-block;
        border: 1px solid #dcdee2;
        text-align: center;
        border-radius: 6px;
        line-height: 30px;
      }
    }
  }
</style>
