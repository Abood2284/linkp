type Environment = 'development' | 'preview' | 'production';

interface WorkerUrls {
  development: string;
  preview: string;
  production: string;
}

// Worker URLs for different environments
const WORKER_URLS: WorkerUrls = {
  development: 'http://localhost:8787',
  preview: 'https://linkp-worker-staging.sayyedabood69.workers.dev',
  production: 'https://linkp-worker.sayyedabood69.workers.dev'
};

/**
 * Get the current branch name from Cloudflare Pages environment
 */
const getCurrentBranch = (): string | undefined => {
  return process.env.NEXT_PUBLIC_CF_PAGES_BRANCH;
};

/**
 * Check if we're in a preview deployment
 */
const isPreviewDeployment = (): boolean => {
  const branch = getCurrentBranch();
  return process.env.NEXT_PUBLIC_CF_PAGES === '1' && branch !== 'main' && branch !== undefined;
};

/**
 * Determines the current environment based on environment variables
 */
const getCurrentEnvironment = (): Environment => {
  // Preview deployment check
  if (isPreviewDeployment()) {
    return 'preview';
  }
  
  // Production deployment check (Cloudflare Pages)
  if (process.env.NEXT_PUBLIC_CF_PAGES === '1' && getCurrentBranch() === 'main') {
    return 'production';
  }
  
  // Local development check
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }
  
  // Default to production
  return 'production';
};

/**
 * Gets the appropriate worker URL based on the current environment
 * with error handling and logging
 */
export const getWorkerUrl = (): string => {
  try {
    const environment = getCurrentEnvironment();
    const url = WORKER_URLS[environment];
    
    // Log environment info in development
    if (process.env.NODE_ENV === 'development') {
      console.log({
        environment,
        workerUrl: url,
        branch: getCurrentBranch(),
        isPreview: isPreviewDeployment(),
      });
    }
    
    return url;
  } catch (error) {
    console.error('Error getting worker URL:', error);
    // Fallback to production URL
    return WORKER_URLS.production;
  }
};

/**
 * Utility function to check if the current environment is a specific type
 */
export const isEnvironment = (env: Environment): boolean => {
  return getCurrentEnvironment() === env;
};

/**
 * Get current deployment information
 */
export const getDeploymentInfo = () => {
  return {
    environment: getCurrentEnvironment(),
    branch: getCurrentBranch(),
    isPreview: isPreviewDeployment(),
    workerUrl: getWorkerUrl(),
  };
};