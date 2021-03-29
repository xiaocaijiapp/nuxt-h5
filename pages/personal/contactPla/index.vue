<template>
  <div class="contactPla">
    <div class="content">
      <van-nav-bar :title="typeTitle === '2' ? emailInfo.sendUserName : $t('mail.Starday')" left-arrow @click-left="onClickLeft" />
      <div class="bodybox">
        <div class="receivebox">
          <span>
            {{$t('mail.toperson')}}
          </span>
          <span>
            {{typeTitle === '2' ? emailInfo.sendMail : 'starday@starday.jp'}}
          </span>
        </div>

        <div class="themebox">
          <input v-model="themeText" maxlength="50" :placeholder="$t('mail.theme')" />
        </div>
        <div class="textbox">
          <van-field v-model="mainmsg" class="textTitle" rows="5" autosize type="textarea" maxlength="500" :placeholder="$t('mail.placeIntContent')" show-word-limit />
        </div>
        <div class="uploadimg">
          <van-uploader v-model="fileList" :accept="'image/gif,image/jpeg,image/jpg,image/png,video/mp4,video/mkv,video/rmvb'" :multiple="false" preview-image preview-full-image :max-size="5 * 1024 * 1024" :max-count="5" upload-icon='plus' :after-read="afterRead" @oversize="onOversize" />
        </div>

        <p class="warnText">
          {{$t('mail.uploadFile')}}，{{$t('mail.filedesc')}}
        </p>
        <div class="sendPerson">
          <span>
            {{$t('mail.fromperson')}}：
          </span>
          <span>
            {{userInfo.stardayEmail}}
          </span>
        </div>
      </div>
    </div>
    <div class="sendbutton">
      <van-button round type="primary" block :disabled="disabled" @click="onSubmit">{{$t("mail.sendTo")}}</van-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Toast from 'vant'
export default {
  name: 'ContactPla',
  layout: 'content',
  data () {
    return {
      mainmsg: '',
      fileList: [],
      disabled: false,
      emailInfo: {},
      imglist: [],
      themeText: '',
      typeTitle: '1'
    }
  },
  computed: {
    ...mapGetters(['replyEmial', 'userInfo'])
  },
  mounted () {
    if (this.$route.query.type) {
      this.typeTitle = this.$route.query.type
      this.emailInfo = JSON.parse(sessionStorage.getItem('msgInfo'))
    } else {
      this.emailInfo = this.replyEmial
    }
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    onOversize (file) {
      Toast('文件大小不能超过 500kb')
    },
    afterRead (file) {
      const vm = this
      const formData = new FormData()
      formData.append('file', file.file)
      vm.$axios({
        url: 'starday-mail/file/uploadImage',
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        data: formData
      }).then((res) => {
        if (res.code === 200) {
          vm.imglist.push(res.data)
        }
      })
    },
    onSubmit () {
      const vm = this
      console.log(vm.userInfo)
      if (!vm.themeText) {
        vm.$toast(vm.$t('newThreeClass.plaIntTheme'))
        return
      }
      if (!vm.mainmsg) {
        vm.$toast(vm.$t('mail.placeIntContent'))
        return
      }
      const _data = {
        attachments: vm.imglist.join(','),
        title: vm.themeText,
        text: vm.mainmsg,
        receiveMail: vm.typeTitle === '1' ? 'starday@starday.jp' : vm.emailInfo.sendMail
      }
      vm.$axios({
        url: 'starday-mail/mail/sendMail',
        method: 'post',
        data: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.$toast(vm.$t('register.sendSuccess'))
          if (vm.$route.query.goodsId) {
            vm.$router.push('/product/' + vm.$route.query.goodsId)
          } else {
            vm.$router.push('/personal/emailList')
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.contactPla {
  position: relative;
  height: 100vh;
  .content {
    .van-nav-bar {
      height: 88px;
    }
    /deep/.van-nav-bar__content {
      height: 100%;
    }
    /deep/.van-nav-bar__title {
      height: 100%;
      line-height: 88px;
      font-size: 36px;
      color: #323233;
      font-weight: 500;
    }
    /deep/.van-nav-bar .van-icon {
      font-size: 36px;
    }
    .bodybox {
      padding: 0 30px;
      background-color: #fff;
      .receivebox,
      .themebox {
        height: 104px;
        border-bottom: 1px solid #e5e5e5;
        font-size: 28px;
        color: #333;
        line-height: 104px;
      }
      .themebox {
        input {
          width: 100%;
          height: 100%;
          color: #999;
          border-bottom: 1px solid #e5e5e5;
          outline: none;
        }
      }
      .textbox {
        margin-top: 32px;
        /deep/.van-field__control {
          font-size: 28px;
        }
      }
    }
    .uploadimg {
      margin-top: 20px;
      /deep/.van-uploader__upload {
        height: 160px;
        width: 160px;
      }
      /deep/.van-uploader__preview-image {
        height: 160px;
        width: 160px;
      }
      /deep/.van-uploader__preview-delete-icon {
        font-size: 40px;
        top: -6px;
        right: -6px;
      }
      /deep/.van-uploader__preview-delete {
        width: 30px;
        height: 30px;
      }
    }
    .warnText {
      margin-top: 20px;
      font-size: 22px;
      color: #333;
    }
    .sendPerson {
      height: 104px;
      margin-top: 32px;
      font-size: 28px;
      color: #333;
      line-height: 104px;
      border-top: 1px solid #e5e5e5;
    }
  }
  .sendbutton {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 90%;
    height: 78px;
    transform: translateX(-50%);
    margin: 0 auto;
    button {
      border: 0;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 161, 75, 1) 0%,
        rgba(255, 93, 25, 1) 100%
      );
    }
  }
}
/deep/.van-field__body {
  line-height: 36px;
}
</style>
