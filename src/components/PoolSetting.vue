<template>
  <div id="poolSetting">
    <navBar>
      <template v-slot:right>
        <button class="update" @click="updatePools">設定</button>
      </template>
    </navBar>
    <div class="pools" v-if="status === 'success'">
      <poolInfo v-for="(pool, key) in poolList" :key="key" :pool="pool" />
    </div>
    <div class="status" v-else-if="status === 'updated'">
      <h2>Successfully Updated!</h2>
    </div>
    <div class="status error" v-else-if="status === 'error'">
      <h2>Error!</h2>
    </div>
    <div class="status" v-else>
      <h2>Loading...</h2>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import NavBar from "@/components/NavBar.vue";
import PoolInfo from "@/components/PoolInfo.vue";

export default {
  name: "PoolSetting",
  components: {
    NavBar,
    PoolInfo
  },
  computed: {
    ...mapState(["status", "pools"]),
    poolList() {
      const output = {};
      this.pools.forEach(pi => {
        if (!output[pi.type]) output[pi.type] = { name: pi.name, info: [] };
        output[pi.type].info.push(pi);
      });
      return output;
    }
  },
  methods: {
    ...mapActions(["fetchData", "updateData"]),
    fetchPools() {
      const apiName = `pools`;
      this.fetchData(apiName);
    },
    updatePools() {
      const apiName = `pools/update`;
      this.updateData(apiName);
    }
  },
  created() {
    this.fetchPools();
  }
};
</script>

<style lang="scss" scoped>
#poolSetting {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;
}
</style>
