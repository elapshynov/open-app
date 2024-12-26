/**
 * Configure the open-app function
 * @param {Object} options - Scheme and Package options to open mobile app
 * @param {string} options.scheme - URL Scheme to open mobile app
 * @param {string} options.package - Android Package to open on Samsung mobile devices
 * @return {Function} callback - Open app
 *
 *
 * TEST CASE:
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
function openApp(options){
  // not object type
  if(!options || typeof options !== 'object'){
    options = {};
  }

  if(typeof options.scheme !== 'undefined'){
    throw new TypeError('Please specify `options.scheme`. It is required to open mobile app');
  }
  
  var ua = navigator.userAgent;
  var isChrome  = /chrome/i.test(ua);
  var isSamsung = /samsung/i.test(ua);
  var os        = ((/iphone|android/i.exec(ua) || [ 'unknow' ])[0]).toLowerCase();
  var version   = parseInt((/version\/(\d\.\d)/i.exec(ua) || [ 0 ])[1], 10);
  
  /**
   * @param  {string} src - URL Scheme to open mobile app
   * @return {void}
   */
  function createIFrame(src = ''){
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
  function buildIntent(url, pkg){
    var scheme, action = url.replace(/^(\w+):\/\//, function(_, m){
      scheme = m;
      return '';
    });
    var o = { scheme: scheme, package: pkg };
    var meta = Object.keys(o).map(function(key){
      return [ key, o[ key ] ].join('=');
    }).map(function(part){
      return part + ';';
    }).join('');

    // intent string
    return 'intent://' + action + '#Intent;' + meta + 'end;';
  };
  /**
   * Open app in webpage on mobile device
   * @return {void}
   */
  return function open(){
    /**
     * android support iframe call scheme (NOT include SAMSUNG devices),
     * iOS9 and later is no longer support iframe call scheme.
     */
    if(os == 'android' || (os == 'iphone' && version < 9)){
      if(isSamsung){
        location.href = buildIntent(
          options.scheme,
          options.package
        );
      }else{
        createIFrame(options.scheme);
      }
    }else{
      // iOS9 and later
      location.href = options.scheme;
    }
  };
};

// expose `openApp` object
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return openApp;
  });
} else if (typeof module === 'object' && module.exports) {
  module.exports = openApp;
} else {
  this.openApp = openApp;
}
