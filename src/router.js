import Vue from "vue";
import Router from "vue-router";
import CharList from "./views/CharList.vue";
import Character from "./components/Character.vue";
import AddChar from "./views/AddChar.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: "/settings",
  routes: [
    {
      path: "/pool",
      name: "charList",
      component: CharList,
      meta: { title: "卡池設定" },
      children: [
        {
          path: "normal",
          name: "normal",
          component: Character,
          meta: { title: "白金轉蛋" }
        },
        {
          path: "featured",
          name: "featured",
          component: Character,
          meta: { title: "精選轉蛋" }
        },
        {
          path: "must3Star",
          name: "must3Star",
          component: Character,
          meta: { title: "3星必中" }
        }
      ]
    },
    {
      path: "/addChar",
      name: "addChar",
      component: AddChar,
      meta: {
        title: "新增角色"
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  Vue.nextTick(() => {
    const title =
      "Re:Dive Gotcha" + (to.meta.title ? " - " + to.meta.title : "");
    document.title = title;
  });
  next();
});

export default router;
