<template>
  <div>
    <label>
      <span>Type of items:</span>
      <select v-model="pocket">
        <option selected disabled>(choose)</option>
        <option value="subreddits-subscribed">Subscriptions</option>
      </select>
    </label>

    <subreddits-subscribed v-if="pocket === 'subreddits-subscribed'" :token="token"></subreddits-subscribed>
  </div>
</template>

<script>
import SubredditsSubscribed from './items-bag-pockets/subreddits-subscribed';
export default {
  name: 'items-bag',
  components: {SubredditsSubscribed},

  props: {
    token: String,
  },

  data() {
    return {
      pocket: null,
    }
  },
}
</script>

<style scoped>

</style>