<template>
  <div>
    <div class="split">
      <reddit-account-holder id="origin" @move="moveFromOrigin($event)"></reddit-account-holder>
      <reddit-account-holder id="target"></reddit-account-holder>
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
          // TODO: real move
          this.$refs.progress.show();
          this.progress.title = 'Moving subreddits...';
          this.progress.current = 0;
          this.progress.total = $event.data.length;

          let intervalID;
          const stepUp = () => {
            this.progress.current++;
            if (this.progress.current >= this.progress.total) {
              this.$refs.progress.hide();
              clearInterval(intervalID);
            }
          };
          intervalID = setInterval(stepUp, 1000);
        }
      }
    },
  }
}
</script>
