#nodenv-basic-auth

[![NPM Version][npm-image]][npm-url]
[![Node.js Version][node-version-image]][node-version-url]

**nodenv-basic-auth** extend the package [basic-auth](https://www.npmjs.com/package/basic-auth) with express or connect middleware layer 
and the function to extract user credentials from environment variables.     
To get/set user credentials dynamically is very useful on PaaS platforms like heroku. This give you the ability to 
enable or disable basic-auth and set multiple user credentials without deploy your product for any of these changes.

To add user through environment variable both parameters, username and password, are required. 
By default the prefix for username is `basicauth_user` and for password `basicauth_pass`.    
To add multiple users, add an additional idententication string to parameter name. This additional string 
must be same for username and password. 

Works in Node.js v4+ with the `--harmony` flag, or Node.js v6+ without any flags.

### Example
```shell
export basicauth_user = user1
export basicauth_password = pass1
# add more users
export basicauth_user2 = user2
export basicauth_password2 = pass2
export basicauth_user_mike = mike
export basicauth_password_mike = secret
```

## Install
    $ npm install nodenv-basic-auth
    
## Usage
```js
// Initialize nodenv-basic-auth
var auth = require('nodenv-basic-auth')();

// EITHER use auth on specific routes
app.get('/home', auth, function(req, res) {
 res.send('Hello World');
});

// OR use it site-wide
app.use(auth);
```

## Extend usage
**nodenv-basic-auth** accept 2 parameters on initialisation. First parameter is ```options``` which give you the 
possibility to set environment naming convention for credential.   
The second parameter 'users' transmit user credentials.

## Options
Object properties:    
**userPrefix**    
Environment prefix to identify username.  Default `basicauth_user`
    
**passPrefix**    
Environment postfix to identify password. Default `basicauth_pass`

## Users
Object to transmit user credentials:
```js
var users = {
  mike: 'secret',
  john: 'secret',
  ... 
}
```

# License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/nodenv-basic-auth.svg
[npm-url]: https://npmjs.org/package/nodenv-basic-auth
[node-version-image]: https://img.shields.io/node/v/nodenv-basic-auth.svg
[node-version-url]: http://nodejs.org/download/
