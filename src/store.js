import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const domain = process.env.VUE_APP_DOMAIN;

export default new Vuex.Store({
  state: {
    status: "loading",
    validationFailed: [],
    charList: [],
    pools: []
  },
  mutations: {
    status(state, status) {
      state.status = status;
    },
    async fetchData(state, apiName) {
      const apiUrl = `${domain}/api/${apiName}`;
      const dataType = apiName.split("/")[0];

      state.status = "loading";

      try {
        const res = await fetch(apiUrl);

        if (res.ok) {
          state[dataType] = await res.json();
          state.status = "success";
        } else {
          state.status = "error";
          console.log(res);
        }
      } catch (err) {
        state.status = "error";
        console.error(err);
      }
    },
    async updateData(state, apiName) {
      if (state.validationFailed.length === 0) {
        const apiUrl = `${domain}/api/${apiName}`;
        const dataType = apiName.split("/")[0];

        state.status = "loading";

        try {
          let res = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(state[dataType]),
            headers: new Headers({
              "Content-Type": "application/json"
            })
          });

          if (res.ok && (await res.json())) {
            state.status = "updated";
            setTimeout(() => {
              state.status = "success";
            }, 2000);
          } else {
            state.status = "error";
            console.error(res);
          }
        } catch (err) {
          state.status = "error";
          console.error(err);
        }
      }
    },
    validate({ validationFailed }, component) {
      const idx = validationFailed.findIndex(c => c.id === component.id);
      if (idx === -1 && !component.passed) validationFailed.push(component);
      if (idx !== -1 && component.passed) validationFailed.splice(idx, 1);
    },
    pushPoolData({ pools }, newData) {
      newData.forEach(info => {
        const idx = pools.findIndex(pi => pi.pi_id === info.pi_id);

        if (idx !== -1) {
          pools[idx].normal = info.normal;
          pools[idx].last = info.last;
        }
      });
    },
    calcProb({ charList }, newData) {
      const idx = charList.findIndex(char => char.id === newData.id);
      if (idx !== -1) {
        charList[idx].inpool = newData.inpool;
        charList[idx].rateup = newData.rateup;
        charList[idx].prob_normal = newData.prob;
        charList[idx].prob_last = newData.prob;
      }

      charList.map((char, i, charList) => {
        if (char.rateup) return char;

        let cPool = charList.filter(
          c => c.inpool == true && c.star == char.star
        );
        if (cPool.indexOf(char) === -1) {
          char.prob_normal = 0;
          char.prob_last = 0;
          return char;
        }

        let cUpPool = cPool.filter(c => c.rateup === true);
        let cUp = cUpPool.reduce((init, char) => init + char.prob_normal, 0);
        let pn = char.base_normal - cUp;
        let pl = char.base_last - cUp;

        char.prob_normal =
          pn > 0
            ? Math.round((pn / (cPool.length - cUpPool.length)) * 10000) / 10000
            : 0;
        char.prob_last =
          pl > 0
            ? Math.round((pl / (cPool.length - cUpPool.length)) * 10000) / 10000
            : 0;

        return char;
      });
    }
  },
  actions: {
    fetchData({ commit }, apiName) {
      commit("fetchData", apiName);
    },
    updateData({ commit }, apiName) {
      commit("updateData", apiName);
    },
    validate({ commit }, component) {
      commit("validate", component);
    },
    pushPoolData({ commit }, newData) {
      commit("pushPoolData", newData);
    },
    calcProb({ commit }, newData) {
      commit("calcProb", newData);
    }
  }
});
