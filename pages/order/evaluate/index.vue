<template>
  <div>
    <van-nav-bar
      :title="$t('supply.send')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>
    <div class="goods_rate">
      <div>
        <img v-lazy="baseImageUrl + imgsrc" alt="" style="width: 4rem;height: 4rem">
      </div>
      <div>
        <div class="rate_one">
          {{$t('commentlist.rate')}}
          <van-rate v-model="value" color="#FF5D19" @change="changeRate" />
        </div>

        <div class="rate_text">{{rate_text}}</div>
      </div>
    </div>
    <div>
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        :placeholder="$t('newCommonts.placehodler')"
        show-word-limit
      />
    </div>
    <div class="uploader_img">
      <van-uploader
        v-model="fileList"
        multiple
        :max-count="3"
        upload-text="写真追加"
        class="upimg"
        :after-read="afterRead"
      />
    </div>
    <div class="anonymous">
      <van-checkbox
        v-model="checked"
        checked-color="#FF5D19"
      >{{$t('commont.noname')}}</van-checkbox>
    </div>

    <div class="Serviceevaluation">
      <div class="top">{{$t('newCommonts.service')}}</div>
      <div class="Service_rate midlle">
        {{$t('newCommonts.express')}}
        <van-rate v-model="value1" color="#FF5D19" />
      </div>
      <div class="Service_rate bottom">
        {{$t('newCommonts.service')}}
        <van-rate v-model="value2" color="#FF5D19" />
      </div>
    </div>
    <div class="button_box">
      <van-button
        round
        type="primary"
        color="linear-gradient(to right, #FFA14B, #FF5D19)"
        block
        :disabled="disabled"
        @click="submit"
      >{{$t('returnGoods.submit')}}</van-button>
    </div>
  </div>
</template>

<script>
import api from 'static/api'
import { mapGetters } from 'vuex'
export default {
  layout: 'content',
  components: {},
  data () {
    return {
      value: 0,
      value1: 0,
      value2: 0,
      fileList: [],
      imgList: [],
      message: '',
      checked: false,
      disabled: true,
      rate_text: '',
      imgsrc: ''
    }
  },
  computed: {
    rate () {
      const { value, value1, value2 } = this
      return { value, value1, value2 }
    },
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    })
  },
  watch: {
    rate (val) {
      for (const key in val) {
        if (val[key] !== 0) {
          this.disabled = false
        } else {
          this.disabled = true
        }
      }
    }
  },
  mounted () {
    const that = this
    that.imgsrc = this.$route.query.img
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    changeRate (val) {
      const _this = this
      switch (val) {
        case 1:
          _this.rate_text = _this.$t('newCommonts.level_one')
          break
        case 2:
          _this.rate_text = _this.$t('newCommonts.level_two')
          break
        case 3:
          _this.rate_text = _this.$t('newCommonts.level_three')
          break
        case 4:
          _this.rate_text = _this.$t('newCommonts.level_four')
          break
        case 5:
          _this.rate_text = _this.$t('newCommonts.level_five')
          break
        default:
          break
      }
    },
    async afterRead (imgfile) {
      const formData = new FormData()
      const that = this
      imgfile.status = 'uploading'
      imgfile.message = that.$t('newCommonts.uping')
      formData.append('file', imgfile.file)
      const res = await this.$axios.post(api.upload.img, formData, { isFromData: true })
      if (res.code === 200) {
        that.imgList.push(res.data)
        imgfile.status = 'done'
        imgfile.message = that.$t('newCommonts.up_success')
      }
    },
    async submit () {
      const that = this
      const data = {
        anonymousFlag: that.checked ? 1 : 0,
        commentContent: that.message ? that.message : that.$t('newCommonts.no'),
        imgUrl: that.imgList,
        expressSore: that.value1,
        goodsSore: that.value,
        orderNo: this.$route.query.orderNo,
        skuId: this.$route.query.skuid,
        spuId: this.$route.query.spuid,
        storeSore: that.value2
      }
      const res = await that.$axios.put(api.order.comment, data)
      if (res.code === 200) {
        this.$toast.success(that.$t('commont.success'))
        window.history.go(-1)
      } else {
        this.$toast(that.$t('commont.failed'))
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
  /deep/.van-rate__icon {
    font-size: 32px;
  }
  /deep/.van-field__control {
    font-size: 28px;
    line-height: 40px;
    padding: 0 20px;
  }
  /deep/.van-field__word-limit {
    font-size: 24px;
    padding: 0 20px;
  }
  /deep/.van-uploader__upload {
    width: 150px;
    height: 150px;
  }
  /deep/.van-uploader__preview-image {
    width: 150px;
    height: 150px;
  }
  /deep/.van-uploader__upload-icon {
    font-size: 42px;
  }
  /deep/.van-uploader__upload-text {
    font-size: 22px;
    line-height: 22px;
  }
  /deep/.van-checkbox__label {
    line-height: 40px;
  }
  /deep/.van-checkbox__icon--round {
    font-size: 24px;
  }
  /deep/.van-uploader__preview-delete {
    width: 22px;
    height: 22px;
  }
  /deep/.van-uploader__preview-delete-icon {
    font-size: 24px;
  }
  .van-button--round {
    height: 82px;
    font-size: 28px;
  }
  .setup_main {
    margin-top: 30px;
  }
  .loginout {
    margin-top: 20px;
  }
  .goods_rate {
    background: #fff;
    width: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    border-bottom: 1px solid #e5e5e5;
  }
  .rate_one {
    margin-left: 40px;
    font-size: 28px;
    font-weight: 400;
    color: #333333;
    line-height: 40px;
    display: flex;
    align-items: center;
  }
  .van-rate {
    margin-left: 20px;
  }
  .uploader_img {
    background: #fff;
    width: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
  }
  .anonymous {
    background: #fff;
    width: 100%;
    padding: 20px 30px;
    box-sizing: border-box;
    border-bottom: 1px solid #e5e5e5;
    font-size: 28px;
    font-weight: 400;
    color: #999999;
    line-height: 40px;
  }
  .Serviceevaluation {
    background: #fff;
    width: 100%;
    padding: 30px;
    box-sizing: border-box;
    margin-top: 30px;
    height: 304px;
  }
  .top {
    font-size: 32px;
    font-weight: 600;
    text-align: left;
    color: #333333;
    line-height: 80px;
    border-bottom: 1px solid #e5e5e5;
  }
  .Service_rate {
    margin-top: 20px;
    font-size: 28px;
    display: flex;
    align-items: center;
    font-weight: 400;
    text-align : left;
    color: #333333;
    line-height: 40px;
    height: 60px;
  }
  .button_box {
    position: fixed;
    width: 100%;
    bottom: 30px;
    padding: 0 30px;
    margin: 0 auto;
  }
  .rate_text {
    padding-top: 20px;
    font-size: 28px;
    padding-left: 40px;
    font-weight: 400;
    text-align: left;
    color: #ff5d19;
    line-height: 40px;
  }
</style>
