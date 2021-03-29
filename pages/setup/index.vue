<!---->
<template>
  <div>
    <van-nav-bar
      :title="$t('supply.seting')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>
    <div class="setup_main">
      <van-cell class="cell" value is-link url="/personal/resetPwd">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">{{$t('newUserInfo.safe')}}</span>
        </template>
      </van-cell>
      <van-cell class="cell" value is-link @click="Language">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">{{$t('newUserInfo.setLanguage')}}</span>
        </template>
      </van-cell>
      <van-cell class="cell" value="V3.0" is-link url="/about/starday" style="display: none">
        <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">{{$t('user_main.about')}}</span>
        </template>
      </van-cell>
      <!--  -->
    </div>
    <van-button
      type="default"
      block
      class="loginout"
      @click="loginout"
    >{{$t('newUserInfo.loginOut')}}</van-button>
    <van-dialog
      v-model="showModel"
      :title="$t('newUserInfo.setLanguage')"
      confirm-button-color="rgba(102,102,102,1)"
      :confirm-button-text="$t('supply.save')"
      @confirm="changeLanguage"
    >
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell
            :title="$t('newUserInfo.janpanse')"
            clickable
            @click="radio = '1'"
          >
            <template #right-icon>
              <van-radio name="1" checked-color="#FF5D19" />
            </template>
          </van-cell>
          <van-cell
            :title="$t('newUserInfo.Chinese')"
            clickable
            @click="radio = '2'"
          >
            <template #right-icon>
              <van-radio name="2" checked-color="#FF5D19" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex'
export default {
  name: 'Setup',
  layout: 'content',
  components: {},
  data () {
    return {
      username: '',
      password: '',
      language: false,
      showModel: false,
      radio: 1
    }
  },
  created () {
    this.$i18n.locale === 'zh-CN' ? this.radio = '2' : this.radio = '1'
  },
  methods: {
    ...mapMutations(['SET_LANG', 'setAccessToken', 'setLoginState', 'setUserInfo']),
    ...mapActions(['loginOut']),
    Language () {
      const that = this
      that.showModel = true
    },
    changeLanguage () {
      const _this = this
      switch (_this.radio) {
        case '1':
          _this.$i18n.locale = 'ja-JP'
          _this.SET_LANG('ja-JP')
          this.$Locale('ja-JP')
          break
        case '2':
          _this.$i18n.locale = 'zh-CN'
          _this.SET_LANG('zh-CN')
          this.$Locale('zh-CN')
          break
        default:
          _this.$i18n.locale = 'ja-JP'
          _this.SET_LANG('ja-JP')
          this.$Locale('ja-JP')
      }
    },
    loginout () {
      this.loginOut().then((res) => {
        this.$router.push('/login')
      })
    },
    onClickLeft () {
      this.$router.push('/personal')
    }
  }
}
</script>

<style scoped lang="less">
  /deep/.van-nav-bar__content {
    height: 88px;
    line-height: 88px;
  }
  /deep/.van-nav-bar__title {
    font-size: 32px;
    color: #333333;
  }
  /deep/.van-icon-arrow-left {
    color: #999;
    font-size: 36px;
  }
  .cell {
    height: 104px;
    display: flex;
    align-items: center;
  }
  .van-cell__right-icon {
    font-size: 30px;
  }
  .van-cell {
    padding: 16px 30px;
  }
  .van-cell__value {
    line-height: 40px;
    font-size: 28px;
  }
  /deep/.van-button {
    height: 80px;
    font-size: 24px;
  }
  /deep/.van-dialog{
    width: 560px;
  }
  /deep/.van-dialog__header{
    font-size: 32px;
    padding: 30px 0;
  }
  /deep/.van-cell--large{
    padding-top: 20px;
    padding-bottom: 20px;
  }
  /deep/.van-cell__title{
    font-size: 26px;
  }
  /deep/.van-radio {
    width: 32px;
    height: 32px;
  }
  /deep/.van-radio__icon{
    width: 100%;
    height: 100%;
    font-size: 32px;
  }
  /deep/.van-dialog__footer{
    height: 80px;
  }
  /deep/.van-dialog__confirm{
    height: 100%;
    font-size: 28px;
  }
  .setup_main {
    margin-top: 15px;
  }
  .loginout {
    margin-top: 10px;
  }
</style>
