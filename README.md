# Reddit Mover

This project is intended to help you with splitting your Reddit account by
distributing your saved items across different accounts.

## Prepare to run (once)

1. Install [Node.js](https://nodejs.org/) (if not yet).
2. Clone this repo.
3. Being in the root of the repo, run ``npm i``.
4. Go to https://www.reddit.com/prefs/apps and register an app with
   the following parameters:
   - type: **web app**
   - redirect uri: **http://localhost:3000/api/login/callback**
5. Grab the newly registered app's ID and Secret.
6. Create a file named **app-credentials.json** in the root of the repo
   with the content:
```json
{
  "user-agent": "YOUR CUSTOM AGENT NAME/0.1",
  "client-id": "APP ID FROM P.5",
  "client-secret": "APP SECRET FROM P.6"
}
```

## Usage

1. Being in the root of the repo, start the local server with ``npm run build-start``.
2. Open a browser and sign in your *origin* Reddit account
   (from which you are moving items) (if not yet).
3. Go to URL http://localhost:3000/. Reddit Mover page opens.
4. On Reddit Mover page, click "Sign In" on the left panel.
5. A new browser tab opens with Reddit asking to grant access to your app
   (which you have registered on **Prepare to run** section). Grant it.
6. On Reddit Mover left panel you'll see your origin Reddit account.
7. Now make your browser to be signed in your *target* Reddit account
   (to which you are moving items). To do this, you can either:
   - open a new tab with Reddit (not Reddit Mover!), sign out, then
     sign in the target account; or
   - open a private tab, sign in the target account, then open Reddit Mover
     in the same private window (http://localhost:3000/).
8. On Reddit Mover page, click "Sign In" on the right panel.
9. Grant access on behalf of the target Reddit account the same way as
   in p.5.
10. Once both origin and target accounts are displayed in the left and right
   panels, you can start moving.

Currently, you can only move subscriptions and saved posts. More types of
items might be added in the future.

Please note that there is no way to swap panels yet, and the only direction
is origin -> target. So, if you mistook origin and target, you'll have to
sign out Reddit Mover from both and repeat steps 2-9.

## Privacy

If you perform preparation as described above, you'll have the full control
over the app. The only communication will be held between your local browser
and the local server, between the local server and the Reddit API endpoint,
and between your browser and the Reddit web endpoint. I'll gain absolutely
no access credentials to your accounts.

The local server keeps credentials for both Reddit accounts in the root
repo folder, files **user-origin-credentials.json** and
**user-target-credentials.json**. Keep an eye for them and delete them once
not needed anymore.
