<template>
  <div id="poolSetting">
    <navBar>
      <template v-slot:right>
        <button class="update" @click="updateData">設定</button>
      </template>
    </navBar>
    Pool Setting
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "PoolSetting",
  components: {
    NavBar
  },
  methods: {
    updateData() {
      console.log("buttons press");
    }
  }
};
</script>

<style lang="scss" scoped></style>
