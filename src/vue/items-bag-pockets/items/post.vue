<template>
  <div :class="{box: true, 'is-ticked': isTicked}">
    <template v-if="value.kind === 't3'">
      <label class="just-wrap post" :for="`checkbox-${value.data.id}`">
        <input v-if="checkable"
               type="checkbox"
               v-model="isTicked"
               ref="checkbox"
               :id="`checkbox-${value.data.id}`"
               @change="$emit('change', $event.target.checked)"
        />
        <article>
          <div class="content">
            <header>
              <h1>{{value.data.title}}</h1>
              <h2>{{value.data.subreddit_name_prefixed}}</h2>
              <h3>{{value.created_human_readable}}</h3>
            </header>
            <p>Type: {{value.data.post_hint}}</p>
            <div v-if="value.selftext_processed"
                 v-html="value.selftext_processed"
            ></div>
          </div>
          <img v-if="value.image"
               :src="value.image"
               alt="Post Preview"
          />
        </article>
      </label>
    </template>

    <template v-else>
      <p class="invalid-item-type">Not a post.</p>
    </template>
  </div>
</template>

<script>
import EventBus from '../../../event-bus';

export default {
  name: 'post',
  props: {
    value: Object,
    checkable: Boolean,
  },
  data() {
    return {
      isTicked: false,
    };
  },
  created() {
    EventBus.$on('checkPost', this.check);
    EventBus.$on('uncheckPost', this.uncheck);
  },
  destroyed() {
    EventBus.$off('checkPost', this.check);
    EventBus.$off('uncheckPost', this.uncheck);
  },
  methods: {
    check(id) {
      if (this.value.data.name === id) {
        this.$refs.checkbox.checked = true;
        this.isTicked = true;
        this.$emit('change', this.$refs.checkbox.checked);
      }
    },
    uncheck(id) {
      if (this.value.data.name === id) {
        this.$refs.checkbox.checked = false;
        this.isTicked = false;
        this.$emit('change', this.$refs.checkbox.checked);
      }
    },
  },
}
</script>

<style scoped>
.post {
  position: relative;
}
.post > input[type="checkbox"] {
  float: left;
  display: block;
  margin: 13px 5px;
  clear: left;
}
.post > article {
  display: flex;
  justify-content: space-between;
}
.post > article > .content > header {
  margin-bottom: 10px;
}
.post > article > .content > header > h1 {
  font-weight: bold;
  font-size: 18px;
  margin: 0;
}
.post > article > .content > header > h2 {
  font-weight: bold;
  font-size: 16px;
  margin: 0;
}
.post > article > .content > header > h3 {
  font-weight: normal;
  font-size: 14px;
  margin: 0;
}
.post > article > img {
  max-width: 60px;
  display: block;
  margin: 0 10px;
  align-self: center;
}
</style>