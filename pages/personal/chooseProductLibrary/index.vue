<template>
  <div class="goodsContainer">
    <van-sticky>
      <van-nav-bar
        :title="$t('newThreeClass.goodsList')"
        :right-text="isBatchAddFalg ? $t('distribution.cancel') : $t('distribution.batchAdd')"
        placeholder
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
        <template #left>
          <van-icon name="arrow-left" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <van-tabs @change="changeTabs" :ellipsis="false">
      <van-tab v-for="(item, index) in categoryList" :key="index" :title="item.category" :name="item.id" ></van-tab>
    </van-tabs>
    <div class="tabbox">
      <div @click="shareHandle">
        <span>{{$t('newThreeClass.shareNum')}}</span>
        <span>
             <van-icon name="arrow-up" :class="iconActive1===0 ? 'active' : ''"  @click.stop="shareIconHandle(0)"/>
             <van-icon name="arrow-down" :class="iconActive1===1 ? 'active' : ''" @click.stop="shareIconHandle(1)"/>
          </span>
      </div>
      <div @click="integralHandle">
        <span>{{$t('index.p2')}}</span>
        <span>
              <van-icon name="arrow-up" :class="iconActive2===0 ? 'active' : ''" @click.stop="integralIconHandle(0)"/>
             <van-icon name="arrow-down" :class="iconActive2===1 ? 'active' : ''" @click.stop="integralIconHandle(1)"/>
          </span>
      </div>
    </div>
    <div v-if="platformList.length > 0">
      <van-list
        v-model="loading"
        :loading-text="$t('supply.loadding')"
        :finished="finished"
        :finished-text="$t('threeClass.finished')"
        @load="onLoad"
      >
        <div class="content">
          <div v-for="(item, index) in platformList" :key="index" class="goods-item" @click="goToGoodsDetail(item.goodsId, 1)">
            <div class="imgbox">
              <img v-lazy="baseImageUrl + item.goodsImage" />
            </div>
            <div class="title">{{item.goodsTitle}}</div>
            <div class="price">
              <span>{{item.marketPrice}}</span>
              <span>円</span>
            </div>
            <!-- <div class="button" @click.stop="goToShare(item.goodsId, 1, ((item.marketPrice * ratio)/100).toFixed(0))">{{$t('newThreeClass.gainIntegral').replace('N', ((item.marketPrice * ratio)/100).toFixed(0))}}</div>-->
            <!-- <div class="button">{{$t('newThreeClass.gainIntegral').replace('N', ((item.marketPrice * ratio)/100).toFixed(0))}}</div>-->
            <div class="buttonBox">
              <div class="button">{{$t('share.friends')}}</div>
              <div class="van-con" v-if="isBatchAddFalg" @click.stop="batchSelectGoods(item, index)">
                <van-checkbox v-model="item.checked" checked-color="#FF5D19" :disabled="item.isChosen===1"></van-checkbox>
              </div>
              <div class="van-con" v-else>
                <van-icon name="add-o" :class="item.isChosen===0 ? 'active' : 'no-active'" @click.stop="singleAddGoods(item, index)"/>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <div v-else style="text-align:center;height:100vh;padding-top:100px;background-color:#fff;">
      <img style="width:120px;height:120px;" src="@/assets/images/empty/wushuju.png"/>
      <p style="font-size: 16px">{{$t('newUserInfo.error_msg1')}}</p>
    </div>
    <div class="footerButn" v-if="isBatchAddFalg">
      <div class="button" @click="batchAddGoods">{{$t('distribution.add')}}</div>
    </div>
  </div>
</template>

