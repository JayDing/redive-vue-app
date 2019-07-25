<template>
  <div id="nav" :class="{ mobile: windowWidth < 768 }">
    <div id="topBar">
      <div class="left">
        <div class="trigger" @click="activeMenu">
          <i class="fas fa-bars"></i>
        </div>
        <slot name="left"></slot>
      </div>
      <div class="title">{{ title }}</div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
    <div
      id="overlayout"
      :class="{ active: menu.active }"
      @click.stop="activeMenu"
      @touchmove.prevent
    >
      <ul id="menu">
        <li class="trigger" @click.stop="activeMenu">
          <i class="fas fa-times"></i>
        </li>
        <router-link
          tag="li"
          v-for="(item, i) in menu.items"
          :key="i"
          :to="item.to"
          @click.stop="activeMenu"
        >
          <span>{{ item.title }}</span>
        </router-link>
      </ul>
    </div>
    <div id="navOffset"></div>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data() {
    return {
      windowWidth: 0,
      menu: {
        active: false,
        items: []
      }
    };
  },
  computed: {
    title() {
      return this.$route.meta.title;
    }
  },
  methods: {
    handleResize() {
      this.windowWidth = window.innerWidth;
    },
    setMenu() {
      this.menu.items = [];
      this.$router.options.routes.forEach(route => {
        if (route.hasOwnProperty("children")) {
          route.children.forEach(child => {
            this.menu.items.push({
              to: { name: child.name },
              title: child.meta.title
            });
          });
        } else {
          this.menu.items.push({
            to: { name: route.name },
            title: route.meta.title
          });
        }
      });
    },
    activeMenu() {
      this.menu.active = !this.menu.active;

      if (this.menu.active) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    closeMenuByEsc(e) {
      if (e.keyCode === 27 && this.menu.active) {
        this.menu.active = !this.menu.active;
      }
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();

    document.addEventListener("keydown", this.closeMenuByEsc);
    this.setMenu();
  }
};
</script>

<style lang="scss" scoped>
$bg: #87ceeb;
$bg-hover: #23a2c8;
$bg-overlayout: #333333;
$h-topbar: 50px;

@mixin fixed {
  left: 0;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
}

#nav {
  font-size: 24px;
  font-weight: bold;

  &.mobile {
    font-size: 20px;

    & > #topBar > * {
      min-width: 0;
    }

    & > #overlayout {
      & > #menu {
        width: 200px;
      }
    }

    button,
    input[type="button"],
    input[type="reset"],
    input[type="submit"] {
      font-size: 16px;
    }
  }

  & > #topBar {
    @include fixed;
    align-items: center;
    background: $bg;
    display: flex;
    height: $h-topbar;
    width: 100%;
    z-index: 9999;

    & > * {
      min-width: 150px;
    }

    & > .left {
      flex: 1;
      margin-left: 10px;
    }

    & > .title {
      flex: 3;
    }

    & > .right {
      flex: 1;
      margin-right: 10px;
    }
  }

  & > #overlayout {
    @include fixed;
    background: transparent;
    transition: all 0.1s ease-in-out;
    z-index: 10000;

    &.active {
      background: rgba($bg-overlayout, 0.2);
      height: 100%;
      width: 100%;

      & > #menu {
        left: 0;
      }
    }

    & > #menu {
      @include fixed;
      box-shadow: 1px 1px 3px 3px rgba($bg-overlayout, 0.5);
      left: -305px;
      background: $bg;
      height: 100%;
      list-style: none;
      overflow: hidden;
      transition: all 0.2s linear;
      width: 300px;

      & > li {
        box-sizing: border-box;
        cursor: pointer;
        padding: 10px;
        height: $h-topbar;

        &:hover,
        &:focus,
        &:active {
          background: $bg-hover;
        }

        &.trigger {
          text-align: right;
        }

        &.router-link-exact-active {
          background: $bg-hover;

          & > span {
            color: #2c3e50;
          }
        }

        & > span {
          color: white;
        }
      }
    }
  }

  & > #navOffset {
    height: $h-topbar;
  }

  button,
  input[type="button"],
  input[type="reset"],
  input[type="submit"] {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
