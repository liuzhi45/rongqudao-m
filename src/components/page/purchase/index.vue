<template>
  <div class="buy-page">
    <div class="price-block">
      <section>
        <h3>自动加好友功能</h3>
        <div class="price-list">
          <div class="price-info" v-for="autoFriend in priceInfo.imFriend" :key="autoFriend.id"
               :class="{ 'price-active': friendIdx === autoFriend.id }" @click="selFriendPrice(autoFriend.id)">
            <p class="price-info-title" v-text="getTimeInfo(autoFriend)"></p>
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
               :class="{ 'price-active': msgIdx === autoMsg.id }" @click="selMsgPrice(autoMsg.id)">
            <p class="price-info-title" v-text="getTimeInfo(autoMsg)"></p>
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
        <div>总计：<span>¥120</span></div>
        <p>已选自动加好友: 6个月；自动群发: 6个月</p>
      </div>
      <van-button type="danger">立即购买</van-button>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui'
import api from '@/assets/js/api'
import md5 from 'js-md5'
import { formatTime } from '@/assets/js/filter'
import { UrlSearch } from '@/assets/js/utils'
import weixinSrc from '@/assets/img/purchase/weixin.png'
import { PRICE_LIST } from '@/assets/js/urlConfig'
import 'vant/lib/index.css'
import Vue from 'vue'
import { Cell, CellGroup, RadioGroup, Radio, Button } from 'vant'
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Button)

export default {
  data () {
    return {
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
      msgIdx: ''
    }
  },
  computed: {
    getTimeInfo (info) {
      return function (info) {
        if (info.serviceTimeType === 'Y') {
          return info.serviceTime + '年'
        } else if (info.serviceTimeType === 'M') {
          return info.serviceTime + '个月'
        } else {
          return info.serviceTime + '天'
        }
      }
    }
  },
  components: {
  },
  mounted () {
    // 2077a775842c0e6476f919669359d461fba
    this.userInfo.token = new UrlSearch().token // 从url中获取
    this.prizeCode = new UrlSearch().prizeCode // 从url中获取
    this.getPriceList()
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
    }
  },
  selFriendPrice (friendId) {
    this.friendIdx = friendId
  },
  selMsgPrice (msgId) {
    this.msgIdx = msgId
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
</style>
