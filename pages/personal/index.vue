<template>
    <div class="personalCenter">
      <div class="headerbg">
        <div v-if="showHidden" class="hidden">
          <div>
            <img v-if="userinfo.headImage" v-lazy="baseImageUrl + userinfo.headImage" alt="">
            <img v-else src="@/assets/images/index/defaultimg.png" alt="">
          </div>
          <div>
            <van-icon size="26px" name="setting-o" @click="goSetup" />
          </div>
        </div>
        <div class="main_top">
          <div>
            <img v-if="userinfo.headImage" v-lazy="baseImageUrl + userinfo.headImage" alt="">
            <img v-else src="@/assets/images/index/defaultimg.png" alt="">
            <div @click="goUserInfo">
              <p>{{userinfo.username}}</p>
              <p>
                <span>{{$t('newUserInfo.editinfo')}}</span>
                <span>
                <img src="../../assets/images/user/righticon.png" alt="" />
              </span>
              </p>
            </div>
          </div>
          <div>
            <van-icon :name="require('assets/images/user/shezhi.png')" @click="goSetup"/>
          </div>
        </div>
        <div class="main_bottom">
          <div @click="goBlance">
            <p>{{userinfo.cardBalance}}</p>
            <p>{{$t('newUserInfo.blace')}}</p>
          </div>
          <div @click="goIngetar">
            <p>{{userinfo.integral}}</p>
            <p class="user_ingetal">
              {{$t('index.p2')}}
<!--              <van-icon :name="require('assets/images/user/yiwen@3x.png')" />-->
            </p>
          </div>
          <div @click="goCoupon">
            <p>{{userinfo.couponCount}}</p>
            <p>{{$t('newConfirmOrder.coupon')}}</p>
          </div>
          <div v-if="nextPayState" @click="$router.push('/followMonthPay')">
            <p>{{nextPayInfo.availableCredit}}</p>
            <p>{{$t('nextPay.name')}}</p>
          </div>
          <div v-else @click="nextPayAgreementOverlay = true">
            <p class="nextPayOpen">{{$t('nextPay.open')}}</p>
            <p>{{$t('nextPay.name')}}</p>
          </div>
        </div>
        <div class="distribution" @click="$router.push('/personal/distributionCenter')">
          <span>{{$t('distribution.distributionCenter')}}</span>
          <span>
            <van-icon name="arrow" />
          </span>
        </div>
      </div>
      <!-- 我的订单 -->
      <div class="orderinfo">
        <div class="orderinfo_top">
          <div>{{$t('user_main.my_order')}}</div>
          <div @click="goOrderList">{{$t('newUserInfo.allOrder')}}></div>
        </div>
        <div class="orderinfo_bottom">
          <div>
            <a href="/order/orderlist?active=1">
              <van-icon :name="require('assets/images/user/daifukuan.png')" :badge="userinfo.waitPay?userinfo.waitPay:''"/>
              <p class="icon-title">{{$t('order.nopay')}}</p>
            </a>
          </div>
          <div>
            <a href="/order/orderlist?active=2">
              <van-icon
                :name="require('assets/images/user/daifahuo.png')"
                :badge="userinfo.waitDeliver?userinfo.waitDeliver:''"
              />
              <p class="icon-title">{{$t('order.nodeLiver')}}</p>
            </a>
          </div>
          <div>
            <a href="/order/orderlist?active=3">
              <van-icon
                :badge="userinfo.waitRecipient?userinfo.waitRecipient:''"
                :name="require('assets/images/user/daishouhuo.png')"
              />
              <p class="icon-title">{{$t('order.bedeliver')}}</p>
            </a>
          </div>
          <div>
            <a href="/order/orderlist?active=4">
              <van-icon
                :badge="userinfo.waitEvaluate?userinfo.waitEvaluate:''"
                :name="require('assets/images/user/daipingjia.png')"
              />
              <p class="icon-title">{{$t('newOrder.Tobeevaluated')}}</p>
            </a>
          </div>
          <div style="display: none" @click="goRefund">
            <a href="#">
              <van-icon :name="require('assets/images/user/shouhou.png')" />
              <p class="icon-title">{{$t('newUserInfo.Refundaftersale')}}</p>
            </a>
          </div>
        </div>
      </div>
      <!-- 会员店铺 -->
      <div class="memberStore" style="display: none">
        <p>
          <span>{{$t('newThreeClass.usersStore').replace('M', userinfo.username)}}</span>
          <span @click="$router.push('/personal/ruleDescription')"><img src="~/assets/images/index/yiwen.png" alt=""></span>
        </p>
        <div class="footbox">
          <div class="itembox" @click="$router.push('/personal/buyGoodsList')">
            <img src="@/assets/images/default/che.png"/>
            <p>{{$t('newThreeClass.buyGoods')}}</p>
          </div>
          <div class="itembox" @click="$router.push('/personal/platformList')">
            <img src="@/assets/images/default/shou.png"/>
            <p>{{$t('newThreeClass.platformRecom')}}</p>
          </div>
          <div class="itembox" @click="$router.push('/personal/orderdetails')">
            <img src="@/assets/images/default/rili.png"/>
            <p>{{$t('newThreeClass.orderDetails')}}</p>
          </div>
        </div>
      </div>
      <!-- 工具与服务 -->
      <div class="untils">
        <div class="title">{{$t('newUserInfo.Toolsservices')}}</div>
        <div class="untils_main">
          <div class="untils_main_item" @click="goCollection">
            <van-icon :name="require('assets/images/user/xihuan.png')" />
            <div class="untils_main_item_desc">{{$t('cart.favorite')}}</div>
          </div>
          <div class="untils_main_item" @click="goBrowseHistory">
            <van-icon :name="require('assets/images/user/liulan.png')" />
            <div class="untils_main_item_desc">{{$t('newUserInfo.viewRecode')}}</div>
          </div>
          <div class="untils_main_item" @click="goGiftCard">
            <van-icon :name="require('assets/images/user/lipinka.png')" />
            <div class="untils_main_item_desc">{{$t('supply.p11')}}</div>
          </div>
          <div class="untils_main_item" @click="goMyComments">
            <van-icon :name="require('assets/images/user/pingjia.png')" />
            <div class="untils_main_item_desc">{{$t('newUserInfo.myCommonts')}}</div>
          </div>
          <div class="untils_main_item" @click="goAddress">
            <van-icon :name="require('assets/images/user/peisong.png')" />
            <div class="untils_main_item_desc">{{$t('user_main.deliver_adress')}}</div>
          </div>
          <div class="untils_main_item" @click="goAbout">
            <van-icon :name="require('assets/images/user/fankui.png')" />
            <div class="untils_main_item_desc">{{$t('user_main.about')}}</div>
          </div>
        </div>
      </div>
      <!-- 关注我们 -->
