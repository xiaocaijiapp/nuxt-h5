<template>
  <div class="textBox" :style="backgroundColor">
    <van-sticky>
      <div class="nav">
        <div class="arrow-left" @click="onClickLeft">
          <img src="~/assets/images/goodsdetail/arrow-left.png" />
        </div>
        <div class="center">
          <span>{{title}}</span>
        </div>
        <div class="right-icon" @click="Share">
          <img src="~/assets/images/goodsdetail/fenxiang2.png" />
        </div>
      </div>
    </van-sticky>
    <div class="head">
      <van-image width="100%" height="100%" :src="imgUrl + imgUrlDet" />
    </div>
    <div class="box">
      <div v-for="(item,index) in textImgBox " :key="index">
        <van-image v-if="item.type == 'img'&&item.content" :src="imgUrl+'/'+ item.content" width="100%" />
        <div v-else class="content">{{item.content?item.content:''}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '~/static/api'
export default {
  name: 'TextBox',
  layout: 'content',
  async asyncData ({ $axios, params, query, store }) {
    const cateId = params.id
    const dataList = await $axios.get(api.activity.activePage + cateId)
    const title = store.state.common.locale === 'ja-JP' ? dataList.data.title.split('|')[1] : dataList.data.title.split('|')[0]
    const imgUrlDet = dataList.data.backgroundImg
    const textImgBox = dataList.data.imgTextList
    const bgc = dataList.data.backgroundColor
    return {
      title,
      imgUrlDet,
      textImgBox,
      backgroundColor: {
        background: bgc || '#F4F4F4'
      }
    }
  },

  data () {
    return {
      imgUrl: 'https://image.stardaymart.com/'
    }
  },
  computed: {
    ...mapGetters(
      { getLoginData: 'userInfo' },
      ['baseImageUrl', 'locale', 'login'])
  },
  methods: {
    ...mapMutations(['SET_LANG']),
    onClickLeft () {
      const prefixPageName = window.sessionStorage.getItem('prefixPage')
      const prePageName = window.sessionStorage.getItem('prePage')
      if (prefixPageName === 'outNav') {
        this.$router.push(prePageName)
      } else {
        this.$router.push('/')
      }
      window.sessionStorage.removeItem('prefixPage')
      window.sessionStorage.removeItem('prePage')
    },
    Share () {
      // this.$emit('changeShareData', true)
      const vm = this
      let _url = location.origin + location.pathname
      const _str = []
      if (vm.getLoginData.id) {
        if (vm.$route.query) {
          for (const i in vm.$route.query) {
            if (i !== 'shareId' && i !== 'shareSource' && i !== 'shareTime') {
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
      vm.$copyText(_url).then(function (e) {
        vm.$toast.success(vm.$t('home.copysuccess'))
      }, function (e) {
        vm.$toast.fail(vm.$t('home.copyerror'))
      })
    }
  }
}
</script>

<style lang="less" scoped>
.textBox {
  // background-color: #fff;
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
    .arrow-left {
      width: 52px;
      height: 33px;
      padding-left: 33px;
      img {
        width: 19px;
        height: 33px;
      }
    }
    .center {
      text-align: center;
      font-size: 36px;
    }
    .right-icon {
      img {
        width: 62px;
        height: 62px;
      }
    }
  }
  .head {
    height: 380px;
  }
  .textImgBox {
    width: 100%;
    box-sizing: border-box;
    padding: 24px;
  }
}
</style>
