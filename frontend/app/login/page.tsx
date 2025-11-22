"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await api.login({ email, password });
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 px-4">
      <div className="w-full max-w-md card-modern p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-1 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your cEd account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-orange text-white py-3 rounded-lg font-semibold hover:bg-accent-orange-dark transition shadow-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          New here?{" "}
          <Link href="/register" className="text-primary-blue font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
