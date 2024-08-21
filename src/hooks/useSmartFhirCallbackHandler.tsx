import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const useSmartFhirCallbackHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const hasRunRef = useRef(false);

  const exchangeCodeForToken = useCallback(async (code: string) => {
    const tokenEndpoint = localStorage.getItem("tokenEndpoint") || "";
    const clientId = '91360c07-2b70-422b-bf6e-62cbd402f145';
    const redirectUri = `${window.location.origin}/callback`;

    try {
      const response = await axios.post(tokenEndpoint,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          client_id: clientId,
          redirect_uri: redirectUri,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      Object.entries(response.data).forEach(([key, value]) => {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      });

      setDebugInfo(prevDebug => `${prevDebug}\n\nToken Exchange Success:\n${JSON.stringify(response.data, null, 2)}`);
      setLoading(false);

      router.push('/home');
    } catch (error) {
      console.error('Token exchange error:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Failed to exchange code for token: ${error.response.status} ${error.response.statusText}`);
        setDebugInfo(prevDebug => `${prevDebug}\n\nError Response:\n${JSON.stringify(error.response.data, null, 2)}`);
      } else {
        setError(`Failed to exchange code for token: ${error.message}`);
      }
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const handleCallback = async () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = sessionStorage.getItem('authState');

        setDebugInfo(`URL: ${window.location.href}\nCode: ${code}\nState: ${state}\nStored State: ${storedState}`);

        if (state !== storedState) {
          throw new Error('State mismatch. Possible CSRF attack.');
        }

        if (!code) {
          throw new Error('Authorization code is missing from the callback URL.');
        }

        await exchangeCodeForToken(code);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        sessionStorage.removeItem('authState');
        setLoading(false);
      }
    };

    handleCallback();
  }, [exchangeCodeForToken]);

  return { loading, error, debugInfo };
};