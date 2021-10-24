<template>
  <div class="progress-bg">
    <div class="progress-fill" :style="{width: percentage + '%'}"></div>
  </div>
</template>

<script>
export default {
  name: 'bar',
  props: {
    percentage: Number,
  }
}
</script>

<style scoped lang="scss">
  .progress-bg {
    background-color: rgba(#fff, 0.5);
    border: 1px solid #777;
    border-radius: 4px;
    height: 16px;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;

    .progress-fill {
      background-color: #33f;
      height: 100%;
      border: 1px solid #00f;
      border-radius: 4px;
      transition: width 0.5s ease-in-out;
    }
  }
</style>