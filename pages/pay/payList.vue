<template>
<div class="pay-list-container">
  <van-sticky>
    <van-nav-bar :title="$t('order.selpaytype')" placeholder @click-left="onClickLeft">
      <template #left>
        <van-icon size="22px" name="arrow-left" color="#999999"/>
      </template>
    </van-nav-bar>
  </van-sticky>
  <div class="content">
    <van-radio-group v-model="radio" @change="payChange">
      <van-cell-group>
        <van-cell v-for="item in payMethods" :key="item.id">
          <template #icon>
            <img v-if="item.paytypeCode === '03'" class="pay-list-icon" :src="require('assets/images/icon/gmo.png')" />
            <img v-else-if="item.paytypeCode === '04'" class="pay-list-icon" :src="require('assets/images/icon/paypal.png')" />
            <img v-else-if="item.paytypeCode === '01'" class="pay-list-icon" :src="require('assets/images/icon/yue.png')" />
            <img v-else-if="item.paytypeCode === '07'" class="pay-list-icon" :src="require('assets/images/icon/bld.png')" />
          </template>
          <template #right-icon>
            <van-radio icon-size="5.333333vw" checked-color="#FF5D19" :name="item.paytypeCode" />
          </template>
          <template #label>
            <span v-if="item.paytypeCode == '03'" class="ingle">{{$t('order.p5')}}</span>
            <div v-if="item.paytypeCode == '01'" class="ingle">
              <span class="custom-title">{{$t('newPay.blance')}}</span>
              <span class="balance">{{item.remark}}</span>
              <span>{{$t('supply.p13')}}</span>
            </div>
            <div v-if="(item.paytypeCode == '02' || item.paytypeCode == '06') && item.imgUrlList.length" class="imgs">
              <img v-for="(img, index) in item.imgUrlList" :key="index" v-lazy="baseImageUrl + img" />
            </div>
            <div v-if="item.paytypeCode == '07' && nextPayState" class="nextPayAddressUpdate">
              <div class="text">{{nextPayInfo.address + nextPayInfo.deliveryAddress}}</div>
              <span class="updateBtn" @click.stop="updatePayInfo">{{$t('nextPay.update')}}</span>
            </div>
          </template>
          <template #title>
            <div class="title">
              <div class="title-name">{{$i18n.locale == 'zh-CN' ? item.paytypeName.split('|')[0] : item.paytypeName.split('|')[1]}}</div>
              <span v-if="item.paytypeCode == '01' && isCompose" class="zuhezhifu">{{$t('newPay.compose')}}</span>
              <span v-if="item.paytypeCode == '07'" class="nextPayAgreement" @click.stop="nextPayAgreementOverlay = true">《{{$t('nextPay.agreement')}}》</span>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </div>
  <div class="button_box">
    <van-button
      round
      type="primary"
      color="linear-gradient(to right, #FFA14B, #FF5D19)"
      block
      :disabled="disabled"
      @click="pay"
    >{{$t('supply.surePay')}}</van-button>
  </div>
  <van-dialog
    v-model="showModel"
    :title="$t('offlinepay.ConvenienceStore')"
    :before-close="modelBeforeClose"
    show-cancel-button
    @confirm="confirmConvenienceStore"
    @cancel="canaelConvenienceStore"
  >
    <van-cell-group>
      <div class="ConvenienceStore">
        <div class="select-box">
          <select v-model="ConvenienceStore.type" class="select">
            <option
              value
              disabled
              selected
              style="display:none;"
            >{{$t('offlinepay.codenone')}}</option>
            <option
              v-for="item in option1"
              :key="item.value"
              :value="item.value"
            >{{item.text}}</option>
          </select>
        </div>

        <van-field
          v-model="ConvenienceStore.userName"
          required
          class="filed"
          border
          maxlength="12"
          :placeholder="$t('offlinepay.writname')"
        />
        <van-field
          v-model="ConvenienceStore.userFalName"
          required
          class="filed"
          border
          maxlength="12"
          :placeholder="$t('offlinepay.writcuscaname')"
        />
        <van-field
          v-model="ConvenienceStore.phone"
          required
          class="filed"
          border
          type="digit"
          maxlength="13"
          :placeholder="$t('offlinepay.writphon')"
        />
        <van-field
          v-model="ConvenienceStore.email"
          required
          class="filed"
          border
          :placeholder="$t('offlinepay.writcusemail')"
        />
      </div>
    </van-cell-group>
  </van-dialog>
    <div v-if="nextPayAgreementOverlay" class="nextPayContent">
      <div class="PayBlock">
        <div class="title">
          <div class="agree-t">{{$t('nextPay.agreement')}}</div>
          <img class="close-icon" :src="require('assets/images/icon/ic_no.png')" @click="nextPayAgreementOverlay = false" />
        </div>
        <div class="center">
           <div class="text">
             <h2>内容確認のお願い</h2>
             <p>お申し込み時にご入力頂いた内容に関して、各々の入力画面にてお取引の内容をよくご確認の上、ご契約下さいますようお願い致します。</p>
             <h2>個人情報の取り扱い</h2>
             <p>株式会社翌月支払い（以下「当社」といいます。）は、第1条に定める本サービスの提供に必要な限度で、お客様が発注にあたり販売店に登録された個人情報（氏名·住所·電話番号·電子メールアドレス等）及び当該お取引情報を当該販売店から提供を受け、あるいは、当社に上記の個人情報の一部または全部を登録いただき、「個人情報保護に関する基本方針（プライバシーポリシー）」及び末尾の「個人情報の取扱い関する同意条項（債権譲渡方式による一括払い）」に従った利用を行い、当社の委託先又はご同意頂いた提供先に提供するものとします。本サービスの利用者は、販売店に登録された上記個人情報の利用について予めご同意いただくものとします。なお、当社の「個人情報保護に関する基本方針（プライバシーポリシー）」に関しては当社ホームページに掲載しております。</p>
             <h2>電磁的交付の承諾</h2>
             <p>当社は、利用規約等を電磁的方法にて交付いたします。なお、電磁的方法にて交付する書面に関しては当社ホームページに掲載しております。利用者は必要に応じて各規約等の書面を印刷いただけます。また、印刷できない場合は当社に申出るものとします。</p>
             <h3>ご利用に際して</h3>
             <p>利用者は、当社の加盟店で商品等をご購入頂く際に請求先としてご登録いただく個人の方となります。代理人または法人名義によるお申込みはお受け出来ませんのでご了承ください。また、未成年の方は親権者の同意を取得の上お申込みください。なお、各お取引に関しては、都度の審査がございますので、あらかじめご了承ください。</p>
             <h3>第１条（本サービスの内容）</h3>
             <p>１．当社が提供するサービスは、本サービス利用者（以下「利用者」といいます。）が当社と加盟店契約を締結した販売店（以下「販売店」といいます。）との間で締結する売買契約または役務提供契約等（以下「売買契約等」といいます。）に基づき購入する商品、または提供を受ける役務等（以下、これらを総称して「商品等」といいます。）の代金債権（送料、売買契約等に基づくキャンセル料、その他費用、消費税等一切の費用を含みます。以下「代金等債権」といいます。）を当社が販売店より譲り受け、当社から利用者に対して譲り受けた債権をご請求させていただき、利用者が「クレジットカード」で当社請求額をお支払いいただく「翌月支払い（債権譲渡方式による一括払い）サービス」（以下「本サービス」といいます。）です。</p>
             <p>２．当社が利用者に対して提供する本サービスの決済方法は、ご利用の翌月に商品等の代金を一括払いでお支払い頂く方法です。本サービスをご利用頂く場合、利用者と販売店との間の商品等に係る契約成立後、販売店から当社に対して、当社所定の方法により売上データが送信された時点をもって、販売店の利用者に対する代金等債権が当社に譲渡されるものとし、利用者は、上記債権譲渡を異議なく承諾するものとします。</p>
             <p>３．当社は、他に本サービス以外の「翌月支払い」による取引がある場合には、同取引の支払いを合算して利用者に請求することとし、利用者は１か月分の翌月支払いサービスご利用分の代金等債権をまとめて当社にお支払いいただきます。</p>
             <h3>第２条（本サービスのご利用）</h3>
             <p>１．利用者は、販売店における商品等の購入に際して、当社所定の方法により、本サービスの利用を都度お申込みいただきます。ただし、当社が指定する一部の商品等については、ご利用できない場合がございます。</p>
             <p>２．売買契約等の契約日は販売店と利用者が合意した日となります。あらかじめ販売店との利用規約等をご確認ください。</p>
             <p>３．利用金額、利用履歴、その他の事情を踏まえた当社の与信審査の結果によっては、本サービスのご利用をお断りすることがございます。与信審査結果の内容については利用者に開示いたしませんので、あらかじめご了承ください。</p>
             <p>４．高額ならびに短期間に繰り返し複数の申込をされた場合等、当社の判断により、ご本人様確認のため、ご連絡させていただくことがございます。</p>
             <h3>第３条（支払方法等）</h3>
             <p>１．毎月の15日に（当該日が土·日·祝祭日、当社休業日の場合は翌営業日となる場合がございます。）ご請求をお知らせするＳＭＳメッセージ（以下「請求書」といいます。）を送信いたします。なお、残高の有無に関係なく前月末時点での利用明細をＥメールで送信する場合がございます。</p>
             <p>２．お支払いは、毎月月末日に締切り、締切日の属する月の翌月23日に支払うものとします。</p>
             <p>３．お支払いは、クレジットカードをご利用いただけます。なお、利用者があらかじめ指定する金融機関の預貯金口座から口座振替等の方法でお支払いを希望される場合は別途当社所定の申込手続きを行うものとします。</p>
             <p>４．販売店の事務処理の遅延等の事由により、販売店から当社に対して請求が翌月以降になった場合は、当社から利用者に対するご請求も、販売店から当社に対して請求があった翌月になる場合がございますので、あらかじめご了承ください。</p>
             <p>５．ご請求内容はアカウントページにてご確認いただけます。</p>
             <p>６．利用者が支払った金額が、本サービスに関する本規約及び当社とのその他の契約に基づき利用者が当社に対して負担する一切の債務を完済させるに不足するときは、利用者は、当社の利用者に対する通知なくして、当社の裁量による順序·方法によって債務に充当しても異議のないものとします。なお、当社は、充当の結果を別途当社が適当と認める方法</p>
             <h3>によって利用者に告知するものとし、利用者は適宜、充当内容の確認を行うものとします。</h3>
             <p>７．利用者は、当社が必要な範囲で請求回収業務を第三者に委託することにあらかじめ同意いただくものとします。</p>
             <h3>第4条（商品等の引渡し）</h3>
             <p>商品等は、当社が販売店に対して、販売店の利用者に対する販売承認を行った後、商品購入の申込み時または契約成立時の配送確認メール等に指定された時期に販売店から利用者に引渡し、または提供されるものとします。</p>
             <h3>第5条（費用等の負担）</h3>
             <p>利用者が負担する費用は次のとおりです。</p>
             <p>（１）利用者がお支払いを遅滞した際の回収にかかる下記費用</p>
             <p>①当社が債権の保全実行のために要した費用：実費</p>
             <p>（2）本規約に基づく費用·手数料等について公租公課が課せられる場合の当該公租公課相当額（消費税等を含みます。）、及び当該公租公課が変更される場合は、当該変更後の公租公課相当額</p>
             <h3>第6条（遅延損害金）</h3>
             <p>利用者が代金等債権のお支払いを遅滞した場合には、当社は利用者に対し、約定返済期日の翌日より支払いに至るまで、年１４．６％の割合による遅延損害金をご請求させていただきますので、あらかじめご了承ください。</p>
             <h3>第７条（禁止事項）</h3>
             <p>１．利用者はご自身または第三者を利用して、以下の(1)～(8)の行為を行ってはならないものとします。</p>
             <p style="text-indent: 2em">（１）申込みに際して虚偽の申告をする行為</p>
             <p style="text-indent: 2em">（２）意図的な未払い等の詐欺的な行為</p>
             <p style="text-indent: 2em">（３）架空もしくは虚偽の内容の取引</p>
             <p style="text-indent: 2em">（4）合理性に欠き、著しく不自然な取引</p>
             <p style="text-indent: 2em">（5）換金を目的とした商品購入等または犯罪による収益を対象とする商品購入等、本サービスの利用が不適当もしくは不審な行為</p>
             <p style="text-indent: 2em">（6）その他の違法行為や当社または販売店に対する法的な限度を超えた不当要求行為</p>
             <p style="text-indent: 2em">（7）本規約に違反する行為</p>
             <p>２．利用者が、上記の（１）～（８）の行為を行った場合、もしくは行うおそれがあると当社が判断した場合、当社は、本サービスのご利用をお断りできるものとします。この場合、利用者は、当然に期限の利益を失うとともに、当社に対する一切の未払債務を直ちに支払うものとします。</p>
             <p>３．利用者は、本サービスのご利用による債務の完済までに当該商品が犯罪による収益であると判明した場合、速やかに当社に通知するものとします。</p>
             <h3>第8条（免責）</h3>
             <p>当社は、利用者と販売店間の契約に基づく販売店の債務履行につき、一切の責任を負いません。発注いただいた商品ならびに配送及びサービスの提供等の問題についての問い合わせ·苦情等は販売店にご連絡ください。</p>
             <h3>第9条（届出事項の変更・解約等）</h3>
             <p>１．利用者が当社に届け出た氏名、住所、携帯電話番号、電子メールアドレス、その他当社所定の事項に変更が生じた場合、利用者は、遅滞なく当社所定（変更手続き）の方法により変更事項を届け出るものとします。</p>
             <p>２．前項に定める届出がないために、当社からの通知または送付書類その他の物が延着または不着となった場合には、通常到着すべきときに利用者に到着したものとみなします。</p>
             <p>３．利用者が本サービスの利用について解約を希望する場合には、当社所定の方法により届け出るものとします。</p>
             <p>４．利用者は、解約を申し出た際に未払債務（他の翌月支払いサービスのご利用分及び支払期限が到来していないものを含みます。）がある場合は、その債務を支払った後に解約するものとします。</p>
             <h3>第10条（担保差入等）</h3>
             <p>利用者は、当社が利用者に対する代金支払請求債権を第三者に担保差入、譲渡、買戻し、その他の処分をすることがあることをあらかじめ異議なく承諾するものとします。</p>
             <h3>第１1条（反社会的勢力の排除）</h3>
             <p>１．利用者は、利用者が、現在、次のいずれにも該当しないことを表明し、かつ将来にわたっても該当しないことを確約するものとします。</p>
             <p style="text-indent: 2em">（１）暴力団</p>
             <p style="text-indent: 2em">（２）暴力団員及び暴力団員でなくなったときから５年を経過しない者</p>
             <p style="text-indent: 2em">（３）暴力団準構成員</p>
             <p style="text-indent: 2em">（４）暴力団関係企業</p>
             <p style="text-indent: 2em">（５）総会屋等</p>
             <p style="text-indent: 2em">（６）社会運動等標ぼうゴロ</p>
             <p style="text-indent: 2em">（７）特殊知能暴力集団等</p>
             <p style="text-indent: 2em">（８）前各号の共生者</p>
             <p style="text-indent: 2em">（９）その他前各号に準ずる者</p>
             <p>２．利用者は、自らまたは第三者を利用して次の各号のいずれかに該当する行為を行わないことを確約いたします。</p>
             <p style="text-indent: 2em">（１）暴力的な要求行為</p>
             <p style="text-indent: 2em">（２）法的な責任を超えた不当な要求行為</p>
             <p style="text-indent: 2em">（３）取引に関して、脅迫的な言動をし、または暴力を用いる行為</p>
             <p style="text-indent: 2em">（４）風説を流布し、偽計を用いまたは威力を用いて当社の信用を毀損し、または当社の業務を妨害する行為</p>
             <p style="text-indent: 2em">（５）その他前各号に準ずる行為</p>
             <p>３．利用者が前項に定める事項に反すると具体的に疑われる場合には、当社は利用者に対し当該事項に関する調査を行い、また必要に応じて資料の提供を求めることができ、利用者はこれに応じるものとします。</p>
             <p>４．利用者が本条１項もしくは本条２項のいずれかに該当した場合、本条１項もしくは本条２項の規定に基づく確約に関して虚偽の申告をしたことが判明した場合、または前項の調査等に応じない場合や虚偽の回答をした場合のいずれかであって、契約を締結すること、または契約を継続することが不適切であると当社が認める場合には、当社は、利用者との契約の締結を拒絶し、または本契約を解除することができるものとします。本契約が解除された場合、利用者は、当社からの通知または請求により、期限の利益を失い、当社に対する一切の未払債務を直ちに支払うものとします。また、この場合、当社に生じた損害を利用者が賠償するものとします。</p>
             <p>５．前項の規定により本契約が解除された場合でも、利用者の当社に対する未払い債務があるときは、それが完済されるまでは本契約の各条項が適用されるものとします。</p>
             <h3>第１2条（合意管轄裁判所）</h3>
             <p>利用者は、本サービスについて紛争が生じた場合、訴額のいかんに拘わらず、当社の本社、各支店、営業所を管轄する簡易裁判所及び地方裁判所を第一審の専属的合意管轄裁判所とすることに同意するものとします。</p>
             <h3>第１3条（準拠法）</h3>
             <p>利用者と当社との契約に関する準拠法は、すべて日本法とします。</p>
             <p>改定：2020年4月1日</p>
             <p>【問合せ・相談窓口等】</p>
             <p>１．販売契約等（商品等）についてのお問い合わせ、ご相談は販売店にご連絡くださいください。</p>
             <p>２．お支払についてのお問い合わせ、ご相談は下記株式会社翌月支払いにご確認ください。</p>
             <p>株式会社翌月支払いお客様相談室</p>
             <p>〒3550352 埼玉県 比企郡 ときがわ町 別所147番地</p>
             <p>tel:049-381-6689</p>
             <p>【個人間インターネットショッピングサービスを利用する際の注意事項 】</p>
             <p>当社所定の個人間インターネットショッピングサービスをご利用の場合、以下の特則が適用されますので、あらかじめご同意いただくものとします。</p>
             <h2>個人情報の取り扱い</h2>
             <p>当社は、本サービスの提供に必要な限度で、個人間インターネットショッピングモールの運営会社（以下「運営会社」といいます。）から、利用者が運営会社に登録された個人情報（氏名·住所·電話番号·電子メールアドレス等）及び発注されたお取引情報の提供を受け、当社「個人情報保護に関する基本方針（プライバシーポリシー）」及び末尾の「個人情報の取扱いに関する同意条項（債権譲渡方式による一括払い）」に従って取り扱うものとします。利用者は、運営会社に登録された上記個人情報を当社が利用することを、あらかじめご同意いただくものとします。</p>
             <h2>本サービスの内容</h2>
             <p>本サービスは、運営会社が譲り受けた出品者の利用者に対する債権（送料、その他費用、消費税等の費用を含みます。）を当社が運営会社より譲り受け、当社から利用者に対して譲り受けた債権をご請求させていただき、利用者クレジットカードにより当社にお支払いいただくサービスです。当社は、利用者と出品者との間の商品等に係る契約成立後、運営会社から当社に対して売上データが送信された時点をもって、上記の債権を運営会社より譲り受けるものとし、利用者は、当社の債権譲受けについてあらかじめ異議なく承諾するものとします。</p>
             <p>支払方法は、一括払い（債権譲渡方式）のみとなりますので、あらかじめご了承ください。</p>
             <h2>免責</h2>
             <p>当社は、利用者と出品者、利用者と運営会社との間の契約に基づく債務の履行につき、一切の責任を負いません。発注いただいた商品·サービスの問題についての問い合わせ·苦情等は出品者または運営会社にご連絡下さい。</p>
           </div>
        </div>
        <div class="bottom" :style="{ 'padding-bottom': nextPayState ? '40px' : '0px'}">
          <span v-if="!nextPayState" class="btn" @click="nextPayAgreementChange">{{$t('nextPay.payBtn')}}</span>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import api from '~/static/api'
