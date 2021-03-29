<!---->
<template>
  <div>
    <van-nav-bar
      :title="$t('user_main.about')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>

    <div class="login_main">
      <div class="login_logo">
        <van-icon :name="require('assets/images/login/starday_logo.png')" />
      </div>
      <div class="dowload">
        <div>For APP V3.0</div>
        <div>
          <img src="~/assets/images/about/dowload.png" alt="">
        </div>
        <div>{{$t('about.code')}}</div>
      </div>

      <div class="login_form">
        <div class="thirdlogin">
          <van-icon :name="require('assets/images/about/privacy.png')" />
          <div @click="show = true">{{$t('about.privacy')}}></div>
        </div>
      </div>
    </div>
    <van-popup
      v-model="show"
      :style="{ height: '80%', width:'80%', padding:'15px'}"
      closeable
    >
      <Privacy />
    </van-popup>
  </div>
</template>

<script>
import Privacy from '~/components/privacy/index'
export default {
  layout: 'content',
  components: {
    Privacy
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    // 登陆
    onClickLeft () {
      window.history.go(-1)
    }
  }
}
</script>

<style  scoped lang="less">
  /deep/.van-nav-bar__content {
    height: 88px;
    line-height: 88px;
  }
  /deep/.van-nav-bar__title {
    font-size: 30px;
    color: #333333;
  }
  /deep/.van-icon-arrow-left {
    color: #999;
    font-size: 40px;
  }
.close {
  font-size: 24px;
  position: absolute;
  top: 25px;
  left: 25px;
  z-index: 999;
}
.login_main {
  margin-top: 60px;
  width: 100%;
  height: 1110px;
  background: url('../../../assets/images/login/bg.png') no-repeat;
  background-size: 100% 100%;
  position: relative;
  overflow: hidden;
}
.login_logo {
  font-size: 185px;
  position: absolute;
  top: 30px;
  left: 290px;
}
.login_desc {
  margin-top: 232px;
  font-size: 32px;
  font-weight: bold;
  color: rgba(255, 94, 26, 1);
  line-height: 60px;
  text-align: center;
}
.login_form {
  padding: 40px 72px;
}

.thirdlogin {
  font-size: 32px;
  text-align: center;
  div {
    margin-top: 20px;
  }
}
.thirdlogin i {
  font-size: 70px;
}
.sendCode {
  font-size: 24px;

  font-weight: normal;
  color: rgba(255, 93, 25, 1);
}
.code {
  box-shadow: 0px 0px 8px #eee;
  margin-bottom: 20px;
  border-radius: 30px;
}
.dowload {
  width: 100%;
  margin-top: 280px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 32px;
}
.dowload div:first-child {
  margin-bottom: 20px;
  color: #333333;
}
.dowload div:nth-of-type(2) {
  img {
    width: 260px;
    height: 260px;
  }
}
.dowload div:last-child {
  width: 50%;
  text-align: center;
  font-size: 28px;
  color: #666;
  margin-top: 26px;
  line-height: 40px;
}
</style>
