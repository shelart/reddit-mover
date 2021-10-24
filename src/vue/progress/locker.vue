<template>
  <div class="locker" ref="locker">
    <div class="progress-holder">
      <p class="title">{{title}}</p>
      <bar class="bar" :percentage="Math.round(current / total * 100)"></bar>
      <p class="shares">{{current}} / {{total}}</p>
    </div>
  </div>
</template>

<script>
import Bar from './bar';
export default {
  name: 'locker',
  components: {Bar},
  props: {
    title: String,
    current: Number,
    total: Number,
  },
  methods: {
    show() {
      console.log('Showing progress locker');
      this.$refs.locker.style.display = 'flex';
      this.$refs.locker.style.opacity = 1;
    },

    hide() {
      console.log('Hiding progress locker');
      const setDisplayNone = () => {
        this.$refs.locker.style.display = 'none';
        this.$refs.locker.removeEventListener('animationend', setDisplayNone);
      };
      this.$refs.locker.addEventListener('animationend', setDisplayNone);
      this.$refs.locker.style.opacity = 0;
      setTimeout(setDisplayNone, 1000); // workaround for browsers which don't support 'animationend'
    },
  },
}
</script>

<style scoped lang="scss">
  .locker {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(#000, 0.5);
    z-index: 999;
    display: none;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;

    p {
      text-align: center;
      color: #fff;
      font-weight: bold;

      &.title {
        font-size: 20px;
      }
      &.shares {
        font-size: 16px;
      }
    }

    .bar {
      width: 90%;
      margin: 10px auto;
    }
  }
</style>