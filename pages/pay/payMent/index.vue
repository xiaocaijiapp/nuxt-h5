<!---->
<template>
  <div>
    <div>
      <form
        v-if="paymentFormData"
        name="Payment"
        :action="paymentFormData.url"
        method="post"
      >
        <input type="hidden" name="aid" :value="paymentFormData.aid" />
        <input type="hidden" name="pt" :value="paymentFormData.pt" />
        <input type="hidden" name="cmd" :value="paymentFormData.cmd" />
        <input type="hidden" name="jb" :value="paymentFormData.jb" />
        <input type="hidden" name="am" :value="paymentFormData.am" />
        <input type="hidden" name="cod" :value="paymentFormData.cod" />
        <input type="hidden" name="tx" :value="paymentFormData.tx" />
        <input type="hidden" name="sf" :value="paymentFormData.sf" />
        <input type="hidden" name="ut" :value="paymentFormData.ut" />
        <input type="hidden" name="hak" :value="paymentFormData.hak" />
        <noscript>
          <input
            type="submit"
            ref="paymentsubmit"
            name="submit"
            value="wangguan購入"
          />
        </noscript>
      </form>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapGetters } from 'vuex'
export default {
  components: {},
  data () {
    return {
      paymentFormData: {}
    }
  },
  computed: {
    ...mapGetters({
      paymentForm: 'paymentForm'
    })
  },
  created () {},
  mounted () {
    const that = this
    that.paymentFormData = this.paymentForm
    that.$toast.loading({
      forbidClick: true,
      loadingType: 'spinner',
      overlay: true,
      duration: 2000,
      onClose: () => {
        that.$refs.paymentsubmit.click()
      }
    })
  },
  methods: {
    init (data) {
      const that = this
      that.paymentFormData = JSON.parse(data)
      Toast.loading({
        forbidClick: true,
        loadingType: 'spinner',
        overlay: true,
        duration: 2000,
        onClose: () => {
          console.log('dianji')
          that.$refs.paymentsubmit.click()
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
