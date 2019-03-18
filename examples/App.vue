<style lang="scss">
#app {
  #lag-container {
    z-index: 999;
    position: fixed;
    right: 10px;
    top: 10px;
  }
  .demo {
    width: 100%;
    height: 100%;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(80, 80, 80, 0.11);
    overflow: hidden;

    .image {
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .panel {
      height: 40px;
      line-height: 40px;
      background-color: RGB(241, 243, 244);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    transform: scale(0.5);
  }
}
</style>

<template>
  <div id="app">
    <div id="lag-container" />
    <waterfall
      line-width="50%"
      :line-count="2"
      :margin-bottom="10"
      :margin-right="10"
      :extra-height="40"
      :vw-viewport="375"
    >
      <waterfall-slot
        v-for="item in items"
        :key="item.index"
        :index="item.index"
        :width="item.width"
        :height="item.height"
        transition="fade"
      >
        <div class="demo">
          <div
            :style="{
              backgroundColor: item.style.color,
              backgroundImage: `url(${item.style.image})`,
              paddingTop: `${(item.height / item.width) * 100}%`
            }"
            class="image"
          />
          <div class="panel">{{ item.index }}</div>
        </div>
      </waterfall-slot>
    </waterfall>
  </div>
</template>

<script>
import ItemFactory from './item-factory'
import Waterfall from '../src/Waterfall.vue'
import WaterfallSlot from '../src/WaterfallSlot.vue'
import './justice'

export default {
  name: 'app',
  components: {
    Waterfall,
    WaterfallSlot
  },
  data() {
    return {
      items: ItemFactory.get(100)
    }
  },
  mounted() {
    window.Justice.init({
      showFPS: true
    })
  }
}
</script>
