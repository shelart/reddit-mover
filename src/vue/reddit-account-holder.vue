<template>
  <div class="col">
    <login-form :id="id"></login-form>
  </div>
</template>

<script>
import LoginForm from './login-form';
export default {
  name: 'reddit-account-holder',
  components: {LoginForm},
  props: {
    id: String,
  },
}
</script>

<style scoped>

</style>