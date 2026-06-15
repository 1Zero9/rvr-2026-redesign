'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldAlert, CreditCard } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: string;
  description: string;
  badge: string;
  clubZapUrl: string;
}

export default function ClubZapCheckoutModal() {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const handleOpenCheckout = (url: string) => {
    setSelectedUrl(url);
    setIsModalOpen(true);
  };

  const handleCloseCheckout = () => {
    setIsModalOpen(false);
    setSelectedUrl(null);
  };

  // RVR club product listings (e.g. memberships & summer tournament registrations)
  const products: Product[] = [
    {
      id: 'summer-mini-leagues',
      title: 'Summer Mini Leagues',
      price: '€25',
      description: 'Annual June youth mini-leagues. Open to boys and girls of all skill levels.',
      badge: 'Tournament',
      clubZapUrl: 'https://clubzap.com/example-mini-leagues',
    },
    {
      id: 'youth-membership',
      title: 'Annual Youth Membership',
      price: '€250',
      description: 'Full season registration including weekly league matches, training, and club insurance.',
      badge: 'Season 2026',
      clubZapUrl: 'https://clubzap.com/example-youth-membership',
    },
    {
      id: 'social-membership',
      title: 'Non-Playing Member',
      price: '€140',
      description: 'Support the club as a mentor or community associate member with full club voting rights.',
      badge: 'Associate',
      clubZapUrl: 'https://clubzap.com/example-social-membership',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      
      {/* Grid of Product Cards */}
      <div className="text-center mb-12">
        <h2 className="font-display font-black text-3xl md:text-5xl uppercase italic tracking-tighter text-brand-charcoal">
          Registrations & Memberships
        </h2>
        <div className="h-2 w-32 bg-brand-neon mx-auto mt-4 border-2 border-brand-charcoal -rotate-1"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="brutalist-card p-6 flex flex-col justify-between min-h-[280px] bg-white hover:shadow-brutalist transition-shadow"
          >
            <div>
              <span className="inline-block bg-brand-green text-white font-display font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider mb-4 border-2 border-brand-charcoal">
                {product.badge}
              </span>
              <h3 className="font-display font-black text-2xl text-brand-charcoal uppercase italic leading-tight mb-2">
                {product.title}
              </h3>
              <p className="font-display font-black text-3xl text-brand-green mb-4">
                {product.price}
              </p>
              <p className="font-sans text-sm font-semibold text-zinc-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <button
              onClick={() => handleOpenCheckout(product.clubZapUrl)}
              className="mt-6 w-full btn-brutalist-neon py-3.5 text-center text-xs uppercase font-display font-black tracking-wider bg-brand-neon hover:bg-[#96f431] flex items-center justify-center gap-2"
              aria-label={`Register online for ${product.title}`}
            >
              Register Online
              <CreditCard className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Embedded Iframe Modal */}
      {isModalOpen && selectedUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/40 backdrop-blur-md transition-opacity duration-300"
          onClick={handleCloseCheckout}
        >
          <div
            className="brutalist-card bg-white w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-brutalist animate-bounce-spring"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
          >
            
            {/* Modal Header bar */}
            <div className="bg-brand-charcoal text-white px-6 py-4 flex items-center justify-between border-b-4 border-brand-charcoal">
              <div className="flex items-center gap-2 text-brand-neon">
                <ShieldAlert className="w-5 h-5" />
                <h3 id="checkout-title" className="font-display font-black text-sm uppercase tracking-wider">
                  Secure Checkout Bridge
                </h3>
              </div>
              <button
                onClick={handleCloseCheckout}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors focus:ring-2 focus:ring-brand-neon focus:outline-none"
                aria-label="Close Checkout Modal"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* iOS & Android Scroll-Compliant Iframe Enclosure */}
            <div className="flex-1 w-full bg-zinc-50 relative overflow-y-auto -webkit-overflow-scrolling-touch">
              <iframe
                src={selectedUrl}
                className="w-full h-full border-0 absolute inset-0"
                title="ClubZap Secure Checkout Integration"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                loading="lazy"
              ></iframe>
            </div>

            {/* Modal Footer Safeguard Info */}
            <div className="p-4 bg-brand-cream border-t-4 border-brand-charcoal flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-brand-charcoal">
              <p className="flex items-center gap-1.5">
                <span>🛡️</span> Secure payments processed directly via ClubZap checkout.
              </p>
              <a
                href={selectedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-brand-green-aaa hover:underline focus:ring-2 focus:ring-brand-green-aaa focus:outline-none rounded"
                aria-label="Open payment screen in a new tab"
              >
                Open in New Tab
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
