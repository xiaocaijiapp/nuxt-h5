<!---->
<template>
  <div>
    <div class="index-grid">
      <div v-for=" (item,index) in gridList" :key="index" class="grid-item" @click="clickGrid(item)">
        <a v-if="item.tem === '0'" :href="getUrl + 'promotionpage/promotiongoods/' + item.kingId" class="item-image" :title="item.name.split('|')[lang]" @click.prevent="()=> false">
          <img :src="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'" :alt="item.name.split('|')[lang]"/>
        </a>
        <a v-if="item.tem === '1'" :href="getUrl + 'promotionpage/promotiondiscount/' + item.kingId" class="item-image" :title="item.name.split('|')[lang]" @click.prevent="()=> false">
          <img :src="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'" :alt="item.name.split('|')[lang]"/>
        </a>
        <a v-if="item.tem === '2'" :href="getUrl + 'promotionpage/promotionpicture/' + item.kingId" class="item-image" :title="item.name.split('|')[lang]" @click.prevent="()=> false">
          <img :src="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'" :alt="item.name.split('|')[lang]"/>
        </a>
        <a v-if="item.tem === '6'" href="javascript:void(0);" :title="item.name.split('|')[lang]" class="item-image" @click.prevent="openApp">
          <img :src="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'" :alt="item.name.split('|')[lang]"/>
        </a>
        <a v-if="item.tem === '7'" :href="getUrl + 'personal/giftCard'" :title="item.name.split('|')[lang]" class="item-image" @click.prevent="()=> false">
          <img :src="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'" :alt="item.name.split('|')[lang]"/>
        </a>
        <a v-if="item.tem === '8'" :href="getUrl + 'flash'" :title="item.name.split('|')[lang]" class="item-image" @click.prevent="()=> false">
          <img :src="baseImageUrl + item.img + '?x-oss-process=image/resize,w_1000/format,webp'" :alt="item.name.split('|')[lang]"/>
        </a>

        <a v-if="item.tem === '0'" :href="getUrl + 'promotionpage/promotiongoods/' + item.kingId" class="item-text" :title="item.name.split('|')[lang]" @click.prevent="()=> false">
          <span>{{ item.name.split('|')[lang]}}</span>
        </a>
        <a v-if="item.tem === '1'" :href="getUrl + 'promotionpage/promotiondiscount/' + item.kingId" class="item-text" :title="item.name.split('|')[lang]" @click.prevent="()=> false">
          <span>{{ item.name.split('|')[lang]}}</span>
        </a>
        <a v-if="item.tem === '2'" :href="getUrl + 'promotionpage/promotionpicture/' + item.kingId" class="item-text" :title="item.name.split('|')[lang]" @click.prevent="()=> false">
          <span>{{ item.name.split('|')[lang]}}</span>
        </a>
        <a v-if="item.tem === '6'" href="javascript:void(0);" :title="item.name.split('|')[lang]" class="item-text" @click.prevent="openApp">
          <span>{{ item.name.split('|')[lang]}}</span>
        </a>
        <a v-if="item.tem === '7'" :href="getUrl + 'personal/giftCard'" :title="item.name.split('|')[lang]" class="item-text" @click.prevent="()=> false">
          <span>{{ item.name.split('|')[lang]}}</span>
        </a>
        <a v-if="item.tem === '8'" :href="getUrl + 'flash'" :title="item.name.split('|')[lang]" class="item-text" @click.prevent="()=> false">
          <span>{{ item.name.split('|')[lang]}}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {},
  props: {
    gridList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['baseImageUrl', 'locale']),
    lang () {
      const lang = this.locale === 'ja-JP' ? 1 : 0
      return lang
    },
    getUrl () {
      return process.env.proxyUrl
    }
  },
  created () { },

  methods: {
    clickGrid (item) {
      const vm = this
      // console.log(item)
      switch (item.tem) {
        case '0':
          vm.$router.push('/promotionpage/promotiongoods/' + item.kingId)
          // window.location.href = `/promotionpage/promotiongoods/${item.kingId}`
          break
        case '1':
          vm.$router.push('/promotionpage/promotiondiscount/' + item.kingId)
          // window.location.href = `/promotionpage/promotiondiscount/${item.kingId}`
          break
        case '2':
          vm.$router.push('/promotionpage/promotionpicture/' + item.kingId)
          // window.location.href = `/promotionpage/promotionpicture/${item.kingId}`
          break
        case '6':
          // vm.$router.push('/couponcenter')
          this.openApp()
          break
        case '7':
          vm.$router.push('/personal/giftCard')
          // window.location.href = '/personal/giftCard'
          break
        case '8':
          this.$router.push('/flash')
          break
        default:
          break
      }
    },
    goStop () { },
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
    }
  }
}
</script>

<style lang="less"  scoped>
.index-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  background-color: transparent;
  padding-top: 30px;
}
.grid-item {
  flex-basis: 25%;
  height: 160px;
  font-size: 24px;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  margin-bottom: 10px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: center;
  .item-image{
    height: 108px;
    img {
      /*width: 115px;*/
      height: 108px;
      object-fit: contain;
    }
  }
  .item-text{
    margin-top: 12px;
    flex: 1;
    span{
      font-size: 24px;
      font-weight: 400;
      color: #333333;
    }
  }

}
.grid-item i {
  font-size: 56px;
}
.grid-item p {
  margin: 0;
}
</style>
