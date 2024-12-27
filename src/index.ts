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
export function configureOpenApp (options: {
	scheme: string;
	package: string;
	fallbackTimeout?: number;
	fallbackAndroid?: string;
	fallbackSamsung?: string;
	fallbackIos?: string;
	fallbackDesktop?: string;
}): () => void {
	// not object type
	if (!options || typeof options !== 'object') {
		options = {} as any;
	}

	if (typeof options.scheme === 'undefined' || !options.scheme) {
		throw new TypeError('Please specify `options.scheme`. It is required to open mobile app');
	}

	var ua = navigator.userAgent;
	// browsers
	var isChrome = /chrome/i.test(ua);
	var isSafari = /safari/i.test(ua);
	// devices
	var os = (/iphone|android/i.exec(ua) || ['unknow'])[0].toLowerCase();
	var isSamsung = /samsung/i.test(ua);
	var isIphone = os == 'iphone';
	var isAndroid = os == 'android';
	// version
	var version = parseInt(`${(/version\/(\d\.\d)/i.exec(ua) || [0])[1]}`, 10);

	/**
	 * @param  {string} src - URL Scheme to open mobile app
	 * @return {void}
	 */
	function createIFrame (src: string): void {
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
	function buildIntent (url: string, pkg: string): string {
		var protocol,
			action = url.replace(/^(\w+):\/\//, function (_, m) {
				protocol = m;
				return '';
			});
		var o = { protocol: protocol, package: pkg };
		var meta = Object.keys(o)
			.map(function (key) {
				return [key, o[key as 'protocol' | 'package']].join('=');
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
	function openFallback (): void {
		if (isAndroid) {
			if (isSamsung && options.fallbackSamsung) {
				location.href = options.fallbackSamsung;
			} else if (options.fallbackAndroid) {
				location.href = options.fallbackAndroid;
			}
		} else if (isSafari && options.fallbackIos) {
			location.href = options.fallbackIos;
		} else if (options.fallbackDesktop) {
			window.open(options.fallbackDesktop, '_blank');
		}
	}
	/**
	 * Open app in webpage on mobile device
	 * @return {void}
	 */
	return function open (): void {
		/**
		 * Android supports to iframe url method (NOT includes SAMSUNG devices they require Intent),
		 * iOS9 and later is no longer support iframe url method.
		 */
		if (isAndroid || (isSafari && version < 9)) {
			// samsung
			if (isSamsung) {
				location.href = buildIntent(options.scheme, options.package);
			} else {
				// android and ios version < 9
				createIFrame(options.scheme);
			}
		} else {
			// desktop and ios version 9 or later
			// gives an error prompt if app is not installed
			// `options.fallback` is recommended for this case
			location.href = options.scheme;
		}

		setTimeout(() => {
			openFallback();
		}, options.fallbackTimeout || 2000);
	};
}
