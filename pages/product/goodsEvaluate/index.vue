<template>
    <div class="goodsEvaluate">
        <van-nav-bar
            :title="$t('user_main.comont')"
            left-arrow
            @click-left="onClickLeft"
        />
        <div class="content">
            <div class="retabox">
                <span>{{$t('commentlist.rate')}}</span>
                <van-rate
                    v-model="averageScore"
                    :size="19"
                    color="#FAB647"
                    void-icon="star"
                    void-color="#eee"
                    allow-half
                    readonly
                />
                <span>{{goodsRate+'%'+$t('commentlist.goodrate')}}</span>
            </div>

            <van-list
                v-model="loading"
                :loading-text="$t('supply.loadding')"
                :finished="finished"
                :finished-text="$t('threeClass.finished')"
                @load="onLoad"
                >
                <div v-for="(item, index) in commonList" :key="index" class="itembox">
                    <div class="headbox">
                        <div class="leftbox">
                            <img v-if="item.userHeardImg" v-lazy="baseImageUrl + item.userHeardImg " />
                            <img
                                v-else
                                src="@/assets/images/goodsdetail/default_header.png"
                            />
                            <span>{{ item.userName }}</span>
                        </div>
                        <div class="rightbox">
                            <van-rate
                                v-model="item.goodsSore"
                                :size="19"
                                color="#FAB647"
                                void-icon="star"
                                void-color="#eee"
                                allow-half
                                readonly
                            />
                        </div>
                    </div>
                    <div class="bodybox">
                        <div class="firstbox">
                            <span>
                                {{ item.createTime }}
                            </span>
                            <span>
                                {{ item.specValue }}
                            </span>
                        </div>
                        <div class="twobox">
                            {{ item.commentContent }}
                        </div>
                        <div class="threebox">
                            <img v-for="(e, v) in item.commentImgs" :key="v" v-lazy="baseImageUrl + e.imgUrl" />
                        </div>
                        <div v-if="item.evaluateAnswer" class="fourbox" >
                            {{ item.evaluateAnswerAccountName }}：{{ item.evaluateAnswer }}
                        </div>
                    </div>
                </div>
            </van-list>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'GoodsEvaluate',
  layout: 'content',
  data () {
    return {
      pageSize: 10,
      pageNo: 1,
      commonList: [],
      goodsRate: null,
      averageScore: 0,
      loading: false,
      finished: false
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  mounted () {
    // console.log('id----', this.$route.query.id)
    if (this.$route.query.id) {
      this.getCommonList(this.$route.query.id)
    }
  },
  methods: {
    onClickLeft () {
      window.history.go(-1)
    },
    getCommonList (id) {
      const vm = this
      const _data = {
        goodsId: id,
        pageNo: vm.pageNo,
        pageSize: vm.pageSize
      }
      vm.$axios({
        url: 'starday-goods/goods_comment/list',
        method: 'get',
        params: _data
      }).then((res) => {
        if (res.code === 200) {
          if (res.data.comment.length < res.data.pageSize) {
            vm.commonList = vm.commonList.concat(res.data.comment)
            vm.finished = true
          } else if (res.data.comment.length === res.data.pageSize) {
            vm.commonList = vm.commonList.concat(res.data.comment)
            vm.loading = false
          } else {
            vm.commonList = vm.commonList.concat(res.data.comment)
          }
          vm.goodsRate = res.data.goodsRate || 0
          vm.averageScore = res.data.averageScore
        }
      })
    },
    onLoad () {
      // 异步更新数据
      const _this = this
      setTimeout(() => {
        // 加载状态结束
        _this.pageNo++
        _this.getCommonList(_this.$route.query.id)
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
    .goodsEvaluate{
        height:100vh;
        .van-nav-bar{
            height:88px;
        }
        /deep/.van-nav-bar__content{
            height:100%;
        }
        /deep/.van-nav-bar__title{
            height:100%;
            line-height:88px;
            font-size:36px;
            color: #323233;
            font-weight: 500;
        }
        /deep/.van-nav-bar .van-icon{
            font-size:36px;
        }
        .content{
            padding:40px 30px 0;
            background-color:#fff;
            .retabox{
                margin-bottom:60px;
                .van-rate{
                    vertical-align: middle;
                }
                span:nth-of-type(1){
                    margin-right:20px;
                    font-size:28px;
                    color: #333333;
                }
                span:nth-of-type(2){
                    margin-left:20px;
                    font-size:28px;
                    color: #333333;
                }
            }
            .itembox{
                margin-top:20px;
                padding-bottom:28px;
                border-bottom:1px solid #e5e5e5;
                .headbox{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    .leftbox{
                        img{
                            width:66px;
                            height:66px;
                            vertical-align: middle;
                            border-radius:50%;
                        }
                    }
                }
                .bodybox{
                    margin-top:16px;
                    .firstbox{
                        font-size: 24px;
                        color: #999999;
                        span:nth-of-type(2){
                            margin-left:20px;
                        }
                    }
                    .twobox{
                        margin-top:12px;
                        font-size: 28px;
                        color: #333333;
                    }
                    .threebox{
                        margin-top:24px;
                        img{
                            width:200px;
                            height:200px;
                            margin:0 20px 20px 0;
                        }
                    }
                    .fourbox{
                        padding:20px;
                        font-size: 24px;
                        background-color: #f4f4f4;
                        color: #666666;
                        border-radius: 10px;
                        line-height: 34px;
                    }
                }
            }
            .itembox:last-of-type{
                border:none;
            }
        }
    }
</style>
