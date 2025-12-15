"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@seapunk/ui";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword, updateProfile } from "../actions";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export function SecuritySection() {
  const { user, updateUser } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [emailData, setEmailData] = useState({
    email: user?.email || "",
    currentPassword: "",
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: typeof passwordData) => {
      if (!user?.id) throw new Error("User not authenticated");
      return changePassword(user.id, data);
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "" });
    },
    onError: (error: Error) => {
      toast.error(`Failed to change password: ${error.message}`);
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: (data: typeof emailData) => {
      if (!user?.id) throw new Error("User not authenticated");
      return updateProfile(user.id, {
        email: data.email,
        currentPassword: data.currentPassword,
      });
    },
    onSuccess: (data) => {
      updateUser(data);
      toast.success("Email updated successfully");
      setEmailData({ ...emailData, currentPassword: "" });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update email: ${error.message}`);
    },
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) {
      return { score: 0, label: "No password", color: "bg-gray-300" };
    }

    let score = 0;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) {
      return { score, label: "Weak", color: "bg-red-500" };
    } else if (score <= 4) {
      return { score, label: "Fair", color: "bg-orange-500" };
    } else if (score <= 5) {
      return { score, label: "Good", color: "bg-yellow-500" };
    } else {
      return { score, label: "Strong", color: "bg-green-500" };
    }
  };

  const passwordStrength = calculatePasswordStrength(passwordData.newPassword);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    changePasswordMutation.mutate(passwordData);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailData.email === user?.email) {
      toast.error("New email must be different from current email");
      return;
    }
    updateEmailMutation.mutate(emailData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your password and email settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Change Section */}
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Change Password</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Enter current password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter new password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Password Strength Indicator */}
            {passwordData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Password strength:
                  </span>
                  <span
                    className={`font-medium ${
                      passwordStrength.score <= 2
                        ? "text-red-500"
                        : passwordStrength.score <= 4
                          ? "text-orange-500"
                          : passwordStrength.score <= 5
                            ? "text-yellow-500"
                            : "text-green-500"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Use at least 8 characters with a mix of uppercase, lowercase,
                  numbers, and symbols.
                </p>
              </div>
            )}
          </div>

          <Button type="submit" disabled={changePasswordMutation.isPending}>
            {changePasswordMutation.isPending
              ? "Changing..."
              : "Change Password"}
          </Button>
        </form>

        <Separator />

        {/* Email Change Section */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Change Email</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newEmail">New Email Address</Label>
            <Input
              id="newEmail"
              type="email"
              value={emailData.email}
              onChange={(e) =>
                setEmailData({ ...emailData, email: e.target.value })
              }
              placeholder="Enter new email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailPassword">Current Password</Label>
            <Input
              id="emailPassword"
              type="password"
              value={emailData.currentPassword}
              onChange={(e) =>
                setEmailData({ ...emailData, currentPassword: e.target.value })
              }
              placeholder="Confirm with your password"
              required
            />
            <p className="text-xs text-muted-foreground">
              For security, please confirm your password to change your email.
            </p>
          </div>

          <Button
            type="submit"
            disabled={
              updateEmailMutation.isPending || emailData.email === user?.email
            }
          >
            {updateEmailMutation.isPending ? "Updating..." : "Update Email"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
