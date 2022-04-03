<template>
  <div>
    <div class="split">
      <reddit-account-holder id="origin" ref="origin" :checkable="true" @move="moveFromOrigin($event)"></reddit-account-holder>
      <reddit-account-holder id="target" ref="target" :checkable="false"></reddit-account-holder>
    </div>
    <progress-locker ref="progress"
      :title="progress.title"
      :current="progress.current"
      :total="progress.total"
    ></progress-locker>
  </div>
</template>

<script>
import RedditAccountHolder from './reddit-account-holder';
import ProgressLocker from './progress/locker';
import RedditItemsMoveService from '../reddit-items-move-service';
import SubredditsMover from '../reddit-items-movers/SubredditsMover';
import SavedPostsMover from '../reddit-items-movers/SavedPostsMover';
import EventBus from '../event-bus';

export default {
  components: {RedditAccountHolder, ProgressLocker},

  data() {
    return {
      progress: {
        title: 'Progressing...',
        current: 0,
        total: 100,
      },
    };
  },

  methods: {
    moveFromOrigin($event) {
      console.log('Move from origin: ', $event);
      switch ($event.type) {
        case 'subreddits': {
          this.$refs.progress.show();
          this.progress.title = 'Moving subreddits...';
          this.progress.current = 0;
          this.progress.total = $event.data.length;

          RedditItemsMoveService.move(
              this.$refs.origin.token,
              this.$refs.target.token,
              SubredditsMover,
              $event.data,
              subResult => {
                console.log('Sub-result: ', subResult);

                // Delete successfully moved ones from the origin, display them in the target
                EventBus.$emit('movedSubreddits', {
                  data: Object.entries(subResult)
                      .filter(([id, result], _, _2) => result)
                      .map(([id, _], _2, _3) => id),
                  origin: this.$refs.origin.token,
                  target: this.$refs.target.token,
                });

                this.progress.current += Object.keys(subResult).length;
                if (this.progress.current >= this.progress.total) {
                  this.$refs.progress.hide();
                }
              }
          );
          break;
        }
        case 'savedPosts': {
          this.$refs.progress.show();
          this.progress.title = 'Moving saved posts...';
          this.progress.current = 0;
          this.progress.total = $event.data.length;

          RedditItemsMoveService.move(
              this.$refs.origin.token,
              this.$refs.target.token,
              SavedPostsMover,
              $event.data,
              subResult => {
                console.log('Sub-result: ', subResult);

                // Delete successfully moved ones from the origin, display them in the target
                EventBus.$emit('movedSavedPost', {
                  data: Object.entries(subResult)
                      .filter(([id, result], _, _2) => result)
                      .map(([id, _], _2, _3) => id),
                  origin: this.$refs.origin.token,
                  target: this.$refs.target.token,
                });

                this.progress.current += Object.keys(subResult).length;
                if (this.progress.current >= this.progress.total) {
                  this.$refs.progress.hide();
                }
              }
          );
          break;
        }
      }
    },
  }
}
</script>
