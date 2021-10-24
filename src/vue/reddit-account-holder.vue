<template>
  <div class="col">
    <login-form :id="id" v-model="token"></login-form>
    <items-bag v-if="token !== null" :token="token" @move="moveItems($event)"></items-bag>
  </div>
</template>

<script>
import LoginForm from './login-form';
import ItemsBag from './items-bag';
export default {
  name: 'reddit-account-holder',
  components: {ItemsBag, LoginForm},
  props: {
    id: String,
  },
  data() {
    return {
      token: null,
    }
  },

  methods: {
    moveItems($event) {
      console.log('Move items: ', $event);
      this.$emit('move', $event);
    },
  }
}
</script>

<style scoped>

</style>