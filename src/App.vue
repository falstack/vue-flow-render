<style lang="scss">
#app {
  .demo {
    width: 100%;
    height: 100%;
    text-align: center;
  }
}
</style>

<template>
  <div id="app">
    <waterfall
      :line-count="2"
      :line-width="140"
      :margin-bottom="10"
      :margin-right="10"
    >
      <waterfall-slot
        v-for="item in items"
        :key="item.index"
        :index="item.index"
        :width="item.width"
        :height="item.height"
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
