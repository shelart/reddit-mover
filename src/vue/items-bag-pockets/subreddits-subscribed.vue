<template>
  <div>
    <header>Subscriptions</header>

    <p v-if="subreddits === null">Loading...</p>
    <div v-else-if="typeof subreddits === typeof undefined">
      <p>Error on loading.</p>
      <button type="button" @click.prevent="reload">Reload</button>
    </div>
    <template v-else>
      <subreddit v-for="subreddit in subreddits" :key="subreddit.data.id" :value="subreddit"></subreddit>
    </template>
  </div>
</template>

<script>
import RedditService from '../../reddit-service';
import Subreddit from './items/subreddit';

export default {
  name: 'subreddits-subscribed',
  components: {Subreddit},
  props: {
    token: String,
  },

  data() {
    return {
      subreddits: null,
    }
  },

  async mounted() {
    await this.reload();
  },

  methods: {
    async reload() {
      this.subreddits = null;
      try {
        const response = await RedditService.subreddits.get(this.token);
        if (response.data) {
          this.subreddits = response.data;
        } else {
          this.subreddits = undefined;
        }
      } catch (e) {
        this.subreddits = undefined;
      }
    },
  }
}
</script>

<style scoped>

</style>