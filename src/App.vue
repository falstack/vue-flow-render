<style lang="scss">
#app {
  .demo {
    width: 100%;
    height: 100%;
    text-align: center;
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
    <waterfall
      line-width="50%"
      :line-count="2"
      :margin-bottom="10"
      :margin-right="10"
    >
      <waterfall-slot
        v-for="item in items"
        :key="item.index"
        :index="item.index"
        :width="item.width"
        :height="item.height"
        transition="fade"
      >
        <div
          :style="{ backgroundColor: `${item.style.background}` }"
          class="demo"
        >
          {{ item.index }}
        </div>
      </waterfall-slot>
    </waterfall>
  </div>
</template>

<script>
import Waterfall from './components/Waterfall.vue'
import WaterfallSlot from './components/WaterfallSlot.vue'
import ItemFactory from './item-factory'

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
  }
}
</script>
