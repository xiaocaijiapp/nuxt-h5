<template>
  <div class="experience">
    <van-sticky>
      <van-nav-bar
        :title="$t('newThreeClass.shareGoods')"
        placeholder
        @click-left="onClickLeft"
      >
        <template #left>
          <van-icon name="arrow-left" color="#666666" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <div class="content">
      <div class="tipbox">
        {{$t('newThreeClass.gainIntegral').replace('N', integral)}}
      </div>
      <div class="editbox">
        <van-field
          v-model="descText"
          autosize
          type="textarea"
          placeholder=""
          show-word-limit
        />
<!--        <div class="editbtn">编辑文案</div>-->
      </div>
      <div class="uploader_img">
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
      <div class="share_button">
        <van-button
          v-clipboard:copy="copyURL"
          v-clipboard:success="onCopy"
          block
          round
          @click="onlyCopyLink"
        >{{$t('newThreeClass.copyLink')}}</van-button>
        <van-button
          v-clipboard:copy="copyShareURL"
          v-clipboard:success="onCopy"
          color="linear-gradient(to right, #FFA24C, #FF5E1A)"
          block
          round
          :disabled="isCanShare"
          @click="shareCopyLink"
        >{{$t('newThreeClass.shareCopyLink')}}</van-button>
      </div>
    </div>
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
      integral: 0,
      copyURL: '',
      copyShareURL: ''
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
    this.integral = this.$route.query.integral || 0
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
          this.imageList = res.data.imageList || []
          _this.shareId = res.data.id || ''
          this.imageList.forEach((item) => {
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
      imgfile.status = 'uploading'
      imgfile.message = that.$t('newCommonts.uping')
      if (imgfile.length) {
        imgfile.forEach((item) => {
          formData.append('files', item.file)
        })
      } else {
        formData.append('files', imgfile.file)
      }
      const res = await this.$axios.post(api.upload.uploadGoodsImgs, formData, { isFromData: true })
      if (res.code === 200) {
        that.imageList = [...that.imageList, ...res.data]
        // res.data.forEach((item) => {
        //   that.imageList.push(item)
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
    async onlyCopyLink () {
      const _this = this
      const params = {
        id: _this.shareId,
        fromFlag: _this.fromFlag,
        goodsId: _this.goodsId
      }
      await _this.$axios.post('starday-goods/user/share/add', params).then((res) => {
        if (res.code === 200) {
          _this.shareId = res.data
          // _this.copyURL = location.origin + '/openapp?productid=' + this.goodsId + '&shareIntegralId=' + this.shareId
          _this.copyURL = location.origin + '/product/' + this.goodsId + '?shareIntegralId=' + this.shareId
          _this.$copyText(_this.copyURL).then(function (e) {
            _this.$toast.success(_this.$t('home.copysuccess'))
          }, function (e) {
            _this.$toast.warning(_this.$t('home.copyerror'))
          })
        }
      })
    },
    async shareCopyLink () {
      const _this = this
      const params = {
        id: _this.shareId,
        goodsId: _this.goodsId,
        fromFlag: _this.fromFlag,
        descText: _this.descText,
        imageList: _this.imageList
      }
      await _this.$axios.post('starday-goods/user/share/add', params).then((res) => {
        if (res.code === 200) {
          _this.shareId = res.data
          // _this.copyShareURL = location.origin + '/product/' + this.goodsId + '?shareIntegralId=' + this.shareId + '&headImage=' + _this.userInfo.headImage
          // _this.copyShareURL = location.origin + '/openapp?productid=' + this.goodsId + '&shareIntegralId=' + this.shareId
          _this.copyShareURL = location.origin + '/product/' + this.goodsId + '?shareIntegralId=' + this.shareId
          this.$copyText(_this.copyShareURL).then(function (e) {
            _this.$toast.success(_this.$t('home.copysuccess'))
          }, function (e) {
            _this.$toast.warning(_this.$t('home.copyerror'))
          })
        }
      })
    },
    onCopy () {
      this.$toast.success(this.$t('home.copysuccess'))
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
    height: 250px;
    padding: 32px 20px;
  }
  /deep/.van-field__control {
    font-size: 28px;
    line-height: 36px;
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
    text-align: center;
    padding: 0 5px;
  }
  /deep/.van-uploader__preview-delete {
    width: 24px;
    height: 24px;
  }
  /deep/.van-uploader__preview-delete-icon {
    font-size: 24px;
  }
  /deep/.van-uploader__file {
    /*width: 24px;*/
    /*height: 24px;*/
  }
  .experience {
    .content {
      padding: 20px 25px;
    }
    .tipbox {
      width: 100%;
      height: 90px;
      color: #fff;
      font-size: 28px;
      line-height: 90px;
      padding-left: 20px;
      background: url("../../../assets/images/user/tipbg.png") no-repeat;
      background-size: 100% 100%;
    }
    .editbox {
      position: relative;
      margin-top: 20px;
      .editbtn {
        font-size: 28px;
        color: #FF5D19;
        position: absolute;
        right: 20px;
        bottom: 20px;
      }
    }
    .uploader_img {
      padding: 32px 20px;
      background: #ffffff;
      margin-bottom: 50px;
      margin-top: 5px;
    }
    .share_button {
      display: flex;
      justify-content: space-between;
      .van-button--round {
        width: 46%;
        height: 82px;
        font-size: 28px;
        margin: 0 auto;
      }
    }
  }
</style>