<!--      <div class="focus_us">-->
<!--        <div class="title">{{$t('newUserInfo.focusOus')}}</div>-->
<!--        <div class="untils_main">-->
<!--          <div class="main_item" @click="focusUs(0)">-->
<!--            <van-icon size="36" :name="require('assets/images/login/line.png')" />-->
<!--            <div class="untils_main_item_desc">line</div>-->
<!--          </div>-->
<!--          <div class="main_item" @click="focusUs(1)">-->
<!--            <van-icon-->
<!--              size="36"-->
<!--              :name="require('assets/images/login/facebook.png')"-->
<!--            />-->
<!--            <div class="untils_main_item_desc">Facebook</div>-->
<!--          </div>-->
<!--          <div class="main_item" @click="focusUs(2)">-->
<!--            <van-icon size="36" :name="require('assets/images/login/twter.png')" />-->
<!--            <div class="untils_main_item_desc">Twitter</div>-->
<!--          </div>-->
<!--          <div class="main_item" @click="focusUs(3)">-->
<!--            <van-icon-->
<!--              size="36"-->
<!--              :name="require('assets/images/login/instagram.png')"-->
<!--            />-->
<!--            <div class="untils_main_item_desc">Instagram</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
      <van-popup v-model="show" :style="{ height: '60%' ,width:'80%'}">
        <div>
          <img src="https://image.stardaymart.com/h5/lADPDhmOuF1Fb__NBMbNArw_700_1222.jpg?x-oss-process=image/resize,w_1000/format,webp" alt="" style="width: 100%; height: 100%">
        </div>
      </van-popup>
      <Recommend />
      <div v-if="nextPayAgreementOverlay" class="nextPayContent">
        <div class="PayBlock">
          <div class="title">
            <div class="agree-t">{{$t('nextPay.agreement')}}</div>
            <img class="close-icon" :src="require('assets/images/icon/ic_no.png')" @click="closeNextPay" />
          </div>
          <div class="center" @touchstart.stop>
            <div class="text">
              <h1>翌月支払い利用規約</h1>
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
          <div class="bottom">
            <span class="btn" @click.stop="$router.push('/nextPayValidation/check')">{{$t('nextPay.payBtn')}}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import api from 'static/api'
