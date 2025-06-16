export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full py-3 xs:py-4">
      <div className="px-4 xs:px-5 text-center">
        <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400">
          © {year} Dev Log&apos;s. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 