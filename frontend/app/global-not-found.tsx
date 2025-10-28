// global-not-found.tsx

import "./globals.css";
import Link from "next/link";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="h-screen bg-gradient-to-br from-[#0F0F10] to-[#1B1B1E] flex items-center justify-center font-sans">
        <div className="relative text-center px-8 py-10 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl max-w-lg animate-fade-in">
          <h1 className="text-7xl font-extrabold text-white tracking-wider drop-shadow-lg">
            404
          </h1>
          
          <p className="mt-3 text-lg text-gray-300">
            The page you’re looking for cannot be found.
          </p>

          <Link
            href="/"
            className="inline-block mt-6 px-7 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition-all shadow-md"
          >
            Go Back Home
          </Link>

          {/* Accent Glow */}
          <div className="absolute -z-10 inset-0 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-pink-500/20 blur-2xl" />
        </div>
      </body>
    </html>
  );
}
