<template>
  <div id="board">
    <navBar>
      <template v-slot:right>
        <button class="update" @click="updateChar">
          更新
        </button>
      </template>
    </navBar>
    <div
      id="charList"
      :class="{ mobile: this.windowWidth < 768 }"
      v-if="status === 'success'"
    >
      <Character v-for="char in charList" :key="char.id" :char="char" />
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
// TODO: 加入角色名字搜尋
import { mapState, mapActions } from "vuex";
import NavBar from "@/components/NavBar.vue";
import Character from "@/components/Character.vue";

export default {
  name: "charList",
  components: {
    NavBar,
    Character
  },
  data() {
    return {
      windowWidth: 0
    };
  },
  computed: {
    ...mapState(["status", "charList"])
  },
  methods: {
    ...mapActions(["fetchData", "updateData"]),
    fetchChar() {
      const apiName = `charList/${this.$route.name}`;
      this.fetchData(apiName);
    },
    updateChar() {
      const apiName = `charList/update/${this.$route.name}`;
      this.updateData(apiName);
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    this.fetchChar();
  },
  watch: {
    $route: "fetchChar"
  }
};
</script>

<style lang="scss" scoped>
#charList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  height: 100%;
  width: 100%;

  &.mobile {
    align-items: center;
    display: flex;
    flex-direction: column;
  }

  &::before {
    bottom: 0;
    content: "";
    background: url("~@/assets/images/sticker.png");
    height: 100%;
    left: 0;
    min-height: 100%;
    opacity: 0.1;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }
}
</style>
