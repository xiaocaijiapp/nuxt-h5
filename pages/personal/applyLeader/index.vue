<template>
  <div class="applyLeader">
    <van-nav-bar
      :title="$t('distribution.applyTeam')"
      left-arrow
      @click-left="onClickLeft"
    />
    <div class="title">
      {{auditStatus === '' ? '' : auditStatus === '0'? $t('distribution.submitTip') : auditStatus === '1'? $t('distribution.reviewRefuse') : ''}}
    </div>
    <div class="bodybox">
      <p class="namebox">
        {{$t('distribution.realName')}}
      </p>
      <input v-model="name" type="text" class="inpbox" :placeholder="$t('distribution.inputRealName')" :disabled="auditStatus === '0'"/>
      <p class="namebox">
        {{$t('distribution.homeAddress')}}
      </p>
      <textarea v-model="adress" rows="3" class="textbox" :placeholder="$t('distribution.inputHomeAddress')" :disabled="auditStatus === '0'">
      </textarea>
      <p class="namebox">
        {{$t('distribution.phoneNum')}}
      </p>
      <input v-model="mobile" type="text" class="inpbox" maxlength="11" :placeholder="$t('distribution.inputPhoneNum')" :disabled="auditStatus === '0'"/>

      <p class="namebox">
        {{$t('distribution.IDInfo')}}
      </p>
      <div class="imgbox">
        <van-uploader v-model="positive" :accept="'image/gif,image/jpeg,image/jpg,image/png,video/mp4,video/mkv,video/rmvb'" :multiple="false" preview-image preview-full-image :max-size="5 * 1024 * 1024" :max-count="1" upload-icon='plus' :upload-text="$t('distribution.front')" :class="auditStatus === '0' ? 'nonevanicon' : ''" :after-read="afterRead" @oversize="onOversize" @delete="deleteImg"/>
        <van-uploader v-model="negative" :accept="'image/gif,image/jpeg,image/jpg,image/png,video/mp4,video/mkv,video/rmvb'" :multiple="false" preview-image preview-full-image :max-size="5 * 1024 * 1024" :max-count="1" upload-icon='plus' :upload-text="$t('distribution.reverse')" :class="auditStatus === '0' ? 'nonevanicon' : ''" :after-read="afterRead1" @oversize="onOversize" @delete="deleteImg1"/>
      </div>
      <p class="promptbox">
        {{$t('distribution.uploadIDTip')}}
      </p>

      <div v-if="auditStatus !== '0' && auditStatus !== '2'" class="btnbox" @click="submit">
        {{auditStatus === '1' ? $t('distribution.againAply') : $t('distribution.submit')}}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ApplyLeader',
  layout: 'content',
  data () {
    return {
      name: '',
      adress: '',
      mobile: '',
      auditStatus: '',
      positive: [],
      negative: [],
      imgList: [],
      imgList1: []
    }
  },
  computed: {
    ...mapGetters(['baseImageUrl'])
  },
  mounted () {
    this.getIsApply()
  },
  methods: {
    onClickLeft () {
      this.$router.back()
    },
    submit () {
      const vm = this
      const _data = {
        houseAddress: vm.adress,
        leaderMobile: vm.mobile,
        leaderMobileAreaCode: '+81',
        realName: vm.name,
        idInfoFront: vm.imgList[0],
        idInfoReverse: vm.imgList1[0]
      }
      vm.$axios({
        url: 'starday-user/user/distribute/group/leader/apply/add',
        method: 'post',
        data: _data
      }).then((res) => {
        if (res.code === 200) {
          vm.$router.push('/personal/distributionCenter')
        }
      }).catch((err) => {
        this.$toast.fail(err.message)
      })
    },
    deleteImg (file) {
      this.imgList = []
    },
    deleteImg1 (file, detial) {
      this.imgList1.splice(detial.index, 1)
    },
    afterRead (file) {
      const vm = this
      const formData = new FormData()
      formData.append('file', file.file)
      vm.$axios({
        url: 'starday-user/file/uploadImage',
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        data: formData
      }).then((res) => {
        if (res.code === 200) {
          vm.imgList.push(res.data)
        }
      })
    },
    afterRead1 (file) {
      const vm = this
      const formData = new FormData()
      formData.append('file', file.file)
      vm.$axios({
        url: 'starday-user/file/uploadImage',
        method: 'post',
        headers: { 'content-type': 'multipart/form-data' },
        data: formData
      }).then((res) => {
        if (res.code === 200) {
          vm.$toast(res.message)
          vm.imgList1.push(res.data)
        }
      })
    },
    // 查询是否申请过
    getIsApply () {
      const vm = this
      vm.$axios({
        url: 'starday-user/user/distribute/group/leader/apply/his',
        method: 'post'
      }).then((res) => {
        if (res.code === 200) {
          if (res.data) {
            vm.auditStatus = res.data.auditStatus + '' || ''
            vm.name = res.data.realName || ''
            vm.adress = res.data.houseAddress || ''
            vm.mobile = (res.data.leaderMobile) || ''
            vm.positive = []
            vm.negative = []
            vm.imgList = []
            vm.imgList1 = []
            vm.positive.push({
              url: vm.baseImageUrl + res.data.idInfoFront
            })
            vm.negative.push({
              url: vm.baseImageUrl + res.data.idInfoReverse
            })
            vm.imgList.push(res.data.idInfoFront)
            vm.imgList1.push(res.data.idInfoReverse)
          }
        }
      })
    },
    onOversize (file) {
      this.$toast('文件大小不能超过 500kb')
    }
  }
}
</script>
<style lang="less" scoped>
  .applyLeader{
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
    /deep/.van-uploader{
      vertical-align: middle;
    }
    /deep/.van-uploader__upload {
      height: 160px;
      width: 160px;
    }
    /deep/.van-uploader__preview-image {
      height: 160px;
      width: 160px;
    }
    /deep/.van-uploader__preview-delete-icon {
      font-size: 40px;
      top: -6px;
      right: -6px;
    }
    /deep/.van-uploader__preview-delete {
      width: 30px;
      height: 30px;
    }
    /deep/.nonevanicon .van-uploader__preview-delete {
      display: none;
    }
    .title{
      width: 100%;
      margin: 24px 0;
      text-align: center;
      font-size: 28px;
      color: #ff5d19;
    }
    .bodybox{
      // width: 100%;
      margin: 0 24px;
      padding: 40px 30px;
      background: #ffffff;
      border-radius: 16px;
      .namebox{
        font-size: 30px;
        font-weight: 500;
        color: #333333;
      }
      .inpbox{
        display: block;
        width: 100%;
        height: 86px;
        margin: 20px 0 30px;
        padding: 0 30px;
        font-size: 30px;
        color: #666666;
        line-height: 86px;
        border: none;
        outline: none;
        background: #f3f4f6;
        border-radius: 8px;
      }
      .textbox{
        display: block;
        width: 100%;
        margin: 20px 0 30px;
        padding: 26px 30px;
        font-size: 30px;
        color: #666666;
        border: none;
        outline: none;
        background: #f3f4f6;
        border-radius: 8px;
        line-height: 40px;
        resize:none;
      }
      .imgbox{
        margin-top:20px;
      }
      .promptbox{
        margin:20px 0 88px;
        font-size: 26px;
        color: #666666;
        line-height: 40px;
      }
      .btnbox{
        width: 400px;
        height: 70px;
        margin:0 auto;
        font-size: 30px;
        color: #ffffff;
        text-align: center;
        line-height: 70px;
        background: #ff5d19;
        border-radius: 35px;
      }
    }
  }
</style>
