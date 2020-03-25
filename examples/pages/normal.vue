<style lang="scss">
#normal-list {
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
  <div id="normal-list">
    <Item v-for="(item, index) in items" :index="index" :item="item" :key="index" />
  </div>
</template>

<script>
import Item from '../Item'

export default {
  name: 'NormalList',
  components: {
    Item
  },
  data() {
    const total = 10000
    return {
      items: this.$factory.get(total),
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
