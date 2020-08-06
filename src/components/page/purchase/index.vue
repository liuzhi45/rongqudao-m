<template>
  <div class="buy-page">
    <template v-if="isNoPay">
      <div class="price-block">
        <section>
          <h3>自动加好友功能</h3>
          <div class="price-list">
            <div class="price-info" v-for="autoFriend in priceInfo.imFriend" :key="autoFriend.id"
                 :class="{ 'price-active': friendIdx === autoFriend.id }" @click="selFriendPrice(autoFriend)">
              <p class="price-info-title" v-text="$options.filters.showTimeType(autoFriend.serviceTime, autoFriend.serviceTimeType)"></p>
              <div>¥{{autoFriend.specialPrice}}</div>
              <p v-if="autoFriend.serviceTimeType === 'M' && autoFriend.serviceTime === 1"
                 class="price-info-tips">仅需{{autoFriend.dayPrice}}元/天</p>
              <p v-else class="price-info-tips price-overdue">{{autoFriend.amount}}</p>
            </div>
          </div>
        </section>
        <section>
          <h3>自动群发功能</h3>
          <div class="price-list">
            <div class="price-info"  v-for="autoMsg in priceInfo.imMessage" :key="autoMsg.id"
                 :class="{ 'price-active': msgIdx === autoMsg.id }" @click="selMsgPrice(autoMsg)">
              <p class="price-info-title" v-text="$options.filters.showTimeType(autoMsg.serviceTime, autoMsg.serviceTimeType)"></p>
              <div>¥{{autoMsg.specialPrice}}</div>
              <p v-if="autoMsg.serviceTimeType === 'M' && autoMsg.serviceTime === 1"
                 class="price-info-tips">仅需{{autoMsg.dayPrice}}元/天</p>
              <p v-else class="price-info-tips price-overdue">{{autoMsg.amount}}</p>
            </div>
          </div>
        </section>
      </div>
      <div class="gray-block"></div>
      <div class="price-block pay-type">
        <h3>支付方式</h3>
        <van-radio-group v-model="payType">
          <van-cell-group>
            <van-cell title="微信" :icon="weixinSrc" clickable @click="payType = 'weixin'">
              <template #right-icon>
                <van-radio name="weixin" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <div class="buy-now">
        <div class="buy-now-left">
          <div>总计：<span>¥{{totalMoney}}</span></div>
          <p>已选自动加好友: {{selFriInfo.time}}；自动群发: {{selMsgInfo.time}}</p>
        </div>
        <van-button type="danger" :disabled="submitDisFlag || (!friendIdx && !msgIdx)" @click="handelPay">立即购买</van-button>
      </div>
      <van-dialog v-model="show" title="请确认微信支付是否已完成" :show-confirm-button="false">
        <div class="pay-result pay-success" @click="paySuccess">已完成支付</div>
        <div class="pay-result" @click="show = false">支付遇到问题，重新支付</div>
      </van-dialog>
    </template>
    <template v-if="!isNoPay">
      <div class="pay-status">
        <div>
          <van-icon name="success" color="#1989fa" size="1rem"/>支付成功
        </div>
        <van-button type="info">返回</van-button>
      </div>
    </template>
  </div>
</template>
<script>
// import { Toast } from 'mint-ui'
import api from '@/assets/js/api'
import md5 from 'js-md5'
import { formatTime, showTimeType } from '@/assets/js/filter'
import { UrlSearch } from '@/assets/js/utils'
import weixinSrc from '@/assets/img/purchase/weixin.png'
import { PRICE_LIST, PRICE_PAY, PRICE_RESULT } from '@/assets/js/urlConfig'
import 'vant/lib/index.css'
import Vue from 'vue'
import { Cell, CellGroup, RadioGroup, Radio, Button, Dialog, Toast, Icon } from 'vant'
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Button)
Vue.use(Toast)
Vue.use(Icon)
// Vue.use(Dialog)

