<template>
    <van-tabbar v-model="item" fixed active-color="#ED5821" placeholder @change="tabBarChange">
      <van-tabbar-item to="/">
        <span>{{$t('menu.home')}}</span>
        <template #icon="props">
          <img :src="props.active ? require('assets/images/footer/tab_home_selected.gif') : require('assets/images/footer/tab_home.png')" />
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/category">
        <span>{{$t('menu.category')}}</span>
        <template #icon="props">
          <img :src="props.active ? require('assets/images/footer/tab_class_selected.gif') : require('assets/images/footer/tab_class.png')"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item  to="/personal/emailList">
        <span>{{$t('menu.message')}}</span>
        <template #icon="props">
          <img :src="props.active ? require('assets/images/footer/tab_message_selected.gif') : require('assets/images/footer/tab_message.png')"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item @click="goToShoppingcart">
        <span>{{$t('menu.cart')}}</span>
        <template #icon="props">
          <img :src="props.active ? require('assets/images/footer/tab_cart_selected.gif') : require('assets/images/footer/tab_cart.png')"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/personal">
        <span>{{$t('menu.person')}}</span>
        <template #icon="props">
          <img :src="props.active ? require('assets/images/footer/tab_mine_selected.gif') : require('assets/images/footer/tab_mine.png')" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {},
  props: {
    active: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
    return {
      item: '',
      icon: {
        active: 'asset/images/index/shouye.png',
        inactive: 'asset/images/index/shouye2.png'
      }
    }
  },
  computed: {
    ...mapGetters({
      login: 'login'
    })
  },
  watch: {
    active: {
      immediate: true,
      handler (e) {
        this.item = e
      }
    }
  },
  methods: {
    ...mapMutations(['setTabBarActive']),
    tabBarChange (active) {
      this.setTabBarActive(active)
    },
    goToShoppingcart () {
      if (this.login) {
        this.$router.push('/shoppingcart')
      } else {
        this.$router.push('/touristCart')
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.van-tabbar{
    height: 98px;
    .van-tabbar-item{
      .van-tabbar-item__icon{
        img{
          width: 50px;
          height: 50px;
        }
      }
      .van-tabbar-item__text{
        margin-top: 10px;
        font-size: 20px;
      }
    }
  }
</style>
