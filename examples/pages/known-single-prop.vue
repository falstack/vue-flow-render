<style lang="scss">
#component {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding-top: 15px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  .banner {
    width: 100%;
    height: 200px;
    background-color: cornflowerblue;
    margin-bottom: 15px;
  }

  .demo {
    box-sizing: border-box;
    padding: 0 15px 15px;
    height: 100px;

    div {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 100%;
      border-radius: 8px;
      box-shadow: 0 1px 3px 0 rgba(80, 80, 80, 0.11);
    }
  }
}
</style>

<template>
  <div
    id="component"
    @scroll="handleScroll"
  >
    <div class="banner">
      这里有一个banner卡位
    </div>
    <v-render
      ref="render"
      :total="1000"
      :remain="10"
      :height="100"
      :item="item"
      :getter="getProps"
    />
  </div>
</template>

<script>
import Item from '../Item'

export default {
  name: 'UnknownSingle',
  data() {
    return {
      items: this.$factory.get(1000),
      item: Item
    }
  },
  methods: {
    handleScroll(evt) {
      this.$refs.render.scroll(evt.target.scrollTop)
    },
    getProps(index) {
      return {
        props: {
          item: this.items[index],
          index
        }
      }
    }
  }
}
</script>
