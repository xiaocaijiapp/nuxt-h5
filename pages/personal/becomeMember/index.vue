<template>
  <div class="becommember">
    <van-nav-bar
      :title="$t('distribution.becomeMember')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="contentbox">
      <div class="searchbox">
        <van-field
          v-model="QYCode"
          :placeholder="$t('distribution.inputLeaderCode')"
        />
      </div>
      <p>{{$t('distribution.notBoundLeader')}}</p>
      <div class="login_button">
        <van-button color="linear-gradient(to right, #FFA24C, #FF5E1A)" block round :disabled="isCanLogin" @click="confirmHandle">{{$t('distribution.confirm')}}</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/static/api'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      QYCode: '',
      isCanLogin: true
    }
  },
  mounted () {
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    confirmHandle () {
      this.$axios.post(`${api.distribution.becomeMember}${this.QYCode}`).then((res) => {
        if (res.code === 200) {
          this.$router.push('/personal/distributionCenter')
        }
      }).catch((error) => {
        this.$toast.fail(error.message)
      })
    }
  },
  watch: {
    QYCode (val) {
      if (val) {
        this.isCanLogin = false
      } else {
        this.isCanLogin = true
      }
    }
  }
}
</script>

<style scoped lang="less">
.becommember {
  .van-nav-bar{
    height:88px;
    margin-bottom: 20px;
  }
  /deep/.van-nav-bar__content{
    height:100%;
  }
  /deep/.van-nav-bar__title{
    height:100%;
    line-height:88px;
    font-size:36px;
    color: #323233;
    font-weight: 500;
  }
  /deep/.van-button--round {
    width: 498px;
    height: 78px;
  }
  .contentbox {
    width: 690px;
    height: 406px;
    background: #fff;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: center;
    margin: 0 auto;
    .searchbox {
      width: 368px;
      height: 78px;
      padding: 20px 0;
      position: relative;
      /deep/.van-field {
        display: flex;
        align-items: center;
        height: 60px;
        border-radius: 30px;
        background: #F3F4F6;
      }
      /deep/.van-icon-search {
        font-size: 35px;
      }
      /deep/.van-field__clear {
        font-size: 30px;
      }
      /deep/.van-field__control {
        text-align: center;
      }
    }
    p {
      color: #999999;
      font-size: 28px;
    }
  }
}
</style>
