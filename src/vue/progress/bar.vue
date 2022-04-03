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

<style scoped>
  .progress-bg {
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid #777;
    border-radius: 4px;
    height: 16px;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
  }
  .progress-bg .progress-fill {
    background-color: #33f;
    height: 100%;
    border: 1px solid #00f;
    border-radius: 4px;
    transition: width 0.5s ease-in-out;
  }
</style>