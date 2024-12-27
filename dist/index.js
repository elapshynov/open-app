(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.configureOpenApp = configureOpenApp;
    exports.parseUserAgent = parseUserAgent;
    exports.deviceDetect = deviceDetect;
    /**
     *
     * Configure the open-app function
     * @param {Object} options - Scheme and Package options to open mobile app
     * @param {string} options.scheme - URL Scheme to open mobile app
     * @param {string} options.package - Android Package to open on Samsung mobile devices
     * @param {number} options.fallbackTimeout - Timeout in miliseconds to open fallback url. Defaults to 2000 ms
     * @param {string} options.fallbackAndroid - Fallback to open for Android device if app is not installed
     * @param {string} options.fallbackIos - Fallback to open for iOS device if app is not installed
     * @param {string} options.fallbackSamsung - Fallback to open for Samsung device if app is not installed
     * @param {string} options.fallbackDesktop - Fallback to open for Desktop device
     * @return {Function} callback - Open app
     *
     *
     * TEST CASES:
     *
     * location.href : {
     *   ios8: {
     *     INSTALLED: OK
     *     NOT INSTALLED: ALERT ERROR
     *   }
     *   ios9: {
     *    INSTALLED: OK
     *    NOT INSTALLED: ALERT ERROR
     *   }
     *   android: {
     *     INSTALLED: OK
     *     NOT INSTALLED: REDIRECT TO ERROR PAGE
     *   }
     * }
     *
     * iframe: {
     *   ios8: {
     *     INSTALLED: ok
     *     NOT INSTALLED: nothing
     *   }
     *   ios9: {
     *     INSTALLED: nothing
     *     NOT INSTALLED: nothing
     *   }
     *   android: {
     *     INSTALLED: OK
     *     NOT INSTALLED: nothing
     *   }
     * }
     *
     */
    function configureOpenApp(options) {
        // not object type
        if (!options || typeof options !== 'object') {
            options = {};
        }
        if (typeof options.scheme === 'undefined' || !options.scheme) {
            throw new TypeError('Please specify `options.scheme`. It is required to open mobile app');
        }
        var ua = navigator.userAgent;
        var deviceData = deviceDetect(ua);
        // device
        var isAndroid = deviceData.isAndroid;
        var isSamsung = deviceData.isSamsung;
        var isSafari = deviceData.isSafari;
        // version
        var version = parseInt(deviceData.version, 10);
        /**
         * @param  {string} src - URL Scheme to open mobile app
         * @return {void}
         */
        function createIFrame(src) {
            var iframe = document.createElement('iframe');
            iframe.src = src;
            document.body.appendChild(iframe);
            document.body.removeChild(iframe);
        }
        /**
         * Android Intents with Chrome
         * see docs https://developer.chrome.com/multidevice/android/intents
         *
         * intent://
         *  scan/
         *  #Intent;
         *   package=com.google.zxing.client.android;
         *   scheme=meituanmovie;
         * end;
         *
         * @param  {string} url - URL Scheme to open mobile app
         * @param  {string} pkg - Android Package to open on Samsung mobile devices
         * @return {string} intent - Intent to open on Samsung mobile devices
         */
        function buildIntent(url, pkg) {
            var protocol, action = url.replace(/^(\w+):\/\//, function (_, m) {
                protocol = m;
                return '';
            });
            var o = { protocol: protocol, package: pkg };
            var meta = Object.keys(o)
                .map(function (key) {
                return [key, o[key]].join('=');
            })
                .map(function (part) {
                return part + ';';
            })
                .join('');
            // intent string
            return 'intent://' + action + '#Intent;' + meta + 'end;';
        }
        /**
         * Open fallback url
         * @return {void}
         */
        function openFallback() {
            if (isAndroid) {
                if (isSamsung && options.fallbackSamsung) {
                    location.href = options.fallbackSamsung;
                }
                else if (options.fallbackAndroid) {
                    location.href = options.fallbackAndroid;
                }
            }
            else if (isSafari && options.fallbackIos) {
                location.href = options.fallbackIos;
            }
            else if (options.fallbackDesktop) {
                window.open(options.fallbackDesktop, '_blank');
            }
        }
        /**
         * Open app in webpage on mobile device
         * @return {void}
         */
        return function open() {
            /**
             * Android supports to iframe url method (NOT includes SAMSUNG devices they require Intent),
             * iOS9 and later is no longer support iframe url method.
             */
            if (isAndroid || (isSafari && version < 9)) {
                // samsung
                if (isSamsung) {
                    location.href = buildIntent(options.scheme, options.package);
                }
                else {
                    // android and ios version < 9
                    createIFrame(options.scheme);
                }
            }
            else {
                // desktop and ios version 9 or later
                // gives an error prompt if app is not installed
                // `options.fallback` is recommended for this case
                location.href = options.scheme;
            }
            setTimeout(function () {
                openFallback();
            }, options.fallbackTimeout || 2000);
        };
    }
    /**
     * Parse UserAgent string
     *
     * @example
     * const ua = navigator.userAgent
     * const deviceMeta = parseUserAgent(ua)
     * console.log(deviceMeta)
     *
     * @param {string} ua - UserAgent string
     * @returns {Object} data - Device meta data
     * @returns {string} data.type - Device type
     * @returns {string} data.device - Device name
     * @returns {string} data.browser - Browser name
     * @returns {string} data.os - OS name
     * @returns {string} data.version - Browser version
     *
     */
    function parseUserAgent(ua) {
        var type, device, browser, os, version, data = {};
        // get device and type
        if (/(iPhone)/i.test(ua)) {
            type = 'mobile';
            device = 'iphone';
            os = 'ios';
        }
        else if (/(iPad)/i.test(ua) ||
            (/Macintosh/i.test(ua) &&
                navigator.maxTouchPoints &&
                navigator.maxTouchPoints > 1)) {
            type = 'tablet';
            device = 'ipad';
            os = 'macintosh';
        }
        else if (/(iPod)/i.test(ua)) {
            type = 'mobile';
            device = 'ipod';
            os = 'ios';
        }
        else if (/(BlackBerry|BB10)/i.test(ua)) {
            type = 'mobile';
            device = 'blackberry';
        }
        else if (/(Samsung)/i.test(ua)) {
            type = 'mobile';
            device = 'samsung';
            os = 'android';
        }
        else if (/(IEMobile)/i.test(ua)) {
            type = 'mobile';
            device = 'windowsmobile';
            os = 'windowsmobile';
        }
        else if (/(Android)/i.test(ua)) {
            type = 'mobile';
            device = 'android';
            os = 'android';
        }
        else if (/(Macintosh)/i.test(ua)) {
            type = 'desktop';
            device = 'macintosh';
            os = 'macintosh';
        }
        else if (/(Windows)/i.test(ua)) {
            type = 'desktop';
            device = 'windows';
            os = 'windows';
        }
        else if (/(Linux)/i.test(ua)) {
            type = 'desktop';
            device = 'linux';
            os = 'linux';
        }
        // get device type
        if (/Tablet/i.test(ua)) {
            type = 'tablet';
        }
        else if (/Mobile/i.test(ua)) {
            type = 'mobile';
        }
        // get browser
        if (/OPR/i.test(ua) || /Opera/i.test(ua)) {
            browser = 'opera';
        }
        else if (/Chrome/i.test(ua)) {
            browser = 'chrome';
        }
        else if (/Firefox/i.test(ua)) {
            browser = 'firefox';
        }
        else if (/Safari/i.test(ua)) {
            browser = 'safari';
        }
        else if (/MSIE/i.test(ua)) {
            browser = 'ie';
        }
        // get version
        if (/Version\/(\d\.\d)/i.test(ua)) {
            var versionMatch = /Version\/(\d\.\d)/i.exec(ua);
            version = versionMatch[1];
        }
        // create object
        data = {
            type: type,
            device: device,
            browser: browser,
            os: os,
            version: version
        };
        return data;
    }
    /**
     * Device detection
     *
     * @example
     * const ua = navigator.userAgent
     * const deviceMeta = deviceDetect(ua)
     * console.log(deviceMeta)
     *
     * @param {string} ua - UserAgent string
     * @returns {Object} results - Device detection results
     * @returns {boolean} results.isMobile - Is mobile device
     * @returns {boolean} results.isDesktop - Is desktop device
     * @returns {boolean} results.isTablet - Is tablet device
     * @returns {boolean} results.isAndroid - Is Android device
     * @returns {boolean} results.isSamsung - Is Samsung device
     * @returns {boolean} results.isIphone - Is iPhone device
     * @returns {boolean} results.isIpad - Is iPad device
     * @returns {boolean} results.isMac - Is Mac device
     * @returns {boolean} results.isWindows - Is Windows device
     * @returns {boolean} results.isLinux - Is Linux device
     * @returns {boolean} results.isMacOs - Is MacOs device
     * @returns {boolean} results.isIOS - Is iOS device
     * @returns {boolean} results.isChrome - Is Chrome browser
     * @returns {boolean} results.isSafari - Is Safari browser
     * @returns {boolean} results.isIE - Is IE browser
     * @returns {boolean} results.isFirefox - Is Firefox browser
     * @returns {boolean} results.isOpera - Is Opera browser
     * @returns {string} results.version - Browser version
     *
     */
    function deviceDetect(ua) {
        var deviceMeta = parseUserAgent(ua);
        return {
            isDesktop: deviceMeta.type === 'desktop',
            isMobile: deviceMeta.type === 'mobile',
            isTablet: deviceMeta.type === 'tablet',
            isAndroid: deviceMeta.os === 'android',
            isSamsung: deviceMeta.device === 'samsung',
            isIphone: deviceMeta.device === 'iphone',
            isIpad: deviceMeta.device === 'ipad',
            isMac: deviceMeta.os === 'macintosh',
            isWindows: deviceMeta.os === 'windows',
            isLinux: deviceMeta.os === 'linux',
            isMacOs: deviceMeta.os === 'macintosh',
            isIOS: deviceMeta.os === 'ios',
            isChrome: deviceMeta.browser === 'chrome',
            isSafari: deviceMeta.browser === 'safari',
            isIE: deviceMeta.browser === 'ie',
            isFirefox: deviceMeta.browser === 'firefox',
            isOpera: deviceMeta.browser === 'opera',
            version: deviceMeta.version
        };
    }
});
//# sourceMappingURL=index.js.map