<script>
import api from '@/static/api'
import { mapGetters } from 'vuex'
export default {
  name: 'Index',
  layout: 'content',
  data () {
    return {
      params: {
        pageNo: 1,
        pageSize: 10,
        firstCategoryId: '',
        sorted: '',
        sortOrder: '',
        type: 0
      },
      activeTab: '',
      platformList: [],
      loading: true,
      finished: false,
      ratio: 0,
      iconActive1: -1,
      iconActive2: -1,
      categoryList: [],
      isBatchAddFalg: false,
      goodsIdList: [],
      shareIdList: [],
      checked: false
    }
  },
  computed: {
    ...mapGetters({
      baseImageUrl: 'baseImageUrl',
      userInfo: 'userInfo'
    })
  },
  mounted () {
    this.queryShareBeLongCate()
    this.getPlatformRecom()
    this.queryDictionaries()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/personal/distributionCenter')
    },
    // 批量添加按钮
    onClickRight () {
      this.isBatchAddFalg = !this.isBatchAddFalg
      if (!this.isBatchAddFalg) {
        if (this.platformList && this.platformList.length) {
          this.platformList.forEach((item) => {
            if (item.isChosen) {
              this.$set(item, 'checked', true)
            } else {
              this.$set(item, 'checked', false)
            }
          })
        }
      }
    },
    // 单个添加商品
    singleAddGoods (item, index) {
      const _this = this
      _this.goodsIdList = []
      _this.goodsIdList.push(item.goodsId)
      if (!item.isChosen) {
        _this.$axios.put(api.distribution.chooseGoods, { goodsIdList: _this.goodsIdList }).then((res) => {
          if (res.code === 200) {
            _this.$toast.success(_this.$t('like.add'))
            _this.params.pageNo = 1
            _this.loading = true
            _this.finished = false
            _this.platformList = []
            this.getPlatformRecom()
          }
        })
      }
    },
    // 批量勾选商品
    batchSelectGoods (item, index) {
      if (!item.isChosen) {
        this.platformList.forEach((obj, i) => {
          if (i === index) {
            obj.checked = !obj.checked
          }
        })
        if (item.checked) {
          this.goodsIdList.push(this.platformList[index].goodsId)
        }
        if (!item.checked) {
          const _index = this.goodsIdList.findIndex((goodsId) => {
            return goodsId === item.goodsId
          })
          if (_index > -1) {
            this.goodsIdList.splice(_index, 1)
          }
        }
      }
    },
    // 批量添加
    batchAddGoods () {
      this.$axios.put(api.distribution.chooseGoods, { goodsIdList: this.goodsIdList }).then((res) => {
        if (res.code === 200) {
          this.$toast.success(this.$t('like.add'))
          this.params.pageNo = 1
          this.loading = true
          this.finished = false
          this.platformList = []
          this.getPlatformRecom()
        }
      })
    },
    // 分类切换
    changeTabs (id, title) {
      this.platformList = []
      this.params.pageNo = 1
      this.loading = true
      this.finished = false
      if (id === '') {
        this.iconActive1 = -1
        this.iconActive2 = -1
        this.params.firstCategoryId = ''
        this.params.sorted = ''
        this.params.sortOrder = ''
      } else {
        this.params.firstCategoryId = id
      }
      this.getPlatformRecom()
    },
    // 分享次数
    shareHandle () {
      this.platformList = []
      this.params.pageNo = 1
      this.loading = true
      this.finished = false
      this.iconActive1 = 0
      this.iconActive2 = -1
      this.params.sorted = 3
      this.params.sortOrder = 'asc'
      this.getPlatformRecom()
    },
    // 分享图标
    shareIconHandle (num) {
      this.platformList = []
      this.params.pageNo = 1
      this.loading = true
      this.finished = false
      this.iconActive1 = num
      this.iconActive2 = -1
      this.params.sorted = 3
      this.params.sortOrder = num === 0 ? 'asc' : 'desc'
      this.getPlatformRecom()
    },
    // 积分
    integralHandle () {
      this.platformList = []
      this.params.pageNo = 1
      this.loading = true
      this.finished = false
      this.iconActive1 = -1
      this.iconActive2 = 0
      this.params.sorted = 2
      this.params.sortOrder = 'asc'
      this.getPlatformRecom()
    },
    // 积分图标
    integralIconHandle (num) {
      this.platformList = []
      this.params.pageNo = 1
      this.loading = true
      this.finished = false
      this.iconActive1 = -1
      this.iconActive2 = num
      this.params.sorted = 2
      this.params.sortOrder = num === 0 ? 'asc' : 'desc'
      this.getPlatformRecom()
    },
    goToGoodsDetail (goodsId, fromFlag) {
      this.$router.push('/product/' + goodsId + '?fromFlag=' + fromFlag + '&storeUserId=' + this.userInfo.id + '&isFrom=1')
      window.sessionStorage.setItem('page', 'chooseProductLibrary')
    },
    goToShare (goodsId, fromFlag, integral) {
      this.$router.push('/personal/sharegoods?goodsId=' + goodsId + '&fromFlag=' + fromFlag + '&integral=' + integral)
    },
    // 获取平台推荐所属1级分类
    queryShareBeLongCate () {
      const _this = this
      _this.$axios.get(api.goods.shareBeLongCate).then((res) => {
        if (res.code === 200) {
          _this.categoryList.push({ category: this.$t('store.all'), id: '' }, ...res.data)
        }
      })
    },
    onLoad () {
      // 异步更新数据
      const _this = this
      setTimeout(() => {
        // 加载状态结束
        _this.params.pageNo++
        _this.getPlatformRecom()
      }, 1000)
    },
    // 平台推荐商品
    getPlatformRecom () {
      const _this = this
      _this.$axios.post(api.goods.platform, _this.params).then((res) => {
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            _this.platformList = _this.platformList.concat(res.data.rows || [])
            _this.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            _this.platformList = _this.platformList.concat(res.data.rows || [])
            _this.loading = false
          } else {
            _this.platformList = _this.platformList.concat(res.data.rows || [])
          }
        }
        if (_this.platformList && _this.platformList.length) {
          _this.platformList.forEach((item) => {
            if (item.isChosen) {
              this.$set(item, 'checked', true)
            } else {
              this.$set(item, 'checked', false)
            }
          })
        }
      })
    },
    // 字典查询-分享商品返积分:订单积分比例
    queryDictionaries () {
      const code = 'SHARE_GOODS_RECEIVE_INTEGRAL'
      const groupCode = 'INTEGRAL_SETTING'
      this.$axios.get(api.dictionary.integralPro, { params: { code, groupCode } }).then((res) => {
        if (res.code === 200) {
          this.ratio = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  /deep/.van-nav-bar__content {
    height: 88px;
    line-height: 88px;
  }
  /deep/.van-nav-bar__title {
    font-size: 32px;
    color: #333333;
  }
  /deep/.van-nav-bar__text {
    font-size: 32px;
    color: #FF5D19  ;
  }
  /deep/.van-icon-arrow-left {
    color: #999;
    font-size: 36px!important;
  }
  /deep/.van-tabs__wrap {
    height: 80px!important;
  }
  /deep/.van-tab__text {
    font-size: 32px;
    line-height: 40px;
  }
  /deep/.van-loading__text {
    color: #969799;
    font-size: 24px!important;
    line-height: 80px!important;
    text-align: center;
  }
  /deep/.van-list__finished-text {
    color: #969799;
    font-size: 24px!important;
    line-height: 80px!important;
    text-align: center;
  }
  /deep/.van-tabs__line {
    bottom: 0px;
    width: 46px;
    height: 20px;
    background-color: #ff5d19;
  }
  /deep/.van-tab--active {
    color: #ff5d19;
  }
  /deep/.van-icon {
    font-size: 16px;
    &.active {
      color: #ff5d19;
      font-weight: 600;
    }
  }
  .goodsContainer {
    .tabbox {
      height: 80px;
      display: flex;
      background: #fff;
      justify-content: space-around;
      align-items: center;
      border-top: 1px solid #E5E5E5;
      >div {
        display: flex;
        align-items: center;
        span:nth-of-type(1) {
          font-size: 28px;
          color: #666666;
          text-decoration: underline;
          margin-right: 10px;
        }
        span:nth-of-type(2) {
          display: flex;
          flex-flow: column;
        }
      }
    }
    .content {
      display: flex;
      flex-flow: row;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 20px;
      .goods-item {
        width: 345px;
        height: 570px;
        margin-top: 28px;
        border-radius: 10px;
        background: #fff;
        .imgbox {
          width: 345px;
          height: 345px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .title {
          width: 309px;
          font-size: 28px;
          color: #333333;
          padding: 25px 0;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          margin: 0 auto;
        }
        .price {
          width: 309px;
          padding-bottom: 25px;
          margin: 0 auto;
          span:nth-of-type(1) {
            font-size: 40px;
            color: #FF5D19;
            font-weight: 700;
          }
          span:nth-of-type(2) {
            font-size: 22px;
            color: #FF5D19;
          }
          span:nth-of-type(3) {
            font-size: 22px;
            color: #999999;
            text-decoration: line-through;
            margin-left: 10px;
          }
        }
        .buttonBox {
          display: flex;
          justify-content: space-around;
          align-items: center;
          .button {
            width: 200px;
            height: 52px;
            border-radius: 26px;
            text-align: center;
            line-height: 52px;
            color: #ffffff;
            font-size: 22px;
            background: linear-gradient(to right, #FFA14B, #FF5E1A);
          }
          .van-con {
            width: 40px;
            height: 40px;
            /deep/.van-icon {
              font-size: 40px;
              &.active {
                color: #FF5D19;
              }
              &.no-active {
                color: #333333;
              }
            }
            /deep/.van-checkbox {
              overflow: visible;
            }
            /deep/.van-checkbox__icon .van-icon {
              width: 42px;
              height: 42px;
              line-height: 42px;
            }
            /*/deep/.van-icon-passed {*/
            /*  color: #FF5D19;*/
            /*}*/
          }
        }
      }
      .goods-item:nth-of-type(1),.goods-item:nth-of-type(2) {
        margin-top: 0;
      }
    }
    .footerButn {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #fff;
      padding: 20px 0;
      position: fixed;
      bottom: 0;
      .button {
        width: 340px;
        height: 78px;
        text-align: center;
        font-size: 28px;
        color: #fff;
        border-radius: 39px;
        line-height: 78px;
        background: linear-gradient(to right, #FFA14B, #FF5E1A);
      }
    }
  }
</style>