export default {
  name: 'payment',
  data () {
    return {
      userIp: '',
      isNoPay: true,
      show: false,
      money: '',
      options: [
        {
          icon: 'http://dn-placeholder.qbox.me/110x110/FF2D55/000',
          label: '微信',
          value: 'weixin'
        }
      ],
      payType: 'weixin',
      weixinSrc,
      userInfo: {
        signature: '',
        requestTime: '',
        token: ''
      },
      priceInfo: {},
      friendIdx: '',
      msgIdx: '',
      selFriInfo: {
        time: '',
        money: ''
      },
      selMsgInfo: {
        time: '',
        money: ''
      },
      submitDisFlag: false,
      orderNo: '',
      weChatParameter: {}
    }
  },
  computed: {
    totalMoney () {
      return this.selFriInfo.money + this.selMsgInfo.money
    }
  },
  components: {
    vanDialog: Dialog.Component
  },
  mounted () {
    // 2077a775842c0e6476f919669359d461fba
    this.userInfo.token = new UrlSearch().token // 从url中获取
    this.prizeCode = new UrlSearch().prizeCode // 从url中获取
    this.getPriceList()
    if (new UrlSearch().isPay) {
      this.show = true
    }
    // 获取客户端ip
    this.userIp = localStorage.getItem('Ip')
    // 在控制台打印客户端ip
    console.info(this.userIp)
  },
  methods: {
    getPriceList () {
      this.userInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.userInfo.signature = md5(this.userInfo.requestTime + this.prizeCode)
      api.post2Form({url: PRICE_LIST, params: this.userInfo}).then(
        res => {
          if (res.error.returnCode === 0) {
            this.priceInfo = res.data
          } else {
            Toast(res.error.returnMessage)
          }
        },
        (e, res) => {
          console.log(e, res)
        })
    },
    selFriendPrice (friendObj) {
      this.friendIdx = friendObj.id
      this.selFriInfo.money = friendObj.specialPrice
      this.selFriInfo.time = showTimeType(friendObj.serviceTime, friendObj.serviceTimeType)
    },
    selMsgPrice (msgObj) {
      this.msgIdx = msgObj.id
      this.selMsgInfo.money = msgObj.specialPrice
      this.selMsgInfo.time = showTimeType(msgObj.serviceTime, msgObj.serviceTimeType)
    },
    handelPay () {
      let proIds = this.friendIdx ? this.friendIdx : ''
      if (this.msgIdx) {
        if (proIds) {
          proIds += ','
        }
        proIds += this.msgIdx
      }
      this.submitDisFlag = true // 防止用户点击多次
      this.userInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.userInfo.signature = md5(this.userInfo.requestTime + this.prizeCode)
      api.post2Form({url: PRICE_PAY, params: Object.assign({payChannel: 20, proIds, isH5: true, userIp: this.userIp}, this.userInfo)}).then(
        res => {
          if (res.error.returnCode === 0) {
            this.orderNo = res.data.orderNo
            this.weChatParameter = res.data.payInfo
            const ua = navigator.userAgent.toLowerCase() // 判断当前环境
            if (ua.match(/MicroMessenger/i) === 'micromessenger') { // 微信
              this.weixinPay()
            } else { // 其他浏览器
              this.weixinH5Pay()
              // window.location.href = res.data.mweb_url + '&redirect_url=https://www.baidu.com'
            }
          } else {
            Toast(res.error.returnMessage)
          }
        },
        (e, res) => {
          console.log(e, res)
        })
    },
    paySuccess () {
      this.isNoPay = true
      // 调查询订单信息
      this.userInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.userInfo.signature = md5(this.userInfo.requestTime + this.prizeCode)
      api.post2Form({ url: PRICE_RESULT, params: Object.assign({ orderNo: this.orderNo }, this.userInfo) }).then(
        res => {
          if (res.error.returnCode === 0) {
            let status = res.data.payStatus
            if (status === 20) { // 成功
              this.show = false
              this.isNoPay = false
            } else if (status === 30) { // 失败
              Toast('支付失败，请重新支付')
              this.show = false
            } else if (status === 50) { // 处理中
              Toast('正在处理中，请稍后再试')
            }
          }
        })
    },
    weixinH5Pay () {
      // setCookie('h5weixinpay', '1', 1) // 1表示没有弹窗,0表示弹窗了,存贮一天（判断是否出弹窗）
      window.location.replace(this.weChatParameter.mweb_url + '&redirect_url=' + encodeURIComponent(window.location.href + '&isPay=true'))
    },
    /* eslint-disable */
    // 解决微信内置对象报错
    weixinPay (params) {
      var that = this
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', that.onBridgeReady(params), false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', that.onBridgeReady(params))
          document.attachEvent('onWeixinJSBridgeReady', that.onBridgeReady(params))
        }
      } else {
        that.onBridgeReady(params)
      }
    },
    // 微信内置浏览器类，weChatParameter对象中的参数是3.步骤代码中从后端获取的数据
    onBridgeReady (params) {
      let that = this
      var timestamp = Math.round(that.weChatParameter.timeStamp).toString()
      WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
          debug: false,
          'appId': that.weChatParameter.appid, // 公众号名称，由商户传入
          'timeStamp': that.weChatParameter.timestamp, // 时间戳，自1970年以来的秒数
          'nonceStr': that.weChatParameter.noncestr, // 随机串
          'package': that.weChatParameter.package,
          // 'signType': that.weChatParameter.signType, // 微信签名方式：
          'paySign': that.weChatParameter.sign, // 微信签名
          jsApiList: [
            'chooseWXPay'
          ]
        },
        function (res) {
          // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          if (res.err_msg === 'get_brand_wcpay_request:ok') { // 支付成功后的操作
            Toast('微信支付成功')
            that.isDisabledSubmitBtn = true
          } else if (res.err_msg === 'get_brand_wcpay_request:cancel') { // 取消支付的操作
            Toast('用户取消支付')
            that.isDisabledSubmitBtn = false // 按钮恢复高亮
          } else { // 支付失败的操作
            Toast('网络异常，请重试')
            that.isDisabledSubmitBtn = false // 按钮恢复高亮
          }
        }
      )
    }
  }
}
</script>
<style lang="scss" scoped>
  .buy-page{
    font-family: PingFangSC-Medium;
    .price-block{
      padding: 30px 15px 20px;
      h3, p{
        font-size: 18px;
        color: #333333;
      }
      section{
        margin-bottom: 40px;
        .price-list{
          margin-top: 24px;
          display: flex;
          justify-content: center;
          .price-info{
            width: 108px;
            height: 126px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px solid #E3E3E3;
            border-radius: 4px;
            border-radius: 4px;
            margin-right: 10px;
            position: relative;
            &:last-child{
              margin-right: 0;
            }
            div{
              font-size: 14px;
              color: #F63333;
              line-height: 34px;
            }
            &-tips{
              font-size: 12px;
              color: #A3B0B7;
            }
            &-reco{
              position: absolute;
              top: -6px;
              right: 0;
              background-image: linear-gradient(180deg, #FF5F6A 0%, #F63333 100%);
              border-radius: 0 6px 0 4px;
              font-size: 12px;
              color: #FFFFFF;
              width: 34px;
              height: 16px;
              text-align: center;
              line-height: 16px;
            }
          }
          .price-active{
            background: #F3F8FF;
            border: 1px solid #3786E8;
          }
          .price-overdue{
            text-decoration: line-through;
            text-decoration-color: #333;
          }
        }
      }
    }
    .gray-block{
      height: 8px;
      background: #F8F8FA;
    }
    /deep/ .pay-type{
      h3{
        margin-bottom: 10px;
      }
      .van-cell{
        padding: 10px 0;
      }
      .van-cell::after{
        border-bottom: 0;
      }
      [class*=van-hairline]::after{
        border: none;
      }
      .van-cell__left-icon{
        height: 27px;
      }
      .van-icon__image{
        width: 27px;
        height: 27px;
      }
      .van-cell__title, .van-cell__value{
        font-size: 14px;
      }
      .van-cell__left-icon{
        margin-right: 10px;
      }
    }
  }
  .buy-now{
    width: 100%;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: .2px solid #EBEBEB;
    &-left{
      padding-left: 15px;
      div{
        font-size: 14px;
        color: #333333;
        font-weight: 600;
        line-height: 20px;
        span{
          color: #F63333;
        }
      }
      p{
        font-size: 12px;
        color: #A3B0B7;
        line-height: 18px;
      }
    }
  }
  /deep/ .van-dialog{
    border-radius: 8px;
  }
  .pay-result{
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #E3E3E3;
  }
  .pay-success{
    color: red;
  }
  /deep/ .van-dialog__header{
    line-height: 68px;
    padding-top: 0;
  }
  .pay-status{
    margin: 100px auto;
    width: 200px;
    font-size: 20px;
    text-align: center;
    div{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
  }
</style>
