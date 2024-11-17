// Helper function to get allowed origins based on environment
const getAllowedOrigins = (env: string) => {
  // Base origins that are always allowed
  const baseOrigins = [
    'http://localhost:3000',                    // Local development
    'https://linkp-website.pages.dev'           // Production Pages URL
  ];

  // Preview/Staging specific origins
  const previewOrigins = [
    // Pattern for preview deployments in Pages
    // This matches URLs like: https://my-branch-name.linkp-website.pages.dev
    new RegExp('^https://[\\w-]+\\.linkp-website\\.pages\\.dev$')
  ];

  return {
    baseOrigins,
    previewOrigins
  };
};
