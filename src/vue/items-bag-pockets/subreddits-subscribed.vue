<template>
  <div>
    <header>Subscriptions</header>
    <p>Here goes the list of subreddits you're subscribed to.</p>
    <p>Token is: {{token}}</p>
  </div>
</template>

<script>
import RedditService from '../../reddit-service';

export default {
  name: 'subreddits-subscribed',
  props: {
    token: String,
  },

  mounted() {
    RedditService.subreddits.get(this.token);
  },
}
</script>

<style scoped>

</style>