<!---->
<template>
  <div class="swpier">
    <van-swipe
      ref="swpier"
      :autoplay="duration"
      loop
      width="100%"
      height="325"
      @change="onChange"
    >
      <van-swipe-item v-for="item in imgList" :key="item">
        <van-image
          v-if="item.indexOf('mp4') == -1"
          width="100%"
          height="100%"
          lazy-load
          :loading-icon="require('assets/images/loading/load.png')"
          :error-icon="require('assets/images/loading/load.png')"
          v-lazy="$imgHead+item"
        />
        <div v-else class="video">
          <video
            id="media"
            ref="media"
            :style="{'width':'100%', 'height':'100%', 'object-fit': 'fill'}"
            controls
            :poster="$imgHead+imgList[1]"
            v-lazy="$imgHead+item"
            type="video/mp4"
          >Your browser does not support the video tag.</video>
        </div>
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }}/{{length}}</div>
      </template>
    </van-swipe>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  components: {},
  props: ['imgList'],
  data () {
    return {
      current: 0,
      length: 0,
      list: [],
      duration: 3000
    }
  },
  watch: {
    imgList (val) {
      console.log(val)
      this.length = val.length
      this.list = val
    }
  },
  updated () {
    const that = this
    const myVideo = document.getElementById('media')
    if (myVideo) {
      console.log(myVideo)
      myVideo.addEventListener('play', function () {
        console.log('开始播放')
        that.duration = 50000
      })

      // 监听播放结束
      myVideo.addEventListener('pause', function () {
        console.log('播放暂停')
      })

      // 监听播放结束
      myVideo.addEventListener('ended', function () {
        console.log('播放结束')
        that.duration = 3000
      })
    }
  },

  methods: {
    onChange (index) {
      this.current = index
    }
  }

}
</script>

<style   scoped>
.swpier {
  position: relative;
}
.custom-indicator {
  position: absolute;
  right: 180px;
  bottom: 16px;
  padding: 2px 5px;
  width: 27px;
  height: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  text-align: center;
  line-height: 20px;
  color: rgba(255, 255, 255, 1);
  font-size: 10px;
}
</style>
<style lang="less">
.van-swipe-item {
  .van-icon__image {
    font-size: 88px;
  }
}
.video {
  height: 325px;
  width: 100%;
}
</style>
