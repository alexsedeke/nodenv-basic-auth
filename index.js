'use strict';

var _ = require('lodash');
var basicAuth = require('basic-auth');

class NodenvBasicAuth {

    constructor(options, users) {
        // options
        this.options = {
            userPrefix: 'basicauth_user',
            passPrefix: 'basicauth_pass'
        };

        this.auth = null;
        this.users = {};

        // merge users if predefined exist
        if (typeof users === 'object') {
            _.merge(this.users, users);
        }

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
        });
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
        // use only if username and password is set as env variable
        if (_.isUndefined(process.env.basicauth_name) ||  _.isUndefined(process.env.basicauth_pass)) {
            return next();
        }

        // init basic auth if not already done
        if (this.auth === null) {
            this.auth = basicAuth(req);
        }

        // verify basic-auth is initiated else return unauthorized
        if (!this.auth || !this.auth.name || !this.auth.pass) {
            return this.unauthorized(res);
        }

        if (this.verifyCredentials(this.auth.name, this.auth.pass)) {
            return next();
        } else {
            return this.unauthorized(res);
        }
    }

    static unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    }

}

module.exports = NodeEnvBasicAuth;
