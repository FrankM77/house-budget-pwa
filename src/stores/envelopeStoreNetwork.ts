// Enhanced online/offline detection with multiple fallback methods
export const checkOnlineStatus = async (): Promise<boolean> => {
  // Quick check: Browser's navigator.onLine
  if (typeof navigator === 'undefined' || !navigator.onLine) {
    console.log('❌ Browser reports offline');
    return false;
  }

  const testConnectivity = async (url: string, options: RequestInit = {}): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal,
        ...options
      });

      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.log(`⚠️ Connectivity test failed for ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  };

  // Test multiple reliable endpoints (try in parallel for speed)
  const connectivityTests = [
    // Primary: HTTP status services (highly reliable)
    testConnectivity('https://httpstat.us/200', { method: 'GET' }),
    testConnectivity('https://httpbin.org/status/200', { method: 'GET' }),

    // Secondary: CDN endpoints (widely accessible)
    testConnectivity('https://www.cloudflare.com/favicon.ico'),
    testConnectivity('https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js'),

    // Tertiary: Firebase connectivity (direct relevance to our app)
    testConnectivity('https://firestore.googleapis.com/v1/projects/house-budget-pwa/databases/(default)/documents'),
    testConnectivity('https://firebase.googleapis.com/v1/projects/house-budget-pwa'),

    // Fallback: Original Google test (for networks that allow it)
    testConnectivity('https://www.google.com/favicon.ico'),
  ];

  console.log('🌐 Testing connectivity with multiple endpoints...');

  // Try tests in parallel, succeed if ANY pass
  try {
    const results = await Promise.allSettled(connectivityTests);

    const successfulTests = results.filter(result =>
      result.status === 'fulfilled' && result.value === true
    ).length;

    const totalTests = results.length;

    if (successfulTests > 0) {
      console.log(`✅ Connectivity confirmed (${successfulTests}/${totalTests} tests passed)`);
      return true;
    } else {
      console.log(`❌ All connectivity tests failed (${totalTests} tests)`);
      return false;
    }
  } catch (error) {
    console.log('❌ Connectivity testing error:', error);
    return false;
  }
};

// Helper: Check if error is network-related
export const isNetworkError = (error: any): boolean => {
  // More comprehensive network error detection
  const errorCode = error?.code?.toLowerCase() || '';
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorName = error?.name?.toLowerCase() || '';

  // Firebase specific error codes
  if (errorCode === 'unavailable' || errorCode === 'cancelled') {
    return true;
  }

  // Network-related message patterns
  if (errorMessage.includes('network') ||
      errorMessage.includes('offline') ||
      errorMessage.includes('disconnected') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('timeout')) {
    return true;
  }

  // Browser network errors
  if (errorMessage.includes('err_internet_disconnected') ||
      errorMessage.includes('err_network_changed') ||
      errorMessage.includes('err_connection_refused')) {
    return true;
  }

  // Check navigator state as fallback
  if (!navigator.onLine) {
    return true;
  }

  // Firebase WebChannel errors often have undefined name/message but are network related
  if (errorName === 'undefined' && errorMessage === 'undefined') {
    return true;
  }

  return false;
};