import Recommend from '~/components/recommend/recommend'
export default {
  name: 'Index',
  layout: 'default',
  components: {
    Recommend
  },
  async asyncData ({ $axios }) {
    const { data } = await $axios.get(api.user.creditInfo)
    return {
      nextPayInfo: data
    }
  },
  data () {
    return {
      showHidden: false,
      show: false,
      userinfo: {},
      nextPayAgreementOverlay: false
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl'
    }),
    nextPayState () {
      return !this.nextPayInfo.monthlyPayOpen
    }
  },
  created () {
    console.log(this.nextPayInfo)
  },
  mounted () {
    window.addEventListener('scroll', this.scrollEvent)
    this.init()
    this.setTabBarActive(4)
  },
  methods: {
    ...mapMutations(['setTabBarActive']),
    closeNextPay () {
      this.nextPayAgreementOverlay = false
    },
    init () {
      const _this = this
      _this.$axios.get(api.user.myInfo).then((res) => {
        if (res.code === 200) {
          _this.userinfo = res.data
        }
      })
    },
    scrollEvent () {
      const scroll = document.documentElement.scrollTop || document.body.scrollTop
      if (scroll > 100) {
        this.showHidden = true
      } else {
        this.showHidden = false
      }
    },
    goSetup () {
      this.$router.push('/setup')
    },
    goUserInfo () {
      this.$router.push('/personal/membermodify')
    },
    // 余额
    goBlance () {
      this.$router.push('/personal/transactiondetail')
    },
    // 积分
    goIngetar () {
      this.$router.push('/personal/accountDetail')
    },
    // 我的优惠券
    goCoupon () {
      this.$router.push('/personal/mycoupon')
    },
    // 跳转至积分规则
    toIntegralRules () {
      // this.$router.push('/personal/IntegralRules')
      this.$router.push('/personal/pointsRules')
    },
    // 我的订单
    goOrderList () {
      this.$router.push('/order/orderlist')
    },
    // 退款售后
    goRefund () {},
    // ----------工具与服务-----------
    goCollection () {
      this.$router.push('/personal/attentiongoods')
    },
    goBrowseHistory () {
      this.$router.push('/personal/historyGood')
    },
    goGiftCard () {
      this.$router.push('/personal/giftCard')
    },
    goAddress () {
      this.$router.push('/address')
      window.sessionStorage.setItem('page', 'personal')
    },
    goMyComments () {
      this.$router.push('/personal/myCommon')
    },
    goRefundCard () {},
    goAbout () {
      this.$router.push('/about/starday')
    }
    // 关注我们
    // focusUs (key) {
    //   const _this = this
    //   switch (key) {
    //     case 0:
    //       _this.show = true
    //       break
    //     case 1:
    //       window.open('https://m.facebook.com/Starday.jp')
    //       break
    //     case 2:
    //       window.open('https://mobile.twitter.com/stardayshop ')
    //       break
    //     case 3:
    //       window.open('https://www.instagram.com/starday.promotion/')
    //       break
    //     default:
    //       break
    //   }
    // }
  }
}
</script>

