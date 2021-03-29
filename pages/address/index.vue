<template>
<div class="address-list-container">
  <van-sticky>
    <van-nav-bar :title="$t('address.adressmanger')" placeholder @click-left="onClickLeft">
      <template #left>
        <van-icon size="22px" name="arrow-left" color="#999999" />
      </template>
    </van-nav-bar>
  </van-sticky>
  <div class="content">
    <address-empty v-if="isShowEmpty" />
    <van-radio-group v-else v-model="radio" class="main">
      <div
        v-for="(item,index) in list"
        :key="index"
        class="creditCard_box"
        @click="radio = index + 1"
      >
        <van-radio
          slot="right-icon"
          :name=" index+1"
          checked-color="#EC5820"
          class="right-icon"
          icon-size="5.7142857vw"
          @click="changeDef(index)"
        />
        <div class="creditCard_box_main" @click.stop="changeDef(index)">
          <p class="no">{{item.realName}}&nbsp;{{item.mobile}}</p>
          <p class="name">{{item.address+item.deliveryAddress}}</p>
          <p class="detail">{{item.postcode}}</p>
        </div>
        <div class="right">
            <span
              class="del"
              @click.stop="delAdress(item.id,index)"
            >{{$t('address.del')}}</span>
          <span
            class="edit"
            @click.stop="editAdress(item)"
          >{{$t('address.edit')}}</span>
        </div>
      </div>
    </van-radio-group>
  </div>
  <div class="button_box">
    <van-button
      round
      type="primary"
      color="linear-gradient(to right, #FFA14B, #FF5D19)"
      block
      @click="addAdress"
    >{{$t('address.add')}}</van-button>
  </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import addressEmpty from '~/components/empty/addressEmpty'
import api from '~/static/api'
export default {
  name: 'Index',
  layout: 'content',
  components: {
    addressEmpty
  },
  async asyncData ({ $axios }) {
    let list = []
    let radio = 1
    await $axios.post(api.adress.list).then((res) => {
      if (res.code === 200) { list = res.data }
    })
    list.forEach((item, index) => {
      if (!item.def) { radio = index + 1 }
    })
    return {
      list,
      radio
    }
  },
  data () {
    return {
    }
  },
  computed: {
    isShowEmpty () {
      return !(this.list.length > 0)
    }
  },
  created () {
    console.log(this.list)
  },
  methods: {
    ...mapMutations(['setEditAddress']),
    onClickLeft () {
      window.history.go(-1)
    },
    changeDef (index) {
      const that = this
      that.radio = index + 1
      const id = that.list[index].id
      that.$axios.put(api.adress.def + id).then((res) => {
        if (res.code === 200) {
          if (sessionStorage.getItem('page') === 'placeorder') {
            that.$router.push('/placeorder')
          }
        } else {
          that.$toast('失败')
        }
      })
    },
    delAdress (id, index) {
      const that = this
      this.$dialog.confirm({ message: that.$t('diglog.one') }).then(() => {
        that.$axios.delete(api.adress.del + id).then((res) => {
          if (res.code === 200) {
            that.list.splice(index, 1)
          } else {
            that.$toast('失败')
          }
        })
      })
    },
    editAdress (item) {
      this.setEditAddress(item)
      this.$router.push('/address/editAddress')
      // window.location.href = '/address/editAddress'
    },
    addAdress () {
      this.$router.push('/address/addAddress')
      // window.location.href = '/address/addAddress'
    }
  }
}
</script>

<style lang="less" scoped>
.address-list-container{
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  /deep/.van-nav-bar__content{
    height: 88px;
    .van-nav-bar__title{
      font-size: 36px;
      font-weight: 400;
      color: #333333;
      line-height: 88px;
    }
  }
  .content{
    flex: 1;
    /deep/.van-radio-group{
      .creditCard_box{
        width: 100%;
        padding: 30px;
        height: 200px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        background-color: #ffffff;
        border-bottom: 1px solid #e5e5e5;
        .right{
          height: 100%;
          display: flex;
          flex-flow: column nowrap;
          justify-content: space-between;
          align-items: center;
          width: 80px;
          font-size: 26px;
          font-weight: 400;
          color: #666666;
          .edit{
            color: #3897e0;
          }
        }
        .creditCard_box_main{
          flex: 1;
          padding: 0 20px;
          .no{
            font-size: 32px;
            font-weight: 400;
            color: #333333;
            line-height: 45px;
          }
          .name{
            font-size: 28px;
            font-weight: 400;
            color: #666666;
            line-height: 40px;
          }
          .detail{
            font-size: 32px;
            font-weight: 400;
            color: #666666;
            line-height: 45px;
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
  .van-button--round {
    height: 82px;
    font-size: 28px;
  }
}

</style>
