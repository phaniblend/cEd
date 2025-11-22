'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="gradient-banner text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
            </div>
            <span className="text-2xl font-bold">cEd</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/dashboard" className="hover:opacity-80 transition">
              Dashboard
            </Link>
            <Link href="/projects" className="hover:opacity-80 transition">
              Projects
            </Link>
            <Link href="/teams" className="hover:opacity-80 transition">
              Teams
            </Link>
            <Link href="/profile" className="hover:opacity-80 transition">
              Profile
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

