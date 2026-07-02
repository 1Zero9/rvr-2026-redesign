'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#FAF8F5', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '2rem' }}>
        <div>
          <p style={{ fontSize: '6rem', fontWeight: 900, color: '#0B1F3B', lineHeight: 1, margin: 0 }}>500</p>
          <p style={{ fontWeight: 700, color: '#0B1F3B', marginTop: '0.5rem' }}>Something went wrong</p>
          <button
            onClick={reset}
            style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', background: '#C8FC5C', border: '2px solid #0B1F3B', fontWeight: 700, cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
