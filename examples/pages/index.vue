<style lang="scss">
</style>

<template>
  <div id="page-index">
    <router-link to="/known-single">
      <p>单列固定高度（单组件列表）</p>
    </router-link>
    <router-link to="/unknown-single">
      <p>单列不定高度（多态列表）</p>
    </router-link>
    <router-link to="/unknown-multiple">
      <p>多列不定高度（瀑布流）</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>
