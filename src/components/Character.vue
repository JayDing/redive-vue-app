<template>
  <div
    class="char"
    :class="{
      mobile: windowWidth < 768,
      error: !passValidation
    }"
  >
    <div
      class="frame"
      :class="{
        bgBlue: char.star === 1,
        bgGold: char.star === 2,
        bgRainbow: char.star === 3,
        grayscale: !inpool
      }"
    >
      <img :src="charImgPath" :alt="char.name" />
    </div>
    <div class="info">
      <strong class="name">{{ char.name }}</strong>
      <p>機率 {{ char.prob_normal }} %</p>
      <p>(第十抽 {{ char.prob_last }} %)</p>
    </div>
    <div class="action">
      <label class="in-pool">
        <input type="checkbox" v-model="inpool" />
        卡池啟用
      </label>
      <label class="rate-up">
        <input type="checkbox" v-model="rateup" />
        機率提升
      </label>
      <label class="rate" v-show="rateup">
        <input type="text" v-model="prob" />%
      </label>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "Character",
  props: ["char"],
  data() {
    return {
      windowWidth: 0,
      inpool: this.char.inpool,
      rateup: this.char.rateup,
      prob: this.char.prob_normal,
      passValidation: true
    };
  },
  computed: {
    charImgPath() {
      return require(`@/assets/images/card/${this.char.name}.png`);
    }
  },
  methods: {
    ...mapActions(["validate", "calcProb"]),
    checkProb() {
      this.passValidation = this.rateup
        ? this.inpool && !isNaN(this.prob) && this.prob <= this.char.base_normal
        : true;

      this.validate({
        id: this._uid,
        passed: this.passValidation
      });

      if (this.passValidation) {
        this.calcProb({
          id: this.char.id,
          inpool: this.inpool,
          rateup: this.rateup,
          prob: Number(this.prob)
        });
      }
    },
    showRateup() {
      this.prob = this.char.prob_normal;
      this.checkProb();
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
    }
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.checkProb();
  },
  watch: {
    inpool: "checkProb",
    rateup: "showRateup",
    prob: "checkProb"
  }
};
</script>

<style lang="scss" scoped>
.char {
  align-items: center;
  display: flex;
  height: 120px;
  justify-content: space-around;
  width: 100%;

  &.mobile {
    font-size: 14px;

    & > .frame {
      height: 72px;
      width: 72px;

      & > img {
        height: 64px;
        width: 64px;
      }
    }

    & > .info {
      width: 120px;
    }

    & > .action {
      width: 80px;
    }
  }

  & > .frame {
    align-items: center;
    border-radius: 10px;
    box-shadow: 3px 3px 3px 1px rgba(0, 0, 0, 0.5),
      0px 0px 3px 3px rgba(255, 255, 255, 0.7);
    display: flex;
    height: 84px;
    justify-content: center;
    width: 84px;

    & > img {
      height: 72px;
      width: 72px;
    }
  }

  & > .info,
  & > .action {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    & > p {
      margin: 0;
    }
  }
  & > .info {
    width: 140px;
  }

  & > .action {
    width: 90px;
    align-items: flex-end;

    & > label.rate > input {
      border-radius: 10px;
      text-align: center;
      width: 50px;
    }
  }
}

.bgBlue {
  background: skyblue;
}
.bgGold {
  background: gold;
}
.bgRainbow {
  background: linear-gradient(
    to bottom right,
    orange,
    yellow,
    cyan,
    blue,
    violet
  );
}
.grayscale {
  filter: grayscale(100%);
}
</style>
