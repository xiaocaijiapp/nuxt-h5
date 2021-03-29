<template>
    <div class="experience">
      <van-nav-bar
        :title="$t('newThreeClass.useExperience')"
        placeholder
        @click-left="onClickLeft"
      >
        <template #left>
          <van-icon name="arrow-left" color="#666666" />
        </template>
      </van-nav-bar>
      <div>
        <van-field
          v-model="descText"
          autosize
          maxlength="1000"
          type="textarea"
          :placeholder="$t('newThreeClass.recomLanguage')"
          show-word-limit
        />
      </div>
      <div class="uploader_img">
<!--        <img :src="baseImageUrl + item" alt="" v-for="(item, index) in imageList" :key="index">-->
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="9"
          :upload-text="$t('newThreeClass.uploadImg')"
          class="upimg"
          :after-read="afterRead"
          @delete="deleteImg"
        />
      </div>
      <div class="login_button">
        <van-button
          color="linear-gradient(to right, #FFA24C, #FF5E1A)"
          block
          round
          :disabled="isCanShare"
          @click="onSubmit"
        >{{$t('newThreeClass.submit')}}</van-button>
      </div>
      <van-overlay :show="showOverlay">
        <div class="wrapper ">
          <img :src="require('@/assets/images/distribution/loading.gif')" alt="">
        </div>
      </van-overlay>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import api from '~/static/api'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      descText: '',
      fileList: [],
      imageList: [],
      isCanShare: true,
      goodsId: '',
      fromFlag: '',
      shareId: '',
      showOverlay: false
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl',
      userInfo: 'userInfo'
    })
  },
  watch: {
    descText (val) {
      if (val) {
        this.errormsg = this.$t('login.err')
        this.isCanShare = false
      } else {
        this.isCanShare = true
      }
    }
  },
  mounted () {
    this.goodsId = this.$route.query.goodsId
    this.fromFlag = this.$route.query.fromFlag * 1
    this.queryShareGoodsDetail()
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    queryShareGoodsDetail () {
      const _this = this
      _this.fileList = []
      _this.$axios.get('starday-goods/user/share/edit/' + _this.goodsId).then((res) => {
        if (res.code === 200) {
          this.descText = res.data.descText || ''
          _this.imageList = res.data.imageList || []
          _this.shareId = res.data.id || ''
          _this.imageList.forEach((item) => {
            const imgObj = {
              url: ''
            }
            imgObj.url = _this.baseImageUrl + item
            this.fileList.push(imgObj)
          })
          if (this.descText) {
            this.isCanShare = false
          }
        }
      })
    },
    async afterRead (imgfile) {
      const formData = new FormData()
      const that = this
      this.showOverlay = true
      imgfile.status = 'uploading'
      imgfile.message = that.$t('newCommonts.uping')
      if (imgfile.length) {
        imgfile.forEach((item) => {
          item.file.status = 'uploading'
          formData.append('files', item.file)
        })
      } else {
        formData.append('files', imgfile.file)
      }
      const res = await this.$axios.post(api.upload.uploadGoodsImgs, formData, { isFromData: true })
      if (res.code === 200) {
        this.showOverlay = false
        that.imageList = [...that.imageList, ...res.data]
        // res.data.forEach((item) => {
        //   that.imageList.push(...that.imageList, item)
        // })
        imgfile.status = 'done'
        imgfile.message = that.$t('newCommonts.up_success')
      }
    },
    deleteImg (file, detail) {
      this.imageList.splice(detail.index, 1)
      // const _index = this.imageList.findIndex((item) => {
      //   return file.url.includes(item)
      // })
      // if (_index > -1) {
      //   this.imageList.splice(_index, 1)
      // }
    },
    onSubmit () {
      const _this = this
      const params = {
        id: _this.shareId,
        goodsId: _this.goodsId,
        fromFlag: _this.fromFlag,
        descText: _this.descText,
        imageList: _this.imageList
      }
      _this.$axios.post('starday-goods/user/share/add', params).then((res) => {
        if (res.code === 200) {
          this.shareId = res.data
          this.$router.push('/product/' + _this.goodsId + '?fromFlag=' + _this.fromFlag)
        }
      })
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
/deep/.van-cell {
  padding: 32px 20px;
}
/deep/.van-field__control {
  font-size: 28px;
  line-height: 36px;
}
/deep/.van-field__word-limit {
  font-size: 28px;
}
/deep/.van-image-preview__index {
  font-size: 28px !important;
}
/deep/.van-uploader__upload {
  width: 160px;
  height: 160px;
}
/deep/.van-uploader__preview-image {
  width: 160px;
  height: 160px;
}
/deep/.van-uploader__upload-icon {
  font-size: 48px;
}
/deep/.van-uploader__upload-text {
  font-size: 24px;
}
/deep/.van-uploader__preview-delete {
  width: 22px;
  height: 22px;
}
/deep/.van-uploader__preview-delete-icon {
  font-size: 24px;
}
.experience {
  .uploader_img {
    display: flex;
    padding: 32px 20px;
    background: #ffffff;
    margin-bottom: 50px;
    >img {
      width: 160px;
      height: 160px;
    }
  }
  .van-button--round {
    width: 90%;
    height: 82px;
    font-size: 28px;
    margin: 0 auto;
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  img {
    width: 350px;
    height: 350px;
  }
}
</style>
