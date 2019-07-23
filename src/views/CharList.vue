<template>
  <div id="main">
    <NavBar>
      <template v-slot:right>
        <input class="update" type="button" value="更新" @click="printData" />
      </template>
    </NavBar>
    <div class="loading" v-if="loading">
      Loading...
    </div>
    <div class="error" v-if="error">
      {{ error }}
    </div>
    <div id="board" v-if="charList" :class="{ mobile: windowWidth < 768 }">
      <router-view v-for="char in charList" :key="char.id" :char="char" />
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  name: "charList",
  components: {
    NavBar
  },
  data() {
    return {
      loading: false,
      charList: null,
      error: null,
      windowWidth: 0
    };
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    fetchData() {
      // const poolName = this.$route.name;
      const BASE_URL = "http://localhost:5000/api/charList";

      this.error = this.charList = null;
      this.loading = true;
      fetch(BASE_URL)
        .then(res => res.json())
        .catch(err => {
          this.error = err;
        })
        .then(result => {
          this.loading = false;
          this.charList = result;
        });
    },
    printData() {
      console.log(this.charList);
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.fetchData();
  }
};
</script>

<style lang="scss" scoped>
#main {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: relative;
  text-align: center;
  width: 100%;

  & > .loading,
  & > .error {
    font-size: 24px;
  }

  & > .error {
    color: red;
  }

  & > #board {
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

    &.mobile {
      align-items: center;
      display: flex;
      flex-direction: column;
    }
  }

  & input.update {
    background: #5cb85c !important;
    border: 1px solid #4cae4c !important;
    border-radius: 10px !important;
    color: white !important;
    cursor: pointer !important;
    padding: 5px 15px;
  }
}
</style>
