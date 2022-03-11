<template>
  <div class="col">
    <login-form :id="id"
                v-model="token"
                @userNameMadeAvailable="userNameAvailable = true"></login-form>
    <items-bag v-if="token !== null"
               :token="token"
               :user-name-available="userNameAvailable"
               :checkable="checkable"
               @move="moveItems($event)"></items-bag>
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
    checkable: Boolean,
  },
  data() {
    return {
      token: null,
      userNameAvailable: false,
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