<template>
  <div>
    <header>
      Subscriptions
      <button v-if="subreddits !== null" type="button" @click.prevent="reload">Reload</button>
    </header>

    <p v-if="!subreddits">
      <template v-if="state">
        Loading page {{state.page}}
        <template v-if="state.attempt > 1">
          (attempt # {{state.attempt}})
        </template>
        ...
      </template>
      <template v-else-if="errorText">
        Error on loading: {{errorText}}
      </template>
      <template v-else>
        Loading...
      </template>
    </p>
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
      listingId: null,
      state: null,
      errorText: null,
      intervalID: null,
    }
  },

  async mounted() {
    await this.reload();
  },

  methods: {
    async reload() {
      this.subreddits = null;
      this.listingId = (await RedditService.subreddits.invokeGet(this.token)).data;
      this.intervalID = setInterval(() => {
        this.refreshListingState();
      }, 1000);
    },

    async refreshListingState() {
      const stateOfListing = await RedditService.listings.getState(this.listingId);
      if (!stateOfListing.data) {
        clearInterval(this.intervalID);
        this.intervalID = null;
        this.errorText = 'Failed to refresh the state of loading!!!';
        return;
      }
      if (stateOfListing.data.error) {
        clearInterval(this.intervalID);
        this.intervalID = null;
        this.errorText = stateOfListing.data.error;
        return;
      }
      if (stateOfListing.data.state) {
        this.state = stateOfListing.data.state;
        return;
      }

      clearInterval(this.intervalID);
      this.intervalID = null;
      this.subreddits = stateOfListing.data.result;
    },
  }
}
</script>

<style scoped>

</style>