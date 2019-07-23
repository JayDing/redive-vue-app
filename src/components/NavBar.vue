<template>
  <div id="nav" :class="{ mobile: this.$parent.windowWidth < 768 }">
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
      @click.self="activeMenu"
      @touchmove.prevent
    >
      <ul id="menu">
        <li class="trigger" @click="activeMenu">
          <i class="fas fa-times"></i>
        </li>
        <li v-for="(item, i) in menu.items" :key="i" @click="activeMenu">
          <router-link :to="item.path">{{ item.title }}</router-link>
        </li>
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
    setMenu() {
      this.$router.options.routes.forEach(route => {
        if (route.hasOwnProperty("children")) {
          this.menu.items.push({
            path: "#",
            title: route.meta.title,
            isChild: false
          });

          route.children.forEach(child => {
            this.menu.items.push({
              path: route.path + "/" + child.path,
              title: child.meta.title,
              isChild: true
            });
          });
        } else {
          this.menu.items.push({
            path: route.path,
            title: route.meta.title,
            isChild: false
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
    document.addEventListener("keydown", this.closeMenuByEsc);
    this.setMenu();
  }
};
</script>

<style lang="scss" scoped>
$bg: #87ceeb;
$bg-hover: #23a2c8;
$bg-overlayout: #333333;
$topbar-h: 50px;

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

    & button,
    & input[type="button"],
    & input[type="reset"],
    & input[type="submit"] {
      font-size: 16px;
    }
  }

  & > #topBar {
    @include fixed;
    align-items: center;
    background: $bg;
    display: flex;
    height: $topbar-h;
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
      transition: all 0.2s linear 0.1s;
      width: 300px;

      & > li {
        box-sizing: border-box;
        padding: 10px;
        height: $topbar-h;

        &:hover,
        &:focus,
        &:active {
          background: $bg-hover;
        }

        &.trigger {
          text-align: right;
        }

        & > a {
          text-decoration: none;

          &:link,
          &:visited,
          &:active {
            color: white;
          }

          &.router-link-exact-active {
            color: #2c3e50;
          }
        }
      }
    }
  }

  & > #navOffset {
    height: $topbar-h;
  }

  & button,
  & input[type="button"],
  & input[type="reset"],
  & input[type="submit"] {
    font-size: 20px;
    font-weight: bold;
  }
}

.trigger {
  cursor: pointer;

  & > i:hover,
  & > i:focus,
  & > i:active {
    color: black;
  }
}
</style>
