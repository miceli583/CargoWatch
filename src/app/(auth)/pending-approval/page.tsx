/**
 * Pending Approval Page
 * Shown to users waiting for admin approval
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "~/lib/supabase/client";
import {
  ClockIcon,
  XCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface UserStatus {
  approvalStatus: string;
  emailVerified: boolean;
  accountStatus: string;
  rejectionReason: string | null;
  fullName: string;
  email: string;
  company: string | null;
  role: string;
}

export default function PendingApprovalPage() {
  const router = useRouter();
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserStatus() {
      try {
        const response = await fetch("/api/trpc/auth.getCurrentUser");
        if (!response.ok) {
          router.push("/login");
          return;
        }

        const data = await response.json();
        const user = data.result?.data;

        if (!user) {
          router.push("/login");
          return;
        }

        // If approved, redirect to dashboard
        if (user.approvalStatus === "approved" && user.accountStatus === "active") {
          router.push("/dashboard");
          return;
        }

        setUserStatus(user);
        setLoading(false);
      } catch (error) {
        router.push("/login");
      }
    }

    void fetchUserStatus();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-navy-section flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const isPending = userStatus?.approvalStatus === "pending";
  const isRejected = userStatus?.approvalStatus === "rejected";

  return (
    <div className="min-h-screen gradient-navy-section flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Icon */}
        <div className="text-center mb-8">
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
              isPending
                ? "bg-yellow-500/10 border-2 border-yellow-500/20"
                : "bg-red-500/10 border-2 border-red-500/20"
            }`}
          >
            {isPending ? (
              <ClockIcon className="h-10 w-10 text-yellow-500" />
            ) : (
              <XCircleIcon className="h-10 w-10 text-red-500" />
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-8">
          {isPending && (
            <>
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                Account Pending Approval
              </h1>
              <p className="text-center text-gray-300 mb-8">
                Your CargoWatch account is currently under review by our team.
              </p>

              {/* User Info */}
              <div className="rounded-lg border border-gray-700 bg-brand-navy p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span className="text-white font-medium">
                      {userStatus?.fullName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white font-medium">
                      {userStatus?.email}
                    </span>
                  </div>
                  {userStatus?.company && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Company:</span>
                      <span className="text-white font-medium">
                        {userStatus.company}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white font-medium capitalize">
                      {userStatus?.role.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-500">
                      Pending Review
                    </span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-lg border border-gray-700 bg-brand-navy p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  What's Next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        Account Created
                      </div>
                      <div className="text-sm text-gray-400">
                        You've successfully signed up
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                    <div>
                      <div className="text-white font-medium">
                        Admin Review (Current Step)
                      </div>
                      <div className="text-sm text-gray-400">
                        Our team is verifying your credentials
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-600 flex items-center justify-center">
                      <div className="text-gray-600 text-xs">3</div>
                    </div>
                    <div>
                      <div className="text-gray-400 font-medium">
                        Access Granted
                      </div>
                      <div className="text-sm text-gray-500">
                        You'll receive an email confirmation
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="rounded-lg border border-brand-red/20 bg-brand-red/10 p-4 mb-6">
                <p className="text-sm text-gray-300 text-center">
                  <span className="font-semibold text-white">Estimated Time:</span>{" "}
                  24-48 hours
                </p>
                <p className="text-xs text-gray-400 text-center mt-1">
                  You'll receive an email at <strong>{userStatus?.email}</strong>{" "}
                  once your account is approved
                </p>
              </div>

              {/* Contact Info */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-400">
                  For urgent requests, contact us at{" "}
                  <a
                    href="mailto:support@cargowatch.com"
                    className="text-brand-red hover:underline"
                  >
                    support@cargowatch.com
                  </a>
                </p>
              </div>
            </>
          )}

          {isRejected && (
            <>
              <h1 className="text-2xl font-bold text-white text-center mb-4">
                Application Not Approved
              </h1>
              <p className="text-center text-gray-300 mb-6">
                Unfortunately, your CargoWatch account application was not approved.
              </p>

              {userStatus?.rejectionReason && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 mb-6">
                  <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-2">
                    Reason
                  </h3>
                  <p className="text-white">{userStatus.rejectionReason}</p>
                </div>
              )}

              <div className="rounded-lg border border-gray-700 bg-brand-navy p-6 mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  What You Can Do
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-brand-red">•</span>
                    <span>
                      Review the reason for rejection and ensure your information
                      meets our requirements
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-brand-red">•</span>
                    <span>
                      Contact our support team at{" "}
                      <a
                        href="mailto:support@cargowatch.com"
                        className="text-brand-red hover:underline"
                      >
                        support@cargowatch.com
                      </a>{" "}
                      for clarification
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-brand-red">•</span>
                    <span>Create a new account with correct information</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full rounded-lg border border-gray-600 px-4 py-3 font-semibold text-white hover:bg-brand-navy focus:outline-none flex items-center justify-center space-x-2"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Back to Home */}
        <p className="mt-6 text-center text-sm text-gray-400">
          <a href="/" className="hover:text-white">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
