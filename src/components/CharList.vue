<template>
  <div id="board">
    <navBar>
      <template v-slot:right>
        <button class="update" @click="updateData">
          更新
        </button>
      </template>
    </navBar>
    <div class="loading" v-if="loading">
      <h2>Loading...</h2>
    </div>
    <div class="updated" v-if="updated">
      <h2>Successfully Updated!</h2>
    </div>
    <div class="error" v-if="error.length > 0">
      <h2 v-for="(msg, i) in error" :key="i">{{ msg }}</h2>
    </div>
    <div class="charList" v-if="charList && !loading && !updated">
      <character v-for="char in charList" :key="char.id" :char="char" />
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
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
      loading: false,
      updated: false,
      error: [],
      charList: null
    };
  },
  methods: {
    ...mapActions(["clearChangedData"]),
    async fetchData() {
      const poolName = this.$route.name;
      const url = `redive-gotcha.herokuapp.com/api/charList/${poolName}`;
      // const url = `http://localhost:5000/api/charList/${poolName}`;

      this.loading = !this.loading;
      this.error = [];
      this.charList = null;

      try {
        let res = await fetch(url);

        if (res.ok) {
          this.charList = await res.json();
        } else if (res.redirected) {
          window.location = res.headers.get("Location");
        } else {
          this.error.push("未知錯誤.");
        }
      } catch (err) {
        this.error.push(err);
      }

      this.loading = !this.loading;
    },
    async updateData() {
      const poolName = this.$route.name;
      const url = `redive-gotcha.herokuapp.com/api/charList/update/${poolName}`;
      // const url = `http://localhost:5000/api/charList/update/${poolName}`;

      this.error = [];
      this.loading = !this.loading;

      if (this.$store.state.passValidation) {
        if (this.$store.state.changedData.length > 0) {
          try {
            let res = await fetch(url, {
              method: "POST",
              body: JSON.stringify(this.$store.state.changedData),
              headers: new Headers({
                "Content-Type": "application/json"
              })
            });

            this.loading = !this.loading;

            if (res.ok && (await res.json())) {
              this.updated = !this.updated;
              this.clearChangedData();

              setTimeout(() => {
                this.updated = !this.updated;
                this.fetchData();
              }, 1500);
            } else if (res.redirected) {
              window.location = res.headers.get("Location");
            } else {
              this.error.push("未知錯誤.");
            }
          } catch (err) {
            this.error.push(err);
          }
        } else {
          this.loading = !this.loading;
          this.error.push("無資料修改.");
        }
      } else {
        this.loading = !this.loading;
        this.error.push("表單驗證失敗.");
      }
    }
  },
  async created() {
    await this.fetchData();
  },
  watch: {
    $route: "fetchData"
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
    & > .charList {
      align-items: center;
      display: flex;
      flex-direction: column;
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
