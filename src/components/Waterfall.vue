<style lang="scss">
.vue-waterfall-container {
  position: relative;
}
</style>

<template>
  <div :style="containerStyle" class="vue-waterfall-container">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Waterfall',
  components: {},
  props: {
    lineCount: {
      required: true,
      type: Number,
      validator: val => val >= 2
    },
    lineWidth: {
      required: true,
      type: [Number, String]
    },
    marginRight: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    marginBottom: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    }
  },
  data() {
    return {
      height: 0,
      lineHeight: new Array(this.lineCount).fill(0)
    }
  },
  computed: {
    containerStyle() {
      return {
        height: `${this.height}px`
      }
    },
    imageWidth() {
      if (this.$isServer) {
        return 0
      }
      const toString = {}.toString
      const isNumber = value => toString.call(value) === '[object Number]'
      const lineWidth = this.lineWidth
      if (isNumber(lineWidth)) {
        return lineWidth
      }
      if (/vw$/.test(lineWidth)) {
        return +parseFloat(
          (window.innerWidth * lineWidth.replace('vw', '')) / 100
        ).toFixed(2)
      }
      if (/%$/.test(lineWidth)) {
        return +parseFloat(
          (this.$el.parentNode.offsetWidth * lineWidth.replace('%', '')) / 100
        ).toFixed(2)
      }
      return +lineWidth.replace('px', '')
    }
  },
  created() {
    if (this.$isServer) {
      return
    }
    this.$on('render', this.renderHandler)
  },
  mounted() {},
  methods: {
    renderHandler(item) {
      const displayLine = this.computeItemColIndex()
      const imageHeight = this.computedItemHeight(item)
      const showMargin = item.index >= this.lineCount
      const lineHeight = this.lineHeight[displayLine]
      item.style = {
        left: `${displayLine * (this.imageWidth + this.marginRight)}px`,
        top: `${lineHeight}px`,
        width: `${this.imageWidth}px`,
        height: `${imageHeight}px`,
        marginTop: showMargin ? `${this.marginBottom}px` : ''
      }
      this.lineHeight[displayLine] = +parseFloat(
        lineHeight +
          (showMargin ? imageHeight + this.marginBottom : imageHeight)
      ).toFixed(2)
      this.computeContainerHeight()
    },
    computeItemColIndex() {
      const { lineHeight } = this
      return lineHeight.indexOf(Math.min(...lineHeight))
    },
    computedItemHeight(item) {
      return +parseFloat((item.height / item.width) * this.imageWidth).toFixed(
        2
      )
    },
    computeContainerHeight() {
      this.height = Math.max(...this.lineHeight)
    }
  }
}
</script>
