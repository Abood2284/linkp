import { users } from '@repo/db/schema';

export type APIResponse = {
  status: 'success' | 'error';
  data?: any;
  
};
