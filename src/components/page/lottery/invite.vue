<template>
  <div class="invite" ref="invite">
    <div class="banner-div">
      <!--<img src="../../../assets/img/lottery/invite-bg.png" alt="">-->
      <div class="logo-div">
        <div class="logo-div-left">
          <img src="../../../assets/img/lottery/logo.png" alt="logo">
          <div class="logo-div-text">
            <h4>融渠道</h4>
            <p>贷款同行交流平台</p>
          </div>
        </div>
        <div class="logo-div-right">
          <router-link :to="{name: 'register'}">免费注册使用</router-link>
        </div>
      </div>
    </div>
    <div class="inv-content">
      <div class="inv-code inv-code-div">
        <div class="contact">
          <div class="contact-item">
            <img src="../../../assets/img/lottery/telphone.png" alt="">
            <p>一键获取全部同行联系方式</p>
          </div>
          <div class="contact-item">
            <img src="../../../assets/img/lottery/pub-ad.png" alt="">
            <p>一键群发广告</p>
          </div>
          <div class="contact-item">
            <img src="../../../assets/img/lottery/pro-info.png" alt="">
            <p>最新产品信息及渠道</p>
          </div>
        </div>
        <div class="qrCodeImg">
          <img :src="qrCodeImg" alt="">
        </div>
        <div class="inv-btn">
          <mt-button plain @click="shareImg">分享</mt-button>
          <!--<a :href="qrCodeImg" download="二维码"><mt-button type="primary">下载图片</mt-button></a>-->
          <mt-button type="primary" @click="downImg" class="down-btn">下载图片</mt-button>
        </div>
      </div>
      <div class="inv-code inv-record">
        <div class="inv-record-tab">
          <img src="../../../assets/img/lottery/invite-tab.png" alt="">
        </div>
        <div class="inv-record-title">邀请记录</div>
        <div class="inv-record-con">
          <div class="title">
            <span>手机号</span>
            <span>状态</span>
          </div>
          <ul v-if="inviteRecordData.length > 0">
            <li v-for="(recordD,idx) in inviteRecordData" :key="idx">
              <span>{{recordD.phone}}</span>
              <span v-show="recordD.completeUserInfo">成功邀请</span>
              <span class="inv-record-unfinsh" v-show="!recordD.completeUserInfo">待完善个人信息</span>
            </li>
          </ul>
          <ul v-if="inviteRecordData.length === 0">
            <li>
              <span>暂无数据</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="inv-code inv-record">
        <div class="inv-record-tab">
          <img src="../../../assets/img/lottery/invite-tab.png" alt="">
        </div>
        <div class="inv-record-title">活动规则</div>
        <div class="inv-desc">
          <p>1.活动时间：05月20日-07月31日。</p>
          <p>2.邀请好友注册可增加一次抽奖机会。</p>
          <p>3.首次邀请好友奖励3天付费功能，之后每邀请一个好友奖励一天付费功能。</p>
          <p>4.中奖用户可在我的-钱包内查看。</p>
          <p>5.活动期间，如有恶意刷奖行为，一经查实所有奖励不予兑换，永久封号。</p>
        </div>
      </div>
      <div class="inv-footer">
        本活动最终解释权归“融渠道”所有
      </div>
    </div>
  </div>
