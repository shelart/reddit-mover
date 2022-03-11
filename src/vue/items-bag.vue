<template>
  <div>
    <label>
      <span>Type of items:</span>
      <select v-model="pocket">
        <option selected disabled>(choose)</option>
        <option value="subreddits-subscribed">Subscriptions</option>
        <option value="saved-posts" :disabled="!userNameAvailable">Saved Posts</option>
      </select>
    </label>

    <subreddits-subscribed v-if="pocket === 'subreddits-subscribed'" :token="token" :checkable="checkable"
      @move="moveSubreddits($event)"></subreddits-subscribed>

    <saved-posts v-if="pocket === 'saved-posts'" :token="token" :checkable="checkable"
      @move="moveSavedPosts($event)"></saved-posts>
  </div>
</template>

<script>
import SubredditsSubscribed from './items-bag-pockets/subreddits-subscribed';
import SavedPosts from './items-bag-pockets/saved-posts';

export default {
  name: 'items-bag',
  components: {SubredditsSubscribed, SavedPosts},

  props: {
    token: String,
    checkable: Boolean,
    userNameAvailable: Boolean,
  },

  data() {
    return {
      pocket: null,
    }
  },

  methods: {
    moveSubreddits($event) {
      console.log('Move subreddits: ', $event);
      this.$emit('move', $event);
    },

    moveSavedPosts($event) {
      console.log('Move saved posts: ', $event);
      this.$emit('move', $event);
    },
  }
}
</script>

<style scoped>

</style>