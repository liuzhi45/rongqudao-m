<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { plusReady } from '@/assets/js/common'
export default {
  name: 'App',
  created () {
    plusReady(this.plusReady)
  },
  methods: {
    plusReady () {
    }
  }
}
</script>

<style lang="scss">
</style>
