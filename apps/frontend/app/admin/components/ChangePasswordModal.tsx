"use client";

import { Eye, EyeOff, KeyRound, X } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onChangePassword: (userId: string, password: string) => Promise<void>;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  user,
  onChangePassword,
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    const requirements = {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecial: /[@$!%*?&#^()_+=\-[\]{}|;:'",.<>/\\`~]/.test(pwd),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    let label = "Very Weak";
    let color = "bg-red-500";

    if (score === 5) {
      label = "Strong";
      color = "bg-green-500";
    } else if (score === 4) {
      label = "Good";
      color = "bg-yellow-500";
    } else if (score === 3) {
      label = "Fair";
      color = "bg-orange-500";
    } else if (score >= 1) {
      label = "Weak";
      color = "bg-red-400";
    }

    return { score, label, color, requirements };
  };

  const passwordStrength = calculatePasswordStrength(password);
  const isPasswordValid = Object.values(passwordStrength.requirements).every(
    Boolean,
  );
  const doPasswordsMatch =
    password === confirmPassword && confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError("Password does not meet all requirements");
      return;
    }

    if (!doPasswordsMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      await onChangePassword(user.id, password);
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      setError("Failed to change password. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <KeyRound className="h-5 w-5 mr-2 text-gray-600" />
              Change User Password
            </h3>
            <button
              onClick={handleClose}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-4">
              {/* User Info */}
              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">
                        Password Strength:
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>

                    {/* Requirements Checklist */}
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Requirements:
                      </p>
                      {[
                        {
                          key: "minLength",
                          label: "At least 8 characters",
                        },
                        {
                          key: "hasUppercase",
                          label: "One uppercase letter",
                        },
                        {
                          key: "hasLowercase",
                          label: "One lowercase letter",
                        },
                        { key: "hasNumber", label: "One number" },
                        {
                          key: "hasSpecial",
                          label: "One special character",
                        },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center text-xs">
                          <span
                            className={`mr-2 ${
                              passwordStrength.requirements[
                                key as keyof typeof passwordStrength.requirements
                              ]
                                ? "text-green-600"
                                : "text-gray-400"
                            }`}
                          >
                            {passwordStrength.requirements[
                              key as keyof typeof passwordStrength.requirements
                            ]
                              ? "✓"
                              : "○"}
                          </span>
                          <span
                            className={
                              passwordStrength.requirements[
                                key as keyof typeof passwordStrength.requirements
                              ]
                                ? "text-gray-700"
                                : "text-gray-500"
                            }
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p
                      className={`mt-1 text-xs ${
                        doPasswordsMatch ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {doPasswordsMatch
                        ? "Passwords match"
                        : "Passwords do not match"}
                    </p>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Warning Message */}
              <div className="mt-4 rounded-md bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This will immediately change the
                  user's password. They will need to use the new password to log
                  in.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting || !isPasswordValid || !doPasswordsMatch}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmitting ? "Changing Password..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
