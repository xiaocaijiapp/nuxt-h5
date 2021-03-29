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
          <img class="arrow-right" src="~/assets/images/cart/carts.png" alt="" @click="goStore(item)">
        </div>
        <div v-for="(m,k) in item.shopItems" :key="k" class="cart_shop_card">
          <span v-if="m.isSeckill" class="sec_box">
            {{$t('newCart.seckill')}}
          </span>
          <div class="card_box">
            <van-checkbox v-model="m.checked" checked-color="#FF5D19" @click.prevent="checkGoods(item,m,index)"></van-checkbox>
            <van-card :title="m.goodsTitle" @click.stop="toDetail($event, m.spuId)">
              <template #thumb>
                <img v-lazy="baseImageUrl + m.skuImage" style="width:88px; height:88px" alt="">
              </template>
              <template #price>
                <span class="goods_price">{{m.price}}円</span>
              </template>
              <template #desc>
                <div class="goods_desc_box">
                  <span class="goods_desc">{{m.skuValue}}</span>
                  <span v-if="((CODSTORE == 2 || CODSTORE == item.storeType) && m.goodsCashOnDelivery == 1)" class="descTag">{{$t('order.cashDelivery')}}</span>
                </div>
              </template>
              <template #bottom>
                <van-stepper v-model="m.num" input-width="24px" button-size="24px" disable-input :min="1" @change="changeNum(m,item.storeId)" />
              </template>
            </van-card>
          </div>
        </div>
      </div>
    </div>
    <!--  失效商品-->
    <InvalidGoods v-if="invalidList.length > 0" :list="invalidList"></InvalidGoods>
    <!--  店铺推荐-->
    <div v-if="reCommandList.length > 0" class="store-recommend">
      <div class="recommend-header">
        <van-icon :name="require(`assets/images/user/zhuangshi.png`)" />
        <span>{{$t('newEmpty.recomond')}}</span>
        <van-icon :name="require(`assets/images/user/zhuangshi.png`)" />
      </div>
      <div class="recommend-goodslist">
        <div v-for="(item,index) in reCommandList" :key="index" class="recommend-goods" @click="goDetail(item)">
          <div v-if="item.flashSaleActivityStates == 1" class="seckillIcon">
            <img src="~/assets/images/icon/miaoshaicon.png" alt="">
          </div>
          <img class="goods-img" v-lazy="baseImageUrl + item.goodsSearchImage+'?x-oss-process=image/resize,w_1000/format,webp'" />
          <p class="van-ellipsis goods-title">{{item.goodsTitle}}</p>
          <div class="price">
            <span class="price-origin">{{item.price}}</span>
          </div>
          <div v-if="item.flashSaleActivityStates == 1 || item.discountActivityStates == 1" class="line-price">
            <span class="price-line">{{item.marketPrice}}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="isGoodsManger" class="goods_manger">
      <div @click="toggleAll">
        <van-checkbox v-model="checkedAll" checked-color="#FF5D19">{{$t('cart.chooseAll')}}</van-checkbox>
      </div>
      <div class="btn">
        <button @click="moveToFavorites">{{$t('newCart.moveToFavorites')}}</button>
        <button @click="deleteGoods">{{$t('cart.del')}}</button>
      </div>
    </div>
    <van-submit-bar v-else :label="$t('cart.totle')" :class="isChangeColor?'submit-bar-true':'submit-bar'" :price="totalPrice*100" :button-text="$t('cart.Settlement')" :disabled="!isChangeColor" @submit="onSubmit">
      <div @click="toggleAll">
        <van-checkbox v-model="checkedAll" checked-color="#FF5D19">{{$t('cart.chooseAll')}}</van-checkbox>
      </div>
    </van-submit-bar>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { Dialog } from 'vant'
