const simpleOauthModule = require('simple-oauth2')
const authMiddleWareInit = require('./auth.js')
const callbackMiddleWareInit = require('./callback')

module.exports = (config) => {
  // Default values
  const oauthProvider = config.provider || 'github'
  const loginAuthTarget = config.authTarget || '_self'
  const origins = config.origins

  const oauthConfig = {
    client: {
      id: config.clientId,
      secret: config.clientSecret
    },
    auth: {
      tokenHost: config.tokenHost || 'https://github.com',
      tokenPath: config.tokenPath || '/login/oauth/access_token',
      authorizePath: config.authorizePath || '/login/oauth/authorize'
    }
  }

  const oauth2 = new simpleOauthModule.AuthorizationCode(oauthConfig)

  // Pass configuration to factories
  // callback.js expects: provider, client, redirect_uri, origins
  // auth.js expects: redirect_uri, scopes

  const middlewareConfig = {
    provider: oauthProvider,
    client: oauthConfig.client,
    redirect_uri: config.redirectUri,
    origins: origins,
    scopes: config.scopes
  }

  function indexMiddleWare (req, res) {
    res.send(`Hello<br>
      <a href="/auth" target="${loginAuthTarget}">
        Log in with ${oauthProvider.toUpperCase()}
      </a>`)
  }

  return {
    auth: authMiddleWareInit(oauth2, middlewareConfig),
    callback: callbackMiddleWareInit(oauth2, middlewareConfig),
    success: (req, res) => { res.send('') },
    index: indexMiddleWare
  }
}
