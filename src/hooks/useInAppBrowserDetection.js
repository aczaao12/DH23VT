import { useState, useEffect } from 'react';

const useInAppBrowserDetection = () => {
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Common in-app browser user agent strings
    const inAppBrowserPatterns = [
      /FBAN/i, /FBAV/i, // Facebook
      /Instagram/i, // Instagram
      /Line/i, // Line
      /Pinterest/i, // Pinterest
      /Snapchat/i, // Snapchat
      /TikTok/i, // TikTok
      /Viber/i, // Viber
      /Zalo/i, // Zalo
      /WeChat/i, // WeChat
      /QQ/i, // QQ
      /Weibo/i, // Weibo
      /Mozilla\/5\.0 \(Linux; Android; [^;]+; wv\) AppleWebKit\/\d+\.\d+ \(KHTML, like Gecko\) Version\/\d+\.\d+ Mobile\/\w+ Safari\/\d+\.\d+/i, // Generic Android WebView
      /wv/i, // Generic Android WebView (simpler check)
      /Safari\/\d+\.\d+\.\d+$/i, // iOS Safari (sometimes indicates in-app if not standalone)
      /CriOS/i, // Chrome on iOS (often in-app)
      /FxiOS/i, // Firefox on iOS (often in-app)
    ];

    const detected = inAppBrowserPatterns.some(pattern => pattern.test(userAgent));

    // Additional checks for iOS webview (often used by in-app browsers)
    // This is more complex and might require specific bridge detection, 
    // but a simple user agent check is a good start.
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
    if (isIOS && !isSafari && !navigator.standalone) {
      // This is a heuristic: if it's iOS, not Safari, and not a PWA, it might be an in-app browser.
      // This is less reliable and can have false positives.
      // For now, we'll rely more on the user agent patterns.
    }

    setIsInAppBrowser(detected);
  }, []);

  return isInAppBrowser;
};

export default useInAppBrowserDetection;
