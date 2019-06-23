<style lang="scss">
#app {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding-top: 15px;
  overflow: auto;

  ul {
    padding: 0;
    margin: 0;
  }

  .demo {
    box-sizing: border-box;
    padding: 0 15px 15px;

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
  <div
    id="app"
    @scroll="handleScroll"
  >
    <v-render
      :total="100"
      :remain="10"
      :offset="offset"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        :style="{ height: `${item.height}px` }"
        class="demo"
      >
        <div :style="{ backgroundColor: item.style.color }">
          {{ index }}
        </div>
      </div>
    </v-render>
  </div>
</template>

<script>
import ItemFactory from './item-factory'

export default {
  name: 'App',
  data() {
    return {
      items: ItemFactory.get(100),
      offset: 0
    }
  },
  methods: {
    handleScroll(evt) {
      this.offset = evt.target.scrollTop
    }
  }
}
</script>
