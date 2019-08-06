import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const domain = process.env.VUE_APP_DOMAIN;

export default new Vuex.Store({
  state: {
    status: "loading",
    charList: [],
    passValidation: true
  },
  mutations: {
    status(state, status) {
      state.status = status;
    },
    fetchData(state, data) {
      switch (data.type) {
        case "charList":
          state.charList = data.rows;
          break;
        default:
          break;
      }
    },
    checkRate(state, passed) {
      state.passValidation = passed;
    },
    pushChangedData(state, newData) {
      const arrIndex = state.changedData.findIndex(
        data => data.rate_id === newData.rate_id
      );
      if (arrIndex === -1) {
        state.changedData.push(newData);
      }
      console.log(state.changedData);
    },
    clearChangedData(state) {
      state.changedData = [];
    }
  },
  actions: {
    async fetchData({ commit }, apiName) {
      const apiUrl = `${domain}/api/${apiName}`;
      const dataType = apiName.split("/")[0];

      commit("status", "loading");

      try {
        const res = await fetch(apiUrl);

        if (res.ok) {
          commit(`fetchData`, { type: dataType, rows: await res.json() });
          commit("status", "success");
        } else {
          commit("status", "error");
          console.log(res);
        }
      } catch (err) {
        commit("status", "error");
        console.error(err);
      }
    },
    async updateData({ dispatch, commit }, { apiName, callback }) {
      const apiUrl = `${domain}/api/${apiName}`;
      const callbackUrl = `${domain}/api/${callback}`;

      commit("status", "loading");

      try {
        let res = await fetch(apiUrl, {
          method: "POST",
          body: JSON.stringify(this.$store.state.changedData),
          headers: new Headers({
            "Content-Type": "application/json"
          })
        });

        if (res.ok && (await res.json())) {
          commit("status", "updated");
          setTimeout(() => {
            dispatch("fetchData", callbackUrl);
          }, 2000);
        } else {
          commit("status", "error");
          console.log(res);
        }
      } catch (err) {
        commit("status", "error");
        console.error(err);
      }
    },
    checkRate({ commit }, passed) {
      commit("checkRate", passed);
    }
  }
});
