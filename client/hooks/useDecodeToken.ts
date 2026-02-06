import { useEffect, useState } from 'react';



interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export function useDecodeToken() {
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token-datanova")
    
    if (!token) {
      setDecodedToken(null);
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const decoded: DecodedToken = JSON.parse(jsonPayload);
      setDecodedToken(decoded);

      const currentTime = Math.floor(Date.now() / 1000);
      setIsExpired(decoded.exp < currentTime);
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      setDecodedToken(null);
    }
  }, []);

  return { decodedToken, isExpired };
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return null;
  }
}