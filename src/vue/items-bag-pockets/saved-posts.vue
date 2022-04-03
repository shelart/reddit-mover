<template>
  <div>
    <header>
      Saved Posts
      <button v-if="savedPosts !== null" type="button" @click.prevent="reload">Reload</button>
      <select v-if="savedPosts !== null"
              v-model="filterBySubreddit"
      >
        <option :value="null">(all subreddits)</option>
        <option v-for="subreddit in foundSubreddits"
                :key="subreddit"
                :value="subreddit"
        >{{subreddit}}</option>
      </select>
    </header>

    <p v-if="!savedPosts">
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
      <post v-for="savedPost in savedPosts"
                 :key="savedPost.data.id"
                 v-if="!filterBySubreddit || (savedPost.data.subreddit_name_prefixed === filterBySubreddit)"
                 :value="savedPost"
                 :checkable="checkable"
                 @change="onSavedPostCheckboxChanged(savedPost.data.name, $event)">
      </post>

      <div v-if="checkable" class="panel-bottom">
        <button v-if="Object.keys(tickedSavedPosts).length" @click="move()">
          Move {{Object.keys(tickedSavedPosts).length}} saved post(s)
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import RedditService from '../../reddit-service';
import Post from './items/post';
import EventBus from '../../event-bus';

export default {
  name: 'saved-posts',
  components: {Post},
  props: {
    token: String,
    checkable: Boolean,
  },

  data() {
    return {
      filterBySubreddit: null,
      foundSubreddits: [],
      savedPosts: null,
      listingId: null,
      state: null,
      errorText: null,
      intervalID: null,
      tickedSavedPosts: {},
    }
  },

  async mounted() {
    await this.reload();
  },

  created() {
    EventBus.$on('movedSavedPost', this.onMoved);
    EventBus.$on('addSavedPostToTarget', this.addSavedPostToTarget);
  },

  destroyed() {
    EventBus.$off('movedSavedPost', this.onMoved);
    EventBus.$off('addSavedPostToTarget', this.addSavedPostToTarget);
  },

  methods: {
    async reload() {
      this.savedPosts = null;
      this.state = null;
      this.errorText = null;
      this.tickedSavedPosts = {};
      this.listingId = (await RedditService.savedPosts.invokeGet(this.token)).data;
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
      this.savedPosts = stateOfListing.data.result;
      this.foundSubreddits = [...new Set(this.savedPosts
          .map(savedPost => savedPost.data.subreddit_name_prefixed))
      ].sort((a, b) => {
        const aTransformed = a.toLowerCase();
        const bTransformed = b.toLowerCase();
        if (aTransformed < bTransformed) {
          return -1;
        }
        if (aTransformed > bTransformed) {
          return 1;
        }
        return 0;
      });
    },

    onSavedPostCheckboxChanged(id, checked) {
      if (checked) {
        this.$set(this.tickedSavedPosts, id, checked);
      } else {
        this.$delete(this.tickedSavedPosts, id);
      }
    },

    move() {
      const ids = Object.keys(this.tickedSavedPosts).reverse();
      console.log('Moving: ', ids);
      this.$emit('move', {
        type: 'savedPosts',
        data: ids,
        origin: this.token,
      });
    },

    onMoved($event) {
      if (this.token === $event.origin) {
        // This is the origin saved posts view.
        for (const id of $event.data) {
          EventBus.$emit('uncheckPost', id);
        }
        // Pass the successfully moved saved posts to the target.
        const toMove = this.savedPosts.filter(savedPost => $event.data.includes(savedPost.data.name));
        console.log('toMove = ', toMove);
        EventBus.$emit('addSavedPostToTarget', {
          toMove,
          target: $event.target,
        });
        // Delete the successfully moved saved posts.
        for (const id of $event.data) {
          const idxToDelete = this.savedPosts.findIndex(savedPost => savedPost.data.name === id);
          if (idxToDelete === -1) {
            continue;
          }
          this.savedPosts.splice(idxToDelete, 1);
        }
      }
    },

    addSavedPostToTarget($event) {
      if (this.token === $event.target) {
        // This is the target saved posts view.
        for (const savedPost of $event.toMove) {
          this.savedPosts.push(savedPost);
        }
      }
    },
  }
}
</script>
