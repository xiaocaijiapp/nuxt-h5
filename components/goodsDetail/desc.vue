<!---->
<template>
  <div class="footer">
    <van-tabs v-model="active" line-width="50px" color="#FF5D19">
      <van-tab
        :title="$t('supply.goodsdetail')"
        title-style="font-size:16px;

font-weight:500;
color:rgba(51,51,51,1);

"
      >
        <div class="goodsDesc">{{desc}}</div>
        <van-image
          v-for="item in list"
          :key="item"
          width="100%"
          height="100%"
          lazy-load
          :loading-icon="require('assets/images/loading/load.png')"
          :error-icon="require('assets/images/loading/load.png')"
          v-lazy="$imgHead+item"
        />
      </van-tab>
      <!-- <van-tab
        title="常见问题"
        title-style="font-size:16px;
font-family:PingFangSC-Medium,PingFang SC;
font-weight:500;
color:rgba(51,51,51,1);
margin-right:50px;
"
      >内容 2</van-tab>-->
    </van-tabs>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['list', 'desc'],
  data() {
    return {
      active: 0,
    }
  },
  created() {},
  methods: {},
}
</script>

<style lang="less" scoped>
.footer {
  margin-top: 10px;
  width: 100%;
  background: #fff;
  margin-bottom: 60px;
}
.goodsDesc {
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  font-size: 16px;
}
</style>
