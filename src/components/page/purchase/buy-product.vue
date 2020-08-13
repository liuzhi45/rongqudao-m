<template>
  <div class="buy-product">
  </div>
</template>
<script>
// import { Toast } from 'mint-ui'
import api from '@/assets/js/api'
import md5 from 'js-md5'
import { formatTime } from '@/assets/js/filter'
import { UrlSearch } from '@/assets/js/utils'
import { PAY_PRODUCT, PRICE_RESULT } from '@/assets/js/urlConfig'
import 'vant/lib/index.css'
import Vue from 'vue'
import { Dialog, Toast } from 'vant'
Vue.use(Toast)
export default {
  name: 'payment',
  data () {
    return {
      userIp: '',
      isNoPay: true,
      show: false,
      userInfo: {
        signature: '',
        requestTime: '',
        token: ''
      },
      submitDisFlag: false,
      prodOrderNo: '',
      weChatParameter: {}
    }
  },
  computed: {
  },
  components: {
    vanDialog: Dialog.Component
  },
  mounted () {
    // 2077a775842c0e6476f919669359d461fba
    this.userInfo.token = new UrlSearch().token // 从url中获取
    this.prizeCode = new UrlSearch().prizeCode // 从url中获取
    this.handelPay() // 此页面直接支付
    if (new UrlSearch().isPay) {
      this.show = true
    }
    // 获取客户端ip
    this.userIp = localStorage.getItem('Ip')
    // 在控制台打印客户端ip
    // console.info(this.userIp)
  },
  methods: {
    handelPay () {
      this.submitDisFlag = true // 防止用户点击多次
      this.userInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.userInfo.signature = md5(this.userInfo.requestTime + this.prizeCode)
      api.post2Form({url: PAY_PRODUCT, params: Object.assign({payChannel: 20, isH5: true, userIp: this.userIp}, this.userInfo)}).then(
        res => {
          if (res.error.returnCode === 0) {
            this.prodOrderNo = res.data.orderNo
            sessionStorage.setItem('productInfo', this.prodOrderNo)
            this.weChatParameter = res.data.payInfo
            this.weixinH5Pay()
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
      const orderInfo = sessionStorage.getItem('productInfo')
      api.post2Form({ url: PRICE_RESULT, params: Object.assign({ orderNo: orderInfo }, this.userInfo) }).then(
        res => {
          if (res.error.returnCode === 0) {
            let status = res.data.payStatus
            if (status === '20') { // 成功
              this.show = false
              this.isNoPay = false
            } else if (status === '30') { // 失败
              Toast('支付失败，请重新支付')
              this.show = false
            } else if (status === '50') { // 处理中
              Toast('正在处理中，请稍后再试')
            }
          }
        })
    },
    weixinH5Pay () {
      // setCookie('h5weixinpay', '1', 1) // 1表示没有弹窗,0表示弹窗了,存贮一天（判断是否出弹窗）
      window.location.replace(this.weChatParameter.mweb_url + '&redirect_url=' + encodeURIComponent(window.location.href + '&isPay=true'))
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
