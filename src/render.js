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
    offset: {
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
    offset(val) {
      this._handleScroll(val)
    },
    total(newVal, oldVal) {
      this._computeRenderHeight(this.$slots.default.slice(oldVal, newVal), oldVal.length)
    }
  },
  mounted() {
    this._computeRenderHeight(this.$slots.default, 0)
  },
  beforeUpdate() {
    if (this.isUp) {
      const rect = this._getItemOffset(this.start)
      if (rect.top + rect.height > this.lastScrollTop) {
        console.log('re compute start')
      }
    } else {
      const rect = this._getItemOffset(this.start + this.remain)
      if (rect.top < this.lastScrollTop) {
        console.log('re compute start')
      }
    }
  },
  methods: {
    _handleScroll(offset) {
      this.isUp = offset < this.lastScrollTop
      this.lastScrollTop = offset
      const { start, remain } = this

      if (this.isUp) {
        if (!start) {
          return
        }
        const startRect = this._getItemOffset(start - 1)
        const endRect = this._getItemOffset(start + remain - 1)
        if (endRect.top > offset + this.$el.parentElement.clientHeight) {
          this.style.paddingTop -= startRect.height
          this.start--
        }
      } else {
        if (start + remain >= this.total) {
          return
        }
        const startRect = this._getItemOffset(start)
        if (startRect.top + startRect.height < offset) {
          this.style.paddingTop += startRect.height
          this.start++
        }
      }
    },
    _getItemOffset(index) {
      if (this.isSameHeight) {
        return this.height * index
      }
      return this.cache[index]
    },
    _computeRenderHeight(items, offset) {
      const { height, isSameHeight, total, column } = this
      if (!total) {
        return
      }
      if (isSameHeight) {
        // 如果指定了高度，那就是说 item 都是相同的固定高度
        this.style.height = height * total / column
      } else {
        // item 的高度必须写在 item 的 style 上
        const { cache } = this
        if (this.isSingleColumn) {
          let beforeHeight = offset ? cache[offset - 1].top + cache[offset - 1].height : 0
          items.forEach((item, index) => {
            const hgt = +item.data.style.height.replace('px', '')
            cache[index + offset] = {
              height: hgt,
              top: beforeHeight
            }
            beforeHeight += hgt
          })
          this.style.height = beforeHeight
        } else {
          items.forEach((item, index) => {
            const beforeHeight = offset > column - 1 ? cache[offset - column].top + cache[offset - column].height : 0
            const hgt = +item.data.style.height.replace('px', '')
            cache[index + offset] = {
              height: hgt,
              top: beforeHeight
            }
            if (beforeHeight + hgt > this.style.height) {
              this.style.height = beforeHeight + hgt
            }
          })
        }
      }
    },
    _filter(h) {
      const { remain, total, start } = this
      const slots = this.$slots.default

      if (remain >= total) {
        return slots
      }

      return slots.slice(start, start + remain)
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
