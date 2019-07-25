import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    passValidation: true,
    changedData: []
  },
  mutations: {
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
    checkRate(context, passed) {
      context.commit("checkRate", passed);
    },
    pushChangedData(context, newData) {
      context.commit("pushChangedData", newData);
    },
    clearChangedData(context) {
      context.commit("clearChangedData");
    }
  }
});
