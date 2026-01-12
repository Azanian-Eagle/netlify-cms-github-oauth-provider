const randomstring = require('randomstring')

module.exports = (oauth2, config) => {
  // Authorization uri definition
  const authorizationUri = oauth2.authorizeURL({
    redirectURI: config.redirect_uri,
    scope: config.scopes || 'repo,user',
    state: randomstring.generate(32)
  })

  return (req, res, next) => {
    res.redirect(authorizationUri)
  }
}
