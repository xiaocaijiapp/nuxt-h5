<template>
  <div>
    <van-nav-bar
      :title="$t('newRefund.refundApply')"
      placeholder
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" color="#666666" />
      </template>
    </van-nav-bar>

    <van-cell-group class="cell_group">
      <van-cell
        center
        :title="$t('newRefund.refundType')"
        is-link
        value-class="rightMessage"
        :value="typecom"
        @click="showType = true"
      />
      <van-cell
        v-if="refundOrderType == 1"
        center
        :title="$t('newRefund.refundSecelt')"
        is-link
        value-class="rightMessage"
        :value="modecom"
        @click="showMode = true"
      />
      <van-cell
        center
        :title="$t('newRefund.refund_reson')"
        is-link
        value-class="rightMessage"
        :value="reasoncom"
        @click="showReason = true"
      />
      <van-cell center>
        <template #default>
          <span>{{$t('returnList.returnPice')}}</span>
          <span class="price">{{refundMount}}円</span>
        </template>
      </van-cell>

      <van-field
        v-model="explain"
        center
        :label="$t('returnGoods.returnInfo')"
        maxlength="50"
        :placeholder="$t('newEmpty.optional')"
        :arrow-direction="$t('newRefund.content')"
      />
    </van-cell-group>

    <div class="upload">
      <div>{{$t('returnGoods.upinfo')}}</div>
      <div class="upload_img">
        <van-uploader
          v-model="fileList"
          multiple
          :max-count="3"
          class="upimg"
          :after-read="afterRead"
        />
      </div>
      <div>{{$t('newRefund.upImg')}}</div>
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
    <van-action-sheet
      v-model="showType"
      :cancel-text="$t('returnGoods.cancel')"
      close-on-click-action
      :actions="Typeactions"
      @select="onSelectType"
    />
    <van-action-sheet
      v-model="showMode"
      :cancel-text="$t('returnGoods.cancel')"
      close-on-click-action
      :actions="modeaction"
      @select="onSelectMode"
    />
    <van-action-sheet
      v-model="showReason"
      :cancel-text="$t('returnGoods.cancel')"
      close-on-click-action
      :actions="reasonaction"
      @select="onSelectReason"
    />
  </div>
</template>

