'use strict';

var basicAuth = require('basic-auth');

class NodeEnvBasicAuth {

    constructor(options, users) {
        // options
        this.options = {
            userPrefix: 'basicauth_user' || options.userPrefix,
            passPrefix: 'basicauth_pass' || options.passPrefix
        };

        this.auth = null;
        this.users = users || {};

        this.dispatchEnv();
    }

    /**
     * Dispatch enviroment variables for user auth credentials
     */
    dispatchEnv() {
        let postpend = '';
        let envKeys = Object.keys(process.env);

        // Process all env keys
        envKeys.forEach(function(key) {
            if (key.indexOf(this.options.userPrefix) === 0) {
                // get postpend
                postpend = key.replace(this.options.userPrefix, '');
                if (envKeys.indexOf(this.options.passPrefix + postpend) > -1) {
                    this.users[process.env[key]] = process.env[this.options.passPrefix + postpend];
                }
            }
        }, this);
    };

    /**
     * Verify user credentials
     * @param username
     * @param password
     * @returns {boolean}
     */
    verifyCredentials(username, password) {
        if (typeof this.users[username] === 'undefined') {
            return false;
        }

        if (this.users[username] === password) {
            return true;
        }

        return false;
    }

    /**
     * Register auth to middleware
     */
    register(req, res, next) {

        // parse auth header
        let credentials = basicAuth(req);

        // verify basic-auth is initiated else return unauthorized
        if (!credentials|| !credentials.name || !credentials.pass) {
            return NodeEnvBasicAuth.unauthorized(res);
        }

        if (this.verifyCredentials(credentials.name, credentials.pass)) {
            return next();
        } else {
            return NodeEnvBasicAuth.unauthorized(res);
        }
    }

    static unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

}

module.exports = function(options, users) {
    var instance = new NodeEnvBasicAuth(options, users);
    return instance.register.bind(instance);
};
