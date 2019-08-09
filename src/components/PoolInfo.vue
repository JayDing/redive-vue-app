<template>
  <div
    class="pool"
    :class="{
      mobile: windowWidth < 768,
      error: !passValidation
    }"
  >
    <h2 class="name">{{ pool.name }}</h2>
    <div class="info" v-for="pi in poolInfo" :key="pi.pi_id">
      <h3>{{ pi.star }} 星</h3>
      <label>機率: <input v-model.number="pi.normal" /> %</label>
      <label>第十抽: <input v-model.number="pi.last" /> %</label>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "PoolInfo",
  props: ["pool"],
  data() {
    return {
      windowWidth: 0,
      poolInfo: this.pool.info,
      passValidation: true
    };
  },
  methods: {
    ...mapActions(["validate", "pushPoolData"]),
    checkProb() {
      let normal = this.poolInfo.reduce((init, pi) => init + pi.normal, 0);
      let last = this.poolInfo.reduce((init, pi) => init + pi.last, 0);

      this.passValidation = normal === 100 && last === 100;
      this.validate({
        id: this._uid,
        passed: this.passValidation
      });

      if (this.passValidation) {
        this.pushPoolData(this.poolInfo);
      }
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.checkProb();
  },
  watch: {
    poolInfo: {
      handler() {
        this.checkProb();
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.pool {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 30px;
  width: 768px;

  &.mobile {
    width: 100%;
  }

  & > .name {
    border-bottom: 3px solid powderblue;
    text-align: left;
    width: 100%;
  }

  & > .info {
    align-items: flex-start;
    display: flex;
    flex-direction: column;

    & input {
      text-align: center;
      width: 50px;
    }
  }
}
</style>
