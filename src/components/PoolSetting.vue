<template>
  <div id="poolSetting">
    <navBar>
      <template v-slot:right>
        <input class="update" type="button" value="設定" @click="updateData" />
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
