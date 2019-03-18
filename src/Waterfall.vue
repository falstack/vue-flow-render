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
const throttle = (func, wait, options) => {
  let context, args, result
  let timeout = null
  let previous = 0
  if (!options) options = {}
  const later = function() {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function() {
    const now = Date.now()
    if (!previous && options.leading === false) previous = now
    const remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

const getOffsetTop = elem => {
  let offsetTop = 0
  do {
    if (!isNaN(elem.offsetTop)) {
      offsetTop += elem.offsetTop
    }
  } while ((elem = elem.offsetParent))
  return offsetTop
}

const on = (elem, type, listener, useCapture = false) => {
  elem.addEventListener(type, listener, useCapture)
}
const off = (elem, type, listener, useCapture = false) => {
  elem.removeEventListener(type, listener, useCapture)
}

export default {
  name: 'Waterfall',
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
    },
    extraHeight: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    maxHeight: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    vwViewport: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    lazyScale: {
      type: Number,
      default: 1.3,
      validator: val => val >= 1
    }
  },
  data() {
    return {
      height: 0,
      lineHeight: new Array(this.lineCount).fill(0),
      lastScrollTop: 0,
      rectTop: '',
      windowHeight: this.$isServer ? 0 : window.innerHeight,
      windowWidth: this.$isServer ? 0 : window.innerWidth
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
      const shim = (this.lineCount - 1) * this.marginRight
      if (/vw$/.test(lineWidth)) {
        return +parseFloat(
          ((this.windowWidth - shim) * lineWidth.replace('vw', '')) / 100
        ).toFixed(2)
      }
      if (/%$/.test(lineWidth)) {
        return +parseFloat(
          ((this.$el.parentNode.offsetWidth - shim) *
            lineWidth.replace('%', '')) /
            100
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
    on(window, 'scroll', this.onScreenScroll)
  },
  beforeDestroy() {
    off(window, 'scroll', this.onScreenScroll)
  },
  methods: {
    onScreenScroll: throttle(function() {
      this.lastScrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      this.showOrHiddenItem()
    }, 200),
    renderHandler(item) {
      const displayLine = this.computeItemColIndex()
      const itemHeight = this.computedItemHeight(item)
      const showMargin = item.index >= this.lineCount
      const lineHeight = this.lineHeight[displayLine]
      item.style = {
        left: `${displayLine * (this.imageWidth + this.marginRight)}px`,
        top: `${lineHeight}px`,
        width: `${this.imageWidth}px`,
        height: `${itemHeight}px`,
        marginTop: showMargin ? `${this.marginBottom}px` : ''
      }
      const containerTop = this.getContainerRectTop()
      item.top = containerTop + lineHeight
      item.bottom = containerTop + lineHeight + itemHeight
      this.checkInView(item)
      this.lineHeight[displayLine] = +parseFloat(
        lineHeight + (showMargin ? itemHeight + this.marginBottom : itemHeight)
      ).toFixed(2)
      this.computeContainerHeight()
    },
    computeItemColIndex() {
      const { lineHeight } = this
      return lineHeight.indexOf(Math.min(...lineHeight))
    },
    computedItemHeight(item) {
      const result =
        +parseFloat((item.height / item.width) * this.imageWidth).toFixed(2) +
        (this.extraHeight * this.windowWidth) / this.vwViewport
      if (this.maxHeight && result > this.maxHeight) {
        return this.maxHeight
      }
      return result
    },
    computeContainerHeight() {
      this.height = Math.max(...this.lineHeight)
    },
    showOrHiddenItem() {
      this.$children.forEach(this.checkInView)
    },
    checkInView(item) {
      const { lastScrollTop, windowHeight, lazyScale } = this
      item.display =
        item.top < (lastScrollTop + windowHeight) * lazyScale &&
        item.bottom > lastScrollTop / lazyScale
    },
    getContainerRectTop() {
      if (this.rectTop !== '') {
        return this.rectTop
      }
      const top = getOffsetTop(this.$el)
      this.rectTop = top
      return top
    }
  }
}
</script>
