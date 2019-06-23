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
    const { column } = this
    const lineHeight = []
    if (column !== 1) {
      for (let i = 0; i < column; i++) {
        lineHeight.push([])
      }
    }
    return {
      lineHeight,
      lastScrollTop: 0,
      renderHeight: 0,
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
      this._computeRenderHeight(this.$slots.default.slice(oldVal, newVal))
    }
  },
  mounted() {
    this._computeRenderHeight(this.$slots.default)
  },
  methods: {
    _handleScroll(offset) {
      const isUp = offset < this.lastScrollTop
      const { start, remain } = this
      const startRect = this._getItemOffset(start)

      if (isUp) {
        if (!start) {
          return
        }
        const endRect = this._getItemOffset(start + remain - 1)
        if (endRect.top > offset + this.$el.parentElement.clientHeight) {
          this.start--
          this.style.paddingTop -= startRect.height
        }
      } else {
        if (start + remain >= this.total) {
          return
        }
        if (startRect.bottom < offset) {
          this.style.paddingTop += startRect.height
          this.start++
        }
      }
      this.lastScrollTop = offset
    },
    _getItemOffset(index) {
      if (this.cache[index]) {
        return this.cache[index]
      }

      let top = 0
      const { column, isSingleColumn, isSameHeight, height } = this

      if (!index) {
        top = 0
      } else if (isSameHeight) {
        top = height * Math.floor(index / column)
      } else if (isSingleColumn) {
        top = this.lineHeight.slice(0, index).reduce((a, b) => a + b)
      } else {
        for (let i = 0; i < index; i += column) {
          top += this.lineHeight[column][i]
        }
      }

      const hgt = isSameHeight
        ? height
        : isSingleColumn
          ? this.lineHeight[index]
          : this.lineHeight[index % column][Math.floor(index / column)]
      const result = {
        top,
        bottom: top + hgt,
        height: hgt
      }
      this.cache[index] = result
      return result
    },
    _computeRenderHeight(items) {
      const { height, isSameHeight, isSingleColumn, total, column } = this
      if (!total) {
        return
      }
      if (isSameHeight) {
        // 如果指定了高度，那就是说 item 都是相同的固定高度
        this.style.height = height * total / column
      } else {
        // item 的高度必须写在 item 的 style 上
        if (isSingleColumn) {
          items.forEach(item => {
            this.lineHeight.push(+item.data.style.height.replace('px', ''))
          })
          this.style.height = this.lineHeight.reduce((a, b) => a + b)
        } else {
          items.forEach((item, index) => {
            this.lineHeight[index % column].push(+item.data.style.height.replace('px', ''))
          })
          this.style.height = Math.max(...this.lineHeight.map(_ => _.reduce((a, b) => a + b)))
        }
      }
    },
    _filter(h) {
      const { remain, total, start, isSameHeight } = this
      const slots = this.$slots.default
      let result

      if (remain >= total) {
        result = slots
      } else {
        result = slots.slice(start, start + remain)
      }

      this.renderHeight = isSameHeight
        ? result.length * this.height
        : result.map(_ => +_.data.style.height.replace('px', '')).reduce((a, b) => a + b)

      return result
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
