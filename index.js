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
   *   schema=meituanmovie;
   * end;
   */
  function buildIntent(url){
    var scheme, action = url.replace(/^(\w+):\/\//, function(_, m){
      scheme = m;
      return '';
    });
    //
    var o = {
     scheme  : scheme,
     package : options.package
    };
    //
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
     * android support iframe call schema (NOT include SAMSUNG devices),
     * iOS9 and later is no longer support iframe call schema.
     */
    if(os == 'android' || (os == 'iphone' && version < 9)){
      if(isSamsung){
        createIFrame(buildIntent(options.schema));
      }else{
        createIFrame(options.schema);
      }
    }else{
      // iOS8 and earlier .
      location.href = options.schema;
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