<style scoped lang="less">
  .personalCenter {
    position: relative;
    width: 100%;
    height: 100vh;
      .nextPayContent{
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        position: absolute;
        width: 100%;
        z-index: 100;
        background-color: rgba(0,0,0,.6);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
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
          .center::-webkit-scrollbar{
            display: none;
          }
          .center{
            width: 100%;
            height: 786px;
            padding: 0 34px;
            overflow-y: scroll;
            .text::-webkit-scrollbar{
              display: none;
            }
            .text{
              font-size: 28px;
              font-weight: 400;
              height: 786px;
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

    .headerbg {
      width: 100%;
      height: 433px;
      background-image: url('../../assets/images/user/beijing.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      overflow: hidden;
      .hidden {
        width: 100%;
        height: 88px;
        box-sizing: border-box;
        padding: 10px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #fff;
        position: fixed;
        top: 0;
        z-index: 99;
        img {
          width: 68px;
          height: 68px;
          border-radius: 50%;
        }
      }
      .main_top {
        height: 180px;
        width: 90%;
        margin-left: 5%;
        display: flex;
        justify-content: space-between;
        margin-top: 40px;
        align-items: center;
        div:first-child {
          display: flex;
          justify-content: space-around;
          align-items: center;
          color: #fff;
          img {
            width: 104px;
            height: 104px;
            border-radius: 50%;
          }
          >img {
            border: 4px solid #fff;
          }
          p {
            padding-left: 30px;
            margin: 0;
          }
          p:first-child {
            font-size: 36px;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
          }
          p:last-child {
            font-size: 26px;
            margin-top: 9px;
            img {
              width: 15px;
              height: 22px;
            }
          }
        }
        div:last-child {
          font-size: 52px;
        }
      }
      .main_bottom {
        width: 90%;
        margin-left: 5%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        line-height: 48px;
        div {
          text-align: center;
          color: #fff;
          p:first-child {
            font-size: 38px;
            margin: 0;
          }
          p:last-child {
            margin: 0;
            font-size: 26px;
          }
          .nextPayOpen{
            font-size: 26px!important;
          }
        }
        .user_ingetal {
          height: 48px;
          line-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .user_ingetal i {
          padding-left: 10px;
        }
      }
      .distribution {
        width: 90%;
        height: 50px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        position: absolute;
        top: 356px;
        left: 42px;
        /deep/.van-icon-arrow {
          color: #FFCA62;
          font-size: 26px;
        }
        span {
          display: inline-block;
        }
        span:nth-of-type(1) {
          font-weight: 600;
          font-size: 28px;
          background: linear-gradient(to right, #FFCA62, #F6E2C7);
          -webkit-background-clip: text;
          color: transparent;
        }
      }
    }
    .orderinfo {
      width: 92%;
      min-height: 238px;
      background: #fff;
      margin-left: 4%;
      /*margin-top: -130px;*/
      border-radius: 20px;
      .orderinfo_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 30px;
        div:first-child {
          font-size: 32px;
          font-weight: 600;
        }
        div:last-child {
          font-size: 26px;
          font-weight: 500;
          color: rgba(153, 153, 153, 1);
        }
      }
      .orderinfo_bottom {
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        text-align: center;
        a {
          color: #333;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }
        div {
          /*flex-basis: 100%;*/
          height: 32px;
          text-align: center;
          line-height: 30px;
          p {
            width: 134px;
          }
        }
        p {
          margin: 0;
          font-size: 24px;
        }
        i {
          font-size: 56px;
          .van-info {
            background: #fff;
            border: 1px solid #ff5d1a;
            color: #ff5d1a;
            right: 36px;
            min-width: 32px;
            font-size: 18px;
            border-radius: 36px;
          }
        }
        .icon-title{
          padding-top: 10px;
        }
      }
    }
    .untils {
      width: 92%;
      margin-left: 4%;
      background: #fff;
      border-radius: 20px;
      margin-top: 30px;
      min-height: 500px;
      .title {
        padding: 30px;
        font-size: 32px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
      }
      .untils_main {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .untils_main_item {
          height: 204px;
          flex-basis: 33.3333333333%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          border: 1px solid #e9e9e9;
          i {
            margin-top: 60px;
            font-size: 52px;
            text-align: center;
          }
        }
        .untils_main_item:nth-child(1) {
          border-left: 0;
          border-bottom: 0;
        }
        .untils_main_item:nth-child(2) {
          border-right: 0;
          border-left: 0;
          border-bottom: 0;
        }
        .untils_main_item:nth-child(3) {
          border-right: 0;
          border-bottom: 0;
        }
        .untils_main_item:nth-child(4) {
          border-bottom: 0;
          border-left: 0;
          border-top: 1px solid #e9e9e9;
        }
        .untils_main_item:nth-child(5) {
          border-right: 0;
          border-left: 0;
          border-bottom: 0;
        }
        .untils_main_item:nth-child(6) {
          border-bottom: 0;
          border-right: 0;
        }
      }
    }
    .focus_us {
      width: 92%;
      margin-left: 4%;
      background: #fff;
      border-radius: 20px;
      margin-top: 30px;
      min-height: 260px;
      .title {
        padding: 30px;
        font-size: 32px;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
      }
      .untils_main {
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .main_item {
          height: 224px;
          flex-basis: 25%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .untils_main_item_desc {
      font-size: 24px;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      line-height: 60px;
      text-align: center;
    }
    .memberStore{
      margin:20px 30px;
      padding:30px;
      background: #ffffff;
      border-radius: 10px;
      >p{
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:nth-of-type(1) {
          font-size: 32px;
          font-weight: 600;
          color: #333333;
        }
        span:nth-of-type(2) {
          img {
            width: 30px;
            height: 30px;
          }
        }
      }
      .footbox{
        display: flex;
        justify-content: space-around;
        align-items: center;
        margin-top:38px;
        .itembox{
          text-align:center;
          img{
            width:56px;
            height:56px;
          }
          >p{
            margin-top:16px;
            font-size: 24px;
            color: #333333;
          }
        }
      }
    }
  }
</style>
