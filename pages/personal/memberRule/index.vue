<template>
  <div class="memberRule">
    <van-nav-bar
      title="规则说明"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="bodybox" v-if="locale==='zh-CN'">
      <p class="title">
        分享规则说明
      </p>
      <div class="content">
        <p class="indent">
          注册为starday会员，即可使用starday商品库，通过自己分享出去的商品链接所产生
          的销售，分享者即可从中获取销售金额一定比例的积分返还，积分可与现金1:1提现到个人
          银行账户。在分享体系中，会员有三个级别：普通会员（以下简称会员）、团员、团长。
        </p>
      </div>

      <p class="title">
        一、分享收益
      </p>
      <div class="content">
        <p>
          1、会员分享商品链接，可享受交易金额10%的积分返还。如果自己购买可以享受交易金额5%的积分返还。
        </p>
        <p>
          2、团员分享商品链接，可享受交易金额15%的积分返还。如果自己购买可以享受交易金额5%的积分返还。
        </p>
        <p>
          3、团长的收益分为两部分：
        </p>
        <p class="indent">
          ①团长可发展自己的团员，按照下属所有团员的订单量，每笔交易可获得30积分。
        </p>
        <p class="indent">
          ②团长也可以正常分享商品，分享和自己购买的返还比例与团员一致。
        </p>
        <p>
          4、可从平台推荐商品中直接分享单个产品，也可以建立自己的商品库从而把个人商品库分享出去。
        </p>
        <p>
          5、以上返还的积分，在交易完成7天后即可使用。积分累计10000即可提现到个人银行账户。
        </p>
      </div>

      <p class="title">
        二、如何成为团员、团长
      </p>
      <div class="content">
        <p>
          1、团长可以发展和管理团员。会员和团员都可以通过个人后台向starday平台申请成为团长，starday审核通过，即可拥有团长权限，团长可发展多个团员。
        </p>
        <p>
          2、团员与团长绑定。团长可以向会员发送邀请码，会员在后台输入邀请码即可成为该团长的团员。团员不可更换团长。如果团员申请成为了团长，会自动解除与原团长的绑定关系。
        </p>
        <p>
          3、普通会员不与团员或团长存在绑定关系。
        </p>
        <p>
          最终解释权归starday平台所属，请遵循平台规则。
        </p>
      </div>
    </div>
    <div class="bodybox" v-else>
      <p class="title">
        シェア買い規則の説明
      </p>
      <div class="content">
        <p class="indent">
          新規登録でstardayの会員になると、サイトを利用することができます。お客様のシェア
          によって利益を生じた場合、ポイントが獲得できます。1ポイントは1円として銀行の
          個人口座に換金することができます。
          シェア買いには会員、スタメン、キャプテン3つのレベルがありま
        </p>
      </div>

      <p class="title">
        一、収益
      </p>
      <div class="content">
        <p>
          1、会員のシェアにより、売り上げが発生した場合、売上の10％をポイントでお客様に還元いたします。お客様が自分で購入した場合、5％のポイントを還元いたします。
        </p>
        <p>
          2、スタメンのシェアにより、売り上げが発生した場合、売上の15％をポイントでお客様に還元いたします。お客様が自分で購入した場合、5％のポイントを還元いたします。
        </p>
        <p>
          3、キャプテンの収益は二つの部分に分けられます。
        </p>
        <p class="indent">
          ①代理人を募集してチーム規模を拡大、全員の注文数によって、取引ごとに30ポイントを獲得することができます。
        </p>
        <p class="indent">
          ②キャプテンも商品をシェアすることができます。還元ポイントはスタメンと同じです。
        </p>
        <p>
          4、お客様はおすすめ商品または自分がお気に入り商品をシェアすることができます。
        </p>
        <p>
          5、上記の還元ポイントは、取引完了後7日でご利用いただけます。10000ポイントを貯
          めたら、1ポイントは１円として銀行の個人口座に換金することができます。
        </p>
      </div>

      <p class="title">
        二、スタメン、キャプテンになる方法
      </p>
      <div class="content">
        <p>
          1、キャプテンはスタメンを募集することができます。それに、会員とスタメンもstardayプラットフォームにキャプテンになることを申請でき、審査に合格すればキャプテンの権限を取られます。
        </p>
        <p>
          2、スタメンはキャプテンより管理されます。キャプテンは会員に招待コードを送信でき、会員はその招待コードを入力するとそのチームのメンバーになります。他のチームに変更できません。キャプテンになったら、自動に元のチームと関係を解約いたします。
        </p>
        <p>
          3、会員はキャプテンとスタメンのチームに属していません。
        </p>
        <p>
          最終解釈権はStardayに属します。利用規約を守ってください。
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'memberRule',
  layout: 'content',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters(['locale'])
  },
  mounted () {

  },
  methods: {
    onClickLeft () {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
  .memberRule{
    .van-nav-bar{
      height:88px;
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
    .bodybox{
      width: 100%;
      margin-top: 20px;
      padding: 30px 24px;
      background-color: #fff;
      .title{
        margin-top: 20px;
        font-size: 30px;
        font-weight: 600;
        color: #333;
      }
      .content{
        margin-top: 18px;
        p{
          font-size: 28px;
          color: #666666;
          line-height: 44px;
        }
        .indent {
          text-indent: 50px;
        }
      }
    }
  }
</style>
