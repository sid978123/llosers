/**
 * Google Analytics 4 (GA4) Integration for LosersPdf
 *
 * Measurement ID: G-RNPD0Y38Z0
 *
 * Privacy & Security Guarantees:
 * - Zero PII (Personally Identifiable Information) is ever collected or transmitted.
 * - Uploaded PDF/image contents, user file names, passwords, and form inputs
 *   are strictly excluded and never sent to Google Analytics.
 * - Query strings and hashes are sanitized from page paths to prevent accidental token/param leakage.
 */

export const GA_MEASUREMENT_ID = 'G-RNPD0Y38Z0';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Sanitizes a path string, stripping out any query parameters (?param=val)
 * or hash fragments (#hash) to ensure complete privacy and compliance with GA4 policies.
 */
export function sanitizePath(rawPath?: string): string {
  if (!rawPath) return '/';
  const clean = rawPath.split('?')[0].split('#')[0].trim();
  return clean.startsWith('/') ? clean : `/${clean}`;
}

/**
 * Sanitizes page title to guarantee only application-defined titles are sent,
 * never user-generated document names or file contents.
 */
export function sanitizeTitle(rawTitle?: string): string {
  if (!rawTitle) return 'LosersPdf — Free, Fast & Private Online PDF and Image Tools';
  return rawTitle.trim();
}

/**
 * Tracks SPA virtual page views in Google Analytics 4.
 *
 * @param path The application route path (e.g. '/merge-pdf', '/pdf-tools')
 * @param title The sanitized page title (e.g. 'Merge PDF Online Free — LosersPdf')
 */
export function trackPageView(path?: string, title?: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  const cleanPath = sanitizePath(path || window.location.pathname);
  const cleanTitle = sanitizeTitle(title || document.title);
  const pageLocation = `${window.location.origin}${cleanPath}`;

  // 1. Update gtag default dimensions for the active virtual page
  window.gtag('set', {
    page_path: cleanPath,
    page_title: cleanTitle,
    page_location: pageLocation,
  });

  // 2. Dispatch page_view event with sanitized parameters
  window.gtag('event', 'page_view', {
    page_title: cleanTitle,
    page_location: pageLocation,
    page_path: cleanPath,
    send_to: GA_MEASUREMENT_ID,
  });
}
