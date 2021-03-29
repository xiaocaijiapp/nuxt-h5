<!---->
<template>
  <div class="goods_evaluate">
    <div class="goods_evaluate_header">
      <div>{{$t('goodsdetail.goodsrate')}}{{'('+evaluateNum+')'}}</div>
      <div @click="goEvaluate">
        {{$t('newUserInfo.viewAll')}}
        <van-icon name="arrow" color="#999" />
      </div>
    </div>
    <van-empty
      :image="require('assets/images/cart/nodata.png')"
      :description="$t('newEmpty.empty_1')"
      v-if="list.length  < 1"
    />
    <div v-else class="goods_evaluate_main">
      <div class="goods_evaluate_main_item" v-for="item in list" :key="item.id">
        <div>
          <div class="evaluate_user_info">
            <van-image
              round
              width="20"
              height="22"
              :loading-icon="require('assets/images/loading/load.png')"
              :error-icon="require('assets/images/loading/load.png')"
              lazy-load
              v-lazy="$imgHead+item.userHeardImg"
            />
            <span>{{item.userName}}</span>
          </div>
          <div
            class="van-multi-ellipsis--l3 evaluate_user_desc"
          >{{item.commentContent}}</div>
        </div>

        <div v-if="item.commentImgs&&item.commentImgs.length>0">
          <van-image
            width="110"
            height="110"
            fit="cover"
            v-for="i in item.commentImgs.slice(0,1)"
            :key="i.id"
            :loading-icon="require('assets/images/loading/load.png')"
            :error-icon="require('assets/images/loading/load.png')"
            lazy-load
            v-lazy="$imgHead+i.imgUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  components: {},
  props: ['spuId', 'evaluateNum', 'list'],
  data() {
    return {
      current: 0
    }
  },
  watch: {
    list(val) {
      console.log('------商品评价---------', val)
    }
  },
  created() {},
  methods: {
    goEvaluate() {
      let that = this
      this.$router.push('/goodsEvaluate/' + that.spuId)
      // window.location.href = `/goods-evaluate/${that.spuId}`
    }
  }
}
</script>

<style   scoped>
.goods_evaluate {
  width: 100%;
  background: #fff;
  margin-top: 10px;
  padding-bottom: 15px;
}

.goods_evaluate .goods_evaluate_header {
  display: flex;
  justify-content: space-between;
  padding: 15px;
}

.goods_evaluate .goods_evaluate_header div:first-child {
  font-size: 16px;
  font-weight: 600;
  color: rgba(51, 51, 51, 1);
}

.goods_evaluate .goods_evaluate_header div:last-child {
  font-size: 14px;

  font-weight: 400;
  color: rgba(102, 102, 102, 1);
  display: flex;
  align-items: center;
}

.goods_evaluate .goods_evaluate_header div:last-child i {
  margin-left: 10px;
}

.goods_evaluate_main_item {
  width: 270px;
  height: 118px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 5px;
  border: 1px solid rgba(226, 226, 226, 1);
  margin-left: 15px;
  background: #fafafa;
}

.goods_evaluate_main_item div:first-child {
  font-size: 14px;

  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  flex-basis: 56%;
}

.goods_evaluate_main_item .evaluate_user_info {
  height: 30px;
  line-height: 30px;
  padding-bottom: 5px;
  vertical-align: middle;
  padding: 5px;
  background: #fafafa;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.goods_evaluate_main_item .evaluate_user_info span {
  font-size: 12px;
  min-width: 118px;
  font-weight: 400;
  margin-left: 5px;
  color: rgba(51, 51, 51, 1);
}

.evaluate_user_info div:first-child {
  padding-top: 5px;
  width: 20px;
}

.evaluate_user_desc {
  font-size: 14px;
  height: 50px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 20px;
  padding: 5px;
  background: #fafafa;
}

.goods_evaluate_main {
  display: flex;
  flex-wrap: nowrap;
  overflow: auto;
}
</style>
