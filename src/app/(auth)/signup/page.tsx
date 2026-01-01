/**
 * Signup Page
 * Multi-step registration form with role-specific fields
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "~/lib/supabase/client";
import { UserPlusIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

type UserRole = "member" | "driver" | "security" | "law_enforcement";

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  company: string;
  role: UserRole;
  companyRole: string;
  mcNumber: string;
  dotNumber: string;
  badgeNumber: string;
  department: string;
  acceptTerms: boolean;
}

const INITIAL_DATA: SignupData = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  phoneNumber: "",
  company: "",
  role: "member",
  companyRole: "",
  mcNumber: "",
  dotNumber: "",
  badgeNumber: "",
  department: "",
  acceptTerms: false,
};

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFields = (fields: Partial<SignupData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    setError("");

    // Validation for Step 1
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("All fields are required");
        return;
      }
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    // Validation for Step 2
    if (step === 2) {
      if (!formData.fullName || !formData.company) {
        setError("Name and Company are required");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Final validation
    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions");
      setLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      // 1. Create user in Supabase Auth
      // Note: The redirect URL must be whitelisted in Supabase Dashboard:
      // Authentication > URL Configuration > Redirect URLs
      // Add: http://localhost:3000/auth/callback (for development)
      // Add: https://yourdomain.com/auth/callback (for production)
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Create user record in database
      const response = await fetch("/api/create-user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authId: authData.user.id,
          email: formData.email,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber || null,
          company: formData.company,
          role: formData.role,
          companyRole: formData.companyRole || null,
          mcNumber: formData.mcNumber || null,
          dotNumber: formData.dotNumber || null,
          badgeNumber: formData.badgeNumber || null,
          department: formData.department || null,
          approvalStatus: "pending",
          accountStatus: "active",
          emailVerified: false,
          termsAcceptedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        setError("Failed to create user profile. Please contact support.");
        setLoading(false);
        return;
      }

      // Success! Redirect to pending approval page
      router.push("/pending-approval");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-navy-section py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10">
            <UserPlusIcon className="h-8 w-8 text-brand-red" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white">Create Account</h1>
          <p className="mt-2 text-sm text-gray-400">
            Join the CargoWatch community
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    s < step
                      ? "border-green-500 bg-green-500/10 text-green-500"
                      : s === step
                        ? "border-brand-red bg-brand-red/10 text-brand-red"
                        : "border-gray-600 bg-brand-navy text-gray-400"
                  }`}
                >
                  {s < step ? (
                    <CheckCircleIcon className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold">{s}</span>
                  )}
                </div>
                {s < 3 && (
                  <div
                    className={`h-0.5 w-16 ${s < step ? "bg-green-500" : "bg-gray-600"}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center space-x-24 text-xs text-gray-400">
            <span className={step >= 1 ? "text-white" : ""}>Account</span>
            <span className={step >= 2 ? "text-white" : ""}>Personal</span>
            <span className={step >= 3 ? "text-white" : ""}>Verify</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <div className="rounded-lg border border-gray-700 bg-brand-navy-light p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account Credentials */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Account Credentials
                </h2>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFields({ email: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => updateFields({ password: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="Minimum 8 characters"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Must be at least 8 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      updateFields({ confirmPassword: e.target.value })
                    }
                    required
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="Re-enter password"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full rounded-lg bg-brand-red px-4 py-3 font-semibold text-white hover:bg-brand-red-hover focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-brand-navy-light"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Personal & Company Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Personal & Company Information
                </h2>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Full Name <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFields({ fullName: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      updateFields({ phoneNumber: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Company <span className="text-brand-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => updateFields({ company: e.target.value })}
                    required
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                    placeholder="ABC Transport LLC"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Role <span className="text-brand-red">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      updateFields({ role: e.target.value as UserRole })
                    }
                    required
                    className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                  >
                    <option value="member">Member / Industry Professional</option>
                    <option value="driver">Driver / Owner-Operator</option>
                    <option value="security">Security Professional</option>
                    <option value="law_enforcement">Law Enforcement</option>
                  </select>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 rounded-lg border border-gray-600 px-4 py-3 font-semibold text-white hover:bg-brand-navy focus:outline-none"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 rounded-lg bg-brand-red px-4 py-3 font-semibold text-white hover:bg-brand-red-hover focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-brand-navy-light"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Role-Specific Info & Terms */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Additional Information
                </h2>

                {/* Fields for Member/Driver */}
                {(formData.role === "member" || formData.role === "driver") && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Job Title / Role
                      </label>
                      <input
                        type="text"
                        value={formData.companyRole}
                        onChange={(e) =>
                          updateFields({ companyRole: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                        placeholder="Fleet Manager, Owner-Operator, etc."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          MC Number
                        </label>
                        <input
                          type="text"
                          value={formData.mcNumber}
                          onChange={(e) =>
                            updateFields({ mcNumber: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                          placeholder="MC-123456"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          DOT Number
                        </label>
                        <input
                          type="text"
                          value={formData.dotNumber}
                          onChange={(e) =>
                            updateFields({ dotNumber: e.target.value })
                          }
                          className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                          placeholder="DOT-1234567"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Fields for Law Enforcement */}
                {formData.role === "law_enforcement" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Badge Number
                      </label>
                      <input
                        type="text"
                        value={formData.badgeNumber}
                        onChange={(e) =>
                          updateFields({ badgeNumber: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                        placeholder="Badge #12345"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Department / Agency
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) =>
                          updateFields({ department: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                        placeholder="Memphis Police Department"
                      />
                    </div>
                  </>
                )}

                {/* Fields for Security */}
                {formData.role === "security" && (
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Job Title / Role
                    </label>
                    <input
                      type="text"
                      value={formData.companyRole}
                      onChange={(e) =>
                        updateFields({ companyRole: e.target.value })
                      }
                      className="w-full rounded-lg border border-gray-600 bg-brand-navy px-4 py-3 text-white placeholder-gray-400 focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
                      placeholder="Security Manager, Consultant, etc."
                    />
                  </div>
                )}

                {/* Terms & Conditions */}
                <div className="mt-6 rounded-lg border border-gray-700 bg-brand-navy p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={(e) =>
                        updateFields({ acceptTerms: e.target.checked })
                      }
                      className="mt-1 h-4 w-4 rounded border-gray-600 text-brand-red focus:ring-brand-red focus:ring-offset-brand-navy"
                    />
                    <span className="text-sm text-gray-300">
                      I agree to the{" "}
                      <Link href="/terms" className="text-brand-red hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-brand-red hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Admin Approval Notice */}
                <div className="rounded-lg border border-brand-red/20 bg-brand-red/10 p-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold text-brand-red">
                      Admin Approval Required:
                    </span>{" "}
                    Your account will be reviewed by our team within 24-48 hours.
                    You'll receive an email once approved.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 rounded-lg border border-gray-600 px-4 py-3 font-semibold text-white hover:bg-brand-navy focus:outline-none"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-brand-red px-4 py-3 font-semibold text-white hover:bg-brand-red-hover focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 focus:ring-offset-brand-navy-light disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-red hover:text-brand-red-hover"
            >
              Sign in
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
