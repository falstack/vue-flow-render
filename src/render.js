const getWrapElement = dom => {
  let el = dom
  while (
    el &&
    el.tagName !== 'HTML' &&
    el.nodeType === 1
  ) {
    const overflowY = window.getComputedStyle(el).overflowY
    const overflow = window.getComputedStyle(el).overflow
    if (overflowY === 'hidden' || overflow === 'hidden') {
      return el
    }
    el = el.parentNode
  }
  return dom.parentNode
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
      required: true,
      default: 0
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
  data () {
    return {
      wrapHeight: 0,
      offsetTop: 0,
      lastScrollTop: 0,
      start: 0,
      flowHeight: 0,
      paddingTop: 0,
      cache: {}
    }
  },
  computed: {
    isSameHeight () {
      return this.height !== 0
    },
    isSingleColumn () {
      return this.column === 1
    }
  },
  watch: {
    total (newVal, oldVal) {
      if (!newVal) {
        this.clear()
      } else if (newVal < oldVal) {
        this.clear()
        this._computeRenderHeight(this.$slots.default, 0)
      } else {
        this._computeRenderHeight(this.isSameHeight ? undefined : this.$slots.default.slice(oldVal, newVal), oldVal)
      }
      this.scroll(this.lastScrollTop, false)
    }
  },
  mounted () {
    this.setOffset()
    this.setWrap()
    this._computeRenderHeight(this.$slots.default, 0)
  },
  methods: {
    setOffset () {
      this.offsetTop = this.$el.offsetTop
    },
    setWrap (el) {
      this.wrapHeight = (el || getWrapElement(this.$el)).clientHeight
    },
    getRect (index) {
      return this.cache[index]
    },
    scroll (offset, up) {
      const isUp = up === undefined ? offset < this.lastScrollTop : up
      this.lastScrollTop = offset
      const { cache, start, remain, total } = this
      /**
       * 元素比较少，还不需要懒加载
       */
      if (remain >= total) {
        return
      }
      /**
       * 如果在顶部，则直接修正
       */
      const scrollTop = offset - this.offsetTop
      if (scrollTop <= 0) {
        this.paddingTop = 0
        this.start = 0
        return
      }
      /**
       * 如果触底了，则直接修正
       */
      const scrollBottom = scrollTop + this.wrapHeight
      if (scrollBottom >= cache[total - 1].bottom) {
        this.start = total - remain
        this.paddingTop = cache[total - remain].top
        return
      }

      const { isSameHeight, column, height } = this
      /**
       * 向上修正
       */
      const adjustUp = () => {
        const detectRect = cache[start]
        const deltaHeight = detectRect.top - scrollTop
        /**
         * 如果当前列表的第一个元素的顶部在视口的上方，则不用修正
         */
        if (deltaHeight <= 0) {
          return
        }
        if (isSameHeight) {
          /**
           * 如果元素是等高的，直接根据高度差算出需要修正的距离
           */
          const decreaseCount = Math.abs(Math.ceil(deltaHeight / height / column))
          const index = Math.max((start - decreaseCount - remain / 2 | 0), 0)
          this.start = index
          this.paddingTop = cache[index].top
        } else {
          /**
           * 如果元素不等高
           * 从当前列表的上一个元素开始，到第 0 个元素结束
           * 寻找第一个顶部在视口边界的元素
           */
          for (let i = start - 1; i >= 0; i--) {
            if (cache[i].top <= scrollTop) {
              const index = Math.max(i - remain / 2 | 0, 0)
              this.paddingTop = cache[index].top
              this.start = index
              break
            }
          }
        }
      }
      /**
       * 向下修正
       */
      const adjustDown = () => {
        const detectRect = cache[start + remain - 1]
        const deltaHeight = detectRect.bottom - scrollBottom
        /**
         * 如果当前列表的最后一个元素的底部在视口的下方，则不用修正
         */
        if (deltaHeight >= 0) {
          return
        }
        if (isSameHeight) {
          /**
           * 如果元素是等高的，直接根据高度差算出需要修正的距离
           */
          const increaseCount = Math.abs(Math.floor(deltaHeight / height / column))
          const index = Math.min(start + increaseCount + remain / 2 | 0, total - remain)
          this.start = index
          this.paddingTop = cache[index].top
        } else {
          /**
           * 如果元素不等高
           * 从当前列表的最后一个元素的下一个元素开始，到最后一个元素结束
           * 寻找第一个底部在视口边界的元素
           */
          for (let i = start + remain; i < total; i++) {
            if (cache[i].bottom >= scrollBottom) {
              const index = Math.min(i + 1 - remain / 2 | 0, total - remain)
              this.paddingTop = cache[index].top
              this.start = index
              break
            }
          }
        }
      }
      /**
       * 向上滚动很久后忽然再向下再停止就会按照是向下滚动去修复了
       * 所以这里只能对上下都进行修复
       */
      isUp ? adjustUp() : adjustDown()
    },
    clear () {
      this.flowHeight = 0
      this.paddingTop = 0
      this.start = 0
      this.cache = {}
    },
    _computeRenderHeight (items, offset) {
      const { total, column, cache } = this
      if (!total) {
        return
      }
      if (this.isSameHeight) {
        const height = this.height
        const end = items ? items.length + offset : total
        if (this.isSingleColumn) {
          for (let i = offset; i < end; i++) {
            const top = height * Math.floor(i / column)
            cache[i] = {
              top,
              height,
              bottom: height + top
            }
          }
          this.flowHeight = height * Math.ceil(total / column)
        } else {
          for (let i = offset; i < end; i++) {
            const top = height * i
            cache[i] = {
              top,
              height,
              bottom: height + top
            }
          }
          this.flowHeight = height * total
        }
      } else {
        if (this.isSingleColumn) {
          let beforeHeight = offset ? cache[offset - 1].bottom : 0
          items.forEach((item, index) => {
            const hgt = parseInt(item.data.style.height, 10)
            cache[index + offset] = {
              top: beforeHeight,
              bottom: hgt + beforeHeight,
              height: hgt
            }
            beforeHeight += hgt
          })
          this.flowHeight = beforeHeight
        } else {
          let offsets
          if (offset) {
            offsets = []
            for (let i = offset - column, end = offset - 1; i <= end; i++) {
              offsets.push(cache[i].bottom)
            }
          } else {
            offsets = new Array(column).fill(0)
          }
          items.forEach((item, index) => {
            const beforeHeight = Math.min(...offsets)
            const hgt = parseInt(item.data.style.height, 10)
            cache[index + offset] = {
              top: beforeHeight,
              bottom: hgt + beforeHeight,
              height: hgt
            }
            offsets[offsets.indexOf(beforeHeight)] += hgt
          })
          this.flowHeight = Math.max(...offsets)
        }
      }
    },
    _filter (h) {
      const { remain, total, start, item } = this
      const end = remain >= total ? total : start + remain

      if (item) {
        const result = []
        for (let i = start; i < end; i++) {
          result.push(h(item, this.getter(i)))
        }
        return result
      }

      if (!this.$slots.default) {
        return []
      }
      return this.$slots.default.slice(start, end)
    }
  },
  render: function (h) {
    return h('div', {
      'style': {
        boxSizing: 'border-box',
        willChange: 'padding-top',
        paddingTop: `${this.paddingTop}px`,
        height: `${this.flowHeight}px`
      },
      'class': 'vue-flow-render'
    }, this._filter(h))
  }
}
