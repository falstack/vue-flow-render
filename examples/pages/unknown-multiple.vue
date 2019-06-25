<style lang="scss">
#multiple {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: 10px 10px 0;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .banner {
    width: 100%;
    height: 200px;
    background-color: cornflowerblue;
    margin-bottom: 15px;
  }

  .demo {
    position: absolute;
    width: 50%;
    box-sizing: border-box;
    padding-bottom: 10px;

    >div {
      height: 100%;
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 1px 3px 0 rgba(80, 80, 80, 0.11);
      overflow: hidden;
      padding-bottom: 40px;
      box-sizing: border-box;
      background-color: #fafbfc;

      >div {
        position: relative;
        height: 0;

        >div {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

<template>
  <div
    id="multiple"
    @scroll="handleScroll"
  >
    <v-render
      ref="render"
      :total="1000"
      :remain="16"
      :column="2"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        :style="getItemStyle(item, index)"
        class="demo"
      >
        <div>
          <div :style="{
            backgroundColor: item.style.color,
            paddingTop: `${(item.height / item.width * 100)}%`
          }">
            <div>
              <span>index：{{ index }}</span>
              <span>width：{{ item.width }}</span>
              <span>height：{{ item.height }}</span>
            </div>
          </div>
        </div>
      </div>
    </v-render>
  </div>
</template>

<script>
export default {
  name: 'UnknownMultiple',
  data() {
    return {
      items: this.$factory.get(1000),
      width: (window.screen.width - 20) / 2 - 5,
      column: [0, 0],
      cache: {}
    }
  },
  methods: {
    handleScroll(evt) {
      this.$refs.render.scroll(evt.target.scrollTop)
    },
    getItemStyle(item, index) {
      if (this.cache[index]) {
        return this.cache[index]
      }
      const { width, column } = this
      const height = item.height * (width / item.width) + 50
      const columnIndex = index < column.length ? index % 2 : column.indexOf(Math.min(...column))
      const top = column[columnIndex]
      this.column[columnIndex] += height
      const result = {
        height: `${height}px`,
        width: `${width}px`,
        top: `${top}px`,
        left: columnIndex ? `${width + 10}px` : 0
      }
      this.cache[index] = result
      return result
    }
  }
}
</script>
