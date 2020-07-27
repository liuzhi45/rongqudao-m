<template>
  <div class="registered" ref="registered">
    <div class="reg-content">
      <div class="reg-list">
        <mt-field label="手机号码：" type="tel" placeholder="请输入用户名" v-model="userInfo.phoneNumber"></mt-field>
      </div>
      <div class="reg-list rand-code">
        <mt-field label="验证码：" placeholder="输入验证码" v-model="userInfo.verificationCode">
          <timer-btn class="timer-btn" ref="timerbtn" @run="sendCode" :disFlag="!userInfo.phoneNumber"></timer-btn>
        </mt-field>
      </div>
      <div class="reg-list">
        <mt-field label="设置密码：" placeholder="请输入密码" type="password" v-model="userInfo.password"></mt-field>
      </div>
      <div>
        <img src="../../../assets/img/lottery/fin-reg.png" alt="" @click="registerUser"/>
      </div>
    </div>
  </div>
</template>
<script>
import TimerBtn from '@/components/common/timerBtn'
import api from '@/assets/js/api'
import { REGISTER_URL, GET_CODE_URL } from '@/assets/js/urlConfig'
import { formatTime } from '@/assets/js/filter'
import md5 from 'js-md5'
import { Toast } from 'mint-ui'
import { UrlSearch } from '@/assets/js/utils'
export default {
  data () {
    return {
      userInfo: {
        phoneNumber: '',
        verificationCode: '',
        password: '',
        requestTime: '',
        invitedUserId: ''
      }
    }
  },
  components: {
    TimerBtn
  },
  mounted () {
    this.userInfo.invitedUserId = new UrlSearch().invitedUserId // 从url中获取
  },

  // 销毁组件重新加载
  deactivated () {
    this.$destroy()
  },
  methods: {
    sendCode () {
      this.$refs.timerbtn.setDisabled(true)
      this.userInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.userInfo.signature = md5(this.userInfo.requestTime + 'rongqd')
      let { phoneNumber, requestTime, signature } = this.userInfo
      api.post2Form({url: GET_CODE_URL, params: { phoneNumber, requestTime, signature, smsType: 1 }}).then(
        res => {
          if (res.error.returnCode !== 0) {
            console.log('error=', res.error.returnCode)
            Toast({
              message: res.error.returnMessage,
              position: 'middle',
              duration: 2500
            })
            this.$refs.timerbtn.stop() // 停止倒计时
          }
        },
        (e, res) => {
          console.log(e, res)
        })
      this.$refs.timerbtn.start() // 启动倒计时
    },
    registerUser () {
      if (!this.userInfo.phoneNumber) {
        Toast({
          message: '手机号不能为空',
          position: 'middle',
          duration: 1500
        })
        return false
      }
      if (!this.userInfo.verificationCode) {
        Toast({
          message: '验证码不能为空',
          position: 'middle',
          duration: 1500
        })
        return false
      }
      if (!this.userInfo.password) {
        Toast({
          message: '密码不能为空',
          position: 'middle',
          duration: 1500
        })
        return false
      }
      this.userInfo.requestTime = formatTime(new Date(), 'YYYYMMDDHHmmss')
      this.userInfo.signature = md5(this.userInfo.requestTime + 'rongqd')
      api.post2Form({url: REGISTER_URL, params: this.userInfo}).then(
        res => {
          if (res.error.returnCode === 0) {
            Toast({
              message: '注册成功',
              position: 'middle',
              duration: 1500
            })
            window.open('http://www.rongqudao.com/download.html')
          } else {
            Toast(res.error.returnMessage)
          }
        },
        (e, res) => {
        })
    }
  }
}
</script>
<style lang="scss">
.registered {
  background:#ffe8db url(../../../assets/img/lottery/reg-bg.png) no-repeat;
  width:100%;
  height:100%;
  background-size:contain;
  position:absolute;
  font-family: PingFangSC-Regular;
  .reg-content{
    width: 100%;
    // height: 433px;
    box-sizing: border-box;
    background:url(../../../assets/img/lottery/reg-kai.png) no-repeat;
    background-size: 100% 100%;
    margin: 88px auto 0;
    padding: 180px 56px 0;
    .reg-list{
      padding: 0 5px;
      margin-bottom: 10px;
      .mint-cell-wrapper{
        font-size: 14px;
        align-items: inherit;
        line-height: inherit;
      }
      .mint-field .mint-cell-title{
        width: 76px;
      }
      .mint-field-core{
        line-height: 1;
      }
      .mint-cell.mint-field{
        height: 42px;
        line-height: 42px;
        border-radius: 4px;
      }
      .mint-cell-text{
        font-family: PingFangSC-Regular;
        color: #666;
        font-size: 14px;
      }
    }
    img{
      width: 100%;
    }
    .rand-code{
      position: relative;
      .timer-btn{
        background: none;
        padding: 0;
        .mint-button-text{
          color: #FF4639;
        }
      }
    }
  }
  .login-btn{
    width: 289px;
    height: 87px;
    background: url('../../../assets/img/lottery/fin-reg.png') no-repeat;
  }
}
</style>