import Empty from '~/components/cart/Empty'
import InvalidGoods from '~/components/cart/InvalidGoods'
import api from '~/static/api'
import { timeDiff } from '~/util/tools'
const _remove = require('lodash/remove')
const _some = require('lodash/some')
export default {
  name: 'Cart',
  layout: 'default',
  components: {
    Empty,
    InvalidGoods
  },
  async asyncData ({ $axios }) {
    let cartList = [] // 购物车数据
    const invalidList = [] // 失效的商品
    let reCommandList = []; let pageNo; let totalPage; let totalRows; let checkedAll
    const COD_FEE = await $axios.get(api.system.dictionaries, { params: { groupCode: 'PAY_SETTING', code: 'COD_FEE' } })
    const COD_STORE = await $axios.get(api.system.dictionaries, { params: { groupCode: 'PAY_SETTING', code: 'COD_STORE' } })
    await $axios.get(api.cart.initCart).then((res) => {
      if (res.code === 200) {
        cartList = res.data
        console.log('cartList---------------', cartList)
      }
    })
    cartList.forEach((item) => {
      const closePro = _remove(item.shopItems, n => !n.invalid) // 失效的商品拿出来
      item.shopItems.forEach((childitem) => {
        // 如果有秒杀
        if (childitem.flashSaleActivityDto) {
          childitem.isSeckill = true
          const endDate = childitem.flashSaleActivityDto.endDate.split(' ')[0] + ' ' + childitem.flashSaleActivityDto.endTime
          childitem.time = timeDiff(endDate, childitem.flashSaleActivityDto.nowtimes)
          childitem.price = Math.round(childitem.price - (childitem.price * childitem.flashSaleActivityDto.discount) / 100)
        } else if (childitem.discountActivityToDetailDto) {
          childitem.price = Math.round(childitem.price - (childitem.price * childitem.discountActivityToDetailDto.rate) / 100)
        }
      })
      invalidList.push(...closePro)
    })
    cartList = _remove(cartList, n => n.shopItems.length !== 0) // 去除没有商品的店铺
    cartList.forEach((item) => {
      const bool = _some(item.shopItems, ['checked', false])
      if (bool) {
        item.checked = false
      } else {
        item.checked = true
      }
    })
    if (_some(cartList, ['checked', false])) {
      checkedAll = false
    } else if (cartList.length > 0) {
      checkedAll = true
    } else {
      checkedAll = false
    }
    // 店铺推荐商品
    await $axios.post(api.store.goods, {
      categoryId: '',
      exclude: [],
      firstCategoryId: '',
      firstStoreCategoryId: '',
      keyword: '',
      pageNo: 1,
      pageSize: 30,
      secCategoryId: '',
      sortOrder: (new Date().getTime() / 1000) - [1, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000][Math.floor(Math.random() * 10)],
      sorted: 6,
      specValueList: [],
      storeCateId: '',
      storeId: '',
      showFavorite: 1,
      listType: 2
    }).then((res) => {
      if (res.code === 200) {
        pageNo = res.data.pageNo
        totalPage = res.data.totalPage
        totalRows = res.data.totalRows
        reCommandList = res.data.rows.map((item) => {
          if (item.flashSaleActivityStates === 1) {
            item.price = Math.round(item.marketPrice - (item.marketPrice * item.flashSaleActivitys[0].discount) / 100)
          } else if (item.discountActivityStates === 1) {
            item.price = Math.round(item.marketPrice - (item.marketPrice * item.discountActivitys[0].rate) / 100)
          } else {
            item.price = item.marketPrice
          }
          return item
        })
      }
    })
    return {
      CODFEE: COD_FEE.data,
      CODSTORE: COD_STORE.data,
      cartList,
      invalidList,
      reCommandList,
      pageNo,
      totalPage,
      totalRows,
      checkedAll
    }
  },
  data () {
    return {
      totalPrice: 0,
      indexdata: [],
      value: '',
      isGoodsManger: false,
      right_text: '管理',
      isChangeColor: false
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
  created () {
    this.computePrice()
  },
  mounted () {
    this.setTabBarActive(3)
  },
  methods: {
    ...mapMutations(['SET_ORDERINFO', 'setTabBarActive']),
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
    goStop () { },
    async checkShop (shop, index) {
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
        childObj = {
          checked: item.checked,
          skuId: item.skuId
        }
        obj.skuCheckedList.push(childObj)
      })
      _this.checkedAll = !_some(_this.cartList, ['checked', false])
      data.push(obj)
      await _this.$axios.put(api.cart.checked, data)
      await _this.computePrice()
    },
    async changeNum (item, storeId) {
      event.stopPropagation()
      const _this = this
      const data = {
        num: item.num,
        skuId: item.skuId,
        skuValue: item.skuValue,
        spuId: item.spuId,
        storeId
      }
      await _this.$axios.put(api.cart.changeNum, data).then((res) => {
        if (res.code === 200) { _this.computePrice() }
      }).catch((err) => {
        this.$toast(err.message)
      })
    },
    goDetail (item) {
      this.$router.push('/product/' + item.id)
    },
    toDetail ($event, id) {
      if ($event.target.nodeName !== 'BUTTON') {
        window.sessionStorage.setItem('page', 'shoppingcart')
        this.$router.push('/product/' + id)
      }
    },
    goStore (item) {
      this.$router.push('/store/' + item.storeId)
    },
    computePrice () {
      const _this = this
      try {
        if (_this.isGoodsManger) {
          return
        } else {
          _this.$axios.get(api.cart.shopCartCheckCalc).then((res) => {
            if (res.code === 200) {
              if (res.data.totalAmount > 0) {
                _this.isChangeColor = true
              } else {
                _this.isChangeColor = false
              }
              _this.totalPrice = res.data.totalAmount
            }
          }).catch((err) => {
            this.$toast(err.message)
          })
        }
      } catch (error) {
        if (error.data.code === 500) {
          _this.$toast(error.data.message)
          _this.toggleAll()
        }
      }
    },
    async toggleAll () {
      const _this = this
      _this.checkedAll = !_this.checkedAll
      const data = []
      _this.cartList.forEach((item) => {
        const obj = {
          storeId: item.storeId,
          skuCheckedList: []
        }
        item.checked = _this.checkedAll
        item.shopItems.forEach((k) => {
          k.checked = _this.checkedAll
          const childObj = {
            checked: _this.checkedAll,
            skuId: k.skuId
          }
          obj.skuCheckedList.push(childObj)
        })
        data.push(obj)
      })
      await _this.$axios.put(api.cart.checked, data)
      await _this.computePrice()
    },
    checkGoods (shop, goods, index) {
      const _this = this
      const data = [
        {
          skuCheckedList: [
            {
              checked: goods.checked,
              skuId: goods.skuId
            }
          ],
          storeId: shop.storeId
        }
      ]
      const bool = _some(shop.shopItems, ['checked', false])
      _this.cartList[index].checked = !bool
      _this.checkedAll = !_some(_this.cartList, ['checked', false])
      _this.$axios.put(api.cart.checked, data).then((res) => {
        if (res.code === 200) {
          _this.computePrice()
        }
      })
    },
    moveToFavorites () {
      const _this = this
      const data = {
        skuIdList: [],
        spuIdList: []
      }
      const list = []
      _this.cartList.map((item) => {
        item.shopItems.map((childItem) => {
          list.push(childItem.checked)
          if (childItem.checked) {
            data.skuIdList.push(childItem.skuId)
            data.spuIdList.push(childItem.spuId)
          }
        })
      })
      if (list.includes(true)) {
        _this.$axios.post(api.cart.moveToFavorites, data).then((res) => {
          if (res.code === 200) {
            _this.$toast(_this.$t('like.add'))
            _this.$router.go(0)
          }
        })
      } else {
        _this.$toast(_this.$t('newCart.checkGoods'))
      }
    },
    deleteGoods () {
      const _this = this
      const data = []
      const list = []
      console.log('_this.cartList', _this.cartList)
      _this.cartList.forEach((item) => {
        const skuids = []
        item.shopItems.forEach((childItem) => {
          list.push(childItem.checked)
          if (childItem.checked) {
            skuids.push(childItem.skuId)
          }
        })
        if (skuids.length > 0) {
          data.push({
            skuIdList: skuids,
            storeId: item.storeId
          })
        }
      })
      if (list.includes(true)) {
        _this.$dialog
          .confirm({
            message: _this.$t('newCart.isDel'),
            className: 'dialog',
            confirmButtonColor: '#333333'
          })
          .then(() => {
            _this.$axios.post(api.cart.deleteGoods, data).then((res) => {
              if (res.code === 200) {
                location.href = '/shoppingcart'
              }
            })
          })
      } else {
        _this.$toast(_this.$t('newCart.checkGoods'))
      }
    },
    async onSubmit () {
      const _this = this
      // 判断是否包含货到付款数据
      await _this.$axios.post(api.cart.submitOrder).then((res) => {
        if (res.code === 200) {
          console.log('res.data', res.data)
          const arr = [] // 是否支持货到付款
          const { groups } = res.data
          if (this.CODSTORE * 1 === 2) {
            // 所有店铺都支持货到付款  判断商品中是否含有货到付款
            groups.forEach((product) => {
              product.tradeItems.forEach((trade) => {
                if (trade.item.goodsCashOnDelivery === 1) {
                  arr.push(true)
                } else {
                  arr.push(false)
                }
              })
            })
          } else {
            groups.forEach((product) => {
              if (product.storeType === this.CODSTORE * 1) {
                product.tradeItems.forEach((trade) => {
                  if (trade.item.goodsCashOnDelivery === 1) {
                    arr.push(true)
                  } else {
                    arr.push(false)
                  }
                })
              } else {
                arr.push(false)
              }
            })
          }
          // 购物车提交数据是否有支持货到付款数据
          if (arr.includes(true) && arr.includes(false)) { // 有支持货到付款数据
            Dialog.confirm({
              message: this.$t('cart.dialogmsg'),
              confirmButtonText: this.$t('cart.goonbuy'),
              cancelButtonText: this.$t('cart.closebuy'),
              confirmButtonColor: '#ff5d19',
              theme: 'round'
            }).then(() => {
              const orderInfo = {
                shopType: 1,
                data: res.data
              }
              _this.SET_ORDERINFO(orderInfo)
              this.$router.push('/placeorder')
            })
          } else {
            const orderInfo = {
              shopType: 1,
              data: res.data
            }
            _this.SET_ORDERINFO(orderInfo)
            // 没有货到付款数据正常跳转
            this.$router.push('/placeorder')
          }
        }
      })
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
