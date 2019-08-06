<template>
  <div id="board">
    <navBar>
      <template v-slot:right>
        <button class="update" @click="updateChar">
          更新
        </button>
      </template>
    </navBar>
    <div class="charList" v-if="status === 'success'">
      <character v-for="char in charList" :key="char.id" :char="char" />
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
  computed: {
    ...mapState(["status", "charList"])
  },
  methods: {
    ...mapActions(["fetchData", "updateData"]),
    async fetchChar() {
      const apiName = `charList/${this.$route.name}`;
      await this.fetchData(apiName);
    },
    async updateChar() {
      const apiName = `charList/update/${this.$route.name}`;
      const callback = `charList/${this.$route.name}`;
      await this.updateData({ apiName, callback });
    }
  },
  async created() {
    this.fetchChar();
  },
  watch: {
    $route: "fetchChar"
  }
};
</script>

<style lang="scss" scoped>
#board {
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;

  &.mobile {
    & > #navBar {
      button.update {
        padding: 5px 5px;
      }
    }
    & > .charList {
      align-items: center;
      display: flex;
      flex-direction: column;
    }
  }

  & > #nav {
    button.update {
      background: #5cb85c;
      border-color: #4cae4c;
      color: white;
    }
  }

  & > .charList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    height: 100%;
    width: 90%;

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
}
</style>
