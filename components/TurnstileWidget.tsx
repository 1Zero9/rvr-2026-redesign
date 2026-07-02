'use client';

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: {
        sitekey: string;
        size: 'invisible';
        callback: (token: string) => void;
        'error-callback': () => void;
        action?: string;
      }) => string;
      reset: (id: string) => void;
    };
  }
}

interface Props {
  onToken: (token: string) => void;
  onError?: () => void;
  action?: string;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';

export default function TurnstileWidget({ onToken, onError, action }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const callbackRef  = useRef(onToken);

  useEffect(() => {
    callbackRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!SITE_KEY || !containerRef.current) return;

    function render() {
      if (!containerRef.current || !window.turnstile) return;
      window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        size: 'invisible',
        callback: (token) => callbackRef.current(token),
        'error-callback': onError ?? (() => {}),
        ...(action ? { action } : {}),
      });
    }

    if (window.turnstile) {
      render();
      return;
    }

    // Load script once, shared across widgets on the page
    const existing = document.querySelector<HTMLScriptElement>('script[data-cf-turnstile]');
    if (existing) {
      existing.addEventListener('load', render);
      return () => existing.removeEventListener('load', render);
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.dataset.cfTurnstile = '1';
    script.onload = render;
    document.head.appendChild(script);
  }, [action, onError]);

  return <div ref={containerRef} />;
}
