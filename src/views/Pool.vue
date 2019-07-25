<template>
  <div id="main">
    <router-view :class="{ mobile: this.windowWidth < 768 }" />
  </div>
</template>

<script>
export default {
  name: "Pool",
  data() {
    return {
      windowWidth: 0
    };
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }
};
</script>

<style lang="scss" scoped>
#main {
  height: 100%;
  position: relative;
  text-align: center;
  width: 100%;
}
</style>
