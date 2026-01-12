const generateScript = require('./login_script.js')

module.exports = (oauth2, config) => {
  const { provider, client, redirect_uri, origins } = config

  function callbackMiddleWare (req, res, next) {
    const code = req.query.code
    var options = {
      code: code
    }

    if (provider === 'gitlab') {
      options.client_id = client.id
      options.client_secret = client.secret
      options.grant_type = 'authorization_code'
      options.redirect_uri = redirect_uri
    }

    oauth2.getToken(options)
      .then(result => {
        const token = oauth2.createToken(result)
        content = {
          token: token.token.token.access_token,
          provider: provider
        }
        return { message: 'success', content }
      })
      .catch(error => {
        console.error('Access Token Error', error.message)
        return { message: 'error', content: JSON.stringify(error) }
      })
      .then(result => {
        const script = generateScript(provider, result.message, result.content, origins)
        return res.send(script)
      })
  }
  return callbackMiddleWare
}
