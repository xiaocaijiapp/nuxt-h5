<template>
    <div>
        <van-nav-bar :title="$t('supply.p25')" placeholder  @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" color="#666666" />
            </template>
        </van-nav-bar>
        <div v-if="lang" class="ingetal_box">
            <div class="container">
                <div class="title">获取渠道</div>
                <div class="text">
                    <div>1.新用户注册即可获得基础的积分</div>
                    <div>2.通过消费可获取积分</div>
                    <div>3.商城的一些活动会赠送积分</div>
                </div>
                <div class="title">积分时效</div>
                <div class="text">
                    <div>1.普通积分没有时效限制，永久有效。</div>
                    <div>2.部分活动积分会有时效限制，超过期限就不能再使用了</div>
                </div>
                <div class="title">积分的用途</div>
                <div class="text">
                    <div>1.积分的主要用处是抵扣现金，1积分可抵扣1日元，最高可抵扣订单金额的70%。</div>
                    <div>2.部分时候（如商城活动）可以用来兑换优惠券或者参与抽奖</div>
                </div>
            </div>
        </div>
        <div v-else class="ingetal_box">
            <div class="container">
                <div class="title">獲得方法</div>
                <div class="text">
                    <div>1.新規登録でポイントを獲得できます。</div>
                    <div>2.支払いでポイントを獲得できます。</div>
                    <div>3.モールのあるキャンペーンを参加するとポイントを獲得できます</div>
                </div>
                <div class="title">ポイントの有効期限</div>
                <div class="text">
                    <div>1.通常ポイントには時間制限がなく、永久不滅ポイントなら、有効期限は無期限です</div>
                    <div>2.一部のキャンペーンポイントには時間制限があり、期限後には使用できません</div>
                </div>
                <div class="title">ポイントの使用方法</div>
                <div class="text">
                    <div>1.ポイントの主な使用方法は現金を差し引くことで、1ポイントで1円、注文金額の70％まで差し引くことができます。</div>
                    <div>2.あるとき（モールのキャンペーンなど）は、クーポンの引き換えや抽選に参加するために使用できます。</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  layout: 'content',
  computed: {
    lang () {
      const status = this.$i18n.locale === 'zh-CN' ? 1 : 0
      return status
    }
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
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
  .ingetal_box{
    padding: 0 40px;
    background: #fff;
  }
  .container{
    .title{
      font-size: 48px;
      font-weight: 600;
      text-align: left;
      color: #333333;
      line-height: 90px;
    }
    .text{
      font-size: 32px;
      font-weight: 400;
      text-align: left;
      color: #666666;
      line-height: 60px;
    }
  }
</style>
