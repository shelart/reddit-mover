<template>
  <div>
    <div class="split">
      <div class="col">
        <login-form></login-form>
      </div>
      <div class="col">
        <login-form></login-form>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "./login-form";
export default {
  components: {LoginForm}
}
</script>
