<!-- SVG图标 -->
<template>
  <div class="svgBox">
    <svg class="svg-icon" aria-hidden="true" :style="style" :class="iconClass">
      <use :xlink:href="iconFullName"></use>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
// 动态加载svg图标文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('../../../assets/icon', false, /\.svg$/)
requireAll(req)

export default {
  name: 'icon-svg',
  props: {
    /* 图标类型，对应svg文件的名称, 如：setting */
    iconName: {
      type: String,
      required: true
    },
    /* 图标颜色, 可以只设置color(此时fill=stroke=color),也可以单独设置fill和stroke */
    color: {
      type: String
    },
    fill: {
      type: String
    },
    stroke: {
      type: String
    },
    /* 图标大小, 可以只设置size(此时width=height=size),也可以单独设置width和height */
    size: {
      type: String
    },
    width: {
      type: String
    },
    height: {
      type: String
    },
    /* 图标其他样式 */
    iconStyle: {
      type: Object,
      default: function () {
        return {}
      }
    },
    iconClass: {
      type: [String, Array, Object]
    }
  },
  computed: {
    iconFullName () {
      return `#icon-${this.iconName}`
    },
    style () {
      let setStyle = {}
      if (this.color) {
        setStyle.stroke = this.color
        setStyle.fill = this.color
      }
      if (this.fill) {
        setStyle.fill = this.fill
      }
      if (this.stroke) {
        setStyle.stroke = this.stroke
      }
      if (this.size) {
        setStyle.width = this.size
        setStyle.height = this.size
      }
      if (this.width) {
        setStyle.width = this.width
      }
      if (this.height) {
        setStyle.height = this.height
      }

      return Object.assign({}, setStyle, this.iconStyle)
    }
  }
}
</script>
<style lang="scss" scoped>
  .svgBox{
    display: inline-block;
  }
  /*svg {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    overflow: hidden;
  }*/
</style>