import Reg from '~/static/reg'
import { mockTransactionNo } from '~/util/tools'
export default {
  name: 'PayList',
  layout: 'content',
  data () {
    return {
      nextPayAgreementOverlay: false,
      activeNames: '0',
      radio: '1',
      currentCard: '0',
      toggle: true,
      disabled: true,
      showModel: false,
      isClose: false,
      ConvenienceStore: {
        type: '',
        userName: '',
        userFalName: '',
        phone: '',
        email: ''
      },
      option1: [
        { text: 'デイリーヤマザキ', value: '00006' },
        { text: 'ローソンローソン・スリーエフ', value: '10001' },
        { text: 'ファミリーマート', value: '10002' },
        { text: 'サンクス', value: '10003' },
        { text: 'サークルＫ', value: '10004' },
        { text: 'ミニストップ', value: '10005' },
        { text: 'セイコーマート', value: '10008' }
      ],
      payData: {
        terminalType: '2'
      },
      // 是否选择了组合支付
      isChangeCompose: false,
      payMethods: [],
      isCompose: false,
      remark: 0,
      nextPayInfo: null
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl', 'subOrderInfo']),
    nextPayState () {
      return !!this.nextPayInfo
    }
  },
  watch: {
    radio (val) {
      const _this = this
      if (val) {
        _this.disabled = false
      } else {
        _this.disabled = true
      }
    }
  },
  async mounted () {
    await this.init()
    await this.setPayMethods(this.payMethods)
  },
  methods: {
    ...mapMutations(['setPayMethods', 'setPaymentForm', 'setAllinPayForm', 'setRemark', 'setTotal']),
    async pay () {
      const _this = this
      if (!this.nextPayState && this.radio === '07') {
        this.nextPayAgreementOverlay = true
        return
      }
      if (_this.isChangeCompose) {
        _this.setRemark(_this.remark)
        _this.setTotal(_this.subOrderInfo.totalPayAmount)
        _this.$router.push('/pay/combinationPay')
      } else {
        const toast = _this.$toast.loading({
          message: _this.$t('newAdd.paying'),
          forbidClick: true,
          duration: 0,
          overlay: true
        })
        await _this.$axios.post(api.pay.ment, _this.payData).then((res) => {
          if (res.code === 200 && res.data.resultFlag) {
            if (_this.radio === '04' || _this.radio === '05') {
              window.location.href = res.data.url
              toast.clear()
            } else if (_this.radio === '02') {
              _this.createFrom(res.data)
            } else if (_this.radio === '06') {
              _this.setAllinPayForm(res.data.allinPayMap)
              _this.$router.push('/pay/allinPay')
            } else {
              this.$router.push({ path: '/pay/response', query: { state: 'true' } })
              toast.clear()
            }
          } else {
            toast.clear()
            this.$router.push({ path: '/pay/response', query: { state: 'false' } })
          }
        }).catch((err) => {
          console.log(err)
          toast.clear()
          this.$toast.fail(err.message)
        })
      }
    },
    // 动态生成表单
    createFrom (paymentFormData) {
      console.log(paymentFormData)
      const arr = ['aid', 'pt', 'cmd', 'jb', 'am', 'cod', 'tx', 'sf', 'ut', 'hak']
      // 创建一个 form
      const form1 = document.createElement('form')
      form1.name = 'Payment'
      form1.method = 'POST'
      form1.action = paymentFormData.url
      // 添加到 body 中
      document.body.appendChild(form1)
      // 创建一个输入
      arr.forEach((item) => {
        const input = document.createElement('input')
        // 设置相应参数
        input.type = 'hidden'
        input.name = item
        input.value = paymentFormData[item]
        // 将该输入框插入到 form 中
        form1.appendChild(input)
      })
      // 对该 form 执行提交
      form1.submit()
      // 删除该 form
      document.body.removeChild(form1)
    },
    updatePayInfo () {
      this.$router.push('/nextPayValidation/update') // 修改验证信息
    },
    payChange (name) {
      const _this = this
      console.log(_this.subOrderInfo)
      console.log(name)
      this.radio = name + ''
      switch (name) {
        case '01':
          if (_this.isCompose) {
            _this.isChangeCompose = true
          } else {
            _this.payData = {
              payBalanceFlag: '1',
              payChannelFlag: '',
              transFlow: mockTransactionNo(12),
              terminalType: '2',
              // 订单号
              tradeNumber: _this.subOrderInfo.tradeNumber
            }
          }
          break
        case '02':
          _this.isChangeCompose = false
          _this.payData = {
            payBalanceFlag: '',
            payChannelFlag: '1',
            transFlow: mockTransactionNo(12),
            terminalType: '2',
            // 支付渠道号，2=信用卡，3=便利店，4=paypal
            channelCode: '2',
            tradeNumber: _this.subOrderInfo.tradeNumber
          }
          console.log(_this.payData)
          break
        case '03':
          _this.showModel = true
          _this.isChangeCompose = false
          break
        case '04':
          console.log('--------选择了paypal------')
          _this.isChangeCompose = false
          _this.payData = {
            payBalanceFlag: '',
            payChannelFlag: '1',
            terminalType: '2',
            transFlow: mockTransactionNo(12),
            // 支付渠道号，2=信用卡，3=便利店，4=paypal
            channelCode: '4',
            stopReturnUrl: location.href,
            tradeNumber: _this.subOrderInfo.tradeNumber
          }
          break
        case '05':
          console.log('--------选择了paygent------')
          _this.isChangeCompose = false
          _this.payData = {
            payBalanceFlag: '',
            payChannelFlag: '1',
            terminalType: '2',
            transFlow: mockTransactionNo(12),
            // 支付渠道号，2=信用卡，3=便利店，4=paypal
            channelCode: '5',
            tradeNumber: _this.subOrderInfo.tradeNumber,
            stopReturnUrl: 'http://m.starday.jp/',
            url: 'http://m.starday.jp/order/confirmOrder/pay/response'
          }
          break
        case '06':
          _this.isChangeCompose = false
          _this.payData = {
            payBalanceFlag: '',
            payChannelFlag: '1',
            transFlow: mockTransactionNo(12),
            terminalType: '2',
            channelCode: '6',
            tradeNumber: _this.subOrderInfo.tradeNumber
          }
          break
        case '07':
          // eslint-disable-next-line eqeqeq
          if (!this.nextPayAgreementOverlay && !this.nextPayState) {
            this.nextPayAgreementOverlay = true
          }
          _this.payData = {
            payBalanceFlag: '',
            payChannelFlag: '',
            transFlow: mockTransactionNo(12),
            payMonthFlag: '1',
            terminalType: '2',
            channelCode: '',
            tradeNumber: _this.subOrderInfo.tradeNumber
          }
          break
        default:
          break
      }
    },
    modelBeforeClose (action, done) {
      done(this.isClose)
    },
    confirmConvenienceStore () {
      const _this = this
      const regMail = new RegExp(Reg.mailBox)
      for (const key in _this.ConvenienceStore) {
        if (_this.ConvenienceStore[key]) {
          _this.isClose = true
        } else {
          _this.$toast(_this.$t('address.postcode'))
          _this.isClose = false
        }
      }
      if (!regMail.test(_this.ConvenienceStore.email)) {
        _this.$toast(_this.$t('register.err'))
        _this.isClose = false
        return
      }

      if (_this.ConvenienceStore.type === '') {
        _this.$toast(_this.$t('offlinepay.codenone'))
        _this.isClose = false
        return
      }
      _this.payData = {
        // 空字符，未用第三方支付，1=用第个人余额支付
        payBalanceFlag: '',
        // 渠道支付金额，空字符，未用第三方支付，1=用第三方支付
        payChannelFlag: '1',
        terminalType: '2',
        transFlow: mockTransactionNo(12),
        // 支付渠道号，2=信用卡，3=便利店，4=paypal
        channelCode: '3',
        // 支付时便利店代码，便利店支付时必传
        convenience: _this.ConvenienceStore.type,
        // 用户ID
        customerId: '',
        // 名
        customerKana: _this.ConvenienceStore.userName,
        // 姓氏
        customerName: _this.ConvenienceStore.userFalName,
        // 电子邮箱，便利店支付时必传
        mailAddress: _this.ConvenienceStore.email,
        // 电话号码，便利店支付时必传
        telNo: _this.ConvenienceStore.phone,
        // 订单号
        tradeNumber: _this.subOrderInfo.tradeNumber
      }
      this.pay()
    },
    canaelConvenienceStore () {
      this.isClose = true
      this.radio = '01'
    },
    nextPayAgreementChange () {
      this.nextPayAgreementOverlay = false
      if (!this.nextPayState) { this.$router.push('/nextPayValidation/check') } // 验证信息
    },
    toggleCard () {
      this.toggle = !this.toggle
    },
    onClickLeft () {
      this.$router.back()
    },
    async init () {
      const params = {
        pageNo: 1,
        pageSize: 10,
        sort: 'asc',
        tradeOrderNumber: this.subOrderInfo.tradeNumber
      }
      await this.$axios.get(api.pay.methods, { params }).then((res) => {
        if (res.code === 200) {
          res.data.rows.forEach((item) => {
            if (item.paytypeCode === '01') {
              this.remark = item.remark
            }
          })
          if (Number(this.subOrderInfo.totalPayAmount) > Number(this.remark)) {
            this.isCompose = true
          } else {
            this.isCompose = false
          }
          this.payMethods = res.data.rows
        }
      })
      await this.$axios.get(api.user.nextMonthPay).then((res) => {
        if (res.code === 200 && res.data) {
          this.nextPayInfo = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pay-list-container{
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  position: relative;
    .nextPayContent{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 10;
      background-color: rgba(0,0,0,.6);
      .PayBlock{
        width: 630px;
        height: 1042px;
        background-color: #fff;
        border-radius: 18px;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;
        .title{
          width: 100%;
          height: 108px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          padding: 0 34px;
          .agree-t{
            flex: 1;
            font-size: 30px;
            font-weight: 500;
            text-align: center;
            color: #333333;
            line-height: 42px;
          }
          .close-icon{
            width: 38px;
            height: 38px;
          }
        }
        .center{
          width: 100%;
          height: 786px;
          padding: 0 34px;
          .text::-webkit-scrollbar{
            display: none;
          }
          .text{
            width: 100%;
            font-size: 28px;
            font-weight: 400;
            height: 786px;
            overflow-y: scroll;
            color: #000000;
            line-height: 40px;
            h1{
              text-align: center;
              line-height: 60px;
            }
            h2{
              text-align: left;
              font-weight: 600;
              line-height: 40px;
            }
            h3{
              text-indent: 2em;
            }
            p{
              text-indent: 2em;
              color: #999;
            }
          }
        }
        .bottom{
          width: 100%;
          height: 148px;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0px -4px 10px 0px rgba(204,204,204,0.09);
          .btn{
            width: 570px;
            height: 88px;
            background: linear-gradient(90deg,#ffa14b, #ff5d19);
            border-radius: 44px;
            font-size: 28px;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: 88px;
          }
        }
      }
    }

  /deep/.van-nav-bar__content{
    height: 88px;
    .van-nav-bar__title{
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 88px;
    }
  }
  /deep/.van-button__text {
    font-size: 24px;
  }
  /deep/.van-icon {
    font-size: 30px;
  }
  /deep/.van-radio__icon {
    height: auto;
  }
  .content{
    flex: 1;
    .van-radio-group{
      margin-top: 20px;
      .van-cell-group{
        .van-cell{
          width: 100%;
          align-items: center;
          min-height: 104px;
          padding: 10px 30px;
          font-size: 0;
          .pay-list-icon{
            width: 90px;
            height: 90px;
            object-fit: contain;
          }
          .van-cell__title{
            font-size: 28px;
            font-weight: 400;
            color: #333333;
            line-height: 40px;
            display: flex;
            flex-flow: column nowrap;
            justify-content: center;
            .title{
              display: flex;
              flex-flow: row nowrap;
              justify-content: flex-start;
              align-items: center;
              .zuhezhifu{
                font-size: 24px;
                color: #e00d0d;
                margin-left: 20px;
              }
              .nextPayAgreement{
                font-size: 28px;
                font-weight: 400;
                text-align: left;
                color: #ff5d19;
                line-height: 40px;
              }
            }
            .van-cell__label{
              .ingle{
                font-size: 22px;
                line-height: 50px;
                .balance{
                  color: #58a4ef;
                }
              }
              .imgs{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                img {
                  width: 70px;
                  height: 60px;
                  margin-right: 15px;
                }
              }
              .nextPayAddressUpdate{
                display: flex;
                flex-flow: row nowrap;
                justify-content: flex-start;
                align-items: center;
                .text{
                  width: 420px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                }
                .updateBtn{
                  font-size: 24px;
                  font-weight: 400;
                  color: #1491ff;
                  line-height: 33px;
                  margin-left: 10px;
                }
              }
            }
          }
          .payStyle{
            font-size: 24px;
            font-weight: 400;
            color: #333333;
            line-height: 37px;
          }
        }
      }
    }
  }
  .button_box{
    width: 100%;
    padding: 10px 30px;
    .van-button{
      width: 100%;
      height: 80px;
    }
  }
  /deep/.van-dialog{
    width: 630px;
    .van-dialog__content{
      .van-cell-group{
        .ConvenienceStore{
          width: 100%;
          padding: 20px 30px;
          .select-box,.van-cell{
            width: 100%;
            height: 88px;
            padding: 10px 20px;
            border: 1px solid #c9c9c9;
            border-radius: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            .select{
              border: none;
              width: 100%;
              height: 70px;
              background-color: transparent;
            }
            .van-field__body{
              height: inherit;
              .van-field__control{
                font-size: 26px;
                padding-left: 15px;
              }
            }
          }
          .van-cell--required::before{
            top: 36px;
          }
        }
      }
    }
  }
}
</style>
