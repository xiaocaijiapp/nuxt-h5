<template>
  <div class="cart-container">
    <van-sticky>
      <van-nav-bar :title="$t('cart.cart')" @click-right="onClickRight">
        <template #right>
          <span class="right-title">{{right_text}}</span>
        </template>
      </van-nav-bar>
    </van-sticky>
    <Empty v-if="empty" />
    <div v-else class="cart_main">
      <div v-for="(item,index) in cartList" :key="index" class="cart_shop">
        <div class="cart_shop_title">
          <van-checkbox v-model="item.checked" checked-color="#FF5D19" @click="checkShop(item, index)">
            {{item.storeName}}
          </van-checkbox>
          <img class="arrow-right" src="~/assets/images/cart/carts.png" @click="goStore(item)">
        </div>
        <div v-for="(m,k) in item.shopItems" :key="k" class="cart_shop_card">
          <span v-if="m.isSeckill" class="sec_box">
            {{$t('newCart.seckill')}}
          </span>
          <div class="card_box">
            <van-checkbox v-model="m.checked" checked-color="#FF5D19" @click.prevent="checkGoods(item,m,index)"></van-checkbox>
            <van-card :title="m.goodsTitle" @click.stop="toDetail($event, m.spuId)">
              <template #thumb>
                <img v-lazy="baseImageUrl + m.skuImage" style="width:88px; height: 88px" alt="">
              </template>
              <template #price>
                <span class="goods_price">{{m.price}}円</span>
              </template>
              <template #desc>
                <div class="goods_desc_box">
                  <span class="goods_desc">{{m.skuValue}}</span>
                  <span v-if="m.goodsCashOnDelivery == 1" class="descTag">{{$t('order.cashDelivery')}}</span>
                </div>
              </template>
              <template #bottom>
                <van-stepper v-model="m.num" input-width="24px" button-size="24px" disable-input :min="1" :max="m.skuInventory" @plus="plus(m,item.storeId)" @minus="minus(m,item.storeId)" @change="changeNum(m,item.storeId)" />
              </template>
            </van-card>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isGoodsManger" class="goods_manger">
      <div @click="toggleAll">
        <van-checkbox v-model="checkedAll" checked-color="#FF5D19">{{$t('cart.chooseAll')}}</van-checkbox>
      </div>
      <div class="btn">
        <button @click="deleteGoods">{{$t('cart.del')}}</button>
      </div>
    </div>
    <van-submit-bar v-else :label="$t('cart.totle')" :class="isChangeColor?'submit-bar-true':'submit-bar'" :price="totalPrice*100" :button-text="$t('cart.Settlement')" :disabled="totalPrice===0" @submit="onSubmit">
      <div @click="toggleAll">
        <van-checkbox v-model="checkedAll" checked-color="#FF5D19">{{$t('cart.chooseAll')}}</van-checkbox>
      </div>
    </van-submit-bar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Empty from '~/components/cart/Empty'
