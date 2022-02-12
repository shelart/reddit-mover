<template>
  <div :class="{box: true, 'is-ticked': isTicked}">
    <template v-if="value.kind === 't5'">
      <label class="just-wrap subreddit" :for="`checkbox-${value.data.id}`">
        <input type="checkbox"
               v-model="isTicked"
               ref="checkbox"
               :id="`checkbox-${value.data.id}`"
               @change="$emit('change', $event.target.checked)"
        />
        <img :src="value.image" alt="Subreddit's logo"/>
        <article>
          <header>
            <h1>{{value.data.title}}</h1>
            <h2>{{value.data.display_name_prefixed}}</h2>
          </header>
          <p>{{value.data.public_description}}</p>
        </article>
      </label>
    </template>

    <template v-else>
      <p class="invalid-item-type">Not a subreddit.</p>
    </template>
  </div>
</template>

<script>
import EventBus from '../../../event-bus';

export default {
  name: 'subreddit',
  props: {
    value: Object,
  },
  data() {
    return {
      isTicked: false,
    };
  },
  created() {
    EventBus.$on('uncheckSubreddit', this.uncheck);
  },
  destroyed() {
    EventBus.$off('uncheckSubreddit', this.uncheck);
  },
  methods: {
    uncheck(id) {
      if (this.value.data.name === id) {
        //console.log(`On uncheckSubreddit for ${id}`);
        this.$refs.checkbox.checked = false;
        this.isTicked = false;
        //console.log('Emitting change for: ', this.$refs.checkbox);
        this.$emit('change', this.$refs.checkbox.checked);
      }
    },
  },
}
</script>

<style scoped lang="scss">
.subreddit {
  position: relative;
  display: flex;

  > input[type="checkbox"] {
    position: absolute;
    top: 5px;
    left: 5px;
  }

  > img {
    width: 60px;
    display: block;
    margin-right: 10px;
    align-self: center;
  }

  > article {
    > header {
      margin-bottom: 10px;

      > h1 {
        font-weight: bold;
        font-size: 18px;
        margin: 0;
      }

      > h2 {
        font-weight: bold;
        font-size: 16px;
        margin: 0;
      }
    }
  }
}
</style>