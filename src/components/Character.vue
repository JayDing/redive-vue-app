<template>
  <div class="char" :class="{ mobile: this.$parent.windowWidth < 768 }">
    <div class="frame" :class="frameClass">
      <img :src="charImgPath" :alt="char.name" />
    </div>
    <div class="info">
      <strong class="name">{{ char.name }}</strong>
      <p>機率 {{ char.prob.normal }} %</p>
      <p>(第十抽 {{ char.prob.last }} %)</p>
    </div>
    <div class="action">
      <label class="in-pool">
        <input type="checkbox" v-model="char.inpool" />卡池啟用
      </label>
      <label class="rate-up">
        <input type="checkbox" v-model="char.rateup" />機率提升
      </label>
      <label class="rate" v-show="char.rateup">
        <input type="text" v-model.number="char.rate" />%
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: "Character",
  props: {
    char: Object
  },
  data() {
    return {
      frameClass: {
        bgBlue: this.char.star === 1,
        bgGold: this.char.star === 2,
        bgRainbow: this.char.star === 3,
        grayscale: !this.char.inpool
      }
    };
  },
  computed: {
    charImgPath() {
      return require(`@/assets/images/card/${this.char.name}.png`);
    }
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
    & > label.rate input {
      text-align: center;
      width: 40px;
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
