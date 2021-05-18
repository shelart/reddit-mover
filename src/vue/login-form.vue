<template>
  <form>
    <header>Reddit Account</header>
    <template v-if="session == null">
      <label>
        <span>Login:</span>
        <input type="text" v-model="login" />
      </label>
      <label>
        <span>Password:</span>
        <input type="password" v-model="password" />
      </label>
      <button type="submit" @click.prevent="signIn">Sign in</button>
    </template>
    <template v-else>
      <label>
        <span>Token:</span>
        <input type="text" v-model="session.token" readonly />
      </label>
      <label>
        <span>Expires in:</span>
        <input type="text" v-model="expires_in" readonly />
      </label>
      <button type="submit" @click.prevent="signOut">Sign out</button>
    </template>
  </form>
</template>

<script>
import RedditService from '../reddit-service';

export default {
  name: 'login-form',

  data() {
    return {
      session: null,
      login: "",
      password: "",
      expires_in: null,
      expiresInIntervalID: null,
    };
  },

  methods: {
    signIn() {
      RedditService.signIn(this.login, this.password).then(session => {
        console.log('Logged in. Session: ');
        console.log(session);
        session.expiry = new Date(session.expiry);
        this.session = session;

        this.expiresInIntervalID = setInterval(() => {
          const leftSecondsOverall = Math.floor((this.session.expiry.getTime() - (new Date().getTime())) / 1000);
          const leftHours = Math.floor(leftSecondsOverall / 3600);
          const leftMinutes = Math.floor((leftSecondsOverall - leftHours * 3600) / 60);
          const leftSeconds = leftSecondsOverall - leftHours * 3600 - leftMinutes * 60;

          this.expires_in = leftHours.toString().padStart(2, '0') +
              ':' + leftMinutes.toString().padStart(2, '0') +
              ':' + leftSeconds.toString().padStart(2, '0');

          if (leftSecondsOverall < 0) {
            this.signOut();
          }
        }, 1000);
      });
    },

    signOut() {
      this.session = null;
      clearInterval(this.expiresInIntervalID);
      this.expiresInIntervalID = null;
      this.expires_in = null;
    },
  }
}
</script>

<style scoped>

</style>