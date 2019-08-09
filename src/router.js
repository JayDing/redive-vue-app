import Vue from "vue";
import Router from "vue-router";
import Pool from "./views/Pool.vue";
import PoolSetting from "./components/PoolSetting.vue";
import CharList from "./components/CharList.vue";
import AddChar from "./views/AddChar.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: "/settings",
  routes: [
    {
      path: "/pool",
      component: Pool,
      children: [
        {
          path: "",
          name: "pool",
          component: PoolSetting,
          meta: { title: "卡池設定" }
        },
        {
          path: "normal",
          name: "normal",
          component: CharList,
          meta: { title: "白金轉蛋" }
        },
        {
          path: "featured",
          name: "featured",
          component: CharList,
          meta: { title: "精選轉蛋" }
        },
        {
          path: "must3Star",
          name: "must3Star",
          component: CharList,
          meta: { title: "三星必中" }
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