<script>
import api from 'static/api'
import { GetQueryString } from '@/util/tools'
export default {
  layout: 'content',
  components: {},
  data () {
    return {
      explain: '',
      disabled: false,
      fileList: [],
      type: '返金タイプを選択してください',
      reason: '返品理由を選択してください',
      showType: false,
      showReason: false,
      showMode: false,
      Typeactions: [
        { name: '返金', key: 1 },
        { name: '返品返金', key: 2 }
      ],
      Reasonactions: [
        { name: '実物は説明と一致しません', key: 0 },
        { name: '商品不良', key: 1 },
        { name: '数量不足', key: 2 },
        { name: '破損/汚損', key: 3 },
        { name: '偽造ブランド', key: 4 },
        { name: '時間通りに発送されませんでした', key: 5 },
        { name: 'ショップの原因', key: 6 }
      ],
      Modeactions: [
        { name: '残高', key: 1 },
        { name: 'ポイントゲット', key: 2 },
        { name: '再発送', key: 3 },
        { name: '返金銀行カード', subname: '', key: 4 }
      ],
      mode: '返金方法を選択してください',
      modetype: 0,
      refundType: 0,
      returnReason: -1,
      refundInfo: {},
      imgList: [],
      refundMount: 0,
      refundOrderType: 0,
      haveCard: false,
      reasonaction: [],
      typecom: '',
      reasoncom: '',
      modecom: '',
      modeaction: [],
      typeaction: []
    }
  },

  watch: {},
  beforeMount () {
    const that = this
    const lang = this.$i18n.locale
    if (lang === 'ja-JP') {
      that.reasonaction = [
        { name: '実物は説明と一致しません', key: 0 },
        { name: '商品不良', key: 1 },
        { name: '数量不足', key: 2 },
        { name: '破損/汚損', key: 3 },
        { name: '偽造ブランド', key: 4 },
        { name: '時間通りに発送されませんでした', key: 5 },
        { name: 'ショップの原因', key: 6 }
      ]

      that.typecom = '返金タイプを選択してください'
      that.reasoncom = '返品理由を選択してください'
      that.modecom = '返金方法を選択してください'
      that.modeaction = [
        { name: '残高', key: 1 },
        { name: 'ポイントゲット', key: 2 },
        { name: '再発送', key: 3 },
        { name: '返金銀行カード', subname: '', key: 4 }
      ]
      that.typeaction = [
        { name: '返金', key: 1 },
        { name: '返品返金', key: 2 }
      ]
    } else {
      that.reasonaction = [
        { name: '实物与描述不符', key: 0 },
        { name: '质量问题', key: 1 },
        { name: '少发漏件', key: 2 },
        { name: '物品破损/污渍', key: 3 },
        { name: '假冒品牌', key: 4 },
        { name: '未按约定时间发货', key: 5 },
        { name: '商家原因', key: 6 }
      ]
      that.typecom = '请选择退款类型'
      that.reasoncom = '请选择退款理由'
      that.modecom = '请选择退款方式'
      that.modeaction = [
        { name: '个人余额', key: 1 },
        { name: '积分', key: 2 },
        { name: '补发货', key: 3 },
        { name: '退款银行卡', subname: '', key: 4 }
      ]
      that.typeaction = [
        { name: '退款', key: 1 },
        { name: '退货退款', key: 2 }
      ]
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal')
      // window.location.href = '/personal'
    },
    onSelectType (item, index) {
      const _this = this
      _this.showType = false
      _this.typecom = item.name
      _this.refundType = item.key
    },
    onSelectReason (item, index) {
      const _this = this
      _this.showReason = false
      _this.reasoncom = item.name
      _this.returnReason = item.key
    },
    onSelectMode (item, index) {
      const _this = this
      if (item.key === 4 && !_this.haveCard) {
        _this.$dialog
          .confirm({
            message: '銀行カード返金にはカード紐付けが必要となります',
            confirmButtonText: 'カード紐付けに行く',
            cancelButtonText: 'キャンセル'
          })
          .then(() => {
            _this.$router.push('/user/refundcard')
            // window.location.href = '/user/refundcard'
          })
          .catch(() => {
            // on cancel
          })
      } else {
        _this.showMode = false
        _this.modecom = item.name
        _this.modetype = item.key
      }
    },
    async afterRead (imgfile) {
      const _this = this
      const formData = new FormData()
      imgfile.status = 'uploading'
      imgfile.message = '上传中...'
      console.log(imgfile)
      formData.append('file', imgfile.file)
      try {
        const res = await this.$axios.post(api.upload.refundOrderImg, formData, {
          isFromData: true
        })
        console.log(res)
        if (res.code === 200) {
          _this.imgList.push(res.data)
          imgfile.status = 'done'
          imgfile.message = '上传成功'
        } else {
          imgfile.status = 'failed '
          imgfile.message = '上传失败'
        }
      } catch (error) {
        imgfile.status = 'failed '
        imgfile.message = '上传失败'
      }
    },
    // 计算退款金额
    async calculateRefundAmount () {
      const _this = this
      const res = await _this.$axios.post(api.order.calculateRefundAmount, {
        orderNumber: _this.refundInfo.orderNumber
      })
      if (res.code === 200) {
        console.log(res)
        _this.refundMount = res.data
      } else {
        _this.$toast('遇到点小问题，请刷新当前页面')
      }
    },
    submit () {
      const _this = this
      const data = {
        imgUrl: _this.imgList,
        orderNumber: _this.refundInfo.orderNumber,
        refundAmount: _this.refundMount,
        refundMethod: _this.refundOrderType === 1 ? _this.modetype : '',
        refundType: _this.refundType,
        returnReason: _this.returnReason,
        returnRemark: _this.explain,
        storeId: _this.refundInfo.storeId,
        storeName: _this.refundInfo.storeName
      }
      if (data.refundType === 0) {
        this.$toast(this.$t('newApplyRefund.type'))
      } else if (data.refundMethod === 0 && _this.refundOrderType === 1) {
        this.$toast(this.$t('newApplyRefund.mode'))
      } else if (data.returnReason === -1) {
        this.$toast(this.$t('newApplyRefund.reson'))
      } else {
        console.log(data)
        // 申请退款
        _this.$axios.put(api.order.applyRefund, data).then((res) => {
          if (res.code === 200) {
            _this.$toast.success(this.$t('newRefund.submit'))
            _this.$router.push('/refund/refundList')
            // window.location.href = 'refund/refundList'
          } else {
            _this.$toast('遇到点小问题，请刷新当前页面')
          }
        })
      }
    },
    async getCardList () {
      const _this = this
      const res = await _this.$axios.get(api.Card.list)
      console.log(res)
      if (res.code === 200 && res.data.length > 0) {
        _this.haveCard = true
      } else {
        _this.haveCard = false
      }
    },
    init () {
      const _this = this
      _this.refundInfo = JSON.parse(sessionStorage.getItem('refundInfo'))
      _this.refundOrderType = GetQueryString('type')
      if (_this.refundInfo.orderState <= 3) {
        _this.Typeactions =
          _this.$i18n.locale === 'ja-JP'
            ? [{ name: '返金のみ', key: 1 }]
            : [{ name: '仅退款', key: 1 }]
        _this.Modeactions =
          _this.$i18n.locale === 'ja-JP'
            ? [
              { name: '残高', key: 1 },
              { name: 'ポイントゲット', key: 2 },
              { name: '返金銀行カード', subname: '', key: 4 }
            ]
            : [
              { name: '个人余额', key: 1 },
              { name: '积分', key: 2 },
              { name: '退款银行卡', subname: '', key: 4 }
            ]
        if (_this.refundInfo.bigOrderFlag === 0) {
          _this.refundMount = _this.refundInfo.payAmount
        } else {
          _this.refundMount = _this.refundInfo.payAmount - _this.refundInfo.freight
        }
      } else {
        _this.refundMount = _this.refundInfo.payAmount - _this.refundInfo.freight
      }
      _this.getCardList()
    }
  }
}
</script>

