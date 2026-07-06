export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // Escape < so DB-sourced strings can't close the script tag
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
