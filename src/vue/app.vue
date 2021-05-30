<template>
  <div>
    <div class="split">
      <reddit-account-holder id="origin"></reddit-account-holder>
      <reddit-account-holder id="target"></reddit-account-holder>
    </div>
  </div>
</template>

<script>
import RedditAccountHolder from './reddit-account-holder';
export default {
  components: {RedditAccountHolder}
}
</script>
