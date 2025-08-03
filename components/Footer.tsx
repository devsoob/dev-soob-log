export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full py-3 xs:py-4" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400" aria-label={`Copyright ${year} Dev Soob Log`}>
          © {year} Dev Soob Log. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 