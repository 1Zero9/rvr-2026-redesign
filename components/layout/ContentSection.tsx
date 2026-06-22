import type { ReactNode } from 'react';

interface ContentSectionProps {
  children: ReactNode;
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  contentClassName?: string;
  width?: '2xl' | '4xl' | '5xl' | '6xl';
}

const widthClasses = {
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
};

export default function ContentSection({
  children,
  id,
  title,
  description,
  className = '',
  contentClassName = '',
  width = '6xl',
}: ContentSectionProps) {
  return (
    <section id={id} className={className}>
      <div className={`mx-auto px-4 py-10 sm:px-6 lg:py-14 ${widthClasses[width]}`}>
        {(title || description) && (
          <header className="mb-7">
            {title && (
              <h2 className="site-section-heading text-2xl sm:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-zinc-600">
                {description}
              </p>
            )}
          </header>
        )}
        <div className={contentClassName}>{children}</div>
      </div>
    </section>
  );
}
