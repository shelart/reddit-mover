<template>
  <form :id="id">
    <header>
      Reddit Account
      <template v-if="username">({{username}})</template>
      <template v-else-if="typeof username === typeof undefined">(getting username...)</template>
    </header>
    <template v-if="session === null">
      <button v-if="!monitoringIntervalID" type="submit" @click.prevent="signIn">Sign in</button>
      <p v-else>Awaiting login completion...</p>
    </template>
    <template v-else>
      <label>
        <span>Token:</span>
        <input :name="`session-token-${id}`" type="text" v-model="session.access_token" readonly autocomplete="off" />
      </label>
      <label>
        <span>Expires in:</span>
        <input :name="`expires-in-${id}`" type="text" v-model="expires_in" readonly autocomplete="off" />
      </label>
      <button type="submit" @click.prevent="signOut">Sign out</button>
    </template>
  </form>
</template>

<script>
import RedditService from '../reddit-service';

export default {
  name: 'login-form',

  props: {
    id: String,
  },

  data() {
    return {
      monitoringIntervalID: null,
      session: null,
      expires_in: null,
      expiresInIntervalID: null,
      username: null,
    };
  },

  mounted() {
    this.load();
  },

  methods: {
    load() {
      try {
        RedditService.login.load(this.id).then(session => {
          this._processSessionData(session);
          this.getUserName();
        });
      } catch (e) {
        console.warn(e);
      }
    },

    signIn() {
      RedditService.login.init(this.id).then(response => {
        const redirectUrl = response.redirect_url;
        const flowId = response.flow_id;
        window.open(redirectUrl);
        this.monitoringIntervalID = setInterval(() => {
          this.monitorSignIn(flowId);
        }, 1000);
      });
    },

    monitorSignIn(flowId) {
      RedditService.login.sessionForFlow(flowId).then(session => {
        if (session) {
          clearInterval(this.monitoringIntervalID);
          this.monitoringIntervalID = null;

          this._processSessionData(session);

          this.getUserName();
        }
      });
    },

    _processSessionData(session) {
      session.expiry = new Date(session.expires_at);
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
          this.refreshToken();
        }
      }, 1000);

      this.$emit('input', session.access_token);
    },

    getUserName() {
      this.username = undefined;
      RedditService.login.getUserName(this.session.access_token).then(response => {
        this.username = response.data;
        this.$emit('userNameMadeAvailable', this.username);
      });
    },

    signOut() {
      this.username = null;
      this.session = null;
      clearInterval(this.expiresInIntervalID);
      this.expiresInIntervalID = null;
      this.expires_in = null;

      this.$emit('input', null);
    },

    refreshToken() {
      clearInterval(this.expiresInIntervalID);
      this.expiresInIntervalID = null;
      this.expires_in = null;

      RedditService.login.refreshAccessTokenByRefreshToken(this.id, this.session.refresh_token).then(session => {
        this._processSessionData(session);
      });
    },
  }
}
</script>

<style scoped>

</style>