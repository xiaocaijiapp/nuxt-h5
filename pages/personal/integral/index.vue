<template>
    <div>
        <van-nav-bar :title="$t('user_info.integraldetail')" placeholder  @click-left="onClickLeft">
            <template #left>
                <van-icon name="arrow-left" color="#666666" />
            </template>
        </van-nav-bar>
        <NoData  v-if="isShowEmpty"></NoData>
        <van-list v-else v-model="loading" :loading-text="$t('supply.loadding')" :finished-text="$t('threeClass.finished')" :finished="finished" @load="onLoad">
            <div class="list-main">
                <div v-for="(item,index) in list" :key="index" class="main-item">
                    <div class="item-detailType">
                        <span class="detailType-l">{{$i18n.locale == 'cn' ? item.des.split('|')[0] : item.des.split('|')[1]}}</span>
                        <span class="detailType-r">{{(item.preIntegral - item.curIntegral) > 0 ? '-' + item.integralNum : '+' + item.integralNum}}</span>
                    </div>
                    <div class="item-createTime">{{item.createTime.split(' ')[0]}}</div>
                    <div class="item-id">
                        <span class="id-title">{{$t('newOrder.number')}}</span>
                        <span class="id-no">{{item.businessNo}}</span>
                    </div>
                </div>
            </div>
        </van-list>
    </div>
</template>

<script>
import NoData from '~/components/empty/template_four'
export default {
  components: {
    NoData
  },
  data () {
    return {
      isShowEmpty: false,
      list: [],
      finished: false,
      loading: false,
      pageNo: 0,
      pageSize: 20,
      timer: null
    }
  },
  mounted () {
    document.getElementsByTagName('body')[0].style.backgroundColor = '#f4f4f4'
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    async init () {
      try {
        const res = await this.$axios.post(`starday-integral/integral/detail/userId/list/10/${this.pageNo}`, {})
        if (res.code === 200) {
          if (res.data.rows.length < res.data.pageSize) {
            this.list = this.list.concat(res.data.rows)
            this.finished = true
          } else if (res.data.rows.length === res.data.pageSize) {
            this.list = this.list.concat(res.data.rows)
            this.loading = false
          } else {
            this.list = this.list.concat(res.data.rows)
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    onLoad () {
      const that = this
      if (this.loading) {
        this.timer = setTimeout(() => {
          // 加载状态结束
          that.pageNo++
          that.init()
        }, 1000)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.van-nav-bar__content {
    height: 88px;
    line-height: 88px;
  }
  /deep/.van-nav-bar__title {
    font-size: 32px;
    color: #333333;
  }
  /deep/.van-icon-arrow-left {
    color: #999;
    font-size: 36px;
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
  .van-list{
    margin-top: 40px;
    padding: 0 30px;
  }
  .list-main{
    background: #ffffff;
    border-radius: 20px;
    padding: 0 50px;
    .main-item{
      display: flex;
      flex-flow: column nowrap;
      border-top:1px solid #dcdcdc;
      .item-detailType{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        font-size: 36px;
        font-weight: 400;
        color: #333333;
        margin: 40px 0;
        .detailType-r{
          color: #ff5d19;
        }
      }
      .item-createTime{
        font-size: 32px;
        color: #999999;
      }
      .item-id{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        align-items: center;
        color: #999999;
        margin-top: 20px;
        margin-bottom: 30px;
        .id-title, .id-no{
          font-size: 32px;
        }
      }
    }
    .main-item:nth-child(1){
      border: none;
    }
  }
</style>
