/**
 * Profile Client Component
 * Client-side profile editing functionality
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "~/server/db/schema";
import {
  UserCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { createClient } from "~/lib/supabase/client";

interface ProfileClientProps {
  user: User;
}

export function ProfileClient({ user }: ProfileClientProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: user.fullName,
    phoneNumber: user.phoneNumber ?? "",
    company: user.company ?? "",
    companyRole: user.companyRole ?? "",
    bio: user.bio ?? "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    notificationsEnabled: user.notificationsEnabled,
    emailAlertsEnabled: user.emailAlertsEnabled,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("/api/trpc/auth.updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/trpc/auth.updateNotificationPreferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationSettings),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update notification settings");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update notification settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen gradient-navy-reverse py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
          <p className="mt-2 text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-lg bg-green-500/10 border border-green-500/20 p-4 flex items-center space-x-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-400">Changes saved successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Account Status Card */}
          <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Account Status</h2>
              <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                Approved
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-gray-400">Email</div>
                <div className="text-white">{user.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Role</div>
                <div className="text-white capitalize">
                  {user.role.replace("_", " ")}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Member Since</div>
                <div className="text-white">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Last Login</div>
                <div className="text-white">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleDateString()
                    : "Never"}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Card */}
          <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <UserCircleIcon className="h-6 w-6" />
                <span>Personal Information</span>
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-brand-red hover:text-brand-red-hover"
                >
                  Edit
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-2 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                ) : (
                  <div className="text-white">{user.fullName}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-2 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                ) : (
                  <div className="text-white">
                    {user.phoneNumber || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Company
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-2 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                ) : (
                  <div className="text-white">{user.company || "Not provided"}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Job Title / Role
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.companyRole}
                    onChange={(e) =>
                      setFormData({ ...formData, companyRole: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-2 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  />
                ) : (
                  <div className="text-white">
                    {user.companyRole || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Bio
                </label>
                {editing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-2 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="text-white">{user.bio || "Not provided"}</div>
                )}
              </div>

              {editing && (
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        fullName: user.fullName,
                        phoneNumber: user.phoneNumber ?? "",
                        company: user.company ?? "",
                        companyRole: user.companyRole ?? "",
                        bio: user.bio ?? "",
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-600 px-4 py-2 font-semibold text-white hover:bg-brand-navy"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex-1 rounded-lg bg-brand-red px-4 py-2 font-semibold text-white hover:bg-brand-red-hover disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notification Preferences Card */}
          <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
              <BellIcon className="h-6 w-6" />
              <span>Notification Preferences</span>
            </h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-white font-medium">
                    Push Notifications
                  </div>
                  <div className="text-sm text-gray-400">
                    Receive in-app notifications for new incidents in your region
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.notificationsEnabled}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      notificationsEnabled: e.target.checked,
                    })
                  }
                  className="h-5 w-5 rounded border-gray-600 text-brand-red focus:ring-brand-red focus:ring-offset-brand-navy-light"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-white font-medium">Email Alerts</div>
                  <div className="text-sm text-gray-400">
                    Receive email notifications for critical incidents
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationSettings.emailAlertsEnabled}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailAlertsEnabled: e.target.checked,
                    })
                  }
                  className="h-5 w-5 rounded border-gray-600 text-brand-red focus:ring-brand-red focus:ring-offset-brand-navy-light"
                />
              </label>

              <button
                onClick={handleSaveNotifications}
                disabled={loading}
                className="w-full rounded-lg bg-brand-red px-4 py-2 font-semibold text-white hover:bg-brand-red-hover disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-6">
            <button
              onClick={handleLogout}
              className="w-full rounded-lg border border-gray-600 px-4 py-3 font-semibold text-white hover:bg-brand-navy flex items-center justify-center space-x-2"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
