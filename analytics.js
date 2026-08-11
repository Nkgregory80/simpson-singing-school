/**
 * Vercel Web Analytics integration
 * This script initializes Vercel Web Analytics for the Simpson Singing School website
 * 
 * For vanilla HTML sites, we use the web analytics script approach.
 * When deployed to Vercel with analytics enabled, this will track page views automatically.
 */

// Initialize Vercel Analytics using the inline script approach
(function() {
  window.va = window.va || function () { 
    (window.vaq = window.vaq || []).push(arguments); 
  };
})();

// Load the Vercel Analytics script
// The actual script URL will be provided by Vercel when analytics is enabled in the dashboard
// For development/testing, this gracefully handles the absence of the script
if (typeof window !== 'undefined') {
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
}
