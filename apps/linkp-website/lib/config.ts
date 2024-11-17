
// Environment type for better type safety
type Environment = 'development' | 'preview' | 'production';

interface WorkerUrls {
  development: string;
  preview: string;
  production: string;
}

// Worker URLs for different environments
const WORKER_URLS: WorkerUrls = {
  development: 'http://localhost:8787',  // Local development
  preview: 'https://linkp-worker-staging.sayyedabood69.workers.dev',  // Preview deployments
  production: 'https://linkp-worker.sayyedabood69.workers.dev'  // Production
};

/**
 * Determines the current environment based on environment variables
 * CF_PAGES: Set by Cloudflare Pages in deployed environments
 * NEXT_PUBLIC_VERCEL_ENV: Set by Vercel (if you're using Vercel)
 * NODE_ENV: Available in all environments
 */
const getCurrentEnvironment = (): Environment => {
  // Check if we're in Cloudflare Pages preview deployment
  if (process.env.NEXT_PUBLIC_CF_PAGES === '1' && 
      process.env.NEXT_PUBLIC_CF_PAGES_BRANCH !== 'main') {
    return 'preview';
  }
  
  // Check if we're in Cloudflare Pages production deployment
  if (process.env.NEXT_PUBLIC_CF_PAGES === '1' && 
      process.env.NEXT_PUBLIC_CF_PAGES_BRANCH === 'main') {
    return 'production';
  }

  // If NODE_ENV is development, we're in local development
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }

  // Default to production if nothing else matches
  return 'production';
};

/**
 * Gets the appropriate worker URL based on the current environment
 */
export const getWorkerUrl = () => {
  const environment = getCurrentEnvironment();
  console.log('Current environment:', environment);
  return WORKER_URLS[environment];
};