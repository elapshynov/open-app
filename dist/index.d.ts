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
export declare function configureOpenApp(options: {
    scheme: string;
    package: string;
    fallbackTimeout?: number;
    fallbackAndroid?: string;
    fallbackSamsung?: string;
    fallbackIos?: string;
    fallbackDesktop?: string;
}): () => void;
type DevideDetectResult = {
    isMobile?: boolean;
    isDesktop?: boolean;
    isTablet?: boolean;
    isAndroid?: boolean;
    isWindows?: boolean;
    isLinux?: boolean;
    isMacOs?: boolean;
    isIOS?: boolean;
    isChrome?: boolean;
    isSafari?: boolean;
    isIE?: boolean;
    isFirefox?: boolean;
    isOpera?: boolean;
    isIpad?: boolean;
    isIphone?: boolean;
    isMac?: boolean;
    isSamsung?: boolean;
    version?: string;
};
type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'watch' | 'tv' | 'embedded';
type DeviceMeta = {
    type?: DeviceType;
    device?: string;
    version?: string;
    browser?: string;
    os?: string;
};
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
export declare function parseUserAgent(ua: string): DeviceMeta;
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
export declare function deviceDetect(ua: string): DevideDetectResult;
export {};
