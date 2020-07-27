<template>
  <div class="wap" ref="wap">
    <div class="banner">
      <img class="bannerImg" src="../../../assets/img/lottery/banner.png" alt="">
    </div>
    <div class="box">
      <div class="advert-msg">
        <img src="../../../assets/img/lottery/adver-msg.png" alt="">
        <ul>
          <li v-for="(item, index) in luckMsgList" :key="index">{{item}}</li>
        </ul>
        <!--<span v-for="(item, index) in luckMsgList">{{item}}</span>-->
      </div>
      <div class="box-item">
        <div v-for="(imgLi, idx) in prizeList" :key="idx" ref="pice" :style="{'backgroundImage':'url('+imgLi.bgSrc+')', 'backgroundRepeat': 'no-repeat'}" class="prize-div">
          <div v-if="imgLi.level" class="prize-block">
            <template v-if="imgLi.level !== -1">
              <img src="../../../assets/img/lottery/money.png" alt="">
              <p v-text="imgLi.level + '元现金'"></p>
            </template>
            <template v-if="imgLi.level == -1">
              <img class="thanks-prize" src="../../../assets/img/lottery/receivedXF.png" alt="谢谢参与">
              <p style="margin-top: 4px;">谢谢参与</p>
            </template>
          </div>
          <div v-if="!imgLi.level" class="prize-block" @click="prizeZhuan">
            <div>
              <p class="start-btn">开始抽</p>
              <p v-text="'剩余' + remainingTimes + '次机会'"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="tips">
        分享给好友，成功邀请即可获得1次抽奖机会，邀请越多，中奖几率越大
      </div>
      <router-link :to="{name: 'invite', query: {token: signInfo.token, prizeCode: prizeCode}}">
        <div class="invite-btn">立即邀请好友</div>
      </router-link>
    </div>
    <div class="massage" v-show="prizeInfoShow" @touchmove="touchMove($event)">
      <div class="noPrize" v-if="noPrizeShow">
        <div class="close" @click="lotteryRecord()">
          <img src="../../../assets/img/lottery/close.png" alt="">
        </div>
        <p class="sorry-bk"></p>
        <div class="xiaofu">
          <img src="../../../assets/img/lottery/noprizeXF.png" alt="">
          <div>很遗憾，您未能中奖</div>
        </div>
        <div class="btn" @click="lotteryRecord">
          再抽一次
        </div>
      </div>

      <div class="noPrize havePrize" v-if="havePrizeShow">
        <!-- <div class="oneBar">
          <img src="../../../assets/img/lottery/yellowCycle.png" />
        </div> -->
        <div style="position: relative">
          <img src="../../../assets/img/lottery/circleLight.png" class="circleLight" v-if="havePrizeShow" alt="">
        </div>
        <p class="have-bk"></p>
        <div class="proImg">
          <img src="../../../assets/img/lottery/money.png" alt="">
        </div>
        <p class="tip">恭喜你抽中了<span style="color: #f63333;">{{prizeName}}元现金</span>
          ，已放入你的钱包，可前往查看</p>
        <div class="btn" @click="lotteryRecord">确定</div>
      </div>
      <div class="noPrize haveLottery" v-if="haveLottery">
        <div class="close" @click="close()">
          <img src="../../../assets/img/lottery/close.png" alt="">
        </div>
        <div class="xiaofu">
          <img src="../../../assets/img/lottery/receivedXF1.png" alt="">
        </div>
        <p class="tip">抽奖次数用完啦，去邀请好友获得抽奖次数吧</p>
        <div class="btn" @click="close()">
          确定
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import noSelect from '@/assets/img/lottery/border.png'
import isSelect from '@/assets/img/lottery/borderSelect.png'
import { Toast } from 'mint-ui'
import api from '@/assets/js/api'
import { prizeAll } from './constant'
import { GET_PRIZE, GET_LUCK_RED, GET_LUCK_NUM } from '@/assets/js/urlConfig'
import { formatTime } from '@/assets/js/filter'
import { UrlSearch } from '@/assets/js/utils'
import md5 from 'js-md5'
export default {
  data () {
    return {
      // mobile: '15114785236',
      prizeIndex: 0,
      arrNum: [0, 1, 2, 5, 8, 7, 6, 3], // 定义转动的顺序
      clickFlage: true, // 点击事件，防止重复点击

      prizeInfoShow: false, // 显示中奖信息的遮罩层
      noPrizeShow: false, // 没中奖
      havePrizeShow: false, // 中奖了
      haveLottery: false, // 已经抽过奖了
      timer1: '',
      timer2: '',
      s2: '',
      remainingTimes: 0, // 剩余抽奖次数
      prizeList: [...prizeAll], // 奖项列表
      prizeLevel: '', // 中奖等级
      prizeName: '', // 奖品名称
      timeFlag: 0, // 时间标记，抽奖请求时间过长，则返回错误
      startStatus: 1, // 活动开始的状态
      signInfo: {
        signature: '',
        requestTime: '',
        token: ''
      }, // 用户签名信息
      animate: false,
      luckMsgList: [],
      isPrize: false,
      pageToAmountMap: {
        '1': 1,
        '3': 2,
        '8': 3,
        '18': 8,
        '88': 7,
        '388': 6,
        '888': 5
      }, // 抽奖金额与页面位置对应关系
      prizeCode: '' // 随机码
    }
  },
  mounted () {
    // 2077a775842c0e6476f919669359d461fba
    this.signInfo.token = new UrlSearch().token // 从url中获取
    this.prizeCode = new UrlSearch().prizeCode // 从url中获取
    // this.prizeList.forEach(item => {
    //   if (item.level) {
    //     this.$set(item, 'bgSrc', noSelect)
    //   } else {
    //     this.$set(item, 'bgSrc', prizeBtn)
    //   }
    // })
    this.getPrizeNum() // 获取剩余抽奖次数
    this.getLuckRecord() // 获取中奖消息
  },

  // 销毁组件重新加载
  deactivated () {
    this.$destroy()
  },
  methods: {
    clearData () {
      this.prizeIndex = 0
      this.clickFlage = true
      this.timer1 = ''
      this.timer2 = ''
      this.s2 = ''
      this.prizeList = [...prizeAll]
      this.prizeLevel = ''
      this.prizeName = ''
    },
    getPrizeNum () {
      this.signInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.signInfo.signature = md5(this.signInfo.requestTime + this.prizeCode)
      api.post2Form({url: GET_LUCK_NUM, params: this.signInfo}).then(res => {
        if (res.error.returnCode === 0) {
          this.remainingTimes = res.data | 0
        } else {
          Toast(res.error.returnMessage)
        }
      })
    },
    getLuckRecord () {
      let that = this
      api.post2Form({url: GET_LUCK_RED}).then(res => {
        if (res.error.returnCode === 0) {
          that.luckMsgList = res.data || []
          const timer = setInterval(() => {
            this.animate = true
            setTimeout(() => {
              that.luckMsgList.push(that.luckMsgList[0])
              that.luckMsgList.shift()
              that.animate = false
            }, 500)
          }, 3000)
          // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
          this.$once('hook:beforeDestroy', () => {
            clearInterval(timer)
          })
        } else {
          Toast(res.error.returnMessage)
        }
      })
    },
    move () {
      if (this.prizeIndex === 0) {
        this.$refs.pice[this.arrNum[7]].style.backgroundImage = 'url(' + noSelect + ')'
        this.$refs.pice[this.arrNum[this.prizeIndex]].style.backgroundImage = 'url(' + isSelect + ')'
        this.prizeIndex++
      } else if (this.prizeIndex === 8) {
        this.prizeIndex = 0
        this.$refs.pice[this.arrNum[7]].style.backgroundImage = 'url(' + noSelect + ')'
        this.$refs.pice[this.arrNum[this.prizeIndex]].style.backgroundImage = 'url(' + isSelect + ')'
        this.prizeIndex++
      } else {
        this.$refs.pice[this.arrNum[this.prizeIndex - 1]].style.backgroundImage = 'url(' + noSelect + ')'
        this.$refs.pice[this.arrNum[this.prizeIndex]].style.backgroundImage = 'url(' + isSelect + ')'
        this.prizeIndex++
      }
      if (this.s2 && this.prizeIndex === this.s2) {
        clearInterval(this.timer1)
        clearInterval(this.timer2)
        this.stop()
      } else {
        this.timeFlag += 100
        if (this.timeFlag >= 10000 && !this.prizeName) {
          clearInterval(this.timer1)
          clearInterval(this.timer2)
          Toast({
            message: '当前抽奖人数过多，稍后再来',
            position: 'middle',
            duration: 2000
          })
          this.clickFlage = true// 能点击
          setTimeout(() => { // 刷新后重新加载
            // location.reload()
          }, 2000)
        }
      }
    },
    // 停止
    stop () {
      this.clickFlage = false// 不能点击
      clearInterval(this.timer1)
      clearInterval(this.timer2)
      this.prizeInfo() // 弹出是否中奖
    },
    // 降速
    lowSpeed () {
      clearInterval(this.timer1)
      this.clickFlage = false// 不能点击
      this.timer2 = setInterval(this.move, 300)
      setTimeout(() => { // 顺序打乱
        this.s2 = this.prizeLevel
      }, 900)
    },
    prizeZhuan () { // 开始抽奖
      if (this.remainingTimes > 0) { // 判断剩余抽奖次数
        if (this.clickFlage) {
          if (this.startStatus === 1) { // 活动开始
            this.clickFlage = false// 不能点击
            this.timer1 = setInterval(this.move, 100)
            this.signInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
            this.signInfo.signature = md5(this.signInfo.requestTime + this.prizeCode)
            api.post2Form({url: GET_PRIZE, params: {...this.signInfo}}).then((res) => {
              if (res.error.returnCode === 0) {
                let priData = res.data
                if (priData.isGetPrize) { // 中奖了
                  let amount = priData.amount
                  this.prizeLevel = this.pageToAmountMap[amount]
                  this.isPrize = true
                  this.prizeName = amount
                } else {
                  this.isPrize = false
                  this.prizeLevel = 4
                  this.prizeName = '谢谢参与'
                }
                setTimeout(() => {
                  clearInterval(this.timer1)
                  this.lowSpeed()
                }, 1200)
              } else { // 次数用完了
                this.isPrize = 2
                this.prizeInfoShow = true
                this.haveLottery = true
                this.clickFlage = false// 不能点击
                clearInterval(this.timer1)
                clearInterval(this.timer2)
                // this.stop()
                // setTimeout(() => { // 刷新后重新加载
                //   location.reload()
                // }, 1500)
              }
            }, false, true)
            // this.timer1 = setInterval(this.move, 100)
            // 请求，返回后给s定值
          } else if (this.startStatus === 0) { // 没开始
            Toast({
              message: '活动尚未开始',
              position: 'middle',
              duration: 1500
            })
          } else if (this.startStatus === 2) { // 已经结束
            Toast({
              message: '活动已经结束',
              position: 'middle',
              duration: 1500
            })
          }
        }
      } else { // 没有抽奖机会了
        this.prizeInfoShow = true
        this.haveLottery = true
      }
    },
    touchMove (e) {
      e.preventDefault()// 禁止滚动
      e.stopPropagation()
    },
    prizeInfo () {
      if (this.isPrize) { // 中奖啦
        setTimeout(() => {
          this.prizeInfoShow = true
          this.havePrizeShow = true
        }, 800)
      } else { // 谢谢参与
        setTimeout(() => {
          this.prizeInfoShow = true
          this.noPrizeShow = true
        }, 800)
      }
    },
    close () { // 关闭没中奖
      this.prizeInfoShow = false
      this.noPrizeShow = false
      this.haveLottery = false
    },
    goIndex () {
      this.$router.push({ name: 'preferIndex' })
      this.prizeInfoShow = false // 显示中奖信息的遮罩层
      this.noPrizeShow = false// 没中奖
    },
    lotteryRecord () { // 关闭中奖刷新次数
      this.getPrizeNum()
      this.clearData()
      this.prizeInfoShow = false
      this.havePrizeShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.wap {
  background:#fd692d url(../../../assets/img/lottery/backg.png) no-repeat;
  width:100%;
  min-height:100%;
  background-size:contain;
  position:absolute;
  font-family: PingFangSC-Regular;
  .banner {
    width: 319px;
    height: 114px;
    margin: 20px auto 0;
    .bannerImg {
      width: 100%;
      height: 100%;
    }
    .prizeInfoBtn {
      width: 2rem;
      height: 1.27rem;
      position: absolute;
      top: 0;
      right: 0;
      .prizeInfoBtnImg {
        width: 2rem;
        height: 1.27rem;
      }
    }
    .priceChanceBtn {
      // width: 3.1rem;
      height: 0.6rem;
      border-radius: 0.6rem;
      background-color: #ff7a00;
      position: absolute;
      bottom: -0.3rem;
      left: 50%;
      transform: translateX(-50%);
      line-height: 0.6rem;
      font-size: 0.34rem;
      color: #fff;
      font-weight: 500;
      text-align: center;
      padding: .06rem .4rem;
    }
  }
  overflow: hidden;
  .box {
    background:url(../../../assets/img/lottery/prize-bg.png) no-repeat;
    background-size: cover;
    margin: 62px auto 0;
    width: 369px;
    height: 567px;
    box-sizing: border-box;
    padding-top: 40px;
    .prize-div {
      // background: url('../../../assets/img/lottery/border.png') no-repeat;
      background-size: 100%;
      float: left;
      width: 90px;
      height: 90px;
      margin-right: 0.16rem;
      margin-bottom: 0.16rem;
      position: relative;
      &:nth-child(3n) {
        margin-right: 0;
      } // &:nth-child(5) {
      //   background: url('../../assets/img/lottery/prizeBtn.png') no-repeat!important;
      //   background-size: 100%!important;
      // }
      &:nth-child(7),
      &:nth-child(8),
      &:nth-child(9) {
        margin-bottom: 0;
      } // padding:.29rem .33rem;
      box-sizing: border-box;
    }
    .prize-block{
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      img {
        width: 58px;
        height: 28px;
      }
      P{
        font-size: 12px;
        color: #EA3811;
        margin-top: 10px;
      }
      .start-btn{
        font-size: 18px;
        font-weight: bold;
      }
      .thanks-prize{
        width: 34px;
        height: 34px;
      }
    }
    .advert-msg{
      display: flex;
      justify-content: center;
      align-items: center;
      img{
        width: 12px;
        height: 10px;
        margin-right: 4px;
      }
      ul{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #FFFFFF;
        height: 16px;
        overflow: hidden;
        transition: all 0.5s;
        li{
          line-height: 16px;
        }
      }
    }
    .box-item{
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      margin-top: 32px;
    }
  }
  .tips{
    width: 240px;
    margin: 46px auto 0;
    color: #bb5108;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }
  .invite-btn{
    margin: 30px auto 0;
    background: url('../../../assets/img/lottery/invite.png') no-repeat;
    width: 266px;
    height: 52px;
    line-height: 52px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }

  .massage {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .noPrize {
      width: 270px;
      height: 240px;
      background-color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 0.4rem;
      text-align: center;
      .sorry-bk{
        display: inline-block;
        width: 231px;
        height: 66px;
        background: url('../../../assets/img/lottery/sorry.png') no-repeat;
        background-size: cover;
        position: absolute;
        left: 50%;
        top: -50px;
        transform: translate(-50%, 0);
      }
      .close {
        position: absolute;
        width: 30px;
        height: 30px;
        top: -46px;
        right: -16px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      p {
        font-size: 14px;
        color: #707070;
        margin: 0.38rem auto 0.2rem;
        text-align: center;
      }
      .xiaofu {
        font-size: 14px;
      }
      .btn {
        width: 204px;
        height: 40px;
        margin: 16px auto 0;
        // background: url("../../../assets/img/lottery/btn.png") no-repeat;
        background-image: linear-gradient(56deg, #F95D2C 0%, #FFE303 100%);
        border-radius: 20px;
        // background-size: 100%;
        font-size: 14px;
        color: #fff;
        line-height: 40px;
        text-align: center;
        font-weight: 600;
      }
    }
    .haveLottery {
      .xiaofu{
        margin-top: 27px;
        img{
          width: 70px;
          height: 70px;
        }
      }
      .tip{
        width: 216px;
        font-size: 14px;
        color: #333333;
        text-align: center;
        line-height: 22px;
      }
    }
    .circleLight {
      width: 256px;
      height: 129px;
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translate(-50%, 0);
      // -webkit-animation: rotate 20s infinite linear;
      // animation: rotate 20s infinite linear;
      // transform-origin: 50% 50%;
    }
    @-webkit-keyframes rotate {
      0% {
        -webkit-transform: rotate(0deg);
      }
      100% {
        -webkit-transform: rotate(360deg);
      }
    }
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .havePrize {
      .have-bk{
        display: inline-block;
        width: 231px;
        height: 66px;
        background: url('../../../assets/img/lottery/prizinig.png') no-repeat;
        background-size: cover;
        position: absolute;
        left: 50%;
        top: -50px;
        transform: translate(-50%, 0);
      }
      .oneBar {
        width: 1.18rem;
        height: 0.46rem;
        position: absolute;
        top: -0.1rem;
        right: 1.1rem;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .tip {
        width: 227px;
        line-height: 21px;
        color: #333333;
      }
      .proImg {
        width: 100px;
        height: 46px;
        margin: 36px auto 20px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
