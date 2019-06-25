<template>
  <div class="demo">
    <div :style="{ backgroundColor: item.style.color }">
      {{ index }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  }
}
</script>
