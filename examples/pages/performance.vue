<style lang="scss">
#performance {
  .padding-top {
    height: 10000px;
    box-sizing: border-box;
    will-change: padding-top;
  }

  .height {
    height: 10000px;

    .shim {
      will-change: height;
    }
  }
}
</style>

<template>
  <div id="performance">
    <button @click="startPadding">padding-top</button>
    <button @click="startHeight">height</button>
    <div class="padding-top">{{ timer }}</div>
    <div class="height">
      {{ timer }}
      <div class="shim"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: 0
    }
  },
  methods: {
    startPadding() {
      const dom = document.querySelector('.padding-top')
      const time = setInterval(() => {
        if (this.timer > 2000) {
          clearInterval(time)
          return
        }
        this.timer++
        dom.style.paddingBottom = `${this.timer}px`
      }, 10);
    },
    startHeight() {
      const dom = document.querySelector('.shim')
      const time = setInterval(() => {
        if (this.timer > 2000) {
          clearInterval(time)
          return
        }
        this.timer++
        dom.style.height = `${this.timer}px`
      }, 10);
    }
  }
}
</script>
