import { debounce } from 'throttle-debounce'

const getOffsetTop = elem => {
  let offsetTop = 0
  do {
    if (!isNaN(elem.offsetTop)) {
      offsetTop += elem.offsetTop
    }
  } while ((elem = elem.offsetParent))
  return offsetTop
}

export default {
  name: 'VueFlowRender',
  props: {
    column: {
      type: Number,
      default: 1,
      validator: val => val >= 1
    },
    height: {
      type: Number,
      default: 0,
      validator: val => val >= 0
    },
    remain: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    item: {
      type: Object,
      default: null
    },
    getter: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      offsetTop: 0,
      lastScrollTop: 0,
      isUp: false,
      start: 0,
      style: {
        height: 0,
        paddingTop: 0
      },
      cache: {}
    }
  },
  computed: {
    isSameHeight() {
      return this.height !== 0
    },
    isSingleColumn() {
      return this.column === 1
    }
  },
  watch: {
    total(newVal, oldVal) {
      this._computeRenderHeight(this.$slots.default.slice(oldVal, newVal), oldVal.length)
    }
  },
  mounted() {
    this._computeRenderHeight(this.$slots.default, 0)
    this.setOffsetTop()
  },
  beforeUpdate() {
    this._resetStart()
  },
  methods: {
    setOffsetTop() {
      this.offsetTop = getOffsetTop(this.$el)
    },
    scroll(offset) {
      this.isUp = offset < this.lastScrollTop
      this.lastScrollTop = offset
      const { start, remain, cache, offsetTop, isUp } = this
      if (offset - offsetTop <= 0) {
        this.start = 0
        this.style.paddingTop = 0
        return
      }
      if (isUp) {
        if (this.start <= 0) {
          this.style.paddingTop = 0
          this.start = 0
          return
        }
        const condition = offset - offsetTop
        if (
          cache[start + remain - 1].top > condition + this.$el.parentElement.clientHeight ||
          cache[start].top > condition
        ) {
          this.style.paddingTop -= cache[start - 1].height
          this.start--
          if (this.start < 0) {
            this.start = 0
          }
        }
      } else {
        const { total } = this
        if (start + remain >= total) {
          this.start = total - remain
          this.style.paddingTop = cache[total - remain].top
          return
        }
        const condition = offset - offsetTop
        if (
          cache[start].bottom < condition ||
          cache[start + remain - 1].bottom < condition + this.$el.parentElement.clientHeight
        ) {
          this.style.paddingTop += cache[start].height
          this.start++
        }
      }
    },
    _resetStart: debounce(17, function() {
      const { lastScrollTop, cache, start, isSameHeight, height, remain, column, offsetTop } = this
      const resetUp = () => {
        if (this.start <= 0) {
          this.start = 0
          this.style.paddingTop = 0
          return
        }
        const detectRect = cache[start]
        const offset = lastScrollTop - offsetTop
        const deltaHeight = detectRect.top - offset
        if (deltaHeight > 0) {
          if (isSameHeight) {
            const decreaseCount = Math.abs(Math.ceil(deltaHeight / height / column))
            this.start = Math.max(start - decreaseCount, 0)
            this.style.paddingTop -= decreaseCount * height
          } else {
            for (let i = start - 1; i >= 0; i--) {
              const rect = cache[i]
              if (rect.top <= offset) {
                this.style.paddingTop = rect.top
                this.start = i
                break
              }
            }
          }
        }
      }
      const resetDown = () => {
        const { total } = this
        if (start + remain >= total) {
          this.start = total - remain
          this.style.paddingTop = cache[total - remain].top
          return
        }
        const detectRect = cache[start + remain - 1]
        const offset = lastScrollTop - offsetTop + this.$el.parentElement.clientHeight
        const deltaHeight = detectRect.bottom - offset
        if (deltaHeight < 0) {
          if (isSameHeight) {
            const increaseCount = Math.abs(Math.floor(deltaHeight / height / column))
            this.start = Math.min(start + increaseCount, total - remain)
            this.style.paddingTop += increaseCount * height
          } else {
            for (let i = start + remain; i <= total - remain; i++) {
              const rect = cache[i]
              if (rect.bottom >= offset) {
                this.style.paddingTop = rect.top
                this.start = i
                break
              }
            }
          }
        }
      }
      resetUp()
      resetDown()
    }),
    _computeRenderHeight(items, offset) {
      const { height, isSameHeight, total, column, cache, isSingleColumn } = this
      if (!total) {
        return
      }
      if (isSameHeight) {
        if (isSingleColumn) {
          for (let i = 0; i < items.length; i++) {
            const top = height * i
            cache[i + offset] = {
              height,
              top,
              bottom: height + top
            }
          }
        } else {
          for (let i = 0; i < items.length; i++) {
            const top = height * Math.floor(i / column)
            cache[i + offset] = {
              height,
              top,
              bottom: height + top
            }
          }
        }
        this.style.height = height * total / column
      } else {
        if (isSingleColumn) {
          let beforeHeight = offset ? cache[offset - 1].bottom : 0
          items.forEach((item, index) => {
            const hgt = +item.data.style.height.replace('px', '')
            cache[index + offset] = {
              height: hgt,
              top: beforeHeight,
              bottom: hgt + beforeHeight
            }
            beforeHeight += hgt
          })
          this.style.height = beforeHeight
        } else {
          let offsets
          if (offset) {
            for (let i = offset - column; i <= offset - 1; i++) {
              offsets.push(cache[i].bottom)
            }
          } else {
            offsets = new Array(column).fill(0)
          }
          items.forEach((item, index) => {
            const realIndex = index + offset
            const beforeHeight = Math.min(...offsets)
            const hgt = +item.data.style.height.replace('px', '')
            cache[realIndex] = {
              height: hgt,
              top: beforeHeight,
              bottom: hgt + beforeHeight
            }
            offsets[offsets.indexOf(beforeHeight)] += hgt
          })
          this.style.height = Math.max(...offsets)
        }
      }
    },
    _filter(h) {
      const { remain, total, start, item, getter } = this
      const end = remain >= total ? total : start + remain

      if (item) {
        const result = []
        for (let i = start; i < end; i++) {
          result.push(h(item, getter(i)))
        }
        return result
      }

      return this.$slots.default.slice(start, end)
    }
  },
  render: function(h) {
    const { paddingTop, height } = this.style
    const list = this._filter(h)

    return h('div', {
      'style': {
        boxSizing: 'border-box',
        height: `${height}px`,
        paddingTop: `${paddingTop}px`
      },
      'class': 'vue-flow-render'
    }, list)
  }
}
