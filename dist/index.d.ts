/**
 * Source: https://github.com/elapshynov/open-app/blob/master/index.js
 *
 * Configure the open-app function
 * @param {Object} options - Scheme and Package options to open mobile app
 * @param {string} options.scheme - URL Scheme to open mobile app
 * @param {string} options.package - Android Package to open on Samsung mobile devices
 * @param {number} options.fallbackTimeout - Timeout in miliseconds to open fallback url. Defaults to 2000 ms
 * @param {string} options.fallbackAndroid - Fallback to open for Android device if app is not installed
 * @param {string} options.fallbackIos - Fallback to open for iOS device if app is not installed
 * @param {string} options.fallbackSamsung - Fallback to open for Samsung device if app is not installed
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
export declare function configureOpenApp(options: {
    scheme: string;
    package: string;
    fallbackTimeout?: number;
    fallbackAndroid?: string;
    fallbackSamsung?: string;
    fallbackIos?: string;
}): () => void;
//# sourceMappingURL=index.d.ts.map