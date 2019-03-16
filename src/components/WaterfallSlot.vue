<style lang="scss">
.waterfall-slot {
  position: absolute;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<template>
  <div :style="style" class="waterfall-slot">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'WaterfallSlot',
  props: {
    width: {
      type: [Number, String],
      required: true
    },
    height: {
      type: [Number, String],
      required: true
    },
    index: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      style: {}
    }
  },
  methods: {
    notify() {
      this.$parent.$emit('render', this)
    },
    getMeta() {
      return {
        vm: this,
        node: this.$el,
        index: this.index,
        width: this.width,
        height: this.height
      }
    }
  },
  mounted() {
    this.notify()
  }
}
</script>
