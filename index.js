/**
 * [openApp description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
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
 *
 *   }
 * }
 *
 */
function openApp(options){
  
  if(typeof options === 'undefined'){
    options = {};
  }
  if(typeof options.schema !== 'undefined'){
    throw new TypeError('Are you typo? do you want `options.schema` ?');
  }
  
  var ua = navigator.userAgent;
  var isChrome  = /chrome/i.test(ua);
  var isSamsung = /samsung/i.test(ua);
  var os        = ((/iphone|android/i.exec(ua) || [ 'unknow' ])[0]).toLowerCase();
  var version   = parseInt((/version\/(\d\.\d)/i.exec(ua) || [ 0 ])[1], 10);
  
  /**
   * [createIFrame description]
   * @param  {[type]} src [description]
   * @return {[type]}     [description]
   */
  function createIFrame(src){
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
   */
  function buildIntent(url, pkg){
    var scheme, action = url.replace(/^(\w+):\/\//, function(_, m){
      scheme = m;
      return '';
    });
    var o = { scheme  : scheme, package : pkg };
    var meta = Object.keys(o).map(function(key){
      return [ key, o[ key ] ].join('=');
    }).map(function(part){
      return part + ';';
    }).join('');
    //
    return 'intent://' + action + '#Intent;' + meta + 'end;';
  };
  /**
   * [open description]
   * @return {[type]} [description]
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
      // iOS8 and earlier .
      location.href = options.scheme;
    }
  };
};

// expose `openApp` object
if (typeof define === 'function' && define.amd) {
  define([], function() {
    return openApp;
  });
} else if (typeof module && module.exports) {
  module.exports = openApp;
} else {
  this.openApp = openApp;
}
