/**
 * Login Page
 * Email/password authentication with Supabase
 */

"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "~/lib/supabase/client";
import { LockClosedIcon } from "@heroicons/react/24/outline";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Check if user exists in database and their approval status
      const response = await fetch("/api/trpc/auth.getCurrentUser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        setError("Failed to fetch user data");
        setLoading(false);
        return;
      }

      const userData = await response.json();
      const user = userData.result?.data;

      if (!user) {
        setError("User account not found. Please contact support.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Check email verification
      if (!user.emailVerified) {
        router.push("/verify-email");
        return;
      }

      // Check approval status
      if (user.approvalStatus === "pending") {
        router.push("/pending-approval");
        return;
      }

      if (user.approvalStatus === "rejected") {
        router.push("/pending-approval"); // Shows rejection reason
        return;
      }

      if (user.accountStatus !== "active") {
        setError("Your account has been suspended. Please contact support.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Success - redirect to dashboard or intended destination
      const next = searchParams.get("next") ?? "/dashboard";
      router.push(next);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-navy-section flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10">
            <LockClosedIcon className="h-8 w-8 text-brand-red" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access CargoWatch
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Query param error (from auth callback) */}
        {searchParams.get("error") === "auth_error" && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400">
              Authentication error. Please try again.
            </p>
          </div>
        )}

        {/* Login Form */}
        <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                placeholder="you@company.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                placeholder="••••••••"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/reset-password"
                className="text-sm text-brand-red hover:text-brand-red-hover"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-brand-red px-4 py-3 font-semibold text-white hover:bg-brand-red-hover focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-brand-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-brand-red hover:text-brand-red-hover"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <p className="mt-6 text-center text-sm text-gray-400">
          <Link href="/" className="hover:text-white">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen gradient-navy-section flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
