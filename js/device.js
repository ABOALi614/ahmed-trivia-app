/**
 * ====================================================================
 * DEVICE INFO MODULE
 * ====================================================================
 * Turns navigator.userAgent into a short, human-readable summary like
 * "Chrome on Windows" or "Safari on iPhone". This is the same kind of
 * info any website already sees in its server logs — no extra
 * permission is needed and nothing identifying about the specific
 * person is extracted (no IP, no location — see README for why those
 * were intentionally left out of this build).
 * ====================================================================
 */

function detectBrowser(ua) {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Unknown Browser";
}

function detectOS(ua) {
  if (/Windows NT/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua) && !/iPhone|iPad/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Unknown OS";
}

/**
 * @returns {{ browser: string, os: string, summary: string, rawUserAgent: string }}
 */
export function getDeviceInfo() {
  const ua = navigator.userAgent || "";
  const browser = detectBrowser(ua);
  const os = detectOS(ua);

  return {
    browser,
    os,
    summary: `${browser} على ${os}`,
    rawUserAgent: ua,
  };
}
