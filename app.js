require('dotenv').config({ silent: true })
const express = require('express')
const createMiddleware = require('./index.js')
const port = process.env.PORT || 3000

const config = {
  clientId: process.env.OAUTH_CLIENT_ID,
  clientSecret: process.env.OAUTH_CLIENT_SECRET,
  tokenHost: process.env.GIT_HOSTNAME,
  tokenPath: process.env.OAUTH_TOKEN_PATH,
  authorizePath: process.env.OAUTH_AUTHORIZE_PATH,
  redirectUri: process.env.REDIRECT_URL,
  scopes: process.env.SCOPES,
  provider: process.env.OAUTH_PROVIDER,
  authTarget: process.env.AUTH_TARGET,
  origins: process.env.ORIGINS
}

const middleWarez = createMiddleware(config)

const app = express()

// Initial page redirecting to Github
app.get('/auth', middleWarez.auth)

// Callback service parsing the authorization token
// and asking for the access token
app.get('/callback', middleWarez.callback)

app.get('/success', middleWarez.success)
app.get('/', middleWarez.index)

app.listen(port, () => {
  console.log("Netlify CMS OAuth provider listening on port " + port)
})
