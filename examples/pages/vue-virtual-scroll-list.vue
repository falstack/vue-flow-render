<style lang="scss">
#virtual-list {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  padding-top: 15px;
  overflow: auto;

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
  <div id="virtual-list">
    <virtual-list
      :size="100"
      :remain="10"
      :item="item"
      :itemcount="total"
      :itemprops="getItemprops"
    />
  </div>
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import Item from '../Item'

export default {
  name: 'VueVirtualScrollList',
  components: {
    VirtualList
  },
  data() {
    const total = 100000
    return {
      total,
      items: this.$factory.get(total),
      item: Item
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    getItemprops(index) {
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
