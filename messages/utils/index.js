/**
 * Utlity functions and constants
 */

const restify = require('restify');
const bbPromise = require('bluebird');
const request = require('request-promise').defaults({encoding: null});
const carousel = require('./carousel');
const herocard = require('./herocard');
const phrases = require('./phrases');
const mtlAapi = require('./mtlapi');

// Helper function to request file with Authentication Header
let requestWithToken = function (url, connector) {
    let token = obtainToken(connector);
    return token().then(function (token) {
        return request({
            url: url,
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/octet-stream'
            }
        });
    });
};

// Promise for obtaining JWT Token (requested once)
let obtainToken = function(connector) {
    return bbPromise.promisify(connector.getAccessToken.bind(connector));
};

let checkRequiresToken = function (message) {
    return message.source === 'skype' || message.source === 'msteams';
};

exports.requestWithToken = requestWithToken;
exports.checkRequiresToken = checkRequiresToken;
exports.carousel = carousel;
exports.herocard = herocard;
exports.phrases = phrases;
exports.mtlAapi = mtlAapi;
exports.MAX_DISPLAY_CARDS = 10;