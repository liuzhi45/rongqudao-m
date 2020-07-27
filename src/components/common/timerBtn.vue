<template>
  <mt-button size="small" :type="btnType" @click="run" :disabled="disFlag || disabled || time > 0">{{ text }}</mt-button>
</template>
<script>
export default {
  props: {
    second: {
      type: Number,
      default: 60
    },
    btnType: {
      type: String,
      default: 'primary'
    },
    disFlag: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      time: 0,
      disabled: false
    }
  },
  methods: {
    run: function () {
      console.log(111111111)
      this.$emit('run')
    },
    start: function () {
      this.time = this.second
      this.timer()
    },
    stop: function () {
      this.time = 0
      this.disabled = false
    },
    setDisabled: function (val) {
      this.disabled = val
    },
    timer: function () {
      if (this.time > 0) {
        this.time--
        setTimeout(this.timer, 1000)
      } else {
        this.disabled = false
      }
    }
  },
  computed: {
    text: function () {
      return this.time > 0 ? this.time + 's' : '获取验证码'
    }
  }
}
</script>
