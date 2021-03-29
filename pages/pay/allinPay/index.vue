<template>
    <div>
        <div>
            <form v-if="tonglianForm" :action="tonglianForm.hostUrl + '/payment'" method="post" style="visibility: hidden;height: 0">
                <input id="paymerchantid" type="text" name="paymerchantid" :value="tonglianForm.PaymerchantID" />
                <input id="OrderId" type="text" name="OrderId" :value="tonglianForm.OrderId" />
                <input id="Email" type="text" name="Email" :value="tonglianForm.Email" />
                <input id="CurrencyType" type="text" name="CurrencyType" :value="tonglianForm.CurrencyType" />
                <input id="Amount" type="text" name="Amount" :value="tonglianForm.Amount"  />
                <input id="Signature" type="text" name="Signature" :value="tonglianForm.sign"/>
                <input id="ReturnUrl" type="text" name="ReturnUrl" :value="tonglianForm.ReturnUrl" />
                <input id="NotifyUrl" type="text" name="NotifyUrl" :value="tonglianForm.NotifyUrl" />
                <input id="Language" type="text" name="Language" :value="tonglianForm.Language" />
                <input id="PayPageStyle" type="text" name="PayPageStyle" value="Tiny" />
                <input id="Sku1" type="text" name="Sku1" :value="tonglianForm.Sku1" />
                <input id="ProductName1" type="text" name="ProductName1" :value="tonglianForm.ProductName1" />
                <input id="Price1" type="text" name="Price1" :value="tonglianForm.Price1" />
                <input id="Quantity1" type="text" name="Quantity1" :value="tonglianForm.Quantity1" />
                <input id="ShippingFirstName" type="text" name="ShippingFirstName" :value="tonglianForm.ShippingFirstName" />
                <input id="ShippingLastName" type="text" name="ShippingLastName" :value="tonglianForm.ShippingLastName" />
                <input id="ShippingAddress1" type="text" name="ShippingAddress1" :value="tonglianForm.ShippingAddress1" />
                <!--      <input type="text" id="ShippingAddress2" name="ShippingAddress2" value="" />-->
                <input id="ShippingCity" type="text" name="ShippingCity" :value="tonglianForm.ShippingCity" />
                <input id="ShippingCountry" type="text" name="ShippingCountry" :value="tonglianForm.ShippingCountry" />
                <input id="ShippingState" type="text" name="ShippingState" :value="tonglianForm.ShippingState" />
                <input id="ShippingZipcode" type="text" name="ShippingZipcode" :value="tonglianForm.ShippingZipcode" />
                <input id="ShippingTelephone" type="text" name="ShippingTelephone" :value="tonglianForm.ShippingTelephone" />
                <input id="BillingFirstName" type="text" name="BillingFirstName" :value="tonglianForm.BillingFirstName" />
                <input id="BillingLastName" type="text" name="BillingLastName" :value="tonglianForm.BillingLastName"  />
                <input id="BillingAddress1" type="text" name="BillingAddress1" :value="tonglianForm.BillingAddress1" />
                <!--      <input type="text" id="BillingAddress2" name="BillingAddress2" :value="tonglianForm.BillingAddress1" />-->
                <input id="BillingCity" type="text" name="BillingCity" :value="tonglianForm.BillingCity" />
                <input id="BillingCountry" type="text" name="BillingCountry" :value="tonglianForm.BillingCountry" />
                <input id="BillingState" type="text" name="BillingState" :value="tonglianForm.BillingState" />
                <input id="BillingZipcode" type="text" name="BillingZipcode" :value="tonglianForm.BillingZipCode" />
                <input id="BillingTelephone" type="text" name="BillingTelephone" :value="tonglianForm.BillingTelephone" />
                <input ref="tongliansubmit" type="submit" />
            </form>
        </div>
    </div>
</template>

<script>
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
export default {
  name: 'AllinPay',
  data () {
    return {
      tonglianForm: {}
    }
  },
  computed: {
    ...mapGetters({
      allinPayForm: 'allinPayForm'
    })
  },
  mounted () {
    this.tonglianForm = JSON.parse(this.allinPayForm)
    this.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      overlay: true,
      duration: 2000,
      onClose: () => {
        this.$refs.tongliansubmit.click()
      }
    })
  },
  methods: {
    init (data) {
      const that = this
      that.tonglianForm = JSON.parse(data)
      Toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        overlay: true,
        duration: 2000,
        onClose: () => {
          that.$refs.tongliansubmit.click()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
</style>