const _some = require('lodash/some')
export default {
  name: 'Cart',
  layout: 'default',
  components: {
    Empty
  },
  data () {
    return {
      totalPrice: 0,
      indexdata: [],
      value: '',
      isGoodsManger: false,
      right_text: '管理',
      isChangeColor: false,
      cartList: [],
      checkedAll: false
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl']),
    empty () {
      if (this.cartList.length > 0) {
        return false
      } else {
        return true
      }
    }
  },
  mounted () {
    this.cartList = JSON.parse(window.sessionStorage.getItem('touristCartData')) || []
    this.cartList.forEach((item) => {
      const bool = _some(item.shopItems, ['checked', false])
      if (bool) {
        item.checked = false
      } else {
        item.checked = true
      }
    })
    this.toggleAll()
    this.setTabBarActive(3)
  },
  methods: {
    ...mapMutations(['setTabBarActive']),
    onClickRight () {
      const _this = this
      _this.isGoodsManger = !_this.isGoodsManger
      _this.isGoodsManger ? (_this.right_text = '完成') : (_this.right_text = _this.$t('newCart.manger'))
      if (!_this.isGoodsManger) {
        _this.cartList.forEach((el) => {
          if (el.checked) {
            el.shopItems.forEach((item) => {
              item.checked = el.checked
            })
          }
        })
      }
    },
    // 选择店铺
    checkShop (shop, index) {
      const _this = this
      const data = []
      const obj = {
        storeId: shop.storeId,
        skuCheckedList: []
      }
      let childObj = {
        checked: '',
        skuId: ''
      }
      _this.cartList[index].shopItems.forEach((item) => {
        item.checked = shop.checked
        if (shop.checked) {
          _this.totalPrice += item.num * item.price
        } else {
          _this.totalPrice -= item.num * item.price
        }
        childObj = {
          checked: item.checked,
          skuId: item.skuId
        }
        obj.skuCheckedList.push(childObj)
      })
      _this.checkedAll = !_some(_this.cartList, ['checked', false])
      data.push(obj)
    },
    // 选择商品
    checkGoods (shop, goods, index) {
      const _this = this
      if (goods.checked) {
        _this.totalPrice += goods.price
      } else {
        _this.totalPrice -= goods.price
      }
      const bool = _some(shop.shopItems, ['checked', false])
      _this.cartList[index].checked = !bool
      _this.checkedAll = !_some(_this.cartList, ['checked', false])
    },
    changeNum (item, storeId) {},
    // + 数量
    plus (item) {
      if (item.checked) {
        this.totalPrice += item.price
      }
    },
    // - 数量
    minus (item) {
      if (item.checked) {
        this.totalPrice -= item.price
      }
    },
    goDetail (item) {
      this.$router.push('/product/' + item.id)
      window.sessionStorage.setItem('page', 'touristCart')
    },
    toDetail ($event, id) {
      if ($event.target.nodeName !== 'BUTTON') {
        window.sessionStorage.setItem('page', 'touristCart')
        this.$router.push('/product/' + id)
      }
    },
    goStore (item) {
      this.$router.push('/store/' + item.storeId)
    },
    // 全选
    toggleAll () {
      const _this = this
      if (_this.cartList.length === 0) {
        return
      }
      _this.checkedAll = !_this.checkedAll
      _this.totalPrice = 0
      const data = []
      _this.cartList.forEach((item) => {
        const obj = {
          storeId: item.storeId,
          skuCheckedList: []
        }
        item.checked = _this.checkedAll
        item.shopItems.forEach((k) => {
          k.checked = _this.checkedAll
          if (_this.checkedAll) {
            _this.totalPrice += k.num * k.price
          } else {
            _this.totalPrice = 0
          }
          const childObj = {
            checked: _this.checkedAll,
            skuId: k.skuId
          }
          obj.skuCheckedList.push(childObj)
        })
        data.push(obj)
      })
    },
    // 删除
    deleteGoods () {
      const _this = this
      if (_this.checkedAll) {
        _this.cartList = []
        _this.checkedAll = false
      } else {
        const shopIndex = _this.cartList.findIndex((shopItem) => {
          return shopItem.checked === true
        })
        if (shopIndex > -1) {
          _this.cartList.splice(shopIndex, 1)
        }
        _this.cartList.forEach((item, index) => {
          const _goodsIndex = item.shopItems.findIndex((goodsItem) => {
            return goodsItem.checked === true
          })
          if (_goodsIndex > -1) {
            item.shopItems.splice(_goodsIndex, 1)
          }
        })
      }
      _this.totalPrice = 0
      _this.checkedAll = false
      window.sessionStorage.setItem('touristCartData', JSON.stringify(_this.cartList))
    },
    // 结算
    onSubmit () {
      const _this = this
      const checkDataList = []
      _this.cartList.forEach((item) => {
        item.shopItems.forEach((goodsItem) => {
          const checkObj = {}
          if (goodsItem.checked) {
            checkObj.num = goodsItem.num
            checkObj.shareId = goodsItem.shareId
            checkObj.skuId = goodsItem.skuId
            checkObj.skuValue = goodsItem.skuValue
            checkObj.spuId = goodsItem.spuId
            checkObj.storeId = item.storeId
            checkDataList.push(checkObj)
          }
        })
      })
      window.sessionStorage.setItem('checkTouristCartData', JSON.stringify(checkDataList))
      _this.$router.push('/shipInfo?isAdd_isBuy=1')
    }
  }
}
</script>

<style lang="less" scoped>
  .cart-container {
    width: 100%;
    height: 100vh;
    /deep/.van-nav-bar__content {
      height: 88px;
      .van-nav-bar__title {
        font-size: 36px;
        font-weight: 400;
        color: #333333;
        line-height: 88px;
      }
      .van-nav-bar__right {
        font-size: 28px;
        padding-right: 30px;
      }
    }
    /deep/.van-stepper__input {
      font-size: 24px;
    }
    /deep/.van-icon {
      font-size: 30px;
    }
    /deep/.van-checkbox__icon {
      height: auto;
    }
    /deep/.van-checkbox__label {
      font-size: 26px;
    }
    /deep/.van-button__text {
      font-size: 26px;
    }
  }
  .cart_main {
    width: 100%;
    padding-bottom: 200px;
    .cart_shop {
      width: 100%;
      background-color: #ffffff;
      padding: 0 30px;
      height: auto;
      margin-top: 20px;
      .cart_shop_title {
        width: 100%;
        height: 100px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        /deep/.van-checkbox {
          .van-checkbox__label {
            font-size: 30px;
            font-weight: 400;
            text-align: left;
            color: #333333;
            line-height: 30px;
          }
        }
        .arrow-right {
          width: 24px;
          height: 24px;
        }
      }
      .cart_shop_card {
        width: 100%;
        height: auto;
        padding-bottom: 20px;
        .sec_box {
          line-height: 34px;
          border-radius: 10px;
          background: #ff9a9a;
          color: #ff0d00;
          font-size: 26px;
          margin-left: 54px;
          padding: 4px 8px;
          margin-bottom: 10px;
        }
        .card_box {
          width: 100%;
          display: flex;
          flex-flow: row nowrap;
          justify-content: flex-start;
          .van-card {
            flex: 1;
            margin-top: 0;
            background-color: #ffffff;
            padding: 10px 17px;
            .van-card__header {
              .van-card__thumb {
                width: inherit;
                height: inherit;
              }
              .van-card__content {
                display: flex;
                flex-flow: column;
                justify-content: space-between;
                .van-card__title {
                  font-size: 26px;
                  font-weight: 400;
                  color: #333333;
                  line-height: 37px;
                  max-height: inherit;
                }
                .goods_desc_box {
                  height: auto;
                  line-height: 30px;
                  padding: 10px 0px 10px;
                  .goods_desc {
                    background-color: #f4f4f4;
                    border-radius: 6px;
                    padding: 8px 20px;
                    font-size: 22px;
                    line-height: 30px;
                  }
                  .descTag {
                    width: 116px;
                    height: 48px;
                    background: #ffdfdf;
                    border: 1px solid #ff1f1f;
                    border-radius: 4px;
                    padding: 4px 5px;
                    font-size: 26px;
                    font-weight: 400;
                    color: #ff0000;
                    line-height: 48px;
                    text-align: center;
                  }
                }
                .van-card__bottom {
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  align-items: center;
                  .van-card__price {
                    .goods_price {
                      font-size: 32px;
                      font-weight: 600;
                      color: #ff5d19;
                      line-height: 45px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .store-recommend {
    width: 100%;
    padding-bottom: 98px;
    .recommend-header {
      width: 100%;
      height: 110px;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 32px;
        font-weight: 600;
        color: #333333;
        line-height: 45px;
        padding: 0 20px;
      }
    }
    .recommend-goodslist {
      width: 100%;
      padding: 0 20px;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      .recommend-goods {
        width: 345px;
        height: 494px;
        display: flex;
        flex-flow: column nowrap;
        align-items: flex-start;
        justify-content: flex-start;
        background-color: #ffffff;
        margin-bottom: 20px;
        border-radius: 10px;
        position: relative;
        .seckillIcon {
          position: absolute;
          left: -10px;
          top: -6px;
          width: 150px;
          height: 50px;
          img {
            width: 150px;
            height: 50px;
          }
        }
        .goods-img {
          width: 345px;
          height: 345px;
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
        }
        .goods-title {
          font-size: 28px;
          font-weight: 400;
          text-align: left;
          color: #333333;
          line-height: 40px;
          padding: 20px;
          width: 100%;
        }
        .price {
          padding-left: 20px;
          .price-origin {
            font-size: 40px;
            font-weight: 700;
            color: #ff5d19;
            line-height: 47px;
          }
          .price-origin::after {
            content: '円';
            color: #ff5d19;
            font-size: 26px;
          }
        }
        .line-price {
          padding-left: 20px;
          text-decoration: line-through;
          color: #999999;
          .price-line {
            font-size: 22px;
            font-weight: 700;
            line-height: 47px;
          }
          .price-line::after {
            content: '円';
            font-size: 22px;
          }
        }
      }
    }
  }
  .goods_manger {
    position: fixed;
    bottom: 98px;
    left: 0px;
    width: 100%;
    height: 98px;
    background-color: #ffffff;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    .btn {
      button {
        background: #fff;
        height: 52px;
        border: 1px solid #cccccc;
        border-radius: 32px;
        color: #333333;
        line-height: 37px;
        font-size: 28px;
      }
    }
  }
  .van-submit-bar {
    bottom: 98px;
    .van-submit-bar__bar {
      height: 98px;
      padding: 0;
      .van-checkbox {
        padding-left: 20px;
        .van-checkbox__label {
          font-size: 26px;
          font-weight: 400;
          color: #999999;
          line-height: 37px;
        }
      }
      .van-submit-bar__text {
        font-size: 26px;
        font-weight: 500;
        color: #333333;
        line-height: 37px;
        .van-submit-bar__price {
          color: #ff5d19;
          font-weight: 500;
          font-size: 24px;
          .van-submit-bar__price--integer {
            font-size: 36px;
          }
        }
      }
      .van-submit-bar__button {
        width: 225px;
        height: 98px;
        border-radius: 0;
      }
      .van-button--disabled {
        background: #999999;
      }
    }
  }
</style>
