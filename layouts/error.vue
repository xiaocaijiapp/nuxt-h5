<template>
  <div class="__nuxt-error-page">
    <van-nav-bar
      title="error"
      left-arrow
      @click-left="$router.push('/')"
    />
    <div class="error-image">
      <img class="err-img" src="~/assets/images/icon/fail.png" />
      <p class="description">{{$t('menu.errMessage')}}</p>
      <div class="title" style="opacity: 0">{{ message }}</div>
      <div class="title" style="opacity: 0">{{ error.url || '' }}</div>
      <div class="path" style="opacity: 0">{{error.statusCode}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NuxtError',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message || '服务器开小差了...'
    }
  },
  watch: {
    error: {
      immediate: true,
      deep: true,
      handler (e) {
        console.log(e)
      }
    }
  },
  head () {
    return {
      title: this.message,
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0'
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
  .__nuxt-error-page {
    width: 100%;
    height: calc(100vh - 98px);
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .error-image {
      width: 100%;
      flex: 1;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;
      .err-img {
        width: 100%;
        height: 400px;
        object-fit: contain;
      }
      .description {
        margin-top: 60px;
        font-size: 36px;
        font-weight: 600;
      }
    }
  }
</style>
