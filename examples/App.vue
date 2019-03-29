<style lang="scss">
#app {
  ul {
    padding: 0;
    margin: 0;
  }

  .demo {
    width: 100%;
    height: 100%;
    text-align: center;
    border-radius: 8px;
    box-shadow: 0 1px 3px 0 rgba(80, 80, 80, 0.11);
    overflow: hidden;
    position: relative;

    .image {
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    .panel {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
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
    <vue-flow-render
      line-width="50%"
      :line-count="2"
      :margin-bottom="10"
      :margin-right="10"
      :extra-height="40"
      :vw-viewport="375"
      :max-height="400"
      :list="items"
    >
      <div slot-scope="{ item }" slot="item" class="demo">
        <div
          :style="{
            backgroundColor: item.style.color,
            paddingTop: `${(item.height / item.width) * 100}%`
          }"
          class="image"
        >
          {{ item._pos.top }} - {{ item._pos.bottom }}
        </div>
        <div class="panel">{{ item.index }}</div>
      </div>
    </vue-flow-render>
  </div>
</template>

<script>
import ItemFactory from './item-factory'
import VueFlowRender from '../src/VueFlowRender.vue'

export default {
  name: 'app',
  components: {
    VueFlowRender
  },
  data() {
    return {
      items: ItemFactory.get(10000)
    }
  }
}
</script>