<style lang='less' scoped>
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
body {
  position: relative;
}
.van-popup--bottom.van-popup--round {
  border-radius: 0;
}
/deep/.cell_group {
  margin-top: 40px;
}
/deep/.van-cell {
  line-height: 60px;
}
/deep/.van-cell__title {
  font-size: 28px;
}
/deep/.van-cell__value {
  font-size: 28px;
}
/deep/.van-uploader__upload {
  width: 150px;
  height: 150px;
}
/deep/.van-uploader__preview-image {
  width: 150px;
  height: 150px;
}
/deep/.van-uploader__preview-delete {
  width: 23px;
  height: 23px;
  i {
    font-size: 26px;
  }
}
/deep/.van-uploader__upload-icon {
  font-size: 40px;
}
/deep/.van-cell__right-icon {
  font-size: 28px;
}
/deep/.van-action-sheet__item, .van-action-sheet__cancel {
  line-height: 60px;
}
/deep/.van-action-sheet__name, .van-action-sheet__cancel {
  font-size: 28px;
}
.van-button--round {
  height: 82px;
  font-size: 28px;
}
.price {
  font-size: 28px;
  font-weight: 400;
  text-align: left;
  color: #ff5d19;
  line-height: 40px;
}
.upload {
  width: 100%;
  height: 342px;
  background: #ffffff;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 30px;
}
.upload div:first-child {
  font-size: 28px;
  font-weight: 400;
  text-align: left;
  color: #333333;
  line-height: 40px;
}
.upload div:last-child {
  height: 30px;
  font-size: 22px;
  font-weight: 400;
  text-align: left;
  color: #999999;
  line-height: 30px;
}
.upload_img {
  margin-top: 20px;
  height: 200px;
}
.button_box {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 30px;
  position: absolute;
  bottom: 0;
}
.rightMessage {
  min-width: 400px;
}
</style>
