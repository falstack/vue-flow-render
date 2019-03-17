<style lang="scss">
.waterfall-slot {
  position: absolute;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>

<template>
  <keep-alive>
    <div v-if="display" :style="style" class="waterfall-slot">
      <slot />
    </div>
  </keep-alive>
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
      top: 0,
      bottom: 0,
      display: false,
      style: {}
    }
  },
  methods: {
    notify() {
      this.$parent.$emit('render', this)
    }
  },
  mounted() {
    this.notify()
  }
}
</script>