</template>
<script>
import TimerBtn from '@/components/common/timerBtn'
import api from '@/assets/js/api'
import { INVITE_RECORD_URL, GET_DQCODE_URL } from '@/assets/js/urlConfig'
import { formatTime } from '@/assets/js/filter'
import md5 from 'js-md5'
import { Toast } from 'mint-ui'
import { UrlSearch } from '@/assets/js/utils'
import { cloneDeep } from 'lodash'
export default {
  data () {
    return {
      qrCodeImg: '',
      downloadImg: '', // 分享图片地址
      inviteRecordData: [],
      prizeCode: '',
      userInfo: {
        signature: '',
        requestTime: '',
        token: ''
      },
      pageInfo: {
        pageNo: 1,
        pageSize: 500
      }
    }
  },
  components: {
    TimerBtn
  },
  mounted () {
    // 2077a775842c0e6476f919669359d461fba
    this.userInfo.token = new UrlSearch().token // 从url中获取
    this.prizeCode = new UrlSearch().prizeCode // 从url中获取
    this.initPage()
  },

  // 销毁组件重新加载
  deactivated () {
    this.$destroy()
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    initPage () {
      this.getCode()
      this.getRecordList()
    },
    getCode () {
      this.userInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.userInfo.signature = md5(this.userInfo.requestTime + this.prizeCode)
      api.post2Form({url: GET_DQCODE_URL, params: this.userInfo}).then(
        res => {
          if (res.error.returnCode === 0) {
            this.qrCodeImg = res.data.qrCodeUrl
            this.downloadImg = res.data.downloadImg
          } else {
            Toast(res.error.returnMessage)
          }
        },
        (e, res) => {
          console.log(e, res)
        })
    },
    getRecordList () {
      this.userInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.userInfo.signature = md5(this.userInfo.requestTime + this.prizeCode)
      let param = Object.assign(cloneDeep(this.userInfo), this.pageInfo)
      api.post2Form({url: INVITE_RECORD_URL, params: param}).then(
        res => {
          if (res.error.returnCode === 0) {
            this.inviteRecordData = res.data.list
          } else {
            Toast(res.error.returnMessage)
          }
        },
        (e, res) => {
        })
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return ''
      } else {
        return 'success-row'
      }
    },
    // 分享
    shareImg () {
      let str = this.downloadImg
      let u = navigator.userAgent
      // let app = navigator.appVersion
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      console.log('window=', window)
      if (isAndroid) {
        /* eslint-disable no-undef */
        sharePic.postMessage(str)
      } else if (isiOS) {
        /* eslint-disable no-undef */
        sharePic.postMessage(str)
        // window.webkit.messageHandlers.sharePic.postMessage(str)
      }
    },
    // 下载图片
    downImg () {
      /* eslint-disable no-undef */
      downloadPic.postMessage(this.downloadImg)
    }
  }
}
</script>
<style lang="scss">
.invite {
  background: linear-gradient(to bottom, #1D9CFF 0%, #33bdfc 100%);
  width:100%;
  min-height:100%;
  font-family: PingFangSC-Regular;
  .banner-div{
    width: 100%;
    height: 336px;
    position: relative;
    background:url(../../../assets/img/lottery/invite-bg.png) no-repeat;
    background-size: 100% 100%;
    img{
    }
  }
  .logo-div{
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #FFFFFF;
    margin-top: 6px;
    &-left{
      display: flex;
      margin-right: 6px;
      img{
        width: 26px;
        height: 26px;
      }
    }
    &-right{
      border-left: 1px solid #fff;
      padding-left: 10px;
      a{
        color: #FFFFFF;
      }
    }
    &-text{
      text-align: left;
      margin-left: 6px;
      p{
        margin-top: 3px;
        font-size: 10px;
      }
    }
  }
  .inv-content{
    position: relative;
    width: 90%;
    margin: -18px auto;
    text-align: center;
    z-index: 99;
    .inv-code-div{
      // margin-top: 267px;
    }
    .inv-code{
      background: #fff;
      box-shadow: inset 0 0 20px 0 #86C7FF;
      border-radius: 0 0 8px 8px;
      text-align: center;
      padding-bottom: 30px;
      margin-bottom: 10px;
    }
    .inv-record{
      border-radius: 8px;
      padding-top: 24px;
      position: relative;
      &-tab{
        img{
          width: 222px;
          height: 35px;
          position: absolute;
          top: -22px;
          left: 50%;
          transform: translate(-50%);
        }
      }
      &-title{
        font-family: PingFangSC-Semibold;
        font-size: 20px;
        color: #0187FF;
      }
      &-con{
        font-size: 14px;
        color: #333;
        margin-top: 10px;
        width: 100%;
        span{
          width: 48%;
          height: 40px;
          line-height: 40px;
        }
        .title{
          color: #A3B0B7;
        }
        .title, ul li{
          display: flex;
          justify-content: center;
        }
        ul li:nth-of-type(odd){ background-color:rgba(180,228,255,0.2);}
      }
      &-unfinsh{
        color: #A3B0B7;
      }
      .inv-desc{
        margin-top: 18px;
        text-align: left;
        font-family: PingFangSC-Semibold;
        font-size: 14px;
        color: #333333;
        padding: 0 20px;
        p{
          line-height: 20px;
          margin-bottom: 10px;
        }
      }
    }
    .inv-footer{
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #FFFFFF;
      padding: 5px 0 25px;
    }
    .contact{
      display: flex;
      // align-items: center;
      justify-content: space-around;
      padding: 10px;
      &-item{
        text-align: center;
        width: 94px;
        font-size: 12px;
        color: #666666;
        p{
          line-height: 16px;
        }
        img{
          width: 30px;
          height: 30px;
        }
      }
    }
    .qrCodeImg{
      text-align: center;
      margin: 10px 0 20px;
      img{
        width: 140px;
        height: 140px;
      }
    }
    .inv-btn{
      display: flex;
      justify-content: center;
      button{
        width: 110px;
      }
      .down-btn{
        margin-left: 30px;
        background: #378DE8;
        background-image: linear-gradient(227deg, #56C9FF 0%, #378DE8 100%);
      }
    }
  }
  .login-btn{
    width: 289px;
    height: 87px;
    background: url('../../../assets/img/lottery/fin-reg.png') no-repeat;
  }
}
.mint-button--default.is-plain{
  border: 1px solid #3786E8;
  color: #0187FF;
}
</style>
