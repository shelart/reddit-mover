<template>
  <div>
    <header>Subscriptions</header>
    <p>Here goes the list of subreddits you're subscribed to.</p>
    <p>Token is: {{token}}</p>
  </div>
</template>

<script>
export default {
  name: 'subreddits-subscribed',
  props: {
    token: String,
  },
}
</script>

<style scoped>

</style>