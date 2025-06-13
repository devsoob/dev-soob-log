export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full py-4">
      <div className="px-5 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {year}. Dev Log all rights reserved.
        </p>
      </div>
    </footer>
  );
} 