<template>
  <transition-group
    v-if="canRender"
    :name="transition"
    :style="containerStyle"
    tag="div"
  >
    <div v-for="item in filterList" :key="item.id" :style="item._style">
      <slot name="item" :item="item" />
    </div>
  </transition-group>
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
  props: {
    lineCount: {
      required: true,
      type: Number,
      validator: val => val >= 1
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
      default: 2,
      validator: val => val >= 1
    },
    list: {
      type: Array,
      required: true
    },
    transition: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      height: 0,
      lineHeight: new Array(this.lineCount).fill(0),
      lastScrollTop: 0,
      windowHeight: this.$isServer ? 0 : window.innerHeight,
      windowWidth: this.$isServer ? 0 : window.innerWidth,
      virtualList: [],
      filterList: [],
      beginIndex: -1,
      endIndex: 0,
      centerIndex: -1,
      isScrollDown: false,
      canRender: false
    }
  },
  computed: {
    containerStyle() {
      return {
        height: `${this.height - this.marginBottom}px`,
        position: 'relative',
        overflow: 'hidden'
      }
    },
    containerOffsetTop() {
      if (!this.$el) {
        return 0
      }
      return getOffsetTop(this.$el)
    },
    onceRenderItemCount() {
      const itemAvgHeight = (this.height - this.marginBottom) / this.list.length
      return (
        Math.ceil((this.windowHeight * this.lazyScale) / itemAvgHeight) *
        this.lineCount
      )
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
          ((this.$el.offsetWidth - shim) * lineWidth.replace('%', '')) / 100
        ).toFixed(2)
      }
      return +lineWidth.replace('px', '')
    }
  },
  mounted() {
    this.canRender = true
    this.$nextTick(() => {
      this.$watch(
        'list',
        function(newVal) {
          this.virtualList = this.virtualList.concat(
            newVal.slice(this.virtualList.length).map(this.computeStyle)
          )
          this.render(true)
        },
        {
          deep: false,
          immediate: true
        }
      )
    })
    on(window, 'scroll', this.onScreenScroll)
  },
  beforeDestroy() {
    off(window, 'scroll', this.onScreenScroll)
  },
  methods: {
    onScreenScroll: throttle(function() {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      this.isScrollDown = scrollTop > this.lastScrollTop
      this.lastScrollTop = scrollTop
      this.render()
    }, 200),
    computeStyle(item) {
      const displayLine = this.computeItemColIndex()
      const itemHeight = this.computeItemHeight(item)
      const lineHeight = this.lineHeight[displayLine]
      item._style = {
        position: 'absolute',
        left: `${displayLine * (this.imageWidth + this.marginRight)}px`,
        top: `${lineHeight}px`,
        width: `${this.imageWidth}px`,
        height: `${itemHeight}px`,
        marginBottom: `${this.marginBottom}px`
      }
      const containerTop = this.containerOffsetTop
      item._pos = {
        top: containerTop + lineHeight,
        bottom: containerTop + lineHeight + itemHeight
      }
      this.checkInView(item)
      this.lineHeight[displayLine] = +parseFloat(
        lineHeight + itemHeight + this.marginBottom
      ).toFixed(2)
      this.computeContainerHeight()
      return item
    },
    computeItemColIndex() {
      const { lineHeight } = this
      return lineHeight.indexOf(Math.min(...lineHeight))
    },
    computeItemHeight(item) {
      const result =
        +parseFloat((item.height / item.width) * this.imageWidth).toFixed(2) +
        (this.vwViewport
          ? (this.extraHeight * this.windowWidth) / this.vwViewport
          : this.extraHeight)
      if (this.maxHeight && result > this.maxHeight) {
        return this.maxHeight
      }
      return result
    },
    computeContainerHeight() {
      this.height = Math.max(...this.lineHeight)
    },
    render(reset = false) {
      let offset, begin, end
      if (reset) {
        offset = 0
        begin = 0
        end = this.virtualList.length
      } else {
        begin = this.beginIndex - this.onceRenderItemCount
        end = this.beginIndex + this.onceRenderItemCount
        if (begin < 0) {
          begin = 0
        }
        if (end > this.list.length) {
          end = this.list.length
        }
        offset = begin
      }
      const renderList = this.virtualList.slice(begin, end)
      let lastRendered = false
      for (const item of renderList) {
        const result = this.checkInView(item)
        if (result) {
          lastRendered = true
        }
        if (!lastRendered && !result) {
          offset++
        }
        if (lastRendered && !result) {
          break
        }
      }
      const list = renderList.filter(_ => _._display)
      this.beginIndex = offset
      this.filterList = list
      if (!list.length) {
        this.render(true)
      }
    },
    checkInView(item) {
      const { lastScrollTop, windowHeight, lazyScale } = this
      const { top, bottom } = item._pos
      const result =
        Math.abs(lastScrollTop - top) <= windowHeight * lazyScale &&
        Math.abs(lastScrollTop + windowHeight - bottom) <=
          windowHeight * lazyScale
      item._display = result
      return result
    }
  }
}
</script>
