import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { users } from '@repo/db/schema';
import { APIResponse } from '@/lib/types';


export function useUser() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<typeof users | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

     try {
        const response = await fetch('/api/user/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: session.user.email })
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user: ${response.statusText}`);
        }
        const data: APIResponse = await response.json();
         setUser(data.data);
         
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    }

    if (status === 'authenticated') {
      fetchUser();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  return {
    user,
    loading,
    error,
    isAuthenticated: status === 'authenticated'
  };
}