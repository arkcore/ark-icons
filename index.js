'use strict';

var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');

// templates
var BrowserConfigXML = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'browserconfig.xml.hbs'), 'utf-8'));
var ManifestJSON = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'manifest.json.hbs'), 'utf-8'));
var HTMLDeclaration = Handlebars.compile(fs.readFileSync(path.join(__dirname, 'partial.hbs'), 'utf-8'));

/**
 * Returns compiled android manifest
 * @param {String} path - webserver must serve the file by path + '/manifest.json'
 */
exports.AndroidManifest = function (route) {
    if (typeof route !== 'string') {
        throw new Error('`route` must be specified as first argument');
    }

    var manifest = ManifestJSON({ path: route.replace(/\//g, '\\\\/') });
    return function serveAndroidManifest(req, res, next) {
        res.set('content-type', 'application/json');
        res.send(manifest);
    };
};

/**
 * Returns compiled WP manifest
 * @param {String} path - webserver must serve the file by path + '/browserconfig.xml'
 */
exports.WindowsPhoneConfig = function (route) {
    if (typeof route !== 'string') {
        throw new Error('`route` must be specified as first argument');
    }

    var browserConfig = BrowserConfigXML({ path: route });
    return function serveBrowserConfig(req, res, next) {
        res.set('content-type', 'application/xml');
        res.send(browserConfig);
    }
};

/**
 * Helper that returns path to the images, useful for mounting the folder as a static one
 * @return {String}
 */
exports.iconPath = function () {
    return path.join(__dirname, 'lib');
};

/**
 * Returns compiled html that should be embedded in the <head> section of the markup
 * @param  {String} route - images and manifests must be served by route + '/<image name>'
 * @param  {Object} opts - { apple, android, wp } set one or all options to `false` to disable them
 * @return {String}      - html content to be embedded
 */
exports.htmlDeclaration = function (route, opts) {
    opts = opts || {};

    if (typeof route !== 'string') {
        throw new Error('`path` must be specified as first argument');
    }

    var locals = {
        path: route,
        INCLUDE_APPLE: opts.hasOwnProperty('apple') ? !!opts.apple : true,
        INCLUDE_ANDROID: opts.hasOwnProperty('android') ? !!opts.android : true,
        INCLUDE_WP: opts.hasOwnProperty('wp') ? !!opts.wp : true
    };

    return HTMLDeclaration(locals);
}

/**
 * Initializes icon serving
 * @param  {String} route - mount path
 * @param  {Object} app   - express app
 * @param  {Object} opts  - { apple, android, wp, serve }, for icon options look at the
 *                        htmlDeclaration function, serve
 */
exports.init = function (route, app, opts) {
    opts = opts || {};

    // specify manually
    var express = require('express');
    var iconPath = exports.iconPath();
    var htmlDeclaration = exports.htmlDeclaration(route, opts);
    app.locals.iconDeclaration = htmlDeclaration;

    app.use(route, express.static(iconPath, opts.serve || {}));
    app.get(route + '/manifest.json', exports.AndroidManifest(route));
    app.get(route + '/browserconfig.xml', exports.WindowsPhoneConfig(route));
}
